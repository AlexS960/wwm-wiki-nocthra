import fs from 'fs';
import path from 'path';
import { DATA, readJson, writeJson, diffById, printDiff, updateManifest, resolveInput } from './lib/utils.mjs';
import { parseLinkedTable, extractField, extractLinkName } from './lib/generic-table.mjs';

const OUT = path.join(DATA, 'parsed/bosses.json');

const HEADINGS = [
  '## List of All Bosses',
  '## All World Bosses',
  '## Boss List',
  '## List of Bosses',
];

function parse(md) {
  let rows = null;
  for (const h of HEADINGS) {
    rows = parseLinkedTable(md, h, 2);
    if (rows?.length) break;
  }
  if (!rows?.length) throw new Error('Таблица боссов не найдена в markdown');

  return rows.map(r => {
    const region = r.cells[1] ? extractLinkName(r.cells[1]) : '';
    const rest = r.cells.slice(2).join(' ');
    return {
      id: r.id,
      nameEn: r.nameEn,
      type: extractField(rest, 'Type') || 'world',
      region,
      location: extractField(rest, 'Location') || r.cells[2] || '',
      level: extractField(rest, 'Level') || extractField(rest, 'Recommended Level') || '',
      rewards: extractField(rest, 'Rewards') || '',
      raw: r.cells,
    };
  });
}

export async function run({ input, dryRun = false } = {}) {
  const mdPath = resolveInput(input, 'bosses.md');
  if (!mdPath) {
    return { skipped: true, reason: 'Нет uploads/bosses.md — экспортируйте список боссов с Game8' };
  }
  const md = fs.readFileSync(mdPath, 'utf8');
  const items = parse(md);
  const prev = readJson(OUT, []);
  const diff = diffById(prev, items);

  if (!dryRun) {
    writeJson(OUT, items);
    updateManifest('bosses', { count: items.length, source: mdPath });
  }
  printDiff('bosses', diff);
  return { section: 'bosses', count: items.length, diff, written: dryRun ? [] : [OUT] };
}
