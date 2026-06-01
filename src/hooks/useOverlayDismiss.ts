import { useEffect } from 'react';
import { CLOSE_ALL_OVERLAYS, dispatchCloseAllOverlays } from '../lib/closeFloatPanels';
import { subscribeScroll } from '../lib/scrollBus';

const INTERACTIVE_SELECTOR = '.overlay-panel, [role="dialog"], button, input, textarea, select, a, label';

interface UseOverlayDismissOptions {
  /** Закрывать модалки при прокрутке (только когда включено) */
  dismissOnScroll?: boolean;
}

/**
 * Закрывает оверлеи по клику вне интерактивных элементов.
 * Скролл — только при dismissOnScroll (логин/профиль), без закрытия чата на каждый пиксель.
 */
export function useOverlayDismiss(
  onDismiss: () => void,
  enabled = true,
  options: UseOverlayDismissOptions = {},
) {
  const { dismissOnScroll = false } = options;

  useEffect(() => {
    if (!enabled) return;

    const onOverlayClose = () => onDismiss();

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest(INTERACTIVE_SELECTOR)) return;
      dispatchCloseAllOverlays();
    };

    document.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener(CLOSE_ALL_OVERLAYS, onOverlayClose);

    let unsubscribeScroll: (() => void) | undefined;
    if (dismissOnScroll) {
      unsubscribeScroll = subscribeScroll(() => {
        if (document.documentElement.dataset.appPage === 'staffchat') return;
        onDismiss();
      });
    }

    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener(CLOSE_ALL_OVERLAYS, onOverlayClose);
      unsubscribeScroll?.();
    };
  }, [onDismiss, enabled, dismissOnScroll]);
}
