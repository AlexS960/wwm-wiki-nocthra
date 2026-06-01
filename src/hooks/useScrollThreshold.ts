import { useEffect, useRef, useState } from 'react';
import { getScrollY, subscribeScroll } from '../lib/scrollBus';

/** Порог прокрутки через общий scrollBus (один listener на страницу). */
export function useScrollThreshold(threshold: number): boolean {
  const [isPastThreshold, setIsPastThreshold] = useState(
    () => typeof window !== 'undefined' && window.scrollY > threshold,
  );
  const isPastRef = useRef(isPastThreshold);
  const thresholdRef = useRef(threshold);
  thresholdRef.current = threshold;

  useEffect(() => {
    const update = () => {
      const next = getScrollY() > thresholdRef.current;
      if (next === isPastRef.current) return;
      isPastRef.current = next;
      setIsPastThreshold(next);
    };
    return subscribeScroll(update);
  }, []);

  return isPastThreshold;
}
