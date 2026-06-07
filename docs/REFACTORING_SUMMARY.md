# Реализация нормализации БД

## Выполненные изменения

### 1. Миграции БД (supabase/migrations/)

#### 01_create_normalized_tables.sql
- Создание нормализованных таблиц:
  - `guides` - гайды с полями: id, title, summary, content, category, difficulty, read_time, icon, images, author_id, author_name, created_at, updated_at
  - `guide_comments` - комментарии к гайдам с внешним ключом guide_id
  - `guide_versions` - версии гайдов для истории изменений
  - `wiki_articles` - статьи вики с индексом по разделу
  - `site_news` - новости сайта
  - `support_tickets` - тикеты поддержки
  - `chat_messages` - сообщения чата с пагинацией
  - `chat_muted_users` - muted users для чата

- Добавлены индексы для оптимизации запросов
- Настроены RLS политики
- Включены Realtime подписки

#### 02_migrate_data.sql
- Скрипт миграции данных из старой структуры (site_data) в новые таблицы
- Поддерживает перенос: гайды, комментарии, версии, вики, новости, тикеты, чат

#### 03_performance_check.sql
- Запросы для анализа производительности
- Проверка размера таблиц, индексов, статистики

### 2. Обновления кода

#### src/lib/db.ts
- Добавлены новые интерфейсы: DbGuide, DbGuideComment, DbWikiArticle, DbChatMessage
- Добавлены функции для работы с новыми таблицами:
  - `dbLoadGuides()`, `dbGetGuideById()`, `dbInsertGuide()`, `dbUpdateGuide()`, `dbDeleteGuide()`
  - `dbLoadGuideComments()`, `dbInsertGuideComment()`, `dbDeleteGuideComment()`
  - `dbLoadWikiArticles()`, `dbLoadWikiBySection()`
  - `dbLoadChatMessages()`, `dbInsertChatMessage()`, `dbDeleteChatMessage()`
  - `dbGetMutedUsers()`, `dbMuteUser()`, `dbUnmuteUser()`

#### src/lib/adapters.ts (новый файл)
- Адаптеры типов для совместимости между DB и Frontend
- Функции: `adaptGuide()`, `adaptWikiArticle()`, `adaptChatMessage()`

#### src/hooks/useGuides.ts (новый файл)
- Хук для управления гайдами
- Методы: loadGuides, loadGuideComments, addGuideComment, deleteGuideComment

#### src/hooks/useChat.ts (новый файл)
- Хук для управления чатом
- Методы: loadChat, sendMessage, deleteMessage, muteUser, unmuteUser, isUserMuted

#### src/hooks/useWiki.ts (новый файл)
- Хук для управления вики
- Методы: loadWiki, getArticleById, getArticlesBySection

#### src/lib/realtime.ts (обновлен)
- Добавлены подписки на новые таблицы:
  - `subscribeGuides()`
  - `subscribeGuideComments()`
  - `subscribeChatMessages()`
  - `subscribeWikiArticles()`

### 3. Конфигурация

#### vite.config.ts
- Добавлены sourcemaps для отладки в production

### 4. Документация

#### docs/DATABASE_MIGRATION.md
- Руководство по миграции
- Рекомендации по оптимизации
- Планы индексации и кэширования
- KPIs для мониторинга

## Производительность

### До миграции:
- Все данные в одной JSON-колонке
- Нет индексов
- Полная выборка при каждом запросе

### После миграции:
- Отдельные таблицы с индексами
- Пагинация для чата (500 сообщений по умолчанию)
- Возможность частичной загрузки данных
- Эффективные WHERE-запросы

## Рекомендации по развертыванию

1. Выполнить SQL-скрипты миграции в Supabase SQL Editor
2. Проверить подключение к базе данных
3. Запустить сборку: `npm run build`
4. Развернуть на Vercel с обновленными Environment Variables
5. После развертывания выполнить миграцию данных

## Возможные проблемы

1. **Конфликты при миграции**: если данные уже существуют, используйте `on conflict do nothing`
2. **RLS права**: убедитесь что политики Correctly настроены для anon/authenticated
3. **Realtime**: после миграции может потребоваться перезапуск realtime-подписок

## Будущие улучшения

1. Полнотекстовый поиск (PostgreSQL tsvector)
2. Кэширование на уровне Redis/Supabase Edge Functions
3. Архивация старых сообщений чата
4. Сжатие JSON-полей перед сохранением