-- Учёт посещений по IP устройства (вместо анонимного ID в браузере)

alter table public.site_visits add column if not exists client_ip text not null default '';

create index if not exists site_visits_client_ip_idx on public.site_visits (client_ip, hit_at desc);

comment on column public.site_visits.client_ip is
  'Публичный IP посетителя на момент просмотра. Уникальность считается по IP.';

comment on column public.site_visits.visitor_id is
  'Устаревшее поле; для новых записей дублирует client_ip.';
