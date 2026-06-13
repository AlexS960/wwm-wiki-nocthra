/** Конвертация статического контента и overrides → WikiArticle для Supabase. */

import { weapons, buildPaths, sects, lifeSkills, type Weapon, type BuildPath, type Sect } from '../data/gameData';
import { bosses, recipes, type Boss, type Recipe } from '../data/extendedData';
import { innerWays, resolvePathMeta } from '../data/innerWays';
import { getDefaultSectionCategories } from '../data/sectionCategories';
import type { WikiArticle } from '../types/site';
import { buildSectionContent } from './sectionContent';
import { normalizeWikiArticle } from './wikiNormalize';

const SEED_AUTHOR = 'Nocthra Wiki';

export interface MysticArtSeed {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  element: string;
  type: 'attack' | 'defense' | 'support' | 'movement';
  description: string;
  effect: string;
  cooldown: string;
  howToGet: string;
}

export const mysticArtSeeds: MysticArtSeed[] = [
  { id: 'ma-1', name: 'Небесный Гром', nameEn: 'Heavenly Thunder', icon: '⚡', element: 'Молния', type: 'attack', description: 'Призывает молнию с небес, поражающую всех врагов в радиусе.', effect: 'Урон 500% от силы атаки', cooldown: '60 сек', howToGet: 'Квест "Грозовое Небо"' },
  { id: 'ma-2', name: 'Щит Дракона', nameEn: 'Dragon Shield', icon: '🛡️', element: 'Земля', type: 'defense', description: 'Создаёт непробиваемый щит, поглощающий урон.', effect: 'Поглощает 3000 урона', cooldown: '90 сек', howToGet: 'Секта Нефритового Лотоса — ранг 3' },
  { id: 'ma-3', name: 'Дыхание Феникса', nameEn: 'Phoenix Breath', icon: '🔥', element: 'Огонь', type: 'support', description: 'Исцеляет союзников пламенем феникса.', effect: 'Восстанавливает 40% HP группы', cooldown: '120 сек', howToGet: 'Мировой босс "Феникс"' },
  { id: 'ma-4', name: 'Теневой Прыжок', nameEn: 'Shadow Leap', icon: '🌑', element: 'Тьма', type: 'movement', description: 'Мгновенное перемещение в указанную точку.', effect: 'Телепортация на 20 метров', cooldown: '15 сек', howToGet: 'Павильон Теней — начальный навык' },
  { id: 'ma-5', name: 'Вихрь Ветра', nameEn: 'Wind Vortex', icon: '🌀', element: 'Ветер', type: 'attack', description: 'Создаёт вихрь, затягивающий и повреждающий врагов.', effect: 'Урон 300% + контроль', cooldown: '45 сек', howToGet: 'Храм Ветров — сундук босса' },
  { id: 'ma-6', name: 'Благословение Лотоса', nameEn: 'Lotus Blessing', icon: '🪷', element: 'Вода', type: 'support', description: 'Накладывает регенерацию и увеличивает защиту.', effect: '+30% защиты, реген 5% HP/сек', cooldown: '75 сек', howToGet: 'Квест "Цветок Лотоса"' },
];

export interface TipSeed {
  id: string;
  category: string;
  text: string;
}

export const tipSeeds: TipSeed[] = [
  { id: 't-1', category: 'beginner', text: 'Всегда собирайте всё на своём пути. Даже обычные травы могут пригодиться в готовке.' },
  { id: 't-2', category: 'beginner', text: 'Не тратьте ресурсы на улучшение низкоуровневого оружия. Сохраните их для легендарных предметов.' },
  { id: 't-3', category: 'beginner', text: 'Вступайте в гильдию как можно раньше — бонусы к опыту и доступ к гильдейским квестам.' },
  { id: 't-4', category: 'combat', text: 'Уклонение даёт i-frames (неуязвимость). Используйте это для избежания смертельных атак.' },
  { id: 't-5', category: 'combat', text: 'Комбо-система: 3 лёгкие атаки + 1 тяжёлая = мощный финишер с доп. уроном.' },
  { id: 't-6', category: 'combat', text: 'Каждый босс имеет "окно уязвимости" после определённых атак. Изучайте паттерны.' },
  { id: 't-7', category: 'economy', text: 'Рыбалка — один из самых прибыльных способов заработка на ранних этапах.' },
  { id: 't-8', category: 'economy', text: 'Не продавайте редкие материалы. Они понадобятся для крафта эндгейм-экипировки.' },
  { id: 't-9', category: 'secrets', text: 'В игре есть скрытые пещеры за водопадами. Ищите их — там часто сундуки с ценными наградами.' },
  { id: 't-10', category: 'secrets', text: 'Некоторые NPC дают секретные квесты, если поговорить с ними в определённое время суток.' },
];

const MYSTIC_TYPE_RU: Record<string, string> = {
  attack: 'Атака',
  defense: 'Защита',
  support: 'Поддержка',
  movement: 'Движение',
};

function baseArticle(
  partial: Omit<WikiArticle, 'authorName' | 'updatedAt'>,
  source: 'seed' | 'override' = 'seed',
): WikiArticle {
  return {
    ...partial,
    authorName: SEED_AUTHOR,
    updatedAt: new Date().toISOString(),
    fields: { ...partial.fields, source },
  };
}

export function weaponToWiki(w: Weapon, source: 'seed' | 'override' = 'seed'): WikiArticle {
  return baseArticle({
    id: w.id,
    section: 'weapons',
    title: w.name,
    icon: w.icon,
    content: buildSectionContent([
      { header: '## Получение', body: w.howToGet },
      { header: '## Секта', body: w.sect },
      { header: '## Пара', body: w.pair },
    ]),
    fields: {
      nameEn: w.nameEn,
      role: w.role,
      martialArt: w.martialArt,
      summary: w.description,
      category: w.type,
    },
    images: [],
  }, source);
}

export function buildToWiki(b: BuildPath, source: 'seed' | 'override' = 'seed'): WikiArticle {
  return baseArticle({
    id: b.id,
    section: 'builds',
    title: b.name,
    icon: b.icon,
    content: buildSectionContent([
      { header: '## Оружие', body: b.weapons },
      { header: '## Сильные стороны', body: b.strengths },
      { header: '## Слабые стороны', body: b.weaknesses },
    ]),
    fields: {
      nameEn: b.nameEn,
      difficulty: b.difficulty,
      summary: b.description,
      category: b.role,
    },
    images: [],
  }, source);
}

export function sectToWiki(s: Sect, source: 'seed' | 'override' = 'seed'): WikiArticle {
  return baseArticle({
    id: s.id,
    section: 'sects',
    title: s.name,
    icon: s.icon,
    content: buildSectionContent([
      { header: '## Как вступить', body: s.howToJoin },
      { header: '## Преимущества', body: s.benefits },
      { header: '## Правила', body: s.rules },
    ]),
    fields: {
      nameEn: s.nameEn,
      theme: s.theme,
      weapon: s.weapon,
      summary: s.description,
      category: 'Секта',
    },
    images: [],
  }, source);
}

export function bossToWiki(b: Boss, source: 'seed' | 'override' = 'seed'): WikiArticle {
  return baseArticle({
    id: b.id,
    section: 'bosses',
    title: b.name,
    icon: b.icon,
    content: buildSectionContent([
      { header: '## Сложность', body: b.difficulty },
      { header: '## Уровень', body: b.level },
      { header: '## Регион', body: b.region },
      { header: '## Локация', body: b.location },
      { header: '## Стратегия', body: b.strategy },
      { header: '## Награды', body: b.rewards },
      { header: '## Советы', body: b.tips },
    ]),
    fields: {
      nameEn: b.nameEn,
      summary: `${b.region} — ${b.location}`,
      category: b.type,
    },
    images: [],
  }, source);
}

export function recipeToWiki(r: Recipe, source: 'seed' | 'override' = 'seed'): WikiArticle {
  return baseArticle({
    id: r.id,
    section: 'cooking',
    title: r.name,
    icon: r.icon,
    content: buildSectionContent([
      { header: '## Уровень', body: String(r.level) },
      { header: '## Выносливость', body: r.stamina },
      { header: '## Ингредиенты', body: r.ingredients },
      { header: '## Разблокировка', body: r.howToUnlock },
    ]),
    fields: {
      nameEn: r.nameEn,
      summary: r.effect,
      category: r.category,
    },
    images: [],
  }, source);
}

export function mysticToWiki(m: MysticArtSeed, source: 'seed' | 'override' = 'seed'): WikiArticle {
  return baseArticle({
    id: m.id,
    section: 'mystic',
    title: m.name,
    icon: m.icon,
    content: buildSectionContent([
      { header: '## Эффект', body: m.effect },
      { header: '## Перезарядка', body: m.cooldown },
      { header: '## Как получить', body: m.howToGet },
    ]),
    fields: {
      nameEn: m.nameEn,
      summary: m.description,
      category: m.element,
      mysticType: MYSTIC_TYPE_RU[m.type] || m.type,
    },
    images: [],
  }, source);
}

export function tipToWiki(t: TipSeed, source: 'seed' | 'override' = 'seed'): WikiArticle {
  return baseArticle({
    id: t.id,
    section: 'tips',
    title: t.text.slice(0, 60) + (t.text.length > 60 ? '…' : ''),
    icon: '💡',
    content: t.text,
    fields: {
      summary: t.text,
      category: t.category,
    },
    images: [],
  }, source);
}

export function lifeSkillToWiki(
  ls: { name: string; description: string; icon: string },
  index: number,
  source: 'seed' | 'override' = 'seed',
): WikiArticle {
  const id = `ls-${index}-${ls.name.toLowerCase().replace(/\s+/g, '-').slice(0, 24)}`;
  return baseArticle({
    id,
    section: 'lifeskills',
    title: ls.name,
    icon: ls.icon,
    content: ls.description,
    fields: {
      summary: ls.description,
      category: 'Навык',
    },
    images: [],
  }, source);
}

export function innerWayToWiki(
  w: (typeof innerWays)[0],
  source: 'seed' | 'override' = 'seed',
): WikiArticle {
  const pathMeta = resolvePathMeta(w.pathEn, getDefaultSectionCategories('innerpath'));
  return baseArticle({
    id: w.id,
    section: 'innerpath',
    title: w.nameRu || w.nameEn,
    icon: pathMeta.icon,
    content: buildSectionContent([
      { header: '## Эффект', body: w.effectRu || w.effect },
      { header: '## Как получить', body: w.howToGetRu || w.howToGet },
    ]),
    fields: {
      nameEn: w.nameEn,
      summary: w.effectRu || w.effect,
      category: w.pathEn,
    },
    images: [],
  }, source);
}

export function getAllSeedArticles(): WikiArticle[] {
  return [
    ...weapons.map(w => weaponToWiki(w)),
    ...buildPaths.map(b => buildToWiki(b)),
    ...sects.map(s => sectToWiki(s)),
    ...bosses.map(b => bossToWiki(b)),
    ...recipes.map(r => recipeToWiki(r)),
    ...mysticArtSeeds.map(m => mysticToWiki(m)),
    ...tipSeeds.map(t => tipToWiki(t)),
    ...lifeSkills.map((ls, i) => lifeSkillToWiki(ls, i)),
    ...innerWays.map(w => innerWayToWiki(w)),
  ];
}

/** Дополняет загруженные статьи дефолтным контентом (без перезаписи существующих). */
export function mergeWikiWithSeeds(existing: WikiArticle[]): WikiArticle[] {
  const byId = new Map(existing.map(a => [a.id, a]));
  for (const seed of getAllSeedArticles()) {
    if (!byId.has(seed.id)) byId.set(seed.id, seed);
  }
  return [...byId.values()];
}

/** Собирает полный каталог для отображения: сиды → БД → overrides. */
export function buildWikiCatalog(
  existing: WikiArticle[],
  sectionOverrides?: Record<string, unknown>,
): WikiArticle[] {
  const byId = new Map<string, WikiArticle>();
  for (const seed of getAllSeedArticles()) byId.set(seed.id, seed);
  for (const article of existing) byId.set(article.id, article);
  if (sectionOverrides) {
    for (const [sectionKey, raw] of Object.entries(sectionOverrides)) {
      if (!Array.isArray(raw) || raw.length === 0) continue;
      for (const article of convertOverrideSection(sectionKey, raw)) {
        byId.set(article.id, article);
      }
    }
  }
  return [...byId.values()].map(normalizeWikiArticle);
}

const OVERRIDE_CONVERTERS: Record<string, (item: unknown, index?: number) => WikiArticle | null> = {
  weapons: item => weaponToWiki(item as Weapon, 'override'),
  builds: item => buildToWiki(item as BuildPath, 'override'),
  sects: item => sectToWiki(item as Sect, 'override'),
  bosses: item => bossToWiki(item as Boss, 'override'),
  cooking: item => recipeToWiki(item as Recipe, 'override'),
  mystic: item => mysticToWiki(item as MysticArtSeed, 'override'),
  tips: item => tipToWiki(item as TipSeed, 'override'),
  lifeskills: (item, index = 0) => {
    const ls = item as { name: string; description: string; icon: string; id?: string };
    const article = lifeSkillToWiki(ls, index, 'override');
    if (ls.id) article.id = ls.id;
    return article;
  },
  innerpath: item => innerWayToWiki(item as (typeof innerWays)[0], 'override'),
};

export function convertOverrideItem(sectionKey: string, item: unknown, index = 0): WikiArticle | null {
  const fn = OVERRIDE_CONVERTERS[sectionKey];
  if (!fn) return null;
  return fn(item, index);
}

export function convertOverrideSection(sectionKey: string, items: unknown[]): WikiArticle[] {
  return items
    .map((item, i) => convertOverrideItem(sectionKey, item, i))
    .filter((a): a is WikiArticle => a !== null);
}
