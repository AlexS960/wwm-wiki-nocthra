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

const DEFAULT_SURFACE_VARS: Record<string, string> = {
  '--surface-tint-pct': '16%',
  '--surface-tint-hover-pct': '22%',
  '--surface-panel-tint-pct': '12%',
  '--surface-input-tint-pct': '14%',
  '--surface-card': 'rgba(26, 20, 14, 0.6)',
  '--surface-card-subtle': 'rgba(26, 20, 14, 0.4)',
  '--surface-card-hover': 'rgba(26, 20, 14, 0.55)',
  '--surface-card-hover-strong': 'rgba(26, 20, 14, 0.72)',
  '--surface-card-strong': 'rgba(26, 20, 14, 0.8)',
  '--surface-panel': 'rgba(15, 11, 7, 0.5)',
  '--surface-panel-strong': 'rgba(15, 11, 7, 0.78)',
  '--surface-input': 'rgba(26, 20, 14, 0.85)',
  '--surface-border': 'rgba(184, 137, 26, 0.35)',
  '--surface-border-subtle': 'rgba(184, 137, 26, 0.15)',
  '--accent-tint': DEFAULT_USER_ACCENT,
  '--accent-tint-muted': '#b8891a',
  '--header-gradient-start': '#4d370d',
  '--header-gradient-mid': '#2a2016',
  '--header-gradient-end': '#0f0b07',
  '--accent-gradient': 'linear-gradient(to bottom right, #4d370d, #2a2016, #0f0b07)',
  '--accent-radial-glow': 'rgba(212, 165, 40, 0.35)',
  '--text-on-surface': '#f8f5f0',
  '--text-muted-on-surface': 'rgba(248, 245, 240, 0.62)',
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
  ...Object.keys(DEFAULT_SURFACE_VARS),
  ...Object.keys(DEFAULT_CONTRAST_VARS),
];

const USER_ACCENT_STYLE_ID = 'user-accent-theme';

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

function tintedSurface(displayHex: string, tintPct: string, baseRgba: string): string {
  return `color-mix(in srgb, ${displayHex} ${tintPct}, ${baseRgba})`;
}

function buildSurfaceVars(hex: string, displayHex: string, isDark: boolean): Record<string, string> {
  const cardPct = isDark ? '24%' : '16%';
  const cardHoverPct = isDark ? '30%' : '22%';
  const panelPct = isDark ? '18%' : '12%';
  const inputPct = isDark ? '20%' : '14%';
  const [dr, dg, db] = hexToRgb(displayHex);
  const mutedRgb = mixRgb(hexToRgb(displayHex), [26, 20, 14], 0.4);

  const gradStart = rgbToHex(...mixRgb(hexToRgb(displayHex), [15, 11, 7], isDark ? 0.35 : 0.45));
  const gradMid = rgbToHex(...mixRgb(hexToRgb(displayHex), [26, 20, 14], isDark ? 0.5 : 0.55));
  const gradEnd = rgbToHex(...mixRgb(hexToRgb(displayHex), [15, 11, 7], isDark ? 0.65 : 0.72));

  return {
    '--surface-tint-pct': cardPct,
    '--surface-tint-hover-pct': cardHoverPct,
    '--surface-panel-tint-pct': panelPct,
    '--surface-input-tint-pct': inputPct,
    '--surface-card': tintedSurface(displayHex, cardPct, 'rgba(26, 20, 14, 0.6)'),
    '--surface-card-subtle': tintedSurface(displayHex, cardPct, 'rgba(26, 20, 14, 0.4)'),
    '--surface-card-hover': tintedSurface(displayHex, cardHoverPct, 'rgba(26, 20, 14, 0.55)'),
    '--surface-card-hover-strong': tintedSurface(displayHex, cardHoverPct, 'rgba(26, 20, 14, 0.72)'),
    '--surface-card-strong': tintedSurface(displayHex, cardPct, 'rgba(26, 20, 14, 0.8)'),
    '--surface-panel': tintedSurface(displayHex, panelPct, 'rgba(15, 11, 7, 0.5)'),
    '--surface-panel-strong': tintedSurface(displayHex, panelPct, 'rgba(15, 11, 7, 0.78)'),
    '--surface-input': tintedSurface(displayHex, inputPct, 'rgba(26, 20, 14, 0.85)'),
    '--surface-border': `rgba(${dr}, ${dg}, ${db}, 0.38)`,
    '--surface-border-subtle': `rgba(${dr}, ${dg}, ${db}, 0.2)`,
    '--accent-tint': displayHex,
    '--accent-tint-muted': rgbToHex(mutedRgb[0], mutedRgb[1], mutedRgb[2]),
    '--header-gradient-start': gradStart,
    '--header-gradient-mid': gradMid,
    '--header-gradient-end': gradEnd,
    '--accent-gradient': `linear-gradient(to bottom right, ${gradStart}, ${gradMid}, ${gradEnd})`,
    '--accent-radial-glow': `rgba(${dr}, ${dg}, ${db}, 0.38)`,
    '--text-on-surface': isDark ? '#f8f5f0' : '#1a140e',
    '--text-muted-on-surface': isDark ? 'rgba(248, 245, 240, 0.62)' : 'rgba(26, 20, 14, 0.65)',
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

function removeAccentThemeStyle() {
  document.getElementById(USER_ACCENT_STYLE_ID)?.remove();
}

function ensureAccentThemeStyle(surfaceMix: number) {
  let el = document.getElementById(USER_ACCENT_STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = USER_ACCENT_STYLE_ID;
    document.head.appendChild(el);
  }
  const glowAlpha = surfaceMix >= 20 ? 0.42 : 0.35;
  el.textContent = `
html[data-user-accent] .hover-glow-purple:hover,
html[data-user-accent] .hover-glow-purple:focus-visible {
  box-shadow: 0 0 16px rgba(var(--accent-rgb), ${glowAlpha}), 0 0 36px rgba(var(--accent-rgb), ${glowAlpha * 0.55}) !important;
}
html[data-user-accent] .guild-glow {
  animation: glowPulseAccent 3s ease-in-out infinite;
}
@keyframes glowPulseAccent {
  0%, 100% { filter: drop-shadow(0 0 6px rgba(var(--accent-rgb), 0.35)) drop-shadow(0 0 20px rgba(var(--accent-rgb), 0.12)); }
  50% { filter: drop-shadow(0 0 12px rgba(var(--accent-rgb), 0.65)) drop-shadow(0 0 36px rgba(var(--accent-rgb), 0.22)); }
}
`;
}

/** Применить акцент к CSS-переменным gold-* и эффектам. null — сброс к дефолту. */
export function applyUserAccent(color: UserAccentColor | null | undefined): void {
  const hex = color && isUserAccentColor(color) ? color : null;
  const root = document.documentElement;

  if (!hex || hex === DEFAULT_USER_ACCENT) {
    clearRootVars(ALL_ACCENT_VAR_KEYS);
    root.removeAttribute('data-user-accent');
    removeAccentThemeStyle();
    return;
  }

  const baseRgb = hexToRgb(hex);
  const isDark = relativeLuminance(...baseRgb) < DARK_ACCENT_LUMINANCE_THRESHOLD;
  const displayRgb = isDark ? ensureReadableOnDark(baseRgb) : baseRgb;
  const displayHex = rgbToHex(displayRgb[0], displayRgb[1], displayRgb[2]);
  const scaleBase = displayHex;
  const scale = buildGoldScale(scaleBase);
  const contrast = buildContrastVars(hex, scale);
  const surfaces = buildSurfaceVars(hex, displayHex, isDark);

  root.setAttribute('data-user-accent', hex);
  ensureAccentThemeStyle(isDark ? 24 : 16); // surface tint % for glow intensity

  setRootVars({
    ...scale,
    ...contrast,
    ...surfaces,
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
