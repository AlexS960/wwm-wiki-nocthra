import { pb, POCKETBASE_URL } from './pocketbase';

export const STORAGE_COLLECTION = 'site_images';

export function getPublicUrl(record: { id: string; file: string; collectionId?: string }): string {
  return pb.files.getURL(record as Parameters<typeof pb.files.getURL>[0], record.file);
}

export function isStorageUrl(url: string): boolean {
  if (!url) return false;
  if (url.includes('/api/files/')) return true;
  // Legacy Supabase URLs (старые загрузки продолжают работать как ссылки)
  return url.includes('/storage/v1/object/public/site-images/');
}

export function recordIdFromStorageUrl(url: string): string | null {
  const marker = '/api/files/';
  const i = url.indexOf(marker);
  if (i < 0) return null;
  const rest = url.slice(i + marker.length);
  const parts = rest.split('/');
  if (parts.length < 2) return null;
  return parts[1] || null;
}

export async function uploadSiteImage(
  blob: Blob,
  folder: string,
): Promise<{ url?: string; path?: string; error?: string }> {
  const form = new FormData();
  form.append('folder', folder);
  form.append('file', blob, `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.jpg`);

  try {
    const record = await pb.collection(STORAGE_COLLECTION).create(form);
    const url = pb.files.getURL(record, record.file);
    return { url, path: record.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка загрузки';
    if (message.toLowerCase().includes('collection') || message.toLowerCase().includes('not found')) {
      return { error: 'Коллекция «site_images» не найдена. Импортируйте pocketbase/pb_schema.json в админке PocketBase.' };
    }
    return { error: message };
  }
}

export async function deleteSiteImageByUrl(url: string): Promise<void> {
  const recordId = recordIdFromStorageUrl(url);
  if (!recordId) return;
  try {
    await pb.collection(STORAGE_COLLECTION).delete(recordId);
  } catch {
    // ignore missing records
  }
}

/** data URL → Blob для загрузки в Storage */
export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}

/** Базовый URL PocketBase (для подсказок в админке) */
export { POCKETBASE_URL };
