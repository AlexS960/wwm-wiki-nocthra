import { dbGetVisitStats, dbRecordVisit } from './db';

const VISITOR_KEY = 'wwm_visitor_id';
const LAST_HIT_KEY = 'wwm_last_hit';
/** Не чаще одного hit на path за сессию (5 мин) */
const HIT_COOLDOWN_MS = 5 * 60 * 1000;

export function getOrCreateVisitorId(): string {
  try {
    const existing = localStorage.getItem(VISITOR_KEY);
    if (existing) return existing;
    const id = 'v_' + crypto.randomUUID().replace(/-/g, '').slice(0, 16);
    localStorage.setItem(VISITOR_KEY, id);
    return id;
  } catch {
    return 'v_anon_' + Date.now();
  }
}

export function trackPageVisit(path: string, userId?: string | null): void {
  const normalized = path.split('?')[0].split('#')[0] || '/';
  const key = `${LAST_HIT_KEY}:${normalized}`;
  try {
    const last = Number(localStorage.getItem(key) || '0');
    if (Date.now() - last < HIT_COOLDOWN_MS) return;
    localStorage.setItem(key, String(Date.now()));
  } catch {
    /* ignore */
  }
  void dbRecordVisit({
    visitor_id: getOrCreateVisitorId(),
    user_id: userId || null,
    path: normalized,
  });
}

export async function loadVisitStats(days = 7) {
  return dbGetVisitStats(days);
}
