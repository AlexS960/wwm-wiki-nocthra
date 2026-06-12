-- ============================================================
-- ПОЛНАЯ НАСТРОЙКА SUPABASE ДЛЯ САЙТА (запустить целиком)
-- Dashboard → SQL Editor → New query → вставить → Run
-- ============================================================

-- 1. Таблицы (если ещё не созданы)
create table if not exists public.accounts (
  id text primary key,
  username text not null,
  role text not null default 'user',
  picture text default '',
  game_nickname text default '',
  password_hash text not null,
  created_at timestamptz not null default now(),
  last_seen timestamptz
);

-- Миграция для уже существующей таблицы
alter table public.accounts add column if not exists last_seen timestamptz;
alter table public.accounts add column if not exists guild_id text default '';

create table if not exists public.registered_guilds (
  id text primary key,
  name text not null,
  description text not null default '',
  server text not null default '',
  leader_id text default '',
  leader_name text not null default '',
  leader_game_nickname text not null default '',
  created_at timestamptz not null default now()
);

create unique index if not exists registered_guilds_name_lower_idx
  on public.registered_guilds (lower(trim(name)));

create table if not exists public.site_data (
  key text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.user_progress (
  user_id text primary key,
  data text not null default '{}',
  updated_at timestamptz not null default now()
);

-- 2. RLS + доступ для anon (ключ из приложения)
alter table public.accounts enable row level security;
alter table public.site_data enable row level security;
alter table public.user_progress enable row level security;
alter table public.registered_guilds enable row level security;

drop policy if exists "anon_all_accounts" on public.accounts;
create policy "anon_all_accounts" on public.accounts
  for all to anon, authenticated using (true) with check (true);

drop policy if exists "anon_all_site_data" on public.site_data;
create policy "anon_all_site_data" on public.site_data
  for all to anon, authenticated using (true) with check (true);

drop policy if exists "anon_all_user_progress" on public.user_progress;
create policy "anon_all_user_progress" on public.user_progress
  for all to anon, authenticated using (true) with check (true);

drop policy if exists "anon_all_registered_guilds" on public.registered_guilds;
create policy "anon_all_registered_guilds" on public.registered_guilds
  for all to anon, authenticated using (true) with check (true);

-- 3. Публикация Realtime (частая причина ошибки ALTER PUBLICATION)
do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
end $$;

-- 4. Добавить таблицы в Realtime (без ошибки «already member»)
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'site_data'
  ) then
    alter publication supabase_realtime add table public.site_data;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'accounts'
  ) then
    alter publication supabase_realtime add table public.accounts;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'user_progress'
  ) then
    alter publication supabase_realtime add table public.user_progress;
  end if;
end $$;

-- 5. Проверка (должно вернуть 3 строки)
select schemaname, tablename
from pg_publication_tables
where pubname = 'supabase_realtime'
  and tablename in ('site_data', 'accounts', 'user_progress')
order by tablename;
