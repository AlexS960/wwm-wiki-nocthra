import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mdPath = process.argv[2] || path.join(__dirname, '../uploads/565812-0.md');
const outPath = path.join(__dirname, '../src/data/innerWays.json');

const md = fs.readFileSync(mdPath, 'utf8');

const tableStart = md.indexOf('## List of All Inner Ways');
const tableEnd = md.indexOf('## How to Upgrade Inner Ways');
const tableBlock = md.slice(tableStart, tableEnd);

const rows = tableBlock.split('\n').filter((line) => line.startsWith('| ['));

const items = [];
for (const line of rows) {
  const nameMatch = line.match(/\|\s*\[\s*([^\]]+)\]/);
  if (!nameMatch) continue;
  const nameEn = nameMatch[1].trim();

  const pathMatch = line.match(/\]\([^)]+\)\s+([^|]+?)\s+\|/);
  const pathEn = pathMatch ? pathMatch[1].trim() : 'General';

  const effectMatch = line.match(/\*\*Effect\*\*:([^*]+?)(?=\*\*How to Get\*\*|$)/);
  const howMatch = line.match(/\*\*How to Get\*\*:(.+)$/);
  const clean = (s) => s.replace(/\\./g, '.').replace(/\s+\|+\s*$/g, '').replace(/\s+/g, ' ').trim();
  const effect = effectMatch ? clean(effectMatch[1]) : '';
  const howToGet = howMatch ? clean(howMatch[1]) : '';

  const id = nameEn
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  items.push({ id, nameEn, pathEn, effect, howToGet });
}

const upgradeStart = md.indexOf('## How to Upgrade Inner Ways');
const upgradeEnd = md.indexOf('## Inner Ways Explained');
const upgradeBlock = md.slice(upgradeStart, upgradeEnd);

const explainedStart = md.indexOf('## Inner Ways Explained');
const explainedEnd = md.indexOf('## Where Winds Meet Related Guides');
const explainedBlock = md.slice(explainedStart, explainedEnd);

function parseSubsections(block) {
  const sections = [];
  const parts = block.split(/^### /m).slice(1);
  for (const part of parts) {
    const lines = part.trim().split('\n');
    const title = lines[0].trim();
    const body = lines.slice(1).join('\n').trim();
    sections.push({ title, body });
  }
  return sections;
}

const upgradeSteps = [];
const stepParts = upgradeBlock.split(/^### /m).slice(1);
for (const part of stepParts) {
  const lines = part.trim().split('\n');
  const title = lines[0].trim();
  const body = lines.slice(1).join('\n').trim();
  upgradeSteps.push({ title, body });
}

const explained = parseSubsections(explainedBlock);

const introMatch = md.match(/Inner Ways, or Inner Arts, function as passive skills[^.]+\./);
const intro = introMatch ? introMatch[0] : '';

const output = {
  sourceUrl: 'https://game8.co/games/Where-Winds-Meet/archives/564726',
  intro,
  upgradeSteps,
  explained,
  innerWays: items,
};

fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');
console.log(`Wrote ${items.length} inner ways to ${outPath}`);
