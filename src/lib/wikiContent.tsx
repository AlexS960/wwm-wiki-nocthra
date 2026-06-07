import type { ReactNode } from 'react';
import { Star } from 'lucide-react';
import { parseInline, type RenderOpts } from './bbcode';

export type { RenderOpts };

const ALIGN_CLASS: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

function parseAlignLine(line: string): { align: string; text: string } | null {
  const prefix = line.match(/^>>(left|center|right)\s+(.+)$/i);
  if (prefix) return { align: prefix[1].toLowerCase(), text: prefix[2] };
  const tag = line.match(/^\[align=(left|center|right)\]([\s\S]*)\[\/align\]$/i);
  if (tag) return { align: tag[1].toLowerCase(), text: tag[2] };
  return null;
}

function renderParagraph(line: string, key: string, opts: RenderOpts, className = 'text-ink-200 text-sm leading-relaxed') {
  const aligned = parseAlignLine(line);
  if (aligned) {
    return (
      <p key={key} className={`${className} ${ALIGN_CLASS[aligned.align] || 'text-left'}`}>
        {parseInline(aligned.text, opts)}
      </p>
    );
  }
  if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
    return (
      <p key={key} className="text-white font-semibold text-sm">
        {parseInline(line.slice(2, -2), opts)}
      </p>
    );
  }
  return (
    <p key={key} className={className}>
      {parseInline(line, opts)}
    </p>
  );
}

function isBullet(line: string) {
  return /^[-*•]\s+/.test(line);
}

function isNumbered(line: string) {
  return /^\d+\.\s+/.test(line);
}

function bulletText(line: string) {
  return line.replace(/^[-*•]\s+/, '');
}

function numberedText(line: string) {
  return line.replace(/^\d+\.\s+/, '');
}

/** Контент гайдов и разделов вики: заголовки, списки, цвет, выравнивание, BBCode. */
export function renderWikiContent(content: string, opts: RenderOpts = {}): ReactNode[] {
  const lines = content.split('\n');
  const nodes: ReactNode[] = [];
  let i = 0;
  let blockKey = 0;

  while (i < lines.length) {
    const line = lines[i];
    const key = `b-${blockKey++}`;

    if (!line.trim()) {
      nodes.push(<div key={key} className="h-2" />);
      i += 1;
      continue;
    }

    if (line.startsWith('## ')) {
      nodes.push(
        <h4 key={key} className="font-serif text-lg font-bold text-gold-400 mt-4 first:mt-0">
          {parseInline(line.slice(3), opts)}
        </h4>,
      );
      i += 1;
      continue;
    }

    if (line.startsWith('### ')) {
      nodes.push(
        <h5 key={key} className="font-serif text-base font-bold text-gold-300/90 mt-3">
          {parseInline(line.slice(4), opts)}
        </h5>,
      );
      i += 1;
      continue;
    }

    if (isBullet(line)) {
      const items: string[] = [];
      while (i < lines.length && isBullet(lines[i])) {
        items.push(bulletText(lines[i]));
        i += 1;
      }
      nodes.push(
        <ul key={key} className="space-y-1.5 pl-1">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-sm text-ink-200">
              <Star className="w-3 h-3 text-gold-400 mt-1 shrink-0" />
              <span className="flex-1 min-w-0">{parseInline(item, opts)}</span>
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    if (isNumbered(line)) {
      const items: string[] = [];
      while (i < lines.length && isNumbered(lines[i])) {
        items.push(numberedText(lines[i]));
        i += 1;
      }
      nodes.push(
        <ol key={key} className="space-y-1.5 pl-5 list-decimal text-sm text-ink-200 marker:text-gold-400/80">
          {items.map((item, j) => (
            <li key={j} className="leading-relaxed pl-1">
              {parseInline(item, opts)}
            </li>
          ))}
        </ol>,
      );
      continue;
    }

    nodes.push(renderParagraph(line, key, opts));
    i += 1;
  }

  return nodes;
}
