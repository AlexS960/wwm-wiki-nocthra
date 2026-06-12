import { slug, extractLinkName, parseMarkdownTable } from './utils.mjs';

export { extractLinkName };

/** Парсит таблицу Game8 со ссылками на элементы: | [Name](url) | col2 | ... */
export function parseLinkedTable(md, sectionHeading, minCols = 2) {
  const start = md.indexOf(sectionHeading);
  if (start < 0) return null;
  const block = md.slice(start);
  const rows = [];
  for (const cells of parseMarkdownTable(block, minCols)) {
    const nameEn = extractLinkName(cells[0]);
    if (!nameEn || nameEn.length < 2) continue;
    rows.push({ id: slug(nameEn), nameEn, cells });
  }
  return rows;
}

/** Извлекает поле **Label**: value из ячейки */
export function extractField(cell, label) {
  const re = new RegExp(`\\*\\*${label}\\*\\*:\\s*([^*]+)`, 'i');
  const m = cell.match(re);
  return m ? m[1].replace(/\s+/g, ' ').trim() : '';
}
