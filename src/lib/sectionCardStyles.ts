/** Общие стили тегов для карточек разделов. */

export const bossDiffColor: Record<string, string> = {
  'Лёгкая': 'text-jade-400 bg-jade-400/10',
  'Лёгкая-Средняя': 'text-jade-400 bg-jade-400/10',
  'Средняя': 'text-gold-400 bg-gold-400/10',
  'Средняя-Высокая': 'text-orange-400 bg-orange-400/10',
  'Высокая': 'text-crimson-400 bg-crimson-400/10',
  'Очень высокая': 'text-purple-400 bg-purple-400/10',
};

export const buildDiffColor: Record<string, string> = {
  'Низкая': 'text-jade-400 bg-jade-400/10',
  'Средняя': 'text-gold-400 bg-gold-400/10',
  'Высокая': 'text-crimson-400 bg-crimson-400/10',
};

export const mysticElementColors: Record<string, string> = {
  'Молния': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  'Земля': 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  'Огонь': 'text-orange-400 bg-orange-400/10 border-orange-400/30',
  'Тьма': 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  'Ветер': 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
  'Вода': 'text-blue-400 bg-blue-400/10 border-blue-400/30',
};

export const mysticTypeLabels: Record<string, string> = {
  attack: 'Атака',
  defense: 'Защита',
  support: 'Поддержка',
  movement: 'Движение',
  'Атака': 'Атака',
  'Защита': 'Защита',
  'Поддержка': 'Поддержка',
  'Движение': 'Движение',
  'Контроль': 'Контроль',
};
