import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import { isChunkLoadError, reloadOnceForChunkError } from './chunkError';

async function importWithRetry<T>(
  factory: () => Promise<T>,
  retries = 2,
  delayMs = 400,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await factory();
    } catch (error) {
      lastError = error;
      if (!isChunkLoadError(error)) throw error;
      if (attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  if (isChunkLoadError(lastError)) {
    reloadOnceForChunkError();
    return new Promise(() => {});
  }
  throw lastError;
}

export function lazyWithRetry<T extends ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>,
): LazyExoticComponent<T> {
  return lazy(() => importWithRetry(factory));
}
