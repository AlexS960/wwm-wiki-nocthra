import fs from 'fs';
import path from 'path';
import { DATA, writeJson, diffById, printDiff, updateManifest, resolveInput, readPrevJson } from './lib/utils.mjs';
import { parseWeaponsContent } from './lib/game8-html.mjs';

const OUT = path.join(DATA, 'parsed/weapons.json');

export async function run({ input, dryRun = false } = {}) {
  const mdPath = resolveInput(input, '564704.md', '564704-0.md', 'weapons.md');
  if (!mdPath) {
    return {
      skipped: true,
      reason: 'Нет uploads/564704-0.md — включите «Скачать с Game8» или положите экспорт страницы оружия',
    };
  }

  const content = fs.readFileSync(mdPath, 'utf8');
  const items = parseWeaponsContent(content);

  if (!items.length) {
    return {
      skipped: true,
      reason: 'Таблица «All Weapon Types» не найдена. URL: game8.co/.../archives/564704',
    };
  }

  const prev = readPrevJson('parsed/weapons.json', []);
  const diff = diffById(prev, items);

  if (!dryRun) {
    writeJson(OUT, items);
    updateManifest('weapons', { count: items.length, source: mdPath });
  }
  printDiff('weapons', diff);
  return { section: 'weapons', count: items.length, diff, written: dryRun ? [] : [OUT] };
}
