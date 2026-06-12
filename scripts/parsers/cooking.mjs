import fs from 'fs';
import path from 'path';
import { DATA, readJson, writeJson, diffById, printDiff, updateManifest, resolveInput } from './lib/utils.mjs';
import { parseLinkedTable, extractField } from './lib/generic-table.mjs';

const OUT = path.join(DATA, 'parsed/recipes.json');

const HEADINGS = [
  '## List of All Recipes',
  '## All Recipes',
  '## Recipe List',
  '## List of All Dishes',
];

function parse(md) {
  let rows = null;
  for (const h of HEADINGS) {
    rows = parseLinkedTable(md, h, 2);
    if (rows?.length) break;
  }
  if (!rows?.length) throw new Error('Таблица рецептов не найдена в markdown');

  return rows.map(r => {
    const rest = r.cells.slice(1).join(' ');
    const levelM = rest.match(/Level\s*(\d+)/i);
    return {
      id: r.id,
      nameEn: r.nameEn,
      level: levelM ? Number(levelM[1]) : 1,
      effect: extractField(rest, 'Effect') || '',
      ingredients: extractField(rest, 'Ingredients') || r.cells[2] || '',
      howToUnlock: extractField(rest, 'How to Unlock') || extractField(rest, 'How to Get') || '',
      category: /buff|attack|hp/i.test(rest) ? 'buff' : 'healing',
      raw: r.cells,
    };
  });
}

export async function run({ input, dryRun = false } = {}) {
  const mdPath = resolveInput(input, 'cooking.md');
  if (!mdPath) {
    return { skipped: true, reason: 'Нет uploads/cooking.md — экспортируйте рецепты с Game8' };
  }
  const md = fs.readFileSync(mdPath, 'utf8');
  const items = parse(md);
  const prev = readJson(OUT, []);
  const diff = diffById(prev, items);

  if (!dryRun) {
    writeJson(OUT, items);
    updateManifest('cooking', { count: items.length, source: mdPath });
  }
  printDiff('cooking', diff);
  return { section: 'cooking', count: items.length, diff, written: dryRun ? [] : [OUT] };
}
