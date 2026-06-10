import { useEffect } from 'react';
import { faqs, siteRoleFaqs } from '../data/gameData';
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_SEO,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL,
  absoluteAssetUrl,
  buildFaqJsonLd,
  seoForPage,
  type PageSeo,
} from '../lib/seo';

const JSON_LD_ID = 'page-jsonld';

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
}

function setJsonLd(data: Record<string, unknown> | Record<string, unknown>[] | undefined) {
  const existing = document.getElementById(JSON_LD_ID);
  if (existing) existing.remove();
  if (!data) return;
  const script = document.createElement('script');
  script.id = JSON_LD_ID;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

export function applyPageSeo(seo: PageSeo) {
  const path = seo.path || '/';
  const canonical = `${SITE_URL}${path}`;
  const ogImage = absoluteAssetUrl(seo.ogImage || DEFAULT_OG_IMAGE);

  document.title = seo.title;
  document.documentElement.lang = 'ru';

  setMeta('description', seo.description);
  if (seo.keywords) setMeta('keywords', seo.keywords);

  setMeta('og:title', seo.title, 'property');
  setMeta('og:description', seo.description, 'property');
  setMeta('og:type', 'website', 'property');
  setMeta('og:locale', SITE_LOCALE, 'property');
  setMeta('og:site_name', SITE_NAME, 'property');
  setMeta('og:url', canonical, 'property');
  setMeta('og:image', ogImage, 'property');

  setMeta('twitter:card', 'summary_large_image', 'name');
  setMeta('twitter:title', seo.title, 'name');
  setMeta('twitter:description', seo.description, 'name');
  setMeta('twitter:image', ogImage, 'name');

  setCanonical(canonical);
  setMeta('robots', seo.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
  setJsonLd(seo.jsonLd);
}

export function usePageSeo(pageId: string) {
  useEffect(() => {
    let seo = seoForPage(pageId === 'main' ? 'home' : pageId);
    if (pageId === 'faq') {
      const allFaqs = [...siteRoleFaqs, ...faqs];
      seo = { ...seo, jsonLd: buildFaqJsonLd(allFaqs) };
    }
    applyPageSeo(seo);
    return () => applyPageSeo(DEFAULT_SEO);
  }, [pageId]);
}
