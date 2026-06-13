import { pageFromPath, pathFromPage, normalizePath } from './appRoutes';
import { wikiCardDomId } from './buildLookup';

export const WIKI_CARD_HASH_PREFIX = 'wiki-card-';

export function wikiCardHash(articleId: string): string {
  return `${WIKI_CARD_HASH_PREFIX}${articleId}`;
}

/** Относительная ссылка на карточку вики: /weapons#wiki-card-nameless-sword */
export function wikiCardHref(sectionId: string, articleId: string): string {
  return `${pathFromPage(sectionId)}#${wikiCardHash(articleId)}`;
}

/** BBCode для вставки в редактор карточки */
export function wikiCardLinkBbcode(sectionId: string, articleId: string, label: string): string {
  const safeLabel = label.trim() || articleId;
  return `[url=${wikiCardHref(sectionId, articleId)}]${safeLabel}[/url]`;
}

/** Markdown-ссылка на карточку */
export function wikiCardLinkMarkdown(sectionId: string, articleId: string, label: string): string {
  const safeLabel = label.trim() || articleId;
  return `[${safeLabel}](${wikiCardHref(sectionId, articleId)})`;
}

export function parseWikiCardLink(href: string): { sectionId: string; articleId: string } | null {
  const raw = href.trim();
  if (!raw) return null;

  let pathname = '';
  let hash = '';

  if (raw.startsWith('#')) {
    hash = raw.slice(1);
  } else {
    try {
      const base = raw.startsWith('/') ? 'https://wiki.local' : undefined;
      const url = base ? new URL(raw, base) : new URL(raw);
      pathname = url.pathname;
      hash = url.hash.replace(/^#/, '');
    } catch {
      return null;
    }
  }

  if (!hash.startsWith(WIKI_CARD_HASH_PREFIX)) return null;
  const articleId = hash.slice(WIKI_CARD_HASH_PREFIX.length);
  if (!articleId) return null;

  if (!pathname) {
    return { sectionId: '', articleId };
  }

  const sectionId = pageFromPath(normalizePath(pathname));
  if (!sectionId || sectionId === 'main') return null;
  return { sectionId, articleId };
}

export function isWikiCardLink(href: string): boolean {
  return parseWikiCardLink(href) !== null;
}

export function scrollToWikiCard(articleId: string, behavior: ScrollBehavior = 'smooth'): boolean {
  const el = document.getElementById(wikiCardDomId(articleId));
  if (!el) return false;
  el.scrollIntoView({ behavior, block: 'center' });
  return true;
}
