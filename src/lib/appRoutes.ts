import routes from '../seo/routes.json';

export type AppPageId = string;

const PATH_TO_PAGE = new Map<string, AppPageId>();
const PAGE_TO_PATH = new Map<AppPageId, string>();
const CUSTOM_PATH_TO_PAGE = new Map<string, AppPageId>();
const CUSTOM_PAGE_TO_PATH = new Map<AppPageId, string>();

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

/** Регистрация путей пользовательских разделов (из site_settings) */
export function registerCustomSectionRoutes(
  defs: Array<{ id: string; path?: string; visible?: boolean }>,
) {
  CUSTOM_PATH_TO_PAGE.clear();
  CUSTOM_PAGE_TO_PATH.clear();
  for (const d of defs) {
    if (d.visible === false) continue;
    const path = normalizePath(d.path || `/${d.id}`);
    CUSTOM_PATH_TO_PAGE.set(path, d.id);
    CUSTOM_PAGE_TO_PATH.set(d.id, path);
  }
}

export function pageFromPath(pathname: string): AppPageId | null {
  const norm = normalizePath(pathname);
  return PATH_TO_PAGE.get(norm) ?? CUSTOM_PATH_TO_PAGE.get(norm) ?? null;
}

export function pathFromPage(pageId: string): string {
  if (pageId === 'home') return '/';
  return PAGE_TO_PATH.get(pageId) ?? CUSTOM_PAGE_TO_PATH.get(pageId) ?? PAGE_TO_PATH.get('main') ?? '/';
}

export function isKnownPath(pathname: string): boolean {
  const norm = normalizePath(pathname);
  return PATH_TO_PAGE.has(norm) || CUSTOM_PATH_TO_PAGE.has(norm);
}

export const PUBLIC_ROUTE_PATHS = routes
  .filter(r => !r.noindex)
  .map(r => normalizePath(r.path));
