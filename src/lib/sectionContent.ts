/** Парсинг и сборка структурированного markdown-контента карточек разделов. */

export function parseSectionContent(content: string) {
  const lines = content.split('\n').map(l => l.trim());

  const findHeader = (header: string) =>
    lines.findIndex(l => l.toLowerCase() === header.toLowerCase());

  const getLine = (header: string) => {
    const idx = findHeader(header);
    return idx >= 0 ? (lines[idx + 1] || '') : '';
  };

  const getList = (header: string) => {
    const idx = findHeader(header);
    if (idx < 0) return [] as string[];
    const out: string[] = [];
    for (let i = idx + 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;
      if (line.startsWith('## ')) break;
      if (line.startsWith('- ')) out.push(line.slice(2).trim());
      else if (out.length > 0) out[out.length - 1] += ` ${line}`;
    }
    return out;
  };

  return { getLine, getList, lines };
}

export function buildSectionContent(sections: Array<{ header: string; body: string | string[] }>): string {
  const parts: string[] = [];
  for (const { header, body } of sections) {
    if (!header) continue;
    parts.push(header);
    if (Array.isArray(body)) {
      if (body.length === 0) continue;
      parts.push(...body.map(x => `- ${x}`));
    } else if (body.trim()) {
      parts.push(body.trim());
    }
    parts.push('');
  }
  return parts.join('\n').trim();
}

export function listToTextarea(items: string[]): string {
  return items.map(x => x.startsWith('- ') ? x.slice(2) : x).join('\n');
}

export function textareaToList(text: string): string[] {
  return text
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(l => (l.startsWith('- ') ? l.slice(2) : l));
}
