/** Русские названия игровых путей (билдов / martial art). */
export const MARTIAL_ART_RU: Record<string, string> = {
  'Bellstrike — Splendor': 'Удар колокола — Великолепие',
  'Bellstrike — Umbra': 'Удар колокола — Умбра',
  'Bamboocut — Wind': 'Рассечение бамбука — Ветер',
  'Stonesplit — Might': 'Рассечение камня — Мощь',
  'Silkbind — Deluge': 'Шелковое связывание — Потоп',
  'Silkbind — Jade': 'Шелковое связывание — Нефрит',
  'Bellstrike - Splendor': 'Удар колокола — Великолепие',
  'Bellstrike - Umbra': 'Удар колокола — Умбра',
  'Bamboocut - Wind': 'Рассечение бамбука — Ветер',
  'Stonesplit - Might': 'Рассечение камня — Мощь',
  'Silkbind - Deluge': 'Шелковое связывание — Потоп',
  'Silkbind - Jade': 'Шелковое связывание — Нефрит',
};

export function martialArtRu(en: string): string {
  const key = en.trim();
  return MARTIAL_ART_RU[key] || key;
}
