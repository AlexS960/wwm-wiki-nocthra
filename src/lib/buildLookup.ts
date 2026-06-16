import type { WikiArticle } from '../context/AuthContext';

export function isKnownBuild(buildId: string, wikiArticles: WikiArticle[]): boolean {
  return wikiArticles.some(a => a.section === 'builds' && a.id === buildId);
}

export function resolveBuildName(buildId: string, wikiArticles: WikiArticle[]): string | null {
  return wikiArticles.find(a => a.section === 'builds' && a.id === buildId)?.title ?? null;
}

export function buildCardDomId(buildId: string): string {
  return `build-card-${buildId}`;
}

export function wikiCardDomId(articleId: string): string {
  return `wiki-card-${articleId}`;
}

export function findBuildCardElement(buildId: string): HTMLElement | null {
  return document.getElementById(wikiCardDomId(buildId));
}
