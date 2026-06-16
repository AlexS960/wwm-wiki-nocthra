import { useMemo, useRef } from 'react';

/**
 * Возвращает объект с теми же методами, но стабильными ссылками между рендерами.
 * Каждый вызов делегирует в актуальный `build()` через ref — подходит для React Context «actions».
 */
export function useStableActions<T extends Record<string, unknown>>(build: () => T): T {
  const buildRef = useRef(build);
  buildRef.current = build;

  return useMemo(() => {
    const sample = buildRef.current();
    const stable = {} as Record<string, unknown>;
    for (const key of Object.keys(sample)) {
      const value = sample[key];
      if (typeof value === 'function') {
        stable[key] = (...args: unknown[]) =>
          (buildRef.current()[key] as (...a: unknown[]) => unknown)(...args);
      }
    }
    return stable as T;
  }, []);
}
