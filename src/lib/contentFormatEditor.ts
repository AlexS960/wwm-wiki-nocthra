/** Вставка разметки в textarea (гайды, разделы вики). */

export const EDITOR_TEXT_COLORS = [
  { id: 'gold', label: 'Золотой', tag: 'gold' },
  { id: 'jade', label: 'Зелёный', tag: 'jade' },
  { id: 'crimson', label: 'Красный', tag: 'crimson' },
  { id: 'blue', label: 'Синий', tag: 'blue' },
  { id: 'white', label: 'Белый', tag: 'white' },
  { id: 'muted', label: 'Серый', tag: 'muted' },
] as const;

export type InlinePairTag = 'b' | 'i' | 'u' | 's';

export type FormatResult = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
};

const PAIR_TAGS: InlinePairTag[] = ['b', 'i', 'u', 's'];

function pairTokens(tag: InlinePairTag) {
  return { open: `[${tag}]`, close: `[/${tag}]` };
}

function findPairClose(value: string, innerStart: number, tag: InlinePairTag): number {
  const { open, close } = pairTokens(tag);
  const closeLower = close.toLowerCase();
  let depth = 0;
  let pos = innerStart;

  while (pos < value.length) {
    const bracket = value.indexOf('[', pos);
    if (bracket === -1) return -1;

    const sliceLower = value.slice(bracket).toLowerCase();
    if (sliceLower.startsWith(closeLower)) {
      if (depth === 0) return bracket;
      depth -= 1;
      pos = bracket + close.length;
      continue;
    }

    if (sliceLower.startsWith(`[${tag}]`)) {
      depth += 1;
      pos = bracket + open.length;
      continue;
    }

    pos = bracket + 1;
  }

  return -1;
}

type TagRegion = { tag: InlinePairTag; openStart: number; contentStart: number; contentEnd: number; closeEnd: number };

/** Самая внутренняя парная обёртка, внутри которой стоит курсор. */
function innermostTagAt(value: string, pos: number): TagRegion | null {
  let best: TagRegion | null = null;

  for (const tag of PAIR_TAGS) {
    const { open, close } = pairTokens(tag);
    let searchFrom = 0;

    while (searchFrom < value.length) {
      const openStart = value.indexOf(open, searchFrom);
      if (openStart === -1) break;

      const contentStart = openStart + open.length;
      const closeStart = findPairClose(value, contentStart, tag);
      if (closeStart === -1) break;

      const closeEnd = closeStart + close.length;
      if (openStart <= pos && pos <= closeEnd) {
        const span = closeEnd - openStart;
        if (!best || span < best.closeEnd - best.openStart) {
          best = { tag, openStart, contentStart, contentEnd: closeStart, closeEnd };
        }
      }

      searchFrom = openStart + open.length;
    }
  }

  return best;
}

function expandWord(value: string, pos: number): { start: number; end: number } {
  const isWord = (ch: string) => /[\w\u0400-\u04FF]/.test(ch);
  let start = pos;
  let end = pos;
  while (start > 0 && isWord(value[start - 1])) start -= 1;
  while (end < value.length && isWord(value[end])) end += 1;
  if (start === end && pos < value.length) return { start: pos, end: pos + 1 };
  return { start, end };
}

function expandSelection(value: string, start: number, end: number): { start: number; end: number } {
  if (start !== end) return { start, end };

  const inner = innermostTagAt(value, start);
  if (inner) return { start: inner.contentStart, end: inner.contentEnd };

  return expandWord(value, start);
}

function isWrappedWith(value: string, start: number, end: number, tag: InlinePairTag): boolean {
  const { open, close } = pairTokens(tag);
  return value.slice(start, end).startsWith(open) && value.slice(start, end).endsWith(close);
}

function hasOuterWrap(value: string, start: number, end: number, tag: InlinePairTag): boolean {
  const { open, close } = pairTokens(tag);
  const before = value.slice(Math.max(0, start - open.length), start);
  const after = value.slice(end, end + close.length);
  return before === open && after === close;
}

/**
 * Оборачивает выделение парным BB-тегом. Поддерживает произвольный порядок:
 * после применения выделение остаётся на тексте, чтобы следующий стиль накладывался поверх.
 */
export function wrapInlineTag(
  value: string,
  start: number,
  end: number,
  tag: InlinePairTag,
  placeholder = 'текст',
): FormatResult {
  const { open, close } = pairTokens(tag);
  let s: number;
  let e: number;
  ({ start: s, end: e } = expandSelection(value, start, end));

  let selected = value.slice(s, e);
  if (!selected.trim()) selected = placeholder;

  if (isWrappedWith(value, s, e, tag)) {
    const inner = selected.slice(open.length, selected.length - close.length);
    const next = value.slice(0, s) + inner + value.slice(e);
    return { value: next, selectionStart: s, selectionEnd: s + inner.length };
  }

  if (hasOuterWrap(value, s, e, tag)) {
    const inner = selected;
    const next = value.slice(0, s - open.length) + inner + value.slice(e + close.length);
    const newStart = s - open.length;
    return { value: next, selectionStart: newStart, selectionEnd: newStart + inner.length };
  }

  const wrapped = open + selected + close;
  const next = value.slice(0, s) + wrapped + value.slice(e);
  const innerStart = s + open.length;
  const innerEnd = innerStart + selected.length;
  return { value: next, selectionStart: innerStart, selectionEnd: innerEnd };
}

export function wrapSelection(
  value: string,
  start: number,
  end: number,
  open: string,
  close: string,
  placeholder = 'текст',
): FormatResult {
  let s: number;
  let e: number;
  ({ start: s, end: e } = expandSelection(value, start, end));

  const selected = value.slice(s, e) || placeholder;
  const wrapped = open + selected + close;
  const next = value.slice(0, s) + wrapped + value.slice(e);
  const innerStart = s + open.length;
  const innerEnd = innerStart + selected.length;
  return { value: next, selectionStart: innerStart, selectionEnd: innerEnd };
}

export function insertAtCursor(
  value: string,
  start: number,
  end: number,
  insert: string,
): FormatResult {
  const next = value.slice(0, start) + insert + value.slice(end);
  const cursor = start + insert.length;
  return { value: next, selectionStart: cursor, selectionEnd: cursor };
}

function stripAlignMarkup(line: string): string {
  return line
    .replace(/^>>(?:left|center|right)\s+/i, '')
    .replace(/^\[align=(?:left|center|right)\]/i, '')
    .replace(/\[\/align\]$/i, '')
    .trimStart();
}

/** Убрать выравнивание с текущей строки. */
export function stripLineAlign(value: string, cursor: number): { value: string; cursor: number } {
  const lineStart = value.lastIndexOf('\n', cursor - 1) + 1;
  const lineEndRaw = value.indexOf('\n', cursor);
  const lineEnd = lineEndRaw === -1 ? value.length : lineEndRaw;
  const stripped = stripAlignMarkup(value.slice(lineStart, lineEnd));
  const next = value.slice(0, lineStart) + stripped + value.slice(lineEnd);
  return { value: next, cursor: lineStart + stripped.length };
}

/** Префикс для текущей строки (выравнивание). */
export function prefixCurrentLine(
  value: string,
  cursor: number,
  prefix: string,
): { value: string; cursor: number } {
  const lineStart = value.lastIndexOf('\n', cursor - 1) + 1;
  const lineEndRaw = value.indexOf('\n', cursor);
  const lineEnd = lineEndRaw === -1 ? value.length : lineEndRaw;
  const line = value.slice(lineStart, lineEnd);
  const nextLine = prefix + stripAlignMarkup(line);
  const next = value.slice(0, lineStart) + nextLine + value.slice(lineEnd);
  return { value: next, cursor: lineStart + nextLine.length };
}

export const FORMAT_HELP = [
  '## Заголовок раздела',
  '- маркированный список',
  '1. нумерованный список',
  '[b]жирный[/b]  [i]курсив[/i]  [u]подчёркнутый[/u]  [s]зачёркнутый[/s]',
  'Стили можно комбинировать в любом порядке: [u][b]текст[/b][/u]',
  '[color=gold]цветной текст[/color]',
  '[url=https://…]текст[/url]  [code]фрагмент[/code]',
  '>>center текст по центру',
  '>>right текст справа',
];
