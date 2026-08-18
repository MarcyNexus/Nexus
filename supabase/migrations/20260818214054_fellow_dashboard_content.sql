-- ============================================================================
-- Fellow Dashboard content tables
--
-- Backs the widgets built in docs/08-fellow-dashboard.md (currently rendering
-- mock data): Continue Learning, Announcements, Capstone Progress, Today's
-- Schedule, and Assignments. See that doc's "mock data, and what real data
-- would replace it" table for the mapping this migration fulfills.
--
-- Deliberately NOT covered here (see docs/08 for why): Recent GitBooks
-- (likely an external GitBook API integration, not a Marcy-owned table) and
-- Career Services (static promo content, no backing data).
--
-- Depends on 20260818210106_roles_and_data_model.sql for `public.cohorts`,
-- `public.has_role`, and `public.has_any_role` — must run after it.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------

create type public.assignment_status as enum ('not_started', 'in_progress', 'done');

create type public.bookmark_type as enum ('slides', 'article', 'doc', 'video', 'link');

create type public.capstone_phase as enum (
  'proposal', 'design', 'build', 'polish', 'demo_day', 'shipped'
);

-- ----------------------------------------------------------------------------
-- modules — curriculum content (shared across cohorts); module_progress —
-- one fellow's completion percentage against one module
-- ----------------------------------------------------------------------------

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  track text not null,        -- e.g. "Core Engineering"
  module_number integer not null,
  title text not null,
  created_at timestamptz not null default now()
);

create table public.module_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  module_id uuid not null references public.modules (id) on delete cascade,
  percent_complete smallint not null default 0 check (percent_complete between 0 and 100),
  updated_at timestamptz not null default now(),
  primary key (user_id, module_id)
);

-- ----------------------------------------------------------------------------
-- announcements — cohort-scoped, or global when cohort_id is null
-- ----------------------------------------------------------------------------

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid references public.cohorts (id) on delete cascade,
  tag text not null,
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index announcements_cohort_id_idx on public.announcements (cohort_id);

-- ----------------------------------------------------------------------------
-- capstone_projects — a fellow's (or team's) in-progress capstone. Distinct
-- from the finished-project showcase content in ProjectsShowcase.tsx on the
-- public homepage — this tracks a project *while it's being built*.
-- ----------------------------------------------------------------------------

create table public.capstone_projects (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  name text not null,
  phase public.capstone_phase not null default 'proposal',
  percent_complete smallint not null default 0 check (percent_complete between 0 and 100),
  note text,
  created_at timestamptz not null default now()
);

create table public.capstone_project_members (
  project_id uuid not null references public.capstone_projects (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  primary key (project_id, user_id)
);

create index capstone_projects_cohort_id_idx on public.capstone_projects (cohort_id);

-- ----------------------------------------------------------------------------
-- schedule_events — cohort-wide (e.g. standup) when user_id is null,
-- personal (e.g. a 1:1) when it's set
-- ----------------------------------------------------------------------------

create table public.schedule_events (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid references public.cohorts (id) on delete cascade,
  user_id uuid references auth.users (id) on delete cascade,
  title text not null,
  subtitle text,
  starts_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index schedule_events_cohort_id_idx on public.schedule_events (cohort_id);
create index schedule_events_user_id_idx on public.schedule_events (user_id);

-- ----------------------------------------------------------------------------
-- assignments (cohort-wide) + assignment_submissions (one fellow's status)
-- ----------------------------------------------------------------------------

create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  title text not null,
  due_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.assignment_submissions (
  assignment_id uuid not null references public.assignments (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  status public.assignment_status not null default 'not_started',
  submitted_at timestamptz,
  primary key (assignment_id, user_id)
);

create index assignments_cohort_id_idx on public.assignments (cohort_id);

-- ----------------------------------------------------------------------------
-- bookmarks — private to each user; no staff/cohort visibility needed
-- ----------------------------------------------------------------------------

create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  url text not null,
  type public.bookmark_type not null default 'link',
  created_at timestamptz not null default now()
);

create index bookmarks_user_id_idx on public.bookmarks (user_id);

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.modules enable row level security;
alter table public.module_progress enable row level security;
alter table public.announcements enable row level security;
alter table public.capstone_projects enable row level security;
alter table public.capstone_project_members enable row level security;
alter table public.schedule_events enable row level security;
alter table public.assignments enable row level security;
alter table public.assignment_submissions enable row level security;
alter table public.bookmarks enable row level security;

-- modules: curriculum content isn't secret to anyone logged in; staff manage
create policy "modules are readable by any logged-in user"
  on public.modules for select
  to authenticated
  using (true);

create policy "staff manage modules"
  on public.modules for all
  to authenticated
  using (public.has_any_role(auth.uid(), array['admin', 'leadership', 'teacher']::public.app_role[]))
  with check (public.has_any_role(auth.uid(), array['admin', 'leadership', 'teacher']::public.app_role[]));

-- module_progress: a fellow sees/updates their own; staff see/manage all
create policy "users see own progress, staff see all"
  on public.module_progress for select
  to authenticated
  using (
    auth.uid() = user_id
    or public.has_any_role(auth.uid(), array['admin', 'leadership', 'teacher']::public.app_role[])
  );

create policy "users update their own progress"
  on public.module_progress for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "staff manage all progress"
  on public.module_progress for all
  to authenticated
  using (public.has_any_role(auth.uid(), array['admin', 'leadership', 'teacher']::public.app_role[]))
  with check (public.has_any_role(auth.uid(), array['admin', 'leadership', 'teacher']::public.app_role[]));

-- helper predicate reused by announcements/schedule_events/assignments below:
-- "is this row's cohort one the current user belongs to (as fellow or alum)?"
create function public.is_in_cohort(_user_id uuid, _cohort_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.fellow_profiles
    where user_id = _user_id and cohort_id = _cohort_id
  ) or exists (
    select 1 from public.alumni_profiles
    where user_id = _user_id and cohort_id = _cohort_id
  );
$$;

-- announcements: visible if global, if in the viewer's own cohort, or staff
create policy "announcements visible to their cohort or staff"
  on public.announcements for select
  to authenticated
  using (
    cohort_id is null
    or public.is_in_cohort(auth.uid(), cohort_id)
    or public.has_any_role(auth.uid(), array['admin', 'leadership', 'teacher']::public.app_role[])
  );

create policy "staff manage announcements"
  on public.announcements for all
  to authenticated
  using (public.has_any_role(auth.uid(), array['admin', 'leadership', 'teacher']::public.app_role[]))
  with check (public.has_any_role(auth.uid(), array['admin', 'leadership', 'teacher']::public.app_role[]));

-- capstone_projects: visible to project members, their cohort, or staff
create policy "capstone projects visible to members, cohort, or staff"
  on public.capstone_projects for select
  to authenticated
  using (
    id in (select project_id from public.capstone_project_members where user_id = auth.uid())
    or public.is_in_cohort(auth.uid(), cohort_id)
    or public.has_any_role(auth.uid(), array['admin', 'leadership', 'teacher']::public.app_role[])
  );

create policy "staff manage capstone projects"
  on public.capstone_projects for all
  to authenticated
  using (public.has_any_role(auth.uid(), array['admin', 'leadership', 'teacher']::public.app_role[]))
  with check (public.has_any_role(auth.uid(), array['admin', 'leadership', 'teacher']::public.app_role[]));

-- capstone_project_members: a member sees their own membership rows; staff see all
create policy "members see their own project membership, staff see all"
  on public.capstone_project_members for select
  to authenticated
  using (
    auth.uid() = user_id
    or public.has_any_role(auth.uid(), array['admin', 'leadership', 'teacher']::public.app_role[])
  );

create policy "staff manage project membership"
  on public.capstone_project_members for all
  to authenticated
  using (public.has_any_role(auth.uid(), array['admin', 'leadership', 'teacher']::public.app_role[]))
  with check (public.has_any_role(auth.uid(), array['admin', 'leadership', 'teacher']::public.app_role[]));

-- schedule_events: a personal event (user_id set) is visible only to that
-- user; a cohort event is visible to that cohort; staff see all
create policy "schedule events visible to their owner, cohort, or staff"
  on public.schedule_events for select
  to authenticated
  using (
    auth.uid() = user_id
    or (cohort_id is not null and public.is_in_cohort(auth.uid(), cohort_id))
    or public.has_any_role(auth.uid(), array['admin', 'leadership', 'teacher']::public.app_role[])
  );

create policy "staff manage schedule events"
  on public.schedule_events for all
  to authenticated
  using (public.has_any_role(auth.uid(), array['admin', 'leadership', 'teacher']::public.app_role[]))
  with check (public.has_any_role(auth.uid(), array['admin', 'leadership', 'teacher']::public.app_role[]));

-- assignments: visible to their cohort or staff
create policy "assignments visible to their cohort or staff"
  on public.assignments for select
  to authenticated
  using (
    public.is_in_cohort(auth.uid(), cohort_id)
    or public.has_any_role(auth.uid(), array['admin', 'leadership', 'teacher']::public.app_role[])
  );

create policy "staff manage assignments"
  on public.assignments for all
  to authenticated
  using (public.has_any_role(auth.uid(), array['admin', 'leadership', 'teacher']::public.app_role[]))
  with check (public.has_any_role(auth.uid(), array['admin', 'leadership', 'teacher']::public.app_role[]));

-- assignment_submissions: a fellow sees/updates their own; staff see/manage all
create policy "users see their own submissions, staff see all"
  on public.assignment_submissions for select
  to authenticated
  using (
    auth.uid() = user_id
    or public.has_any_role(auth.uid(), array['admin', 'leadership', 'teacher']::public.app_role[])
  );

create policy "users manage their own submissions"
  on public.assignment_submissions for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "staff manage all submissions"
  on public.assignment_submissions for all
  to authenticated
  using (public.has_any_role(auth.uid(), array['admin', 'leadership', 'teacher']::public.app_role[]))
  with check (public.has_any_role(auth.uid(), array['admin', 'leadership', 'teacher']::public.app_role[]));

-- bookmarks: strictly private — no staff override, these are personal
create policy "users manage their own bookmarks"
  on public.bookmarks for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
