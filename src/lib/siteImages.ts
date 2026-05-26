/** Встроенные base64 в site_data сильно увеличивают egress — только URL Storage или https */

export function isEmbeddedImageUrl(url: unknown): boolean {
  return typeof url === 'string' && url.startsWith('data:image');
}

export function sanitizeImageUrl(url: unknown): string {
  if (typeof url !== 'string' || !url.trim()) return '';
  if (isEmbeddedImageUrl(url)) return '';
  return url.trim();
}

export function sanitizeImageList(images: unknown): string[] {
  if (!Array.isArray(images)) return [];
  return images.map(sanitizeImageUrl).filter(Boolean);
}

export function sanitizePictureField(url: unknown): string {
  return sanitizeImageUrl(url);
}

interface WithImages {
  images?: unknown;
}

export function sanitizeGuides<T extends WithImages>(guides: T[]): T[] {
  return guides.map(g => ({ ...g, images: sanitizeImageList(g.images) }));
}

export function sanitizeWiki<T extends WithImages>(items: T[]): T[] {
  return items.map(w => ({ ...w, images: sanitizeImageList(w.images) }));
}

export function sanitizeSiteNews<T extends WithImages>(items: T[]): T[] {
  return items.map(n => ({ ...n, images: sanitizeImageList(n.images) }));
}

export function sanitizeGuideVersions<T extends WithImages>(versions: T[]): T[] {
  return versions.map(v => ({ ...v, images: sanitizeImageList(v.images) }));
}

export function sanitizeGuildAvatar<T extends { avatar?: unknown }>(guild: T): T {
  const avatar = sanitizeImageUrl(guild.avatar);
  return { ...guild, avatar: avatar || '' };
}

/** Перед записью в Supabase */
export function sanitizeSiteDataPayload(key: string, data: unknown): unknown {
  switch (key) {
    case 'guides':
      return sanitizeGuides(asArray(data));
    case 'wiki':
      return sanitizeWiki(asArray(data));
    case 'site_news':
      return sanitizeSiteNews(asArray(data));
    case 'guide_versions':
      return sanitizeGuideVersions(asArray(data));
    case 'guild':
      return data && typeof data === 'object'
        ? sanitizeGuildAvatar(data as { avatar?: unknown })
        : data;
    default:
      return data;
  }
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value : [];
}

export function countEmbeddedImagesInSiteData(keys: {
  guides?: WithImages[];
  wiki?: WithImages[];
  siteNews?: WithImages[];
  guild?: { avatar?: unknown };
}): number {
  let n = 0;
  for (const g of keys.guides || []) n += (g.images || []).filter(isEmbeddedImageUrl).length;
  for (const w of keys.wiki || []) n += (w.images || []).filter(isEmbeddedImageUrl).length;
  for (const s of keys.siteNews || []) n += (s.images || []).filter(isEmbeddedImageUrl).length;
  if (keys.guild?.avatar && isEmbeddedImageUrl(keys.guild.avatar)) n += 1;
  return n;
}
