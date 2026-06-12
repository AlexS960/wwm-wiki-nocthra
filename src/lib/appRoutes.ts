import routes from '../seo/routes.json';

export type AppPageId = string;

const PATH_TO_PAGE = new Map<string, AppPageId>();
const PAGE_TO_PATH = new Map<AppPageId, string>();

for (const route of routes) {
  const normalized = normalizePath(route.path);
  PATH_TO_PAGE.set(normalized, route.id === 'home' ? 'main' : route.id);
  PAGE_TO_PATH.set(route.id, normalized);
  if (route.id === 'home') PAGE_TO_PATH.set('main', normalized);
}

export function normalizePath(pathname: string): string {
  const trimmed = pathname.split('?')[0].split('#')[0].trim();
  if (!trimmed || trimmed === '/') return '/';
  const withSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withSlash.replace(/\/+$/, '') || '/';
}

export function pageFromPath(pathname: string): AppPageId | null {
  return PATH_TO_PAGE.get(normalizePath(pathname)) ?? null;
}

export function pathFromPage(pageId: string): string {
  if (pageId === 'home') return '/';
  return PAGE_TO_PATH.get(pageId) ?? PAGE_TO_PATH.get('main') ?? '/';
}

export function isKnownPath(pathname: string): boolean {
  return PATH_TO_PAGE.has(normalizePath(pathname));
}

export const PUBLIC_ROUTE_PATHS = routes
  .filter((r) => !r.noindex)
  .map((r) => normalizePath(r.path));
