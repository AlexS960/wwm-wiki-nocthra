import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSectionCategories } from '../../hooks/useSectionCategories';
import { getCustomSectionById } from '../../lib/sectionRegistry';
import {
  defaultStructuredInitial,
  editorValuesToWikiPayload,
  wikiArticleToEditorInitial,
} from '../../lib/sectionArticleHelpers';
import { getSectionSchema } from '../../data/sectionSchemas';
import SectionEditorModal, { type SectionEditorValues } from '../ui/SectionEditorModal';
import DynamicSectionEditorModal, { type DynamicEditorValues } from '../ui/DynamicSectionEditorModal';
import { sectionEditorConfigs } from '../../data/sectionEditorConfig';
import SectionWikiCard from './SectionWikiCard';
import { useWikiFocus } from '../../context/WikiFocusContext';
import { buildWikiCatalog } from '../../lib/sectionSeeds';

interface WikiArticleCardsProps {
  sectionId: string;
  categoryFilter?: string;
  isFavorite?: (articleId: string) => boolean;
  onToggleFavorite?: (articleId: string) => void;
  favoriteAddTitle?: string;
  favoriteRemoveTitle?: string;
  highlightId?: string | null;
}

export default function WikiArticleCards({
  sectionId,
  categoryFilter = 'all',
  isFavorite,
  onToggleFavorite,
  favoriteAddTitle,
  favoriteRemoveTitle,
  highlightId,
}: WikiArticleCardsProps) {
  const focusId = useWikiFocus();
  const activeHighlight = highlightId ?? focusId;
  const { wikiArticles, isEditor, isAdmin, updateWikiArticle, deleteWikiArticle, siteSettings, ensureWikiLoaded } = useAuth();
  const [editId, setEditId] = useState<string | null>(null);
  const [editInitial, setEditInitial] = useState<Partial<SectionEditorValues>>();
  const [dynamicInitial, setDynamicInitial] = useState<Partial<DynamicEditorValues>>();
  const { categories, getLabel, matchesFilter, normalizeId } = useSectionCategories(sectionId);
  const customDef = getCustomSectionById(sectionId, siteSettings);
  const schema = getSectionSchema(sectionId);

  useEffect(() => {
    ensureWikiLoaded();
  }, [ensureWikiLoaded]);

  const catalog = wikiArticles.length > 0 ? wikiArticles : buildWikiCatalog([]);
  const articles = catalog.filter(a => {
    if (a.section !== sectionId) return false;
    if (categoryFilter === 'all') return true;
    return matchesFilter(a.fields?.category, categoryFilter);
  });

  const canEdit = isEditor() || isAdmin();
  const config = sectionEditorConfigs[sectionId];

  if (articles.length === 0) {
    return (
      <p className="text-center text-ink-500 text-sm py-8">
        {categoryFilter === 'all' ? 'В этом разделе пока нет записей.' : 'Нет записей в выбранной категории.'}
      </p>
    );
  }

  const handleSave = (values: SectionEditorValues) => {
    if (!editId) return;
    const payload = editorValuesToWikiPayload(values, schema, normalizeId);
    updateWikiArticle(editId, {
      title: payload.title,
      content: payload.content,
      icon: payload.icon,
      images: payload.images,
      fields: payload.fields,
    });
    setEditId(null);
    setEditInitial(undefined);
  };

  return (
    <>
      {articles.map(article => (
        <SectionWikiCard
          key={article.id}
          sectionId={sectionId}
          article={article}
          categoryLabel={article.fields?.category ? getLabel(article.fields.category) : undefined}
          canEdit={canEdit}
          isFavorite={isFavorite?.(article.id)}
          onToggleFavorite={onToggleFavorite ? () => onToggleFavorite(article.id) : undefined}
          favoriteAddTitle={favoriteAddTitle}
          favoriteRemoveTitle={favoriteRemoveTitle}
          highlighted={activeHighlight === article.id}
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
              setEditInitial(
                wikiArticleToEditorInitial(
                  article,
                  schema,
                  normalizeId,
                  categories[0]?.id || '',
                ),
              );
            }
          }}
          onDelete={() => {
            if (confirm('Удалить эту запись?')) deleteWikiArticle(article.id);
          }}
        />
      ))}

      {editId && customDef && dynamicInitial && (
        <DynamicSectionEditorModal
          key={editId}
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
          key={editId}
          config={config}
          schema={schema}
          storageFolder={sectionId}
          categoryOptions={categories}
          isEdit
          initial={editInitial}
          onSave={handleSave}
          onCancel={() => { setEditId(null); setEditInitial(undefined); }}
        />
      )}
    </>
  );
}
