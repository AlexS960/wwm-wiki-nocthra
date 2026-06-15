import type { UserProgress } from '../types/site';
import { defaultUserProgress } from '../context/authContextTypes';
import { asArray } from '../context/authContextTypes';

const PROGRESS_KEY_PREFIX = 'wwm_progress_';

function progressStorageKey(userId: string) {
  return `${PROGRESS_KEY_PREFIX}${userId}`;
}

export function normalizeUserProgress(raw: unknown): UserProgress {
  if (!raw || typeof raw !== 'object') return { ...defaultUserProgress };
  const p = raw as Record<string, unknown>;
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
    selectedBuild: typeof selected === 'string' && selected.length > 0
      ? selected
      : selected === null
        ? null
        : null,
  };
}

export function loadProgressLocal(userId: string): UserProgress | null {
  try {
    const raw = localStorage.getItem(progressStorageKey(userId));
    if (!raw) return null;
    return normalizeUserProgress(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveProgressLocal(userId: string, progress: UserProgress) {
  try {
    localStorage.setItem(progressStorageKey(userId), JSON.stringify(progress));
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
