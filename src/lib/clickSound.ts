let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') void audioCtx.resume();
    return audioCtx;
  } catch {
    return null;
  }
}

const TEXT_FIELD_SELECTOR =
  'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"], [contenteditable=""]';

const CLICKABLE_SELECTOR = [
  'a[href]:not([href=""])',
  'button:not(:disabled)',
  '[role="button"]:not([aria-disabled="true"])',
  '[role="tab"]',
  '[role="menuitem"]',
  '[role="link"]',
  '[role="option"]',
  'input[type="button"]:not(:disabled)',
  'input[type="submit"]:not(:disabled)',
  'input[type="reset"]:not(:disabled)',
  'input[type="checkbox"]',
  'input[type="radio"]',
  'select',
  'label[for]',
  'summary',
  '[tabindex="0"]',
  '.cursor-pointer',
  '.card-hover',
  '.hover-glow-btn',
  '.admin-btn',
  '.fixed.inset-0',
  '[data-click-sound]',
].join(',');

export function shouldPlayClickSound(target: Element): boolean {
  if (target.closest('[data-no-click-sound]')) return false;
  if (target.closest(TEXT_FIELD_SELECTOR)) return false;
  return !!target.closest(CLICKABLE_SELECTOR);
}

/** Короткий щелчок при клике (Web Audio API). */
export function playClickSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(2200, t);
  osc.frequency.exponentialRampToValueAtTime(900, t + 0.025);

  gain.gain.setValueAtTime(0.1, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.05);
}
