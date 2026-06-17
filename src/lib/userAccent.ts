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
    clearRootVars([...Object.keys(DEFAULT_GOLD_SCALE), '--accent-rgb', '--user-accent']);
    return;
  }
  const scale = buildGoldScale(hex);
  const [r, g, b] = hexToRgb(hex);
  setRootVars({
    ...scale,
    '--user-accent': hex,
    '--accent-rgb': `${r}, ${g}, ${b}`,
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
