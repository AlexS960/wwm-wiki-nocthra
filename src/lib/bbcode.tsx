import type { ReactNode } from 'react';
import { logger } from './logger';
import WikiInternalLink from '../components/ui/WikiInternalLink';
import { isWikiCardLink } from './wikiLinks';

export type RenderOpts = {
  linkClassName?: string;
  wikiLinkClassName?: string;
  quoteClassName?: string;
  codeClassName?: string;
};

const NAMED_COLORS: Record<string, string> = {
  gold: '#d4a528',
  jade: '#4ade80',
  crimson: '#f87171',
  blue: '#93c5fd',
  white: '#ffffff',
  muted: '#9ca3af',
};

let nodeKey = 0;
function key(prefix: string) {
  nodeKey += 1;
  return `${prefix}-${nodeKey}`;
}

type OpenTag =
  | { kind: 'code'; len: number }
  | { kind: 'quote'; len: number }
  | { kind: 'url-eq'; href: string; len: number }
  | { kind: 'url'; len: number }
  | { kind: 'color'; color: string; len: number }
  | { kind: 'b' | 'i' | 'u' | 's'; len: number };

function closeFor(tag: OpenTag): string {
  switch (tag.kind) {
    case 'code': return '[/code]';
    case 'quote': return '[/quote]';
    case 'url-eq':
    case 'url': return '[/url]';
    case 'color': return '[/color]';
    default: return `[/${tag.kind}]`;
  }
}

function sameTagKind(a: OpenTag, b: OpenTag): boolean {
  if (a.kind === 'url-eq' || a.kind === 'url') return b.kind === 'url-eq' || b.kind === 'url';
  return a.kind === b.kind;
}

function matchOpenTag(text: string, pos: number): OpenTag | null {
  if (text[pos] !== '[') return null;
  const tail = text.slice(pos);

  let m = tail.match(/^\[code\]/i);
  if (m) return { kind: 'code', len: m[0].length };

  m = tail.match(/^\[quote\]/i);
  if (m) return { kind: 'quote', len: m[0].length };

  m = tail.match(/^\[url=([^\]]+)\]/i);
  if (m) return { kind: 'url-eq', href: m[1], len: m[0].length };

  m = tail.match(/^\[url\]/i);
  if (m) return { kind: 'url', len: m[0].length };

  m = tail.match(/^\[color=([#a-z0-9(),.\s-]+)\]/i);
  if (m) return { kind: 'color', color: m[1], len: m[0].length };

  m = tail.match(/^\[(b|i|u|s)\]/i);
  if (m) return { kind: m[1].toLowerCase() as 'b' | 'i' | 'u' | 's', len: m[0].length };

  return null;
}

const MD_LINK_RE = /^\[([^\]]+)\]\(([^)]+)\)/;

function matchMarkdownLink(text: string, pos: number): { label: string; href: string; len: number } | null {
  if (text[pos] !== '[') return null;
  const m = text.slice(pos).match(MD_LINK_RE);
  if (!m) return null;
  return { label: m[1], href: m[2], len: m[0].length };
}

function renderMarkdownLink(label: string, href: string, opts: RenderOpts): ReactNode {
  if (isWikiCardLink(href)) {
    return (
      <WikiInternalLink
        key={key('md-wiki')}
        href={href}
        className={opts.wikiLinkClassName || opts.linkClassName || 'text-gold-300 hover:text-gold-200 underline underline-offset-2'}
      >
        {label}
      </WikiInternalLink>
    );
  }
  return (
    <a
      key={key('md-url')}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={opts.linkClassName || 'text-blue-300 hover:text-blue-200 underline break-all'}
    >
      {label}
    </a>
  );
}

/** Ищет закрывающий тег с учётом вложенности одноимённых тегов. */
function findMatchingClose(text: string, innerStart: number, open: OpenTag): number {
  const close = closeFor(open);
  const closeLower = close.toLowerCase();
  let depth = 0;
  let pos = innerStart;

  while (pos < text.length) {
    const bracket = text.indexOf('[', pos);
    if (bracket === -1) return -1;

    const sliceLower = text.slice(bracket).toLowerCase();
    if (sliceLower.startsWith(closeLower)) {
      if (depth === 0) return bracket;
      depth -= 1;
      pos = bracket + close.length;
      continue;
    }

    const nested = matchOpenTag(text, bracket);
    if (nested && sameTagKind(nested, open)) {
      depth += 1;
      pos = bracket + nested.len;
      continue;
    }

    pos = bracket + 1;
  }

  return -1;
}

function linkifyHttp(text: string, opts: RenderOpts): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(https?:\/\/[^\s<]+)/gi;
  let last = 0;
  let match = pattern.exec(text);
  while (match) {
    const start = match.index;
    const end = start + match[0].length;
    if (start > last) nodes.push(text.slice(last, start));
    nodes.push(
      <a
        key={key('plain-url')}
        href={match[1]}
        target="_blank"
        rel="noopener noreferrer"
        className={opts.linkClassName || 'text-blue-300 hover:text-blue-200 underline break-all'}
      >
        {match[1]}
      </a>,
    );
    last = end;
    match = pattern.exec(text);
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes.length ? nodes : [text];
}

function linkifyPlainText(text: string, opts: RenderOpts): ReactNode[] {
  const nodes: ReactNode[] = [];
  const mdPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match = mdPattern.exec(text);
  while (match) {
    const start = match.index;
    const end = start + match[0].length;
    if (start > last) nodes.push(...linkifyHttp(text.slice(last, start), opts));
    nodes.push(renderMarkdownLink(match[1], match[2], opts));
    last = end;
    match = mdPattern.exec(text);
  }
  if (last < text.length) nodes.push(...linkifyHttp(text.slice(last), opts));
  return nodes.length ? nodes : [text];
}

function renderTag(open: OpenTag, inner: string, opts: RenderOpts): ReactNode {
  switch (open.kind) {
    case 'code':
      return (
        <code key={key('code')} className={opts.codeClassName || 'px-1.5 py-0.5 rounded bg-ink-800/70 text-ink-100 font-mono text-[0.92em]'}>
          {inner}
        </code>
      );
    case 'quote': {
      const children = parseFragment(inner, opts);
      return (
        <blockquote key={key('quote')} className={opts.quoteClassName || 'my-1 border-l-2 border-gold-400/40 pl-2 text-ink-300 italic'}>
          {children}
        </blockquote>
      );
    }
    case 'url-eq': {
      const children = parseFragment(inner, opts);
      if (isWikiCardLink(open.href)) {
        return (
          <WikiInternalLink
            key={key('wiki-url-eq')}
            href={open.href}
            className={opts.wikiLinkClassName || opts.linkClassName || 'text-gold-300 hover:text-gold-200 underline underline-offset-2'}
          >
            {children}
          </WikiInternalLink>
        );
      }
      return (
        <a
          key={key('url-eq')}
          href={open.href}
          target="_blank"
          rel="noopener noreferrer"
          className={opts.linkClassName || 'text-blue-300 hover:text-blue-200 underline break-all'}
        >
          {children}
        </a>
      );
    }
    case 'url': {
      const href = inner.trim();
      if (isWikiCardLink(href)) {
        return (
          <WikiInternalLink
            key={key('wiki-url')}
            href={href}
            className={opts.wikiLinkClassName || opts.linkClassName || 'text-gold-300 hover:text-gold-200 underline underline-offset-2'}
          >
            {href}
          </WikiInternalLink>
        );
      }
      return (
        <a
          key={key('url')}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={opts.linkClassName || 'text-blue-300 hover:text-blue-200 underline break-all'}
        >
          {href}
        </a>
      );
    }
    case 'color': {
      const raw = open.color.trim().toLowerCase();
      const color = NAMED_COLORS[raw] || open.color;
      const children = parseFragment(inner, opts);
      return (
        <span key={key('color')} style={{ color }}>
          {children}
        </span>
      );
    }
    case 'b': {
      const children = parseFragment(inner, opts);
      return <strong key={key('b')}>{children}</strong>;
    }
    case 'i': {
      const children = parseFragment(inner, opts);
      return <em key={key('i')}>{children}</em>;
    }
    case 'u': {
      const children = parseFragment(inner, opts);
      return <u key={key('u')}>{children}</u>;
    }
    case 's': {
      const children = parseFragment(inner, opts);
      return <s key={key('s')}>{children}</s>;
    }
    default:
      return <>{parseFragment(inner, opts)}</>;
  }
}

/** Рекурсивный разбор BBCode с корректной вложенностью в любом порядке. */
function parseFragment(text: string, opts: RenderOpts): ReactNode[] {
  const nodes: ReactNode[] = [];
  let pos = 0;

  while (pos < text.length) {
    const bracket = text.indexOf('[', pos);
    if (bracket === -1) {
      nodes.push(...linkifyPlainText(text.slice(pos), opts));
      break;
    }

    if (bracket > pos) {
      nodes.push(...linkifyPlainText(text.slice(pos, bracket), opts));
    }

    const open = matchOpenTag(text, bracket);
    if (!open) {
      const md = matchMarkdownLink(text, bracket);
      if (md) {
        nodes.push(renderMarkdownLink(md.label, md.href, opts));
        pos = bracket + md.len;
        continue;
      }
      nodes.push('[');
      pos = bracket + 1;
      continue;
    }

    const innerStart = bracket + open.len;
    const closeStart = findMatchingClose(text, innerStart, open);
    if (closeStart === -1) {
      const md = matchMarkdownLink(text, bracket);
      if (md) {
        nodes.push(renderMarkdownLink(md.label, md.href, opts));
        pos = bracket + md.len;
        continue;
      }
      nodes.push('[');
      pos = bracket + 1;
      continue;
    }

    const inner = text.slice(innerStart, closeStart);
    nodes.push(renderTag(open, inner, opts));
    pos = closeStart + closeFor(open).length;
  }

  return nodes;
}

export function parseInline(content: string, opts: RenderOpts = {}): ReactNode[] {
  if (!content) return [];
  try {
    nodeKey = 0;
    return parseFragment(content, opts);
  } catch (err) {
    logger.error('BBCode parse failed', 'bbcode', err);
    return [content];
  }
}

export function renderBBCode(content: string, opts: RenderOpts = {}): ReactNode {
  const lines = content.split('\n');
  return lines.map((line, i) => (
    <span key={`line-${i}`}>
      {parseInline(line, opts)}
      {i < lines.length - 1 ? <br /> : null}
    </span>
  ));
}
