import { useState, useMemo, useCallback, type ReactNode, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronRight, Users, BookOpen, Plus, Edit3, Trash2,
  HelpCircle, Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RiddleDetailModal from './RiddleDetailModal';
import SectionEditorModal, { type SectionEditorValues } from './ui/SectionEditorModal';
import { sectionEditorConfigs } from '../data/sectionEditorConfig';
import { riddleHowToSteps, riddleEconomyTip } from '../data/riddles';
import { riddleRegionLabels, type RiddleClue, type RiddleMaster } from '../data/riddles';
import { mergeRiddleClues, mergeRiddleMasters } from '../lib/riddleList';
import {
  articleToEditorValues,
  clueToEditorValues,
  findWikiArticle,
  masterToEditorValues,
} from '../lib/riddleEditor';

type Tab = 'masters' | 'clues';
type ModalState =
  | { kind: 'master'; item: RiddleMaster }
  | { kind: 'clue'; item: RiddleClue };

type EditorState = {
  wikiId: string | null;
  hideBuiltinId?: string;
  initial: Partial<SectionEditorValues>;
};

const CLUE_PAGE = 120;

export default function RiddlesSection() {
  const {
    wikiArticles,
    siteSettings,
    isEditor,
    isAdmin,
    addWikiArticle,
    updateWikiArticle,
    deleteWikiArticle,
    updateSiteSettings,
  } = useAuth();

  const [tab, setTab] = useState<Tab>('clues');
  const [modal, setModal] = useState<ModalState | null>(null);
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [filterRegion, setFilterRegion] = useState('all');
  const [search, setSearch] = useState('');
  const [cluePage, setCluePage] = useState(0);

  const canEdit = isEditor() || isAdmin();
  const config = sectionEditorConfigs.riddles;
  const hiddenIds = siteSettings.riddlesHiddenIds ?? [];

  const masters = useMemo(
    () => mergeRiddleMasters(wikiArticles, hiddenIds, siteSettings.parsedContent?.riddles?.masters),
    [wikiArticles, hiddenIds, siteSettings.parsedContent?.riddles?.masters],
  );
  const clues = useMemo(
    () => mergeRiddleClues(wikiArticles, hiddenIds, siteSettings.parsedContent?.riddles?.clues),
    [wikiArticles, hiddenIds, siteSettings.parsedContent?.riddles?.clues],
  );

  const hideBuiltin = useCallback((id: string) => {
    if (hiddenIds.includes(id)) return;
    updateSiteSettings({ riddlesHiddenIds: [...hiddenIds, id] });
  }, [hiddenIds, updateSiteSettings]);

  const handleDelete = useCallback((item: RiddleMaster | RiddleClue) => {
    const label = 'clueEn' in item ? item.clueEn : item.nameRu;
    if (!confirm(`Удалить «${label}»?`)) return;
    if (item.wikiId) {
      deleteWikiArticle(item.wikiId);
    } else {
      hideBuiltin(item.id);
    }
    setModal(null);
  }, [deleteWikiArticle, hideBuiltin]);

  const openEdit = useCallback((item: RiddleMaster | RiddleClue) => {
    if (!config) return;
    if (item.wikiId) {
      const article = findWikiArticle(wikiArticles, item.wikiId);
      if (article) {
        setEditor({ wikiId: item.wikiId, initial: articleToEditorValues(article) });
        return;
      }
    }
    const initial = 'clueEn' in item ? clueToEditorValues(item) : masterToEditorValues(item);
    setEditor({
      wikiId: null,
      hideBuiltinId: item.wikiId ? undefined : item.id,
      initial,
    });
  }, [config, wikiArticles]);

  const handleEditorSave = (values: SectionEditorValues) => {
    if (!editor) return;
    const payload = {
      title: values.title,
      content: values.content,
      icon: values.icon,
      images: values.images,
      fields: { summary: values.summary, category: values.category },
    };
    if (editor.wikiId) {
      updateWikiArticle(editor.wikiId, payload);
    } else {
      if (editor.hideBuiltinId) hideBuiltin(editor.hideBuiltinId);
      addWikiArticle({ section: 'riddles', ...payload });
    }
    setEditor(null);
  };

  const filteredMasters = useMemo(() => {
    const q = search.trim().toLowerCase();
    return masters.filter(m => {
      if (filterRegion !== 'all' && m.region !== filterRegion) return false;
      if (!q) return true;
      const hay = `${m.nameRu} ${m.nameEn} ${m.locationTitle} ${m.subregion}`.toLowerCase();
      return hay.includes(q);
    });
  }, [masters, filterRegion, search]);

  const filteredClues = useMemo(() => {
    const q = search.trim().toLowerCase();
    return clues.filter(c => {
      if (!q) return true;
      return `${c.clueEn} ${c.answers.join(' ')}`.toLowerCase().includes(q);
    });
  }, [clues, search]);

  const clueSlice = useMemo(() => {
    const start = cluePage * CLUE_PAGE;
    return filteredClues.slice(start, start + CLUE_PAGE);
  }, [filteredClues, cluePage]);

  const cluePages = Math.max(1, Math.ceil(filteredClues.length / CLUE_PAGE));

  return (
    <section id="riddles" className="py-10 sm:py-12 bg-ink-900/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-end justify-between gap-3 mb-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
              <span>🧩</span> Загадки
            </h2>
            <p className="text-ink-500 text-xs mt-0.5">
              {masters.length} NPC · {clues.length} подсказок
            </p>
          </div>
          {canEdit && config && (
            <button
              type="button"
              onClick={() => setEditor({ wikiId: null, initial: { images: [], category: tab === 'masters' ? 'Загадочник' : 'Подсказка' } })}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gold-400/15 text-gold-400 text-xs hover:bg-gold-400/25 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Добавить
            </button>
          )}
        </header>

        <details className="mb-3 rounded-lg border border-ink-700/40 bg-ink-800/30 group">
          <summary className="px-3 py-2 text-xs text-ink-400 cursor-pointer hover:text-gold-300 flex items-center gap-1.5 list-none">
            <HelpCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Как решать · экономика монет</span>
          </summary>
          <div className="px-3 pb-3 border-t border-ink-700/30 pt-2">
            <ul className="space-y-1 text-[11px] text-ink-400">
              {riddleHowToSteps.map((s, i) => (
                <li key={i}><span className="text-ink-300">{s.title}.</span> {s.text}</li>
              ))}
            </ul>
            <p className="text-[10px] text-ink-500 mt-2">{riddleEconomyTip}</p>
          </div>
        </details>

        <div className="sticky top-16 md:top-20 z-10 mb-3 flex flex-wrap items-center gap-2 p-2 rounded-xl bg-ink-800/90 border border-ink-700/40 backdrop-blur-sm">
          <div className="flex rounded-lg overflow-hidden border border-ink-600/40 shrink-0">
            <TabBtn active={tab === 'clues'} onClick={() => { setTab('clues'); setCluePage(0); }}>
              <BookOpen className="w-3 h-3" /> Подсказки
            </TabBtn>
            <TabBtn active={tab === 'masters'} onClick={() => setTab('masters')}>
              <Users className="w-3 h-3" /> NPC
            </TabBtn>
          </div>
          <div className="flex-1 min-w-[140px] relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-500" />
            <input
              type="search"
              value={search}
              onChange={e => { setSearch(e.target.value); setCluePage(0); }}
              placeholder={tab === 'masters' ? 'Имя, место…' : 'Подсказка или ответ…'}
              className="w-full bg-ink-900/80 border border-ink-600/30 rounded-lg pl-8 pr-2 py-1.5 text-xs text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/40"
            />
          </div>
          <span className="text-[10px] text-ink-500 shrink-0 tabular-nums">
            {tab === 'masters' ? filteredMasters.length : filteredClues.length}
          </span>
        </div>

        {tab === 'masters' && (
          <div className="flex flex-wrap gap-1 mb-2">
            {(['all', 'qinghe', 'kaifeng', 'hexi'] as const).map(id => (
              <button
                key={id}
                type="button"
                onClick={() => setFilterRegion(id)}
                className={`px-2 py-0.5 rounded-full text-[10px] cursor-pointer transition-colors ${
                  filterRegion === id
                    ? 'bg-purple-500/25 text-purple-200 border border-purple-400/40'
                    : 'text-ink-500 border border-transparent hover:text-ink-300'
                }`}
              >
                {id === 'all' ? 'Все' : riddleRegionLabels[id]}
              </button>
            ))}
          </div>
        )}

        {tab === 'masters' ? (
          <ul className="rounded-lg border border-ink-700/40 divide-y divide-ink-700/25 overflow-hidden bg-ink-900/30">
            {filteredMasters.map(m => (
              <CompactMasterRow
                key={m.id}
                master={m}
                canEdit={canEdit}
                onOpen={() => setModal({ kind: 'master', item: m })}
                onEdit={() => openEdit(m)}
                onDelete={() => handleDelete(m)}
              />
            ))}
            {filteredMasters.length === 0 && (
              <li className="py-8 text-center text-ink-500 text-xs">Ничего не найдено</li>
            )}
          </ul>
        ) : (
          <>
            {!search.trim() && filteredClues.length > CLUE_PAGE && (
              <p className="text-[10px] text-ink-500 mb-2">
                Введите поиск или листайте страницы ({filteredClues.length} записей)
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
              {clueSlice.map(c => (
                <CompactClueCard
                  key={c.id}
                  clue={c}
                  canEdit={canEdit}
                  onOpen={() => setModal({ kind: 'clue', item: c })}
                  onEdit={() => openEdit(c)}
                  onDelete={() => handleDelete(c)}
                />
              ))}
            </div>
            {filteredClues.length === 0 && (
              <p className="py-8 text-center text-ink-500 text-xs">Ничего не найдено</p>
            )}
            {cluePages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-3">
                <button
                  type="button"
                  disabled={cluePage === 0}
                  onClick={() => setCluePage(p => p - 1)}
                  className="px-2 py-1 rounded text-[10px] text-ink-400 border border-ink-700/40 disabled:opacity-30 cursor-pointer"
                >
                  ←
                </button>
                <span className="text-[10px] text-ink-500 tabular-nums">
                  {cluePage + 1} / {cluePages}
                </span>
                <button
                  type="button"
                  disabled={cluePage >= cluePages - 1}
                  onClick={() => setCluePage(p => p + 1)}
                  className="px-2 py-1 rounded text-[10px] text-ink-400 border border-ink-700/40 disabled:opacity-30 cursor-pointer"
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {modal && createPortal(
        <RiddleDetailModal
          kind={modal.kind}
          item={modal.item}
          onClose={() => setModal(null)}
          canEdit={canEdit}
          onEdit={() => openEdit(modal.item)}
          onDelete={() => handleDelete(modal.item)}
        />,
        document.body,
      )}

      {editor && config && createPortal(
        <SectionEditorModal
          config={config}
          storageFolder="riddles"
          isEdit={!!editor.wikiId}
          initial={editor.initial}
          onSave={handleEditorSave}
          onCancel={() => setEditor(null)}
          layer="top"
        />,
        document.body,
      )}
    </section>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1 px-2.5 py-1.5 text-[11px] cursor-pointer transition-colors ${
        active ? 'bg-jade-500/25 text-jade-200' : 'text-ink-500 hover:text-ink-300'
      }`}
    >
      {children}
    </button>
  );
}

function RowActions({
  canEdit,
  onEdit,
  onDelete,
}: {
  canEdit: boolean;
  onEdit: (e: MouseEvent) => void;
  onDelete: (e: MouseEvent) => void;
}) {
  if (!canEdit) return null;
  return (
    <div className="flex shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
      <button type="button" onClick={onEdit} className="p-1 rounded text-gold-400 hover:bg-gold-400/10 cursor-pointer" aria-label="Редактировать">
        <Edit3 className="w-3 h-3" />
      </button>
      <button type="button" onClick={onDelete} className="p-1 rounded text-ink-500 hover:text-crimson-400 hover:bg-crimson-400/10 cursor-pointer" aria-label="Удалить">
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}

function CompactMasterRow({
  master,
  canEdit,
  onOpen,
  onEdit,
  onDelete,
}: {
  master: RiddleMaster;
  canEdit: boolean;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <li
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(); } }}
      className={`group flex items-center gap-2 px-2.5 py-1.5 cursor-pointer hover:bg-gold-400/5 transition-colors ${
        master.isCustom ? 'border-l-2 border-l-jade-400/40' : ''
      }`}
    >
      <span className="text-base shrink-0">{master.icon || '🧩'}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-white truncate">{master.nameRu}</p>
        <p className="text-[10px] text-ink-500 truncate">
          {master.locationTitle} · ×{master.intelligence} · {master.commerceCost}🪙
        </p>
      </div>
      <RowActions
        canEdit={canEdit}
        onEdit={e => { e.stopPropagation(); onEdit(); }}
        onDelete={e => { e.stopPropagation(); onDelete(); }}
      />
      <ChevronRight className="w-3.5 h-3.5 text-ink-600 shrink-0" />
    </li>
  );
}

function CompactClueCard({
  clue,
  canEdit,
  onOpen,
  onEdit,
  onDelete,
}: {
  clue: RiddleClue;
  canEdit: boolean;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const extra = clue.answers.length - 1;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(); } }}
      className={`group flex items-start gap-1 rounded-lg border border-ink-700/35 bg-ink-800/40 px-2 py-1.5 cursor-pointer hover:border-gold-600/30 hover:bg-ink-800/70 transition-colors ${
        clue.isCustom ? 'border-l-2 border-l-jade-400/40' : ''
      }`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white capitalize truncate leading-tight">{clue.clueEn}</p>
        <p className="text-[10px] text-gold-300/80 truncate">{clue.primaryAnswer}</p>
        {extra > 0 && <span className="text-[9px] text-ink-600">+{extra}</span>}
      </div>
      <RowActions
        canEdit={canEdit}
        onEdit={e => { e.stopPropagation(); onEdit(); }}
        onDelete={e => { e.stopPropagation(); onDelete(); }}
      />
    </div>
  );
}
