import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Edit3, Trash2, Newspaper, Heart, X } from 'lucide-react';
import { useAuth, type SiteNewsItem } from '../context/AuthContext';
import SectionEditorModal, { type SectionEditorValues } from './ui/SectionEditorModal';
import AppModal from './ui/AppModal';
import MarkdownBody from './MarkdownBody';

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
  const {
    siteNews, user, isEditor, isAdmin,
    addSiteNews, updateSiteNews, deleteSiteNews, toggleSiteNewsLike,
  } = useAuth();
  const canManageSiteNews = isEditor() || isAdmin();

  const sortedNews = useMemo(
    () => [...siteNews].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [siteNews],
  );

  const [showEditor, setShowEditor] = useState(false);
  const [editingNews, setEditingNews] = useState<SiteNewsItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<SiteNewsItem | null>(null);
  const [likeError, setLikeError] = useState<string | null>(null);
  const [liking, setLiking] = useState(false);

  const handleSaveSiteNews = (values: SectionEditorValues) => {
    if (editingNews) {
      updateSiteNews(editingNews.id, {
        title: values.title,
        summary: values.summary,
        content: values.content,
        category: values.category,
        icon: values.icon,
        images: values.images,
      });
    } else {
      addSiteNews({
        title: values.title,
        summary: values.summary,
        content: values.content,
        category: values.category,
        icon: values.icon,
        images: values.images,
      });
    }
    setShowEditor(false);
    setEditingNews(null);
  };

  const handleLike = async (newsId: string) => {
    if (!user) return;
    setLiking(true);
    setLikeError(null);
    const err = await toggleSiteNewsLike(newsId);
    setLiking(false);
    if (err) setLikeError(err);
  };

  const editorModal = showEditor && (
    <SectionEditorModal
      config={siteNewsConfig}
      storageFolder="news"
      layer="top"
      isEdit={!!editingNews}
      initial={editingNews ? {
        title: editingNews.title,
        summary: editingNews.summary,
        content: editingNews.content,
        category: editingNews.category,
        icon: editingNews.icon,
        images: editingNews.images || [],
      } : { images: [] }}
      onSave={handleSaveSiteNews}
      onCancel={() => { setShowEditor(false); setEditingNews(null); }}
    />
  );

  const liveView = viewItem ? siteNews.find(n => n.id === viewItem.id) ?? viewItem : null;

  return (
    <>
      <div className="w-full mt-6">
        <div className="surface-panel backdrop-blur-sm border accent-border-subtle border rounded-2xl overflow-hidden flex flex-col min-h-[340px]">
          <div className="px-4 py-3 border-b accent-border-subtle border-b flex items-center justify-between bg-gold-900/10">
            <h3 className="font-serif font-bold text-gold-300 flex items-center gap-2 text-sm sm:text-base">
              <Newspaper className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400" />
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
          <div className="scroll-area flex-1 p-3 sm:p-4 max-h-[min(540px,62vh)]">
            {sortedNews.length === 0 ? (
              <p className="text-ink-500 text-sm text-center py-10">Пока нет новостей</p>
            ) : (
              <div className="flex flex-col gap-3 w-full">
                {sortedNews.map(item => (
                  <SiteNewsCard
                    key={item.id}
                    item={item}
                    canEdit={canManageSiteNews}
                    onOpen={() => setViewItem(item)}
                    onEdit={() => { setEditingNews(item); setShowEditor(true); }}
                    onDelete={() => setDeleteId(item.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {editorModal && createPortal(editorModal, document.body)}

      {liveView && createPortal(
        <AppModal open onClose={() => { setViewItem(null); setLikeError(null); }} layer="top" className="max-w-2xl w-full">
          <div className="bg-ink-800 border border-gold-700/30 rounded-2xl p-5 sm:p-6 max-h-[85vh] overflow-y-auto relative">
            <button
              type="button"
              onClick={() => { setViewItem(null); setLikeError(null); }}
              className="absolute top-3 right-3 p-2 rounded-lg text-ink-400 hover:text-white hover:bg-ink-700/60 cursor-pointer z-10"
              aria-label="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-start gap-3 mb-4 pr-10">
              <span className="text-3xl shrink-0">{liveView.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs text-gold-500/80">{formatDate(liveView.updatedAt)}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-400/10 text-gold-400 border border-gold-400/30">
                    {liveView.category}
                  </span>
                </div>
                <h2 className="font-serif text-xl font-bold text-white">{liveView.title}</h2>
                {liveView.summary && <p className="text-ink-400 text-sm mt-2">{liveView.summary}</p>}
                <p className="text-ink-500 text-xs mt-1">{liveView.authorName}</p>
              </div>
            </div>

            <MarkdownBody content={liveView.content} images={liveView.images} />

            <div className="mt-6 pt-4 border-t border-ink-700/40 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={!user || liking}
                onClick={() => handleLike(liveView.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  user && (liveView.likes || []).includes(user.id)
                    ? 'bg-crimson-400/15 text-crimson-400 border border-crimson-400/30'
                    : 'bg-ink-700/50 text-ink-300 border border-ink-600/40 hover:text-crimson-300 hover:border-crimson-400/30'
                }`}
              >
                <Heart className={`w-4 h-4 ${user && (liveView.likes || []).includes(user.id) ? 'fill-current' : ''}`} />
                {(liveView.likes || []).length}
              </button>
              {!user && <span className="text-ink-500 text-xs">Войдите, чтобы поставить лайк</span>}
              {likeError && <span className="text-crimson-400 text-xs flex-1 text-right">{likeError}</span>}
            </div>
          </div>
        </AppModal>,
        document.body,
      )}

      {deleteId && createPortal(
        <AppModal open onClose={() => setDeleteId(null)} layer="top" mobileSheet={false} className="max-w-sm">
          <div className="bg-ink-800 border border-crimson-400/30 rounded-2xl p-6 w-full mx-4">
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
        </AppModal>,
        document.body,
      )}
    </>
  );
}

function SiteNewsCard({
  item,
  canEdit,
  onOpen,
  onEdit,
  onDelete,
}: {
  item: SiteNewsItem;
  canEdit: boolean;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const likeCount = (item.likes || []).length;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
      className="w-full p-3 sm:p-4 rounded-xl surface-card-subtle surface-card-hover border transition-all flex flex-col cursor-pointer"
    >
      <div className="flex items-start gap-3 w-full">
        <span className="text-lg shrink-0">{item.icon}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-gold-500/70">{formatDate(item.updatedAt)}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gold-400/10 text-gold-400 border border-gold-400/20">{item.category}</span>
            {likeCount > 0 && (
              <span className="text-[10px] text-ink-500 flex items-center gap-0.5">
                <Heart className="w-3 h-3" /> {likeCount}
              </span>
            )}
          </div>
          <p className="text-sm sm:text-base text-ink-100 font-medium mt-0.5">
            {item.title}
          </p>
          {item.summary && <p className="text-xs sm:text-sm text-ink-500 mt-1 line-clamp-2">{item.summary}</p>}
        </div>
        {canEdit && (
          <div className="flex gap-0.5 shrink-0" onClick={e => e.stopPropagation()}>
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
