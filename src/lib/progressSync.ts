import type { Dispatch, SetStateAction } from 'react';
import { dbLoadProgress, dbSaveProgress } from './db';
import type { UserProgress } from '../types/site';
import {
  loadProgressLocal,
  resolveUserProgress,
  saveProgressLocal,
} from './userProgress';

export function progressEquals(a: UserProgress, b: UserProgress): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function progressNeedsDbSync(merged: UserProgress, fromDb: UserProgress | null): boolean {
  if (!fromDb) return true;
  return !progressEquals(merged, fromDb);
}

/** Единая точка загрузки и слияния прогресса (local + DB). */
export async function hydrateUserProgress(
  userId: string,
  setProgress: Dispatch<SetStateAction<UserProgress>>,
  isActive?: () => boolean,
): Promise<UserProgress | null> {
  const fromDb = await dbLoadProgress(userId);
  if (isActive && !isActive()) return null;
  const fromLocal = loadProgressLocal(userId);
  const resolved = resolveUserProgress(fromLocal, fromDb);
  setProgress(resolved);
  if (isActive && !isActive()) return null;
  saveProgressLocal(userId, resolved);
  if (progressNeedsDbSync(resolved, fromDb?.progress ?? null)) {
    void dbSaveProgress(userId, resolved);
  }
  return resolved;
}
