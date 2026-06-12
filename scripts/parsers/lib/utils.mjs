import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const isServerless = process.env.VERCEL === '1';

function resolveRoot() {
  const candidate = path.join(__dirname, '../../..');
  if (fs.existsSync(path.join(candidate, 'package.json'))) return candidate;
  return candidate;
}

export const ROOT = resolveRoot();
export const BUNDLED_DATA = path.join(ROOT, 'src/data');

/** На Vercel файловая система только для чтения — пишем во /tmp */
const WORK_ROOT = isServerless ? '/tmp/wwm-sync' : ROOT;
export const UPLOADS = isServerless ? path.join(WORK_ROOT, 'uploads') : path.join(ROOT, 'uploads');
export const DATA = isServerless ? path.join(WORK_ROOT, 'data') : path.join(ROOT, 'src/data');
export const MANIFEST_PATH = isServerless
  ? path.join(WORK_ROOT, 'sync-manifest.json')
  : path.join(ROOT, 'scripts/parsers/sync-manifest.json');

/** Предыдущие данные для diff: на Vercel — из включённого в деплой src/data */
export function readPrevJson(relativePath, fallback = null) {
  const bundled = path.join(BUNDLED_DATA, relativePath);
  if (fs.existsSync(bundled)) return readJson(bundled, fallback);
  return readJson(path.join(DATA, relativePath), fallback);
}

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

export function resolveInput(input, ...fallbackNames) {
  if (input && fs.existsSync(input)) return input;
  for (const name of fallbackNames) {
    const candidate = path.join(UPLOADS, name);
    if (fs.existsSync(candidate)) return candidate;
  }
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
  // Вырезаем тело статьи — меньше шума, парсеры находят таблицы
  const body =
    html.match(/<div class=['"]p-archiveContent__body['"][^>]*>([\s\S]*?)<\/div>\s*<div class=['"]p-archiveContent__footer/i)?.[1]
    || html.match(/class=['"]archive-style-wrapper['"][^>]*>([\s\S]*?)<div class=['"]p-archiveContent__comment/i)?.[1]
    || html;
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `Source URL: ${url}\n\n${body}`, 'utf8');
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
