import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RU_PATH = path.join(__dirname, 'data', 'innerPathRu.json');

const PATH_ICONS = {
  'Рассечение бамбука — Пыль': '🎋',
  'Рассечение бамбука — Ветер': '🌬️',
  'Удар колокола — Великолепие': '🔔',
  'Удар колокола — Умбра': '🌑',
  'Рассечение камня — Мощь': '⛰️',
  'Шелковое связывание — Потоп': '💧',
  'Шелковое связывание — Нефрит': '💎',
  'Общий путь': '☯️',
};

function buildContent(effect, howToGet) {
  return `## Эффект\n${effect}\n\n## Как получить\n${howToGet}`;
}

export function loadInnerPathRuMap() {
  const raw = fs.readFileSync(RU_PATH, 'utf8');
  return JSON.parse(raw);
}

/** Статьи внутреннего пути для Supabase (source: custom). */
export function buildInnerPathWikiArticles() {
  const map = loadInnerPathRuMap();
  const articles = [];

  for (const [id, row] of Object.entries(map)) {
    if (!row.title || !row.effect || !row.howToGet) continue;
    if (row.effect.includes('Требуется ручной перевод')) continue;

    const category = row.pathCategory || 'Общий путь';
    articles.push({
      id,
      section: 'innerpath',
      title: row.title,
      icon: PATH_ICONS[category] || '☯️',
      content: buildContent(row.effect, row.howToGet),
      authorName: 'Nocthra Wiki',
      updatedAt: new Date().toISOString(),
      fields: {
        source: 'custom',
        summary: row.effect,
        category,
      },
      images: [],
    });
  }

  return articles;
}
