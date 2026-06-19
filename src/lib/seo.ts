import routes from '../seo/routes.json';
import { pathFromPage } from './appRoutes';

export const SITE_NAME = 'WWM Вики Ру — Nocthra';
export const SITE_LOCALE = 'ru_RU';
export const DEFAULT_OG_IMAGE = '/images/hero-bg.jpg';

export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '')
  || 'https://wwm-wiki-nocthra.ru';

export interface PageSeo {
  title: string;
  description: string;
  path?: string;
  noindex?: boolean;
  keywords?: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

type RouteRow = (typeof routes)[number];

function routeToSeo(route: RouteRow): PageSeo {
  const row = route as RouteRow & { keywords?: string; ogImage?: string };
  return {
    title: route.title,
    description: route.description,
    path: route.path,
    noindex: route.noindex,
    keywords: row.keywords,
    ogImage: row.ogImage,
  };
}

const seoById = new Map<string, PageSeo>();
for (const route of routes) {
  seoById.set(route.id, routeToSeo(route));
  if (route.id === 'home') seoById.set('main', routeToSeo(route));
}

export const DEFAULT_SEO: PageSeo = seoById.get('home')!;

export const PAGE_SEO: Record<string, PageSeo> = Object.fromEntries(
  routes.map((r) => [r.id, routeToSeo(r)]),
);

export function absoluteUrl(path = '/'): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}

export function absoluteAssetUrl(assetPath: string): string {
  const p = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
  return `${SITE_URL}${p}`;
}

export function seoForPage(pageId: string): PageSeo {
  const key = pageId === 'main' ? 'home' : pageId;
  if (seoById.has(key)) {
    const base = seoById.get(key)!;
    return { ...base, ...buildJsonLd(pageId, base) };
  }
  const label = pageId.charAt(0).toUpperCase() + pageId.slice(1);
  const path = pathFromPage(pageId);
  return {
    title: `${label} — WWM Вики`,
    description: DEFAULT_SEO.description,
    path,
    ...buildJsonLd(pageId, { title: `${label} — WWM Вики`, description: DEFAULT_SEO.description, path }),
  };
}

function buildJsonLd(pageId: string, seo: PageSeo): Pick<PageSeo, 'jsonLd'> {
  const url = absoluteUrl(seo.path || pathFromPage(pageId === 'main' ? 'home' : pageId));
  const isHome = pageId === 'main' || pageId === 'home';

  if (isHome) {
    return {
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
        description: seo.description,
        inLanguage: 'ru',
        publisher: {
          '@type': 'Organization',
          name: 'Nocthra',
          url: SITE_URL,
        },
      },
    };
  }

  return {
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: seo.title,
      description: seo.description,
      url,
      inLanguage: 'ru',
      isPartOf: {
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
  };
}

export function buildFaqJsonLd(items: { question: string; answer: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
