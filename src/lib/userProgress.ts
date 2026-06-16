import type { UserProgress } from '../types/site';
import { defaultUserProgress } from '../context/authContextTypes';
import { asArray } from '../context/authContextTypes';

const PROGRESS_KEY_PREFIX = 'wwm_progress_';

export interface ProgressSnapshot {
  progress: UserProgress;
  savedAt: string | null;
}

function progressStorageKey(userId: string) {
  return `${PROGRESS_KEY_PREFIX}${userId}`;
}

export function normalizeUserProgress(raw: unknown): UserProgress {
  if (!raw || typeof raw !== 'object') return { ...defaultUserProgress };
  const p = { ...(raw as Record<string, unknown>) };
  delete p.savedAt;
  const selected = p.selectedBuild;
  return {
    completedGuides: asArray<string>(p.completedGuides).filter(id => typeof id === 'string' && id.length > 0),
    favoriteWeapons: asArray<string>(p.favoriteWeapons).filter(id => typeof id === 'string' && id.length > 0),
    favoriteSects: asArray<string>(p.favoriteSects).filter(id => typeof id === 'string' && id.length > 0),
    visitedRegions: asArray<string>(p.visitedRegions).filter(id => typeof id === 'string' && id.length > 0),
    notes: asArray<Record<string, unknown>>(p.notes)
      .map(n => ({
        id: typeof n.id === 'string' ? n.id : '',
        title: typeof n.title === 'string' ? n.title : '',
        content: typeof n.content === 'string' ? n.content : '',
        date: typeof n.date === 'string' ? n.date : '',
      }))
      .filter(n => n.id && n.title),
    selectedBuild: typeof selected === 'string' && selected.length > 0 ? selected : null,
  };
}

function progressTimestamp(iso: string | null | undefined): number {
  if (!iso) return 0;
  const t = new Date(iso).getTime();
  return Number.isFinite(t) ? t : 0;
}

/** Берёт более свежую копию прогресса (local vs DB). Не объединяет списки — иначе удаления не сохраняются. */
export function resolveUserProgress(
  local: ProgressSnapshot | null,
  remote: ProgressSnapshot | null,
): UserProgress {
  const localProgress = local?.progress ?? { ...defaultUserProgress };
  const remoteProgress = remote?.progress ?? { ...defaultUserProgress };
  const localTs = progressTimestamp(local?.savedAt);
  const remoteTs = progressTimestamp(remote?.savedAt);

  if (localTs === 0 && remoteTs === 0) return remoteProgress;
  if (localTs === 0) return remoteProgress;
  if (remoteTs === 0) return localProgress;
  return localTs >= remoteTs ? localProgress : remoteProgress;
}

export function loadProgressLocal(userId: string): ProgressSnapshot | null {
  try {
    const raw = localStorage.getItem(progressStorageKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const savedAt = typeof parsed.savedAt === 'string' ? parsed.savedAt : null;
    return { progress: normalizeUserProgress(parsed), savedAt };
  } catch {
    return null;
  }
}

export function saveProgressLocal(userId: string, progress: UserProgress) {
  try {
    localStorage.setItem(
      progressStorageKey(userId),
      JSON.stringify({ ...progress, savedAt: new Date().toISOString() }),
    );
  } catch {
    /* quota / private mode */
  }
}

export function clearProgressLocal(userId: string) {
  try {
    localStorage.removeItem(progressStorageKey(userId));
  } catch {
    /* ignore */
  }
}

export function getProgressLocalSavedAt(userId: string): string | null {
  return loadProgressLocal(userId)?.savedAt ?? null;
}
