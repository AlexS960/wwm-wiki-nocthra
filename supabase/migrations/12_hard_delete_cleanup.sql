-- Физическое удаление: очистка старых «мягко удалённых» строк и legacy site_data.
-- Выполнить в Supabase SQL Editor после бэкапа.

-- 1. Удалить помеченные удалёнными сообщения чата
delete from public.chat_messages where deleted = true;

-- 2. Удалить ЛС, скрытые обоими участниками, и помеченные deleted_for_all
delete from public.pm_messages
where deleted_for_all = true
   or (
     coalesce(array_length(hidden_for, 1), 0) >= 2
     and hidden_for @> array[from_id::text, to_id::text]
   );

-- 3. Удалить «мягко удалённые» сообщения служебных групп
delete from public.staff_group_messages where deleted_for_all = true;

-- 4. Убрать дубликаты из site_data (данные уже в нормализованных таблицах)
delete from public.site_data where key in ('chat', 'pm', 'support');

-- 5. Inbox группового чата без проверки deleted_for_all (сообщения удаляются физически)
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
      msg.text as last_text,
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

create index if not exists pm_messages_hidden_for_gin
  on public.pm_messages using gin (hidden_for);

comment on table public.chat_messages is
  'Чат сайта. Удаление — физическое DELETE (колонка deleted — legacy, не используется).';

comment on table public.pm_messages is
  'Личные сообщения. «Удалить у меня» — hidden_for; при скрытии обоими — DELETE. «Удалить у всех» — DELETE.';

comment on table public.staff_group_messages is
  'Сообщения служебных групп. Удаление — физическое DELETE.';
