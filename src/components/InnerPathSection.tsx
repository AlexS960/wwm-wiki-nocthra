import { useMemo, useState } from 'react';
import { Search, Sparkles, BookOpen, TrendingUp, ChevronDown, Edit3, Trash2, Plus } from 'lucide-react';
import {
  innerWays,
  innerPathOrder,
  resolvePathMeta,
  innerPathIntroRu,
  innerPathExplainedRu,
  innerPathUpgradeRu,
  innerPathUpgradeTipsRu,
  type InnerWay,
} from '../data/innerWays';
import { useSectionOverrides } from '../hooks/useSectionOverrides';
import { useSectionCategories } from '../hooks/useSectionCategories';
import SectionHeader from './ui/SectionHeader';
import SectionFilterBar from './ui/SectionFilterBar';
import SectionEditorModal, { type SectionEditorValues } from './ui/SectionEditorModal';
import { sectionEditorConfigs } from '../data/sectionEditorConfig';

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

function InnerWayCard({
  item,
  pathLabel,
  pathIcon,
  pathBadgeClass,
  expanded,
  onToggle,
  canManage,
  onEdit,
  onDelete,
}: {
  item: InnerWay;
  pathLabel: string;
  pathIcon: string;
  pathBadgeClass: string;
  expanded: boolean;
  onToggle: () => void;
  canManage: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="relative bg-ink-800/60 border border-ink-700/30 rounded-xl overflow-hidden card-hover transition-all">
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
        className="w-full text-left p-4 sm:p-5 cursor-pointer hover:bg-ink-700/20 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-serif font-bold text-white text-base sm:text-lg">{item.nameRu || item.nameEn}</h3>
            <span className={`inline-flex items-center gap-1 mt-2 text-xs px-2.5 py-0.5 rounded-full border ${pathBadgeClass}`}>
              <span>{pathIcon}</span>
              <span>{pathLabel}</span>
            </span>
          </div>
          <ChevronDown className={`w-5 h-5 text-gold-400 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''} ${canManage ? 'mr-14' : ''}`} />
        </div>
        {!expanded && (
          <p className="text-ink-400 text-xs mt-2 line-clamp-2">{item.effectRu || item.effect}</p>
        )}
      </div>
      {canManage && (
        <div className="absolute top-3 right-3 flex items-center gap-1 z-10" onClick={e => e.stopPropagation()}>
          <button onClick={onEdit} className="p-1.5 rounded-md text-gold-300 border border-gold-400/30 hover:bg-gold-400/10 cursor-pointer" title="Редактировать">
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button onClick={onDelete} className="p-1.5 rounded-md text-crimson-300 border border-crimson-400/30 hover:bg-crimson-400/10 cursor-pointer" title="Удалить">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

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
  const [editId, setEditId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const { items, persistItems, canManage } = useSectionOverrides('innerpath', innerWays);
  const { categories } = useSectionCategories('innerpath');
  const innerConfig = sectionEditorConfigs.innerpath;
  const editingItem = editId ? items.find(x => x.id === editId) : null;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter(w => {
      if (filterPath !== 'all' && w.pathEn !== filterPath) return false;
      if (!q) return true;
      const path = resolvePathMeta(w.pathEn, categories);
      const hay = `${w.nameEn} ${w.nameRu || ''} ${path.labelRu} ${w.effect} ${w.effectRu || ''} ${w.howToGet} ${w.howToGetRu || ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, filterPath, search, categories]);

  const sortedFiltered = useMemo(() => {
    const order: string[] = [...innerPathOrder, ...categories.map(c => c.id)];
    const rank = (pathEn: string) => {
      const idx = order.indexOf(pathEn);
      return idx >= 0 ? idx : 999;
    };
    return [...filtered].sort((a, b) => rank(a.pathEn) - rank(b.pathEn) || (a.nameRu || a.nameEn).localeCompare(b.nameRu || b.nameEn, 'ru'));
  }, [filtered, categories]);

  const defaultPathId = categories[0]?.id || innerPathOrder[0];

  return (
    <section id="innerpath" className="py-20 bg-ink-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          sectionId="innerpath"
          icon="☯️"
          title="Внутренний путь"
          subtitle={innerPathIntroRu}
        />

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

        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="font-serif text-lg font-bold text-white">Список всех внутренних путей</h3>
            {canManage && (
              <button
                type="button"
                onClick={() => setShowAdd(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gold-400/15 text-gold-300 text-xs border border-gold-400/30 hover:bg-gold-400/25 cursor-pointer self-start"
              >
                <Plus className="w-3.5 h-3.5" /> Добавить запись
              </button>
            )}
          </div>
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
          <SectionFilterBar
            sectionKey="innerpath"
            items={items}
            getCategoryId={w => w.pathEn}
            active={filterPath}
            onChange={setFilterPath}
          />
        </div>

        {sortedFiltered.length === 0 ? (
          <p className="text-center text-ink-500 py-12">Ничего не найдено. Попробуйте другой запрос или фильтр.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {sortedFiltered.map(item => {
              const path = resolvePathMeta(item.pathEn, categories);
              return (
                <InnerWayCard
                  key={item.id}
                  item={item}
                  pathLabel={path.labelRu}
                  pathIcon={path.icon}
                  pathBadgeClass={path.badgeClass}
                  expanded={expandedId === item.id}
                  onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  canManage={canManage}
                  onEdit={() => setEditId(item.id)}
                  onDelete={() => {
                    if (!confirm('Удалить эту запись внутреннего пути?')) return;
                    persistItems(items.filter(x => x.id !== item.id));
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      {(editingItem || showAdd) && innerConfig && (
        <SectionEditorModal
          config={innerConfig}
          storageFolder="innerpath"
          isEdit={!!editingItem}
          categoryOptions={categories}
          initial={editingItem ? {
            title: editingItem.nameRu || editingItem.nameEn,
            summary: editingItem.effectRu || editingItem.effect,
            category: editingItem.pathEn,
            icon: resolvePathMeta(editingItem.pathEn, categories).icon,
            content: ['## Эффект', editingItem.effectRu || editingItem.effect, '', '## Как получить', editingItem.howToGetRu || editingItem.howToGet].join('\n'),
            images: [],
          } : {
            category: defaultPathId,
            icon: categories[0]?.icon || '✦',
            images: [],
          }}
          onSave={(values: SectionEditorValues) => {
            const lines = values.content.split('\n').map(l => l.trim());
            const read = (header: string) => {
              const idx = lines.findIndex(l => l.toLowerCase() === header.toLowerCase());
              return idx >= 0 ? (lines[idx + 1] || '') : '';
            };
            if (editingItem) {
              persistItems(items.map(x => (
                x.id === editingItem.id
                  ? {
                      ...x,
                      nameRu: values.title,
                      pathEn: values.category,
                      effectRu: values.summary || read('## Эффект') || x.effectRu,
                      howToGetRu: read('## Как получить') || x.howToGetRu,
                    }
                  : x
              )));
              setEditId(null);
            } else {
              const id = `iw-custom-${Date.now()}`;
              persistItems([...items, {
                id,
                nameEn: values.title,
                nameRu: values.title,
                pathEn: values.category,
                effect: values.summary || read('## Эффект') || '',
                effectRu: values.summary || read('## Эффект') || '',
                howToGet: read('## Как получить') || '',
                howToGetRu: read('## Как получить') || '',
              }]);
              setShowAdd(false);
            }
          }}
          onCancel={() => { setEditId(null); setShowAdd(false); }}
        />
      )}
    </section>
  );
}
