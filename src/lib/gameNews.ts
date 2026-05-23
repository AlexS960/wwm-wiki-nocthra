export interface GameNewsItem {
  id: string;
  date: string;
  title: string;
  excerpt: string;
  url: string;
}

const OFFICIAL_URL = 'https://www.wherewindsmeetgame.com/index.html';
const CACHE_KEY = 'wwm_game_news_cache';
const CACHE_TTL_MS = 60 * 60 * 1000;

const NEWS_LINK_RE =
  /\[(\d{4}-\d{2}-\d{2})【NEWS】([^\]]+)\]\((https:\/\/www\.wherewindsmeetgame\.com\/news\/[^)]+)\)/g;

function parseNewsFromHtml(html: string): GameNewsItem[] {
  const seen = new Set<string>();
  const items: GameNewsItem[] = [];

  for (const match of html.matchAll(NEWS_LINK_RE)) {
    const [, date, rawTitle, url] = match;
    if (seen.has(url)) continue;
    seen.add(url);

    const titleMatch = rawTitle.match(/^(.+?)(?=\d+\.\s|Dear |$)/);
    const title = (titleMatch?.[1] || rawTitle).trim();
    items.push({
      id: url.split('/').pop() || url,
      date,
      title: title.length > 120 ? title.slice(0, 117) + '…' : title,
      excerpt: '',
      url,
    });
    if (items.length >= 12) break;
  }

  return items;
}

async function fetchOfficialHtml(): Promise<string> {
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(OFFICIAL_URL)}`;
  const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function readCache(): { items: GameNewsItem[]; fetchedAt: number } | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeCache(items: GameNewsItem[]) {
  localStorage.setItem(CACHE_KEY, JSON.stringify({ items, fetchedAt: Date.now() }));
}

export async function fetchGameNews(force = false): Promise<GameNewsItem[]> {
  const cached = readCache();
  if (!force && cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.items;
  }

  try {
    const html = await fetchOfficialHtml();
    const items = parseNewsFromHtml(html);
    if (items.length > 0) {
      writeCache(items);
      return items;
    }
  } catch {
    /* fallback to cache */
  }

  return cached?.items ?? [];
}
