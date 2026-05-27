import { getSupabase } from './supabase';

export const STORAGE_BUCKET = 'site-images';

export function getPublicUrl(path: string): string {
  const { data } = getSupabase().storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export function isStorageUrl(url: string): boolean {
  return url.includes(`/storage/v1/object/public/${STORAGE_BUCKET}/`) || url.includes(`${STORAGE_BUCKET}/`);
}

export function pathFromStorageUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const i = url.indexOf(marker);
  if (i >= 0) return decodeURIComponent(url.slice(i + marker.length));
  return null;
}

export async function uploadSiteImage(
  blob: Blob,
  folder: string,
): Promise<{ url?: string; path?: string; error?: string }> {
  const path = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.jpg`;
  const { error } = await getSupabase().storage.from(STORAGE_BUCKET).upload(path, blob, {
    contentType: 'image/jpeg',
    cacheControl: '31536000',
    upsert: false,
  });
  if (error) {
    if (error.message.toLowerCase().includes('bucket') || error.message.includes('not found')) {
      return { error: 'Bucket «site-images» не найден. Выполните supabase/storage-setup.sql в SQL Editor Supabase.' };
    }
    return { error: error.message };
  }
  return { url: getPublicUrl(path), path };
}

export async function deleteSiteImageByUrl(url: string): Promise<void> {
  const path = pathFromStorageUrl(url);
  if (!path) return;
  await getSupabase().storage.from(STORAGE_BUCKET).remove([path]);
}

/** data URL → Blob для загрузки в Storage */
export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}
