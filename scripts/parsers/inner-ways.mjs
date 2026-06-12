import fs from 'fs';
import path from 'path';
import { DATA, readJson, writeJson, diffById, printDiff, updateManifest, resolveInput, readPrevJson } from './lib/utils.mjs';

const OUT = path.join(DATA, 'innerWays.json');

function parse(md) {
  const tableStart = md.indexOf('## List of All Inner Ways');
  if (tableStart < 0) throw new Error('Раздел "## List of All Inner Ways" не найден в markdown');
  const tableEnd = md.indexOf('## How to Upgrade Inner Ways', tableStart);
  const tableBlock = md.slice(tableStart, tableEnd);

  const items = [];
  for (const line of tableBlock.split('\n')) {
    if (!line.startsWith('| [')) continue;
    const nameMatch = line.match(/\|\s*\[\s*([^\]]+)\]/);
    if (!nameMatch) continue;
    const nameEn = nameMatch[1].trim();
    const pathMatch = line.match(/\]\([^)]+\)\s+([^|]+?)\s+\|/);
    const pathEn = pathMatch ? pathMatch[1].trim() : 'General';
    const effectMatch = line.match(/\*\*Effect\*\*:([^*]+?)(?=\*\*How to Get\*\*|$)/);
    const howMatch = line.match(/\*\*How to Get\*\*:(.+)$/);
    const clean = s => s.replace(/\\./g, '.').replace(/\s+\|+\s*$/g, '').replace(/\s+/g, ' ').trim();
    items.push({
      id: slug(nameEn),
      nameEn,
      pathEn,
      effect: effectMatch ? clean(effectMatch[1]) : '',
      howToGet: howMatch ? clean(howMatch[1]) : '',
    });
  }

  const upgradeStart = md.indexOf('## How to Upgrade Inner Ways');
  const upgradeEnd = md.indexOf('## Inner Ways Explained');
  const explainedStart = md.indexOf('## Inner Ways Explained');
  const explainedEnd = md.indexOf('## Where Winds Meet Related Guides');

  function parseSubsections(block) {
    if (!block) return [];
    const sections = [];
    for (const part of block.split(/^### /m).slice(1)) {
      const lines = part.trim().split('\n');
      sections.push({ title: lines[0].trim(), body: lines.slice(1).join('\n').trim() });
    }
    return sections;
  }

  const upgradeBlock = upgradeStart >= 0 ? md.slice(upgradeStart, upgradeEnd) : '';
  const explainedBlock = explainedStart >= 0 ? md.slice(explainedStart, explainedEnd) : '';
  const upgradeSteps = parseSubsections(upgradeBlock);
  const explained = parseSubsections(explainedBlock);
  const introMatch = md.match(/Inner Ways, or Inner Arts, function as passive skills[^.]+\./);

  return {
    sourceUrl: 'https://game8.co/games/Where-Winds-Meet/archives/564726',
    intro: introMatch ? introMatch[0] : '',
    upgradeSteps,
    explained,
    innerWays: items,
  };
}

export async function run({ input, dryRun = false } = {}) {
  const mdPath = resolveInput(input, '564726-inner-ways.md');
  if (!mdPath) {
    return { skipped: true, reason: 'Нет uploads/564726-inner-ways.md — скачайте экспорт Game8 или запустите sync с --fetch' };
  }
  const md = fs.readFileSync(mdPath, 'utf8');
  const output = parse(md);
  const prev = readPrevJson('innerWays.json', { innerWays: [] });
  const diff = diffById(prev.innerWays || [], output.innerWays);

  if (!dryRun) {
    writeJson(OUT, output);
    updateManifest('innerpath', { count: output.innerWays.length, source: mdPath });
  }
  printDiff('innerpath', diff);
  return { section: 'innerpath', count: output.innerWays.length, diff, written: dryRun ? [] : [OUT] };
}
