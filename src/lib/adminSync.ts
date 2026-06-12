import type { SiteSettings } from '../types/site';

export interface SyncSectionInfo {
  id: string;
  label: string;
  defaultUrl?: string;
  requiresNetwork?: boolean;
  note?: string;
}

export interface AiSyncInfo {
  used?: boolean;
  enriched?: number;
  model?: string;
  message?: string;
  error?: string;
  reason?: string;
}

export interface DiscoveredSource {
  url: string;
  score: number;
  label: string;
  matched: boolean;
}

export interface SyncResult {
  section: string;
  label?: string;
  skipped?: boolean;
  reason?: string;
  error?: string;
  diff?: unknown;
  count?: number;
  payload?: ParsedPayload | null;
  sourceUrl?: string;
  discovered?: DiscoveredSource | null;
  ai?: AiSyncInfo | null;
  note?: string;
  requiresNetwork?: boolean;
}

export interface AiStatus {
  provider?: string;
  label?: string;
  configured: boolean;
  active: boolean;
  message?: string;
  model?: string;
  baseUrl?: string;
  localOnly?: boolean;
}

/** @deprecated */
export type DeepSeekStatus = AiStatus;

export interface DiscoverResult {
  wikiUrl: string;
  scannedAt: string;
  linkCount: number;
  sources: Record<string, DiscoveredSource>;
}

export interface ParsedPayload {
  riddles?: { clues: unknown[]; masters: unknown[] };
  innerpath?: { items: unknown[]; meta?: Record<string, unknown> };
  npcLocations?: { items: unknown[] };
  sectionOverrides?: Record<string, unknown[]>;
}

const SYNC_KEY_STORAGE = 'wwm_sync_api_key';

export function getStoredSyncKey(): string {
  try {
    return sessionStorage.getItem(SYNC_KEY_STORAGE) || '';
  } catch {
    return '';
  }
}

export function setStoredSyncKey(key: string) {
  try {
    if (key) sessionStorage.setItem(SYNC_KEY_STORAGE, key);
    else sessionStorage.removeItem(SYNC_KEY_STORAGE);
  } catch { /* ignore */ }
}

async function syncFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-Sync-Key': getStoredSyncKey(),
      ...init?.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return data as T;
}

export async function fetchSyncSections(): Promise<{
  sections: SyncSectionInfo[];
  wikiUrl: string;
  ai: AiStatus;
}> {
  return syncFetch('/api/sync-content');
}

export async function fetchAiStatus(): Promise<AiStatus> {
  const data = await syncFetch<{ ai: AiStatus }>('/api/sync-content?action=ai-status');
  return data.ai;
}

export async function discoverParserSources(wikiUrl?: string): Promise<DiscoverResult> {
  return syncFetch('/api/sync-content', {
    method: 'POST',
    body: JSON.stringify({ action: 'discover', wikiUrl }),
  });
}

export async function runParserSync(opts: {
  section?: string;
  sections?: string[];
  dryRun?: boolean;
  fetch?: boolean;
  onlyMissing?: boolean;
  limit?: number;
  sourceUrl?: string;
  sourceUrls?: Record<string, string>;
  wikiUrl?: string;
  autoDiscover?: boolean;
  useAi?: boolean;
}): Promise<{ result?: SyncResult; results?: SyncResult[] }> {
  return syncFetch('/api/sync-content', {
    method: 'POST',
    body: JSON.stringify(opts),
  });
}

export function isPayloadEmpty(payload: ParsedPayload | null | undefined): boolean {
  if (!payload) return true;
  if (payload.riddles) {
    return !payload.riddles.clues?.length && !payload.riddles.masters?.length;
  }
  if (payload.innerpath) return !payload.innerpath.items?.length;
  if (payload.npcLocations) return !payload.npcLocations.items?.length;
  if (payload.sectionOverrides) {
    return !Object.values(payload.sectionOverrides).some(arr => arr?.length);
  }
  return true;
}

export function buildSettingsPatch(
  current: SiteSettings,
  payload: ParsedPayload,
  section: string,
): Partial<SiteSettings> {
  const syncedAt = new Date().toISOString();
  const parsedContent = {
    ...(current.parsedContent || {}),
    riddles: current.parsedContent?.riddles,
    innerpath: current.parsedContent?.innerpath,
    npcLocations: current.parsedContent?.npcLocations,
  };
  const sectionOverrides = { ...(current.sectionOverrides || {}) };
  const meta = { ...(parsedContent.meta || {}) };

  if (payload.riddles) {
    if (!payload.riddles.clues?.length && !payload.riddles.masters?.length) {
      return {};
    }
    parsedContent.riddles = { ...payload.riddles, syncedAt };
    meta.riddles = {
      syncedAt,
      count: payload.riddles.clues.length + payload.riddles.masters.length,
    };
  }
  if (payload.innerpath) {
    if (!payload.innerpath.items?.length) return {};
    parsedContent.innerpath = { ...payload.innerpath, syncedAt };
    sectionOverrides.innerpath = payload.innerpath.items;
    meta.innerpath = { syncedAt, count: payload.innerpath.items.length };
  }
  if (payload.npcLocations) {
    if (!payload.npcLocations.items?.length) return {};
    parsedContent.npcLocations = { ...payload.npcLocations, syncedAt };
    meta['npcs-locations'] = { syncedAt, count: payload.npcLocations.items.length };
  }
  if (payload.sectionOverrides) {
    for (const [key, val] of Object.entries(payload.sectionOverrides)) {
      sectionOverrides[key] = val;
      meta[key] = { syncedAt, count: val.length };
    }
  }

  parsedContent.meta = meta;
  return { parsedContent, sectionOverrides };
}

export function formatSyncDiff(diff: unknown): string {
  if (!diff || typeof diff !== 'object') return '';
  const d = diff as { added?: string[]; removed?: string[]; changed?: string[]; prevCount?: number; nextCount?: number };
  const parts: string[] = [];
  if (d.prevCount != null && d.nextCount != null) {
    parts.push(`${d.prevCount} → ${d.nextCount}`);
  }
  if (d.added?.length) parts.push(`+${d.added.length}`);
  if (d.changed?.length) parts.push(`~${d.changed.length}`);
  if (d.removed?.length) parts.push(`-${d.removed.length}`);
  return parts.join(', ');
}
