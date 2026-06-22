# Развёртывание WWM Wiki на FirstVDS и подключение домена REG.RU

Пошаговая инструкция для переноса **только фронтенда** (статический SPA из `dist/`) на VPS [FirstVDS](https://my.firstvds.ru/). База данных и API остаются на [Supabase](https://supabase.com/) — миграция БД не требуется.

> **Полная миграция (БД + Realtime + Storage + отказ от Vercel):** см. **[MIGRATION-FULL-FIRSTVDS.md](./MIGRATION-FULL-FIRSTVDS.md)** — self-hosted Supabase на Docker, экспорт данных, sync-api, DNS для `api.поддомен`.

> **Домен проекта:** `wwm-wiki-nocthra.ru` (VPS: `62.109.19.21`).  
> **Текущий Vercel-деплой** продолжит работать параллельно, пока вы не переключите DNS.

---

## Содержание

1. [Что куда переезжает](#1-что-куда-переезжает)
2. [Заказ VPS на FirstVDS](#2-заказ-vps-на-firstvds)
3. [Первичная настройка сервера](#3-первичная-настройка-сервера)
4. [Установка nginx](#4-установка-nginx)
5. [Подключение домена на REG.RU](#5-подключение-домена-на-regru)
6. [SSL (Let's Encrypt)](#6-ssl-lets-encrypt)
7. [Сборка и переменные окружения](#7-сборка-и-переменные-окружения)
8. [Загрузка сайта на сервер](#8-загрузка-сайта-на-сервер)
9. [Обновление сайта после изменений](#9-обновление-сайта-после-изменений)
10. [Особенности проекта](#10-особенности-проекта)
11. [Проверка и устранение неполадок](#11-проверка-и-устранение-неполадок)
12. [Чеклист](#12-чеклист)

---

## 1. Что куда переезжает

| Компонент | Только фронт (этот документ) | Полная миграция |
|-----------|------------------------------|-----------------|
| React + Vite SPA (`dist/`) | **FirstVDS** — `/var/www/wwm-wiki/` | **FirstVDS** |
| Supabase (БД, realtime, storage) | **Облако Supabase** | **Self-hosted Docker** — [MIGRATION-FULL-FIRSTVDS.md](./MIGRATION-FULL-FIRSTVDS.md) |
| `/api/sync-content` | **Vercel** или `server/index.mjs` на VPS | **sync-api** на VPS (`deploy/docker-compose.yml`) |
| Домен | **REG.RU** → A на IP VPS | **REG.RU** → A для сайта и `api.` поддомена |

---

## 2. Заказ VPS на FirstVDS

1. Войдите в [личный кабинет FirstVDS](https://my.firstvds.ru/).
2. Закажите VPS (для статического сайта достаточно минимального тарифа: 1 CPU, 1–2 GB RAM, 10+ GB SSD).
3. Выберите ОС: **Ubuntu 22.04 LTS** (рекомендуется).
4. После создания VPS запишите:
   - **IP-адрес** сервера (например `62.109.19.21`);
   - **логин** (часто `root`);
   - **пароль** или способ входа по SSH-ключу.

---

## 3. Первичная настройка сервера

Подключитесь с Windows (PowerShell или cmd):

```powershell
ssh root@62.109.19.21
```

При первом входе смените пароль root, если система попросит.

### Обновление системы

```bash
apt update && apt upgrade -y
```

### Создание пользователя для деплоя (рекомендуется)

```bash
adduser deploy
usermod -aG sudo deploy
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/ 2>/dev/null || true
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys 2>/dev/null || true
```

Дальнейшие команды можно выполнять от `deploy` с `sudo`.

### Файрвол (UFW)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

Порты **80** (HTTP) и **443** (HTTPS) должны быть открыты для веб-трафика.

### Node.js на сервере — нужен ли?

**Вариант A (рекомендуется):** собирать проект **на Windows** и загружать только `dist/`. Node на VPS не нужен.

**Вариант B:** клонировать репозиторий на сервер и собирать там:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v && npm -v
```

---

## 4. Установка nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### Каталог сайта

```bash
sudo mkdir -p /var/www/wwm-wiki
sudo chown -R deploy:www-data /var/www/wwm-wiki
sudo chmod -R 755 /var/www/wwm-wiki
```

### Конфигурация

Скопируйте файл из репозитория `deploy/nginx-wwm-wiki.conf` на сервер:

```bash
# На вашем ПК (PowerShell), из корня проекта:
scp deploy/nginx-wwm-wiki.conf deploy@62.109.19.21:/tmp/wwm-wiki.conf
```

На сервере отредактируйте домен:

```bash
sudo nano /tmp/wwm-wiki.conf
# При необходимости проверьте server_name (wwm-wiki-nocthra.ru)
sudo cp /tmp/wwm-wiki.conf /etc/nginx/sites-available/wwm-wiki
sudo ln -sf /etc/nginx/sites-available/wwm-wiki /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

Конфиг обеспечивает:

- **SPA-маршрутизацию** — `try_files $uri $uri/ /index.html`;
- **gzip** для текстовых типов;
- **кэш** для `/assets/` и `/images/`;
- **no-cache** для `index.html` и `service-worker.js`;
- заготовку под **HTTPS** (certbot допишет `listen 443`).

---

## 5. Подключение домена на REG.RU

### 5.1. Узнайте IP VPS

В панели FirstVDS → ваш сервер → **IP-адрес**. Обозначим его `62.109.19.21`.

### 5.2. DNS-записи в REG.RU

1. Войдите в [REG.RU](https://www.reg.ru) → **Домены** → ваш домен → **Управление зоной DNS** (или «DNS-серверы и управление зоной»).
2. Если домен использует DNS REG.RU (ns1.reg.ru, ns2.reg.ru) — добавьте записи:

| Тип | Имя (хост) | Значение | TTL |
|-----|------------|----------|-----|
| **A** | `@` | `62.109.19.21` | 3600 |
| **A** | `www` | `62.109.19.21` | 3600 |

- `@` — корень домена (`wwm-wiki-nocthra.ru`);
- `www` — поддомен (`www.wwm-wiki-nocthra.ru`).

3. Удалите или измените старые A/CNAME-записи, указывающие на Vercel, если они больше не нужны.

### 5.3. DNS-серверы: REG.RU vs VPS

| Сценарий | Когда использовать |
|----------|-------------------|
| **DNS REG.RU** (по умолчанию) | Проще всего: правите A-записи в личном кабинете REG.RU |
| **Свои NS на VPS** | Если на сервере поднят BIND/PowerDNS — делегируете NS в REG.RU. Для одного сайта обычно **не нужно** |

Для большинства случаев достаточно **A-записей в зоне REG.RU**.

### 5.4. Ожидание распространения DNS

- Обычно **15 минут — 24 часа** (зависит от TTL и кэша провайдеров).
- Проверка с Windows:

```powershell
nslookup wwm-wiki-nocthra.ru
nslookup www.wwm-wiki-nocthra.ru
```

Оба должны вернуть IP вашего VPS.

### 5.5. Обновление VITE_SITE_URL

После выбора финального домена задайте его **до сборки**:

```env
VITE_SITE_URL=https://wwm-wiki-nocthra.ru
```

Без слэша в конце. Это обновит `sitemap.xml`, `robots.txt`, canonical и Open Graph (см. раздел 10).

---

## 6. SSL (Let's Encrypt)

После того как DNS указывает на VPS и nginx отвечает на порту 80:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d wwm-wiki-nocthra.ru -d www.wwm-wiki-nocthra.ru
```

Certbot:

- получит сертификат;
- настроит `listen 443 ssl`;
- предложит редирект HTTP → HTTPS (рекомендуется **да**).

Автопродление:

```bash
sudo certbot renew --dry-run
```

Проверьте сайт: `https://wwm-wiki-nocthra.ru`

---

## 7. Сборка и переменные окружения

Переменные `VITE_*` **вшиваются в JavaScript при сборке**. Их нужно задать **до** `npm run build`.

### 7.1. Файл `.env.production`

Скопируйте шаблон:

```powershell
copy deploy\.env.production.example .env.production
```

Заполните (значения из Supabase → Project Settings → API):

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_SITE_URL=https://wwm-wiki-nocthra.ru
```

> **Не коммитьте** `.env.production` в git — в нём секреты.

### 7.2. Сборка

```powershell
npm run deploy:build
```

Или по шагам:

```powershell
npm run build
```

Результат — каталог `dist/` со всем статическим содержимым.

### 7.3. Что генерируется при сборке

Скрипт `scripts/generate-seo.mjs` создаёт:

- `public/robots.txt`
- `public/sitemap.xml`

с актуальным `VITE_SITE_URL`. Плагин Vite подставляет тот же URL в `index.html` (canonical, og:url, og:image).

---

## 8. Загрузка сайта на сервер

### 8.1. Настройка deploy-переменных

```powershell
copy deploy\.env.deploy.example deploy\.env.deploy
```

Отредактируйте `deploy/.env.deploy`:

```env
SERVER_HOST=62.109.19.21
SERVER_USER=deploy
REMOTE_PATH=/var/www/wwm-wiki
```

### 8.2. Автоматический деплой (Windows)

```powershell
.\deploy\deploy-firstvds.ps1
```

Скрипт:

1. загружает `.env.production` и `.env.deploy`;
2. выполняет `npm run deploy:build`;
3. синхронизирует `dist/` на сервер через **rsync** (если установлен) или **scp**.

### 8.3. Ручная загрузка (scp)

```powershell
npm run deploy:build
scp -r dist/* deploy@62.109.19.21:/var/www/wwm-wiki/
```

### 8.4. Деплой через Git на сервере (вариант B)

```bash
# На сервере
cd ~
git clone https://github.com/YOUR_USER/wwm-wiki-nocthra.git
cd wwm-wiki-nocthra
cp deploy/.env.production.example .env.production
nano .env.production   # заполнить VITE_*
npm ci
npm run deploy:build
sudo rsync -av --delete dist/ /var/www/wwm-wiki/
```

### 8.5. Права на файлы

```bash
sudo chown -R deploy:www-data /var/www/wwm-wiki
sudo find /var/www/wwm-wiki -type d -exec chmod 755 {} \;
sudo find /var/www/wwm-wiki -type f -exec chmod 644 {} \;
sudo systemctl reload nginx
```

---

## 9. Обновление сайта после изменений

### 9.1. Автоматически (GitHub Actions)

При push в ветку `main` workflow [`.github/workflows/deploy-firstvds.yml`](../.github/workflows/deploy-firstvds.yml) собирает фронтенд и выкладывает `dist/` на VPS через rsync.

**Secrets** (GitHub → Settings → Secrets and variables → Actions):

| Secret | Значение |
|--------|----------|
| `SSH_HOST` | IP VPS, например `62.109.19.21` |
| `SSH_USER` | SSH-пользователь, например `root` или `deploy` |
| `SSH_PRIVATE_KEY` | Приватный ключ (PEM), одной строкой с `\n` или многострочно |
| `REMOTE_PATH` | `/var/www/wwm-wiki` |
| `VITE_SUPABASE_URL` | URL Supabase |
| `VITE_SUPABASE_ANON_KEY` | anon key |
| `VITE_SITE_URL` | `https://wwm-wiki-nocthra.ru` |

На сервере в `~/.ssh/authorized_keys` пользователя деплоя должен быть **публичный** ключ, парный `SSH_PRIVATE_KEY`. Подробнее: [deploy/README.md](../deploy/README.md).

### 9.2. Вручную (локально)

1. Внесите изменения в код локально.
2. Убедитесь, что `.env.production` актуален.
3. Запустите `.\deploy\deploy-firstvds.ps1` или `npm run deploy:build` + scp/rsync.
4. На сервере: `sudo systemctl reload nginx` (обычно не обязательно для статики).

Пользователям с установленным PWA/service worker: при крупных обновлениях увеличьте версию кэша в `public/service-worker.js` (константа `CACHE_NAME`, например `wwm-wiki-v6`).

---

## 10. Особенности проекта

### Supabase

- `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY` — единственные обязательные секреты для фронтенда.
- В Supabase Dashboard → **Authentication → URL Configuration** добавьте новый домен в **Site URL** и **Redirect URLs**, если используете OAuth или magic links.

### SPA-маршрутизация

Все пути (`/weapons`, `/guides`, …) обслуживаются через `index.html`. Это настроено в `deploy/nginx-wwm-wiki.conf`. Без `try_files` прямые ссылки дадут 404.

### SEO и SITE_URL

| Файл / место | Назначение |
|--------------|------------|
| `VITE_SITE_URL` в `.env.production` | Главный источник URL для production |
| `scripts/generate-seo.mjs` | `robots.txt`, `sitemap.xml` |
| `src/lib/seo.ts` | Canonical и JSON-LD в рантайме |
| `vite.config.ts` | Подстановка URL в `index.html` при сборке |

Альтернативное имя переменной для скриптов: `SITE_URL` (без префикса `VITE_`).

### Service Worker

Файл `public/service-worker.js`:

- **не кэширует** HTML и JS (избегает битых lazy-чанков после деплоя);
- кэширует только изображения;
- nginx отдаёт SW с заголовком `no-cache`.

После смены домена пользователи получат новый SW при следующем визите; при проблемах — увеличьте `CACHE_NAME`.

### Vercel (параллельный деплой)

- Скрипты `npm run vercel:deploy` и `vercel.json` **не затронуты**.
- Пока DNS указывает на Vercel, сайт работает там; после переключения A-записей — на FirstVDS.
- Админские парсеры (`/api/sync-content`) останутся на Vercel, если нужны — используйте Vercel URL только для админки или поднимите отдельный API.

### base path

В `vite.config.ts` задано `base: '/'` — корректно для домена в корне (`https://wwm-wiki-nocthra.ru/`). Менять не нужно, если сайт не в подкаталоге.

---

## 11. Проверка и устранение неполадок

### Сайт не открывается

```bash
sudo nginx -t
sudo systemctl status nginx
curl -I http://localhost
```

### 502 / connection refused

- nginx не запущен: `sudo systemctl start nginx`
- неверный `root` в конфиге

### 404 на внутренних страницах

- проверьте `try_files $uri $uri/ /index.html;` в конфиге nginx
- перезагрузите nginx: `sudo systemctl reload nginx`

### Белый экран / ошибка Supabase

- пересоберите с правильными `VITE_SUPABASE_*` в `.env.production`
- проверьте консоль браузера (F12)

### Старый контент после деплоя

- жёсткое обновление: Ctrl+Shift+R
- увеличьте `CACHE_NAME` в service worker
- убедитесь, что `index.html` не кэшируется CDN/браузером надолго

### certbot не выдаёт сертификат

- DNS ещё не обновился — подождите и повторите
- порт 80 закрыт файрволом
- домен в nginx `server_name` не совпадает с реальным

### Проверка SEO-файлов

```bash
curl https://wwm-wiki-nocthra.ru/robots.txt
curl https://wwm-wiki-nocthra.ru/sitemap.xml
```

В `robots.txt` должна быть строка `Sitemap: https://wwm-wiki-nocthra.ru/sitemap.xml`.

---

## 12. Чеклист

- [ ] VPS FirstVDS заказан, Ubuntu 22.04
- [ ] SSH работает, UFW: 22, 80, 443
- [ ] nginx установлен, конфиг `wwm-wiki` включён
- [ ] A-записи `@` и `www` в REG.RU → IP VPS
- [ ] DNS резолвится (`nslookup`)
- [ ] `.env.production` с `VITE_SUPABASE_*` и `VITE_SITE_URL`
- [ ] `npm run deploy:build` успешен
- [ ] `dist/` загружен в `/var/www/wwm-wiki/`
- [ ] `certbot --nginx` выполнен
- [ ] Сайт открывается по HTTPS
- [ ] Внутренние маршруты SPA работают
- [ ] `sitemap.xml` и `robots.txt` с новым доменом
- [ ] Supabase Auth: добавлен новый Site URL (если нужен)
- [ ] (Опционально) DNS переключён с Vercel, Vercel оставлен для `/api`

---

## Файлы в репозитории

| Файл | Назначение |
|------|------------|
| `deploy/nginx-wwm-wiki.conf` | Конфиг nginx для SPA |
| `deploy/deploy-firstvds.ps1` | Деплой с Windows |
| `deploy/deploy-firstvds.sh` | Деплой с Linux/macOS/WSL |
| `deploy/.env.production.example` | Шаблон переменных сборки |
| `deploy/.env.deploy.example` | Шаблон SSH/пути на сервере |
| `docs/DEPLOY-FIRSTVDS-REG.RU.md` | Эта инструкция |

При вопросах по FirstVDS: [база знаний FirstVDS](https://firstvds.ru/technology).  
По DNS REG.RU: раздел «Помощь» в личном кабинете REG.RU.
