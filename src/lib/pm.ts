export interface PrivateMessage {
  id: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  text: string;
  timestamp: number;
  read: boolean;
  deletedForAll?: boolean;
  hiddenFor?: string[];
}

/** Храним не больше N ЛС в site_data — меньше egress при каждом сохранении */
export const MAX_PM_MESSAGES = 300;

/** Как в Telegram: «удалить у всех» только для своих сообщений в пределах 48 ч */
export const PM_DELETE_FOR_ALL_MS = 48 * 60 * 60 * 1000;

export function trimPrivateMessages(messages: PrivateMessage[]): PrivateMessage[] {
  if (messages.length <= MAX_PM_MESSAGES) return messages;
  return messages.slice(-MAX_PM_MESSAGES);
}

export function isPmVisibleForUser(msg: PrivateMessage, userId: string): boolean {
  return !msg.hiddenFor?.includes(userId);
}

export function canDeletePmForAll(msg: PrivateMessage, userId: string): boolean {
  if (msg.fromId !== userId || msg.deletedForAll) return false;
  return Date.now() - msg.timestamp <= PM_DELETE_FOR_ALL_MS;
}

export function getPmPreviewText(msg: PrivateMessage, viewerId: string): string {
  if (!isPmVisibleForUser(msg, viewerId)) return '';
  if (msg.deletedForAll) return 'Сообщение удалено';
  return msg.text;
}

export function filterPmForUser(messages: PrivateMessage[], userId: string): PrivateMessage[] {
  return messages.filter(m => isPmVisibleForUser(m, userId));
}
