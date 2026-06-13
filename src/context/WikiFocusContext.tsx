import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { scrollToWikiCard } from '../lib/wikiLinks';

const WikiFocusContext = createContext<string | null>(null);

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
    const timer = window.setTimeout(() => {
      if (scrollToWikiCard(focusId)) {
        onFocused?.();
      }
    }, 250);
    return () => window.clearTimeout(timer);
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
