import { useMemo, useState } from 'react';
import { Search, Sparkles, BookOpen, TrendingUp, ExternalLink, ChevronDown } from 'lucide-react';
import {
  innerWays,
  innerPathOrder,
  getPathMeta,
  innerPathIntroRu,
  innerPathExplainedRu,
  innerPathUpgradeRu,
  innerPathUpgradeTipsRu,
  innerWaysData,
  type InnerWay,
} from '../data/innerWays';

function InfoBlock({ title, body }: { title: string; body: string }) {
  const paragraphs = body.split(/\n\n+/).filter(Boolean);

  return (
    <div className="bg-ink-800/50 border border-ink-700/30 rounded-xl overflow-hidden">
      <div className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left border-b border-ink-700/30">
        <span className="font-serif font-bold text-white text-sm sm:text-base">{title}</span>
      </div>
      <div className="px-4 pb-4 space-y-2 pt-3">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-ink-300 text-sm leading-relaxed whitespace-pre-wrap">{p.replace(/^####\s+/gm, '')}</p>
        ))}
      </div>
    </div>
  );
}

function InnerWayCard({ item, expanded, onToggle }: { item: InnerWay; expanded: boolean; onToggle: () => void }) {
  const path = getPathMeta(item.pathEn);

  return (
    <article className="bg-ink-800/60 border border-ink-700/30 rounded-xl overflow-hidden card-hover transition-all">
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left p-4 sm:p-5 cursor-pointer hover:bg-ink-700/20 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-serif font-bold text-white text-base sm:text-lg">{item.nameRu || item.nameEn}</h3>
            <span className={`inline-flex items-center gap-1 mt-2 text-xs px-2.5 py-0.5 rounded-full border ${path.badgeClass}`}>
              <span>{path.icon}</span>
              <span>{path.labelRu}</span>
            </span>
          </div>
          <ChevronDown className={`w-5 h-5 text-gold-400 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
        {!expanded && (
          <p className="text-ink-400 text-xs mt-2 line-clamp-2">{item.effectRu || item.effect}</p>
        )}
      </button>

      {expanded && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3 border-t border-ink-700/30 pt-3">
          <div>
            <div className="flex items-center gap-1.5 text-gold-400 text-xs font-semibold uppercase tracking-wide mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Эффект
            </div>
            <p className="text-ink-200 text-sm leading-relaxed">{item.effectRu || item.effect}</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-jade-400 text-xs font-semibold uppercase tracking-wide mb-1">
              <BookOpen className="w-3.5 h-3.5" /> Как получить
            </div>
            <p className="text-ink-300 text-sm leading-relaxed">{item.howToGetRu || item.howToGet}</p>
          </div>
        </div>
      )}
    </article>
  );
}

export default function InnerPathSection() {
  const [filterPath, setFilterPath] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const paths = useMemo(() => {
    const set = new Set(innerWays.map(w => w.pathEn));
    return innerPathOrder.filter(p => set.has(p));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return innerWays.filter(w => {
      if (filterPath !== 'all' && w.pathEn !== filterPath) return false;
      if (!q) return true;
      const hay = `${w.nameEn} ${w.nameRu || ''} ${w.pathEn} ${w.effect} ${w.effectRu || ''} ${w.howToGet} ${w.howToGetRu || ''} ${getPathMeta(w.pathEn).labelRu}`.toLowerCase();
      return hay.includes(q);
    });
  }, [filterPath, search]);

  const countByPath = useMemo(() => {
    const map: Record<string, number> = {};
    for (const w of innerWays) map[w.pathEn] = (map[w.pathEn] ?? 0) + 1;
    return map;
  }, []);

  return (
    <section id="innerpath" className="py-20 bg-ink-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="text-gold-400 text-3xl mb-3">☯️</div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">Внутренний путь</h2>
          <p className="text-ink-300 max-w-2xl mx-auto">{innerPathIntroRu}</p>
          <p className="text-ink-500 text-xs mt-2">
            {innerWays.length} внутренних путей · данные с{' '}
            <a
              href={innerWaysData.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-500/80 hover:text-gold-400 inline-flex items-center gap-0.5"
            >
              Game8 <ExternalLink className="w-3 h-3" />
            </a>
          </p>
          <div className="mt-4 h-px max-w-xs mx-auto bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
        </div>

        {/* Объяснение механики */}
        <div className="mb-8">
          <h3 className="font-serif text-lg font-bold text-gold-400 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> Что такое внутренние пути
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {innerPathExplainedRu.map((block, i) => (
              <InfoBlock key={i} title={block.title} body={block.body} />
            ))}
          </div>
        </div>

        {/* Прокачка */}
        <div className="mb-10">
          <h3 className="font-serif text-lg font-bold text-gold-400 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> Как улучшать
          </h3>
          <div className="space-y-3 mb-4">
            {innerPathUpgradeRu.map((block, i) => (
              <InfoBlock key={i} title={`${i + 1}. ${block.title}`} body={block.body} />
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {innerPathUpgradeTipsRu.map((tip, i) => (
              <div key={i} className="bg-ink-800/40 border border-gold-400/15 rounded-xl p-4">
                <h4 className="text-gold-300 text-sm font-semibold mb-1">{tip.title}</h4>
                <p className="text-ink-400 text-xs leading-relaxed">{tip.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Фильтры и поиск */}
        <div className="mb-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-white">Список всех внутренних путей</h3>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по названию, эффекту…"
              className="w-full bg-ink-800/80 border border-ink-600/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilterPath('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                filterPath === 'all'
                  ? 'bg-gold-400/20 text-gold-400 border border-gold-400/40'
                  : 'bg-ink-800/50 text-ink-300 border border-ink-700/30 hover:text-gold-300'
              }`}
            >
              Все ({innerWays.length})
            </button>
            {paths.map(pathId => {
              const meta = getPathMeta(pathId);
              return (
                <button
                  key={pathId}
                  type="button"
                  onClick={() => setFilterPath(pathId)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    filterPath === pathId
                      ? 'bg-gold-400/20 text-gold-400 border border-gold-400/40'
                      : 'bg-ink-800/50 text-ink-300 border border-ink-700/30 hover:text-gold-300'
                  }`}
                >
                  {meta.icon} {meta.shortRu} ({countByPath[pathId] ?? 0})
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-ink-500 py-12">Ничего не найдено. Попробуйте другой запрос или фильтр.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {filtered.map(item => (
              <InnerWayCard
                key={item.id}
                item={item}
                expanded={expandedId === item.id}
                onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
