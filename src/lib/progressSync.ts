import type { Dispatch, SetStateAction } from 'react';
import { dbLoadProgress, dbSaveProgress } from './db';
import type { UserProgress } from '../types/site';
import {
  loadProgressLocal,
  mergeUserProgress,
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
): Promise<UserProgress> {
  const fromDb = await dbLoadProgress(userId);
  const fromLocal = loadProgressLocal(userId);
  const merged = resolveUserProgress(fromLocal, fromDb);
  setProgress(prev => mergeUserProgress(prev, merged));
  saveProgressLocal(userId, merged);
  if (progressNeedsDbSync(merged, fromDb)) {
    void dbSaveProgress(userId, merged);
  }
  return merged;
}
