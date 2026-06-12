export type AiNpcRegion = 'qinghe' | 'kaifeng' | 'hexi';

export type NpcDialogueRole = 'player' | 'npc' | 'system';

export interface NpcDialogueLine {
  role: NpcDialogueRole;
  textEn: string;
  textRu: string;
}

export interface AiNpc {
  id: string;
  nameEn: string;
  nameRu: string;
  region: AiNpcRegion;
  regionLabelRu: string;
  locationTitle: string;
  subregion: string;
  locationDetail: string;
  icon: string;
  befriendGuide?: string;
  dialogues: NpcDialogueLine[];
  wikiId?: string;
  isCustom?: boolean;
}

export const aiChatGlobalTips: string[] = [
  "Выберите второй пункт диалога «Подружиться» — не сюжетную ветку.",
  "Для AI-чата нужен VPN или прокси, если сервер недоступен из вашего региона.",
  "Некоторые NPC открываются только после прохождения квестов в регионе.",
  "Диалоги могут отличаться в зависимости от прогресса сюжета.",
];

export const aiNpcRegionLabels: Record<AiNpcRegion, string> = {
  qinghe: 'Цинхэ',
  kaifeng: 'Кайфэн',
  hexi: 'Хэси',
};
