/**
 * Парсинг диалога Game8: таблица после «Example of Successful Conversation».
 * **жирный** = реплика игрока; (действие) + текст = NPC; (you ...) = игрок.
 */

export function stripHtml(s) {
  return s
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function classifyDialogueCell(text) {
  const t = text.trim();
  if (!t || t.length < 2) return null;

  if (/Affection\s*\+\s*100|becomes\s+Revered/i.test(t)) {
    const aff = t.match(/\(Affection[^)]*\)/i);
    const rest = t.replace(aff?.[0] || '', '').trim();
    const out = [];
    if (rest) out.push({ role: 'npc', textEn: rest, textRu: rest });
    out.push({
      role: 'system',
      textEn: aff?.[0] || 'Affection +100, becomes Revered',
      textRu: 'Симпатия +100, статус «Почитаемый»',
    });
    return out;
  }

  if (/expresses gratitude|seems lost in thought|shouts excitedly/i.test(t) && !/^\*\*/.test(t)) {
    return [{ role: 'system', textEn: t, textRu: t }];
  }

  const boldOnly = t.match(/^\*\*([\s\S]+)\*\*$/);
  if (boldOnly) {
    const inner = boldOnly[1].trim();
    if (/^\(you\b/i.test(inner)) {
      return [{ role: 'player', textEn: inner, textRu: inner }];
    }
    return [{ role: 'player', textEn: inner, textRu: inner }];
  }

  if (/^\(you\b/i.test(t)) {
    return [{ role: 'player', textEn: t, textRu: t }];
  }

  if (/^\([^)]+\)\s*.+/.test(t) || /^\([a-z]/i.test(t)) {
    return [{ role: 'npc', textEn: t, textRu: t }];
  }

  if (/^(I |I'm |My |We |You must |Your |I am |To |In order|it taught|but of course)/i.test(t)) {
    return [{ role: 'player', textEn: t, textRu: t }];
  }

  if (/^[a-z]/.test(t) && t.length < 160) {
    const npcOpeners = /^(indeed|remarkable|thank you|wise|many |it is |such |do you|please|a cat call|hmmm)/i;
    if (!npcOpeners.test(t)) {
      return [{ role: 'player', textEn: t, textRu: t }];
    }
  }

  return [{ role: 'npc', textEn: t, textRu: t }];
}

/** Парсинг markdown-таблицы из сохранённой страницы Game8 */
export function parseConversationFromMarkdown(md, sectionStart = 0) {
  const idx = md.indexOf('### Example of Successful Conversation', sectionStart);
  if (idx < 0) return [];
  const end = md.indexOf('Note that AI conversations', idx);
  const block = md.slice(idx, end > idx ? end : idx + 12000);
  const lines = [];
  for (const raw of block.split('\n')) {
    const row = raw.match(/^\|\s*([\s\S]*?)\s*\|$/);
    if (!row) continue;
    let cell = row[1].trim();
    if (/^[-:]+$/.test(cell.replace(/\|/g, ''))) continue;
    if (cell.startsWith('---')) continue;
    cell = cell.replace(/\*\*/g, (m, off, s) => {
      const before = s.slice(0, off);
      const count = (before.match(/\*\*/g) || []).length;
      return count % 2 === 0 ? '**' : '**';
    });
    const parts = classifyDialogueCell(cell);
    if (parts) lines.push(...parts);
  }
  return lines;
}

/** Парсинг HTML страницы Game8 */
export function parseConversationFromHtml(html) {
  const idx = html.indexOf('Example of Successful Conversation');
  if (idx < 0) return [];
  const section = html.slice(idx, idx + 20000);
  const table = section.match(/<table[^>]*>([\s\S]*?)<\/table>/i);
  if (!table) return [];

  const lines = [];
  for (const tr of table[1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const td = tr[1].match(/<td[^>]*>([\s\S]*?)<\/td>/is);
    if (!td) continue;
    const rawCell = td[1];
    const hasStrong = /<strong/i.test(rawCell);
    let text = stripHtml(rawCell);
    if (!text) continue;

    if (hasStrong && !/^\*\*/.test(text)) {
      text = `**${text}**`;
    }

    const parts = classifyDialogueCell(text);
    if (parts) lines.push(...parts);
  }
  return lines;
}

export function extractBefriendGuideFromHtml(html, npcName) {
  const idx = html.indexOf('How to Befriend');
  if (idx < 0) return '';
  const end = html.indexOf('Example of Successful Conversation', idx);
  const chunk = html.slice(idx, end > idx ? end : idx + 8000);
  const parts = [];
  for (const h of chunk.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)) {
    const title = stripHtml(h[1]);
    const after = chunk.slice(h.index ?? 0, (h.index ?? 0) + 1200);
    const p = after.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    if (p && title && !/Sign Up|Log In/i.test(p[1])) {
      parts.push(`${title}\n${stripHtml(p[1])}`);
    }
  }
  return parts.join('\n\n').slice(0, 2000);
}

export function extractBefriendGuideFromMarkdown(md) {
  const idx = md.indexOf('## How to Befriend');
  if (idx < 0) return '';
  const end = md.indexOf('### Example of Successful Conversation', idx);
  const block = md.slice(idx, end > idx ? end : idx + 5000);
  const parts = [];
  for (const h of block.matchAll(/### ([^\n]+)\n+([^#\n|][\s\S]*?)(?=\n### |\n## |$)/g)) {
    const title = h[1].trim();
    const body = h[2].trim().replace(/\n+/g, ' ');
    if (title && body && !title.includes('Example')) parts.push(`${title}\n${body}`);
  }
  return parts.join('\n\n').slice(0, 2000);
}
