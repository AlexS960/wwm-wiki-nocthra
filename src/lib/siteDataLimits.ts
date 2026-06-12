/** Безопасный предел размера JSON в site_data (снижает риск отказа Supabase) */
export const MAX_SITE_DATA_JSON_BYTES = 900_000;

export function estimateJsonBytes(value: unknown): number {
  try {
    return new Blob([JSON.stringify(value)]).size;
  } catch {
    return 0;
  }
}

export function checkSiteDataSize(value: unknown): { ok: true } | { ok: false; message: string; bytes: number } {
  const bytes = estimateJsonBytes(value);
  if (bytes > MAX_SITE_DATA_JSON_BYTES) {
    const mb = (bytes / (1024 * 1024)).toFixed(2);
    const limitMb = (MAX_SITE_DATA_JSON_BYTES / (1024 * 1024)).toFixed(2);
    return {
      ok: false,
      bytes,
      message: `Слишком большой объём данных (${mb} МБ, лимит ${limitMb} МБ). Удалите старые скриншоты из JSON — используйте загрузку в Storage.`,
    };
  }
  return { ok: true };
}
