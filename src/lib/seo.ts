export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '')
  || 'https://wwm-wiki-nocthra-vnd6.vercel.app';

export interface PageSeo {
  title: string;
  description: string;
  path?: string;
  noindex?: boolean;
}

export const DEFAULT_SEO: PageSeo = {
  title: 'Where Winds Meet — База знаний | WWM Вики Ру',
  description: 'Русскоязычная вики по Where Winds Meet: гайды, оружие, секты, билды, NPC, загадки и советы. Сообщество гильдии Nocthra.',
  path: '/',
};

export const PAGE_SEO: Record<string, PageSeo> = {
  main: DEFAULT_SEO,
  home: DEFAULT_SEO,
  wwmwiki: {
    title: 'WWM-Вики Ру — разделы базы знаний',
    description: 'Оружие, секты, билды, боссы, NPC, загадки, готовка и жизненные навыки Where Winds Meet.',
    path: '/wwmwiki',
  },
  guides: {
    title: 'Гайды Where Winds Meet',
    description: 'Пошаговые гайды и разборы механик WWM на русском языке.',
    path: '/guides',
  },
  suggestions: {
    title: 'Предложения и пожелания — WWM Вики',
    description: 'Предложите улучшения для сайта и вики: новые разделы, исправления, идеи для гильдии Nocthra.',
    path: '/suggestions',
  },
  faq: {
    title: 'FAQ — WWM Вики',
    description: 'Частые вопросы о сайте и игре Where Winds Meet.',
    path: '/faq',
  },
  users: {
    title: 'Пользователи — WWM Вики',
    description: 'Список зарегистрированных пользователей вики.',
    path: '/users',
  },
  weapons: { title: 'Оружие — WWM Вики', description: 'Типы оружия и механики Where Winds Meet.', path: '/weapons' },
  builds: { title: 'Билды — WWM Вики', description: 'Сборки персонажей PvE и PvP.', path: '/builds' },
  sects: { title: 'Секты — WWM Вики', description: 'Школы и стили боя WWM.', path: '/sects' },
  bosses: { title: 'Боссы — WWM Вики', description: 'Тактики и механики боссов.', path: '/bosses' },
  npcs: { title: 'NPC — WWM Вики', description: 'НПС, дружба и диалоги.', path: '/npcs' },
  riddles: { title: 'Загадки — WWM Вики', description: 'Подсказки и ответы на загадки WWM.', path: '/riddles' },
};

export function seoForPage(pageId: string): PageSeo {
  if (PAGE_SEO[pageId]) return PAGE_SEO[pageId];
  if (pageId === 'admin' || pageId === 'staffchat') {
    return { title: 'Служебный раздел', description: DEFAULT_SEO.description, noindex: true };
  }
  const label = pageId.charAt(0).toUpperCase() + pageId.slice(1);
  return {
    title: `${label} — WWM Вики`,
    description: DEFAULT_SEO.description,
    path: `/${pageId}`,
  };
}
