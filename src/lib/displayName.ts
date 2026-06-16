/** Игровой ник приоритетнее логина для отображения в чате, ЛС и поддержке */
export function getDisplayName(u: { name: string; gameNickname?: string } | null | undefined): string {
  if (!u) return 'Неизвестный';
  const nick = u.gameNickname?.trim();
  return nick || u.name;
}

export function formatLastSeen(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const now = Date.now();
  const diff = now - d.getTime();
  if (diff < 60_000) return 'только что';
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)} мин. назад`;
  if (diff < 86400_000) return `${Math.floor(diff / 3600_000)} ч. назад`;
  return d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export function formatRegistrationDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const ONLINE_THRESHOLD_MS = 3 * 60 * 1000;

export function isOnlineByLastSeen(lastSeenAt: string | null | undefined): boolean {
  if (!lastSeenAt) return false;
  const t = new Date(lastSeenAt).getTime();
  return !Number.isNaN(t) && Date.now() - t < ONLINE_THRESHOLD_MS;
}
