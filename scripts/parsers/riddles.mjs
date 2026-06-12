import fs from 'fs';
import path from 'path';
import { DATA, slug, readJson, writeJson, diffById, printDiff, updateManifest, resolveInput } from './lib/utils.mjs';

const CLUES_OUT = path.join(DATA, 'riddles.clues.json');
const MASTERS_OUT = path.join(DATA, 'riddleMasters.json');

const MASTER_RU = {
  'Wang Xiaosan': 'Ван Сяосань', 'Chan Yi': 'Чань И', 'Sha Er': 'Ша Эр', Qingshan: 'Циншань',
  'Ruan Shuiyan': 'Жуань Шуйянь', 'Tao Xiaoxiao': 'Тао Сяосяо', Yoyo: 'Йойо', 'Zhang Jiu': 'Чжан Цзю',
  Kutuluk: 'Кутулук', 'Zhang Yu': 'Чжан Юй', 'Shi Lei': 'Ши Лэй', 'Li Rouzhu': 'Ли Жоучжу',
  'Peng Shizhi': 'Пэн Шичи', 'Liang Rongfu': 'Лян Жунфу', 'Tian Danui': 'Тянь Дануй',
  'Tang Xiaofei': 'Тан Сяофэй', 'Tao Qian': 'Тао Цянь', 'Wang Li': 'Ван Ли',
};

const REGION_MAP = {
  'Kaifeng City': { region: 'kaifeng', regionRu: 'Кайфэн' },
  'Granary of Plenty': { region: 'kaifeng', regionRu: 'Кайфэн' },
  'Jadewood Court': { region: 'kaifeng', regionRu: 'Кайфэн' },
  'Roaring Sands': { region: 'qinghe', regionRu: 'Цинхэ' },
};

function parseClues(md) {
  const start = md.indexOf('| Clue                            | Possible Answers');
  const end = md.indexOf('## All Riddles Map', start);
  const block = md.slice(start, end);
  const clues = [];
  const seenIds = new Map();
  for (const line of block.split('\n')) {
    if (!line.startsWith('|') || line.includes('Clue') || /^[\|\s\-:]+$/.test(line)) continue;
    const cells = line.split('|').map(c => c.trim()).filter(Boolean);
    if (cells.length < 2) continue;
    const clueEn = cells[0];
    if (!clueEn || clueEn.length < 2) continue;
    const answers = cells[1].split(/,\s*/).map(a => a.trim().replace(/\s+/g, ' ')).filter(Boolean);
    let id = slug(clueEn);
    const n = (seenIds.get(id) || 0) + 1;
    seenIds.set(id, n);
    if (n > 1) id = `${id}-${n}`;
    clues.push({ id, clueEn, answers, primaryAnswer: answers[0] || '' });
  }
  return clues;
}

function parseMasters(md) {
  const start = md.indexOf('## All Riddle Locations');
  const end = md.indexOf('## How to Solve Riddles', start);
  const block = md.slice(start, end);
  const masters = [];
  for (const line of block.split('\n')) {
    const m = line.match(/\*\*([^*]+)\*\*\s*\|\s*\*\*Location:\*\*\s*([^,]+),\s*\[([^\]]+)\]/);
    if (!m) continue;
    const nameEn = m[1].trim();
    const locationTitle = m[2].trim();
    const subregion = m[3].trim();
    const rest = line.slice(m.index + m[0].length);
    const intM = rest.match(/Intelligence x(\d+)/i);
    const costM = rest.match(/Commerce Coin x(\d+)/i);
    const detailM = line.match(/\]\([^)]*\)\s+([\s\S]+?)(?:\s*\*\*Conditions:)/);
    const reg = REGION_MAP[subregion] || { region: 'kaifeng', regionRu: 'Кайфэн' };
    masters.push({
      id: slug(nameEn),
      nameEn,
      nameRu: MASTER_RU[nameEn] || nameEn,
      region: reg.region,
      regionLabelRu: reg.regionRu,
      locationTitle,
      subregion,
      locationDetail: (detailM?.[1] || '').trim().slice(0, 500),
      intelligence: intM ? Number(intM[1]) : 40,
      commerceCost: costM ? Number(costM[1]) : 20,
    });
  }
  return masters;
}

export async function run({ input, dryRun = false } = {}) {
  const mdPath = resolveInput(input, '566908-0.md');
  if (!mdPath) return { skipped: true, reason: 'Нет uploads/566908-0.md' };

  const md = fs.readFileSync(mdPath, 'utf8');
  const clues = parseClues(md);
  const masters = parseMasters(md);
  const prevClues = readJson(CLUES_OUT, []);
  const prevMasters = readJson(MASTERS_OUT, []);
  const diffClues = diffById(prevClues, clues);
  const diffMasters = diffById(prevMasters, masters);

  if (!dryRun) {
    writeJson(CLUES_OUT, clues);
    writeJson(MASTERS_OUT, masters);
    updateManifest('riddles', { clues: clues.length, masters: masters.length, source: mdPath });
  }
  printDiff('riddles/clues', diffClues);
  printDiff('riddles/masters', diffMasters);
  return {
    section: 'riddles',
    count: clues.length + masters.length,
    diff: { clues: diffClues, masters: diffMasters },
    written: dryRun ? [] : [CLUES_OUT, MASTERS_OUT],
  };
}
