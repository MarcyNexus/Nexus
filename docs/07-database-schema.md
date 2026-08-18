# Database Schema — `supabase/migrations/20260818210106_roles_and_data_model.sql`

← [back to overview](./00-overview.md)

This is the table-by-table reference for the actual migration file that
implements the design proposed in
[05-roles-and-data-model.md](./05-roles-and-data-model.md). That doc is the
*why*; this doc and the migration file itself are the *what*.

**Status: written, not yet applied.** The SQL file exists in
`supabase/migrations/`, but nobody has run `supabase db push` against the
hosted project yet — see "Applying this migration" at the bottom. Until then,
none of these tables exist on `https://boqdteaubdbbjtywniua.supabase.co`.

## Enums

| Enum | Values | Used by |
|---|---|---|
| `app_role` | `admin`, `leadership`, `partnerships_team`, `teacher`, `fellow`, `alumni`, `partner` | `user_roles.role` |
| `fellow_status` | `active`, `graduated`, `withdrawn` | `fellow_profiles.status` |
| `organization_type` | `hiring_partner`, `funder`, `vendor` | `organizations.type` |
| `partnership_status` | `prospect`, `active`, `paused`, `ended` | `partnerships.status` |

Postgres enums instead of a `text` column with a check constraint: the app
code (`packages/shared/src/types.ts`, once generated types are pulled per
[04-supabase-backend.md](./04-supabase-backend.md#typical-next-steps-not-done-yet))
gets a real TypeScript union type for these values automatically, instead of
`string`.

## Tables

### `profiles`
One row per `auth.users` row (`id` is both the primary key and the foreign
key). Holds display data — `full_name`, `avatar_url` — that doesn't belong in
Supabase's own `auth.users` table. A trigger (`on_auth_user_created` →
`handle_new_user()`) inserts this row automatically the moment someone signs
up, pulling `full_name`/`avatar_url` out of the signup call's
`raw_user_meta_data` if provided — the app never has to remember to create it
separately.

### `user_roles`
Many-to-many: `(user_id, role)` as a composite primary key, so a user can hold
several roles at once (an alum who becomes a teacher keeps both rows) and
can't hold the same role twice. This is deliberately a join table rather than
a single `role` column on `profiles` — see
["Roles" in 05-roles-and-data-model.md](./05-roles-and-data-model.md#roles)
for why.

Two helper functions sit alongside it:

- **`has_role(user_id, role)`** and **`has_any_role(user_id, role[])`** — both
  `security definer`, meaning they run with the privileges of the function's
  owner rather than the calling user. This is what every other table's RLS
  policy calls to check a role, and it has to be `security definer`: without
  it, a policy on (say) `cohorts` querying `user_roles` would trigger
  `user_roles`' *own* RLS policy for that same request, which itself doesn't
  need to recurse but adds a class of bugs Postgres's RLS docs explicitly warn
  about. Wrapping the check in one trusted function avoids that.

This is the direct-table-check approach to authorization, not JWT custom
claims. [06-cookies-and-auth.md](./06-cookies-and-auth.md) mentions custom
claims as an option; this migration doesn't use them because they require
configuring a Supabase Auth Hook in the dashboard *in addition to* SQL, and
`has_role()`'s one extra index lookup per policy check is not a real cost at
this project's scale. Worth revisiting only if role checks ever show up in
query performance profiling.

### `cohorts`
`name`, `start_date`, `end_date`. Everything else (`fellow_profiles`,
`alumni_profiles`) points at a cohort, so this has to exist first.

### `fellow_profiles`
One row per current/former fellow: `cohort_id` + `status` (`active` /
`graduated` / `withdrawn`). Primary-keyed on `user_id` rather than a separate
`id` column, since it's a strict 1:1 extension of a user, like `profiles`.

### `alumni_profiles`
Career-outcome data for graduates: `current_company`, `current_title`,
`linkedin_url`. Kept as its own table rather than columns on
`fellow_profiles` — see
["fellow_profiles vs. alumni_profiles" in 05](./05-roles-and-data-model.md#schema)
for why (different columns, different RLS: alumni data is a readable
directory, fellow data isn't).

### `organizations`
Hiring partners, funders, and vendors — one row per external org, typed via
`organization_type`.

### `partnerships`
The internal CRM record: which `organization`, `owned_by` which
partnerships-team staffer, `type` (free text — no fixed list emerged from the
design discussion, so this stays a plain column rather than a premature enum),
and a `status` lifecycle (`prospect` → `active` → `paused`/`ended`).

### `partner_contacts`
The external partner's actual login — one row per person, scoped to exactly
one `organization_id`. This is the table that makes the
`partner`-vs-`partnerships_team` split real: a `partner` role's RLS policies
always filter through this table to their own `organization_id`; internal
staff (`partnerships_team`) query `partnerships`/`organizations` directly with
no such filter.

### `audit_log`
Append-only: `user_id`, `action`, `table_name`, `row_id`, `at`. No update or
delete RLS policy exists for this table at all — not an oversight, this is
what makes it a real audit log instead of a log a compromised admin session
could quietly edit. Nothing writes to it automatically yet (no per-table
triggers wired up); that's the natural next step once specific actions need
tracking (e.g. who changed a fellow's status, who edited a partnership).

## Row Level Security summary

Every table has RLS enabled. The shape repeats a few patterns:

| Pattern | Tables | Rule |
|---|---|---|
| Public-to-logged-in read, self-only write | `profiles` | Any authenticated user can read any profile; only the owner can update their own. |
| Owner-or-staff read, staff-only write | `fellow_profiles` | The fellow sees their own row; `admin`/`leadership`/`teacher` see and manage all. |
| Directory read, owner update, staff create | `alumni_profiles` | Any logged-in user can browse the alumni directory; an alum can edit their own entry; staff create new entries. |
| Staff-only, full CRUD | `cohorts`, `organizations`, `partnerships`, `partner_contacts`, `user_roles` | Gated by `has_any_role()` to the relevant staff roles — `partnerships_team` for partner data, `admin` alone for `user_roles`. |
| Org-scoped external read | `organizations`, `partner_contacts` | A `partner` can `select` only the one organization/contacts row(s) matching their own `partner_contacts.organization_id` — never another partner's. |
| Append-only | `audit_log` | Anyone can insert a row tagged with their own `user_id`; only `admin`/`leadership` can read; nobody can update or delete. |

## Applying this migration

Not run yet — needs the Supabase CLI logged in interactively, which hasn't
happened in this environment. From a machine that can complete the browser
login flow:

```bash
npx supabase login
npx supabase link --project-ref boqdteaubdbbjtywniua
npx supabase db push          # applies every file in supabase/migrations/ in order
```

After that, regenerate the shared package's types so both apps get compile-time
safety on these exact tables/columns/enums (see
[04-supabase-backend.md](./04-supabase-backend.md#typical-next-steps-not-done-yet)):

```bash
npx supabase gen types typescript --project-id boqdteaubdbbjtywniua > packages/shared/src/database.types.ts
```

## What this migration does *not* do yet

- No login/signup UI exists (see [06-cookies-and-auth.md](./06-cookies-and-auth.md)) —
  `handle_new_user()` will fire correctly once one does, but nothing calls
  `auth.signUp()` anywhere in the app today.
- Nothing assigns a first `admin` role to anyone. The very first row in
  `user_roles` has to be inserted by hand (SQL editor in the Supabase
  dashboard, using the secret key) — `only admins manage roles` means no user
  can grant themselves the first admin role through the normal API.
- `src/proxy.ts`'s `updateSession()` still only refreshes the session; it
  doesn't yet read `user_roles` to redirect/block a request. That's
  the next piece to wire up once there's an actual protected route to gate.
