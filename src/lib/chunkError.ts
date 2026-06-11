const RELOAD_KEY = 'wwm-chunk-reload';

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

/** Одна автоперезагрузка за сессию при устаревшем кэше после деплоя. */
export function reloadOnceForChunkError(): boolean {
  if (sessionStorage.getItem(RELOAD_KEY)) return false;
  sessionStorage.setItem(RELOAD_KEY, '1');
  window.location.reload();
  return true;
}
