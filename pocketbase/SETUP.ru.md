# Переезд на PocketBase

Пошаговая инструкция для сайта WWM Wiki (Nocthra).

## 1. Скачать PocketBase

Windows: [https://github.com/pocketbase/pocketbase/releases](https://github.com/pocketbase/pocketbase/releases)  
Скачайте `pocketbase_*_windows_amd64.zip`, распакуйте `pocketbase.exe` в папку `pocketbase/` этого проекта.

## 2. Запустить сервер

```powershell
cd pocketbase
.\pocketbase.exe serve --http=127.0.0.1:8090
```

Админка: [http://127.0.0.1:8090/_/](http://127.0.0.1:8090/_/)  
При первом запуске создайте email и пароль администратора.

## 3. Создание коллекций

### Способ A — скрипт (рекомендуется)

```powershell
copy .env.migrate.example .env.migrate
# укажите POCKETBASE_ADMIN_EMAIL и POCKETBASE_ADMIN_PASSWORD

node scripts/setup-pocketbase-collections.mjs
```

### Способ B — импорт в админке

1. **Settings** → **Import collections**
2. Файл `pocketbase/pb_schema.json` (формат PocketBase **0.23+**, поле `fields`, не `schema`)

Должны появиться: `accounts`, `site_data`, `user_progress`, `site_images`.

### Ошибка «Invalid collections configuration»

Чаще всего PocketBase **0.23+**, а в JSON старый формат с `"schema"`. Используйте актуальный `pb_schema.json` из репозитория или **способ A** (скрипт).

Проверка версии: в админке внизу или `pocketbase.exe --version`.

> Правила API открыты для клиента (как было с anon-ключом Supabase). Для продакшена лучше вынести запись в backend или ограничить правила.

## 4. Настроить фронтенд

Скопируйте `.env.example` в `.env`:

```powershell
copy .env.example .env
```

Содержимое `.env`:

```env
VITE_POCKETBASE_URL=http://127.0.0.1:8090
```

Установите зависимости и запустите сайт:

```powershell
npm install
npm run dev
```

## 5. Перенести данные из Supabase (опционально)

Если в Supabase уже есть пользователи, чат, вики и т.д.:

1. Скопируйте `.env.migrate.example` → `.env.migrate`
2. Заполните URL и ключ Supabase + логин админа PocketBase
3. Убедитесь, что PocketBase запущен
4. Выполните:

```powershell
node scripts/migrate-supabase-to-pocketbase.mjs
```

Скрипт переносит таблицы `accounts`, `site_data`, `user_progress`.  
Картинки из Supabase Storage **не копируются** автоматически — старые URL продолжат открываться, новые загрузки пойдут в PocketBase.

## 6. Деплой PocketBase в интернет

Варианты:

| Способ | Сложность | Стоимость |
|--------|-----------|-----------|
| VPS (Timeweb, Aeza, Hetzner) + `pocketbase serve` | Средняя | ~300–500 ₽/мес |
| Docker на VPS | Средняя | ~300–500 ₽/mес |
| Fly.io / Railway | Проще | Free tier / trial |

На VPS:

```bash
./pocketbase serve --http=0.0.0.0:8090
```

В `.env` продакшена укажите:

```env
VITE_POCKETBASE_URL=https://pb.ваш-домен.ru
```

Рекомендуется reverse proxy (Caddy/Nginx) с HTTPS.

## 7. Резервное копирование

Папка `pocketbase/pb_data/` — вся база и файлы. Копируйте её регулярно.

```powershell
# остановите pocketbase, затем:
xcopy /E /I pocketbase\pb_data backup\pb_data-2026-05-23
```

## Устранение проблем

| Симптом | Решение |
|---------|---------|
| Сайт не загружается | Проверьте, что PocketBase запущен и URL в `.env` верный |
| Ошибка коллекции | Повторно импортируйте `pb_schema.json` |
| CORS при деплое | PocketBase по умолчанию разрешает CORS; при прокси проверьте заголовки |
| Realtime не обновляется | Убедитесь, что SSE не блокируется прокси/firewall |

## Что изменилось в коде

- `src/lib/pocketbase.ts` — клиент SDK
- `src/lib/db.ts` — работа с коллекциями
- `src/lib/realtime.ts` — подписки PocketBase
- `src/lib/storage.ts` — коллекция `site_images`
- Supabase удалён из зависимостей
