import { useEffect, useMemo, useState } from 'react';
import { Plus, Edit3 } from 'lucide-react';
import type { CustomSectionDefinition } from '../types/site';
import { useAuth } from '../context/AuthContext';
import { useSectionCategories } from '../hooks/useSectionCategories';
import SectionHeader from './ui/SectionHeader';
import SectionFilterBar from './ui/SectionFilterBar';
import WikiArticleCards from './wiki/WikiArticleCards';
import DynamicSectionEditorModal, { type DynamicEditorValues } from './ui/DynamicSectionEditorModal';

interface GenericSectionProps {
  definition: CustomSectionDefinition;
}

export default function GenericSection({ definition }: GenericSectionProps) {
  const { wikiArticles, isEditor, isAdmin, addWikiArticle, ensureWikiLoaded } = useAuth();
  const { matchesFilter } = useSectionCategories(definition.id);
  const [filterCat, setFilterCat] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const canManage = isEditor() || isAdmin();

  useEffect(() => { void ensureWikiLoaded(); }, [ensureWikiLoaded]);

  const articles = useMemo(
    () => wikiArticles.filter(a => a.section === definition.id),
    [wikiArticles, definition.id],
  );

  const filteredCount = useMemo(
    () => articles.filter(a => matchesFilter(a.fields?.category, filterCat)).length,
    [articles, filterCat, matchesFilter],
  );

  const filterItems = useMemo(
    () => articles.map(a => ({ categoryId: a.fields?.category || '' })),
    [articles],
  );

  return (
    <section id={definition.id} className="py-20 bg-ink-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          sectionId={definition.id}
          icon={definition.icon}
          title={definition.title}
          subtitle={definition.description || `Раздел «${definition.label}»`}
        />

        {canManage && (
          <div className="mb-6 flex justify-end">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold-400/15 text-gold-300 text-sm border border-gold-400/30 hover:bg-gold-400/25 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Добавить запись
            </button>
          </div>
        )}

        {articles.length > 0 && (
          <SectionFilterBar
            sectionKey={definition.id}
            items={filterItems}
            getCategoryId={x => x.categoryId}
            active={filterCat}
            onChange={setFilterCat}
          />
        )}

        {articles.length > 0 && filteredCount === 0 && filterCat !== 'all' ? (
          <p className="text-center text-ink-500 py-16">В этой категории пока нет записей.</p>
        ) : articles.length === 0 && !canManage ? (
          <p className="text-center text-ink-500 py-16">В этом разделе пока нет записей.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <WikiArticleCards sectionId={definition.id} categoryFilter={filterCat} />
          </div>
        )}

        {canManage && articles.length === 0 && (
          <div className="text-center py-8 border border-dashed border-ink-600/40 rounded-xl">
            <Edit3 className="w-8 h-8 text-ink-600 mx-auto mb-2" />
            <p className="text-ink-500 text-sm">Нажмите «Добавить запись», чтобы создать первую карточку</p>
          </div>
        )}
      </div>

      {showModal && (
        <DynamicSectionEditorModal
          key="new"
          definition={definition}
          storageFolder={definition.id}
          onSave={(values: DynamicEditorValues) => {
            addWikiArticle(buildWikiPayload(definition, values));
            setShowModal(false);
          }}
          onCancel={() => setShowModal(false)}
        />
      )}
    </section>
  );
}

function buildWikiPayload(definition: CustomSectionDefinition, values: DynamicEditorValues) {
  const fields: Record<string, string> = { ...values.fields };
  return {
    section: definition.id,
    title: values.title,
    content: values.fields.content || '',
    icon: values.icon,
    images: values.images,
    fields,
  };
}
