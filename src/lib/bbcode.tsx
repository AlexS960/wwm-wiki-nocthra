import type { ReactNode } from 'react';

export type RenderOpts = {
  linkClassName?: string;
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

function splitAndMap(
  nodes: ReactNode[],
  pattern: RegExp,
  mapMatch: (match: RegExpExecArray, key: string) => ReactNode,
): ReactNode[] {
  const out: ReactNode[] = [];
  for (const node of nodes) {
    if (typeof node !== 'string') {
      out.push(node);
      continue;
    }
    let last = 0;
    let idx = 0;
    pattern.lastIndex = 0;
    let match = pattern.exec(node);
    while (match) {
      const start = match.index;
      const end = start + match[0].length;
      if (start > last) out.push(node.slice(last, start));
      out.push(mapMatch(match, `${start}-${end}-${idx}`));
      last = end;
      idx += 1;
      match = pattern.exec(node);
    }
    if (last < node.length) out.push(node.slice(last));
  }
  return out;
}

export function parseInline(content: string, opts: RenderOpts = {}): ReactNode[] {
  let nodes: ReactNode[] = [content];

  nodes = splitAndMap(nodes, /\[code\]([\s\S]*?)\[\/code\]/gi, (m, key) => (
    <code key={`code-${key}`} className={opts.codeClassName || 'px-1.5 py-0.5 rounded bg-ink-800/70 text-ink-100 font-mono text-[0.92em]'}>
      {m[1]}
    </code>
  ));

  nodes = splitAndMap(nodes, /\[quote\]([\s\S]*?)\[\/quote\]/gi, (m, key) => (
    <blockquote key={`quote-${key}`} className={opts.quoteClassName || 'my-1 border-l-2 border-gold-400/40 pl-2 text-ink-300 italic'}>
      {parseInline(m[1], opts)}
    </blockquote>
  ));

  nodes = splitAndMap(nodes, /\[url=([^\]]+)\]([\s\S]*?)\[\/url\]/gi, (m, key) => (
    <a
      key={`url-eq-${key}`}
      href={m[1]}
      target="_blank"
      rel="noopener noreferrer"
      className={opts.linkClassName || 'text-blue-300 hover:text-blue-200 underline break-all'}
    >
      {parseInline(m[2], opts)}
    </a>
  ));

  nodes = splitAndMap(nodes, /\[url\]([\s\S]*?)\[\/url\]/gi, (m, key) => {
    const href = m[1].trim();
    return (
      <a
        key={`url-${key}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={opts.linkClassName || 'text-blue-300 hover:text-blue-200 underline break-all'}
      >
        {href}
      </a>
    );
  });

  nodes = splitAndMap(nodes, /\[color=([#a-z0-9(),.\s-]+)\]([\s\S]*?)\[\/color\]/gi, (m, key) => {
    const raw = m[1].trim().toLowerCase();
    const color = NAMED_COLORS[raw] || m[1];
    return (
      <span key={`color-${key}`} style={{ color }}>
        {parseInline(m[2], opts)}
      </span>
    );
  });

  nodes = splitAndMap(nodes, /\[b\]([\s\S]*?)\[\/b\]/gi, (m, key) => <strong key={`b-${key}`}>{parseInline(m[1], opts)}</strong>);
  nodes = splitAndMap(nodes, /\[i\]([\s\S]*?)\[\/i\]/gi, (m, key) => <em key={`i-${key}`}>{parseInline(m[1], opts)}</em>);
  nodes = splitAndMap(nodes, /\[u\]([\s\S]*?)\[\/u\]/gi, (m, key) => <u key={`u-${key}`}>{parseInline(m[1], opts)}</u>);
  nodes = splitAndMap(nodes, /\[s\]([\s\S]*?)\[\/s\]/gi, (m, key) => <s key={`s-${key}`}>{parseInline(m[1], opts)}</s>);

  nodes = splitAndMap(nodes, /(https?:\/\/[^\s<]+)/gi, (m, key) => (
    <a
      key={`plain-url-${key}`}
      href={m[1]}
      target="_blank"
      rel="noopener noreferrer"
      className={opts.linkClassName || 'text-blue-300 hover:text-blue-200 underline break-all'}
    >
      {m[1]}
    </a>
  ));

  return nodes;
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

