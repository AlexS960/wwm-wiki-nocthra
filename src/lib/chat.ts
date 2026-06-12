/** Меньше сообщений в JSON → меньше egress при каждом сохранении чата */
export const MAX_CHAT_MESSAGES = 200;

/** Задержка перед записью чата в Supabase (мс) */
export const CHAT_PERSIST_DEBOUNCE_MS = 900;

export function trimChatMessages<T>(messages: T[]): T[] {
  if (messages.length <= MAX_CHAT_MESSAGES) return messages;
  return messages.slice(-MAX_CHAT_MESSAGES);
}
