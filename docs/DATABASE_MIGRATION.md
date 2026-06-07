# Миграция на нормализованную структуру БД

## Обзор изменений

### Проблемы исходной структуры:
1. Все данные хранились в одной таблице `site_data` в формате JSON
2. При росте данных запросы становились все медленнее
3. Отсутствие индексов для часто запрашиваемых полей
4. Невозможно эффективно использовать пагинацию

### Новая структура:
- `guides` - гайды с индексами по категории и автору
- `guide_comments` - комментарии с внешним ключом на гайд
- `guide_versions` - версии гайдов для истории изменений
- `wiki_articles` - статьи вики с индексом по разделу
- `site_news` - новости сайта
- `support_tickets` - тикеты поддержки
- `chat_messages` - сообщения чата с пагинацией
- `chat_muted_users` - muted users для чата

## Как применить миграцию

### 1. Применить структуру таблиц:
```sql
-- В Supabase SQL Editor выполнить:
-- 1. supabase/migrations/01_create_normalized_tables.sql
-- 2. (опционально) supabase/migrations/02_migrate_data.sql
```

### 2. Обновить переменные окружения:
Убедитьесь что `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY` настроены корректно.

### 3. Развернуть обновления:
```bash
npm run build
```

## Оптимизации после миграции

### 1. Пагинация для гайдов:
```typescript
const [page, setPage] = useState(1);
const LIMIT = 20;

const { data, error } = await supabase
  .from('guides')
  .select('*')
  .range((page - 1) * LIMIT, page * LIMIT - 1)
  .order('created_at', { ascending: false });
```

### 2. Полнотекстовый поиск:
```sql
-- Добавить search vector для гайдов
alter table guides add column search_vector tsvector;
update guides set search_vector = to_tsvector('english', title || ' ' || coalesce(content, ''));
create index idx_guides_search on guides using gin(search_vector);
```

### 3. Кэширование часто запрашиваемых данных:
```typescript
// В хуке или компоненте
const [cachedGuides, setCachedGuides] = useState<GuideArticle[]>([]);
const CACHE_KEY = 'guides_cache_v1';

useEffect(() => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    setCachedGuides(JSON.parse(cached));
  }
}, []);
```

## Мониторинг производительности

### KPIs для отслеживания:
1. Время загрузки главной страницы < 1сек
2. Время загрузки списка гайдов (20 шт.) < 500мс
3. Время загрузки чата (500 последних сообщений) < 300мс
4. Размер `site_data` < 1MB (данные перенесены)

### SQL для проверки:
```sql
-- Размер таблиц
select schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
from pg_tables 
where tablename in ('guides', 'wiki_articles', 'chat_messages', 'site_data');

-- Количество записей
select 'guides' as table_name, count(*) as count from guides
union all
select 'wiki_articles', count(*) from wiki_articles
union all
select 'chat_messages', count(*) from chat_messages;
```

## Откат

При необходимости восстановления старой структуры:
1. Создать резервную копию новых таблиц
2. Удалить новые таблицы
3. Восстановить данные из `site_data`