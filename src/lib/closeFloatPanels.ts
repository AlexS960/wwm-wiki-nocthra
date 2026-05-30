import { useEffect } from 'react';

export const CLOSE_FLOAT_PANELS = 'wwm-close-float-panels';
export const CLOSE_ALL_OVERLAYS = 'wwm-close-all-overlays';

export function dispatchCloseFloatPanels() {
  window.dispatchEvent(new Event(CLOSE_FLOAT_PANELS));
}

export function dispatchCloseAllOverlays() {
  window.dispatchEvent(new Event(CLOSE_ALL_OVERLAYS));
  dispatchCloseFloatPanels();
}

/** Закрыть плавающие чат / ЛС / поддержку при открытии меню и т.п. */
export function useCloseFloatPanels(onClose: () => void) {
  useEffect(() => {
    const handler = () => onClose();
    window.addEventListener(CLOSE_FLOAT_PANELS, handler);
    return () => window.removeEventListener(CLOSE_FLOAT_PANELS, handler);
  }, [onClose]);
}
