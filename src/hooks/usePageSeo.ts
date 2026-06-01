import { useEffect } from 'react';
import { DEFAULT_SEO, SITE_URL, seoForPage, type PageSeo } from '../lib/seo';

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

export function applyPageSeo(seo: PageSeo) {
  document.title = seo.title;
  setMeta('description', seo.description);
  setMeta('og:title', seo.title, 'property');
  setMeta('og:description', seo.description, 'property');
  setMeta('og:type', 'website', 'property');
  setMeta('twitter:card', 'summary_large_image', 'name');
  setMeta('twitter:title', seo.title, 'name');
  setMeta('twitter:description', seo.description, 'name');
  const path = seo.path || '/';
  setMeta('og:url', `${SITE_URL}${path}`, 'property');
  setCanonical(`${SITE_URL}${path}`);
  setMeta('robots', seo.noindex ? 'noindex, nofollow' : 'index, follow');
}

export function usePageSeo(pageId: string) {
  useEffect(() => {
    applyPageSeo(seoForPage(pageId === 'main' ? 'home' : pageId));
    return () => applyPageSeo(DEFAULT_SEO);
  }, [pageId]);
}
