import { useState, useMemo } from 'react';
import { MapPin, ChevronDown, ChevronUp, MessageCircle, Gift } from 'lucide-react';
import WikiArticleCards from './wiki/WikiArticleCards';
import { npcs, npcTypeLabels, npcRegionLabels, type Npc, type NpcType } from '../data/npcData';

export default function NpcSection() {
  const [selected, setSelected] = useState<Npc | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [search, setSearch] = useState('');

  const types = [
    { id: 'all', label: 'Все типы', icon: '👥' },
    ...(Object.entries(npcTypeLabels) as [NpcType, { label: string; icon: string }][]).map(([id, v]) => ({
      id,
      label: v.label,
      icon: v.icon,
    })),
  ];

  const regions = useMemo(() => {
    const ids = [...new Set(npcs.map(n => n.region))];
    return [
      { id: 'all', label: 'Все регионы' },
      ...ids.map(id => ({ id, label: npcRegionLabels[id] || id })),
    ];
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return npcs.filter(n => {
      if (filterType !== 'all' && n.type !== filterType) return false;
      if (filterRegion !== 'all' && n.region !== filterRegion) return false;
      if (!q) return true;
      const hay = `${n.name} ${n.nameEn} ${n.location} ${n.description}`.toLowerCase();
      return hay.includes(q);
    });
  }, [filterType, filterRegion, search]);

  return (
    <section id="npcs" className="py-20 bg-ink-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-gold-400 text-3xl mb-3">👥</div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">NPC — Персонажи мира</h2>
          <p className="text-ink-300 max-w-2xl mx-auto">
            Друзья Цзянху (AI-чат), торговцы, мастера, квестовые и служебные NPC Where Winds Meet
          </p>
          <div className="mt-4 h-px max-w-xs mx-auto bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
        </div>

        <div className="bg-ink-800/50 border border-gold-400/20 rounded-xl p-5 mb-8 max-w-3xl mx-auto">
          <h3 className="font-serif text-lg font-bold text-gold-400 mb-3 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" /> Как отличить интерактивных NPC
          </h3>
          <ul className="space-y-2 text-sm text-ink-200">
            <li className="flex items-start gap-2">
              <span className="text-gold-400 shrink-0">•</span>
              <span><b>Друзья Цзянху (Old Friends)</b> — золотая метка на карте, иконка силуэта у имени, пункт «Подружиться» и AI-чат.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-400 shrink-0">•</span>
              <span><b>Репутация</b> — при статусе «Почитаемый» многие присылают еженедельные подарки.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-400 shrink-0">•</span>
              <span><b>Мини-игры</b> — Pitch Pot, рыбалка, стрельба, Gift of Gab, «Изящная мелодия» на гуцинь.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-400 shrink-0">•</span>
              <span><b>Обычные NPC</b> — квесты, торговля и обучение без AI; ниже в каталоге по типам.</span>
            </li>
          </ul>
        </div>

        <div className="mb-6 max-w-md mx-auto">
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по имени или локации…"
            className="w-full bg-ink-800/80 border border-ink-600/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/40"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {types.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setFilterType(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                filterType === t.id
                  ? 'bg-gold-400/20 text-gold-400 border border-gold-400/40'
                  : 'bg-ink-800/50 text-ink-300 border border-ink-700/30 hover:text-gold-300'
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {regions.map(r => (
            <button
              key={r.id}
              type="button"
              onClick={() => setFilterRegion(r.id)}
              className={`px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                filterRegion === r.id
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40'
                  : 'bg-ink-800/40 text-ink-400 border border-ink-700/30 hover:text-ink-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <p className="text-center text-ink-500 text-xs mb-4">
          Найдено: {filtered.length} из {npcs.length} · Редакторы могут добавлять записи кнопкой «Добавить» выше
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(npc => (
            <NpcCard
              key={npc.id}
              npc={npc}
              expanded={selected?.id === npc.id}
              onToggle={() => setSelected(selected?.id === npc.id ? null : npc)}
            />
          ))}
          <WikiArticleCards sectionId="npcs" />
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-ink-500 py-12">Ничего не найдено. Измените фильтры или поиск.</p>
        )}
      </div>
    </section>
  );
}

function NpcCard({
  npc,
  expanded,
  onToggle,
}: {
  npc: Npc;
  expanded: boolean;
  onToggle: () => void;
}) {
  const typeInfo = npcTypeLabels[npc.type];
  const regionLabel = npcRegionLabels[npc.region] || npc.region;

  return (
    <div
      onClick={onToggle}
      className={`bg-ink-800/60 border rounded-xl p-4 transition-all cursor-pointer ${
        expanded ? 'border-gold-400/40 bg-gold-400/5' : 'border-ink-700/30 hover:border-gold-700/30 card-hover'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-3xl shrink-0">{npc.icon}</span>
          <div className="min-w-0">
            <h3 className="font-serif font-bold text-white truncate">{npc.name}</h3>
            <p className="text-ink-400 text-xs truncate">{npc.nameEn}</p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gold-400 shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-ink-400 shrink-0" />
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-2">
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-400/10 text-gold-400 border border-gold-400/30">
          {typeInfo.icon} {typeInfo.label}
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-400/25">
          {regionLabel}
        </span>
      </div>

      <p className="text-ink-400 text-xs flex items-center gap-1 mb-2">
        <MapPin className="w-3 h-3 shrink-0" />
        {npc.location}
      </p>

      {!expanded && <p className="text-ink-300 text-sm line-clamp-2">{npc.description}</p>}

      {expanded && (
        <div className="mt-3 pt-3 border-t border-ink-700/30 space-y-2 text-sm animate-fadeIn" onClick={e => e.stopPropagation()}>
          <p className="text-ink-200">{npc.description}</p>
          {npc.howToInteract && (
            <p className="text-ink-300">
              <span className="text-gold-400 font-medium">Взаимодействие: </span>
              {npc.howToInteract}
            </p>
          )}
          {npc.rewards && (
            <p className="text-ink-300 flex items-start gap-1.5">
              <Gift className="w-4 h-4 text-jade-400 shrink-0 mt-0.5" />
              <span><span className="text-jade-400 font-medium">Награды: </span>{npc.rewards}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
