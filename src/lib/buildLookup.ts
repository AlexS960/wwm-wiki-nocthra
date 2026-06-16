import type { WikiArticle } from '../context/AuthContext';

import { getAllSeedArticles } from './sectionSeeds';

export function isKnownBuild(buildId: string, wikiArticles: WikiArticle[]): boolean {
  if (wikiArticles.some(a => a.section === 'builds' && a.id === buildId)) return true;
  return getAllSeedArticles().some(a => a.section === 'builds' && a.id === buildId);
}

export function resolveBuildName(buildId: string, wikiArticles: WikiArticle[]): string | null {
  const fromWiki = wikiArticles.find(a => a.section === 'builds' && a.id === buildId)?.title;
  if (fromWiki) return fromWiki;
  return getAllSeedArticles().find(a => a.section === 'builds' && a.id === buildId)?.title ?? null;
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
