import type { BuildPath } from '../data/gameData';
import type { WikiArticle } from '../context/AuthContext';

export function resolveBuildName(
  buildId: string,
  items: Pick<BuildPath, 'id' | 'name'>[],
  wikiArticles: WikiArticle[],
): string {
  return (
    items.find(b => b.id === buildId)?.name
    ?? wikiArticles.find(a => a.section === 'builds' && a.id === buildId)?.title
    ?? buildId
  );
}

export function buildCardDomId(buildId: string): string {
  return `build-card-${buildId}`;
}

export function wikiCardDomId(articleId: string): string {
  return `wiki-card-${articleId}`;
}

export function findBuildCardElement(buildId: string): HTMLElement | null {
  return (
    document.getElementById(buildCardDomId(buildId))
    ?? document.getElementById(wikiCardDomId(buildId))
  );
}
