import raw from './innerWays.json';
import type { SectionCategoryDef } from './sectionCategories';
import { getDefaultSectionCategories } from './sectionCategories';

export interface InnerWay {
  id: string;
  nameEn: string;
  nameRu?: string;
  pathEn: string;
  effect: string;
  effectRu?: string;
  howToGet: string;
  howToGetRu?: string;
}

export interface InnerWayInfoBlock {
  title: string;
  body: string;
}

export interface InnerWaysData {
  sourceUrl: string;
  intro: string;
  introRu?: string;
  upgradeSteps: InnerWayInfoBlock[];
  upgradeStepsRu?: InnerWayInfoBlock[];
  explained: InnerWayInfoBlock[];
  explainedRu?: InnerWayInfoBlock[];
  innerWays: InnerWay[];
}

export const innerWaysData = raw as InnerWaysData;
export const innerWays = innerWaysData.innerWays;

export type InnerPathId = string;

export interface InnerPathMeta {
  id: InnerPathId;
  labelRu: string;
  shortRu: string;
  icon: string;
  badgeClass: string;
}

const FALLBACK_BADGE = 'text-ink-300 bg-ink-700/50 border-ink-600/40';

/** Пути внутренних искусств (синергия с боевыми стилями) */
export const innerPathMeta: Record<string, InnerPathMeta> = {
  'Bellstrike - Splendor': {
    id: 'Bellstrike - Splendor',
    labelRu: 'Удар колокола - Великолепие',
    shortRu: 'Удар колокола - Великолепие',
    icon: '🔔',
    badgeClass: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
  },
  'Bellstrike - Umbra': {
    id: 'Bellstrike - Umbra',
    labelRu: 'Удар колокола - Умбра',
    shortRu: 'Удар колокола - Умбра',
    icon: '🌑',
    badgeClass: 'text-violet-300 bg-violet-500/10 border-violet-500/30',
  },
  'Stonesplit - Might': {
    id: 'Stonesplit - Might',
    labelRu: 'Рассечение камня - Мощь',
    shortRu: 'Рассечение камня - Мощь',
    icon: '⛰️',
    badgeClass: 'text-stone-300 bg-stone-500/10 border-stone-500/30',
  },
  'Stonesplit - Strength': {
    id: 'Stonesplit - Strength',
    labelRu: 'Рассечение камня - Сила',
    shortRu: 'Рассечение камня - Сила',
    icon: '💪',
    badgeClass: 'text-stone-300 bg-stone-500/10 border-stone-500/30',
  },
  'Silkbind - Jade': {
    id: 'Silkbind - Jade',
    labelRu: 'Шелковое связывание - Нефрит',
    shortRu: 'Шелковое связывание - Нефрит',
    icon: '💎',
    badgeClass: 'text-jade-300 bg-jade-500/10 border-jade-500/30',
  },
  'Silkbind - Deluge': {
    id: 'Silkbind - Deluge',
    labelRu: 'Шелковое связывание - Потоп',
    shortRu: 'Шелковое связывание - Потоп',
    icon: '💧',
    badgeClass: 'text-blue-300 bg-blue-500/10 border-blue-500/30',
  },
  'Bamboocut - Wind': {
    id: 'Bamboocut - Wind',
    labelRu: 'Рассечение бамбука - Ветер',
    shortRu: 'Рассечение бамбука - Ветер',
    icon: '🌬️',
    badgeClass: 'text-teal-300 bg-teal-500/10 border-teal-500/30',
  },
  'Bamboocut - Dust': {
    id: 'Bamboocut - Dust',
    labelRu: 'Рассечение бамбука - Пыль',
    shortRu: 'Рассечение бамбука - Пыль',
    icon: '🎋',
    badgeClass: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
  },
  General: {
    id: 'General',
    labelRu: 'Общий путь',
    shortRu: 'Общий путь',
    icon: '☯️',
    badgeClass: 'text-gold-300 bg-gold-500/10 border-gold-500/30',
  },
};

export const innerPathOrder = [
  'Bellstrike - Splendor',
  'Bellstrike - Umbra',
  'Stonesplit - Might',
  'Stonesplit - Strength',
  'Silkbind - Jade',
  'Silkbind - Deluge',
  'Bamboocut - Wind',
  'Bamboocut - Dust',
] as const;

export function getPathMeta(pathEn: string): InnerPathMeta {
  return innerPathMeta[pathEn] ?? {
    id: pathEn,
    labelRu: pathEn,
    shortRu: pathEn,
    icon: '✦',
    badgeClass: FALLBACK_BADGE,
  };
}

/** Мета категории с учётом пользовательских категорий из siteSettings */
export function resolvePathMeta(pathEn: string, categories?: SectionCategoryDef[]): InnerPathMeta {
  const custom = categories?.find(c => c.id === pathEn);
  const base = getPathMeta(pathEn);
  if (!custom) return base;
  return {
    id: pathEn,
    labelRu: custom.label,
    shortRu: custom.label,
    icon: custom.icon || base.icon,
    badgeClass: custom.badgeClass || base.badgeClass,
  };
}

export function getInnerPathCategories(): SectionCategoryDef[] {
  return getDefaultSectionCategories('innerpath');
}

/** Русское описание раздела (по материалам Game8) */
export const innerPathIntroRu =
  innerWaysData.introRu ||
  'Внутренние пути (Inner Ways / Inner Arts) — пассивные навыки, дающие бонусы в Where Winds Meet. Их можно экипировать для постоянных усилений или срабатывания при определённых действиях в бою.';

export const innerPathExplainedRu: InnerWayInfoBlock[] =
  innerWaysData.explainedRu?.length
    ? [
        { title: 'Пассивные навыки с бонусами', body: innerWaysData.explainedRu[0]?.body || innerWaysData.explained[0]?.body || '' },
        { title: 'Синергия с боевым стилем', body: innerWaysData.explainedRu[1]?.body || innerWaysData.explained[1]?.body || '' },
      ]
    : [
        {
          title: 'Пассивные навыки с бонусами',
          body: 'Внутренние пути работают как пассивные умения: дают постоянные баффы или срабатывают при конкретных действиях в бою.',
        },
        {
          title: 'Синергия с боевым стилем',
          body: 'У каждого пути есть метка Path — он усиливает боевые искусства того же направления.',
        },
      ];

export const innerPathUpgradeRu: InnerWayInfoBlock[] =
  innerWaysData.upgradeStepsRu?.length
    ? [
        { title: 'Достигните 4 уровня в одиночном режиме', body: innerWaysData.upgradeStepsRu[0]?.body || innerWaysData.upgradeSteps[0]?.body || '' },
        { title: 'Используйте записки и предметы прокачки', body: innerWaysData.upgradeStepsRu[1]?.body || innerWaysData.upgradeSteps[1]?.body || '' },
      ]
    : [
        {
          title: 'Достигните 4 уровня в одиночном режиме',
          body: 'Прорыв внутренних путей (Breakthrough) открывается на 4 уровне Solo Mode. Прокачивайте одиночное сохранение и проходите испытания, чтобы повышать Roaming Level.',
        },
        {
          title: 'Используйте записки и предметы прокачки',
          body: 'Для повышения ранга нужны Notes или Inner Way Advance Items для конкретного пути. Например, легендарный Echoes of Oblivion требует Echoes of Oblivion: Notes.',
        },
      ];

export const innerPathUpgradeTipsRu = [
  {
    title: 'Обмен советов (Tips Exchange)',
    body: 'Неиспользуемые записки прокачки можно обменять на Vintage Bookplates, а затем — на сундуки с нужными Notes.',
  },
  {
    title: 'Конверсия путей (Inner Way Conversion)',
    body: 'Можно перенести все улучшения с одного внутреннего пути на другой при смене билда. Количество конверсий за сезон ограничено.',
  },
];
