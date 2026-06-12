import fs from 'fs';
import path from 'path';
import { DATA, readJson, writeJson, diffById, printDiff, updateManifest, resolveInput } from './lib/utils.mjs';
import { parseLinkedTable, extractField } from './lib/generic-table.mjs';

const OUT = path.join(DATA, 'parsed/mysticArts.json');

const HEADINGS = [
  '## List of All Mystic Arts',
  '## All Mystic Arts',
  '## Mystic Arts List',
];

function parse(md) {
  let rows = null;
  for (const h of HEADINGS) {
    rows = parseLinkedTable(md, h, 2);
    if (rows?.length) break;
  }
  if (!rows?.length) throw new Error('Таблица Mystic Arts не найдена в markdown');

  return rows.map(r => {
    const rest = r.cells.slice(1).join(' ');
    return {
      id: r.id,
      nameEn: r.nameEn,
      type: extractField(rest, 'Type') || r.cells[1] || '',
      effect: extractField(rest, 'Effect') || '',
      howToGet: extractField(rest, 'How to Get') || extractField(rest, 'How to Unlock') || '',
      raw: r.cells,
    };
  });
}

export async function run({ input, dryRun = false } = {}) {
  const mdPath = resolveInput(input, 'mystic-arts.md');
  if (!mdPath) {
    return { skipped: true, reason: 'Нет uploads/mystic-arts.md — экспортируйте Mystic Arts с Game8' };
  }
  const md = fs.readFileSync(mdPath, 'utf8');
  const items = parse(md);
  const prev = readJson(OUT, []);
  const diff = diffById(prev, items);

  if (!dryRun) {
    writeJson(OUT, items);
    updateManifest('mystic', { count: items.length, source: mdPath });
  }
  printDiff('mystic', diff);
  return { section: 'mystic', count: items.length, diff, written: dryRun ? [] : [OUT] };
}
