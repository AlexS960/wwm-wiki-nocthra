import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Edit3, Trash2, Newspaper } from 'lucide-react';
import { useAuth, type SiteNewsItem } from '../context/AuthContext';
import SectionEditorModal, { type SectionEditorValues } from './ui/SectionEditorModal';
import AppModal from './ui/AppModal';

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

  const [showEditor, setShowEditor] = useState(false);
  const [editingNews, setEditingNews] = useState<SiteNewsItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

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

  return (
    <>
      <div className="w-full mt-6">
        <div className="bg-ink-900/50 backdrop-blur-sm border border-gold-700/25 rounded-2xl overflow-hidden flex flex-col min-h-[260px]">
          <div className="px-4 py-3 border-b border-gold-700/15 flex items-center justify-between bg-gold-900/10">
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
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 max-h-[min(420px,50vh)]">
            {siteNews.length === 0 ? (
              <p className="text-ink-500 text-sm text-center py-10">Пока нет новостей</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {siteNews.map(item => (
                  <SiteNewsCard
                    key={item.id}
                    item={item}
                    canEdit={canManageSiteNews}
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
        document.body
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
    <div className="p-3 rounded-xl bg-ink-800/40 border border-gold-700/15 hover:border-gold-600/25 transition-all h-full flex flex-col">
      <div className="flex items-start gap-2 flex-1">
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
          {item.summary && !expanded && <p className="text-xs text-ink-500 mt-0.5 line-clamp-2">{item.summary}</p>}
          {expanded && (
            <div className="mt-2 text-xs text-ink-300 space-y-1">
              {item.summary && <p className="text-ink-400">{item.summary}</p>}
              {item.content.split('\n').map((line, i) => {
                if (line.startsWith('## ')) return <p key={i} className="font-semibold text-gold-400 mt-2">{line.replace('## ', '')}</p>;
                if (line.startsWith('- ')) return <p key={i}>• {line.replace('- ', '')}</p>;
                if (line.trim()) return <p key={i}>{line}</p>;
                return null;
              })}
              {item.images && item.images.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {item.images.slice(0, 3).map((src, i) => (
                    <img key={i} src={src} alt="" className="w-12 h-12 rounded object-cover border border-ink-600/40" />
                  ))}
                  {item.images.length > 3 && <span className="text-ink-500 text-[10px] self-center">+{item.images.length - 3}</span>}
                </div>
              )}
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
