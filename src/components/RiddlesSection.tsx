import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Puzzle, ChevronRight, Users, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import WikiEditorBar from './wiki/WikiEditorBar';
import RiddleDetailModal from './RiddleDetailModal';
import { riddleHowToSteps, riddleEconomyTip } from '../data/riddles';
import { riddleRegionLabels, type RiddleClue, type RiddleMaster } from '../data/riddles';
import { mergeRiddleClues, mergeRiddleMasters } from '../lib/riddleList';

type Tab = 'masters' | 'clues';
type ModalState =
  | { kind: 'master'; item: RiddleMaster }
  | { kind: 'clue'; item: RiddleClue };

export default function RiddlesSection() {
  const { wikiArticles } = useAuth();
  const [tab, setTab] = useState<Tab>('clues');
  const [modal, setModal] = useState<ModalState | null>(null);
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [search, setSearch] = useState('');

  const masters = useMemo(() => mergeRiddleMasters(wikiArticles), [wikiArticles]);
  const clues = useMemo(() => mergeRiddleClues(wikiArticles), [wikiArticles]);

  const regions: { id: string; label: string }[] = [
    { id: 'all', label: 'Все регионы' },
    { id: 'qinghe', label: riddleRegionLabels.qinghe },
    { id: 'kaifeng', label: riddleRegionLabels.kaifeng },
    { id: 'hexi', label: riddleRegionLabels.hexi },
  ];

  const filteredMasters = useMemo(() => {
    const q = search.trim().toLowerCase();
    return masters.filter(m => {
      if (filterRegion !== 'all' && m.region !== filterRegion) return false;
      if (!q) return true;
      const hay = `${m.nameRu} ${m.nameEn} ${m.locationTitle} ${m.subregion} ${m.locationDetail}`.toLowerCase();
      return hay.includes(q);
    });
  }, [masters, filterRegion, search]);

  const filteredClues = useMemo(() => {
    const q = search.trim().toLowerCase();
    return clues.filter(c => {
      if (!q) return true;
      const hay = `${c.clueEn} ${c.answers.join(' ')}`.toLowerCase();
      return hay.includes(q);
    });
  }, [clues, search]);

  const count = tab === 'masters' ? filteredMasters.length : filteredClues.length;
  const total = tab === 'masters' ? masters.length : clues.length;

  return (
    <section id="riddles" className="py-20 bg-ink-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="text-gold-400 text-3xl mb-3">🧩</div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">Загадки</h2>
          <p className="text-ink-300 max-w-2xl mx-auto">
            {masters.length} загадочников · {clues.length} подсказок в справочнике
          </p>
          <div className="mt-4 h-px max-w-xs mx-auto bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
        </div>

        <div className="max-w-3xl mx-auto mb-6">
          <WikiEditorBar sectionId="riddles" />
        </div>

        <div className="bg-ink-800/50 border border-gold-400/20 rounded-xl p-4 sm:p-5 mb-6 max-w-3xl mx-auto">
          <h3 className="font-serif text-base font-bold text-gold-400 mb-2 flex items-center gap-2">
            <Puzzle className="w-4 h-4" /> Как решать загадки
          </h3>
          <ol className="space-y-2 text-xs sm:text-sm text-ink-300 list-decimal list-inside">
            {riddleHowToSteps.map((s, i) => (
              <li key={i}>
                <span className="font-medium text-ink-200">{s.title}.</span> {s.text}
              </li>
            ))}
          </ol>
          <p className="text-ink-500 text-[10px] mt-3">{riddleEconomyTip}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 max-w-3xl mx-auto">
          <button
            type="button"
            onClick={() => setTab('clues')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm transition-all cursor-pointer ${
              tab === 'clues'
                ? 'bg-jade-500/20 text-jade-200 border border-jade-400/40'
                : 'bg-ink-800/40 text-ink-400 border border-ink-700/30 hover:text-ink-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Справочник подсказок
          </button>
          <button
            type="button"
            onClick={() => setTab('masters')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm transition-all cursor-pointer ${
              tab === 'masters'
                ? 'bg-jade-500/20 text-jade-200 border border-jade-400/40'
                : 'bg-ink-800/40 text-ink-400 border border-ink-700/30 hover:text-ink-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Загадочники на карте
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4 max-w-3xl mx-auto">
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={tab === 'masters' ? 'Поиск по имени или месту…' : 'Подсказка или ответ…'}
            className="flex-1 bg-ink-800/80 border border-ink-600/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/40"
          />
        </div>

        {tab === 'masters' && (
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
          </div>
        )}

        <p className="text-ink-500 text-xs mb-3 max-w-3xl mx-auto">
          {count} / {total}
          {tab === 'clues' && search.trim() && count === 0 && (
            <span className="text-ink-400"> — попробуйте другое слово подсказки</span>
          )}
        </p>

        <div className="rounded-xl border border-ink-700/40 overflow-hidden bg-ink-900/40">
          <div className="overflow-x-auto">
            {tab === 'masters' ? (
              <table className="w-full min-w-[720px] text-left border-collapse">
                <thead>
                  <tr className="bg-ink-800/80 border-b border-gold-700/20 text-xs uppercase tracking-wide text-ink-400">
                    <th className="py-3 px-3 w-10" aria-hidden />
                    <th className="py-3 px-2 font-medium">Имя</th>
                    <th className="py-3 px-2 font-medium hidden sm:table-cell">Регион</th>
                    <th className="py-3 px-2 font-medium">Локация</th>
                    <th className="py-3 px-2 font-medium hidden md:table-cell">Интеллект</th>
                    <th className="py-3 px-2 font-medium hidden lg:table-cell">Стоимость</th>
                    <th className="py-3 px-1 w-8" aria-hidden />
                  </tr>
                </thead>
                <tbody>
                  {filteredMasters.map((m, idx) => (
                    <MasterRow
                      key={m.id}
                      master={m}
                      idx={idx}
                      onOpen={() => setModal({ kind: 'master', item: m })}
                    />
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full min-w-[640px] text-left border-collapse">
                <thead>
                  <tr className="bg-ink-800/80 border-b border-gold-700/20 text-xs uppercase tracking-wide text-ink-400">
                    <th className="py-3 px-3 font-medium">Подсказка</th>
                    <th className="py-3 px-2 font-medium">Основной ответ</th>
                    <th className="py-3 px-2 font-medium hidden sm:table-cell w-24">Варианты</th>
                    <th className="py-3 px-1 w-8" aria-hidden />
                  </tr>
                </thead>
                <tbody>
                  {filteredClues.slice(0, 500).map((c, idx) => (
                    <ClueRow
                      key={c.id}
                      clue={c}
                      idx={idx}
                      onOpen={() => setModal({ kind: 'clue', item: c })}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {tab === 'clues' && filteredClues.length > 500 && (
            <p className="text-center text-ink-500 py-3 text-xs border-t border-ink-700/30">
              Показаны первые 500 из {filteredClues.length} — уточните поиск
            </p>
          )}
          {count === 0 && (
            <p className="text-center text-ink-500 py-10 text-sm">Ничего не найдено</p>
          )}
        </div>

        <p className="text-ink-600 text-[10px] text-center mt-4 max-w-xl mx-auto">
          Своя запись: «Добавить» → для подсказки укажите ## Подсказка и ## Ответы; для NPC — категорию «Загадочник» и поля **Место:**, **Интеллект:**, **Стоимость:**
        </p>
      </div>

      {modal && createPortal(
        <RiddleDetailModal
          kind={modal.kind}
          item={modal.item}
          onClose={() => setModal(null)}
        />,
        document.body,
      )}
    </section>
  );
}

function MasterRow({
  master,
  idx,
  onOpen,
}: {
  master: RiddleMaster;
  idx: number;
  onOpen: () => void;
}) {
  return (
    <tr
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
      className={`border-b border-ink-700/25 cursor-pointer transition-colors hover:bg-gold-400/5 ${
        idx % 2 === 0 ? 'bg-ink-800/20' : 'bg-transparent'
      } ${master.isCustom ? 'border-l-2 border-l-jade-400/50' : ''}`}
    >
      <td className="py-2.5 px-3 text-center text-lg">{master.icon || '🧩'}</td>
      <td className="py-2.5 px-2">
        <span className="text-sm font-medium text-white">{master.nameRu}</span>
        <span className="block text-[10px] text-ink-500">{master.nameEn}</span>
      </td>
      <td className="py-2.5 px-2 hidden sm:table-cell">
        <span className="text-xs text-purple-300">{master.regionLabelRu}</span>
      </td>
      <td className="py-2.5 px-2">
        <span className="text-xs text-ink-200 line-clamp-1">{master.locationTitle}</span>
      </td>
      <td className="py-2.5 px-2 hidden md:table-cell text-xs text-ink-300">×{master.intelligence}</td>
      <td className="py-2.5 px-2 hidden lg:table-cell text-xs text-ink-400">{master.commerceCost}</td>
      <td className="py-2.5 px-1 text-ink-500">
        <ChevronRight className="w-4 h-4" />
      </td>
    </tr>
  );
}

function ClueRow({
  clue,
  idx,
  onOpen,
}: {
  clue: RiddleClue;
  idx: number;
  onOpen: () => void;
}) {
  const extra = Math.max(0, clue.answers.length - 1);
  return (
    <tr
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
      className={`border-b border-ink-700/25 cursor-pointer transition-colors hover:bg-gold-400/5 ${
        idx % 2 === 0 ? 'bg-ink-800/20' : 'bg-transparent'
      } ${clue.isCustom ? 'border-l-2 border-l-jade-400/50' : ''}`}
    >
      <td className="py-2.5 px-3">
        <span className="text-sm text-white capitalize">{clue.clueEn}</span>
      </td>
      <td className="py-2.5 px-2">
        <span className="text-xs text-gold-200/90 line-clamp-2">{clue.primaryAnswer || '—'}</span>
      </td>
      <td className="py-2.5 px-2 hidden sm:table-cell text-[10px] text-ink-500">
        {extra > 0 ? `+${extra}` : '—'}
      </td>
      <td className="py-2.5 px-1 text-ink-500">
        <ChevronRight className="w-4 h-4" />
      </td>
    </tr>
  );
}
