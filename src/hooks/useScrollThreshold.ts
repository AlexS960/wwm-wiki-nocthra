import { useEffect, useRef, useState } from 'react';

/** Отслеживает, прокручена ли страница ниже порога. Обновление через rAF, без лишних setState. */
export function useScrollThreshold(threshold: number): boolean {
  const [isPastThreshold, setIsPastThreshold] = useState(false);
  const isPastRef = useRef(false);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const next = window.scrollY > threshold;
      if (next === isPastRef.current) return;
      isPastRef.current = next;
      setIsPastThreshold(next);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return isPastThreshold;
}
