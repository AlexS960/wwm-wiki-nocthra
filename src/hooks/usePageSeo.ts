import { useEffect, useMemo } from 'react';
import { faqs, siteRoleFaqs } from '../data/gameData';
import type { WikiArticle } from '../types/site';
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
  type WikiCardSeoContext,
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

function setHreflang(href: string) {
  let el = document.querySelector('link[rel="alternate"][hreflang="ru"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = 'alternate';
    el.hreflang = 'ru';
    document.head.appendChild(el);
  }
  el.href = href;
}

function setJsonLd(data: Record<string, unknown> | Record<string, unknown>[] | undefined) {
  document.querySelectorAll(`script[id^="${JSON_LD_ID}"]`).forEach((el) => el.remove());
  if (!data) return;
  const items = Array.isArray(data) ? data : [data];
  items.forEach((item, index) => {
    const script = document.createElement('script');
    script.id = items.length === 1 ? JSON_LD_ID : `${JSON_LD_ID}-${index}`;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(item);
    document.head.appendChild(script);
  });
}

function applyVerificationMetas() {
  const google = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION as string | undefined;
  const yandex = import.meta.env.VITE_YANDEX_VERIFICATION as string | undefined;
  const bing = import.meta.env.VITE_BING_SITE_VERIFICATION as string | undefined;
  if (google?.trim()) setMeta('google-site-verification', google.trim());
  if (yandex?.trim()) setMeta('yandex-verification', yandex.trim());
  if (bing?.trim()) setMeta('msvalidate.01', bing.trim());
}

export function applyPageSeo(seo: PageSeo) {
  const path = seo.path || '/';
  const canonical = path.startsWith('http') ? path : `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const ogImage = absoluteAssetUrl(seo.ogImage || DEFAULT_OG_IMAGE);
  const imageAlt = seo.title;

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
  setMeta('og:image:secure_url', ogImage, 'property');
  setMeta('og:image:alt', imageAlt, 'property');

  setMeta('twitter:card', 'summary_large_image', 'name');
  setMeta('twitter:title', seo.title, 'name');
  setMeta('twitter:description', seo.description, 'name');
  setMeta('twitter:image', ogImage, 'name');
  setMeta('twitter:image:alt', imageAlt, 'name');

  setCanonical(canonical);
  setHreflang(canonical);
  setMeta('robots', seo.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
  setJsonLd(seo.jsonLd);
  applyVerificationMetas();
}

function wikiCardContextFromArticle(article: WikiArticle | null | undefined): WikiCardSeoContext | undefined {
  if (!article) return undefined;
  return {
    wikiCardId: article.id,
    wikiCardTitle: article.title,
    wikiCardDescription: article.fields?.summary,
  };
}

export function usePageSeo(
  pageId: string,
  wikiCardArticle?: WikiArticle | null,
) {
  const wikiCard = useMemo(
    () => wikiCardContextFromArticle(wikiCardArticle),
    [wikiCardArticle],
  );

  useEffect(() => {
    let seo = seoForPage(pageId === 'main' ? 'home' : pageId, wikiCard);
    if (pageId === 'faq') {
      const allFaqs = [...siteRoleFaqs, ...faqs];
      const faqLd = buildFaqJsonLd(allFaqs);
      const existing = seo.jsonLd;
      seo = {
        ...seo,
        jsonLd: existing
          ? [...(Array.isArray(existing) ? existing : [existing]), faqLd]
          : faqLd,
      };
    }
    applyPageSeo(seo);
    return () => applyPageSeo(DEFAULT_SEO);
  }, [pageId, wikiCard]);
}
