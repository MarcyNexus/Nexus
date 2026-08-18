# Fellow Dashboard — `/fellow`

← [back to overview](./00-overview.md)

A page the design calls the fellow's logged-in landing page, though it's
**not actually gated by login** — see "No auth check (by design)" below.
Built from a supplied design mockup. Lives at its own top-level route,
`/fellow` — **not** nested under a shared `/dashboard` path. Teacher, alumni,
admin, and partner dashboards get their own sibling top-level routes
(`/teacher`, `/alumni`, `/partner`, etc.) and their own doc like this one,
rather than piling everything into one shared page, file, or `/dashboard/*`
namespace. Reached from the public site via the
[`Navbar`](../apps/web/src/components/Navbar.tsx)'s **Community** dropdown
("Fellows" → `/fellow`), not from the main nav row — that dropdown is also
where `/teacher`, `/alumni`, and `/partner` will get their entries as each is
built.

**Status: publicly viewable, mock content data.** No session required — see
"No auth check (by design)" below. Every widget still renders a hardcoded
array; the tables that would back them are now a written migration
(`20260818214054_fellow_dashboard_content.sql`), not yet applied to the
hosted project.

## Where it lives

```
src/app/fellow/page.tsx             — the route; assembles the page, no session check
src/components/dashboard/
  DashboardCard.tsx                 — shared card shell (icon + title + optional link)
  DashboardHeader.tsx               — "Welcome back, {name}"
  QuickActions.tsx                  — 4-up action button row (client component, see "Interactivity")
  ContinueLearning.tsx               — in-progress module cards
  Announcements.tsx                 — cohort/program announcements feed
  CapstoneProgress.tsx               — current capstone project status
  TodaysSchedule.tsx                 — today's calendar events
  Assignments.tsx                    — assignment list (client component, see "Interactivity")
  RecentGitbooks.tsx                 — recently updated curriculum docs
  Bookmarks.tsx                      — saved links
  CareerServices.tsx                 — career-services promo + CTA
  EmptyState.tsx                     — shared "nothing here yet" state, see "Empty states"
```

`page.tsx` reuses the existing public [`Navbar`](../apps/web/src/components/Navbar.tsx)
and [`Footer`](../apps/web/src/components/Footer.tsx) rather than building
dashboard-specific ones — the supplied mockup shows the same navbar
(including the public "Apply" button) on this page. Worth revisiting once
real auth exists: a logged-in fellow probably wants an account menu /
sign-out control instead of "Apply."

## No auth check (by design)

An earlier version of this page checked the real Supabase session
server-side (`(await createClient()).auth.getUser()`, the cookie-based client
from [06-cookies-and-auth.md](./06-cookies-and-auth.md)) and showed a
sign-in prompt instead of the dashboard when there was no session. Since
there's no login/signup UI anywhere in the app yet, that check could never
actually pass — it blocked *everyone*, permanently, with no way through.

That check was removed on purpose: this page doesn't require a login to
view. It's reached through the public Navbar's Community dropdown, the same
way a visitor reaches any other page on the site — not behind a session gate.
`page.tsx` is back to a plain (non-`async`, no Supabase call) Server
Component.

This is a real product decision, not a placeholder: it means `/fellow` is
currently public, showing the same mock data to anyone who navigates to it,
fellow or not. If/when a real login flow and
per-fellow data exist, gating this page again (or splitting it into a public
preview vs. a real logged-in view) is a design choice to revisit then, not
something this doc presumes.

## Empty states

Every list-based widget (`ContinueLearning`, `Announcements`,
`TodaysSchedule`, `Assignments`, `RecentGitbooks`, `Bookmarks`) now guards for
a zero-length array and renders the shared
[`EmptyState`](../apps/web/src/components/dashboard/EmptyState.tsx) component
instead of a blank card. None of the current mock arrays are ever actually
empty, so this branch never renders today — it's there so swapping mock data
for a real (and sometimes genuinely empty, e.g. a fellow with zero
bookmarks) Supabase query doesn't silently produce a blank card the day that
swap happens.

**Loading states are deliberately not built yet.** All current data is a
synchronous hardcoded array, so there's nothing to show a loading state
*for* — building skeleton placeholders now would be dead code with no real
caller. This becomes relevant once a widget fetches from Supabase instead of
reading a constant, at which point it can wrap in a `<Suspense>` boundary
with a real fallback.

## Interactivity

Two widgets got real (client-side-only) interactivity, since "every button is
`href="#"`" was the flagged gap:

- **`Assignments`** is now a client component (`"use client"`) with local
  `useState`. Clicking a status pill cycles it `not started` → `in progress`
  → `done` → back to `not started`. This is genuine state, not a static
  label — it just doesn't persist anywhere, since there's no
  `assignment_submissions` row to write it to yet (that table exists in the
  new migration, unapplied).
- **`QuickActions`** is now a client component. Clicking a card records which
  one was clicked and displays a line explaining it isn't wired to anything
  real yet, rather than silently doing nothing. Deliberately not a fake
  success message — there's no booking/submission flow behind any of these
  four actions yet.

Everything else (`View all`, `Full calendar`, etc.) is still a static link,
since there's no destination page for any of them to go to yet.

## Mock data → real tables (now written, not yet applied)

`supabase/migrations/20260818214054_fellow_dashboard_content.sql` adds the
tables this page's mock data stands in for. Like
[07-database-schema.md](./07-database-schema.md), it depends on
`public.cohorts`/`has_role`/`has_any_role` from the roles migration and must
run after it — **not yet pushed to the hosted project** (same CLI-login
blocker as 07).

| Widget | Mock data | Real table(s) (now written) |
|---|---|---|
| `DashboardHeader` | Hardcoded `"Fellow"` | `profiles.full_name` — already exists in 07, just not read yet |
| `ContinueLearning` | 3 hardcoded modules | `modules` + `module_progress` |
| `Announcements` | 3 hardcoded posts | `announcements` (cohort-scoped, or global when `cohort_id` is null) |
| `CapstoneProgress` | 1 hardcoded project | `capstone_projects` + `capstone_project_members` — distinct from the finished-project showcase in [`ProjectsShowcase.tsx`](../apps/web/src/components/ProjectsShowcase.tsx), which is public marketing content for *shipped* capstones; this tracks one *in progress* |
| `TodaysSchedule` | 4 hardcoded events | `schedule_events` (cohort-wide when `user_id` is null, personal — e.g. a 1:1 — when it's set) |
| `Assignments` | 3 hardcoded rows | `assignments` (cohort-wide) + `assignment_submissions` (one fellow's status per assignment) |
| `RecentGitbooks` | 3 hardcoded titles | Still no table — likely an external GitBook API integration rather than a Marcy-owned table, given the name. Unchanged from the original assessment. |
| `Bookmarks` | 3 hardcoded links | `bookmarks`, scoped strictly to `user_id` — no staff override, these are personal |
| `CareerServices` | Static promo copy + link | Still no data — may stay static content indefinitely |

RLS on all of these follows the same shape as
[07](./07-database-schema.md#row-level-security-summary): a shared
`is_in_cohort(user_id, cohort_id)` helper function (checks `fellow_profiles`
and `alumni_profiles`) backs the "visible to my own cohort" policies on
`announcements`, `capstone_projects`, `schedule_events`, and `assignments`;
`admin`/`leadership`/`teacher` see everything; a fellow always sees their own
`module_progress`/`assignment_submissions`/`bookmarks` rows regardless of
cohort scoping.

## Applying the new migration

Same process as [07](./07-database-schema.md#applying-this-migration), run
in order (the CLI applies files in timestamp order automatically):

```bash
npx supabase login
npx supabase link --project-ref boqdteaubdbbjtywniua
npx supabase db push          # applies 20260818210106 then 20260818214054
```

## What's still not real

- No widget queries Supabase yet — wiring that up now, before the migration
  is actually pushed, would 500 the page (the tables don't exist on the live
  project). That's *why* this pass stayed mock-data — see "Applying the new
  migration" above for the blocker.
- No signup/login flow, and — per "No auth check (by design)" above — this
  page isn't currently trying to require one.
- No role check at all right now — not "is anyone logged in," not
  specifically `fellow`. Whether this page ever needs one is a decision for
  when it stops being a public mock preview.
- Loading states — deliberately deferred, not forgotten; see "Empty states"
  above for why.
