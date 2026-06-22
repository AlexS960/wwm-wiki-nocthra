# Deploy scripts (FirstVDS)

Скрипты и конфиги для выкладки статического фронтенда (`dist/`) на VPS FirstVDS.

| Файл | Назначение |
|------|------------|
| `deploy-firstvds.ps1` | Сборка + rsync/scp с Windows |
| `deploy-firstvds.sh` | То же для Linux / macOS / WSL |
| `.env.deploy.example` | SSH: хост, пользователь, путь на сервере |
| `.env.production.example` | `VITE_*` для production-сборки |
| `nginx-wwm-wiki.conf` | Конфиг nginx для SPA |

Полная инструкция: **[docs/DEPLOY-FIRSTVDS-REG.RU.md](../docs/DEPLOY-FIRSTVDS-REG.RU.md)**.

## GitHub Actions (авто-деплой при push в `main`)

Workflow: [`.github/workflows/deploy-firstvds.yml`](../.github/workflows/deploy-firstvds.yml)

**Как это работает:** вы делаете `git push` в GitHub → Actions собирает `dist/` → заливает на VPS по SSH.  
Сайт для пользователей по-прежнему на **VPS**, GitHub только запускает робота-сборщика.

### Быстрая настройка (один раз)

#### 1. SSH-ключ для деплоя

На Windows (PowerShell), если ключа ещё нет:

```powershell
ssh-keygen -t ed25519 -f $env:USERPROFILE\.ssh\wwm-wiki-deploy -N '""'
```

- **Приватный** ключ (`wwm-wiki-deploy`) → в GitHub Secrets  
- **Публичный** (`wwm-wiki-deploy.pub`) → на VPS в `~/.ssh/authorized_keys` пользователя деплоя

На VPS:

```bash
mkdir -p ~/.ssh && chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys   # вставьте строку из .pub файла
chmod 600 ~/.ssh/authorized_keys
mkdir -p /var/www/wwm-wiki
chown -R deploy:www-data /var/www/wwm-wiki   # если пользователь deploy
```

Проверка с ПК:

```powershell
ssh -i $env:USERPROFILE\.ssh\wwm-wiki-deploy deploy@62.109.19.21 "echo OK"
```

#### 2. Secrets в GitHub

Репозиторий → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Secret | Пример / описание |
|--------|-------------------|
| `SSH_HOST` | `62.109.19.21` |
| `SSH_USER` | `root` или `deploy` |
| `SSH_PRIVATE_KEY` | **Весь** файл `wwm-wiki-deploy` (от `-----BEGIN` до `-----END`) |
| `REMOTE_PATH` | `/var/www/wwm-wiki` |
| `VITE_SUPABASE_URL` | URL проекта Supabase |
| `VITE_SUPABASE_ANON_KEY` | anon public key |
| `VITE_SITE_URL` | `https://wwm-wiki-nocthra.ru` |

Опционально (SEO, верификация поисковиков):

| Secret | Описание |
|--------|----------|
| `VITE_GOOGLE_SITE_VERIFICATION` | Код из Search Console |
| `VITE_YANDEX_VERIFICATION` | Код из Яндекс Вебмастер |
| `VITE_BING_SITE_VERIFICATION` | Код из Bing Webmaster |

Опционально (команда на VPS после каждого деплоя):

| Secret | Пример |
|--------|--------|
| `VPS_POST_DEPLOY_CMD` | `sudo nginx -t && sudo systemctl reload nginx` |

Для reload nginx без пароля настройте sudoers для пользователя deploy.

#### 3. Первый автодеплой

```powershell
git add .
git commit -m "feat: update site"
git push origin main
```

GitHub → вкладка **Actions** → workflow **Deploy to FirstVDS** → зелёная галочка = сайт обновлён.

Ручной запуск без push: **Actions** → **Deploy to FirstVDS** → **Run workflow**.

### Локальный деплой (без GitHub)

Если Actions не настроен или нужен срочный выклад:

```powershell
# deploy/.env.deploy + .env.production в корне
.\deploy\deploy-firstvds.ps1
```

Linux / WSL: `./deploy/deploy-firstvds.sh`

### Поведение workflow

1. `npm ci` → `npm run deploy:build` с секретами `VITE_*`
2. `rsync -avz --delete dist/` на VPS
3. (Опционально) `VPS_POST_DEPLOY_CMD` на сервере
4. Проверка: `curl` на `/health.json` и главную страницу

## Sync-api (парсеры в админке)

Статический `dist/` не выполняет парсеры. На VPS нужен Node-сервис `server/index.mjs` (порт `3001`) и прокси в nginx:

1. Скопируйте `deploy/nginx-full-stack.conf` (блок `location /api/sync-content`) или добавьте его в текущий конфиг.
2. В `deploy/.env.selfhosted` задайте `SYNC_API_SECRET=…` — тот же секрет вводится в админке → Парсеры.
3. Запуск: `docker compose -f deploy/docker-compose.yml up -d sync-api` или systemd-сервис `wwm-sync-api` (см. [docs/MIGRATION-FULL-FIRSTVDS.md](../docs/MIGRATION-FULL-FIRSTVDS.md)).
4. Проверка: `curl -s http://127.0.0.1:3001/health` → `{"ok":true,"service":"sync-api"}`.

Подробнее: [docs/SUPABASE-SELFHOST-BEGINNER-RU.md](../docs/SUPABASE-SELFHOST-BEGINNER-RU.md) (раздел Sync API).
