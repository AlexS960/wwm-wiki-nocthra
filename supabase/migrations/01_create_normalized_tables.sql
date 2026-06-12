-- ============================================================
-- Миграция: нормализация таблиц базы данных
-- Дата: 2025
-- ============================================================

-- Сначала удаляем зависимые таблицы (FK → guides), затем родительские
drop table if exists public.guide_comments;
drop table if exists public.guide_versions;
drop table if exists public.guides;
drop table if exists public.wiki_articles;
drop table if exists public.site_news;
drop table if exists public.support_tickets;
drop table if exists public.chat_messages;
drop table if exists public.chat_muted_users;

-- 1. Таблица гайдов
create table public.guides (
  id text primary key,
  title text not null,
  summary text,
  content text,
  category text,
  difficulty text,
  read_time text,
  icon text,
  images text[],
  author_id text,
  author_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Индексы для гайдов
create index if not exists idx_guides_category on public.guides(category);
create index if not exists idx_guides_author on public.guides(author_id);
create index if not exists idx_guides_created on public.guides(created_at desc);

-- 2. Таблица комментариев к гайдам
create table public.guide_comments (
  id text primary key,
  guide_id text not null references public.guides(id) on delete cascade,
  user_id text not null,
  user_name text not null,
  text text not null,
  likes text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_comments_guide on public.guide_comments(guide_id);
create index if not exists idx_comments_user on public.guide_comments(user_id);

-- 3. Таблица версий гайдов
create table public.guide_versions (
  id text primary key,
  guide_id text not null references public.guides(id) on delete cascade,
  title text not null,
  summary text,
  content text,
  category text,
  difficulty text,
  read_time text,
  icon text,
  images text[],
  saved_at timestamptz not null default now(),
  saved_by text not null
);

create index if not exists idx_versions_guide on public.guide_versions(guide_id);

-- 4. Таблица вики-статей
create table public.wiki_articles (
  id text primary key,
  section text not null,
  title text not null,
  content text,
  icon text,
  author_id text,
  author_name text,
  fields jsonb not null default '{}',
  images text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_wiki_section on public.wiki_articles(section);
create index if not exists idx_wiki_created on public.wiki_articles(created_at desc);

-- 5. Таблица новостей сайта
create table public.site_news (
  id text primary key,
  title text not null,
  summary text,
  content text,
  category text,
  icon text,
  images text[],
  likes text[] not null default '{}',
  author_id text,
  author_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_news_created on public.site_news(created_at desc);

-- 6. Таблица поддержки (тикеты)
create table public.support_tickets (
  id text primary key,
  user_id text not null,
  user_name text not null,
  subject text not null,
  message text not null,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  replies jsonb not null default '[]'
);

create index if not exists idx_tickets_user on public.support_tickets(user_id);
create index if not exists idx_tickets_status on public.support_tickets(status);

-- 7. Оптимизация чата - таблица сообщений
create table public.chat_messages (
  id text primary key,
  user_id text not null,
  user_name text not null,
  user_role text not null,
  message text not null,
  deleted boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_chat_created on public.chat_messages(created_at desc);
create index if not exists idx_chat_user on public.chat_messages(user_id);

-- 8. Таблица muted users в чате
create table public.chat_muted_users (
  user_id text primary key,
  muted_until timestamptz not null
);

create index if not exists idx_muted_until on public.chat_muted_users(muted_until);

-- 9. RLS политики
alter table public.guides enable row level security;
alter table public.guide_comments enable row level security;
alter table public.guide_versions enable row level security;
alter table public.wiki_articles enable row level security;
alter table public.site_news enable row level security;
alter table public.support_tickets enable row level security;
alter table public.chat_messages enable row level security;
alter table public.chat_muted_users enable row level security;

-- Базовые политики (можно расширить)
drop policy if exists "anon_all_guides" on public.guides;
create policy "anon_all_guides" on public.guides
  for all to anon, authenticated using (true) with check (true);

drop policy if exists "anon_all_guide_comments" on public.guide_comments;
create policy "anon_all_guide_comments" on public.guide_comments
  for all to anon, authenticated using (true) with check (true);

drop policy if exists "anon_all_guide_versions" on public.guide_versions;
create policy "anon_all_guide_versions" on public.guide_versions
  for all to anon, authenticated using (true) with check (true);

drop policy if exists "anon_all_wiki_articles" on public.wiki_articles;
create policy "anon_all_wiki_articles" on public.wiki_articles
  for all to anon, authenticated using (true) with check (true);

drop policy if exists "anon_all_site_news" on public.site_news;
create policy "anon_all_site_news" on public.site_news
  for all to anon, authenticated using (true) with check (true);

drop policy if exists "anon_all_support_tickets" on public.support_tickets;
create policy "anon_all_support_tickets" on public.support_tickets
  for all to anon, authenticated using (true) with check (true);

drop policy if exists "anon_all_chat_messages" on public.chat_messages;
create policy "anon_all_chat_messages" on public.chat_messages
  for all to anon, authenticated using (true) with check (true);

drop policy if exists "anon_all_chat_muted_users" on public.chat_muted_users;
create policy "anon_all_chat_muted_users" on public.chat_muted_users
  for all to anon, authenticated using (true) with check (true);

-- 10. Добавление таблиц в Realtime
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'guides') then
    alter publication supabase_realtime add table public.guides;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'guide_comments') then
    alter publication supabase_realtime add table public.guide_comments;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'wiki_articles') then
    alter publication supabase_realtime add table public.wiki_articles;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'chat_messages') then
    alter publication supabase_realtime add table public.chat_messages;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'support_tickets') then
    alter publication supabase_realtime add table public.support_tickets;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'site_news') then
    alter publication supabase_realtime add table public.site_news;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'guide_versions') then
    alter publication supabase_realtime add table public.guide_versions;
  end if;
end $$;

-- 11. Миграция существующих данных (опционально)
-- раскомментировать при необходимости
/*
insert into public.guides (id, title, summary, content, category, difficulty, read_time, icon, images, author_id, author_name)
select 
  (data->>'id') as id,
  (data->>'title') as title,
  (data->>'summary') as summary,
  (data->>'content') as content,
  (data->>'category') as category,
  (data->>'difficulty') as difficulty,
  (data->>'readTime') as read_time,
  (data->>'icon') as icon,
  (data->>'images') as images,
  null as author_id,
  null as author_name
from public.site_data
where key = 'guides'
on conflict (id) do nothing;
*/