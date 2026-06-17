import {
  DEFAULT_USER_ACCENT,
  GUEST_ACCENT_STORAGE_KEY,
  isUserAccentColor,
  type UserAccentColor,
} from './userThemePalette';

const DEFAULT_GOLD_SCALE: Record<string, string> = {
  '--color-gold-50': '#fdf8e8',
  '--color-gold-100': '#f9edc4',
  '--color-gold-200': '#f3d88a',
  '--color-gold-300': '#e8bf4a',
  '--color-gold-400': '#d4a528',
  '--color-gold-500': '#b8891a',
  '--color-gold-600': '#956b13',
  '--color-gold-700': '#6f4f10',
  '--color-gold-800': '#4d370d',
  '--color-gold-900': '#2e200a',
};

const DEFAULT_CONTRAST_VARS: Record<string, string> = {
  '--user-accent': DEFAULT_USER_ACCENT,
  '--accent-rgb': '212, 165, 40',
  '--accent-foreground': '#2e200a',
  '--accent-on-dark': DEFAULT_USER_ACCENT,
  '--accent-muted': '#b8891a',
  '--accent-border': '#b8891a',
  '--accent-secondary-rgb': '168, 130, 255',
};

/** Акценты с низкой яркостью (#000, #800000, #696969, #808080) — поднимаем читаемость на тёмном фоне. */
const DARK_ACCENT_LUMINANCE_THRESHOLD = 0.18;
const TEXT_ON_DARK_MIN_LUMINANCE = 0.38;

const ALL_ACCENT_VAR_KEYS = [
  ...Object.keys(DEFAULT_GOLD_SCALE),
  ...Object.keys(DEFAULT_CONTRAST_VARS),
];

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('')}`;
}

function mixRgb(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

function relativeLuminance(r: number, g: number, b: number): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function ensureReadableOnDark(rgb: [number, number, number]): [number, number, number] {
  if (relativeLuminance(...rgb) >= TEXT_ON_DARK_MIN_LUMINANCE) return rgb;
  let t = 0;
  let result = rgb;
  while (relativeLuminance(...result) < TEXT_ON_DARK_MIN_LUMINANCE && t < 0.95) {
    t += 0.08;
    result = mixRgb(rgb, [255, 255, 255], t);
  }
  return result;
}

function buildGoldScale(baseHex: string): Record<string, string> {
  const base = hexToRgb(baseHex);
  const white: [number, number, number] = [255, 255, 255];
  const black: [number, number, number] = [0, 0, 0];
  const [r, g, b] = base;
  const mk = (rgb: [number, number, number]) => rgbToHex(rgb[0], rgb[1], rgb[2]);
  return {
    '--color-gold-50': mk(mixRgb(white, base, 0.12)),
    '--color-gold-100': mk(mixRgb(white, base, 0.28)),
    '--color-gold-200': mk(mixRgb(white, base, 0.45)),
    '--color-gold-300': mk(mixRgb(white, base, 0.62)),
    '--color-gold-400': rgbToHex(r, g, b),
    '--color-gold-500': mk(mixRgb(base, black, 0.18)),
    '--color-gold-600': mk(mixRgb(base, black, 0.32)),
    '--color-gold-700': mk(mixRgb(base, black, 0.48)),
    '--color-gold-800': mk(mixRgb(base, black, 0.62)),
    '--color-gold-900': mk(mixRgb(base, black, 0.78)),
  };
}

function buildContrastVars(hex: string, scale: Record<string, string>): Record<string, string> {
  const base = hexToRgb(hex);
  const lum = relativeLuminance(...base);
  const isDark = lum < DARK_ACCENT_LUMINANCE_THRESHOLD;
  const displayRgb = isDark ? ensureReadableOnDark(base) : base;
  const displayHex = rgbToHex(displayRgb[0], displayRgb[1], displayRgb[2]);
  const [dr, dg, db] = displayRgb;

  const onDarkHex = isDark ? displayHex : hex;
  const mutedRgb = mixRgb(displayRgb, [150, 138, 120], 0.35);
  const borderRgb = isDark ? displayRgb : mixRgb(base, [255, 255, 255], 0.12);
  const secondaryRgb = mixRgb(displayRgb, [168, 130, 255], 0.42);

  return {
    '--user-accent': onDarkHex,
    '--accent-rgb': `${Math.round(dr)}, ${Math.round(dg)}, ${Math.round(db)}`,
    '--accent-on-dark': onDarkHex,
    '--accent-muted': rgbToHex(mutedRgb[0], mutedRgb[1], mutedRgb[2]),
    '--accent-border': rgbToHex(borderRgb[0], borderRgb[1], borderRgb[2]),
    '--accent-foreground': isDark ? '#f8f5f0' : (scale['--color-gold-900'] ?? '#2e200a'),
    '--accent-secondary-rgb': `${Math.round(secondaryRgb[0])}, ${Math.round(secondaryRgb[1])}, ${Math.round(secondaryRgb[2])}`,
  };
}

function setRootVars(vars: Record<string, string>) {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }
}

function clearRootVars(keys: string[]) {
  const root = document.documentElement;
  for (const key of keys) {
    root.style.removeProperty(key);
  }
}

/** Применить акцент к CSS-переменным gold-* и эффектам. null — сброс к дефолту. */
export function applyUserAccent(color: UserAccentColor | null | undefined): void {
  const hex = color && isUserAccentColor(color) ? color : null;
  if (!hex || hex === DEFAULT_USER_ACCENT) {
    clearRootVars(ALL_ACCENT_VAR_KEYS);
    return;
  }

  const baseRgb = hexToRgb(hex);
  const isDark = relativeLuminance(...baseRgb) < DARK_ACCENT_LUMINANCE_THRESHOLD;
  const scaleBase = isDark
    ? rgbToHex(...ensureReadableOnDark(baseRgb))
    : hex;
  const scale = buildGoldScale(scaleBase);
  const contrast = buildContrastVars(hex, scale);

  setRootVars({
    ...scale,
    ...contrast,
  });
}

export function loadGuestAccent(): UserAccentColor | null {
  try {
    const raw = localStorage.getItem(GUEST_ACCENT_STORAGE_KEY);
    return isUserAccentColor(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function saveGuestAccent(color: UserAccentColor | null): void {
  try {
    if (!color) localStorage.removeItem(GUEST_ACCENT_STORAGE_KEY);
    else localStorage.setItem(GUEST_ACCENT_STORAGE_KEY, color);
  } catch {
    /* quota / private mode */
  }
}

/** Синхронное применение при старте (до React), чтобы не мигал дефолтный gold. */
export function initGuestAccentFromStorage(): void {
  applyUserAccent(loadGuestAccent());
}

export function resolveAccentForUser(
  progressAccent: string | null | undefined,
  isLoggedIn: boolean,
): UserAccentColor | null {
  if (isLoggedIn) {
    return isUserAccentColor(progressAccent) ? progressAccent : null;
  }
  return loadGuestAccent();
}

/** Цвет gold в BBCode / inline-стилях — читает актуальную CSS-переменную. */
export function getAccentGoldCssValue(): string {
  if (typeof document === 'undefined') return DEFAULT_USER_ACCENT;
  const v = getComputedStyle(document.documentElement).getPropertyValue('--color-gold-400').trim();
  return v || DEFAULT_USER_ACCENT;
}
