/**
 * Создание коллекций через API PocketBase (надёжнее, чем ручной импорт JSON).
 *
 * 1. Запустите PocketBase: pocketbase\pocketbase.exe serve
 * 2. Создайте админа в http://127.0.0.1:8090/_/
 * 3. Скопируйте .env.migrate.example → .env.migrate и укажите email/пароль админа
 * 4. node scripts/setup-pocketbase-collections.mjs
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
const PB_URL = env.POCKETBASE_URL || env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090';
const PB_EMAIL = env.POCKETBASE_ADMIN_EMAIL;
const PB_PASS = env.POCKETBASE_ADMIN_PASSWORD;

if (!PB_EMAIL || !PB_PASS) {
  console.error('❌ Укажите POCKETBASE_ADMIN_EMAIL и POCKETBASE_ADMIN_PASSWORD в .env.migrate');
  process.exit(1);
}

const schemaPath = resolve(root, 'pocketbase', 'pb_schema.json');
const collections = JSON.parse(readFileSync(schemaPath, 'utf8'));

async function main() {
  console.log('🔗 PocketBase:', PB_URL);
  const pb = new PocketBase(PB_URL);
  await pb.collection('_superusers').authWithPassword(PB_EMAIL, PB_PASS);
  console.log('✅ Вход администратора');

  await pb.collections.import(collections, false);
  console.log('✅ Коллекции импортированы:', collections.map(c => c.name).join(', '));
  console.log('\nДальше: npm run dev  и откройте сайт.');
}

main().catch(err => {
  const msg = err?.response?.message || err?.message || String(err);
  const data = err?.response?.data;
  console.error('❌', msg);
  if (data) console.error(JSON.stringify(data, null, 2));
  process.exit(1);
});
