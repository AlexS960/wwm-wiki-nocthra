-- Реестр игровых гильдий и привязка к аккаунтам

create table if not exists public.registered_guilds (
  id text primary key,
  name text not null,
  description text not null default '',
  server text not null default '',
  leader_id text default '',
  leader_name text not null default '',
  created_at timestamptz not null default now()
);

create unique index if not exists registered_guilds_name_lower_idx
  on public.registered_guilds (lower(trim(name)));

alter table public.accounts add column if not exists guild_id text default '';

alter table public.registered_guilds enable row level security;

drop policy if exists "anon_all_registered_guilds" on public.registered_guilds;
create policy "anon_all_registered_guilds" on public.registered_guilds
  for all to anon, authenticated using (true) with check (true);

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'registered_guilds'
  ) then
    alter publication supabase_realtime add table public.registered_guilds;
  end if;
end $$;
