import { useState } from 'react';
import { ChevronDown, ChevronUp, Edit3, Trash2 } from 'lucide-react';
import { useAuth, type WikiArticle } from '../../context/AuthContext';
import { useSectionCategories } from '../../hooks/useSectionCategories';
import { getCustomSectionById } from '../../lib/sectionRegistry';
import MarkdownBody from '../MarkdownBody';
import SectionEditorModal, { type SectionEditorValues } from '../ui/SectionEditorModal';
import DynamicSectionEditorModal, { type DynamicEditorValues } from '../ui/DynamicSectionEditorModal';
import { sectionEditorConfigs } from '../../data/sectionEditorConfig';

interface WikiArticleCardsProps {
  sectionId: string;
  /** 'all' или id категории */
  categoryFilter?: string;
}

function WikiExpandableCard({
  article,
  categoryLabel,
  canEdit,
  onEdit,
  onDelete,
}: {
  article: WikiArticle;
  categoryLabel?: string;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const summary = article.fields?.summary || article.content.slice(0, 120);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className={`bg-ink-800/60 border rounded-xl p-4 transition-all cursor-pointer ${
        expanded ? 'border-gold-400/40' : 'border-ink-700/30 hover:border-gold-700/30 card-hover'
      }`}
    >
      <div className="flex items-start gap-3 mb-2">
        <span className="text-3xl shrink-0">{article.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif font-bold text-white">{article.title}</h3>
            <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
              {canEdit && (
                <>
                  <button type="button" onClick={onEdit} className="p-1.5 rounded-md text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 cursor-pointer" title="Редактировать">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={onDelete} className="p-1.5 rounded-md text-crimson-300 border border-crimson-400/30 hover:bg-crimson-400/10 cursor-pointer" title="Удалить">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
              {expanded ? <ChevronUp className="w-5 h-5 text-gold-400" /> : <ChevronDown className="w-5 h-5 text-ink-400" />}
            </div>
          </div>
          {categoryLabel && (
            <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-gold-400/10 text-gold-400 border border-gold-400/30">
              {categoryLabel}
            </span>
          )}
          {!expanded && <p className="text-ink-400 text-xs mt-2 line-clamp-2">{summary}</p>}
          <p className="text-ink-500 text-[10px] mt-2">{article.authorName} · {new Date(article.updatedAt).toLocaleDateString('ru-RU')}</p>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-ink-700/30 animate-fadeIn" onClick={e => e.stopPropagation()}>
          <MarkdownBody content={article.content} images={article.images} />
        </div>
      )}
    </div>
  );
}

export default function WikiArticleCards({ sectionId, categoryFilter = 'all' }: WikiArticleCardsProps) {
  const { wikiArticles, isEditor, isAdmin, updateWikiArticle, deleteWikiArticle, siteSettings } = useAuth();
  const [editId, setEditId] = useState<string | null>(null);
  const [editInitial, setEditInitial] = useState<Partial<SectionEditorValues>>();
  const [dynamicInitial, setDynamicInitial] = useState<Partial<DynamicEditorValues>>();
  const { categories, getLabel, matchesFilter, normalizeId } = useSectionCategories(sectionId);
  const customDef = getCustomSectionById(sectionId, siteSettings);

  const articles = wikiArticles.filter(a => {
    if (a.section !== sectionId) return false;
    if (categoryFilter === 'all') return true;
    return matchesFilter(a.fields?.category, categoryFilter);
  });

  const canEdit = isEditor() || isAdmin();
  const config = sectionEditorConfigs[sectionId];

  if (articles.length === 0) return null;

  return (
    <>
      {articles.map(article => (
        <WikiExpandableCard
          key={article.id}
          article={article}
          categoryLabel={article.fields?.category ? getLabel(article.fields.category) : undefined}
          canEdit={canEdit}
          onEdit={() => {
            setEditId(article.id);
            if (customDef) {
              setDynamicInitial({
                title: article.title,
                icon: article.icon,
                images: article.images || [],
                fields: { ...article.fields, content: article.content },
              });
            } else {
              setEditInitial({
                title: article.title,
                summary: article.fields?.summary || '',
                content: article.content,
                category: normalizeId(article.fields?.category) || categories[0]?.id || '',
                icon: article.icon,
                images: article.images || [],
              });
            }
          }}
          onDelete={() => {
            if (confirm('Удалить эту запись?')) deleteWikiArticle(article.id);
          }}
        />
      ))}

      {editId && customDef && dynamicInitial && (
        <DynamicSectionEditorModal
          definition={customDef}
          storageFolder={sectionId}
          isEdit
          initial={dynamicInitial}
          onSave={values => {
            updateWikiArticle(editId, {
              title: values.title,
              content: values.fields.content || '',
              icon: values.icon,
              images: values.images,
              fields: values.fields,
            });
            setEditId(null);
            setDynamicInitial(undefined);
          }}
          onCancel={() => { setEditId(null); setDynamicInitial(undefined); }}
        />
      )}

      {editId && config && !customDef && editInitial && (
        <SectionEditorModal
          config={config}
          storageFolder={sectionId}
          categoryOptions={categories}
          isEdit
          initial={editInitial}
          onSave={values => {
            updateWikiArticle(editId, {
              title: values.title,
              content: values.content,
              icon: values.icon,
              images: values.images,
              fields: { summary: values.summary, category: normalizeId(values.category) },
            });
            setEditId(null);
            setEditInitial(undefined);
          }}
          onCancel={() => { setEditId(null); setEditInitial(undefined); }}
        />
      )}
    </>
  );
}
