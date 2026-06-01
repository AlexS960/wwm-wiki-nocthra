-- ============================================================
-- Миграция данных из site_data в нормализованные таблицы
-- Выполнить ПОСЛЕ применения структуры таблиц
-- ============================================================

-- 1. Миграция гайдов (site_data.data = JSON-массив)
insert into public.guides (id, title, summary, content, category, difficulty, read_time, icon, images, author_id, author_name, created_at, updated_at)
select
  item->>'id',
  item->>'title',
  item->>'summary',
  item->>'content',
  item->>'category',
  item->>'difficulty',
  item->>'readTime',
  item->>'icon',
  case
    when jsonb_typeof(item->'images') = 'array'
    then array(select jsonb_array_elements_text(item->'images'))
    else null
  end,
  null,
  item->>'authorName',
  coalesce((item->>'updatedAt')::timestamptz, now()),
  coalesce((item->>'updatedAt')::timestamptz, now())
from public.site_data sd
cross join lateral jsonb_array_elements(sd.data) as item(item)
where sd.key = 'guides'
  and item->>'id' is not null
on conflict (id) do nothing;

-- 2. Миграция комментариев к гайдам
insert into public.guide_comments (id, guide_id, user_id, user_name, text, likes, created_at)
select
  item->>'id',
  item->>'guideId',
  item->>'userId',
  item->>'userName',
  item->>'text',
  case
    when jsonb_typeof(item->'likes') = 'array'
    then array(select jsonb_array_elements_text(item->'likes'))
    else '{}'::text[]
  end,
  coalesce((item->>'createdAt')::timestamptz, now())
from public.site_data sd
cross join lateral jsonb_array_elements(sd.data) as item(item)
where sd.key = 'guide_comments'
  and item->>'id' is not null
on conflict (id) do nothing;

-- 3. Миграция версий гайдов
insert into public.guide_versions (id, guide_id, title, summary, content, category, difficulty, read_time, icon, images, saved_at, saved_by)
select
  item->>'id',
  item->>'guideId',
  item->>'title',
  item->>'summary',
  item->>'content',
  item->>'category',
  item->>'difficulty',
  item->>'readTime',
  item->>'icon',
  case
    when jsonb_typeof(item->'images') = 'array'
    then array(select jsonb_array_elements_text(item->'images'))
    else null
  end,
  coalesce((item->>'savedAt')::timestamptz, now()),
  coalesce(item->>'savedBy', 'unknown')
from public.site_data sd
cross join lateral jsonb_array_elements(sd.data) as item(item)
where sd.key = 'guide_versions'
  and item->>'id' is not null
on conflict (id) do nothing;

-- 4. Миграция вики-статей
insert into public.wiki_articles (id, section, title, content, icon, author_id, author_name, fields, images, created_at, updated_at)
select
  item->>'id',
  item->>'section',
  item->>'title',
  item->>'content',
  item->>'icon',
  null,
  item->>'authorName',
  coalesce(item->'fields', '{}'::jsonb),
  case
    when jsonb_typeof(item->'images') = 'array'
    then array(select jsonb_array_elements_text(item->'images'))
    else null
  end,
  coalesce((item->>'updatedAt')::timestamptz, now()),
  coalesce((item->>'updatedAt')::timestamptz, now())
from public.site_data sd
cross join lateral jsonb_array_elements(sd.data) as item(item)
where sd.key = 'wiki'
  and item->>'id' is not null
on conflict (id) do nothing;

-- 5. Миграция новостей
insert into public.site_news (id, title, summary, content, category, icon, images, likes, author_id, author_name, created_at, updated_at)
select
  item->>'id',
  item->>'title',
  item->>'summary',
  item->>'content',
  item->>'category',
  item->>'icon',
  case
    when jsonb_typeof(item->'images') = 'array'
    then array(select jsonb_array_elements_text(item->'images'))
    else null
  end,
  case
    when jsonb_typeof(item->'likes') = 'array'
    then array(select jsonb_array_elements_text(item->'likes'))
    else '{}'::text[]
  end,
  null,
  item->>'authorName',
  coalesce((item->>'createdAt')::timestamptz, now()),
  coalesce((item->>'updatedAt')::timestamptz, now())
from public.site_data sd
cross join lateral jsonb_array_elements(sd.data) as item(item)
where sd.key = 'site_news'
  and item->>'id' is not null
on conflict (id) do nothing;

-- 6. Миграция тикетов поддержки
insert into public.support_tickets (id, user_id, user_name, subject, message, status, created_at, replies)
select
  item->>'id',
  item->>'userId',
  item->>'userName',
  item->>'subject',
  item->>'message',
  coalesce(item->>'status', 'open'),
  coalesce((item->>'createdAt')::timestamptz, now()),
  coalesce(item->'replies', '[]'::jsonb)
from public.site_data sd
cross join lateral jsonb_array_elements(sd.data) as item(item)
where sd.key = 'support'
  and item->>'id' is not null
on conflict (id) do nothing;

-- 7. Миграция сообщений чата (site_data.data = { messages: [...], mutedUsers: [...] })
insert into public.chat_messages (id, user_id, user_name, user_role, message, deleted, created_at)
select
  item->>'id',
  item->>'userId',
  item->>'userName',
  item->>'userRole',
  item->>'text',
  coalesce((item->>'deleted')::boolean, false),
  to_timestamp((item->>'timestamp')::bigint / 1000.0)
from public.site_data sd
cross join lateral jsonb_array_elements(coalesce(sd.data->'messages', '[]'::jsonb)) as item(item)
where sd.key = 'chat'
  and item->>'id' is not null
on conflict (id) do nothing;

-- 8. Миграция muted users чата
insert into public.chat_muted_users (user_id, muted_until)
select
  item->>'userId',
  to_timestamp((item->>'until')::bigint / 1000.0)
from public.site_data sd
cross join lateral jsonb_array_elements(coalesce(sd.data->'mutedUsers', '[]'::jsonb)) as item(item)
where sd.key = 'chat'
  and item->>'userId' is not null
on conflict (user_id) do nothing;

-- Проверка миграции
select 'guides' as table_name, count(*) as count from public.guides
union all
select 'guide_comments', count(*) from public.guide_comments
union all
select 'wiki_articles', count(*) from public.wiki_articles
union all
select 'site_news', count(*) from public.site_news
union all
select 'support_tickets', count(*) from public.support_tickets
union all
select 'chat_messages', count(*) from public.chat_messages
union all
select 'chat_muted_users', count(*) from public.chat_muted_users;
