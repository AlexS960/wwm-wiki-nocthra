import fs from 'fs';
import path from 'path';
import { DATA, readJson, writeJson, diffById, printDiff, updateManifest, resolveInput } from './lib/utils.mjs';
import { parseLinkedTable, extractField } from './lib/generic-table.mjs';

const OUT = path.join(DATA, 'parsed/weapons.json');

const HEADINGS = [
  '## List of All Weapons',
  '## All Weapons',
  '## Weapon List',
];

function parse(md) {
  let rows = null;
  for (const h of HEADINGS) {
    rows = parseLinkedTable(md, h, 2);
    if (rows?.length) break;
  }
  if (!rows?.length) {
    rows = parseLinkedTable(md, '## List of', 2);
  }
  if (!rows?.length) throw new Error('Таблица оружия не найдена в markdown');

  return rows.map(r => {
    const rest = r.cells.slice(1).join(' ');
    return {
      id: r.id,
      nameEn: r.nameEn,
      type: extractField(rest, 'Type') || r.cells[1] || '',
      role: extractField(rest, 'Role') || '',
      martialArt: extractField(rest, 'Martial Art') || extractField(rest, 'Path') || '',
      howToGet: extractField(rest, 'How to Get') || extractField(rest, 'How to Unlock') || '',
      description: extractField(rest, 'Effect') || extractField(rest, 'Description') || '',
      raw: r.cells,
    };
  });
}

export async function run({ input, dryRun = false } = {}) {
  const mdPath = resolveInput(input, 'weapons.md');
  if (!mdPath) {
    return { skipped: true, reason: 'Нет uploads/weapons.md — экспортируйте список оружия с Game8' };
  }
  const md = fs.readFileSync(mdPath, 'utf8');
  const items = parse(md);
  const prev = readJson(OUT, []);
  const diff = diffById(prev, items);

  if (!dryRun) {
    writeJson(OUT, items);
    updateManifest('weapons', { count: items.length, source: mdPath });
  }
  printDiff('weapons', diff);
  return { section: 'weapons', count: items.length, diff, written: dryRun ? [] : [OUT] };
}
