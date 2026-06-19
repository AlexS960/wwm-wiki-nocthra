#!/usr/bin/env bash
# Сборка и загрузка dist/ на FirstVDS VPS (Linux / macOS / Git Bash / WSL)
#
# Использование:
#   chmod +x deploy/deploy-firstvds.sh
#   ./deploy/deploy-firstvds.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

load_dotenv() {
  local file="$1"
  [[ -f "$file" ]] || return 0
  while IFS= read -r line || [[ -n "$line" ]]; do
    [[ "$line" =~ ^[[:space:]]*# ]] && continue
    [[ -z "${line// }" ]] && continue
    export "$line"
  done < "$file"
}

load_dotenv "$ROOT_DIR/.env.production"
load_dotenv "$SCRIPT_DIR/.env.deploy"

: "${SERVER_HOST:?Задайте SERVER_HOST в deploy/.env.deploy}"
: "${SERVER_USER:?Задайте SERVER_USER в deploy/.env.deploy}"
: "${REMOTE_PATH:?Задайте REMOTE_PATH в deploy/.env.deploy}"

SERVER_PORT="${SERVER_PORT:-22}"
SSH_TARGET="${SERVER_USER}@${SERVER_HOST}"

SSH_OPTS=(-p "$SERVER_PORT")
SCP_OPTS=(-r -P "$SERVER_PORT")
RSYNC_SSH="ssh -p ${SERVER_PORT}"
if [[ -n "${SSH_KEY_PATH:-}" ]]; then
  SSH_OPTS+=(-i "$SSH_KEY_PATH")
  SCP_OPTS+=(-i "$SSH_KEY_PATH")
  RSYNC_SSH="ssh -p ${SERVER_PORT} -i ${SSH_KEY_PATH}"
fi

echo "==> Сборка production (VITE_SITE_URL=${VITE_SITE_URL:-не задан})"
cd "$ROOT_DIR"
npm run deploy:build

[[ -d "$ROOT_DIR/dist" ]] || { echo "dist/ не найден"; exit 1; }

echo "==> Создание каталога на сервере: $REMOTE_PATH"
ssh "${SSH_OPTS[@]}" "$SSH_TARGET" "mkdir -p '$REMOTE_PATH'"

if command -v rsync >/dev/null 2>&1; then
  echo "==> Загрузка через rsync"
  rsync -avz --delete -e "$RSYNC_SSH" "$ROOT_DIR/dist/" "${SSH_TARGET}:${REMOTE_PATH}/"
else
  echo "==> rsync не найден, загрузка через scp"
  scp "${SCP_OPTS[@]}" "$ROOT_DIR/dist/"* "${SSH_TARGET}:${REMOTE_PATH}/"
fi

echo "==> Готово. sudo nginx -t && sudo systemctl reload nginx"
