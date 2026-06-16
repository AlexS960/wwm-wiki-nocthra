const RELOAD_KEY = 'wwm-chunk-reload-attempts';
const MAX_ATTEMPTS = 3;

export function isChunkLoadError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error ?? '');
  const lower = msg.toLowerCase();
  return (
    lower.includes('failed to fetch dynamically imported module') ||
    lower.includes('loading chunk') ||
    lower.includes('loading css chunk') ||
    lower.includes('importing a module script failed') ||
    lower.includes('error loading dynamically imported module')
  );
}

export function clearChunkReloadFlag(): void {
  sessionStorage.removeItem(RELOAD_KEY);
}

/** Сбрасывает SW-кэш и Cache API — иначе после деплоя остаётся старый index/chunk. */
export async function clearAppCaches(): Promise<void> {
  try {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    }
  } catch {
    /* ignore */
  }
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister()));
    }
  } catch {
    /* ignore */
  }
}

/**
 * Восстановление после устаревшего чанка: очистка кэшей + жёсткая перезагрузка.
 * До MAX_ATTEMPTS попыток за сессию (обычно хватает одной после очистки SW).
 */
export async function recoverFromChunkError(force = false): Promise<boolean> {
  if (force) sessionStorage.removeItem(RELOAD_KEY);
  const attempts = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
  if (attempts >= MAX_ATTEMPTS) return false;

  sessionStorage.setItem(RELOAD_KEY, String(attempts + 1));

  await clearAppCaches();

  const url = new URL(window.location.href);
  url.searchParams.set('_v', String(Date.now()));
  window.location.replace(url.toString());
  return true;
}

/** @deprecated Используйте recoverFromChunkError */
export function reloadOnceForChunkError(): boolean {
  void recoverFromChunkError();
  return true;
}
