export interface WikiSectionMeta {
  id: string;
  label: string;
  title: string;
  icon: string;
  description: string;
}

/** Разделы вики-хаба (включая гайды). Единый источник метаданных разделов. */
export const WIKI_HUB_SECTIONS: WikiSectionMeta[] = [
  { id: 'guides', label: 'Гайды', title: 'Гайды', icon: '📖', description: 'Пошаговые материалы и разборы' },
  { id: 'weapons', label: 'Оружие', title: 'Оружие', icon: '⚔️', description: 'Типы оружия, механики, советы' },
  { id: 'builds', label: 'Билды', title: 'Билды', icon: '🛤️', description: 'Сборки под PvE/PvP и роли' },
  { id: 'sects', label: 'Секты', title: 'Секты', icon: '🏛️', description: 'Школы, стили и особенности' },
  { id: 'bosses', label: 'Боссы', title: 'Боссы', icon: '👹', description: 'Тактики и ключевые механики' },
  { id: 'npcs', label: 'NPC', title: 'NPC', icon: '👥', description: 'НПС, дружба и диалоги' },
  { id: 'riddles', label: 'Загадки', title: 'Загадки', icon: '🧩', description: 'Подсказки и ответы' },
  { id: 'innerpath', label: 'Внутренний путь', title: 'Внутренний путь', icon: '☯️', description: 'Пассивки, эффекты и получение' },
  { id: 'mystic', label: 'Арты', title: 'Мистические Арты', icon: '✨', description: 'Мистические умения и синергии' },
  { id: 'cooking', label: 'Готовка', title: 'Готовка', icon: '🍳', description: 'Рецепты и бонусы' },
  { id: 'tips', label: 'Советы', title: 'Советы и Коды', icon: '💡', description: 'Полезные рекомендации по игре' },
  { id: 'lifeskills', label: 'Жизненные навыки', title: 'Жизненные Навыки', icon: '🎨', description: 'Ремёсла и прокачка навыков' },
];

export const CONTENT_SECTION_IDS = WIKI_HUB_SECTIONS
  .filter(section => section.id !== 'guides')
  .map(section => section.id);

const sectionById = new Map(WIKI_HUB_SECTIONS.map(section => [section.id, section]));

export function getSectionMeta(id: string): WikiSectionMeta | undefined {
  return sectionById.get(id);
}

export function getSectionLabel(id: string): string {
  return sectionById.get(id)?.label ?? id;
}

export function isContentSection(id: string): boolean {
  return CONTENT_SECTION_IDS.includes(id);
}

export const WIKI_SECTION_LABELS: Record<string, string> = Object.fromEntries(
  WIKI_HUB_SECTIONS.map(section => [section.id, section.label]),
);
