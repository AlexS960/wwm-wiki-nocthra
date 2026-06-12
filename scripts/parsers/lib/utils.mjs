import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.join(__dirname, '../../..');
export const UPLOADS = path.join(ROOT, 'uploads');
export const DATA = path.join(ROOT, 'src/data');
export const MANIFEST_PATH = path.join(ROOT, 'scripts/parsers/sync-manifest.json');

export function slug(s) {
  return s
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function readJson(filePath, fallback = null) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

export function resolveInput(input, fallbackName) {
  if (input && fs.existsSync(input)) return input;
  const candidate = path.join(UPLOADS, fallbackName);
  if (fs.existsSync(candidate)) return candidate;
  return null;
}

export async function fetchMarkdown(url, outPath) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; WWM-Wiki-Sync/1.0)',
      Accept: 'text/html,application/xhtml+xml',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const html = await res.text();
  // Game8 exports as HTML; сохраняем как есть — парсеры работают с markdown-экспортом из uploads/
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `Source URL: ${url}\n\n${html}`, 'utf8');
  return outPath;
}

/** Сравнение массивов объектов по id */
export function diffById(prev = [], next = [], idKey = 'id') {
  const prevMap = new Map(prev.map(x => [x[idKey], x]));
  const nextMap = new Map(next.map(x => [x[idKey], x]));
  const added = [];
  const removed = [];
  const changed = [];

  for (const [id, item] of nextMap) {
    if (!prevMap.has(id)) added.push(id);
    else if (JSON.stringify(prevMap.get(id)) !== JSON.stringify(item)) changed.push(id);
  }
  for (const id of prevMap.keys()) {
    if (!nextMap.has(id)) removed.push(id);
  }
  return { added, removed, changed, prevCount: prev.length, nextCount: next.length };
}

export function printDiff(section, diff) {
  const { added, removed, changed, prevCount, nextCount } = diff;
  console.log(`  ${section}: ${prevCount} → ${nextCount} (+${added.length} / ~${changed.length} / -${removed.length})`);
  if (added.length) console.log(`    + ${added.slice(0, 8).join(', ')}${added.length > 8 ? '…' : ''}`);
  if (changed.length) console.log(`    ~ ${changed.slice(0, 8).join(', ')}${changed.length > 8 ? '…' : ''}`);
  if (removed.length) console.log(`    - ${removed.slice(0, 8).join(', ')}${removed.length > 8 ? '…' : ''}`);
}

export function updateManifest(section, meta) {
  const manifest = readJson(MANIFEST_PATH, { sections: {} });
  manifest.sections[section] = { ...meta, syncedAt: new Date().toISOString() };
  writeJson(MANIFEST_PATH, manifest);
}

export function parseMarkdownTable(block, minCells = 2) {
  const rows = [];
  for (const line of block.split('\n')) {
    if (!line.startsWith('|') || line.includes('---') || /^[\|\s\-:]+$/.test(line)) continue;
    const cells = line.split('|').map(c => c.trim()).filter(Boolean);
    if (cells.length < minCells) continue;
    if (cells[0].toLowerCase() === 'npc' || cells[0].toLowerCase() === 'weapon') continue;
    rows.push(cells);
  }
  return rows;
}

export function extractLinkName(cell) {
  const m = cell.match(/\[([^\]]+)\]/);
  return m ? m[1].trim() : cell.replace(/\*\*/g, '').trim();
}

export function extractLinkUrl(cell) {
  const m = cell.match(/\]\(([^)]+)\)/);
  return m ? m[1].trim() : null;
}
