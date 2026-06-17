/** Допустимые акцентные цвета интерфейса (палитра фиксирована). */
export const USER_ACCENT_PALETTE = [
  '#66CDAA',
  '#B0C4DE',
  '#6495ED',
  '#696969',
  '#FFDEAD',
  '#800000',
  '#000000',
  '#808080',
  '#EE82EE',
] as const;

export type UserAccentColor = (typeof USER_ACCENT_PALETTE)[number];

export const DEFAULT_USER_ACCENT: UserAccentColor = '#d4a528';

export const GUEST_ACCENT_STORAGE_KEY = 'wwm_user_accent';

export function isUserAccentColor(value: unknown): value is UserAccentColor {
  return typeof value === 'string' && (USER_ACCENT_PALETTE as readonly string[]).includes(value);
}
