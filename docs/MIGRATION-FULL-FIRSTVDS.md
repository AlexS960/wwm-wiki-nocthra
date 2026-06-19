# Полная миграция WWM Wiki: Vercel + Supabase → FirstVDS + REG.RU

Пошаговое руководство по переносу **фронтенда, базы данных, Realtime, Storage и API парсеров** с облачных Vercel/Supabase на свой VPS [FirstVDS](https://my.firstvds.ru/) и домен [REG.RU](https://www.reg.ru).

> **Статический деплой без БД:** если нужен только фронтенд на VPS, а Supabase остаётся в облаке — см. [DEPLOY-FIRSTVDS-REG.RU.md](./DEPLOY-FIRSTVDS-REG.RU.md).

---

## Содержание

1. [Архитектура](#1-архитектура)
2. [Требования к VPS](#2-требования-к-vps)
3. [Что использует приложение](#3-что-использует-приложение)
4. [Подготовка сервера](#4-подготовка-сервера)
5. [Self-hosted Supabase (Docker)](#5-self-hosted-supabase-docker)
6. [Применение схемы БД](#6-применение-схемы-бд)
7. [Экспорт данных из облачного Supabase](#7-экспорт-данных-из-облачного-supabase)
8. [Импорт на свой сервер](#8-импорт-на-свой-сервер)
9. [Storage (картинки)](#9-storage-картинки)
10. [DNS на REG.RU](#10-dns-на-regru)
11. [SSL (Certbot)](#11-ssl-certbot)
12. [Sync API (парсеры админки)](#12-sync-api-парсеры-админки)
13. [Сборка фронтенда](#13-сборка-фронтенда)
14. [Отключение Vercel](#14-отключение-vercel)
15. [Чеклист проверки](#15-чеклист-проверки)
16. [Риски и откат](#16-риски-и-откат)
17. [Урезанный вариант (мало RAM)](#17-урезанный-вариант-мало-ram)

---

## 1. Архитектура

```
Браузер
   │
   ├─ https://ваш-домен.ru          → nginx → /var/www/wwm-wiki (SPA)
   ├─ https://ваш-домен.ru/api/sync-content → nginx → sync-api :3001
   └─ https://api.ваш-домен.ru      → nginx → Kong (Supabase Docker) :8000
                                              ├─ /rest/v1   PostgREST
                                              ├─ /realtime/v1
                                              └─ /storage/v1
```

**Почему self-hosted Supabase, а не «голый» Postgres:**

- Фронтенд уже использует `@supabase/supabase-js` — тот же REST, Realtime и Storage API.
- Миграции в `supabase/migrations/` рассчитаны на `supabase_realtime`, RLS для `anon`, bucket `site-images`.
- **Supabase Auth не используется** — логин через таблицу `accounts` и anon-ключ (как в облаке).

---

## 2. Требования к VPS

| Режим | RAM | CPU | Диск | Комментарий |
|-------|-----|-----|------|-------------|
| **Полный Supabase Docker** | **4 GB+** (рекомендуется) | 2 vCPU | 20+ GB SSD | Kong, Postgres, Realtime, Storage, Studio |
| Минимальный (возможны сбои) | 2 GB | 1 vCPU | 15 GB | OOM при `docker compose up`, отключите Studio |
| Только Postgres | 1–2 GB | 1 vCPU | 10 GB | Без Realtime/Storage — см. [§17](#17-урезанный-вариант-мало-ram) |

ОС: **Ubuntu 22.04 LTS**.

---

## 3. Что использует приложение

### Таблицы (нужно перенести данные)

| Таблица | Назначение |
|---------|------------|
| `accounts` | Пользователи, роли, `password_hash` |
| `accounts_public` | View без `password_hash` |
| `registered_guilds` | Реестр гильдий |
| `site_data` | Настройки сайта (JSON по ключам) |
| `user_progress` | Прогресс игроков |
| `guides`, `guide_comments`, `guide_versions` | Гайды |
| `wiki_articles` | Вики |
| `site_news` | Новости |
| `support_tickets` | Тикеты поддержки |
| `chat_messages`, `chat_muted_users` | Общий чат |
| `pm_messages` | Личные сообщения |
| `staff_group_*` | Служебный групповой чат |
| `site_visits` | Аналитика посещений |

### Supabase-функции

- **PostgREST** — все запросы из `src/lib/db.ts`, `pmDb.ts`, `staffGroupChat.ts`
- **Realtime** — `src/lib/realtime.ts`, `pmRealtime.ts`, staff group channels
- **Storage** — bucket `site-images` (`src/lib/storage.ts`)
- **Auth (GoTrue)** — **не используется**

### RLS

Политики `anon_all_*` — полный доступ для anon-роли (как в облаке). Строгая безопасность — в коде приложения.

### Вне Vercel/Supabase

- `/api/sync-content` — парсеры вики (`api/sync-content.mjs`) → на VPS: `server/index.mjs`

---

## 4. Подготовка сервера

```bash
ssh root@ВАШ_IP
apt update && apt upgrade -y
apt install -y docker.io docker-compose-plugin nginx certbot python3-certbot-nginx git rsync postgresql-client
usermod -aG docker deploy   # если есть пользователь deploy
```

Скопируйте репозиторий на сервер или клонируйте с GitHub.

```bash
cp deploy/.env.selfhosted.example deploy/.env.selfhosted
nano deploy/.env.selfhosted   # домены, пароли — не коммитить!
```

---

## 5. Self-hosted Supabase (Docker)

Используется **официальный** стек Supabase (не кастомный форк):

```bash
chmod +x deploy/setup-supabase-docker.sh
./deploy/setup-supabase-docker.sh
```

Скрипт клонирует `https://github.com/supabase/supabase` в `deploy/supabase-upstream/` и запускает `docker compose` из `docker/`.

### Настройка `.env` Supabase

Отредактируйте `deploy/supabase-upstream/docker/.env`:

```env
POSTGRES_PASSWORD=...          # из deploy/.env.selfhosted
JWT_SECRET=...
ANON_KEY=...                 # тот же, что VITE_SUPABASE_ANON_KEY при сборке
SERVICE_ROLE_KEY=...
SITE_URL=https://ваш-домен.ru
API_EXTERNAL_URL=https://api.ваш-домен.ru
SUPABASE_PUBLIC_URL=https://api.ваш-домен.ru
```

Ключи сгенерируйте: `cd deploy/supabase-upstream/docker && ./utils/generate-keys.sh`

Перезапуск:

```bash
cd deploy/supabase-upstream/docker
docker compose down && docker compose up -d
```

Проверка (с сервера):

```bash
curl -s http://127.0.0.1:8000/rest/v1/ -H "apikey: ВАШ_ANON_KEY"
```

---

## 6. Применение схемы БД

После первого старта Postgres:

```bash
export DATABASE_URL="postgresql://postgres:ВАШ_ПАРОЛЬ@127.0.0.1:5432/postgres"
chmod +x scripts/apply-migrations.sh
./scripts/apply-migrations.sh
```

Скрипт выполняет:

- `supabase/setup.sql`
- миграции схемы: `01`, `04`–`08`, `13`–`15`
- `pm-messages-setup.sql`, `storage-setup.sql`

**Не выполняются автоматически** (data-only / legacy): `02`, `09`, `10`, `11`, `12` — при необходимости вручную после импорта данных.

---

## 7. Экспорт данных из облачного Supabase

### Вариант A: скрипт REST (с Windows, перед переключением DNS)

В [Supabase Dashboard](https://supabase.com/dashboard) → **Project Settings → API** скопируйте:

- Project URL
- **service_role** key (секрет, не путать с anon!)

На Windows в корне проекта:

```powershell
$env:SUPABASE_URL="https://xxxx.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="eyJ..."
node scripts/migrate-from-supabase.mjs --export > export.sql
```

### Вариант B: pg_dump (предпочтительно для больших БД)

Dashboard → **Database → Backups** или подключение через `psql` / Supabase CLI:

```bash
pg_dump "postgresql://postgres.[ref]:[password]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres" \
  --data-only --schema=public -f export-data.sql
```

### Вариант C: SQL Editor

Для малых таблиц — `COPY` / `SELECT` вручную (неудобно для `wiki_articles`).

---

## 8. Импорт на свой сервер

```bash
export DATABASE_URL="postgresql://postgres:ПАРОЛЬ@127.0.0.1:5432/postgres"
node scripts/migrate-from-supabase.mjs --import export.sql
# или
psql "$DATABASE_URL" -f export.sql
```

После импорта (опционально, очистка legacy):

```bash
psql "$DATABASE_URL" -f supabase/migrations/12_hard_delete_cleanup.sql
```

Проверка:

```bash
psql "$DATABASE_URL" -c "SELECT count(*) FROM accounts;"
psql "$DATABASE_URL" -c "SELECT count(*) FROM wiki_articles;"
```

---

## 9. Storage (картинки)

Bucket `site-images` создаётся через `storage-setup.sql`. **Файлы** нужно перенести отдельно.

### Supabase CLI

```bash
npx supabase login
npx supabase storage cp -r ss://site-images ./storage-backup --project-ref ВАШ_REF
# На self-hosted (после настройки):
npx supabase storage cp -r ./storage-backup ss://site-images --project-ref local
```

### Вручную

Dashboard → Storage → `site-images` → скачать объекты. Загрузить через Studio self-hosted или API `/storage/v1/object/site-images/...`.

**Без переноса Storage:** старые URL `https://xxx.supabase.co/storage/v1/object/public/site-images/...` перестанут работать после отключения облака. Новые загрузки пойдут на свой API.

---

## 10. DNS на REG.RU

В панели REG.RU для домена добавьте **A-записи** на IP VPS:

| Имя | Тип | Значение |
|-----|-----|----------|
| `@` | A | IP VPS |
| `www` | A | IP VPS |
| `api` | A | IP VPS |

Пример: сайт `wwm-wiki.example.ru`, API `api.wwm-wiki.example.ru`.

Распространение DNS: от нескольких минут до 24–48 ч.

---

## 11. SSL (Certbot)

```bash
sudo cp deploy/nginx-full-stack.conf /etc/nginx/sites-available/wwm-wiki-full
# Замените домены в файле!
sudo ln -sf /etc/nginx/sites-available/wwm-wiki-full /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

sudo certbot --nginx -d wwm-wiki.example.ru -d www.wwm-wiki.example.ru -d api.wwm-wiki.example.ru
```

---

## 12. Sync API (парсеры админки)

### Docker

```bash
cd deploy
docker compose up -d sync-api
```

### Или systemd (без Docker)

```bash
# /etc/systemd/system/wwm-sync-api.service
[Unit]
Description=WWM Wiki Sync API
After=network.target

[Service]
Type=simple
User=deploy
WorkingDirectory=/home/deploy/wwm-wiki
EnvironmentFile=/home/deploy/wwm-wiki/deploy/.env.selfhosted
ExecStart=/usr/bin/node server/index.mjs
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

В `deploy/.env.selfhosted`: `SYNC_API_SECRET=...` — тот же секрет вводится в админке (Парсеры).

Nginx проксирует `/api/sync-content` → `127.0.0.1:3001` (см. `deploy/nginx-full-stack.conf`).

---

## 13. Сборка фронтенда

На **Windows** (перед загрузкой на сервер):

```powershell
# .env.production в корне проекта
VITE_SUPABASE_URL=https://api.wwm-wiki.example.ru
VITE_SUPABASE_ANON_KEY=eyJ...   # ANON_KEY из self-hosted
VITE_SITE_URL=https://wwm-wiki.example.ru

npm run build
./deploy/deploy-firstvds.sh
```

Или вручную: `scp -r dist/* deploy@IP:/var/www/wwm-wiki/`

---

## 14. Отключение Vercel

1. Убедитесь, что DNS указывает на FirstVDS и сайт работает 24–48 ч.
2. [vercel.com](https://vercel.com) → проект → Settings → удалить домен или поставить проект на паузу.
3. Облачный Supabase: **не удаляйте сразу** — держите 1–2 недели как бэкап.
4. После проверки: Supabase Dashboard → Pause project / Delete (осторожно).

---

## 15. Чеклист проверки

- [ ] Главная страница открывается по HTTPS
- [ ] **Логин / регистрация** — `accounts`
- [ ] **Вики** — статьи, поиск
- [ ] **Чат** — отправка, realtime (второй браузер видит сообщение)
- [ ] **ЛС** — `pm_messages`, realtime
- [ ] **Прогресс** — сохранение `user_progress`
- [ ] **Админка** — роли, настройки `site_data`
- [ ] **Парсеры** — `/api/sync-content` с `SYNC_API_SECRET`
- [ ] **Загрузка картинки** — Storage `site-images`
- [ ] **Аналитика** — `site_visits` (админ)
- [ ] **Служебный чат** — staff group (если используется)

---

## 16. Риски и откат

| Риск | Митигация |
|------|-----------|
| OOM на 2 GB RAM | Тариф 4 GB; отключить Studio в compose |
| Несовпадение JWT / anon key | Один `generate-keys.sh`, те же ключи в `.env.production` |
| Потеря Storage | Бэкап bucket до отключения облака |
| Realtime не работает | Проверить publication `supabase_realtime`, порт 8000, wss через nginx |
| Откат | Вернуть A-записи REG.RU на Vercel; временно старые `VITE_*` в сборке |

**Откат за 5 минут:** REG.RU → старые A-записи на Vercel IP; фронт снова с облачным Supabase URL.

---

## 17. Урезанный вариант (мало RAM)

Если 4 GB недоступны:

1. Установите только **PostgreSQL 15** (`apt install postgresql`).
2. `./scripts/apply-migrations.sh` с `DATABASE_URL` на локальный Postgres.
3. Импортируйте данные.
4. Поднимите **PostgREST** вручную или используйте прямой доступ (потребуются изменения фронтенда — **не рекомендуется**).

**Ограничения без полного Supabase:**

- Нет **Realtime** — чат/настройки без live-обновлений (нужен polling или рефакторинг).
- Нет **Storage API** — загрузка картинок не работает без доработки (локальные файлы / S3).
- Нет Kong — нужен другой URL для REST.

Для production WWM Wiki рекомендуется **полный Supabase Docker на 4 GB VPS**.

---

## Файлы в репозитории

| Файл | Назначение |
|------|------------|
| `deploy/setup-supabase-docker.sh` | Клон и запуск официального Supabase |
| `deploy/docker-compose.yml` | sync-api |
| `deploy/nginx-full-stack.conf` | nginx: SPA + API + Supabase |
| `deploy/.env.selfhosted.example` | Шаблон переменных |
| `scripts/apply-migrations.sh` | Схема БД |
| `scripts/migrate-from-supabase.mjs` | Экспорт/импорт данных |
| `server/index.mjs` | Sync API вместо Vercel |

---

*Домен в примерах: `wwm-wiki.example.ru` — замените на свой.*
