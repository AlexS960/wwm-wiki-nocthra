export type HealthState = 'ok' | 'error' | 'pending' | 'skipped';

export interface HealthCheckResult {
  state: HealthState;
  latencyMs?: number;
  detail?: string;
}

export interface BuildInfo {
  ok?: boolean;
  buildTime?: string;
  siteUrl?: string;
  version?: string;
}

const TIMEOUT_MS = 12_000;

async function timedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function checkSiteHealth(): Promise<HealthCheckResult> {
  const started = performance.now();
  try {
    const res = await timedFetch(`/health.json?ts=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) {
      return { state: 'error', detail: `HTTP ${res.status}`, latencyMs: Math.round(performance.now() - started) };
    }
    const data = (await res.json()) as BuildInfo;
    if (!data.ok) {
      return { state: 'error', detail: 'health.json: ok=false', latencyMs: Math.round(performance.now() - started) };
    }
    return { state: 'ok', latencyMs: Math.round(performance.now() - started) };
  } catch (e) {
    return {
      state: 'error',
      detail: e instanceof Error ? e.message : String(e),
      latencyMs: Math.round(performance.now() - started),
    };
  }
}

export async function checkSupabaseHealth(): Promise<HealthCheckResult> {
  const baseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '');
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!baseUrl || !anonKey) {
    return { state: 'skipped', detail: 'VITE_SUPABASE_* не заданы' };
  }

  const started = performance.now();
  try {
    const res = await timedFetch(`${baseUrl}/auth/v1/health`, {
      headers: { apikey: anonKey },
    });
    if (!res.ok) {
      return { state: 'error', detail: `HTTP ${res.status}`, latencyMs: Math.round(performance.now() - started) };
    }
    const data = (await res.json()) as { status?: string };
    if (data.status && data.status !== 'ok') {
      return { state: 'error', detail: `status=${data.status}`, latencyMs: Math.round(performance.now() - started) };
    }
    return { state: 'ok', latencyMs: Math.round(performance.now() - started) };
  } catch (e) {
    return {
      state: 'error',
      detail: e instanceof Error ? e.message : String(e),
      latencyMs: Math.round(performance.now() - started),
    };
  }
}

/** Проверка sync-api (если проксируется через nginx). Для чисто статического фронта — skipped. */
export async function checkSyncApiHealth(): Promise<HealthCheckResult> {
  const syncBase = import.meta.env.VITE_SYNC_API_URL?.replace(/\/$/, '');
  const url = syncBase ? `${syncBase}/health` : '/health';
  if (!syncBase && !import.meta.env.DEV) {
    return { state: 'skipped', detail: 'sync-api не настроен (только статика)' };
  }

  const started = performance.now();
  try {
    const res = await timedFetch(url, { cache: 'no-store' });
    if (!res.ok) {
      return { state: 'error', detail: `HTTP ${res.status}`, latencyMs: Math.round(performance.now() - started) };
    }
    const data = (await res.json()) as { ok?: boolean; service?: string };
    if (data.ok === false) {
      return { state: 'error', detail: 'ok=false', latencyMs: Math.round(performance.now() - started) };
    }
    return {
      state: 'ok',
      detail: data.service,
      latencyMs: Math.round(performance.now() - started),
    };
  } catch {
    return { state: 'skipped', detail: 'sync-api недоступен' };
  }
}

export async function loadBuildInfo(): Promise<BuildInfo | null> {
  try {
    const res = await timedFetch(`/health.json?ts=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as BuildInfo;
  } catch {
    return null;
  }
}

export function formatBuildTime(iso?: string): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString('ru-RU', { dateStyle: 'medium', timeStyle: 'short' });
}
