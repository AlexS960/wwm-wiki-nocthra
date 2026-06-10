/** Один passive listener на window.scroll для всего приложения */
type ScrollListener = () => void;

const listeners = new Set<ScrollListener>();
let scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
let ticking = false;
let attached = false;

function flush() {
  ticking = false;
  scrollY = window.scrollY;
  listeners.forEach(fn => fn());
}

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(flush);
}

function attach() {
  if (attached || typeof window === 'undefined') return;
  attached = true;
  window.addEventListener('scroll', onScroll, { passive: true });
  scrollY = window.scrollY;
}

function detach() {
  if (!attached || typeof window === 'undefined') return;
  if (listeners.size > 0) return;
  window.removeEventListener('scroll', onScroll);
  attached = false;
}

export function getScrollY(): number {
  return scrollY;
}

export function subscribeScroll(listener: ScrollListener): () => void {
  listeners.add(listener);
  attach();
  return () => {
    listeners.delete(listener);
    detach();
  };
}
