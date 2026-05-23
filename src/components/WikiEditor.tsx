import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import SectionEditorModal, { type SectionEditorValues } from './ui/SectionEditorModal';
import { sectionEditorConfigs } from '../data/sectionEditorConfig';

interface WikiEditorProps { sectionId: string; }

export default function WikiEditor({ sectionId }: WikiEditorProps) {
  const { isEditor, isAdmin, wikiArticles, addWikiArticle, updateWikiArticle, deleteWikiArticle } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const config = sectionEditorConfigs[sectionId];
  const canEdit = (isEditor() || isAdmin()) && config;

  if (!canEdit) return null;

  const sectionArticles = wikiArticles.filter(a => a.section === sectionId);
  const editingArticle = editingId ? sectionArticles.find(a => a.id === editingId) : null;

  const handleSave = (values: SectionEditorValues) => {
    if (editingId) {
      updateWikiArticle(editingId, {
        title: values.title,
        content: values.content,
        icon: values.icon,
        images: values.images,
        fields: { summary: values.summary, category: values.category },
      });
    } else {
      addWikiArticle({
        section: sectionId,
        title: values.title,
        content: values.content,
        icon: values.icon,
        images: values.images,
        fields: { summary: values.summary, category: values.category },
      });
    }
    setShowModal(false);
    setEditingId(null);
  };

  const openNew = () => {
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (id: string) => {
    setEditingId(id);
    setShowModal(true);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-0">
        <div className="bg-gold-400/5 border border-gold-400/20 rounded-xl p-4 flex items-center gap-3 mb-4">
          <Edit3 className="w-5 h-5 text-gold-400 shrink-0" />
          <div className="flex-1">
            <p className="text-gold-400 text-sm font-medium">Режим редактора</p>
            <p className="text-ink-400 text-xs mt-0.5">
              Вы можете добавлять, редактировать и удалять контент в этом разделе.
            </p>
          </div>
          <button
            type="button"
            onClick={openNew}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gold-400/20 text-gold-400 text-xs font-medium hover:bg-gold-400/30 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Добавить
          </button>
        </div>

        {sectionArticles.length > 0 && (
          <div className="space-y-3 mb-6">
            {sectionArticles.map(article => (
              <div key={article.id} className="bg-ink-800/50 border border-ink-700/30 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <span className="text-xl">{article.icon}</span>
                    <div>
                      <h3 className="text-white font-medium text-sm">{article.title}</h3>
                      {article.fields?.summary && (
                        <p className="text-ink-400 text-xs mt-1 line-clamp-2">{article.fields.summary}</p>
                      )}
                      {article.images && article.images.length > 0 && (
                        <span className="text-[10px] text-gold-500/70">📷 {article.images.length} скринш.</span>
                      )}
                      <p className="text-ink-500 text-[10px] mt-2">{article.authorName} · {article.updatedAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEdit(article.id)}
                      className="p-1.5 rounded-lg text-gold-400 hover:bg-gold-400/10 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteWikiArticle(article.id)}
                      className="p-1.5 rounded-lg text-ink-500 hover:text-crimson-400 hover:bg-crimson-400/10 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <SectionEditorModal
          config={config}
          storageFolder={sectionId}
          isEdit={!!editingId}
          initial={editingArticle ? {
            title: editingArticle.title,
            summary: editingArticle.fields?.summary || '',
            content: editingArticle.content,
            category: editingArticle.fields?.category || config.categories[0],
            icon: editingArticle.icon,
            images: editingArticle.images || [],
          } : { images: [] }}
          onSave={handleSave}
          onCancel={() => { setShowModal(false); setEditingId(null); }}
        />
      )}
    </>
  );
}
