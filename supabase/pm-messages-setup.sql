-- ============================================================
-- Личные сообщения: отдельная таблица (вместо site_data.pm JSON)
-- Supabase → SQL Editor → Run
--
-- Откат: DROP TABLE public.pm_messages CASCADE;
--         и снова использовать site_data key 'pm' (если blob не очищали)
-- ============================================================

create table if not exists public.pm_messages (
  id text primary key,
  from_id text not null,
  from_name text not null default '',
  to_id text not null,
  to_name text not null default '',
  text text not null default '',
  created_at timestamptz not null default now(),
  read boolean not null default false,
  deleted_for_all boolean not null default false,
  hidden_for text[] not null default '{}'
);

create index if not exists pm_messages_created_at_idx on public.pm_messages (created_at desc);
create index if not exists pm_messages_to_from_idx on public.pm_messages (to_id, from_id, created_at desc);
create index if not exists pm_messages_from_to_idx on public.pm_messages (from_id, to_id, created_at desc);

alter table public.pm_messages enable row level security;

drop policy if exists "anon_all_pm_messages" on public.pm_messages;
create policy "anon_all_pm_messages" on public.pm_messages
  for all to anon, authenticated using (true) with check (true);

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'pm_messages'
  ) then
    alter publication supabase_realtime add table public.pm_messages;
  end if;
end $$;
