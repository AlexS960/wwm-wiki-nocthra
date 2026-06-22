# Сборка и загрузка dist/ на FirstVDS VPS (Windows PowerShell)
# Требования: Node.js, npm, OpenSSH (scp) — встроен в Windows 10+
# Опционально: rsync через Git for Windows / WSL для инкрементальной синхронизации
#
# Использование:
#   1. Скопируйте deploy/.env.deploy.example → deploy/.env.deploy
#   2. Скопируйте deploy/.env.production.example → .env.production (в корне проекта)
#   3. .\deploy\deploy-firstvds.ps1

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Resolve-Path (Join-Path $ScriptDir "..")

function Load-DotEnv {
    param([string]$Path)
    if (-not (Test-Path $Path)) { return }
    Get-Content $Path | ForEach-Object {
        if ($_ -match '^\s*#' -or $_ -match '^\s*$') { return }
        $parts = $_ -split '=', 2
        if ($parts.Count -eq 2) {
            $key = $parts[0].Trim()
            $val = $parts[1].Trim().Trim('"').Trim("'")
            Set-Item -Path "env:$key" -Value $val
        }
    }
}

Load-DotEnv (Join-Path $RootDir ".env.production")
Load-DotEnv (Join-Path $ScriptDir ".env.deploy")

$SERVER_HOST = $env:SERVER_HOST
$SERVER_USER = $env:SERVER_USER
$REMOTE_PATH = $env:REMOTE_PATH
$SERVER_PORT = if ($env:SERVER_PORT) { $env:SERVER_PORT } else { "22" }
$SSH_KEY_PATH = $env:SSH_KEY_PATH

if (-not $SERVER_HOST -or -not $SERVER_USER -or -not $REMOTE_PATH) {
    Write-Error @"
Задайте переменные в deploy/.env.deploy:
  SERVER_HOST  — IP VPS FirstVDS
  SERVER_USER  — SSH-пользователь
  REMOTE_PATH  — например /var/www/wwm-wiki
"@
}

Write-Host "==> Сборка production (VITE_SITE_URL=$($env:VITE_SITE_URL))" -ForegroundColor Cyan
Push-Location $RootDir
try {
    npm run deploy:build
    if ($LASTEXITCODE -ne 0) { throw "npm run deploy:build завершился с кодом $LASTEXITCODE" }
} finally {
    Pop-Location
}

$DistDir = Join-Path $RootDir "dist"
if (-not (Test-Path $DistDir)) {
    Write-Error "Каталог dist/ не найден после сборки"
}

$sshTarget = "${SERVER_USER}@${SERVER_HOST}"
$sshArgs = @("-p", $SERVER_PORT)
if ($SSH_KEY_PATH) { $sshArgs += @("-i", $SSH_KEY_PATH) }

Write-Host "==> Создание каталога на сервере: $REMOTE_PATH" -ForegroundColor Cyan
& ssh @sshArgs $sshTarget "mkdir -p '$REMOTE_PATH'"

$rsync = Get-Command rsync -ErrorAction SilentlyContinue
if ($rsync) {
    Write-Host "==> Загрузка через rsync" -ForegroundColor Cyan
    $rsyncArgs = @(
        "-avz", "--delete",
        "-e", "ssh -p $SERVER_PORT" + $(if ($SSH_KEY_PATH) { " -i `"$SSH_KEY_PATH`"" } else { "" })
    )
    if ($SSH_KEY_PATH) {
        & rsync -avz --delete -e "ssh -p $SERVER_PORT -i `"$SSH_KEY_PATH`"" "$DistDir/" "${sshTarget}:${REMOTE_PATH}/"
    } else {
        & rsync -avz --delete -e "ssh -p $SERVER_PORT" "$DistDir/" "${sshTarget}:${REMOTE_PATH}/"
    }
} else {
    Write-Host "==> rsync не найден, загрузка через scp" -ForegroundColor Yellow
    $scpArgs = @("-r", "-P", $SERVER_PORT)
    if ($SSH_KEY_PATH) { $scpArgs += @("-i", $SSH_KEY_PATH) }
    $scpArgs += @("$DistDir/*", "${sshTarget}:${REMOTE_PATH}/")
    & scp @scpArgs
}

Write-Host "==> Готово. Проверьте сайт: https://$($env:VITE_SITE_URL -replace '^https?://','')" -ForegroundColor Green
$siteUrl = if ($env:VITE_SITE_URL) { $env:VITE_SITE_URL.TrimEnd('/') } else { "https://wwm-wiki-nocthra.ru" }
try {
    $health = Invoke-WebRequest -Uri "$siteUrl/health.json" -UseBasicParsing -TimeoutSec 15
    Write-Host "==> health.json: $($health.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "==> health.json недоступен (DNS или SSL?) — проверьте сайт вручную" -ForegroundColor Yellow
}
Write-Host "    На сервере: sudo nginx -t && sudo systemctl reload nginx" -ForegroundColor Gray
