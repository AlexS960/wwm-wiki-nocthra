#!/usr/bin/env bash
# Применяет схему БД WWM Wiki на свежем PostgreSQL (self-hosted Supabase или чистый Postgres).
#
# Использование:
#   export DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/postgres"
#   ./scripts/apply-migrations.sh
#
# Или через docker:
#   DATABASE_URL="postgresql://postgres:${POSTGRES_PASSWORD}@localhost:5432/postgres" ./scripts/apply-migrations.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
MIGRATIONS_DIR="$ROOT_DIR/supabase/migrations"

: "${DATABASE_URL:?Задайте DATABASE_URL (postgresql://user:pass@host:port/dbname)}"

PSQL_OPTS=(-v ON_ERROR_STOP=1 --single-transaction)

run_sql() {
  local file="$1"
  echo "==> $(basename "$file")"
  psql "$DATABASE_URL" "${PSQL_OPTS[@]}" -f "$file"
}

echo "==> Проверка подключения"
psql "$DATABASE_URL" -c "SELECT version();" >/dev/null

echo "==> Базовая схема (setup.sql)"
run_sql "$ROOT_DIR/supabase/setup.sql"

echo "==> Миграции схемы (без data-only скриптов)"
SCHEMA_MIGRATIONS=(
  01_create_normalized_tables.sql
  04_search_pagination.sql
  05_staff_group_chat.sql
  06_guilds.sql
  07_guilds_enhance.sql
  08_secure_rls_phase1.sql
  13_rls_notes.sql
  14_site_analytics_chat_access.sql
  15_site_visits_client_ip.sql
)

for name in "${SCHEMA_MIGRATIONS[@]}"; do
  run_sql "$MIGRATIONS_DIR/$name"
done

echo "==> pm_messages"
run_sql "$ROOT_DIR/supabase/pm-messages-setup.sql"

echo "==> Storage bucket site-images"
run_sql "$ROOT_DIR/supabase/storage-setup.sql"

echo "==> Готово. Схема применена."
echo "    Для импорта данных: node scripts/migrate-from-supabase.mjs --import export.sql"
echo "    Data-only миграции (02, 09, 10, 11, 12) — только при переносе из legacy site_data."
