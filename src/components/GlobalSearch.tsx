import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, BookOpen, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { searchSite, type SearchResult } from '../lib/search';

interface GlobalSearchProps {
  onNavigate: (section: string, payload?: { guideId?: string; wikiId?: string }) => void;
}

export default function GlobalSearch({ onNavigate }: GlobalSearchProps) {
  const { guides, wikiArticles, ensureWikiLoaded } = useAuth();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const results = useMemo(
    () => searchSite(query, guides, wikiArticles),
    [query, guides, wikiArticles]
  );

  useEffect(() => {
    if (open) {
      void ensureWikiLoaded();
      inputRef.current?.focus();
    }
  }, [open, ensureWikiLoaded]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const pick = (r: SearchResult) => {
    setOpen(false);
    setQuery('');
    if (r.type === 'guide') {
      onNavigate('guides', { guideId: r.id });
    } else {
      onNavigate(r.navigateTo, { wikiId: r.id });
    }
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-ink-300 hover:text-gold-400 hover:bg-white/5 border border-transparent hover:border-gold-500/20 cursor-pointer transition-all"
        title="Поиск (Ctrl+K)"
      >
        <Search className="w-4 h-4 shrink-0" />
        <span className="hidden xl:inline text-xs text-ink-500">Поиск…</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[min(100vw-2rem,24rem)] bg-ink-900/98 backdrop-blur-md border border-gold-700/30 rounded-xl shadow-2xl z-[60] overflow-hidden animate-fadeIn">
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-ink-700/40">
            <Search className="w-4 h-4 text-gold-400 shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Гайды и разделы wiki…"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-ink-500 focus:outline-none min-w-0"
            />
            <button type="button" onClick={() => setOpen(false)} className="p-1 text-ink-500 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="max-h-72 overflow-y-auto py-1">
            {query.trim().length < 2 ? (
              <p className="px-4 py-6 text-ink-500 text-xs text-center">Введите минимум 2 символа</p>
            ) : results.length === 0 ? (
              <p className="px-4 py-6 text-ink-500 text-xs text-center">Ничего не найдено</p>
            ) : (
              results.map(r => (
                <button
                  key={`${r.type}-${r.id}`}
                  type="button"
                  onClick={() => pick(r)}
                  className="w-full flex items-start gap-3 px-4 py-2.5 text-left hover:bg-gold-400/5 cursor-pointer transition-colors"
                >
                  <span className="text-lg shrink-0">{r.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {r.type === 'guide' ? (
                        <BookOpen className="w-3 h-3 text-gold-400 shrink-0" />
                      ) : (
                        <FileText className="w-3 h-3 text-jade-400 shrink-0" />
                      )}
                      <span className="text-sm text-white font-medium truncate">{r.title}</span>
                    </div>
                    <p className="text-[11px] text-ink-500 truncate mt-0.5">
                      {r.type === 'guide' ? 'Гайд' : r.sectionLabel} · {r.summary}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
          <p className="px-3 py-1.5 text-[10px] text-ink-600 border-t border-ink-800/50 text-center">Ctrl+K</p>
        </div>
      )}
    </div>
  );
}
