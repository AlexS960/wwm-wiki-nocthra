import { dbGetVisitStats, dbRecordVisit } from './db';
import { dbgLog } from './debugSessionLog';

const IP_SESSION_KEY = 'wwm_client_ip';
const LAST_HIT_KEY = 'wwm_last_hit';
/** Не чаще одного hit на path за вкладку (5 мин) */
const HIT_COOLDOWN_MS = 5 * 60 * 1000;

let cachedIp: string | null = null;

const IPV4_RE = /^\d{1,3}(\.\d{1,3}){3}$/;

function isIpLike(value: string): boolean {
  return IPV4_RE.test(value) || value.includes(':');
}

/** Публичный IP устройства (кэш на вкладку). */
export async function resolveClientIp(): Promise<string> {
  if (cachedIp) return cachedIp;
  try {
    const stored = sessionStorage.getItem(IP_SESSION_KEY);
    if (stored && isIpLike(stored)) {
      cachedIp = stored;
      return stored;
    }
  } catch {
    /* ignore */
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json() as { ip?: string };
      const ip = String(data.ip || '').trim();
      if (ip && isIpLike(ip)) {
        cachedIp = ip;
        try { sessionStorage.setItem(IP_SESSION_KEY, ip); } catch { /* ignore */ }
        return ip;
      }
    }
  } catch {
    /* ignore */
  }

  return 'unknown';
}

function ipKind(ip: string): string {
  if (ip === 'unknown') return 'unknown';
  if (ip.includes(':')) return 'ipv6';
  if (IPV4_RE.test(ip)) return 'ipv4';
  return 'other';
}

export function trackPageVisit(path: string, userId?: string | null): void {
  const normalized = path.split('?')[0].split('#')[0] || '/';
  const key = `${LAST_HIT_KEY}:${normalized}`;
  dbgLog('analytics.ts:trackPageVisit', 'track called', { path: normalized, hasUser: !!userId }, 'B');
  try {
    const last = Number(sessionStorage.getItem(key) || '0');
    if (Date.now() - last < HIT_COOLDOWN_MS) {
      dbgLog('analytics.ts:trackPageVisit', 'cooldown skip', { path: normalized }, 'B');
      return;
    }
    sessionStorage.setItem(key, String(Date.now()));
  } catch {
    /* ignore */
  }

  void (async () => {
    const clientIp = await resolveClientIp();
    dbgLog('analytics.ts:trackPageVisit', 'ip resolved', { path: normalized, ipKind: ipKind(clientIp) }, 'B');
    await dbRecordVisit({
      client_ip: clientIp,
      user_id: userId || null,
      path: normalized,
    });
  })();
}

export async function loadVisitStats(days = 7) {
  return dbGetVisitStats(days);
}
