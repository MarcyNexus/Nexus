# Roles, Security & Data Model — Proposed Design

← [back to overview](./00-overview.md)

**Status: design finalized, migration written, not yet applied.** The
session/cookie plumbing in "Session handling" below is built and live. The
schema itself is now a real migration file —
[07-database-schema.md](./07-database-schema.md) documents it table-by-table —
but nobody has run `supabase db push` yet, so none of these tables exist on the
hosted project. The current homepage ([01-web-app.md](./01-web-app.md)) is
still static marketing content with no login.

## Why TypeScript end-to-end, not Python or Java

This came up as an explicit question: would the platform be better built in Python,
Java, or something else, given that security and data storage are top priorities?

**No — stay on TypeScript across web, mobile, and any future backend service.**
Security and data integrity come from *architecture* — Postgres access control,
authentication, encryption — not from the language calling into it. Postgres Row
Level Security and Supabase Auth enforce the exact same guarantees regardless of
whether the caller is written in TypeScript, Python, or Java. What language choice
actually affects is how much there is to maintain:

- The repo already shares one language and one `packages/shared` client factory
  across web and mobile (see [03-shared-package.md](./03-shared-package.md)).
  Introducing a second language for a backend service would mean a second type
  system, a second Supabase client, and manually keeping data shapes in sync —
  overhead with no security upside.
- If Next.js Route Handlers / Server Actions ever stop being enough (heavy
  background jobs, batch imports from a partner's ATS, scheduled reports), the
  next step is a small **Node/TypeScript** service, not a language switch — same
  runtime, same generated database types, one less context switch for whoever
  maintains it.
- Python would earn its place if the project later does real ML/data-science work
  (e.g. outcome prediction models). Java would earn its place if this were already
  a Java shop hiring Java engineers. Neither applies today.

## Security model: enforce access in the database, not just the UI

The core principle: **Postgres Row Level Security (RLS) is the real security
boundary — app-side role checks are only UX.** A bug in a page's logic (forgetting
a check, a stale cache) can't leak another role's data if the database itself
refuses the query. Concretely:

1. Supabase Auth issues a JWT on login (email/password, magic link, or OAuth).
2. A Postgres function / Supabase Auth Hook embeds the user's role(s) as a custom
   claim on that JWT.
3. Every table carries an RLS policy that checks `auth.uid()` and/or
   `auth.jwt() ->> 'role'` — never a table with RLS off relying on the app to
   "remember" to filter.
4. The Supabase **secret key** (full RLS bypass — see
   [04-supabase-backend.md](./04-supabase-backend.md)) is only ever used
   server-side (a trusted Route Handler, an admin script). It never ships to a
   client bundle.
5. Every write to a sensitive table is mirrored into an `audit_log` row. This
   matters specifically because Marcy handles fellow demographic and financial
   data for a tuition-free, equity-focused program — funders and compliance
   reviews will eventually ask "who accessed what, and when."

## Roles

| Role | Who | Scope |
|---|---|---|
| `admin` | Developers / owners | Full system access, including schema and user management |
| `leadership` | Leadership team | Org-wide read access and reporting across all cohorts, partnerships, and outcomes |
| `partnerships_team` | Internal staff who manage partner relationships | Full CRUD on `organizations` and `partnerships`; read access to fellow/alumni data needed for matching |
| `teacher` | Instructors | Read/write on their cohort's fellows, curriculum, and capstone reviews |
| `fellow` | Current fellows | Read/write on their own profile, program materials, and capstone submissions only |
| `alumni` | Graduates | Read/write on their own profile; read access to the alumni directory and job board |
| `partner` | External partner-org contact (hiring manager, funder rep) | Read-only, scoped to **their own organization's** data — the demo showcase, applicable fellows, job postings |

`partner` and `partnerships_team` are deliberately separate: one is an external
guest with a narrow, org-scoped view; the other is internal staff who manages the
relationship and can see across all organizations. Collapsing them into one role
would either over-expose internal data to a partner or under-power the
partnerships team.

A person can hold more than one role at once — an alum who comes back to teach
keeps their `alumni` role and gains `teacher` rather than losing history — which is
why roles live in their own join table instead of a single column on the profile.

## Schema

```
auth.users                 — Supabase-managed (id, email, password/OAuth identities)
        │
profiles                   — id (= auth.users.id), full_name, avatar_url, created_at
        │
user_roles                 — user_id, role  (enum above)
        │                     one user can have multiple rows
        │
cohorts                    — id, name, start_date, end_date
fellow_profiles            — user_id, cohort_id, status (active | graduated | withdrawn)
alumni_profiles            — user_id, cohort_id, current_company, current_title, linkedin_url

organizations              — id, name, type (hiring_partner | funder | vendor)
partnerships               — id, organization_id, owned_by (→ partnerships_team user),
                              type, status, start_date        ← internal CRM record
partner_contacts           — user_id, organization_id, title  ← the external login,
                                                                  scoped to their own org only

audit_log                  — id, user_id, action, table_name, row_id, at
```

Notes on the split:

- **`partnerships` vs. `partner_contacts`** — `partnerships` is the internal CRM
  record (owned by a `partnerships_team` member, tracks status/type/history).
  `partner_contacts` is the actual external login, linked to one `organization_id`.
  A `partner`'s RLS policies scope every query to `organization_id = their org`;
  `partnerships_team` and `admin` see across all organizations.
- **`fellow_profiles` vs. `alumni_profiles`** — kept as separate tables (both
  keyed on `user_id`, both pointing at `cohorts`) rather than one table with a
  status flag, because the two have almost entirely different columns (program
  progress vs. career outcomes) and different RLS policies (a fellow can edit
  their own submissions; an alum's directory entry is closer to read-mostly).

## Example RLS policy

```sql
create policy "fellows see own record, staff see all"
  on fellow_profiles for select
  using (
    auth.uid() = user_id
    or auth.jwt() ->> 'role' in ('admin', 'teacher', 'leadership')
  );

create policy "partners see only their own org"
  on partnerships for select
  using (
    auth.jwt() ->> 'role' in ('admin', 'partnerships_team', 'leadership')
    or organization_id = (
      select organization_id from partner_contacts where user_id = auth.uid()
    )
  );
```

## Session handling: cookies, not `localStorage` — already built

Directly relevant to enforcing the above: **page-level gating** (hiding `/admin`
from anyone but `admin`/`leadership`, before the page even renders) has to happen
in Next.js's server-side `proxy.ts` (see below) — which cannot read
`localStorage`, since that only exists in the browser.

Unlike the rest of this doc, this part is **already implemented**, ahead of the
roles/RLS work it exists to support: `apps/web` uses `@supabase/ssr`, which
stores the session in a **cookie** instead of `localStorage`, specifically so
that:

- Next.js's `proxy.ts` can read the session cookie and redirect/block before a
  protected page ever renders (real enforcement, not a client-side flash of
  content followed by a redirect).
- Server Components and Route Handlers can read the same session to run
  server-side Supabase queries under the logged-in user's RLS context.

Full write-up of how the pieces fit together:
[06-cookies-and-auth.md](./06-cookies-and-auth.md). What that layer does
**not** do yet is anything role-specific — `updateSession()` only refreshes the
session today; it has a marked spot to add the redirect-if-wrong-role check
once `user_roles` (below) exists.

Mobile (Expo) stays as-is — there's no server-rendering concern there, so
`@supabase/supabase-js` with its React Native `AsyncStorage` adapter (already the
plan per [02-mobile-app.md](./02-mobile-app.md)) is correct and doesn't need
cookies.

## Suggested build order

1. ~~Migrate `apps/web` from `@supabase/supabase-js` to `@supabase/ssr`~~ — done,
   see [06-cookies-and-auth.md](./06-cookies-and-auth.md).
2. ~~Write the schema and RLS policies below as a migration~~ — done, see
   [07-database-schema.md](./07-database-schema.md).
3. Run `supabase db push` to actually apply the migration, then enable
   Supabase Auth (email/password + magic link to start) and hand-insert the
   first `admin` role.
4. Build login/signup UI that calls that Auth.
5. Extend `updateSession()` in `src/proxy.ts` to read the role off the session
   and redirect/block requests to routes it isn't allowed to see.
6. Layer in `cohorts` → `fellow_profiles` / `alumni_profiles`, then
   `organizations` → `partnerships` / `partner_contacts` once the fellow-facing
   pages are real.
