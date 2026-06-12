import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { MessageCircle, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NpcDetailModal from './NpcDetailModal';
import { aiChatGlobalTips, aiNpcRegionLabels, type AiNpc } from '../data/aiNpcs.meta';
import { mergeNpcList } from '../lib/npcList';

export default function NpcSection() {
  const { wikiArticles, siteSettings } = useAuth();
  const [modalNpc, setModalNpc] = useState<AiNpc | null>(null);
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [allNpcs, setAllNpcs] = useState<AiNpc[]>([]);

  useEffect(() => {
    let active = true;
    void mergeNpcList(wikiArticles, siteSettings.parsedContent?.npcLocations).then(list => {
      if (active) setAllNpcs(list);
    });
    return () => { active = false; };
  }, [wikiArticles, siteSettings.parsedContent?.npcLocations]);

  const regions: { id: string; label: string }[] = [
    { id: 'all', label: 'Все регионы' },
    { id: 'qinghe', label: aiNpcRegionLabels.qinghe },
    { id: 'kaifeng', label: aiNpcRegionLabels.kaifeng },
    { id: 'hexi', label: aiNpcRegionLabels.hexi },
  ];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allNpcs.filter(n => {
      if (filterRegion !== 'all' && n.region !== filterRegion) return false;
      if (!q) return true;
      const hay = `${n.nameRu} ${n.nameEn} ${n.locationTitle} ${n.subregion} ${n.locationDetail}`.toLowerCase();
      return hay.includes(q);
    });
  }, [allNpcs, filterRegion, search]);

  return (
    <section id="npcs" className="py-20 bg-ink-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="text-gold-400 text-3xl mb-3">👥</div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">NPC с AI-чатом</h2>
          <p className="text-ink-300 max-w-2xl mx-auto">
            {allNpcs.length} персонажей · нажмите на строку для локации и примера диалога
          </p>
          <div className="mt-4 h-px max-w-xs mx-auto bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
        </div>

        <div className="bg-ink-800/50 border border-gold-400/20 rounded-xl p-4 sm:p-5 mb-6 max-w-3xl mx-auto">
          <h3 className="font-serif text-base font-bold text-gold-400 mb-2 flex items-center gap-2">
            <MessageCircle className="w-4 h-4" /> Как дружить через AI-чат
          </h3>
          <ul className="space-y-1.5 text-xs sm:text-sm text-ink-300">
            {aiChatGlobalTips.slice(0, 4).map((tip, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-gold-500 shrink-0">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
          <p className="text-ink-500 text-[10px] mt-3">
            Новая запись: «Добавить» → имя на русском, в тексте укажите **Регион:**, **Место:**, **Подзона:**, **Как найти:**, раздел ## Диалоги с репликами **Игрок:** / **NPC:**
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4 max-w-3xl mx-auto">
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по имени или месту…"
            className="flex-1 bg-ink-800/80 border border-ink-600/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/40"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-4 max-w-3xl mx-auto">
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
          <span className="text-ink-500 text-xs self-center ml-auto sm:ml-2">
            {filtered.length} / {allNpcs.length}
          </span>
        </div>

        <div className="rounded-xl border border-ink-700/40 overflow-hidden bg-ink-900/40">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left border-collapse">
              <thead>
                <tr className="bg-ink-800/80 border-b border-gold-700/20 text-xs uppercase tracking-wide text-ink-400">
                  <th className="py-3 px-3 w-10" aria-hidden />
                  <th className="py-3 px-2 font-medium">Имя</th>
                  <th className="py-3 px-2 font-medium hidden sm:table-cell">Регион</th>
                  <th className="py-3 px-2 font-medium">Локация</th>
                  <th className="py-3 px-2 font-medium hidden md:table-cell">Подзона</th>
                  <th className="py-3 px-2 font-medium hidden lg:table-cell w-20">Диалог</th>
                  <th className="py-3 px-1 w-8" aria-hidden />
                </tr>
              </thead>
              <tbody>
                {filtered.map((npc, idx) => (
                  <tr
                    key={npc.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setModalNpc(npc)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setModalNpc(npc);
                      }
                    }}
                    className={`border-b border-ink-700/25 cursor-pointer transition-colors hover:bg-gold-400/5 ${
                      idx % 2 === 0 ? 'bg-ink-800/20' : 'bg-transparent'
                    } ${npc.isCustom ? 'border-l-2 border-l-jade-400/50' : ''}`}
                  >
                    <td className="py-2.5 px-3 text-center text-lg">{npc.icon}</td>
                    <td className="py-2.5 px-2">
                      <span className="text-sm font-medium text-white">{npc.nameRu}</span>
                      <span className="block text-[10px] text-ink-500">{npc.nameEn}</span>
                      <span className="sm:hidden block text-[10px] text-purple-300/80 mt-0.5">{npc.regionLabelRu}</span>
                    </td>
                    <td className="py-2.5 px-2 hidden sm:table-cell">
                      <span className="text-xs text-purple-300">{npc.regionLabelRu}</span>
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="text-xs text-ink-200 line-clamp-1">{npc.locationTitle}</span>
                    </td>
                    <td className="py-2.5 px-2 hidden md:table-cell">
                      <span className="text-xs text-ink-500 line-clamp-1">{npc.subregion}</span>
                    </td>
                    <td className="py-2.5 px-2 hidden lg:table-cell">
                      <span className="text-[10px] text-ink-400">
                        {npc.dialogues.length > 0 ? `${npc.dialogues.length} репл.` : '—'}
                      </span>
                    </td>
                    <td className="py-2.5 px-1 text-ink-500">
                      <ChevronRight className="w-4 h-4" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-ink-500 py-10 text-sm">Ничего не найдено</p>
          )}
        </div>
      </div>

      {modalNpc && createPortal(
        <NpcDetailModal npc={modalNpc} onClose={() => setModalNpc(null)} />,
        document.body,
      )}
    </section>
  );
}
