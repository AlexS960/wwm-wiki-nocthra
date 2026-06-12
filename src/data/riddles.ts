import cluesJson from './riddles.clues.json';
import mastersJson from './riddleMasters.json';

export type RiddleRegion = 'qinghe' | 'kaifeng' | 'hexi';

export interface RiddleMaster {
  id: string;
  nameEn: string;
  nameRu: string;
  region: RiddleRegion;
  regionLabelRu: string;
  locationTitle: string;
  subregion: string;
  locationDetail: string;
  intelligence: number;
  commerceCost: number;
  wikiId?: string;
  isCustom?: boolean;
  icon?: string;
}

export interface RiddleClue {
  id: string;
  clueEn: string;
  answers: string[];
  primaryAnswer: string;
  wikiId?: string;
  isCustom?: boolean;
}

export const riddleMasters = mastersJson as RiddleMaster[];
export const riddleClues = cluesJson as RiddleClue[];

export const riddleRegionLabels: Record<RiddleRegion, string> = {
  qinghe: 'Цинхэ',
  kaifeng: 'Кайфэн',
  hexi: 'Хэси',
};

/** Краткие правила мини-игры — своя формулировка для вики */
export const riddleHowToSteps = [
  {
    title: 'Подсказка от NPC',
    text: 'Загадочник выдаёт короткую подсказку — обычно одно или два слова на английском. Запомните её и откройте справочник ниже.',
  },
  {
    title: 'Ограниченные попытки',
    text: 'У вас ограниченное число ходов; сверху идёт таймер — промедление может пропустить ход. Чем выше требование к Интеллекту, тем сложнее условия.',
  },
  {
    title: 'Ответ в чате',
    text: 'Вводите слово-ответ в диалог с ИИ или уточняйте вопросами. Правильный ответ засчитывается, когда NPC подтверждает угадывание.',
  },
];

export const riddleEconomyTip =
  'Каждая попытка стоит торговых монет. Пополнить запас: выполнить задания Meow Meow, затем обменять колокола в Храме Meow Meow на Halo Peak.';
