import { useEffect } from 'react';
import { playClickSound, shouldPlayClickSound } from '../lib/clickSound';

export function useClickSound() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!shouldPlayClickSound(target)) return;
      playClickSound();
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);
}

/** @deprecated используйте useClickSound */
export const useLinkClickSound = useClickSound;
