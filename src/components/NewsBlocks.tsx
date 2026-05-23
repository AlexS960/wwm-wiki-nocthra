import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit3, Trash2, RefreshCw, ExternalLink, Newspaper, Globe } from 'lucide-react';
import { useAuth, type SiteNewsItem } from '../context/AuthContext';
import { fetchGameNews, type GameNewsItem } from '../lib/gameNews';
import SectionEditorModal, { type SectionEditorValues } from './ui/SectionEditorModal';
import { sectionEditorConfigs } from '../data/sectionEditorConfig';

const siteNewsConfig = {
  titleNew: 'Новость сайта',
  titleEdit: 'Редактировать новость',
  publishLabel: 'Опубликовать',
  summaryLabel: 'Краткое описание',
  summaryPlaceholder: 'Анонс в 1-2 предложения',
  titlePlaceholder: 'Заголовок новости',
  contentPlaceholder: '## Текст новости\n\nПодробности…',
  categories: ['Обновление', 'Событие', 'Гильдия', 'Сайт', 'Прочее'],
  icons: ['📢', '🎉', '🌙', '⚔️', '💡', '📜', '⭐', '🔥'],
  contentHint: '(## для заголовков, - для списков)',
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return iso;
  }
}

export default function NewsBlocks() {
  const { siteNews, isEditor, isAdmin, addSiteNews, updateSiteNews, deleteSiteNews } = useAuth();
  const canManageSiteNews = isEditor() || isAdmin();

  const [gameNews, setGameNews] = useState<GameNewsItem[]>([]);
  const [gameLoading, setGameLoading] = useState(true);
  const [gameError, setGameError] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingNews, setEditingNews] = useState<SiteNewsItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadGameNews = useCallback(async (force = false) => {
    setGameLoading(true);
    setGameError(false);
    try {
      const items = await fetchGameNews(force);
      setGameNews(items);
      if (items.length === 0) setGameError(true);
    } catch {
      setGameError(true);
    } finally {
      setGameLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGameNews();
    const iv = setInterval(() => loadGameNews(), 60 * 60 * 1000);
    return () => clearInterval(iv);
  }, [loadGameNews]);

  const handleSaveSiteNews = (values: SectionEditorValues) => {
    if (editingNews) {
      updateSiteNews(editingNews.id, {
        title: values.title,
        summary: values.summary,
        content: values.content,
        category: values.category,
        icon: values.icon,
      });
    } else {
      addSiteNews({
        title: values.title,
        summary: values.summary,
        content: values.content,
        category: values.category,
        icon: values.icon,
      });
    }
    setShowEditor(false);
    setEditingNews(null);
  };

  return (
    <>
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {/* Game news */}
        <div className="bg-ink-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl overflow-hidden flex flex-col min-h-[280px]">
          <div className="px-4 py-3 border-b border-purple-500/15 flex items-center justify-between bg-purple-950/30">
            <h3 className="font-serif font-bold text-purple-200 flex items-center gap-2 text-sm">
              <Globe className="w-4 h-4 text-purple-400" />
              Новости по игре
            </h3>
            <button
              type="button"
              onClick={() => loadGameNews(true)}
              disabled={gameLoading}
              className="p-1.5 rounded-lg text-purple-400/70 hover:text-purple-300 hover:bg-purple-500/10 cursor-pointer disabled:opacity-50"
              title="Обновить с официального сайта"
            >
              <RefreshCw className={`w-4 h-4 ${gameLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[320px]">
            {gameLoading && gameNews.length === 0 ? (
              <p className="text-ink-500 text-sm text-center py-8">Загрузка новостей…</p>
            ) : gameError && gameNews.length === 0 ? (
              <p className="text-ink-500 text-sm text-center py-8">Не удалось загрузить. Попробуйте обновить.</p>
            ) : (
              gameNews.slice(0, 8).map(item => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-xl bg-ink-800/40 border border-purple-500/10 hover:border-purple-400/30 hover:bg-purple-950/20 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] text-purple-400/70">{item.date}</span>
                      <p className="text-sm text-ink-100 font-medium mt-0.5 line-clamp-2 group-hover:text-purple-200 transition-colors">
                        {item.title}
                      </p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-purple-500/50 shrink-0 mt-1" />
                  </div>
                </a>
              ))
            )}
          </div>
          <p className="text-[10px] text-ink-600 px-4 py-2 border-t border-purple-500/10 text-center">
            Источник: wherewindsmeetgame.com
          </p>
        </div>

        {/* Site news */}
        <div className="bg-ink-900/50 backdrop-blur-sm border border-gold-700/25 rounded-2xl overflow-hidden flex flex-col min-h-[280px]">
          <div className="px-4 py-3 border-b border-gold-700/15 flex items-center justify-between bg-gold-900/10">
            <h3 className="font-serif font-bold text-gold-300 flex items-center gap-2 text-sm">
              <Newspaper className="w-4 h-4 text-gold-400" />
              Новости сайта
            </h3>
            {canManageSiteNews && (
              <button
                type="button"
                onClick={() => { setEditingNews(null); setShowEditor(true); }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-gold-400 border border-gold-500/30 hover:bg-gold-400/10 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Добавить
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[320px]">
            {siteNews.length === 0 ? (
              <p className="text-ink-500 text-sm text-center py-8">Пока нет новостей</p>
            ) : (
              siteNews.slice(0, 8).map(item => (
                <SiteNewsCard
                  key={item.id}
                  item={item}
                  canEdit={canManageSiteNews}
                  onEdit={() => { setEditingNews(item); setShowEditor(true); }}
                  onDelete={() => setDeleteId(item.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {showEditor && (
        <SectionEditorModal
          config={siteNewsConfig}
          isEdit={!!editingNews}
          initial={editingNews ? {
            title: editingNews.title,
            summary: editingNews.summary,
            content: editingNews.content,
            category: editingNews.category,
            icon: editingNews.icon,
          } : undefined}
          onSave={handleSaveSiteNews}
          onCancel={() => { setShowEditor(false); setEditingNews(null); }}
        />
      )}

      {deleteId && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-fadeIn">
          <div className="absolute inset-0 bg-black/70" onClick={() => setDeleteId(null)} />
          <div className="relative bg-ink-800 border border-crimson-400/30 rounded-xl p-6 max-w-sm w-full">
            <h3 className="font-serif text-lg text-white font-bold mb-2">Удалить новость?</h3>
            <p className="text-ink-300 text-sm mb-4">Это действие нельзя отменить.</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { deleteSiteNews(deleteId); setDeleteId(null); }}
                className="flex-1 bg-crimson-400/20 text-crimson-400 py-2 rounded-lg font-medium hover:bg-crimson-400/30 cursor-pointer"
              >
                Удалить
              </button>
              <button type="button" onClick={() => setDeleteId(null)} className="flex-1 bg-ink-700 text-ink-300 py-2 rounded-lg hover:bg-ink-600 cursor-pointer">
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SiteNewsCard({
  item,
  canEdit,
  onEdit,
  onDelete,
}: {
  item: SiteNewsItem;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="p-3 rounded-xl bg-ink-800/40 border border-gold-700/15 hover:border-gold-600/25 transition-all">
      <div className="flex items-start gap-2">
        <span className="text-lg shrink-0">{item.icon}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-gold-500/70">{formatDate(item.updatedAt)}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gold-400/10 text-gold-400 border border-gold-400/20">{item.category}</span>
          </div>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-ink-100 font-medium mt-0.5 text-left hover:text-gold-300 cursor-pointer w-full"
          >
            {item.title}
          </button>
          {item.summary && !expanded && <p className="text-xs text-ink-500 mt-0.5 line-clamp-1">{item.summary}</p>}
          {expanded && (
            <div className="mt-2 text-xs text-ink-300 space-y-1">
              {item.summary && <p className="text-ink-400">{item.summary}</p>}
              {item.content.split('\n').map((line, i) => {
                if (line.startsWith('## ')) return <p key={i} className="font-semibold text-gold-400 mt-2">{line.replace('## ', '')}</p>;
                if (line.startsWith('- ')) return <p key={i}>• {line.replace('- ', '')}</p>;
                if (line.trim()) return <p key={i}>{line}</p>;
                return null;
              })}
            </div>
          )}
        </div>
        {canEdit && (
          <div className="flex gap-0.5 shrink-0">
            <button type="button" onClick={onEdit} className="p-1.5 text-gold-400 hover:bg-gold-400/10 rounded-lg cursor-pointer">
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button type="button" onClick={onDelete} className="p-1.5 text-ink-500 hover:text-crimson-400 hover:bg-crimson-400/10 rounded-lg cursor-pointer">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
