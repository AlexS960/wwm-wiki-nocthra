/** Короткий звук уведомления ЛС (Web Audio API, без внешнего файла) */
export function playPmNotification(customUrl?: string) {
  if (customUrl?.trim()) {
    try {
      const audio = new Audio(customUrl);
      audio.volume = 0.5;
      void audio.play().catch(() => playBeep());
      return;
    } catch {
      /* fallback */
    }
  }
  playBeep();
}

function playBeep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
    osc.onended = () => void ctx.close();
  } catch {
    /* ignore */
  }
}
