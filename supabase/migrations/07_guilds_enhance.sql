-- Расширение реестра гильдий: игровой ник гильдмастера, дата обновления

alter table public.registered_guilds add column if not exists leader_game_nickname text not null default '';
alter table public.registered_guilds add column if not exists updated_at timestamptz;

update public.registered_guilds
set leader_game_nickname = leader_name
where leader_game_nickname = '' and leader_name <> '';
