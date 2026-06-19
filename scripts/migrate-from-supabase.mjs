#!/usr/bin/env node
/**
 * Экспорт данных из облачного Supabase → SQL для self-hosted Postgres.
 *
 * Экспорт (нужен service role key для полного доступа):
 *   SUPABASE_URL=https://xxx.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
 *   node scripts/migrate-from-supabase.mjs --export > export.sql
 *
 * Или через .env (VITE_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY).
 *
 * Импорт на свой сервер:
 *   DATABASE_URL=postgresql://postgres:pass@localhost:5432/postgres \
 *   node scripts/migrate-from-supabase.mjs --import export.sql
 *
 * Альтернатива: pg_dump из Supabase Dashboard → Database → Backups (полный дамп).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

/** Порядок важен из-за внешних ключей */
const TABLES = [
  'accounts',
  'registered_guilds',
  'site_data',
  'user_progress',
  'guides',
  'guide_comments',
  'guide_versions',
  'wiki_articles',
  'site_news',
  'support_tickets',
  'chat_messages',
  'chat_muted_users',
  'pm_messages',
  'staff_group_rooms',
  'staff_group_members',
  'staff_group_messages',
  'staff_group_read_state',
  'site_visits',
];

const PAGE_SIZE = 1000;

function loadDotenv() {
  for (const name of ['.env', '.env.local', '.env.production']) {
    const file = path.join(ROOT, name);
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq < 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

function sqlLiteral(value) {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return "'{}'";
    const items = value.map(v => {
      if (v === null) return 'NULL';
      return `"${String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
    });
    return `ARRAY[${items.join(',')}]::text[]`;
  }
  if (typeof value === 'object') {
    return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
  }
  return `'${String(value).replace(/'/g, "''")}'`;
}

function rowToInsert(table, row) {
  const cols = Object.keys(row);
  const vals = cols.map(c => sqlLiteral(row[c]));
  return `INSERT INTO public.${table} (${cols.map(c => `"${c}"`).join(', ')}) VALUES (${vals.join(', ')}) ON CONFLICT DO NOTHING;`;
}

async function fetchAllRows(supabaseUrl, serviceKey, table) {
  const rows = [];
  let offset = 0;
  while (true) {
    const url = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/${table}?select=*&limit=${PAGE_SIZE}&offset=${offset}`;
    const res = await fetch(url, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: 'count=exact',
      },
    });
    if (!res.ok) {
      const text = await res.text();
      if (res.status === 404 || text.includes('does not exist')) {
        console.error(`-- Таблица ${table}: не найдена, пропуск`);
        return rows;
      }
      throw new Error(`${table}: HTTP ${res.status} ${text}`);
    }
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    rows.push(...batch);
    if (batch.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }
  return rows;
}

async function exportData() {
  loadDotenv();
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.error('Нужны SUPABASE_URL (или VITE_SUPABASE_URL) и SUPABASE_SERVICE_ROLE_KEY');
    console.error('Service role: Supabase Dashboard → Project Settings → API → service_role (secret)');
    process.exit(1);
  }

  console.log('-- WWM Wiki export from Supabase');
  console.log(`-- Source: ${supabaseUrl}`);
  console.log(`-- Generated: ${new Date().toISOString()}`);
  console.log('BEGIN;');
  console.log("SET session_replication_role = 'replica';");

  for (const table of TABLES) {
    const rows = await fetchAllRows(supabaseUrl, serviceKey, table);
    console.error(`-- ${table}: ${rows.length} rows`);
    if (rows.length === 0) continue;
    console.log(`\n-- ${table} (${rows.length})`);
    for (const row of rows) {
      console.log(rowToInsert(table, row));
    }
  }

  console.log("SET session_replication_role = 'origin';");
  console.log('COMMIT;');
  console.error('\n-- Экспорт завершён. Storage (site-images) переносите отдельно — см. docs/MIGRATION-FULL-FIRSTVDS.md');
}

async function importData(filePath) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('Для --import задайте DATABASE_URL=postgresql://...');
    process.exit(1);
  }
  if (!fs.existsSync(filePath)) {
    console.error(`Файл не найден: ${filePath}`);
    process.exit(1);
  }

  const { spawn } = await import('node:child_process');
  await new Promise((resolve, reject) => {
    const child = spawn('psql', [databaseUrl, '-v', 'ON_ERROR_STOP=1', '-f', filePath], {
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
    child.on('error', reject);
    child.on('close', code => (code === 0 ? resolve() : reject(new Error(`psql exit ${code}`))));
  });
  console.error('Импорт завершён.');
}

const args = process.argv.slice(2);
if (args.includes('--export')) {
  await exportData();
} else if (args.includes('--import')) {
  const file = args[args.indexOf('--import') + 1] || 'export.sql';
  await importData(file);
} else {
  console.log(`Использование:
  node scripts/migrate-from-supabase.mjs --export > export.sql
  node scripts/migrate-from-supabase.mjs --import export.sql

Переменные:
  SUPABASE_URL / VITE_SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY  — экспорт (секрет, не коммитить)
  DATABASE_URL               — импорт (postgresql://...)`);
}
