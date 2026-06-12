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

const WEAPON_TYPE_RU = {
  Swords: 'Меч',
  'Dual Blades': 'Парные клинки',
  Spears: 'Копьё',
  'Mo Blades': 'Мо-клинок',
  'Heng Blades': 'Хэн-клинки',
  'Rope Darts': 'Верёвочный дротик',
  Umbrellas: 'Зонт',
  Fans: 'Веер',
  Gauntlets: 'Перчатки',
};

const WEAPON_TYPE_ICON = {
  Swords: '⚔️',
  'Dual Blades': '🔪',
  Spears: '🔱',
  'Mo Blades': '🔨',
  'Heng Blades': '🗡️',
  'Rope Darts': '🪢',
  Umbrellas: '☂️',
  Fans: '🪭',
  Gauntlets: '🥊',
};

const WEAPON_NAME_RU = {
  'Nameless Sword': 'Безымянный Меч',
  'Strategic Sword': 'Стратегический Меч',
  'Nameless Spear': 'Безымянное Копьё',
  'Heavenquaker Spear': 'Копьё Небесного Грома',
  'Stormbreaker Spear': 'Разрушитель Бурь',
  'Infernal Twinblades': 'Инфернальные Клинки',
  'Thundercry Blade': 'Клинок Грома',
  'Phalanxbane Blade': 'Клинок Фаланги',
  'Snowparting Blade': 'Клинок Разделения Снега',
  'Mortal Rope Dart': 'Смертельный Дротик',
  'Unfettered Rope Dart': 'Свободный Дротик',
  'Vernal Umbrella': 'Весенний Зонт',
  'Soulshade Umbrella': 'Зонт Тени Души',
  'Everspring Umbrella': 'Вечновесенний Зонт',
  'Panacea Fan': 'Веер Панацеи',
  'Inkwell Fan': 'Чернильный Веер',
};

function normalizeGame8Url(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `https://game8.co${url.startsWith('/') ? '' : '/'}${url}`;
}

function extractLinksFromCell(cell) {
  const links = [];
  const mdRe = /\[([^\]]+)\]\(([^)]+)\)/g;
  let m;
  while ((m = mdRe.exec(cell)) !== null) {
    links.push({ name: m[1].trim(), url: normalizeGame8Url(m[2].trim()) });
  }
  if (links.length) return links;
  const htmlRe = /<a[^>]+href=['"]([^'"]+)['"][^>]*>([^<]+)<\/a>/gi;
  while ((m = htmlRe.exec(cell)) !== null) {
    links.push({ name: m[2].trim(), url: normalizeGame8Url(m[1].trim()) });
  }
  return links;
}

function toWeaponItem(typeNameEn, link) {
  const typeRu = WEAPON_TYPE_RU[typeNameEn] || typeNameEn;
  const nameEn = link.name;
  return {
    id: slug(nameEn),
    name: WEAPON_NAME_RU[nameEn] || nameEn,
    nameEn,
    type: typeRu,
    role: '',
    martialArt: '',
    pair: '',
    sect: '',
    howToGet: '',
    description: '',
    icon: WEAPON_TYPE_ICON[typeNameEn] || '⚔️',
    game8Url: link.url,
  };
}

/** Оружие: таблица All Weapon Types (тип → список Martial Arts) */
export function parseWeaponsContent(content) {
  const start =
    content.search(/##\s*All Weapon Types/i) >= 0
      ? content.search(/##\s*All Weapon Types/i)
      : content.search(/<h2[^>]*>All Weapon Types/i);
  if (start < 0) return [];
  const block = content.slice(start);
  const end = block.search(/##\s*Upcoming Weapon|##\s*How Weapons Work|<h2[^>]*>Upcoming Weapon|<h2[^>]*>How Weapons Work/i);
  const table = end > 0 ? block.slice(0, end) : block;

  const items = [];
  const seen = new Set();

  if (isGame8Html(content) && /<table/i.test(table)) {
    const rows = table.split(/<tr[\s>]/i).slice(1);
    for (const row of rows) {
      const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(m => m[1]);
      if (cells.length < 2) continue;
      const typeLinks = extractLinksFromCell(cells[0]);
      const typeName = typeLinks[0]?.name || stripTags(cells[0]);
      if (!typeName || /weapon|martial/i.test(typeName)) continue;
      for (const link of extractLinksFromCell(cells[1])) {
        const id = slug(link.name);
        if (seen.has(id)) continue;
        seen.add(id);
        items.push(toWeaponItem(typeName, link));
      }
    }
    return items;
  }

  for (const line of table.split('\n')) {
    if (!line.startsWith('|') || line.includes('---') || /^\|\s*Weapon\s*\|/i.test(line)) continue;
    const cells = line.split('|').map(c => c.trim()).filter(Boolean);
    if (cells.length < 2) continue;
    const typeLinks = extractLinksFromCell(cells[0]);
    const typeName = typeLinks[0]?.name || cells[0].replace(/\*\*/g, '');
    if (!typeName || /weapon|martial/i.test(typeName)) continue;
    for (const link of extractLinksFromCell(cells[1])) {
      const id = slug(link.name);
      if (seen.has(id)) continue;
      seen.add(id);
      items.push(toWeaponItem(typeName, link));
    }
  }
  return items;
}

function extractHtmlField(cell, label) {
  const parts = cell.split(/<hr[^>]*>/i);
  for (const part of parts) {
    if (!part.includes(label)) continue;
    const m = part.match(new RegExp(`${label}[\\s\\S]*?<br>([\\s\\S]*)$`, 'i'));
    if (m) return stripTags(m[1]);
  }
  const fallback = new RegExp(`${label}[\\s\\S]*?<br>([\\s\\S]*?)(?:<\\/td>|$)`, 'i');
  const m = cell.match(fallback);
  return m ? stripTags(m[1]) : '';
}

function extractPathFromCell(cell) {
  const afterHr = cell.split(/<hr[^>]*>/i).pop() || '';
  const path = stripTags(afterHr).trim();
  return path || 'General';
}

function extractNameFromLinkCell(cell) {
  const aMatch = cell.match(/<a[^>]*>([\s\S]*?)<\/a>/i);
  if (aMatch) {
    const text = stripTags(aMatch[1].replace(/<img[^>]*>/gi, ''));
    if (text) return text;
  }
  return stripTags(cell).split('\n')[0].trim();
}

/** Inner Ways: таблица Name | Effect + How to Get */
export function parseInnerWaysContent(content) {
  const start =
    content.search(/##\s*List of All Inner Ways/i) >= 0
      ? content.search(/##\s*List of All Inner Ways/i)
      : content.search(/<h2[^>]*>List of All Inner Ways/i);
  if (start < 0) throw new Error('Раздел "List of All Inner Ways" не найден на странице');

  const block = content.slice(start);
  const end = block.search(/How to Upgrade Inner Ways/i);
  const table = end > 0 ? block.slice(0, end) : block;

  const items = [];
  const seen = new Set();
  const rows = table.split(/<tr[\s>]/i).slice(1);

  for (const row of rows) {
    if (!/<td/i.test(row)) continue;
    const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(m => m[1]);
    if (cells.length < 2) continue;

    const nameEn = extractNameFromLinkCell(cells[0]);
    if (!nameEn || /inner way/i.test(nameEn)) continue;

    const id = slug(nameEn);
    if (seen.has(id)) continue;
    seen.add(id);

    items.push({
      id,
      nameEn,
      pathEn: extractPathFromCell(cells[0]),
      effect: extractHtmlField(cells[1], 'Effect'),
      howToGet: extractHtmlField(cells[1], 'How to Get'),
    });
  }

  if (!items.length && !isGame8Html(content)) {
    for (const line of table.split('\n')) {
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
  }

  if (!items.length) throw new Error('Таблица Inner Ways пуста или не распознана');
  return items;
}

export function parseInnerWaysMeta(content) {
  const introMatch = content.match(
    /Inner Ways, or Inner Arts, function as passive skills[^<.\n]+[.<]/i,
  );
  const intro = introMatch ? stripTags(introMatch[0]) : '';

  function parseHtmlSections(headingRe) {
    const m = content.match(headingRe);
    if (!m || m.index == null) return [];
    const start = m.index + m[0].length;
    const rest = content.slice(start);
    const end = rest.search(/<h2[^>]*>|## /);
    const block = end > 0 ? rest.slice(0, end) : rest;
    const sections = [];
    const parts = block.split(/<h3[^>]*>|### /i).slice(1);
    for (const part of parts) {
      const title = stripTags(part.split(/<\/h3>|<br/i)[0] || '').trim();
      const body = stripTags(part.replace(/^[^>]+>/, '')).trim();
      if (title) sections.push({ title, body });
    }
    return sections;
  }

  return {
    intro,
    upgradeSteps: parseHtmlSections(/How to Upgrade Inner Ways/i),
    explained: parseHtmlSections(/Inner Ways Explained/i),
  };
}
