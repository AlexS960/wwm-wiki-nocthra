import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { scrollToWikiCard } from '../lib/wikiLinks';

const WikiFocusContext = createContext<string | null>(null);

const FOCUS_RETRY_MS = 200;
const FOCUS_MAX_ATTEMPTS = 25;

export function WikiFocusProvider({
  focusId,
  onFocused,
  children,
}: {
  focusId: string | null;
  onFocused?: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!focusId) return;
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const tryScroll = () => {
      if (cancelled) return;
      if (scrollToWikiCard(focusId)) {
        onFocused?.();
        return;
      }
      attempts += 1;
      if (attempts < FOCUS_MAX_ATTEMPTS) {
        timer = window.setTimeout(tryScroll, FOCUS_RETRY_MS);
      }
    };

    timer = window.setTimeout(tryScroll, 100);
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [focusId, onFocused]);

  return (
    <WikiFocusContext.Provider value={focusId}>
      {children}
    </WikiFocusContext.Provider>
  );
}

export function useWikiFocus() {
  return useContext(WikiFocusContext);
}
