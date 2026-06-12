import { sectionEditorConfigs } from './sectionEditorConfig';

export interface SectionCategoryDef {
  id: string;
  label: string;
  icon?: string;
  badgeClass?: string;
}

/** Категории по умолчанию для разделов вики (можно расширять в админке) */
export const DEFAULT_SECTION_CATEGORIES: Record<string, SectionCategoryDef[]> = {
  innerpath: [
    { id: 'Bellstrike - Splendor', label: 'Удар колокола - Великолепие', icon: '🔔', badgeClass: 'text-amber-300 bg-amber-500/10 border-amber-500/30' },
    { id: 'Bellstrike - Umbra', label: 'Удар колокола - Умбра', icon: '🌑', badgeClass: 'text-violet-300 bg-violet-500/10 border-violet-500/30' },
    { id: 'Stonesplit - Might', label: 'Рассечение камня - Мощь', icon: '⛰️', badgeClass: 'text-stone-300 bg-stone-500/10 border-stone-500/30' },
    { id: 'Stonesplit - Strength', label: 'Рассечение камня - Сила', icon: '💪', badgeClass: 'text-stone-300 bg-stone-500/10 border-stone-500/30' },
    { id: 'Silkbind - Jade', label: 'Шелковое связывание - Нефрит', icon: '💎', badgeClass: 'text-jade-300 bg-jade-500/10 border-jade-500/30' },
    { id: 'Silkbind - Deluge', label: 'Шелковое связывание - Потоп', icon: '💧', badgeClass: 'text-blue-300 bg-blue-500/10 border-blue-500/30' },
    { id: 'Bamboocut - Wind', label: 'Рассечение бамбука - Ветер', icon: '🌬️', badgeClass: 'text-teal-300 bg-teal-500/10 border-teal-500/30' },
    { id: 'Bamboocut - Dust', label: 'Рассечение бамбука - Пыль', icon: '🎋', badgeClass: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30' },
  ],
  weapons: [
    { id: 'Меч', label: 'Меч', icon: '⚔️' },
    { id: 'Копьё', label: 'Копьё', icon: '🔱' },
    { id: 'Парные Клинки', label: 'Парные Клинки', icon: '🔪' },
    { id: 'Мо-клинок', label: 'Мо-клинок', icon: '🔨' },
    { id: 'Верёвочный Дротик', label: 'Верёвочный Дротик', icon: '🪢' },
    { id: 'Веер', label: 'Веер', icon: '🪭' },
    { id: 'Зонт', label: 'Зонт', icon: '☂️' },
    { id: 'Хангблэйд', label: 'Хангблэйд', icon: '⚔️' },
    { id: 'Лук', label: 'Лук', icon: '🏹' },
    { id: 'Прочее', label: 'Прочее', icon: '✦' },
  ],
  bosses: [
    { id: 'campaign', label: 'Сюжетные', icon: '📖' },
    { id: 'world', label: 'Мировые', icon: '🌍' },
    { id: 'Мировой', label: 'Мировой', icon: '🌍' },
    { id: 'Подземелье', label: 'Подземелье', icon: '🏰' },
    { id: 'Рейд', label: 'Рейд', icon: '👥' },
    { id: 'Механика', label: 'Механика', icon: '⚙️' },
    { id: 'Прочее', label: 'Прочее', icon: '✦' },
  ],
  cooking: [
    { id: 'healing', label: 'Исцеление', icon: '❤️' },
    { id: 'buff', label: 'Баффы', icon: '⚡' },
    { id: 'Рецепт', label: 'Рецепт', icon: '🍳' },
    { id: 'Ингредиент', label: 'Ингредиент', icon: '🌿' },
    { id: 'Бафф', label: 'Бафф', icon: '⚡' },
    { id: 'Прочее', label: 'Прочее', icon: '✦' },
  ],
  tips: [
    { id: 'beginner', label: 'Новичкам', icon: '🌱' },
    { id: 'combat', label: 'Бой', icon: '⚔️' },
    { id: 'economy', label: 'Экономика', icon: '💎' },
    { id: 'secrets', label: 'Секреты', icon: '🔮' },
    { id: 'Совет', label: 'Совет', icon: '💡' },
    { id: 'Код', label: 'Код', icon: '🎁' },
    { id: 'Фарм', label: 'Фарм', icon: '💰' },
    { id: 'Лайфхак', label: 'Лайфхак', icon: '⚡' },
    { id: 'Прочее', label: 'Прочее', icon: '✦' },
  ],
  mystic: [
    { id: 'Молния', label: 'Молния', icon: '⚡' },
    { id: 'Земля', label: 'Земля', icon: '🛡️' },
    { id: 'Огонь', label: 'Огонь', icon: '🔥' },
    { id: 'Тьма', label: 'Тьма', icon: '🌑' },
    { id: 'Ветер', label: 'Ветер', icon: '🌀' },
    { id: 'Вода', label: 'Вода', icon: '💧' },
    { id: 'Атака', label: 'Атака', icon: '⚔️' },
    { id: 'Защита', label: 'Защита', icon: '🛡️' },
    { id: 'Контроль', label: 'Контроль', icon: '🎯' },
    { id: 'Поддержка', label: 'Поддержка', icon: '💫' },
    { id: 'Прочее', label: 'Прочее', icon: '✦' },
  ],
  sects: fromConfig('sects'),
  lifeskills: fromConfig('lifeskills'),
  builds: fromConfig('builds'),
  npcs: fromConfig('npcs'),
  riddles: fromConfig('riddles'),
  guides: fromConfig('guides'),
};

function fromConfig(key: string): SectionCategoryDef[] {
  const cats = sectionEditorConfigs[key]?.categories ?? [];
  return cats.map(c => ({ id: c, label: c }));
}

export function slugCategoryId(label: string): string {
  const base = label
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u0400-\u04FF-]/g, '')
    .slice(0, 48);
  return base || `cat-${Date.now()}`;
}

export function getDefaultSectionCategories(sectionKey: string): SectionCategoryDef[] {
  return DEFAULT_SECTION_CATEGORIES[sectionKey] ?? fromConfig(sectionKey);
}
