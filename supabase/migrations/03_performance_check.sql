-- ============================================================
-- Проверка производительности базы данных
-- ============================================================

-- 1. Проверка размера таблиц
select 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
  pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
from pg_tables 
where schemaname = 'public'
  and tablename in ('guides', 'guide_comments', 'wiki_articles', 'site_news', 'support_tickets', 'chat_messages', 'site_data')
order by pg_total_relation_size(schemaname||'.'||tablename) desc;

-- 2. Проверка индексов
select 
  schemaname,
  tablename,
  indexname,
  indexdef
from pg_indexes 
where schemaname = 'public'
  and tablename in ('guides', 'guide_comments', 'wiki_articles', 'chat_messages')
order by tablename, indexname;

-- 3. Статистика по записям
select 
  'guides' as table_name, count(*) as record_count from guides
union all
select 'guide_comments', count(*) from guide_comments
union all
select 'wiki_articles', count(*) from wiki_articles
union all
select 'site_news', count(*) from site_news
union all
select 'support_tickets', count(*) from support_tickets
union all
select 'chat_messages', count(*) from chat_messages;

-- 4. Проверка внешних ключей и ограничений
select 
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('guide_comments', 'guide_versions', 'support_tickets');

-- 5. Анализ запросов (требует прав суперпользователя)
-- select * from pg_stat_statements order by total_time desc limit 10;

-- 6. Проверка Realtime подписок
select 
  schemaname,
  tablename,
  pubname
from pg_publication_tables
where schemaname = 'public'
  and tablename in ('guides', 'guide_comments', 'wiki_articles', 'chat_messages', 'support_tickets', 'site_data');