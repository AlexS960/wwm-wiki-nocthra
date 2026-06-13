/** Схемы структурированных полей для кастомных карточек (как у дефолтных). */

export type StructuredFieldKind = 'text' | 'textarea' | 'list';

export interface StructuredField {
  id: string;
  label: string;
  kind: StructuredFieldKind;
  header: string;
  placeholder?: string;
  /** Хранить в article.fields вместо content */
  inFields?: boolean;
}

export interface SectionSchema {
  showNameEn?: boolean;
  /** Дополнительные поля в article.fields (теги на карточке) */
  tagFields?: { id: string; label: string; placeholder?: string }[];
  contentFields: StructuredField[];
  defaultContentTemplate: string;
}

export const sectionSchemas: Record<string, SectionSchema> = {
  weapons: {
    showNameEn: true,
    tagFields: [
      { id: 'role', label: 'Роль', placeholder: 'Ближний ДПС' },
      { id: 'martialArt', label: 'Искусство', placeholder: 'Bellstrike — Splendor' },
    ],
    contentFields: [
      { id: 'howToGet', label: 'Получение', kind: 'textarea', header: '## Получение', placeholder: 'Как получить оружие…' },
      { id: 'sect', label: 'Секта', kind: 'text', header: '## Секта', placeholder: 'Секта или «Нет»' },
      { id: 'pair', label: 'Пара', kind: 'text', header: '## Пара', placeholder: 'Парное оружие…' },
    ],
    defaultContentTemplate: '## Получение\n\n\n## Секта\n\n\n## Пара\n\n',
  },
  builds: {
    showNameEn: true,
    tagFields: [
      { id: 'difficulty', label: 'Сложность', placeholder: 'Низкая / Средняя / Высокая' },
    ],
    contentFields: [
      { id: 'weapons', label: 'Оружие', kind: 'list', header: '## Оружие', placeholder: 'Одна строка — одно оружие. Ссылка: [Название](/weapons#wiki-card-id)' },
      { id: 'strengths', label: 'Сильные стороны', kind: 'list', header: '## Сильные стороны', placeholder: 'Одна строка — один пункт' },
      { id: 'weaknesses', label: 'Слабые стороны', kind: 'list', header: '## Слабые стороны', placeholder: 'Одна строка — один пункт' },
    ],
    defaultContentTemplate: '## Оружие\n\n- \n\n## Сильные стороны\n\n- \n\n## Слабые стороны\n\n- \n',
  },
  sects: {
    showNameEn: true,
    tagFields: [
      { id: 'theme', label: 'Тема', placeholder: 'Философия секты' },
      { id: 'weapon', label: 'Оружие', placeholder: 'Фирменное оружие' },
    ],
    contentFields: [
      { id: 'howToJoin', label: 'Как вступить', kind: 'textarea', header: '## Как вступить', placeholder: '…' },
      { id: 'benefits', label: 'Преимущества', kind: 'list', header: '## Преимущества', placeholder: 'Одна строка — один пункт' },
      { id: 'rules', label: 'Правила', kind: 'list', header: '## Правила', placeholder: 'Одна строка — один пункт' },
    ],
    defaultContentTemplate: '## Как вступить\n\n\n## Преимущества\n\n- \n\n## Правила\n\n- \n',
  },
  bosses: {
    showNameEn: true,
    contentFields: [
      { id: 'difficulty', label: 'Сложность', kind: 'text', header: '## Сложность', placeholder: 'Лёгкая / Средняя / Высокая…' },
      { id: 'level', label: 'Уровень', kind: 'text', header: '## Уровень', placeholder: '50 или 10-15' },
      { id: 'region', label: 'Регион', kind: 'text', header: '## Регион', placeholder: 'Кайфэн' },
      { id: 'location', label: 'Локация', kind: 'text', header: '## Локация', placeholder: 'Хребет Отчаяния' },
      { id: 'strategy', label: 'Стратегия', kind: 'list', header: '## Стратегия', placeholder: 'Одна строка — один пункт' },
      { id: 'rewards', label: 'Награды', kind: 'list', header: '## Награды', placeholder: 'Одна строка — одна награда' },
      { id: 'tips', label: 'Советы', kind: 'list', header: '## Советы', placeholder: 'Одна строка — один совет' },
    ],
    defaultContentTemplate: [
      '## Сложность', '', '## Уровень', '', '## Регион', '', '## Локация', '',
      '## Стратегия', '- ', '', '## Награды', '- ', '', '## Советы', '- ',
    ].join('\n'),
  },
  mystic: {
    showNameEn: true,
    contentFields: [
      { id: 'effect', label: 'Эффект', kind: 'textarea', header: '## Эффект', placeholder: 'Описание эффекта…' },
      { id: 'cooldown', label: 'Перезарядка', kind: 'text', header: '## Перезарядка', placeholder: '60 сек' },
      { id: 'howToGet', label: 'Как получить', kind: 'textarea', header: '## Как получить', placeholder: '…' },
    ],
    defaultContentTemplate: '## Эффект\n\n\n## Перезарядка\n\n\n## Как получить\n\n',
  },
  cooking: {
    showNameEn: true,
    contentFields: [
      { id: 'level', label: 'Уровень', kind: 'text', header: '## Уровень', placeholder: '1' },
      { id: 'stamina', label: 'Выносливость', kind: 'text', header: '## Выносливость', placeholder: '2' },
      { id: 'ingredients', label: 'Ингредиенты', kind: 'list', header: '## Ингредиенты', placeholder: 'Рыба x1' },
      { id: 'howToUnlock', label: 'Разблокировка', kind: 'textarea', header: '## Разблокировка', placeholder: 'Как открыть рецепт…' },
    ],
    defaultContentTemplate: '## Уровень\n\n\n## Выносливость\n\n\n## Ингредиенты\n\n- \n\n## Разблокировка\n\n',
  },
  tips: {
    contentFields: [],
    defaultContentTemplate: '',
  },
  lifeskills: {
    contentFields: [],
    defaultContentTemplate: '',
  },
  innerpath: {
    showNameEn: true,
    contentFields: [
      { id: 'effect', label: 'Эффект', kind: 'textarea', header: '## Эффект', placeholder: 'Описание эффекта…' },
      { id: 'howToGet', label: 'Как получить', kind: 'textarea', header: '## Как получить', placeholder: '…' },
    ],
    defaultContentTemplate: '## Эффект\n\n\n## Как получить\n\n',
  },
};

export function getSectionSchema(sectionId: string): SectionSchema | undefined {
  return sectionSchemas[sectionId];
}
