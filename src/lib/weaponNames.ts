import weaponsParsed from '../data/parsed/weapons.json';
import { asText } from './asText';

const WEAPON_NAME_EN: Record<string, string> = Object.fromEntries(
  (weaponsParsed as { id: string; nameEn?: string }[])
    .filter((w) => w.id && w.nameEn)
    .map((w) => [w.id, w.nameEn!]),
);

/** Английское название оружия: из полей статьи или справочника по id. */
export function weaponNameEnglish(weaponId: string, fromFields?: string): string {
  const direct = asText(fromFields).trim();
  if (direct) return direct;
  return WEAPON_NAME_EN[weaponId] || '';
}
