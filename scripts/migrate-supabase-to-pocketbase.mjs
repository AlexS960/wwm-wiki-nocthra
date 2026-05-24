/**
 * Перенос данных Supabase → PocketBase
 * Запуск: npm run migrate:pb
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import PocketBase from 'pocketbase';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function loadEnvFile(name) {
  const path = resolve(root, name);
  if (!existsSync(path)) return {};
  const env = {};
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq < 0) continue;
    env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
  }
  return env;
}

const env = { ...loadEnvFile('.env.migrate'), ...process.env };

const SUPABASE_URL = env.SUPABASE_URL?.replace(/\/$/, '');
const SUPABASE_KEY = env.SUPABASE_KEY;
const POCKETBASE_URL = env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const PB_EMAIL = env.POCKETBASE_ADMIN_EMAIL;
const PB_PASS = env.POCKETBASE_ADMIN_PASSWORD;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Укажите SUPABASE_URL и SUPABASE_KEY в .env.migrate');
  process.exit(1);
}
if (!PB_EMAIL || !PB_PASS) {
  console.error('❌ Укажите POCKETBASE_ADMIN_EMAIL и POCKETBASE_ADMIN_PASSWORD в .env.migrate');
  process.exit(1);
}

/** PocketBase: id = ровно 15 символов [a-z0-9]. Supabase использовал user_xxx с подчёркиванием. */
function supabaseIdToPbId(oldId) {
  const compact = String(oldId).toLowerCase().replace(/[^a-z0-9]/g, '');
  if (compact.length === 15) return compact;
  return compact.slice(0, 15).padEnd(15, '0');
}

function escapeFilter(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function pbErrorDetail(err) {
  const data = err?.response?.data;
  if (data) return JSON.stringify(data, null, 2);
  return err?.message || String(err);
}

function rewriteIds(value, idMap) {
  if (typeof value === 'string') {
    let s = value;
    for (const [oldId, newId] of Object.entries(idMap)) {
      if (oldId !== newId && s.includes(oldId)) s = s.split(oldId).join(newId);
    }
    return s;
  }
  if (Array.isArray(value)) return value.map(v => rewriteIds(v, idMap));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, rewriteIds(v, idMap)]));
  }
  return value;
}

async function supabaseFetch(table, select = '*') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${select}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`Supabase ${table}: ${res.status} ${await res.text()}`);
  return res.json();
}

async function upsertAccount(pb, row, idMap) {
  const pbId = supabaseIdToPbId(row.id);
  idMap[row.id] = pbId;

  const picture = row.picture || '';
  const payload = {
    username: row.username,
    role: row.role || 'user',
    picture: picture.length > 120000 ? '' : picture,
    game_nickname: row.game_nickname || '',
    password_hash: row.password_hash,
    created_at: row.created_at,
    last_seen: row.last_seen || null,
  };

  try {
    await pb.collection('accounts').getOne(pbId);
    await pb.collection('accounts').update(pbId, payload);
    return 'updated';
  } catch {
    try {
      const byName = await pb.collection('accounts').getFirstListItem(`username="${escapeFilter(row.username)}"`);
      idMap[row.id] = byName.id;
      await pb.collection('accounts').update(byName.id, payload);
      return 'updated_by_username';
    } catch {
      await pb.collection('accounts').create({ id: pbId, ...payload });
      return 'created';
    }
  }
}

async function upsertSiteData(pb, row, idMap) {
  let data = row.data;
  if (typeof data === 'string') {
    try { data = JSON.parse(data); } catch { /* keep string */ }
  }
  data = rewriteIds(data, idMap);

  const payload = {
    key: row.key,
    data,
    updated_at: row.updated_at || new Date().toISOString(),
  };

  try {
    const existing = await pb.collection('site_data').getFirstListItem(`key="${escapeFilter(row.key)}"`);
    await pb.collection('site_data').update(existing.id, payload);
    return 'updated';
  } catch {
    await pb.collection('site_data').create(payload);
    return 'created';
  }
}

async function upsertProgress(pb, row, idMap) {
  let data = row.data;
  if (typeof data === 'string') {
    try { data = JSON.parse(data); } catch { data = {}; }
  }
  data = rewriteIds(data, idMap);

  const userId = idMap[row.user_id] || supabaseIdToPbId(row.user_id);

  const payload = {
    user_id: userId,
    data,
    updated_at: row.updated_at || new Date().toISOString(),
  };

  try {
    const existing = await pb.collection('user_progress').getFirstListItem(`user_id="${escapeFilter(userId)}"`);
    await pb.collection('user_progress').update(existing.id, payload);
    return 'updated';
  } catch {
    await pb.collection('user_progress').create(payload);
    return 'created';
  }
}

async function main() {
  console.log('🔗 PocketBase:', POCKETBASE_URL);
  const pb = new PocketBase(POCKETBASE_URL);
  await pb.collection('_superusers').authWithPassword(PB_EMAIL, PB_PASS);
  console.log('✅ Авторизация в PocketBase');

  const idMap = {};

  console.log('\n📦 accounts...');
  const accounts = await supabaseFetch('accounts');
  if (!accounts.length) console.log('   (пусто в Supabase)');
  let accCreated = 0;
  let accUpdated = 0;
  for (const row of accounts) {
    try {
      const r = await upsertAccount(pb, row, idMap);
      if (r === 'created') accCreated++;
      else accUpdated++;
      if (row.id !== idMap[row.id]) {
        console.log(`   id: ${row.id} → ${idMap[row.id]} (${row.username})`);
      }
    } catch (err) {
      console.error(`\n❌ Аккаунт "${row.username}" (id: ${row.id}):`);
      console.error(pbErrorDetail(err));
      throw err;
    }
  }
  console.log(`   создано: ${accCreated}, обновлено: ${accUpdated}, всего: ${accounts.length}`);
  console.log(`   карта id: ${Object.keys(idMap).length} записей (старые id в JSON заменены)`);

  console.log('\n📦 site_data...');
  const siteData = await supabaseFetch('site_data');
  let sdCreated = 0;
  let sdUpdated = 0;
  for (const row of siteData) {
    try {
      const r = await upsertSiteData(pb, row, idMap);
      if (r === 'created') sdCreated++;
      else sdUpdated++;
    } catch (err) {
      console.error(`\n❌ site_data key="${row.key}":`);
      console.error(pbErrorDetail(err));
      throw err;
    }
  }
  console.log(`   создано: ${sdCreated}, обновлено: ${sdUpdated}`);

  console.log('\n📦 user_progress...');
  const progress = await supabaseFetch('user_progress');
  let prCreated = 0;
  let prUpdated = 0;
  for (const row of progress) {
    try {
      const r = await upsertProgress(pb, row, idMap);
      if (r === 'created') prCreated++;
      else prUpdated++;
    } catch (err) {
      console.error(`\n❌ user_progress user_id="${row.user_id}":`);
      console.error(pbErrorDetail(err));
      throw err;
    }
  }
  console.log(`   создано: ${prCreated}, обновлено: ${prUpdated}`);

  console.log('\n✅ Миграция завершена.');
  console.log('   Запустите: npm run dev');
  console.log('   Вход — по логину/паролю как раньше (id пользователей внутри БД обновлены под PocketBase).');
}

main().catch(() => process.exit(1));
