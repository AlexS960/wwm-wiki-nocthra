-- Групповые чаты служебного раздела (Supabase → SQL Editor → Run)

create table if not exists public.staff_group_rooms (
  id text primary key,
  title text not null,
  theme_id text not null default 'purple',
  created_by text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.staff_group_members (
  room_id text not null references public.staff_group_rooms(id) on delete cascade,
  user_id text not null,
  joined_at timestamptz not null default now(),
  primary key (room_id, user_id)
);

create index if not exists staff_group_members_user_idx on public.staff_group_members (user_id);

create table if not exists public.staff_group_messages (
  id text primary key,
  room_id text not null references public.staff_group_rooms(id) on delete cascade,
  from_id text not null,
  from_name text not null default '',
  text text not null default '',
  created_at timestamptz not null default now(),
  deleted_for_all boolean not null default false
);

create index if not exists staff_group_messages_room_idx on public.staff_group_messages (room_id, created_at);

alter table public.staff_group_rooms enable row level security;
alter table public.staff_group_members enable row level security;
alter table public.staff_group_messages enable row level security;

drop policy if exists "anon_all_staff_group_rooms" on public.staff_group_rooms;
create policy "anon_all_staff_group_rooms" on public.staff_group_rooms
  for all to anon, authenticated using (true) with check (true);

drop policy if exists "anon_all_staff_group_members" on public.staff_group_members;
create policy "anon_all_staff_group_members" on public.staff_group_members
  for all to anon, authenticated using (true) with check (true);

drop policy if exists "anon_all_staff_group_messages" on public.staff_group_messages;
create policy "anon_all_staff_group_messages" on public.staff_group_messages
  for all to anon, authenticated using (true) with check (true);

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'staff_group_messages'
  ) then
    alter publication supabase_realtime add table public.staff_group_messages;
  end if;
end $$;
