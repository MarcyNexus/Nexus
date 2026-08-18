# Alumni Dashboard — `/alumni`

← [back to overview](./00-overview.md)

The second role dashboard, following the exact conventions set by
[08-fellow-dashboard.md](./08-fellow-dashboard.md): its own top-level route
(`/alumni`, not nested under `/dashboard`), reached from the public site via
the [`Navbar`](../apps/web/src/components/Navbar.tsx)'s **Community**
dropdown ("Alumni" → `/alumni`), publicly viewable with no session check, and
every widget rendering mock data. Built from a supplied design mockup.

**Status: publicly viewable, mock content data.** Same shape as `/fellow` —
no auth gate (see
[08-fellow-dashboard.md#no-auth-check-by-design](./08-fellow-dashboard.md#no-auth-check-by-design)
for the reasoning, which applies here unchanged), no table backs any widget
yet.

## Where it lives

```
src/app/alumni/page.tsx             — the route; assembles the page, no session check
src/components/alumni/
  ProfileHeader.tsx                 — name, cohort badge, role/company, "Connect LinkedIn"
  CareerMilestones.tsx              — 3 stat cards (years in industry, promotions, fellows mentored)
  CareerTimeline.tsx                — year-by-year career history
  NetworkingDirectory.tsx           — other alumni contacts
  ExclusiveJobBoard.tsx             — alumni-only / referral-tagged job postings
  Events.tsx                       — upcoming alumni events
  CommunityFeed.tsx                 — short posts from other alumni
  FeaturedAlumni.tsx                — spotlighted alumni profiles
  ReferralOpportunities.tsx         — referral-bonus promo + CTA
```

Reuses [`DashboardCard`](../apps/web/src/components/dashboard/DashboardCard.tsx)
and [`EmptyState`](../apps/web/src/components/dashboard/EmptyState.tsx) from
the fellow dashboard's component set rather than duplicating them under
`components/alumni/` — both were already generic (icon + title + optional
link; "nothing here yet" message), nothing fellow-specific about them.
`Eyebrow` (the small dot + label used above `CareerMilestones`) is the same
shared component the public homepage uses.

Also reuses the existing public `Navbar`/`Footer`, same as `/fellow` — see
["Where it lives" in 08](./08-fellow-dashboard.md#where-it-lives) for the
caveat about the navbar's "Apply" button once real per-role auth exists.

## Layout

Same masonry pattern as `/fellow`
([08](./08-fellow-dashboard.md#layout)): `ProfileHeader` and
`CareerMilestones` sit full-width above a `lg:grid-cols-3` grid — main column
(`CareerTimeline` → `ExclusiveJobBoard` → `CommunityFeed`) takes 2 of 3
columns, sidebar (`NetworkingDirectory` → `Events` → `FeaturedAlumni` →
`ReferralOpportunities`) takes the third.

## New shared file: `components/icons/BrandIcons.tsx`

`ProfileHeader`'s "Connect LinkedIn" button needed the same hand-drawn
LinkedIn glyph `Footer.tsx` already had (lucide-react dropped all brand/logo
icons — see [08](./08-fellow-dashboard.md), same reasoning as the GitHub
icon in `ProjectsShowcase.tsx`). Rather than a third copy-pasted `<svg>`,
all four brand icons (`Instagram`, `Linkedin`, `Twitter`, `Github`) now live
once in `src/components/icons/BrandIcons.tsx`, each accepting a `className`
prop so callers can size them independently — `Footer.tsx` and
`ProjectsShowcase.tsx` were both updated to import from there instead of
keeping their own private copies.

## Mock data → real tables (not written yet)

Unlike `/fellow`, **no migration exists yet** for any of this page's data.
Mapping it out for whenever that's built:

| Widget | Mock data | Would need |
|---|---|---|
| `ProfileHeader` | Hardcoded Jasmine Rodriguez | `profiles` + `alumni_profiles` (both already exist in [07-database-schema.md](./07-database-schema.md)) |
| `CareerMilestones` | 3 hardcoded stats | Not in `alumni_profiles` today — would need new columns (`years_in_industry`, `promotion_count`) or a derived query, plus a `mentorship` table for "fellows mentored" |
| `CareerTimeline` | 3 hardcoded entries | A `career_events` table (user_id, year, title, subtitle) — doesn't exist |
| `NetworkingDirectory` | 3 hardcoded contacts | Reads other `alumni_profiles` rows — table exists, no query yet |
| `ExclusiveJobBoard` | 3 hardcoded postings | A `job_postings` table, likely `organization_id`-linked to [07](./07-database-schema.md)'s `organizations`, with an `exclusive`/`referral_bonus` flag — doesn't exist |
| `Events` | 2 hardcoded events | Could reuse `schedule_events` from [08](./08-fellow-dashboard.md#mock-data--real-tables-now-written-not-yet-applied) if alumni-visible events fit that same table, or need their own |
| `CommunityFeed` | 2 hardcoded posts | A `posts` table (user_id, body, created_at) — doesn't exist; likely wants moderation/reporting eventually given it's open text |
| `FeaturedAlumni` | 2 hardcoded profiles | Could be a `featured` boolean on `alumni_profiles`, or a small `featured_alumni` join table if staff curate a rotating list |
| `ReferralOpportunities` | Static promo copy + link | No data — same as `CareerServices` on `/fellow`, may stay static |

Building any of this for real is a separate pass, same as
[08](./08-fellow-dashboard.md#mock-data--real-tables-now-written-not-yet-applied)
was for `/fellow` — this table exists so that pass has a starting map instead
of re-deriving it from the components.

## What's not real yet

- No auth check, deliberately — see
  [08](./08-fellow-dashboard.md#no-auth-check-by-design).
- No widget queries Supabase; nothing above has a migration yet (contrast
  with `/fellow`, which at least has an unapplied migration already written).
- No interactivity — every button/link here is static, unlike `/fellow`'s
  `Assignments`/`QuickActions` widgets. Worth revisiting the same way if this
  page gets a second pass.
- Empty states use the same `EmptyState` guard pattern copied from
  `/fellow` — applied to every list-based widget (`CareerTimeline`,
  `NetworkingDirectory`, `ExclusiveJobBoard`, `Events`, `CommunityFeed`,
  `FeaturedAlumni`); not applicable to `ReferralOpportunities`, which has no
  list at all (static promo copy, same as `CareerServices` on `/fellow`).
