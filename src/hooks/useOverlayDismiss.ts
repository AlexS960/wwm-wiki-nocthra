import { useEffect } from 'react';
import { CLOSE_ALL_OVERLAYS, dispatchCloseAllOverlays } from '../lib/closeFloatPanels';

const INTERACTIVE_SELECTOR = '.overlay-panel, [role="dialog"], button, input, textarea, select, a, label';

/** Закрывает оверлеи по клику вне интерактивных элементов и при скролле (с троттлингом). */
export function useOverlayDismiss(onDismiss: () => void) {
  useEffect(() => {
    const onOverlayClose = () => onDismiss();

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest(INTERACTIVE_SELECTOR)) return;
      dispatchCloseAllOverlays();
    };

    let closeScheduled = false;
    let closeResetTimeout: ReturnType<typeof setTimeout> | null = null;

    const onWindowScroll = () => {
      if (document.documentElement.dataset.appPage === 'staffchat') return;
      if (closeScheduled) return;
      closeScheduled = true;
      requestAnimationFrame(dispatchCloseAllOverlays);
      closeResetTimeout = setTimeout(() => {
        closeScheduled = false;
      }, 120);
    };

    document.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('scroll', onWindowScroll, { passive: true });
    window.addEventListener(CLOSE_ALL_OVERLAYS, onOverlayClose);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener('scroll', onWindowScroll);
      window.removeEventListener(CLOSE_ALL_OVERLAYS, onOverlayClose);
      if (closeResetTimeout) clearTimeout(closeResetTimeout);
    };
  }, [onDismiss]);
}
