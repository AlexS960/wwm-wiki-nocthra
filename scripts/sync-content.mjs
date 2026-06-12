#!/usr/bin/env node
/**
 * Синхронизация игрового контента из Game8 → src/data/
 *
 * Использование:
 *   node scripts/sync-content.mjs                    # список разделов
 *   node scripts/sync-content.mjs all                # всё по порядку (без сети)
 *   node scripts/sync-content.mjs riddles            # один раздел
 *   node scripts/sync-content.mjs all --fetch        # скачать markdown с Game8
 *   node scripts/sync-content.mjs npcs-dialogues --only-missing
 *   node scripts/sync-content.mjs npcs-dialogues --limit 5
 *   node scripts/sync-content.mjs all --dry-run
 */
import path from 'path';
import { fileURLToPath } from 'url';
import { PARSERS, SYNC_ORDER } from './parsers/registry.mjs';
import { UPLOADS, fetchMarkdown } from './parsers/lib/utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const args = argv.slice(2);
  const flags = {
    fetch: args.includes('--fetch'),
    dryRun: args.includes('--dry-run'),
    onlyMissing: args.includes('--only-missing'),
    limit: 0,
  };
  const limitIdx = args.indexOf('--limit');
  if (limitIdx >= 0) flags.limit = Number(args[limitIdx + 1]) || 0;
  const positional = args.filter(a => !a.startsWith('--') && (limitIdx < 0 || a !== args[limitIdx + 1]));
  return { target: positional[0] || 'help', flags };
}

async function ensureUpload(key, cfg) {
  if (!cfg.uploadFile || !cfg.game8Url) return null;
  const out = path.join(UPLOADS, cfg.uploadFile);
  await fetchMarkdown(cfg.game8Url, out);
  return out;
}

async function runParser(key, flags) {
  const cfg = PARSERS[key];
  if (!cfg?.module) {
    console.warn(`⚠ Неизвестный раздел: ${key}`);
    return null;
  }

  let input = null;
  if (flags.fetch && cfg.game8Url && cfg.uploadFile) {
    console.log(`↓ Загрузка ${cfg.label}…`);
    try {
      input = await ensureUpload(key, cfg);
      console.log(`  сохранено: ${input}`);
    } catch (e) {
      console.warn(`  fetch не удался: ${e.message}`);
    }
  }

  const mod = await import(new URL(`./${cfg.module}`, import.meta.url));
  const opts = {
    input,
    dryRun: flags.dryRun,
    onlyMissing: flags.onlyMissing,
    limit: flags.limit,
  };

  console.log(`\n▶ ${cfg.label} (${key})`);
  try {
    const result = await mod.run(opts);
    if (result?.skipped) {
      console.log(`  ⊘ пропуск: ${result.reason}`);
      if (cfg.note) console.log(`  ℹ ${cfg.note}`);
    }
    return result;
  } catch (e) {
    console.error(`  ✗ ошибка: ${e.message}`);
    return { error: e.message };
  }
}

function printHelp() {
  console.log(`
WWM Wiki — синхронизация контента

Разделы:
${SYNC_ORDER.map(k => {
  const p = PARSERS[k];
  const net = p.requiresNetwork ? ' [сеть]' : '';
  const dep = p.dependsOn ? ` (после: ${p.dependsOn.join(', ')})` : '';
  return `  ${k.padEnd(18)} ${p.label}${net}${dep}`;
}).join('\n')}

Команды:
  node scripts/sync-content.mjs all
  node scripts/sync-content.mjs riddles
  node scripts/sync-content.mjs npcs-locations
  node scripts/sync-content.mjs npcs-dialogues --only-missing
  node scripts/sync-content.mjs all --fetch --dry-run

Источник: Game8 markdown в uploads/ или --fetch с archive URL из registry.
Редакции в админке (sectionOverrides, wiki_articles) не затрагиваются.
`);
}

async function main() {
  const { target, flags } = parseArgs(process.argv);

  if (target === 'help' || target === '--help' || target === '-h') {
    printHelp();
    return;
  }

  const keys = target === 'all'
    ? SYNC_ORDER
    : target.split(',').map(s => s.trim()).filter(Boolean);

  const unknown = keys.filter(k => k !== 'all' && !PARSERS[k]);
  if (unknown.length) {
    console.error(`Неизвестные разделы: ${unknown.join(', ')}`);
    printHelp();
    process.exit(1);
  }

  console.log(`Синхронизация: ${keys.join(', ')}${flags.dryRun ? ' [dry-run]' : ''}`);
  const results = [];
  for (const key of keys) {
    results.push(await runParser(key, flags));
  }

  const ok = results.filter(r => r && !r.skipped && !r.error).length;
  const skipped = results.filter(r => r?.skipped).length;
  const errors = results.filter(r => r?.error).length;
  console.log(`\nГотово: ${ok} обновлено, ${skipped} пропущено, ${errors} ошибок`);
  if (errors) process.exit(1);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
