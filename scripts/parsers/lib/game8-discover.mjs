import fs from 'fs';
import path from 'path';
import { fetchMarkdown, UPLOADS } from './utils.mjs';
import { PARSERS } from '../registry.mjs';

export const DEFAULT_WIKI_URL = 'https://game8.co/games/Where-Winds-Meet';

/** Правила подбора страницы-источника для каждого парсера */
export const DISCOVERY_RULES = {
  weapons: {
    section: /## Where Winds Meet Weapons/i,
    matchers: [
      { text: /List of All Weapons and Weapon Types/i, score: 120 },
      { text: /List of All Weapons/i, score: 90 },
      { href: /\/564704\b/, score: 100 },
    ],
  },
  riddles: {
    section: /## Where Winds Meet Sentient Beings/i,
    matchers: [
      { text: /^Riddle$/i, score: 110 },
      { text: /All Riddle Answers/i, score: 120 },
      { href: /\/566908\b/, score: 100 },
    ],
  },
  'npcs-locations': {
    section: /## Where Winds Meet NPCs/i,
    matchers: [
      { text: /List of.*Interactable NPC/i, score: 120 },
      { text: /^List of NPCs$/i, score: 100 },
      { href: /\/565812\b/, score: 110 },
    ],
  },
  'npcs-dialogues': {
    section: /## Where Winds Meet NPCs/i,
    matchers: [
      { href: /\/565812\b/, score: 110 },
    ],
  },
  innerpath: {
    section: /## Where Winds Meet Inner Ways/i,
    matchers: [
      { text: /List of All Inner Ways/i, score: 120 },
      { href: /\/564726\b/, score: 100 },
    ],
  },
  bosses: {
    section: /## Where Winds Meet Bosses/i,
    matchers: [
      { text: /List of All Bosses/i, score: 120 },
      { href: /\/563680\b/, score: 90 },
    ],
  },
  mystic: {
    section: /## Where Winds Meet Mystic Skills/i,
    matchers: [
      { text: /List of All Mystic Skills/i, score: 120 },
      { href: /\/564723\b/, score: 100 },
    ],
  },
  cooking: {
    section: /## Where Winds Meet Profession/i,
    matchers: [
      { text: /Cooking|Culinary|Recipe/i, score: 80 },
      { text: /List of All Professions/i, score: 60 },
      { href: /\/564897\b/, score: 90 },
    ],
  },
};

function normalizeUrl(href) {
  if (!href) return '';
  if (href.startsWith('http')) return href.split('?')[0];
  if (href.startsWith('/')) return `https://game8.co${href.split('?')[0]}`;
  return `https://game8.co/${href.split('?')[0]}`;
}

export function extractAllLinks(content) {
  const links = [];
  const seen = new Set();

  const mdRe = /\[([^\]]+)\]\(([^)]+)\)/g;
  let m;
  while ((m = mdRe.exec(content)) !== null) {
    const url = normalizeUrl(m[2].trim());
    const text = m[1].trim();
    const key = `${text}|${url}`;
    if (!seen.has(key)) {
      seen.add(key);
      links.push({ text, url, index: m.index });
    }
  }

  const htmlRe = /<a[^>]+href=['"]([^'"]+)['"][^>]*>([^<]+)<\/a>/gi;
  while ((m = htmlRe.exec(content)) !== null) {
    const url = normalizeUrl(m[1].trim());
    const text = m[2].replace(/\s+/g, ' ').trim();
    const key = `${text}|${url}`;
    if (!seen.has(key) && /archives\/\d+/.test(url)) {
      seen.add(key);
      links.push({ text, url, index: m.index });
    }
  }

  return links;
}

function sliceSection(content, sectionRe) {
  const m = content.match(sectionRe);
  if (!m || m.index == null) return content;
  const start = m.index;
  const rest = content.slice(start + 1);
  const next = rest.search(/^## /m);
  return next >= 0 ? content.slice(start, start + 1 + next) : content.slice(start);
}

function scoreLink(link, matchers) {
  let score = 0;
  for (const rule of matchers) {
    if (rule.text && rule.text.test(link.text)) score += rule.score;
    if (rule.href && rule.href.test(link.url)) score += rule.score;
  }
  return score;
}

export function discoverSourcesFromContent(content) {
  const allLinks = extractAllLinks(content);
  const sources = {};

  for (const [parserId, rule] of Object.entries(DISCOVERY_RULES)) {
    const cfg = PARSERS[parserId];
    const fallback = cfg?.game8Url || '';
    const scope = rule.section ? sliceSection(content, rule.section) : content;
    const scopeLinks = allLinks.filter(l => scope.includes(l.url) || scope.includes(l.text));

    let best = { url: '', score: 0, label: '' };
    for (const link of scopeLinks.length ? scopeLinks : allLinks) {
      const s = scoreLink(link, rule.matchers);
      if (s > best.score) best = { url: link.url, score: s, label: link.text };
    }

    const sectionOnHub = rule.section ? rule.section.test(content) : false;

    if (best.score >= 40) {
      sources[parserId] = {
        url: best.url,
        score: best.score,
        label: best.label || cfg?.label || parserId,
        matched: true,
        via: 'link',
      };
    } else if (sectionOnHub && fallback) {
      sources[parserId] = {
        url: fallback,
        score: 50,
        label: cfg?.label || parserId,
        matched: true,
        via: 'section',
      };
    } else if (fallback) {
      sources[parserId] = {
        url: fallback,
        score: 0,
        label: 'По умолчанию (реестр)',
        matched: false,
        via: 'registry',
      };
    } else {
      sources[parserId] = {
        url: best.url || '',
        score: best.score,
        label: best.label || parserId,
        matched: false,
        via: 'none',
      };
    }
  }

  return sources;
}

export async function discoverSourcesFromWiki(wikiUrl = DEFAULT_WIKI_URL) {
  const archiveId = wikiUrl.match(/archives\/(\d+)/)?.[1];
  const cacheName = archiveId ? `wiki-${archiveId}.md` : 'Where-Winds-Meet.md';
  const cachePath = path.join(UPLOADS, cacheName);

  await fetchMarkdown(wikiUrl, cachePath);
  const content = fs.readFileSync(cachePath, 'utf8');
  const sources = discoverSourcesFromContent(content);

  return {
    wikiUrl,
    cachePath,
    sources,
    scannedAt: new Date().toISOString(),
    linkCount: extractAllLinks(content).length,
  };
}
