import fs from 'fs';
import path from 'path';
import { DATA, readJson, writeJson, diffById, printDiff, updateManifest, resolveInput } from './lib/utils.mjs';
import { isGame8Html, parseInnerWaysContent, parseInnerWaysMeta } from './lib/game8-html.mjs';

const OUT = path.join(DATA, 'innerWays.json');

function parse(md) {
  const innerWays = parseInnerWaysContent(md);
  const meta = parseInnerWaysMeta(md);

  return {
    sourceUrl: 'https://game8.co/games/Where-Winds-Meet/archives/564726',
    intro: meta.intro,
    upgradeSteps: meta.upgradeSteps,
    explained: meta.explained,
    innerWays,
  };
}

export async function run({ input, dryRun = false } = {}) {
  const mdPath = resolveInput(input, '564726-inner-ways.md');
  if (!mdPath) {
    return { skipped: true, reason: 'Нет uploads/564726-inner-ways.md — скачайте экспорт Game8 или запустите sync с --fetch' };
  }
  const md = fs.readFileSync(mdPath, 'utf8');
  if (!isGame8Html(md) && !md.includes('## List of All Inner Ways') && !md.includes('List of All Inner Ways')) {
    return { skipped: true, reason: 'Файл не похож на страницу Inner Ways Game8' };
  }
  const output = parse(md);
  const prev = readJson(OUT, { innerWays: [] });
  const diff = diffById(prev.innerWays || [], output.innerWays);

  if (!dryRun) {
    writeJson(OUT, output);
    updateManifest('innerpath', { count: output.innerWays.length, source: mdPath });
  }
  printDiff('innerpath', diff);
  return { section: 'innerpath', count: output.innerWays.length, diff, written: dryRun ? [] : [OUT] };
}
