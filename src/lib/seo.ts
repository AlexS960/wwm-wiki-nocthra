import routes from '../seo/routes.json';
import { pathFromPage } from './appRoutes';
import { buildSectionItemListJsonLd } from './seoItemLists';

export const SITE_NAME = 'WWM Вики Ру — Nocthra';
export const SITE_ALTERNATE_NAME = 'Where Winds Meet Wiki RU';
export const SITE_LOCALE = 'ru_RU';
export const DEFAULT_OG_IMAGE = '/images/hero-bg.jpg';
export const SITE_LOGO = '/images/wwm-logo.png';

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

export interface WikiCardSeoContext {
  wikiCardId: string;
  wikiCardTitle: string;
  wikiCardDescription?: string;
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

function organizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Nocthra',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: absoluteAssetUrl(SITE_LOGO),
    },
  };
}

function buildBreadcrumbJsonLd(
  pageId: string,
  seo: PageSeo,
  wikiCard?: WikiCardSeoContext,
): Record<string, unknown> {
  const key = pageId === 'main' ? 'home' : pageId;
  const crumbs: { name: string; url: string }[] = [
    { name: 'Главная', url: absoluteUrl('/') },
  ];

  if (key !== 'home') {
    const sectionTitle = seoById.get(key)?.title ?? seo.title;
    crumbs.push({
      name: sectionTitle.split(' — ')[0] || sectionTitle,
      url: absoluteUrl(seo.path?.split('#')[0] || pathFromPage(key)),
    });
  }

  if (wikiCard) {
    crumbs.push({
      name: wikiCard.wikiCardTitle,
      url: absoluteUrl(
        `${seo.path?.split('#')[0] || pathFromPage(key)}#wiki-card-${wikiCard.wikiCardId}`,
      ),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

function buildWebSiteJsonLd(seo: PageSeo): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: SITE_ALTERNATE_NAME,
    url: SITE_URL,
    description: seo.description,
    inLanguage: 'ru-RU',
    publisher: organizationJsonLd(),
    image: absoluteAssetUrl(DEFAULT_OG_IMAGE),
  };
}

function buildWebPageJsonLd(pageId: string, seo: PageSeo, url: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: seo.title,
    description: seo.description,
    url,
    inLanguage: 'ru-RU',
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

function buildWikiCardJsonLd(
  pageId: string,
  seo: PageSeo,
  url: string,
  card: WikiCardSeoContext,
): Record<string, unknown> {
  const sectionLabel = seoById.get(pageId === 'main' ? 'home' : pageId)?.title?.split(' — ')[0]
    ?? seo.title;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: card.wikiCardTitle,
    name: card.wikiCardTitle,
    description: card.wikiCardDescription || seo.description,
    url,
    inLanguage: 'ru-RU',
    isPartOf: {
      '@type': 'WebPage',
      name: sectionLabel,
      url: absoluteUrl(seo.path || pathFromPage(pageId)),
    },
    publisher: organizationJsonLd(),
  };
}

function buildJsonLd(
  pageId: string,
  seo: PageSeo,
  wikiCard?: WikiCardSeoContext,
): Pick<PageSeo, 'jsonLd'> {
  const key = pageId === 'main' ? 'home' : pageId;
  const path = seo.path || pathFromPage(key);
  const url = wikiCard
    ? absoluteUrl(`${path}#wiki-card-${wikiCard.wikiCardId}`)
    : absoluteUrl(path);
  const blocks: Record<string, unknown>[] = [];

  if (key === 'home') {
    blocks.push(buildWebSiteJsonLd(seo));
    blocks.push(organizationJsonLd());
    return { jsonLd: blocks };
  }

  if (wikiCard) {
    blocks.push(buildWikiCardJsonLd(key, seo, url, wikiCard));
    blocks.push(buildBreadcrumbJsonLd(key, seo, wikiCard));
    return { jsonLd: blocks };
  }

  if (key === 'wwmwiki') {
    const sectionPaths = [
      'guides', 'weapons', 'builds', 'sects', 'bosses', 'npcs', 'riddles',
      'innerpath', 'mystic', 'cooking', 'lifeskills', 'tips',
    ];
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: seo.title,
      description: seo.description,
      url,
      inLanguage: 'ru-RU',
      isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
      hasPart: sectionPaths.map((id) => ({
        '@type': 'WebPage',
        name: seoById.get(id)?.title ?? id,
        url: absoluteUrl(pathFromPage(id)),
      })),
    });
  } else {
    blocks.push(buildWebPageJsonLd(key, seo, url));
  }

  blocks.push(buildBreadcrumbJsonLd(key, seo));

  const itemList = buildSectionItemListJsonLd(key);
  if (itemList) blocks.push(itemList);

  return { jsonLd: blocks };
}

export function seoForPage(pageId: string, wikiCard?: WikiCardSeoContext): PageSeo {
  const key = pageId === 'main' ? 'home' : pageId;
  if (seoById.has(key)) {
    const base = seoById.get(key)!;
    let seo: PageSeo = { ...base, ...buildJsonLd(pageId, base, wikiCard) };

    if (wikiCard) {
      const shortSection = base.title.split(' — ')[0] || base.title;
      seo = {
        ...seo,
        title: `${wikiCard.wikiCardTitle} — ${shortSection} | WWM Вики`,
        description: wikiCard.wikiCardDescription?.trim() || base.description,
        path: `${base.path || pathFromPage(key)}#wiki-card-${wikiCard.wikiCardId}`,
      };
    }
    return seo;
  }

  const label = pageId.charAt(0).toUpperCase() + pageId.slice(1);
  const path = pathFromPage(pageId);
  const fallback: PageSeo = {
    title: `${label} — WWM Вики`,
    description: DEFAULT_SEO.description,
    path,
  };
  return {
    ...fallback,
    ...buildJsonLd(pageId, fallback, wikiCard),
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
