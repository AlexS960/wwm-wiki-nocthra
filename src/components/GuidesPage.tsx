import { useState, useEffect } from 'react';
import { useAuth, type GuideArticle } from '../context/AuthContext';
import {
  ArrowLeft, Plus, Search, Clock, BookOpen, Edit3, Trash2,
  Star, CheckCircle, Shield
} from 'lucide-react';
import SectionEditorModal, { type SectionEditorValues } from './ui/SectionEditorModal';
import { sectionEditorConfigs } from '../data/sectionEditorConfig';
import MarkdownBody from './MarkdownBody';
import GuideComments from './GuideComments';
import GuideVersionHistory from './GuideVersionHistory';
import AppModal from './ui/AppModal';
import { createPortal } from 'react-dom';

interface GuidesPageProps {
  onBack: () => void;
  onLoginClick?: () => void;
  initialGuideId?: string | null;
  onGuideOpened?: () => void;
}

export default function GuidesPage({ onBack, onLoginClick, initialGuideId, onGuideOpened }: GuidesPageProps) {
  const {
    user, guides, isEditor, addGuide, updateGuide, deleteGuide, progress, toggleCompletedGuide,
    ensureGuideMetaLoaded, ensureGuidesLoaded, guidesLoaded,
    guidesHasMore, guidesTotal, guidesLoading, loadMoreGuides, searchGuidesList,
  } = useAuth();

  const [filterCategory, setFilterCategory] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [openGuide, setOpenGuide] = useState<GuideArticle | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingGuide, setEditingGuide] = useState<GuideArticle | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    void Promise.all([ensureGuidesLoaded(), ensureGuideMetaLoaded()]);
  }, [ensureGuidesLoaded, ensureGuideMetaLoaded]);

  useEffect(() => {
    if (!guidesLoaded) return;
    const t = setTimeout(() => {
      void searchGuidesList(searchQuery, filterCategory);
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery, filterCategory, guidesLoaded, searchGuidesList]);

  useEffect(() => {
    if (!initialGuideId || !guidesLoaded) return;
    const g = guides.find(x => x.id === initialGuideId);
    if (g) setOpenGuide(g);
    onGuideOpened?.();
  }, [initialGuideId, guides, guidesLoaded, onGuideOpened]);

  useEffect(() => {
    if (!openGuide) return;
    const updated = guides.find(g => g.id === openGuide.id);
    if (updated && updated.updatedAt !== openGuide.updatedAt) setOpenGuide(updated);
  }, [guides, openGuide?.id]);

  const categories = ['Все', ...new Set(guides.map(g => g.category))];
  const filtered = guides;

  const handleNewGuide = () => { setEditingGuide(null); setShowEditor(true); };
  const handleEditGuide = (guide: GuideArticle) => { setEditingGuide(guide); setShowEditor(true); setOpenGuide(null); };
  const handleDeleteGuide = (id: string) => { deleteGuide(id); setDeleteConfirm(null); setOpenGuide(null); };

  const diffColor: Record<string, string> = {
    'Начальный': 'text-jade-400 bg-jade-400/10 border-jade-400/30',
    'Средний': 'text-gold-400 bg-gold-400/10 border-gold-400/30',
    'Продвинутый': 'text-crimson-400 bg-crimson-400/10 border-crimson-400/30',
  };

  // Reading a single guide
  if (openGuide) {
    const isCompleted = progress.completedGuides.includes(openGuide.id);
    return (
      <div className="min-h-screen pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back */}
          <button onClick={() => setOpenGuide(null)} className="flex items-center gap-2 text-ink-400 hover:text-gold-400 transition-colors mb-6 cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> Назад к списку гайдов
          </button>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-4xl">{openGuide.icon}</span>
              <div className="flex-1">
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-white">{openGuide.title}</h1>
                <p className="text-ink-300 mt-1">{openGuide.summary}</p>
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <span className={`text-xs px-2 py-1 rounded-full border ${diffColor[openGuide.difficulty] || 'text-ink-300 bg-ink-700/50 border-ink-600/30'}`}>
                    {openGuide.difficulty}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-ink-400"><Clock className="w-3 h-3" /> {openGuide.readTime}</span>
                  <span className="text-xs text-ink-500">Автор: {openGuide.authorName}</span>
                  <span className="text-xs text-ink-500">{openGuide.updatedAt}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              {user && (
                <button
                  onClick={() => toggleCompletedGuide(openGuide.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm cursor-pointer transition-all ${
                    isCompleted
                      ? 'bg-jade-400/20 text-jade-400 border border-jade-400/40'
                      : 'bg-ink-700/50 text-ink-300 border border-ink-600/30 hover:text-gold-400 hover:border-gold-400/40'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  {isCompleted ? 'Прочитано' : 'Отметить прочитанным'}
                </button>
              )}
              {isEditor() && (
                <>
                  <button onClick={() => handleEditGuide(openGuide)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-gold-400/10 text-gold-400 border border-gold-400/30 hover:bg-gold-400/20 cursor-pointer transition-all">
                    <Edit3 className="w-4 h-4" /> Редактировать
                  </button>
                  <button onClick={() => setDeleteConfirm(openGuide.id)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-crimson-400/10 text-crimson-400 border border-crimson-400/30 hover:bg-crimson-400/20 cursor-pointer transition-all">
                    <Trash2 className="w-4 h-4" /> Удалить
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="bg-ink-800/50 border border-ink-700/30 rounded-xl p-6 md:p-8">
            <div className="prose-custom space-y-2 [&_h4]:text-xl [&_h4]:mb-2">
              <MarkdownBody content={openGuide.content} images={openGuide.images} />
            </div>
          </div>

          <GuideVersionHistory guideId={openGuide.id} canRestore={isEditor()} />
          <GuideComments guideId={openGuide.id} onLoginClick={onLoginClick} />

          {deleteConfirm && createPortal(
            <AppModal open onClose={() => setDeleteConfirm(null)} layer="elevated" mobileSheet={false} className="max-w-sm">
              <div className="bg-ink-800 border border-crimson-400/30 rounded-2xl p-6 w-full mx-4">
                <h3 className="font-serif text-lg text-white font-bold mb-2">Удалить гайд?</h3>
                <p className="text-ink-300 text-sm mb-4">Это действие нельзя отменить.</p>
                <div className="flex gap-2">
                  <button onClick={() => handleDeleteGuide(deleteConfirm)} className="flex-1 bg-crimson-400/20 text-crimson-400 py-2 rounded-lg font-medium hover:bg-crimson-400/30 cursor-pointer">Удалить</button>
                  <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-ink-700 text-ink-300 py-2 rounded-lg hover:bg-ink-600 cursor-pointer">Отмена</button>
                </div>
              </div>
            </AppModal>,
            document.body
          )}
        </div>
      </div>
    );
  }

  const guideConfig = sectionEditorConfigs.guides;

  // Guides list
  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 rounded-lg text-ink-400 hover:text-gold-400 hover:bg-ink-800/50 cursor-pointer transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                <BookOpen className="w-7 h-7 text-gold-400" /> Гайды и Руководства
              </h1>
              <p className="text-ink-400 text-sm mt-1">
                {guidesTotal || guides.length} гайдов · Написаны редакторами Nocthra
              </p>
            </div>
          </div>

          {isEditor() && (
            <button
              onClick={handleNewGuide}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-400/20 text-gold-400 border border-gold-400/40
                       hover:bg-gold-400/30 transition-all cursor-pointer font-medium text-sm"
            >
              <Plus className="w-4 h-4" /> Новый гайд
            </button>
          )}
        </div>

        {/* Editor badge */}
        {isEditor() && (
          <div className="mb-6 flex items-center gap-2 bg-gold-400/5 border border-gold-400/20 rounded-lg px-4 py-2.5 text-sm">
            <Shield className="w-4 h-4 text-gold-400" />
            <span className="text-gold-400 font-medium">Редактор</span>
            <span className="text-ink-400">— вы можете добавлять, редактировать и удалять гайды</span>
          </div>
        )}

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Поиск гайдов..." className="w-full bg-ink-800 border border-ink-700/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilterCategory(cat)}
                className={`px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                  filterCategory === cat ? 'bg-gold-400/20 text-gold-400 border border-gold-400/40' : 'bg-ink-800/50 text-ink-300 border border-ink-700/30 hover:text-gold-300'
                }`}>{cat}</button>
            ))}
          </div>
        </div>

        {/* Guides Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(guide => {
            const isCompleted = progress.completedGuides.includes(guide.id);
            return (
              <div
                key={guide.id}
                onClick={() => setOpenGuide(guide)}
                className={`bg-ink-800/60 border rounded-xl p-5 cursor-pointer transition-all card-hover ${
                  isCompleted ? 'border-jade-400/30' : 'border-ink-700/30 hover:border-gold-700/30'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl relative">
                    {guide.icon}
                    {isCompleted && (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-jade-400 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-2.5 h-2.5 text-white" />
                      </span>
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-serif font-bold text-sm ${isCompleted ? 'text-jade-400' : 'text-white'}`}>{guide.title}</h3>
                    <p className="text-ink-400 text-xs mt-1 line-clamp-2">{guide.summary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${diffColor[guide.difficulty] || 'text-ink-300 bg-ink-700/50 border-ink-600/30'}`}>
                    {guide.difficulty}
                  </span>
                  <span className="text-[10px] text-ink-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {guide.readTime}</span>
                  <span className="text-[10px] text-ink-500 bg-ink-700/50 px-2 py-0.5 rounded-full">{guide.category}</span>
                </div>

                <div className="mt-3 pt-3 border-t border-ink-700/30 flex items-center justify-between">
                  <span className="text-[10px] text-ink-500">{guide.authorName}</span>
                  <span className="text-[10px] text-ink-500">{guide.updatedAt}</span>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && !guidesLoading && (
            <div className="md:col-span-2 lg:col-span-3 text-center py-16">
              <BookOpen className="w-12 h-12 text-ink-600 mx-auto mb-3" />
              <p className="text-ink-400">Гайды не найдены</p>
            </div>
          )}
        </div>

        {(guidesLoading || guidesHasMore) && (
          <div className="flex justify-center mt-8">
            {guidesLoading ? (
              <span className="text-ink-400 text-sm">Загрузка…</span>
            ) : (
              <button
                type="button"
                onClick={() => void loadMoreGuides()}
                className="px-5 py-2.5 rounded-xl bg-ink-800 border border-ink-700/50 text-gold-400 text-sm hover:border-gold-400/40 cursor-pointer"
              >
                Загрузить ещё
              </button>
            )}
          </div>
        )}
      </div>

      {showEditor && guideConfig && (
        <SectionEditorModal
          config={guideConfig}
          storageFolder="guides"
          isEdit={!!editingGuide}
          initial={editingGuide ? {
            title: editingGuide.title,
            summary: editingGuide.summary,
            content: editingGuide.content,
            category: editingGuide.category,
            icon: editingGuide.icon,
            images: editingGuide.images || [],
          } : { images: [] }}
          onSave={(values: SectionEditorValues) => {
            const payload = {
              title: values.title,
              category: values.category,
              difficulty: editingGuide?.difficulty || 'Средний',
              readTime: editingGuide?.readTime || '10 мин',
              summary: values.summary,
              content: values.content,
              icon: values.icon,
              images: values.images,
            };
            if (editingGuide) void updateGuide(editingGuide.id, payload);
            else addGuide(payload);
            setShowEditor(false);
            setEditingGuide(null);
          }}
          onCancel={() => { setShowEditor(false); setEditingGuide(null); }}
        />
      )}
    </div>
  );
}
