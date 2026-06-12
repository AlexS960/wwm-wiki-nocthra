import { slug } from './utils.mjs';

export function isGame8Html(content) {
  return /<!DOCTYPE html|<html[\s>]/i.test(content) || /<h2 class=['"]a-header--2/i.test(content);
}

function stripTags(html) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<hr[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractLinkText(html) {
  const m = html.match(/<a[^>]*>([^<]+)<\/a>/i);
  return m ? m[1].trim() : stripTags(html);
}

/** Clues from Game8 HTML table (All Riddle Solutions) */
export function parseRiddleCluesHtml(html) {
  const start = html.search(/All Riddle Solutions/i);
  if (start < 0) return [];
  const block = html.slice(start);
  const end = block.search(/All Riddles Map|All Riddle Locations/i);
  const table = end > 0 ? block.slice(0, end) : block;

  const clues = [];
  const seenIds = new Map();
  const rowRe = /<tr>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/gi;
  let m;
  while ((m = rowRe.exec(table)) !== null) {
    const clueEn = stripTags(m[1]);
    const answersRaw = stripTags(m[2]);
    if (!clueEn || clueEn.toLowerCase() === 'clue' || clueEn.length < 2) continue;
    if (clueEn.length > 120 || /^if you encounter/i.test(clueEn)) continue;
    const answers = answersRaw.split(/,\s*/).map(a => a.trim()).filter(Boolean);
    let id = slug(clueEn);
    const n = (seenIds.get(id) || 0) + 1;
    seenIds.set(id, n);
    if (n > 1) id = `${id}-${n}`;
    clues.push({
      id,
      clueEn,
      answers,
      primaryAnswer: answers[0] || '',
    });
  }
  return clues;
}

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
  'Kaifeng Prefecture': { region: 'kaifeng', regionRu: 'Кайфэн' },
};

/** Masters from Game8 HTML (All Riddle Locations) */
export function parseRiddleMastersHtml(html) {
  const start = html.search(/All Riddle Locations/i);
  if (start < 0) return [];
  const block = html.slice(start);

  const masters = [];
  const rowRe = /<b class=['"]a-bold['"]>([^<]+)<\/b>[\s\S]*?<b class=['"]a-bold['"]>Location:<\/b>\s*([^,<]+),[\s\S]*?<a[^>]*>([^<]+)<\/a>[\s\S]*?<br>\s*([\s\S]*?)<\/div>[\s\S]*?Intelligence x(\d+)[\s\S]*?Commerce Coin x(\d+)/gi;
  let m;
  while ((m = rowRe.exec(block)) !== null) {
    const nameEn = m[1].trim();
    const locationTitle = m[2].trim();
    const subregion = m[3].trim();
    const locationDetail = stripTags(m[4]).slice(0, 500);
    const reg = REGION_MAP[subregion] || { region: 'kaifeng', regionRu: 'Кайфэн' };
    masters.push({
      id: slug(nameEn),
      nameEn,
      nameRu: MASTER_RU[nameEn] || nameEn,
      region: reg.region,
      regionLabelRu: reg.regionRu,
      locationTitle,
      subregion,
      locationDetail,
      intelligence: Number(m[5]) || 40,
      commerceCost: Number(m[6]) || 20,
    });
  }
  return masters;
}

const NPC_REGION_MAP = {
  Qinghe: { region: 'qinghe', regionLabel: 'Qinghe' },
  Kaifeng: { region: 'kaifeng', regionLabel: 'Kaifeng' },
  Hexi: { region: 'hexi', regionLabel: 'Hexi' },
};

/** NPC locations from Game8 HTML */
export function parseNpcLocationsHtml(html) {
  const start = html.search(/List of Interactable NPCs/i);
  if (start < 0) return [];
  const block = html.slice(start);

  const items = [];
  const seen = new Set();
  const rows = block.split(/<tr[\s>]/i).slice(1);

  for (const row of rows) {
    if (!/data-cell=["']NPC["']/i.test(row)) continue;
    const nameM = row.match(/data-cell=["']NPC["'][\s\S]*?<a[^>]*>([^<]+)<\/a>/i);
    if (!nameM) continue;
    const nameEn = nameM[1].trim();
    if (!nameEn || nameEn === 'NPC') continue;

    const regionM = row.match(/data-cell=["']Region["'][\s\S]*?<a[^>]*>([^<]+)<\/a>/i);
    const regionLabel = regionM?.[1]?.trim() || '';

    const locM = row.match(/Location:<\/b>\s*([^,<]+),[\s\S]*?<a[^>]*>([^<]+)<\/a>/i);
    const detailM = row.match(/<br>\s*([^<]+(?:<[^/][^>]*>[^<]*)*)/i);

    const id = slug(nameEn);
    if (seen.has(id)) continue;
    seen.add(id);
    const reg = NPC_REGION_MAP[regionLabel] || { region: slug(regionLabel), regionLabel };
    items.push({
      id,
      nameEn,
      region: reg.region,
      regionLabel: reg.regionLabel,
      locationTitle: locM?.[1]?.trim() || '',
      subregion: locM?.[2]?.trim() || '',
      locationDetail: stripTags(detailM?.[1] || '').slice(0, 500),
    });
  }
  return items;
}
