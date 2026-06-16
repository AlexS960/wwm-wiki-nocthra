-- Статистика посещений + идентификатор доступа к чату/ЛС

alter table public.accounts add column if not exists messenger_access_id text not null default '';

create table if not exists public.site_visits (
  id bigint generated always as identity primary key,
  visitor_id text not null,
  user_id text,
  path text not null default '/',
  hit_at timestamptz not null default now()
);

create index if not exists site_visits_hit_at_idx on public.site_visits (hit_at desc);
create index if not exists site_visits_visitor_idx on public.site_visits (visitor_id, hit_at desc);
create index if not exists site_visits_path_idx on public.site_visits (path);

alter table public.site_visits enable row level security;

drop policy if exists "anon_all_site_visits" on public.site_visits;
create policy "anon_all_site_visits" on public.site_visits
  for all to anon, authenticated using (true) with check (true);

-- Обновить публичное представление аккаунтов (без messenger_access_id — только для админа через accounts)
create or replace view public.accounts_public as
select
  id,
  username,
  role,
  picture,
  game_nickname,
  guild_id,
  created_at,
  last_seen
from public.accounts;

grant select on public.accounts_public to anon, authenticated;

comment on column public.accounts.messenger_access_id is
  'Идентификатор доступа к чату сайта и ЛС. Выдаёт администратор. Пусто — нет доступа.';
