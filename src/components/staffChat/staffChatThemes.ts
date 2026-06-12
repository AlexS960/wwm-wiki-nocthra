export interface StaffChatTheme {
  id: string;
  name: string;
  /** Фон области сообщений */
  panelBg: string;
  /** Сообщение собеседника */
  otherBubble: string;
  /** Своё сообщение */
  selfBubble: string;
  /** Акцент (кнопки, активный чат) */
  accent: string;
  accentBorder: string;
  accentSoft: string;
}

export const STAFF_CHAT_THEMES: StaffChatTheme[] = [
  {
    id: 'purple',
    name: 'Фиолетовый',
    panelBg: 'bg-ink-900/30',
    otherBubble: 'bg-ink-800/70 text-ink-100 rounded-bl-md',
    selfBubble: 'bg-purple-600/35 text-purple-50 rounded-br-md',
    accent: 'text-purple-400',
    accentBorder: 'border-purple-500/35',
    accentSoft: 'bg-purple-500/15',
  },
  {
    id: 'gold',
    name: 'Золотой',
    panelBg: 'bg-ink-900/40',
    otherBubble: 'bg-ink-800/70 text-ink-100 rounded-bl-md',
    selfBubble: 'bg-gold-500/30 text-gold-50 rounded-br-md',
    accent: 'text-gold-400',
    accentBorder: 'border-gold-500/35',
    accentSoft: 'bg-gold-500/15',
  },
  {
    id: 'jade',
    name: 'Нефрит',
    panelBg: 'bg-ink-900/35',
    otherBubble: 'bg-ink-800/70 text-ink-100 rounded-bl-md',
    selfBubble: 'bg-jade-500/28 text-jade-50 rounded-br-md',
    accent: 'text-jade-400',
    accentBorder: 'border-jade-500/35',
    accentSoft: 'bg-jade-500/15',
  },
  {
    id: 'ocean',
    name: 'Океан',
    panelBg: 'bg-slate-900/40',
    otherBubble: 'bg-slate-800/60 text-slate-100 rounded-bl-md',
    selfBubble: 'bg-blue-600/35 text-blue-50 rounded-br-md',
    accent: 'text-blue-400',
    accentBorder: 'border-blue-500/35',
    accentSoft: 'bg-blue-500/15',
  },
  {
    id: 'crimson',
    name: 'Багровый',
    panelBg: 'bg-ink-900/40',
    otherBubble: 'bg-ink-800/70 text-ink-100 rounded-bl-md',
    selfBubble: 'bg-crimson-500/30 text-crimson-50 rounded-br-md',
    accent: 'text-crimson-400',
    accentBorder: 'border-crimson-500/35',
    accentSoft: 'bg-crimson-500/15',
  },
  {
    id: 'sunset',
    name: 'Закат',
    panelBg: 'bg-ink-900/35',
    otherBubble: 'bg-ink-800/70 text-ink-100 rounded-bl-md',
    selfBubble: 'bg-orange-600/32 text-orange-50 rounded-br-md',
    accent: 'text-orange-400',
    accentBorder: 'border-orange-500/35',
    accentSoft: 'bg-orange-500/15',
  },
];

export function getStaffChatTheme(id: string): StaffChatTheme {
  return STAFF_CHAT_THEMES.find(t => t.id === id) || STAFF_CHAT_THEMES[0];
}
