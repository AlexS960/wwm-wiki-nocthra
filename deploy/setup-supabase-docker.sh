#!/usr/bin/env bash
# Подготовка официального self-hosted Supabase Docker на сервере.
# Запускать на VPS (Linux) из каталога репозитория:
#   chmod +x deploy/setup-supabase-docker.sh
#   ./deploy/setup-supabase-docker.sh
#
# Требования: git, docker, docker compose v2, минимум 4 GB RAM.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
UPSTREAM_DIR="$SCRIPT_DIR/supabase-upstream"
DOCKER_DIR="$UPSTREAM_DIR/docker"
ENV_SELFHOSTED="$SCRIPT_DIR/.env.selfhosted"

if [[ ! -f "$ENV_SELFHOSTED" ]]; then
  echo "Создайте deploy/.env.selfhosted из deploy/.env.selfhosted.example"
  exit 1
fi

# shellcheck disable=SC1090
source "$ENV_SELFHOSTED"

if [[ ! -d "$DOCKER_DIR" ]]; then
  echo "==> Клонирование официального Supabase Docker"
  git clone --depth 1 --branch master --single-branch \
    https://github.com/supabase/supabase.git "$UPSTREAM_DIR"
fi

if [[ ! -f "$DOCKER_DIR/.env" ]]; then
  echo "==> Копирование .env.example"
  cp "$DOCKER_DIR/.env.example" "$DOCKER_DIR/.env"
fi

echo "==> Генерация JWT-ключей (если ещё не заданы в .env)"
if [[ -x "$DOCKER_DIR/utils/generate-keys.sh" ]]; then
  (cd "$DOCKER_DIR" && ./utils/generate-keys.sh) || true
fi

echo ""
echo "==> Вручную отредактируйте $DOCKER_DIR/.env:"
echo "    POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-}"
echo "    JWT_SECRET, ANON_KEY, SERVICE_ROLE_KEY — из generate-keys.sh или deploy/.env.selfhosted"
echo "    SITE_URL=${SITE_URL:-https://$SITE_DOMAIN}"
echo "    API_EXTERNAL_URL=${SUPABASE_PUBLIC_URL:-https://$API_DOMAIN}"
echo "    SUPABASE_PUBLIC_URL=${SUPABASE_PUBLIC_URL:-https://$API_DOMAIN}"
echo ""
echo "==> Скопируйте init SQL для схемы WWM Wiki:"
INIT_TARGET="$DOCKER_DIR/volumes/db/init/99-wwm-wiki-schema.sh"
cat > "$INIT_TARGET" <<'INITSCRIPT'
#!/bin/bash
set -e
echo "WWM Wiki: применение схемы после старта Postgres..."
# Полный init выполняется через scripts/apply-migrations.sh после первого docker compose up
INITSCRIPT
chmod +x "$INIT_TARGET"

echo "==> Запуск Supabase (первый раз может занять несколько минут)"
cd "$DOCKER_DIR"
docker compose pull
docker compose up -d

echo ""
echo "==> После старта БД выполните миграции:"
echo "    DATABASE_URL=postgresql://postgres:PASSWORD@localhost:5432/postgres ../scripts/apply-migrations.sh"
echo "    (из корня репозитория, пароль из .env)"
echo ""
echo "==> Studio (опционально): http://SERVER_IP:8000 — через Kong, см. документацию Supabase"
