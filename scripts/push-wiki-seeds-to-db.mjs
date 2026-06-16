#!/usr/bin/env node
/**
 * Записывает русский контент вики в Supabase (wiki_articles).
 * Дефолтные разделы — source: seed. Внутренний путь — source: custom.
 *
 *   npm run wiki:push-db
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import { buildInnerPathWikiArticles } from './innerPathWiki.mjs';

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
    const mod = await server.ssrLoadModule('/scripts/wikiSeeds.ts');
    return mod.getAllSeedArticles();
  } finally {
    await server.close();
  }
}

function stripEnglishFields(fields) {
  if (!fields || typeof fields !== 'object') return {};
  const next = { ...fields };
  delete next.nameEn;
  delete next.name_en;
  delete next.textEn;
  return next;
}

/** Ловит битую кодировку (PowerShell Set-Content без UTF-8 и т.п.) */
function assertRussianArticles(articles, label) {
  const CYRILLIC = /[а-яёА-ЯЁ]/;
  const MOJIBAKE = /[¦ÐÑÃ]|TË|TÏ|òÀ|Ð|âœ/;
  const bad = articles.filter(a => {
    if (!a.title?.trim()) return true;
    if (MOJIBAKE.test(a.title) || MOJIBAKE.test(a.content || '')) return true;
    if (a.section === 'innerpath') return !CYRILLIC.test(a.title);
    if (a.section === 'tips' || a.section === 'lifeskills') return !CYRILLIC.test(a.title);
    return !CYRILLIC.test(a.title);
  });
  if (bad.length > 0) {
    console.error(`✗ ${label}: битая кодировка в ${bad.length} статьях, примеры:`);
    for (const a of bad.slice(0, 5)) {
      console.error(`  - ${a.id} (${a.section}): ${JSON.stringify(a.title?.slice(0, 40))}`);
    }
    console.error('  Восстановите scripts/data/*.ts через: git show <commit>:path > file (Node.js, не PowerShell Set-Content)');
    process.exit(1);
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

  console.log('▶ Загрузка русских сидов (без внутреннего пути)…');
  const seeds = await loadSeedArticles();
  const innerPath = buildInnerPathWikiArticles();
  console.log(`  сиды: ${seeds.length}, внутренний путь: ${innerPath.length}`);

  assertRussianArticles(seeds, 'Сиды');
  assertRussianArticles(innerPath, 'Внутренний путь');

  if (innerPath.length < 40) {
    console.warn(`⚠ В innerPathRu.json не хватает переводов (ожидалось ~42, есть ${innerPath.length})`);
  }

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
      .filter(row => row.fields?.source === 'custom' && row.id && !row.id.startsWith('ls-'))
      .map(row => row.id),
  );

  const innerIds = new Set(innerPath.map(a => a.id));
  const FORCE_SEED_SECTIONS = new Set(['lifeskills', 'tips', 'mystic', 'builds', 'weapons', 'sects', 'bosses', 'cooking']);
  const toUpsert = [
    ...seeds.filter(s => !customIds.has(s.id) || FORCE_SEED_SECTIONS.has(s.section)),
    ...innerPath,
  ];

  const MOJIBAKE = /[¦ÐÑÃ]|TË|TÏ|òÀ|âœ|ðŸ/;
  const seedLsIds = new Set(seeds.filter(s => s.section === 'lifeskills').map(s => s.id));
  const { data: lsRows } = await supabase.from('wiki_articles').select('id, title, section').eq('section', 'lifeskills');
  const lsToDelete = (lsRows || []).filter(r => {
    if (seedLsIds.has(r.id)) return false;
    const title = r.title || '';
    return MOJIBAKE.test(title) || !/[а-яёА-ЯЁ]/.test(title);
  });
  if (lsToDelete.length) {
    console.log(`▶ Удаление битых статей lifeskills (${lsToDelete.length})…`);
    await supabase.from('wiki_articles').delete().in('id', lsToDelete.map(r => r.id));
  }

  // Удалить старые innerpath seed-статьи, если id совпадает — перезапишем как custom
  const skipped = seeds.filter(s => customIds.has(s.id)).length;

  console.log(`▶ Запись в Supabase (${toUpsert.length} статей, пропуск кастомных: ${skipped})…`);

  const BATCH = 10;
  let ok = 0;
  let fail = 0;

  for (let i = 0; i < toUpsert.length; i += BATCH) {
    const batch = toUpsert.slice(i, i + BATCH).map(a => {
      const row = wikiToRow(a);
      row.fields = stripEnglishFields(row.fields);
      return row;
    });
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

  // Удалить nameEn и английские innerpath без перевода
  const { data: allRows } = await supabase.from('wiki_articles').select('id, section, title, content, fields');
  if (allRows?.length) {
    let cleaned = 0;
    for (const row of allRows) {
      const fields = stripEnglishFields(row.fields);
      const hadEn = row.fields?.nameEn || row.fields?.name_en;
      const isLatinTitle = row.title && !/[а-яёА-ЯЁ]/.test(row.title);
      const isInnerStale = row.section === 'innerpath' && innerIds.has(row.id) && row.fields?.source !== 'custom';

      if (!hadEn && !isLatinTitle && !isInnerStale && JSON.stringify(fields) === JSON.stringify(row.fields || {})) {
        continue;
      }

      const patch = { fields, updated_at: new Date().toISOString() };
      if (isInnerStale) patch.fields = { ...fields, source: 'custom' };

      await supabase.from('wiki_articles').update(patch).eq('id', row.id);
      cleaned++;
    }
    if (cleaned) console.log(`▶ Очищено полей / меток: ${cleaned}`);
  }

  // Удалить дубликаты innerpath на английском (если id отличается от ru-набора)
  const { data: innerRows } = await supabase.from('wiki_articles').select('id, title, section').eq('section', 'innerpath');
  const validInner = new Set(innerPath.map(a => a.id));
  const toDelete = (innerRows || []).filter(r => !validInner.has(r.id) && !/[а-яёА-ЯЁ]/.test(r.title || ''));
  if (toDelete.length) {
    console.log(`▶ Удаление устаревших innerpath (${toDelete.length})…`);
    await supabase.from('wiki_articles').delete().in('id', toDelete.map(r => r.id));
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
