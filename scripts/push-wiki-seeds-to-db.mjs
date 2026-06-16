#!/usr/bin/env node
/**
 * Записывает дефолтные русские статьи вики в Supabase (wiki_articles).
 * Перезаписывает все статьи кроме fields.source = 'custom'.
 *
 * Использование:
 *   npm run wiki:push-db
 *
 * Требует .env:
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_ANON_KEY
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'vite';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function loadEnvFile() {
  const envPath = path.join(root, '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

function wikiToRow(article) {
  return {
    id: article.id,
    section: article.section,
    title: article.title,
    content: article.content || '',
    icon: article.icon || '',
    author_id: null,
    author_name: article.authorName || 'Nocthra Wiki',
    fields: article.fields || {},
    images: article.images?.length ? article.images : null,
    updated_at: new Date().toISOString(),
  };
}

async function loadSeedArticles() {
  const server = await createServer({
    root,
    configFile: path.join(root, 'vite.config.ts'),
    logLevel: 'error',
  });
  try {
    const mod = await server.ssrLoadModule('/src/lib/sectionSeeds.ts');
    return mod.getAllSeedArticles();
  } finally {
    await server.close();
  }
}

async function main() {
  loadEnvFile();
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error('✗ Нужны VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в .env');
    process.exit(1);
  }

  console.log('▶ Загрузка русских сидов…');
  const seeds = await loadSeedArticles();
  console.log(`  статей: ${seeds.length}`);

  const supabase = createClient(url, key);

  const { data: existing, error: loadErr } = await supabase
    .from('wiki_articles')
    .select('id, fields');
  if (loadErr) {
    console.error('✗ Не удалось прочитать wiki_articles:', loadErr.message);
    process.exit(1);
  }

  const customIds = new Set(
    (existing || [])
      .filter(row => row.fields?.source === 'custom')
      .map(row => row.id),
  );

  const toUpsert = seeds.filter(s => !customIds.has(s.id));
  const skipped = seeds.length - toUpsert.length;

  console.log(`▶ Запись в Supabase (${toUpsert.length} статей, пропуск кастомных: ${skipped})…`);

  const BATCH = 10;
  let ok = 0;
  let fail = 0;

  for (let i = 0; i < toUpsert.length; i += BATCH) {
    const batch = toUpsert.slice(i, i + BATCH).map(wikiToRow);
    const { error } = await supabase.from('wiki_articles').upsert(batch, { onConflict: 'id' });
    if (error) {
      console.error(`  ✗ batch ${i / BATCH + 1}:`, error.message);
      fail += batch.length;
    } else {
      ok += batch.length;
      process.stdout.write(`  ✓ ${ok}/${toUpsert.length}\r`);
    }
  }

  console.log(`\n✓ Готово: записано ${ok}, ошибок ${fail}`);

  // Удалить nameEn из fields у оставшихся не-кастомных
  const { data: withEn } = await supabase
    .from('wiki_articles')
    .select('id, fields')
    .not('fields->nameEn', 'is', null);

  if (withEn?.length) {
    console.log(`▶ Очистка nameEn (${withEn.length})…`);
    for (const row of withEn) {
      if (row.fields?.source === 'custom') continue;
      const fields = { ...row.fields };
      delete fields.nameEn;
      await supabase.from('wiki_articles').update({ fields, updated_at: new Date().toISOString() }).eq('id', row.id);
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
