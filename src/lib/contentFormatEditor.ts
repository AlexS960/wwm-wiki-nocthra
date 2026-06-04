/** Вставка разметки в textarea (гайды, разделы вики). */

export const EDITOR_TEXT_COLORS = [
  { id: 'gold', label: 'Золотой', tag: 'gold' },
  { id: 'jade', label: 'Зелёный', tag: 'jade' },
  { id: 'crimson', label: 'Красный', tag: 'crimson' },
  { id: 'blue', label: 'Синий', tag: 'blue' },
  { id: 'white', label: 'Белый', tag: 'white' },
  { id: 'muted', label: 'Серый', tag: 'muted' },
] as const;

export function wrapSelection(
  value: string,
  start: number,
  end: number,
  open: string,
  close: string,
  placeholder = 'текст',
): { value: string; cursor: number } {
  const selected = value.slice(start, end) || placeholder;
  const next = value.slice(0, start) + open + selected + close + value.slice(end);
  const cursor = start + open.length + selected.length + close.length;
  return { value: next, cursor };
}

export function insertAtCursor(
  value: string,
  start: number,
  end: number,
  insert: string,
): { value: string; cursor: number } {
  const next = value.slice(0, start) + insert + value.slice(end);
  return { value: next, cursor: start + insert.length };
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
  '[color=gold]цветной текст[/color]',
  '[url=https://…]текст[/url]  [code]фрагмент[/code]',
  '>>center текст по центру',
  '>>right текст справа',
];
