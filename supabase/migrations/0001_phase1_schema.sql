-- Loomless — Phase 1 schema
-- Tables: workspaces, workspace_members, folders, recordings
-- RLS enabled and scoped to workspace membership.
--
-- NOTE: This file is the canonical Phase 1 schema. At the time this was written
-- the schema had NOT been applied to any reachable Supabase project, so it is
-- committed here to be applied to the loomless project. Apply with the Supabase
-- SQL editor or `supabase db push`. Do not edit tables in place once applied —
-- add a new migration instead.

-- Extensions ---------------------------------------------------------------
create extension if not exists "uuid-ossp";

-- Enums --------------------------------------------------------------------
do $$ begin
  create type recording_status as enum ('recording', 'processing', 'ready', 'failed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type recording_visibility as enum ('private', 'workspace', 'public');
exception when duplicate_object then null; end $$;

do $$ begin
  create type member_role as enum ('owner', 'admin', 'editor', 'viewer');
exception when duplicate_object then null; end $$;

-- Tables -------------------------------------------------------------------
create table if not exists public.workspaces (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  owner_id    uuid not null references auth.users (id) on delete cascade,
  created_at  timestamptz not null default now()
);

create table if not exists public.workspace_members (
  id            uuid primary key default uuid_generate_v4(),
  workspace_id  uuid not null references public.workspaces (id) on delete cascade,
  user_id       uuid not null references auth.users (id) on delete cascade,
  role          member_role not null default 'viewer',
  created_at    timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create table if not exists public.folders (
  id            uuid primary key default uuid_generate_v4(),
  workspace_id  uuid not null references public.workspaces (id) on delete cascade,
  name          text not null,
  created_by    uuid references auth.users (id) on delete set null,
  created_at    timestamptz not null default now()
);

create table if not exists public.recordings (
  id               uuid primary key default uuid_generate_v4(),
  workspace_id     uuid not null references public.workspaces (id) on delete cascade,
  folder_id        uuid references public.folders (id) on delete set null,
  owner_id         uuid not null references auth.users (id) on delete cascade,
  title            text not null default 'Untitled recording',
  description      text,
  status           recording_status not null default 'recording',
  visibility       recording_visibility not null default 'private',
  r2_key           text,
  file_size_bytes  bigint,
  duration_seconds integer,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists recordings_workspace_created_idx
  on public.recordings (workspace_id, created_at desc);
create index if not exists recordings_folder_idx
  on public.recordings (folder_id);
create index if not exists folders_workspace_idx
  on public.folders (workspace_id);
create index if not exists workspace_members_user_idx
  on public.workspace_members (user_id);

-- updated_at trigger for recordings ---------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists recordings_set_updated_at on public.recordings;
create trigger recordings_set_updated_at
  before update on public.recordings
  for each row execute function public.set_updated_at();

-- Membership helper (SECURITY DEFINER avoids RLS recursion) -----------------
create or replace function public.is_workspace_member(p_workspace_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.workspace_members m
    where m.workspace_id = p_workspace_id
      and m.user_id = auth.uid()
  );
$$;

-- Row Level Security -------------------------------------------------------
alter table public.workspaces        enable row level security;
alter table public.workspace_members enable row level security;
alter table public.folders           enable row level security;
alter table public.recordings        enable row level security;

-- workspaces
drop policy if exists "workspaces_select" on public.workspaces;
create policy "workspaces_select" on public.workspaces
  for select using (public.is_workspace_member(id));

drop policy if exists "workspaces_insert" on public.workspaces;
create policy "workspaces_insert" on public.workspaces
  for insert with check (owner_id = auth.uid());

drop policy if exists "workspaces_update" on public.workspaces;
create policy "workspaces_update" on public.workspaces
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "workspaces_delete" on public.workspaces;
create policy "workspaces_delete" on public.workspaces
  for delete using (owner_id = auth.uid());

-- workspace_members
drop policy if exists "members_select" on public.workspace_members;
create policy "members_select" on public.workspace_members
  for select using (public.is_workspace_member(workspace_id));

-- A user may add THEMSELVES to a workspace they own (first-login bootstrap).
drop policy if exists "members_insert_self_bootstrap" on public.workspace_members;
create policy "members_insert_self_bootstrap" on public.workspace_members
  for insert with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.workspaces w
      where w.id = workspace_id and w.owner_id = auth.uid()
    )
  );

drop policy if exists "members_delete" on public.workspace_members;
create policy "members_delete" on public.workspace_members
  for delete using (
    user_id = auth.uid()
    or exists (
      select 1 from public.workspaces w
      where w.id = workspace_id and w.owner_id = auth.uid()
    )
  );

-- folders
drop policy if exists "folders_all" on public.folders;
create policy "folders_all" on public.folders
  for all using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

-- recordings
drop policy if exists "recordings_all" on public.recordings;
create policy "recordings_all" on public.recordings
  for all using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));
