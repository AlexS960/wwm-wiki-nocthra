-- Групповые чаты служебного раздела + read state + inbox (один запрос)
-- Выполнить после pm-messages-setup.sql

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

create index if not exists staff_group_messages_room_idx on public.staff_group_messages (room_id, created_at desc);

create table if not exists public.staff_group_read_state (
  room_id text not null references public.staff_group_rooms(id) on delete cascade,
  user_id text not null,
  last_read_at timestamptz not null default now(),
  primary key (room_id, user_id)
);

alter table public.staff_group_rooms enable row level security;
alter table public.staff_group_members enable row level security;
alter table public.staff_group_messages enable row level security;
alter table public.staff_group_read_state enable row level security;

-- Примечание: приложение использует anon-ключ и кастомные accounts без Supabase Auth.
-- Строгая RLS требует Edge Function / service role. Политики ниже — как в pm_messages.
drop policy if exists "anon_all_staff_group_rooms" on public.staff_group_rooms;
create policy "anon_all_staff_group_rooms" on public.staff_group_rooms
  for all to anon, authenticated using (true) with check (true);

drop policy if exists "anon_all_staff_group_members" on public.staff_group_members;
create policy "anon_all_staff_group_members" on public.staff_group_members
  for all to anon, authenticated using (true) with check (true);

drop policy if exists "anon_all_staff_group_messages" on public.staff_group_messages;
create policy "anon_all_staff_group_messages" on public.staff_group_messages
  for all to anon, authenticated using (true) with check (true);

drop policy if exists "anon_all_staff_group_read_state" on public.staff_group_read_state;
create policy "anon_all_staff_group_read_state" on public.staff_group_read_state
  for all to anon, authenticated using (true) with check (true);

-- Inbox: комнаты пользователя + последнее сообщение + непрочитанные
create or replace function public.staff_group_inbox(p_user_id text)
returns table (
  room_id text,
  title text,
  theme_id text,
  created_by text,
  created_at timestamptz,
  member_ids text[],
  last_text text,
  last_ts timestamptz,
  unread_count bigint
)
language sql
stable
as $$
  with my_rooms as (
    select r.id, r.title, r.theme_id, r.created_by, r.created_at
    from public.staff_group_rooms r
    inner join public.staff_group_members m on m.room_id = r.id
    where m.user_id = p_user_id
  ),
  members_agg as (
    select m.room_id, array_agg(m.user_id order by m.user_id) as member_ids
    from public.staff_group_members m
    where m.room_id in (select id from my_rooms)
    group by m.room_id
  ),
  last_msg as (
    select distinct on (msg.room_id)
      msg.room_id,
      case when msg.deleted_for_all then 'Сообщение удалено' else msg.text end as last_text,
      msg.created_at as last_ts
    from public.staff_group_messages msg
    where msg.room_id in (select id from my_rooms)
    order by msg.room_id, msg.created_at desc
  ),
  unread as (
    select msg.room_id, count(*)::bigint as cnt
    from public.staff_group_messages msg
    left join public.staff_group_read_state rs
      on rs.room_id = msg.room_id and rs.user_id = p_user_id
    where msg.room_id in (select id from my_rooms)
      and msg.from_id <> p_user_id
      and not msg.deleted_for_all
      and msg.created_at > coalesce(rs.last_read_at, '1970-01-01'::timestamptz)
    group by msg.room_id
  )
  select
    mr.id as room_id,
    mr.title,
    mr.theme_id,
    mr.created_by,
    mr.created_at,
    coalesce(ma.member_ids, array[]::text[]) as member_ids,
    coalesce(lm.last_text, 'Нет сообщений') as last_text,
    coalesce(lm.last_ts, mr.created_at) as last_ts,
    coalesce(u.cnt, 0) as unread_count
  from my_rooms mr
  left join members_agg ma on ma.room_id = mr.id
  left join last_msg lm on lm.room_id = mr.id
  left join unread u on u.room_id = mr.id
  order by coalesce(lm.last_ts, mr.created_at) desc;
$$;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'staff_group_messages'
  ) then
    alter publication supabase_realtime add table public.staff_group_messages;
  end if;
end $$;
