import { useEffect } from 'react';

export const CLOSE_FLOAT_PANELS = 'wwm-close-float-panels';

export function dispatchCloseFloatPanels() {
  window.dispatchEvent(new Event(CLOSE_FLOAT_PANELS));
}

/** Закрыть плавающие чат / ЛС / поддержку при открытии меню и т.п. */
export function useCloseFloatPanels(onClose: () => void) {
  useEffect(() => {
    const handler = () => onClose();
    window.addEventListener(CLOSE_FLOAT_PANELS, handler);
    return () => window.removeEventListener(CLOSE_FLOAT_PANELS, handler);
  }, [onClose]);
}
