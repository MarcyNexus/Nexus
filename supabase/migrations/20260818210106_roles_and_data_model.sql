-- ============================================================================
-- Marcy Nexus — Roles, Security & Data Model
--
-- Implements the schema designed in docs/05-roles-and-data-model.md. See that
-- doc for the reasoning; see docs/07-database-schema.md for a table-by-table
-- reference to this file specifically.
-- ============================================================================

create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------

create type public.app_role as enum (
  'admin',              -- developers / owners — full system access
  'leadership',         -- leadership team — org-wide read + reporting
  'partnerships_team',  -- internal staff who manage partner relationships
  'teacher',            -- instructors
  'fellow',             -- current fellows
  'alumni',             -- graduates
  'partner'             -- external partner-org contact, scoped to their own org
);

create type public.fellow_status as enum ('active', 'graduated', 'withdrawn');

create type public.organization_type as enum ('hiring_partner', 'funder', 'vendor');

create type public.partnership_status as enum ('prospect', 'active', 'paused', 'ended');

-- ----------------------------------------------------------------------------
-- profiles — one row per auth.users row
-- ----------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

comment on table public.profiles is
  'One row per authenticated user; id matches auth.users.id.';

-- Auto-create a profile row whenever someone signs up, so the app never has
-- to remember to do it manually after auth.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- user_roles — many-to-many; a user can hold more than one role
-- (e.g. an alum who comes back to teach keeps `alumni` and gains `teacher`)
-- ----------------------------------------------------------------------------

create table public.user_roles (
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.app_role not null,
  granted_at timestamptz not null default now(),
  primary key (user_id, role)
);

comment on table public.user_roles is
  'Roles held by each user. A user can hold multiple roles at once.';

-- SECURITY DEFINER so every other table's RLS policy can call this without
-- re-triggering user_roles' own RLS (which would recurse).
create function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

create function public.has_any_role(_user_id uuid, _roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = any(_roles)
  );
$$;

-- ----------------------------------------------------------------------------
-- cohorts
-- ----------------------------------------------------------------------------

create table public.cohorts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  start_date date not null,
  end_date date,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- fellow_profiles — current/former fellows
-- ----------------------------------------------------------------------------

create table public.fellow_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  cohort_id uuid not null references public.cohorts (id),
  status public.fellow_status not null default 'active',
  created_at timestamptz not null default now()
);

create index fellow_profiles_cohort_id_idx on public.fellow_profiles (cohort_id);

-- ----------------------------------------------------------------------------
-- alumni_profiles — graduated fellows' career-outcome data
-- ----------------------------------------------------------------------------

create table public.alumni_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  cohort_id uuid not null references public.cohorts (id),
  current_company text,
  current_title text,
  linkedin_url text,
  created_at timestamptz not null default now()
);

create index alumni_profiles_cohort_id_idx on public.alumni_profiles (cohort_id);

-- ----------------------------------------------------------------------------
-- organizations — hiring partners, funders, vendors
-- ----------------------------------------------------------------------------

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type public.organization_type not null,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- partnerships — internal CRM record, owned by a partnerships_team member.
-- Deliberately separate from partner_contacts (the external login) — see
-- docs/05-roles-and-data-model.md.
-- ----------------------------------------------------------------------------

create table public.partnerships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  owned_by uuid references auth.users (id), -- expected to hold the partnerships_team role
  type text not null,
  status public.partnership_status not null default 'prospect',
  start_date date,
  created_at timestamptz not null default now()
);

create index partnerships_organization_id_idx on public.partnerships (organization_id);

-- ----------------------------------------------------------------------------
-- partner_contacts — the external login, scoped to exactly one organization
-- ----------------------------------------------------------------------------

create table public.partner_contacts (
  user_id uuid primary key references auth.users (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  title text,
  created_at timestamptz not null default now()
);

create index partner_contacts_organization_id_idx on public.partner_contacts (organization_id);

-- ----------------------------------------------------------------------------
-- audit_log — every sensitive write, for compliance
-- ----------------------------------------------------------------------------

create table public.audit_log (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users (id),
  action text not null,
  table_name text not null,
  row_id text,
  at timestamptz not null default now()
);

comment on table public.audit_log is
  'Insert-only. No update/delete RLS policy is defined below, so no role can '
  'modify or remove a row through the API once written.';

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.cohorts enable row level security;
alter table public.fellow_profiles enable row level security;
alter table public.alumni_profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.partnerships enable row level security;
alter table public.partner_contacts enable row level security;
alter table public.audit_log enable row level security;

-- profiles ---------------------------------------------------------------

create policy "profiles are viewable by any logged-in user"
  on public.profiles for select
  to authenticated
  using (true);

create policy "users update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- user_roles ---------------------------------------------------------------

create policy "users see their own roles, admins see all"
  on public.user_roles for select
  to authenticated
  using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

create policy "only admins manage roles"
  on public.user_roles for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- cohorts ---------------------------------------------------------------

create policy "staff manage cohorts"
  on public.cohorts for all
  to authenticated
  using (public.has_any_role(auth.uid(), array['admin', 'leadership', 'teacher']::public.app_role[]))
  with check (public.has_any_role(auth.uid(), array['admin', 'leadership', 'teacher']::public.app_role[]));

create policy "fellows and alumni view their own cohort"
  on public.cohorts for select
  to authenticated
  using (
    id in (select cohort_id from public.fellow_profiles where user_id = auth.uid())
    or id in (select cohort_id from public.alumni_profiles where user_id = auth.uid())
  );

-- fellow_profiles ---------------------------------------------------------------

create policy "fellows see own record, staff see all"
  on public.fellow_profiles for select
  to authenticated
  using (
    auth.uid() = user_id
    or public.has_any_role(auth.uid(), array['admin', 'leadership', 'teacher']::public.app_role[])
  );

create policy "staff create fellow records"
  on public.fellow_profiles for insert
  to authenticated
  with check (public.has_any_role(auth.uid(), array['admin', 'leadership', 'teacher']::public.app_role[]));

create policy "staff update fellow records"
  on public.fellow_profiles for update
  to authenticated
  using (public.has_any_role(auth.uid(), array['admin', 'leadership', 'teacher']::public.app_role[]));

-- alumni_profiles ---------------------------------------------------------------

create policy "alumni directory is readable by any logged-in user"
  on public.alumni_profiles for select
  to authenticated
  using (true);

create policy "alumni update their own record"
  on public.alumni_profiles for update
  to authenticated
  using (auth.uid() = user_id);

create policy "staff create alumni records"
  on public.alumni_profiles for insert
  to authenticated
  with check (public.has_any_role(auth.uid(), array['admin', 'leadership', 'teacher']::public.app_role[]));

-- organizations ---------------------------------------------------------------

create policy "staff manage organizations"
  on public.organizations for all
  to authenticated
  using (public.has_any_role(auth.uid(), array['admin', 'leadership', 'partnerships_team']::public.app_role[]))
  with check (public.has_any_role(auth.uid(), array['admin', 'leadership', 'partnerships_team']::public.app_role[]));

create policy "partners view their own organization"
  on public.organizations for select
  to authenticated
  using (id in (select organization_id from public.partner_contacts where user_id = auth.uid()));

-- partnerships (internal CRM record — no partner-role access at all) ---------

create policy "staff manage partnerships"
  on public.partnerships for all
  to authenticated
  using (public.has_any_role(auth.uid(), array['admin', 'leadership', 'partnerships_team']::public.app_role[]))
  with check (public.has_any_role(auth.uid(), array['admin', 'leadership', 'partnerships_team']::public.app_role[]));

-- partner_contacts ---------------------------------------------------------------

create policy "staff manage partner contacts"
  on public.partner_contacts for all
  to authenticated
  using (public.has_any_role(auth.uid(), array['admin', 'leadership', 'partnerships_team']::public.app_role[]))
  with check (public.has_any_role(auth.uid(), array['admin', 'leadership', 'partnerships_team']::public.app_role[]));

create policy "partners view contacts at their own organization"
  on public.partner_contacts for select
  to authenticated
  using (
    organization_id in (
      select organization_id from public.partner_contacts where user_id = auth.uid()
    )
  );

-- audit_log ---------------------------------------------------------------

create policy "admins and leadership read the audit log"
  on public.audit_log for select
  to authenticated
  using (public.has_any_role(auth.uid(), array['admin', 'leadership']::public.app_role[]));

create policy "users write their own audit rows"
  on public.audit_log for insert
  to authenticated
  with check (auth.uid() = user_id);
