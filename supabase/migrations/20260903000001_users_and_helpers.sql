-- Street Pro Culture — users mirror table, shared helpers, RLS.
--
-- Every project object is prefixed streetproculture_. This migration creates:
--   * streetproculture_set_updated_at()      generic updated_at trigger fn
--   * public.is_superadmin(uuid)             SECURITY DEFINER permission check
--   * streetproculture_users                 mirror of auth.users + permissions[]
--   * handle_new_user() + auth.users trigger row auto-creation
--   * guard_permissions() trigger            blocks privilege escalation
--   * RLS + policies on streetproculture_users

-- ---------------------------------------------------------------------------
-- Shared: updated_at trigger function
-- ---------------------------------------------------------------------------
create or replace function public.streetproculture_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- users table
-- ---------------------------------------------------------------------------
create table public.streetproculture_users (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  full_name   text,
  avatar_url  text,
  -- "superadmin" is added manually from the Supabase dashboard. Never editable
  -- through the anon/authenticated API (see guard_permissions below).
  permissions text[] not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index streetproculture_users_permissions_idx
  on public.streetproculture_users using gin (permissions);

create trigger streetproculture_users_set_updated_at
  before update on public.streetproculture_users
  for each row execute function public.streetproculture_set_updated_at();

-- ---------------------------------------------------------------------------
-- is_superadmin() — SECURITY DEFINER so RLS on streetproculture_users does not
-- recurse when its own policies call this function.
-- ---------------------------------------------------------------------------
create or replace function public.is_superadmin(uid uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select coalesce(
    (select 'superadmin' = any (u.permissions)
       from public.streetproculture_users u
      where u.id = uid),
    false
  );
$$;

revoke all on function public.is_superadmin(uuid) from public;
grant execute on function public.is_superadmin(uuid) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Auto-create a mirror row whenever an auth.users row is inserted.
-- ---------------------------------------------------------------------------
create or replace function public.streetproculture_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.streetproculture_users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update
    set email      = excluded.email,
        full_name  = coalesce(public.streetproculture_users.full_name, excluded.full_name),
        avatar_url = coalesce(excluded.avatar_url, public.streetproculture_users.avatar_url);
  return new;
end;
$$;

create trigger streetproculture_on_auth_user_created
  after insert on auth.users
  for each row execute function public.streetproculture_handle_new_user();

-- ---------------------------------------------------------------------------
-- Privilege-escalation guard: the permissions column can only change when the
-- caller is already a superadmin (dashboard / service_role bypass RLS and this
-- check via is_superadmin()==false? no — service_role sets role, auth.uid() is
-- null, is_superadmin() is false, so we also allow when the session_user is the
-- table owner, which covers SQL-editor / service-role writes).
-- ---------------------------------------------------------------------------
create or replace function public.streetproculture_guard_permissions()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.permissions is distinct from old.permissions
     and not public.is_superadmin()
     and auth.uid() is not null then
    raise exception 'streetproculture_users.permissions is not user-editable';
  end if;
  return new;
end;
$$;

create trigger streetproculture_users_guard_permissions
  before update on public.streetproculture_users
  for each row execute function public.streetproculture_guard_permissions();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.streetproculture_users enable row level security;

-- read your own row, or any row if you are a superadmin
create policy streetproculture_users_select
  on public.streetproculture_users
  for select
  to authenticated
  using (id = (select auth.uid()) or public.is_superadmin());

-- update your own row (permissions change is still blocked by the guard trigger)
create policy streetproculture_users_update_self
  on public.streetproculture_users
  for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- superadmins may update any row
create policy streetproculture_users_update_admin
  on public.streetproculture_users
  for update
  to authenticated
  using (public.is_superadmin())
  with check (public.is_superadmin());

-- No INSERT policy: rows are created only by the SECURITY DEFINER trigger.
-- No DELETE policy: rows cascade from auth.users.
