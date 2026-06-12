import type {
  FooterSettings,
  HeroSettings,
  HomeBlockConfig,
  HomeBlockId,
  SiteBranding,
  SiteSettings,
} from '../types/site';

export const DEFAULT_HERO_BG = '/images/hero-bg.jpg';
export const DEFAULT_LOGO = '/images/wwm-logo.png';

export const DEFAULT_HERO: HeroSettings = {
  titleWhite: 'Where Winds ',
  titleGold: 'Meet',
  subtitle: 'Там, Где Встречаются Ветра',
  tagline: 'Полная русскоязычная база знаний: гайды, секты, оружие, билды и всё для освоения мира Цзянху',
  logoUrl: DEFAULT_LOGO,
  bgImageUrl: DEFAULT_HERO_BG,
  discordTitle: 'Nocthra',
  discordSubtitle: 'Присоединиться в Discord',
  lolkaTitle: 'Lolka',
  lolkaSubtitle: 'Перейти на Lolka',
};

export const DEFAULT_BRANDING: SiteBranding = {
  headerTitle: 'WWM Вики Ру',
  headerSubtitle: 'Where Winds Meet',
};

export const DEFAULT_FOOTER: FooterSettings = {
  brandName: 'WWM Вики Ру',
  aboutText:
    'Русскоязычная база знаний по игре Where Winds Meet. Создана и поддерживается гильдией Nocthra.',
  legalText:
    'Where Winds Meet © Everstone Studio / NetEase Games. Все права на игру принадлежат правообладателям.',
  copyright: '© 2025 WWM Вики Ру — Русская База Знаний гильдии Nocthra.',
  links: [
    { id: 'f1', label: 'Официальный сайт Where Winds Meet', url: 'https://www.wherewindsmeetgame.com/' },
    { id: 'f2', label: 'Официальный Discord Where Winds Meet', url: 'https://discord.gg/wherewindsmeet' },
    { id: 'f3', label: 'Официальный TikTok Where Winds Meet', url: 'https://www.tiktok.com/@wherewindsmeet_?_r=1&_t=ZS-96iVGxJ86Wj' },
  ],
};

export const DEFAULT_HOME_BLOCKS: HomeBlockConfig[] = [
  { id: 'announcements', visible: true },
  { id: 'hero', visible: true },
  { id: 'news', visible: true },
  { id: 'donation', visible: true },
];

export const HOME_BLOCK_META: Record<HomeBlockId, { label: string; description: string }> = {
  announcements: { label: 'Объявления', description: 'Бегущая строка вверху главной' },
  hero: { label: 'Герой + гильдия', description: 'Заголовок, баннер гильдии, ссылки Discord/Lolka' },
  news: { label: 'Новости', description: 'Блок новостей гильдии' },
  donation: { label: 'Пожертвования', description: 'Блок поддержки проекта' },
};

export function mergeHeroSettings(hero?: Partial<HeroSettings> | null): HeroSettings {
  return { ...DEFAULT_HERO, ...(hero && typeof hero === 'object' ? hero : {}) };
}

export function mergeBranding(branding?: Partial<SiteBranding> | null): SiteBranding {
  return { ...DEFAULT_BRANDING, ...(branding && typeof branding === 'object' ? branding : {}) };
}

export function mergeFooterSettings(
  footer?: Partial<FooterSettings> | null,
  discordUrl?: string,
  lolkaUrl?: string,
): FooterSettings {
  const base = { ...DEFAULT_FOOTER, ...(footer && typeof footer === 'object' ? footer : {}) };
  const links = Array.isArray(base.links) && base.links.length > 0 ? base.links : DEFAULT_FOOTER.links;
  const withGuildLinks = links.map(l => {
    if (l.id === 'guild-discord') return { ...l, url: discordUrl || l.url };
    if (l.id === 'guild-lolka') return { ...l, url: lolkaUrl || l.url };
    return l;
  });
  const hasDiscord = withGuildLinks.some(l => l.id === 'guild-discord');
  const hasLolka = withGuildLinks.some(l => l.id === 'guild-lolka');
  const guildLinks = [
    ...(!hasDiscord && discordUrl ? [{ id: 'guild-discord', label: 'Discord гильдии Nocthra', url: discordUrl }] : []),
    ...(!hasLolka && lolkaUrl ? [{ id: 'guild-lolka', label: 'Lolka гильдии Nocthra', url: lolkaUrl }] : []),
  ];
  return {
    ...base,
    links: [...withGuildLinks, ...guildLinks.filter(gl => !withGuildLinks.some(l => l.id === gl.id))],
  };
}

export function mergeHomeBlocks(blocks?: HomeBlockConfig[] | null): HomeBlockConfig[] {
  const incoming = Array.isArray(blocks) ? blocks : [];
  const byId = new Map<HomeBlockId, HomeBlockConfig>();
  for (const def of DEFAULT_HOME_BLOCKS) byId.set(def.id, { ...def });
  for (const b of incoming) {
    if (b?.id && byId.has(b.id)) byId.set(b.id, { id: b.id, visible: b.visible !== false });
  }
  const ordered: HomeBlockConfig[] = [];
  for (const b of incoming) {
    if (b?.id && byId.has(b.id) && !ordered.some(o => o.id === b.id)) {
      ordered.push(byId.get(b.id)!);
      byId.delete(b.id);
    }
  }
  for (const rest of byId.values()) ordered.push(rest);
  return ordered;
}

export function isHomeBlockVisible(blocks: HomeBlockConfig[], id: HomeBlockId): boolean {
  return mergeHomeBlocks(blocks).find(b => b.id === id)?.visible !== false;
}

export function applySiteTheme(hero: HeroSettings) {
  const bg = hero.bgImageUrl?.trim() || DEFAULT_HERO_BG;
  document.documentElement.style.setProperty('--hero-bg-image', `url("${bg}")`);
}

export function getResolvedLolkaUrl(settings: SiteSettings): string {
  return settings.lolkaUrl?.trim() || 'https://lolka.su/';
}
