import { useEffect } from 'react';
import { playClickSound } from '../lib/clickSound';

const LINK_SELECTOR = 'a[href]:not([href=""]):not([data-no-click-sound])';

export function useLinkClickSound() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!target.closest(LINK_SELECTOR)) return;
      playClickSound();
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);
}
