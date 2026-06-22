/** Русские сиды вики для npm run wiki:push-db (не в клиентском бандле). */

import { weapons, buildPaths, sects, lifeSkills, type Weapon, type BuildPath, type Sect } from './data/gameSeeds.ts';
import { bosses, recipes, type Boss, type Recipe } from './data/extendedData.ts';
import type { WikiArticle } from '../src/types/site';
import { buildSectionContent } from '../src/lib/sectionContent';
import { martialArtRu } from '../src/lib/martialArtRu';
import { articleForDbStorage } from '../src/lib/wikiDbSync';

const SEED_AUTHOR = 'Nocthra Wiki';

interface MysticArtSeed {
  id: string;
  name: string;
  icon: string;
  element: string;
  type: 'attack' | 'defense' | 'support' | 'movement';
  description: string;
  effect: string;
  cooldown: string;
  howToGet: string;
}

const mysticArtSeeds: MysticArtSeed[] = [
  { id: 'ma-1', name: 'Небесный Гром', icon: '⚡', element: 'Молния', type: 'attack', description: 'Призывает молнию с небес, поражающую всех врагов в радиусе.', effect: 'Урон 500% от силы атаки', cooldown: '60 сек', howToGet: 'Квест "Грозовое Небо"' },
  { id: 'ma-2', name: 'Щит Дракона', icon: '🛡️', element: 'Земля', type: 'defense', description: 'Создаёт непробиваемый щит, поглощающий урон.', effect: 'Поглощает 3000 урона', cooldown: '90 сек', howToGet: 'Секта Нефритового Лотоса — ранг 3' },
  { id: 'ma-3', name: 'Дыхание Феникса', icon: '🔥', element: 'Огонь', type: 'support', description: 'Исцеляет союзников пламенем феникса.', effect: 'Восстанавливает 40% HP группы', cooldown: '120 сек', howToGet: 'Мировой босс "Феникс"' },
  { id: 'ma-4', name: 'Теневой Прыжок', icon: '🌑', element: 'Тьма', type: 'movement', description: 'Мгновенное перемещение в указанную точку.', effect: 'Телепортация на 20 метров', cooldown: '15 сек', howToGet: 'Павильон Теней — начальный навык' },
  { id: 'ma-5', name: 'Вихрь Ветра', icon: '🌀', element: 'Ветер', type: 'attack', description: 'Создаёт вихрь, затягивающий и повреждающий врагов.', effect: 'Урон 300% + контроль', cooldown: '45 сек', howToGet: 'Храм Ветров — сундук босса' },
  { id: 'ma-6', name: 'Благословение Лотоса', icon: '🪷', element: 'Вода', type: 'support', description: 'Накладывает регенерацию и увеличивает защиту.', effect: '+30% защиты, реген 5% HP/сек', cooldown: '75 сек', howToGet: 'Квест "Цветок Лотоса"' },
];

interface TipSeed {
  id: string;
  category: string;
  text: string;
}

const tipSeeds: TipSeed[] = [
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
  source: 'seed' | 'custom' = 'seed',
): WikiArticle {
  return {
    ...partial,
    authorName: SEED_AUTHOR,
    updatedAt: new Date().toISOString(),
    fields: { ...partial.fields, source },
  };
}

function weaponToWiki(w: Weapon): WikiArticle {
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
      role: w.role,
      martialArt: martialArtRu(w.martialArt),
      summary: w.description,
      category: w.type,
      nameEn: w.nameEn,
    },
    images: [],
  });
}

function buildToWiki(b: BuildPath): WikiArticle {
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
      difficulty: b.difficulty,
      summary: b.description,
      category: b.role,
    },
    images: [],
  });
}

function sectToWiki(s: Sect): WikiArticle {
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
      theme: s.theme,
      weapon: s.weapon,
      summary: s.description,
      category: 'Секта',
    },
    images: [],
  });
}

function bossToWiki(b: Boss): WikiArticle {
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
      summary: `${b.region} — ${b.location}`,
      category: b.type,
    },
    images: [],
  });
}

function recipeToWiki(r: Recipe): WikiArticle {
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
      summary: r.effect,
      category: r.category,
    },
    images: [],
  });
}

function mysticToWiki(m: MysticArtSeed): WikiArticle {
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
      summary: m.description,
      category: m.element,
      mysticType: MYSTIC_TYPE_RU[m.type] || m.type,
    },
    images: [],
  });
}

function tipToWiki(t: TipSeed): WikiArticle {
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
  });
}

function lifeSkillToWiki(
  ls: { name: string; description: string; icon: string },
  index: number,
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
  });
}

export function getAllSeedArticles(): WikiArticle[] {
  const raw = [
    ...weapons.map(w => weaponToWiki(w)),
    ...buildPaths.map(b => buildToWiki(b)),
    ...sects.map(s => sectToWiki(s)),
    ...bosses.map(b => bossToWiki(b)),
    ...recipes.map(r => recipeToWiki(r)),
    ...mysticArtSeeds.map(m => mysticToWiki(m)),
    ...tipSeeds.map(t => tipToWiki(t)),
    ...lifeSkills.map((ls, i) => lifeSkillToWiki(ls, i)),
  ];
  return raw.map(articleForDbStorage);
}
