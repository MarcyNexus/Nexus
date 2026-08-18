# Hiring Partner Portal — `/partner`

← [back to overview](./00-overview.md)

The third role dashboard, following the exact conventions set by
[08-fellow-dashboard.md](./08-fellow-dashboard.md) and
[09-alumni-dashboard.md](./09-alumni-dashboard.md): its own top-level route
(`/partner`, not nested under `/dashboard`), reached from the public site via
the [`Navbar`](../apps/web/src/components/Navbar.tsx)'s **Community**
dropdown ("Partners" → `/partner`), publicly viewable with no session check,
every widget rendering mock data. Built from a supplied design mockup.

This is the **external partner-org contact** role
([05-roles-and-data-model.md](./05-roles-and-data-model.md#roles) calls it
`partner`) — a hiring manager or recruiter at a company like Bloomberg or
Squarespace, not internal Marcy staff. Distinct from `partnerships_team`
(internal staff who manage the relationship), same distinction the roles doc
draws between `partnerships` (internal CRM record) and `partner_contacts`
(the external login).

**Status: publicly viewable, mock content data.** Same shape as `/fellow`
and `/alumni` — no auth gate (see
[08-fellow-dashboard.md#no-auth-check-by-design](./08-fellow-dashboard.md#no-auth-check-by-design)
for the reasoning, unchanged here), no table backs any widget yet.

## Where it lives

```
src/app/partner/page.tsx            — the route; assembles the page, no session check
src/components/partner/
  PortalHeader.tsx                  — "Recruit Marcy talent" + Schedule Session / Contact Marcy buttons
  HiringStatistics.tsx              — 3 stat cards with YoY deltas
  TalentPipeline.tsx                — candidates with stack + cohort + availability status
  RecruitingEvents.tsx              — upcoming recruiting-facing events
  ImpactMetrics.tsx                 — plain label/value rows (fellows hired, income increase, years partnered)
  PartnerSuccessStories.tsx         — quote cards from partner companies
  FeaturedFellows.tsx               — spotlighted fellow profiles with their capstone project
  GraduateDirectory.tsx             — directory promo + CTA
```

Reuses `DashboardCard`/`EmptyState` from the fellow dashboard's shared
component set (see ["Where it lives" in
09](./09-alumni-dashboard.md#where-it-lives) — same reasoning: both were
already generic) and the existing public `Navbar`/`Footer`.

## Layout

Same masonry pattern as `/fellow` and `/alumni`: `PortalHeader` and
`HiringStatistics` sit full-width above a `lg:grid-cols-3` grid — main column
(`TalentPipeline` → `PartnerSuccessStories` → `FeaturedFellows`) takes 2 of 3
columns, sidebar (`RecruitingEvents` → `ImpactMetrics` → `GraduateDirectory`)
takes the third.

Two widgets depart slightly from the usual single-column list inside a
`DashboardCard`:

- **`PartnerSuccessStories`** and **`FeaturedFellows`** each render a
  `sm:grid-cols-2` grid *inside* the card body instead of a `divide-y` list —
  the mockup pairs two items side by side rather than stacking them.
- **`ImpactMetrics`** has no `EmptyState` guard, unlike every other
  list-based widget on this page. It's a fixed 3-row stat summary, the same
  category as `CareerMilestones` on `/alumni` — not a query result that comes
  back with a variable-length, possibly-empty list.

## Mock data → real tables (not written yet)

No migration exists for this page's data, same starting point as `/alumni`
before it:

| Widget | Mock data | Would need |
|---|---|---|
| `PortalHeader` | Static heading/copy | No data |
| `HiringStatistics` | 3 hardcoded stats + YoY deltas | Derived aggregate query (hire rate, time-to-hire, retention) against `partnerships`/`fellow_profiles`/`alumni_profiles` — not a stored table on its own |
| `TalentPipeline` | 3 hardcoded candidates | Reads `alumni_profiles`/`fellow_profiles` filtered to "available for hire" — needs an availability flag that doesn't exist on either table yet, plus a stack/skills field neither table has |
| `RecruitingEvents` | 2 hardcoded events | Could reuse `schedule_events` from [08](./08-fellow-dashboard.md#mock-data--real-tables-now-written-not-yet-applied) if partner-visible events fit that table, same open question noted there for `/alumni`'s `Events` widget |
| `ImpactMetrics` | 3 hardcoded numbers | Derived from `partnerships`/hire outcomes, same aggregate-query situation as `HiringStatistics` |
| `PartnerSuccessStories` | 2 hardcoded quotes | A `testimonials` table (organization_id, quote, attribution) scoped to `organizations` from [07](./07-database-schema.md) — doesn't exist |
| `FeaturedFellows` | 2 hardcoded fellows | Reads `fellow_profiles`/capstone data — same "featured" curation question as `/alumni`'s `FeaturedAlumni` |
| `GraduateDirectory` | Static promo copy + link | No data — same as `CareerServices` on `/fellow` |

This page leans more on **derived/aggregate** data (hire rate, time-to-hire,
retention) than `/fellow` or `/alumni` did — worth deciding whether those
get computed on read (a Postgres view or function) or maintained as
columns updated by a trigger, when this becomes real.

## What's not real yet

- No auth check, deliberately — see
  [08](./08-fellow-dashboard.md#no-auth-check-by-design). Same open question
  as `/alumni`: what a real `partner` session should be scoped to (their own
  organization only, per the RLS design in
  [07](./07-database-schema.md#row-level-security-summary)) once this stops
  being a public mock preview.
- No widget queries Supabase; no migration written yet (same state as
  `/alumni`, one step behind `/fellow`'s already-written-but-unapplied
  migration).
- No interactivity — every button/link here is static.
- Empty states applied to every list-based widget except `ImpactMetrics`
  (see "Layout" above for why).
