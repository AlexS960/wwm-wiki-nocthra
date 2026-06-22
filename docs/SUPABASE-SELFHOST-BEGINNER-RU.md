# Self-hosted Supabase на FirstVDS — пошаговое руководство для начинающих

> **Для кого этот документ:** вы впервые настраиваете VPS, Docker и Supabase. Здесь — максимально подробные шаги с объяснением «что и зачем».  
> **Полная миграция (Vercel + Supabase → FirstVDS):** см. [MIGRATION-FULL-FIRSTVDS.md](./MIGRATION-FULL-FIRSTVDS.md).

**Проект:** WWM Wiki  
**Домен сайта:** `wwm-wiki-nocthra.ru`  
**Домен API Supabase:** `api.wwm-wiki-nocthra.ru`  
**IP VPS (FirstVDS):** `62.109.19.21`

---

## Содержание

1. [Что мы делаем (простыми словами)](#1-что-мы-делаем-простыми-словами)
2. [Что понадобится заранее](#2-что-понадобится-заранее)
3. [Схема: что где выполняется](#3-схема-что-где-выполняется)
4. [Часть A — на вашем ПК (Windows)](#часть-a--на-вашем-пк-windows)
5. [Часть B — на сервере FirstVDS (VPS)](#часть-b--на-сервере-firstvds-vps)
6. [Часть C — снова на ПК: сборка и деплой фронтенда](#часть-c--снова-на-пк-сборка-и-деплой-фронтенда)
7. [Проверка: всё ли работает](#7-проверка-всё-ли-работает)
8. [Типичные проблемы и решения](#8-типичные-проблемы-и-решения)
9. [Словарь терминов](#9-словарь-терминов)

---

## 1. Что мы делаем (простыми словами)

Сейчас сайт WWM Wiki использует **облачный Supabase** (база данных, чат в реальном времени, хранение картинок). Мы переносим всё это на **ваш собственный сервер** (VPS от FirstVDS).

После настройки:

```
Браузер пользователя
   │
   ├─ https://wwm-wiki-nocthra.ru          → nginx → статические файлы сайта
   ├─ https://wwm-wiki-nocthra.ru/api/sync-content → sync-api (парсеры админки)
   └─ https://api.wwm-wiki-nocthra.ru      → nginx → Supabase (Docker) :8000
                                              ├─ /rest/v1   — база данных (REST)
                                              ├─ /realtime/v1 — чат в реальном времени
                                              └─ /storage/v1  — картинки (bucket site-images)
```

**Почему именно Supabase в Docker, а не «просто PostgreSQL»:** фронтенд уже написан под Supabase API (`@supabase/supabase-js`). Self-hosted Supabase даёт тот же REST, Realtime и Storage — без переписывания кода.

**Supabase Auth (логин через email от Supabase) не используется** — вход через таблицу `accounts` и anon-ключ, как в облаке.

---

## 2. Что понадобится заранее

### Сервер (FirstVDS)

| Параметр | Минимум | Рекомендуется |
|----------|---------|---------------|
| **RAM** | 2 GB (возможны сбои) | **4 GB и больше** |
| **CPU** | 1 vCPU | 2 vCPU |
| **Диск** | 15 GB SSD | 20+ GB SSD |
| **ОС** | — | **Ubuntu 22.04 LTS** |

> ⚠️ На 2 GB RAM Docker может «убить» процессы из- нехватки памяти (OOM). Для production WWM Wiki нужен тариф **4 GB RAM**.

### Домен и DNS (REG.RU)

В панели REG.RU для домена `wwm-wiki-nocthra.ru` понадобятся **A-записи** на IP `62.109.19.21`:

| Имя (поддомен) | Тип | Значение | Зачем |
|----------------|-----|----------|-------|
| `@` | A | `62.109.19.21` | Основной сайт |
| `www` | A | `62.109.19.21` | www-версия |
| **`api`** | A | **`62.109.19.21`** | **Supabase API** (`api.wwm-wiki-nocthra.ru`) |

DNS может обновляться от нескольких минут до 24–48 часов. SSL-сертификат (HTTPS) выдадут только когда DNS уже указывает на сервер.

### На вашем ПК (Windows)

- [ ] Установлен **Git** и **Node.js** (LTS, для экспорта данных и сборки фронта)
- [ ] Есть доступ к **облачному Supabase Dashboard** (для экспорта данных)
- [ ] Есть **SSH-доступ** к VPS (логин/пароль или ключ от FirstVDS)
- [ ] Клонирован репозиторий проекта (или готов скопировать файлы на сервер)

### Доступы, которые нужно сохранить в блокнот (не в Git!)

| Переменная | Где взять | Где использовать |
|------------|-----------|------------------|
| `POSTGRES_PASSWORD` | Придумать сами (длинный пароль) | `deploy/.env.selfhosted`, Supabase Docker `.env` |
| `JWT_SECRET`, `ANON_KEY`, `SERVICE_ROLE_KEY` | Сгенерировать на сервере (`generate-keys.sh`) | Supabase Docker `.env`, `.env.production` |
| `SUPABASE_SERVICE_ROLE_KEY` (облако) | Dashboard → Project Settings → API → **service_role** | Только для экспорта на ПК |
| `SYNC_API_SECRET` | Придумать сами | `deploy/.env.selfhosted`, админка → Парсеры |

---

## 3. Схема: что где выполняется

| Шаг | Где | Кратко |
|-----|-----|--------|
| Клонирование репозитория, экспорт данных из облака | **ПК (Windows)** | PowerShell |
| Установка Docker, Supabase, nginx, импорт БД | **Сервер (VPS)** | SSH → bash |
| Сборка фронтенда, загрузка на сервер | **ПК (Windows)** | PowerShell |
| DNS, SSL | **REG.RU + сервер** | Браузер + SSH |

Дальше шаги помечены значками:

- 🖥️ **ПК** — выполняйте в PowerShell на Windows  
- 🖧 **Сервер** — выполняйте после `ssh root@62.109.19.21` (или `ssh deploy@62.109.19.21`)

---

# Часть A — на вашем ПК (Windows)

## A1. Клонировать репозиторий (если ещё не сделано)

🖥️ **ПК**

```powershell
cd D:\Site
git clone https://github.com/ВАШ_АККАУНТ/wwm-wiki-nocthra.git
cd wwm-wiki-nocthra
npm install
```

**Что это делает:** скачивает код проекта и ставит зависимости Node.js для сборки и скриптов миграции.

---

## A2. Подготовить шаблон переменных для сервера

🖥️ **ПК**

```powershell
copy deploy\.env.selfhosted.example deploy\.env.selfhosted
notepad deploy\.env.selfhosted
```

**Что редактировать** (пока можно оставить заглушки — финальные ключи появятся на сервере):

```env
SITE_DOMAIN=wwm-wiki-nocthra.ru
API_DOMAIN=api.wwm-wiki-nocthra.ru
SUPABASE_PUBLIC_URL=https://api.wwm-wiki-nocthra.ru

POSTGRES_PASSWORD=change-me-strong-postgres-password
DATABASE_URL=postgresql://postgres:change-me-strong-postgres-password@localhost:5432/postgres

JWT_SECRET=your-super-secret-jwt-token-with-at-least-32-characters-long
ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

VITE_SUPABASE_URL=https://api.wwm-wiki-nocthra.ru
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SITE_URL=https://wwm-wiki-nocthra.ru

SYNC_API_SECRET=wwm-sync-change-me
SYNC_API_PORT=3001

SERVER_HOST=62.109.19.21
SERVER_USER=deploy
REMOTE_PATH=/var/www/wwm-wiki
```

> ⚠️ **Никогда не коммитьте** `deploy/.env.selfhosted` с реальными паролями в Git!

**Что это делает:** один файл с настройками для сервера, Supabase Docker и сборки фронта. Скопируете его на VPS на следующем шаге.

---

## A3. Скопировать проект на сервер

🖥️ **ПК** (вариант через `scp` — замените путь и пользователя при необходимости)

```powershell
scp -r D:\Site\wwm-wiki-nocthra deploy@62.109.19.21:/home/deploy/
```

**Что это делает:** загружает весь проект на VPS. Альтернатива — на сервере выполнить `git clone` (см. часть B).

---

## A4. Экспорт данных из облачного Supabase (ДО переключения DNS)

🖥️ **ПК** — делайте **пока облачный Supabase ещё работает**.

### Шаг 1: взять ключи в Supabase Dashboard

1. Откройте [supabase.com/dashboard](https://supabase.com/dashboard)
2. Выберите ваш проект
3. **Project Settings → API**
4. Скопируйте:
   - **Project URL** (например `https://xxxx.supabase.co`)
   - **service_role** key — это **секрет**, не путать с `anon`!

### Шаг 2: запустить скрипт экспорта

🖥️ **ПК**

```powershell
cd D:\Site\wwm-wiki-nocthra

$env:SUPABASE_URL="https://xxxx.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="eyJ...ваш-service-role-ключ..."

node scripts/migrate-from-supabase.mjs --export > export.sql
```

**Что это делает:** скрипт через REST API скачивает строки из таблиц (`accounts`, `wiki_articles`, `chat_messages` и др.) и формирует SQL-файл `export.sql` для импорта на свой Postgres.

**Проверка:** файл `export.sql` должен быть не пустым (откройте в блокноте — там будут строки `INSERT INTO ...`).

> **Альтернатива для больших баз:** `pg_dump` из Dashboard → Database → Backups. Подробнее — [MIGRATION-FULL-FIRSTVDS.md §7](./MIGRATION-FULL-FIRSTVDS.md#7-экспорт-данных-из-облачного-supabase).

> **Storage (картинки)** этим скриптом **не переносится** — только таблицы. Картинки — отдельно (см. [раздел B10](#b10-storage-картинки-опционально)).

---

# Часть B — на сервере FirstVDS (VPS)

## B1. Подключиться по SSH

🖧 **Сервер**

На Windows в PowerShell:

```powershell
ssh root@62.109.19.21
```

Или, если FirstVDS создал пользователя `deploy`:

```powershell
ssh deploy@62.109.19.21
```

**Что это делает:** открывает удалённую командную строку на VPS. Все команды ниже в части B — **на сервере**, пока вы в этой SSH-сессии.

---

## B2. Обновить систему и установить базовые пакеты

🖧 **Сервер**

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git nginx certbot python3-certbot-nginx rsync postgresql-client curl
```

**Что это делает:**

- `apt update/upgrade` — обновляет список пакетов и систему
- `git` — клонирование репозитория
- `nginx` — веб-сервер (раздаёт сайт и проксирует API)
- `certbot` — бесплатные SSL-сертификаты (HTTPS)
- `postgresql-client` — утилита `psql` для импорта SQL
- `rsync` — быстрая загрузка файлов с ПК

---

## B3. Установить Docker на Ubuntu 22.04

🖧 **Сервер**

### Вариант 1 — официальный скрипт Docker (проще для новичка)

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

**Что это делает:** ставит Docker Engine и плагин `docker compose`. Команда `usermod` даёт вашему пользователю право запускать Docker без `sudo`.

**Важно:** после `usermod` **выйдите из SSH и зайдите снова**, иначе группа `docker` не применится:

```bash
exit
# снова: ssh deploy@62.109.19.21
```

### Вариант 2 — через apt (как в основной документации проекта)

```bash
sudo apt install -y docker.io docker-compose-plugin
sudo usermod -aG docker $USER
```

### Проверка установки

🖧 **Сервер**

```bash
docker --version
docker compose version
docker run hello-world
```

**Ожидаемый результат:** версии Docker и сообщение «Hello from Docker!».

---

## B4. Получить код проекта на сервере

🖧 **Сервер** — если ещё не скопировали с ПК:

```bash
cd ~
git clone https://github.com/ВАШ_АККАУНТ/wwm-wiki-nocthra.git
cd wwm-wiki-nocthra
```

Если копировали через `scp`, перейдите в каталог:

```bash
cd ~/wwm-wiki-nocthra
```

### Создать файл переменных

🖧 **Сервер**

```bash
cp deploy/.env.selfhosted.example deploy/.env.selfhosted
nano deploy/.env.selfhosted
```

Задайте **надёжный** `POSTGRES_PASSWORD` и сохраните (`Ctrl+O`, Enter, `Ctrl+X`).

**Что это делает:** Supabase и скрипты миграции будут читать пароли и домены из этого файла.

---

## B5. Запустить setup-supabase-docker.sh

🖧 **Сервер** (из **корня репозитория**)

```bash
cd ~/wwm-wiki-nocthra
chmod +x deploy/setup-supabase-docker.sh
./deploy/setup-supabase-docker.sh
```

**Что делает скрипт по шагам:**

1. Проверяет наличие `deploy/.env.selfhosted`
2. Клонирует официальный репозиторий Supabase в `deploy/supabase-upstream/`
3. Копирует `.env.example` → `deploy/supabase-upstream/docker/.env`
4. Запускает `generate-keys.sh` для JWT-ключей (если доступен)
5. Запускает `docker compose pull` и `docker compose up -d`

**Первый запуск может занять 5–15 минут** — Docker скачивает образы (Postgres, Kong, Realtime, Storage и др.).

Проверить, что контейнеры поднялись:

🖧 **Сервер**

```bash
cd ~/wwm-wiki-nocthra/deploy/supabase-upstream/docker
docker compose ps
```

Должны быть контейнеры в статусе `running` (или `healthy`).

---

## B6. Настроить .env Supabase Docker (ключи и домены)

🖧 **Сервер**

Скрипт напечатает подсказки. Отредактируйте файл Supabase:

```bash
nano ~/wwm-wiki-nocthra/deploy/supabase-upstream/docker/.env
```

**Обязательно согласуйте** со значениями из `deploy/.env.selfhosted`:

```env
POSTGRES_PASSWORD=change-me-strong-postgres-password

JWT_SECRET=your-super-secret-jwt-token-with-at-least-32-characters-long
ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

SITE_URL=https://wwm-wiki-nocthra.ru
API_EXTERNAL_URL=https://api.wwm-wiki-nocthra.ru
SUPABASE_PUBLIC_URL=https://api.wwm-wiki-nocthra.ru
```

### Сгенерировать ключи (если ещё пустые)

🖧 **Сервер**

```bash
cd ~/wwm-wiki-nocthra/deploy/supabase-upstream/docker
chmod +x utils/generate-keys.sh
./utils/generate-keys.sh
```

**Что это делает:** создаёт `JWT_SECRET`, `ANON_KEY`, `SERVICE_ROLE_KEY`. **Скопируйте их** в:

- `deploy/supabase-upstream/docker/.env`
- `deploy/.env.selfhosted`
- позже — в `.env.production` на ПК для сборки фронта

> ⚠️ **ANON_KEY должен быть одинаковым** в Supabase Docker и в `VITE_SUPABASE_ANON_KEY` при `npm run build`. Иначе сайт не сможет обращаться к API.

Перезапуск после правок:

🖧 **Сервер**

```bash
cd ~/wwm-wiki-nocthra/deploy/supabase-upstream/docker
docker compose down
docker compose up -d
```

### Быстрая проверка API локально

🖧 **Сервер** (подставьте ваш `ANON_KEY`)

```bash
curl -s http://127.0.0.1:8000/rest/v1/ -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Ожидаемый результат:** JSON-ответ (не ошибка соединения). Пустой список или описание API — нормально до применения схемы.

---

## B7. Применить схему базы данных

После первого старта Postgres нужно создать таблицы, RLS, bucket Storage.

🖧 **Сервер**

```bash
cd ~/wwm-wiki-nocthra

# Подставьте пароль из deploy/.env.selfhosted
export DATABASE_URL="postgresql://postgres:change-me-strong-postgres-password@127.0.0.1:5432/postgres"

chmod +x scripts/apply-migrations.sh
./scripts/apply-migrations.sh
```

**Что делает скрипт:**

- `supabase/setup.sql` — базовая настройка
- миграции схемы: `01`, `04`–`08`, `13`–`15`
- `pm-messages-setup.sql` — личные сообщения
- `storage-setup.sql` — bucket `site-images`

**Не выполняются автоматически** (только данные / legacy): миграции `02`, `09`, `10`, `11`, `12`.

---

## B8. Импорт данных из export.sql

### Вариант 1: скопировать export.sql с ПК на сервер

🖥️ **ПК**

```powershell
scp D:\Site\wwm-wiki-nocthra\export.sql deploy@62.109.19.21:/home/deploy/wwm-wiki-nocthra/
```

### Вариант 2: импорт на сервере

🖧 **Сервер**

```bash
cd ~/wwm-wiki-nocthra
export DATABASE_URL="postgresql://postgres:change-me-strong-postgres-password@127.0.0.1:5432/postgres"

node scripts/migrate-from-supabase.mjs --import export.sql
```

**Или через psql напрямую:**

```bash
psql "$DATABASE_URL" -f export.sql
```

**Проверка количества записей:**

🖧 **Сервер**

```bash
psql "$DATABASE_URL" -c "SELECT count(*) FROM accounts;"
psql "$DATABASE_URL" -c "SELECT count(*) FROM wiki_articles;"
```

Числа должны совпадать с облаком (примерно).

---

## B9. DNS на REG.RU

🌐 **Браузер** (панель REG.RU) + проверка с ПК/сервера

В личном кабинете REG.RU → домен `wwm-wiki-nocthra.ru` → DNS / зона:

| Имя | Тип | Значение |
|-----|-----|----------|
| `@` | A | `62.109.19.21` |
| `www` | A | `62.109.19.21` |
| `api` | A | `62.109.19.21` |

**Проверка** (с ПК или сервера, когда DNS обновится):

```bash
ping api.wwm-wiki-nocthra.ru
```

Должен отвечать IP `62.109.19.21`.

---

## B10. Storage (картинки) — опционально, но желательно

Bucket `site-images` создаётся SQL-скриптом, но **файлы** нужно перенести отдельно.

**Варианты:**

1. **Supabase CLI** — см. [MIGRATION-FULL-FIRSTVDS.md §9](./MIGRATION-FULL-FIRSTVDS.md#9-storage-картинки)
2. **Вручную** — скачать из облачного Dashboard → Storage → `site-images`, загрузить через self-hosted Studio или API

**Без переноса:** старые URL вида `https://xxx.supabase.co/storage/v1/object/public/site-images/...` перестанут работать после отключения облака. Новые загрузки пойдут на `https://api.wwm-wiki-nocthra.ru/storage/v1/...`.

---

## B11. Настроить nginx (сайт + api-поддомен)

🖧 **Сервер**

```bash
sudo cp ~/wwm-wiki-nocthra/deploy/nginx-full-stack.conf /etc/nginx/sites-available/wwm-wiki-full
sudo ln -sf /etc/nginx/sites-available/wwm-wiki-full /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

**Что делает конфиг** (`deploy/nginx-full-stack.conf`):

| Блок | Домен | Куда проксирует |
|------|-------|-----------------|
| Первый `server` | `wwm-wiki-nocthra.ru`, `www` | Статика из `/var/www/wwm-wiki`, `/api/sync-content` → `:3001` |
| Второй `server` | **`api.wwm-wiki-nocthra.ru`** | **Supabase Kong → `127.0.0.1:8000`** |

Создайте каталог для сайта (пока пустой — фронт загрузите позже):

🖧 **Сервер**

```bash
sudo mkdir -p /var/www/wwm-wiki
sudo chown -R deploy:deploy /var/www/wwm-wiki
```

---

## B12. SSL-сертификат (HTTPS)

🖧 **Сервер** — **только когда DNS уже указывает на VPS**

```bash
sudo certbot --nginx -d wwm-wiki-nocthra.ru -d www.wwm-wiki-nocthra.ru -d api.wwm-wiki-nocthra.ru
```

**Что это делает:** Let's Encrypt выдаст сертификаты; certbot сам обновит конфиг nginx для HTTPS.

Следуйте подсказкам (email, согласие с условиями). Выберите редирект HTTP → HTTPS, если спросит.

**Проверка API по HTTPS** (после certbot, с вашим ANON_KEY):

```bash
curl -s https://api.wwm-wiki-nocthra.ru/rest/v1/ -H "apikey: ВАШ_ANON_KEY"
```

---

## B13. Запустить Sync API (парсеры админки)

Sync API заменяет Vercel serverless для `/api/sync-content`.

### Вариант A — Docker (рекомендуется)

🖧 **Сервер**

```bash
cd ~/wwm-wiki-nocthra/deploy
docker compose up -d sync-api
docker compose ps
```

**Что это делает:** поднимает `server/index.mjs` в контейнере на `127.0.0.1:3001`. Nginx проксирует `/api/sync-content` с основного домена.

### Вариант B — systemd (без Docker)

Создайте `/etc/systemd/system/wwm-sync-api.service`:

```ini
[Unit]
Description=WWM Wiki Sync API
After=network.target

[Service]
Type=simple
User=deploy
WorkingDirectory=/home/deploy/wwm-wiki-nocthra
EnvironmentFile=/home/deploy/wwm-wiki-nocthra/deploy/.env.selfhosted
ExecStart=/usr/bin/node server/index.mjs
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now wwm-sync-api
```

### Проверка health

🖧 **Сервер**

```bash
curl -s http://127.0.0.1:3001/health
```

Ожидается: `{"ok":true,"service":"sync-api"}`.

В `deploy/.env.selfhosted` задайте `SYNC_API_SECRET=wwm-sync-change-me` — **тот же секрет** вводится в админке (раздел «Парсеры»).

---

# Часть C — снова на ПК: сборка и деплой фронтенда

## C1. Создать .env.production

🖥️ **ПК**

```powershell
cd D:\Site\wwm-wiki-nocthra
copy deploy\.env.production.example .env.production
notepad .env.production
```

**Содержимое** (ключи — **те же**, что в Supabase Docker):

```env
VITE_SUPABASE_URL=https://api.wwm-wiki-nocthra.ru
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SITE_URL=https://wwm-wiki-nocthra.ru
```

> ⚠️ Переменные `VITE_*` **вшиваются в JavaScript** при сборке. Если поменяете ключи на сервере — нужна **пересборка** и повторная загрузка `dist/`.

**Что это делает:** фронтенд будет обращаться к вашему API на `api.wwm-wiki-nocthra.ru`, а не к облаку.

---

## C2. Собрать и загрузить на сервер

🖥️ **ПК**

```powershell
npm run build
```

Или через скрипт деплоя (нужны `SERVER_HOST`, `SERVER_USER` в `deploy/.env.selfhosted` или `deploy/.env.deploy`):

```powershell
# Git Bash / WSL:
./deploy/deploy-firstvds.sh
```

**Ручная загрузка** (PowerShell):

```powershell
scp -r dist\* deploy@62.109.19.21:/var/www/wwm-wiki/
```

🖧 **Сервер** — перезагрузить nginx:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

## 7. Проверка: всё ли работает

Выполняйте **после** DNS, SSL и деплоя фронта.

### 7.1. С сервера

🖧 **Сервер**

```bash
# Supabase REST
curl -s https://api.wwm-wiki-nocthra.ru/rest/v1/ -H "apikey: ВАШ_ANON_KEY"

# Sync API
curl -s http://127.0.0.1:3001/health

# Контейнеры Supabase
cd ~/wwm-wiki-nocthra/deploy/supabase-upstream/docker && docker compose ps
```

### 7.2. В браузере (чеклист)

- [ ] `https://wwm-wiki-nocthra.ru` — главная открывается по HTTPS
- [ ] **Логин / регистрация** — таблица `accounts`
- [ ] **Вики** — статьи, поиск
- [ ] **Чат** — сообщение видно во втором браузере/вкладке (Realtime)
- [ ] **Личные сообщения** — отправка и получение
- [ ] **Прогресс игрока** — сохраняется
- [ ] **Админка** — настройки, роли
- [ ] **Парсеры** — `/api/sync-content` с секретом из админки
- [ ] **Загрузка картинки** — Storage `site-images`
- [ ] **Аналитика** — `site_visits` в админке

### 7.3. DevTools (для отладки)

1. Откройте сайт → `F12` → вкладка **Network**
2. Обновите страницу
3. Запросы к `api.wwm-wiki-nocthra.ru` должны быть **200**, не CORS/error

---

## 8. Типичные проблемы и решения

### «Cannot connect to Docker» / permission denied

**Причина:** пользователь не в группе `docker`.  
**Решение:**

```bash
sudo usermod -aG docker $USER
exit
# войти по SSH снова
```

---

### Контейнеры падают, сервер «зависает» (OOM)

**Причина:** мало RAM (2 GB).  
**Решение:** тариф FirstVDS **4 GB+**; временно отключить Supabase Studio в `docker compose` (см. [MIGRATION-FULL-FIRSTVDS.md §17](./MIGRATION-FULL-FIRSTVDS.md#17-урезанный-вариант-мало-ram)).

Проверка:

```bash
dmesg | grep -i oom
free -h
```

---

### Сайт открывается, но «ошибка сети» / пустые данные

**Причина:** неверный `VITE_SUPABASE_URL` или `VITE_SUPABASE_ANON_KEY` в сборке.  
**Решение:**

1. Убедитесь, что `ANON_KEY` в Supabase `.env` = `VITE_SUPABASE_ANON_KEY` в `.env.production`
2. Пересоберите: `npm run build` и загрузите `dist/` заново

---

### `401` / `JWT` errors на API

**Причина:** `JWT_SECRET` меняли после генерации ключей, или ключи не совпадают.  
**Решение:** один раз запустите `generate-keys.sh`, скопируйте все три ключа в оба `.env`, перезапустите `docker compose`, пересоберите фронт.

---

### Realtime (чат) не обновляется live

**Проверьте:**

1. API доступен по **HTTPS**: `wss://api.wwm-wiki-nocthra.ru/realtime/v1/...`
2. В nginx для `api` есть заголовки `Upgrade` и `Connection` (уже в `nginx-full-stack.conf`)
3. Схема применена: `./scripts/apply-migrations.sh`
4. Контейнер `realtime` running: `docker compose ps`

---

### `api.wwm-wiki-nocthra.ru` не открывается / certbot fails

**Причина:** DNS A-запись `api` ещё не указывает на `62.109.19.21`.  
**Решение:** подождать распространения DNS; проверить `ping api.wwm-wiki-nocthra.ru`; только потом `certbot`.

---

### `psql: connection refused` при миграциях

**Причина:** Postgres ещё не поднялся или Supabase Docker не запущен.  
**Решение:**

```bash
cd ~/wwm-wiki-nocthra/deploy/supabase-upstream/docker
docker compose ps
docker compose logs db
# подождать 1–2 минуты после первого up -d
```

---

### Импорт export.sql — ошибки duplicate key

**Причина:** данные уже частично импортированы.  
**Решение:** скрипт экспорта использует `ON CONFLICT DO NOTHING` — часть дубликатов нормальна. Для чистого импорта — новая БД или удаление данных из таблиц (осторожно!).

---

### Парсеры админки не работают

**Проверьте:**

```bash
curl -s http://127.0.0.1:3001/health
cd ~/wwm-wiki-nocthra/deploy && docker compose logs sync-api
```

- `SYNC_API_SECRET` в `deploy/.env.selfhosted` = секрет в админке
- nginx проксирует `/api/sync-content` на `:3001`

---

### Откат на облако за 5 минут

1. REG.RU — вернуть старые A-записи (если были на Vercel)
2. Собрать фронт со **старыми** `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` облака
3. Не удаляйте облачный Supabase сразу — держите 1–2 недели как бэкап

Подробнее: [MIGRATION-FULL-FIRSTVDS.md §16](./MIGRATION-FULL-FIRSTVDS.md#16-риски-и-откат).

---

## 9. Словарь терминов

| Термин | Простое объяснение |
|--------|-------------------|
| **VPS** | Виртуальный сервер в интернете (ваш FirstVDS) |
| **SSH** | Удалённый доступ к серверу через командную строку |
| **Docker** | «Коробки» с программами — Supabase запускается в контейнерах |
| **nginx** | Программа, которая отдаёт сайт и направляет запросы к API |
| **Supabase** | Платформа: Postgres + REST API + Realtime + Storage |
| **Kong** | Шлюз на порту 8000 — единая точка входа для Supabase API |
| **ANON_KEY** | Публичный ключ для браузера (вшивается в фронт) |
| **SERVICE_ROLE_KEY** | Секретный ключ с полным доступом — только на сервере / экспорт |
| **RLS** | Row Level Security — правила доступа к строкам в Postgres |
| **Certbot** | Бесплатные SSL-сертификаты для HTTPS |

---

## Файлы проекта (шпаргалка)

| Файл | Назначение |
|------|------------|
| `deploy/setup-supabase-docker.sh` | Клон и запуск официального Supabase Docker |
| `deploy/.env.selfhosted.example` | Шаблон переменных сервера |
| `deploy/nginx-full-stack.conf` | nginx: SPA + `api.` + sync-api |
| `deploy/docker-compose.yml` | Контейнер sync-api |
| `scripts/apply-migrations.sh` | Схема БД на свежем Postgres |
| `scripts/migrate-from-supabase.mjs` | Экспорт/импорт данных |
| `server/index.mjs` | Sync API (`/api/sync-content`) |
| `deploy/.env.production.example` | Шаблон для сборки фронта |

---

## Порядок шагов (краткая шпаргалка)

| # | Где | Действие |
|---|-----|----------|
| 1 | ПК | Экспорт `export.sql` из облачного Supabase |
| 2 | Сервер | Docker, клон проекта, `deploy/.env.selfhosted` |
| 3 | Сервер | `./deploy/setup-supabase-docker.sh` |
| 4 | Сервер | Правка `supabase-upstream/docker/.env`, `generate-keys.sh` |
| 5 | Сервер | `./scripts/apply-migrations.sh` |
| 6 | Сервер | Импорт `export.sql` |
| 7 | REG.RU | A-записи `@`, `www`, **`api`** → `62.109.19.21` |
| 8 | Сервер | nginx + certbot |
| 9 | Сервер | `docker compose up -d sync-api` |
| 10 | ПК | `.env.production` → `npm run build` → загрузка `dist/` |
| 11 | Браузер | Чеклист проверки |

---

*Домен: `wwm-wiki-nocthra.ru` · API: `api.wwm-wiki-nocthra.ru` · VPS: `62.109.19.21`*
