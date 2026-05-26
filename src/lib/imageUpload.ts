const MAX_WIDTH = 1280;
const MAX_SIZE_MB = 1.2;
const JPEG_QUALITY = 0.72;

export async function compressImageFile(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Выберите изображение (PNG, JPG, WebP)');
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error('Файл слишком большой (макс. 8 МБ до сжатия)');
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_WIDTH / bitmap.width);
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Не удалось обработать изображение');
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  let quality = JPEG_QUALITY;
  let dataUrl = canvas.toDataURL('image/jpeg', quality);
  while (dataUrl.length > MAX_SIZE_MB * 1024 * 1024 * 1.37 && quality > 0.35) {
    quality -= 0.08;
    dataUrl = canvas.toDataURL('image/jpeg', quality);
  }
  return dataUrl;
}

/** Сжатое изображение как Blob (для Supabase Storage) */
export async function compressImageFileToBlob(file: File): Promise<Blob> {
  const dataUrl = await compressImageFile(file);
  const res = await fetch(dataUrl);
  return res.blob();
}
