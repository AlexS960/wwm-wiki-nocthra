import weaponsParsed from '../data/parsed/weapons.json';
import { pathFromPage } from './appRoutes';
import { wikiCardHash } from './wikiLinks';

const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '')
  || 'https://wwm-wiki-nocthra.ru';

type ParsedWeapon = { id: string; name: string; nameEn?: string };

function absoluteUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}

function wikiCardAbsoluteUrl(sectionId: string, articleId: string): string {
  const base = pathFromPage(sectionId);
  return absoluteUrl(`${base}#${wikiCardHash(articleId)}`);
}

/** ItemList для разделов с карточками — помогает Google/Яндекс/Bing понять структуру каталога. */
export function buildSectionItemListJsonLd(sectionId: string): Record<string, unknown> | null {
  if (sectionId === 'weapons') {
    const items = weaponsParsed as ParsedWeapon[];
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Каталог оружия Where Winds Meet',
      numberOfItems: items.length,
      itemListElement: items.map((w, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: w.nameEn ? `${w.name} (${w.nameEn})` : w.name,
        url: wikiCardAbsoluteUrl('weapons', w.id),
      })),
    };
  }
  return null;
}
