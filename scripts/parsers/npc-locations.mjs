import fs from 'fs';
import path from 'path';
import { DATA, slug, writeJson, diffById, printDiff, updateManifest, resolveInput, extractLinkName, readPrevJson } from './lib/utils.mjs';
import { isGame8Html, parseNpcLocationsHtml } from './lib/game8-html.mjs';

const OUT = path.join(DATA, 'aiNpcs.parsed.json');

const REGION_MAP = {
  Qinghe: { region: 'qinghe', regionLabel: 'Qinghe' },
  Kaifeng: { region: 'kaifeng', regionLabel: 'Kaifeng' },
  Hexi: { region: 'hexi', regionLabel: 'Hexi' },
};

function parseLocationCell(cell) {
  const locM = cell.match(/\*\*Location:\*\*\s*([^,]+),\s*\[([^\]]+)\]/);
  if (!locM) return { locationTitle: '', subregion: '', locationDetail: cell.trim() };
  const after = cell.slice(locM.index + locM[0].length).replace(/^\s+/, '');
  return {
    locationTitle: locM[1].trim(),
    subregion: locM[2].trim(),
    locationDetail: after.replace(/\s+/g, ' ').trim(),
  };
}

export function parseNpcLocationsMd(md) {
  const start = md.indexOf('## List of Interactable NPCs');
  if (start < 0) return null;
  const block = md.slice(start);
  const items = [];
  const seen = new Set();

  for (const line of block.split('\n')) {
    if (!line.startsWith('| [')) continue;
    const cells = line.split('|').map(c => c.trim()).filter(Boolean);
    if (cells.length < 3) continue;
    const nameEn = extractLinkName(cells[0]);
    if (!nameEn || nameEn === 'NPC') continue;
    const regionLabel = extractLinkName(cells[1]);
    const reg = REGION_MAP[regionLabel] || { region: slug(regionLabel), regionLabel };
    const loc = parseLocationCell(cells[2]);
    const id = slug(nameEn);
    if (seen.has(id)) continue;
    seen.add(id);
    items.push({
      id,
      nameEn,
      region: reg.region,
      regionLabel: reg.regionLabel,
      ...loc,
    });
  }
  return items;
}

export function parseNpcLocations(content) {
  if (isGame8Html(content)) return parseNpcLocationsHtml(content);
  return parseNpcLocationsMd(content) || [];
}

export async function run({ input, dryRun = false } = {}) {
  const mdPath = resolveInput(input, '565812-0.md');
  if (!mdPath) {
    return { skipped: true, reason: 'Нет uploads/565812-0.md — включите «Скачать с Game8»' };
  }

  const content = fs.readFileSync(mdPath, 'utf8');
  const items = parseNpcLocations(content);

  if (!items.length) {
    return { skipped: true, reason: 'Не удалось распознать NPC в файле Game8' };
  }

  const prev = readPrevJson('aiNpcs.parsed.json', []);
  const diff = diffById(prev, items);

  if (!dryRun) {
    writeJson(OUT, items);
    updateManifest('npcs-locations', { count: items.length, source: mdPath });
  }
  printDiff('npcs-locations', diff);
  return { section: 'npcs-locations', count: items.length, diff, written: dryRun ? [] : [OUT] };
}
