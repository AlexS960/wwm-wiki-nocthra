import { useState } from 'react';
import { useAuthState, useAuthActions } from '../../context/AuthContext';
import { useSectionCategories } from '../../hooks/useSectionCategories';
import { Edit3, Plus } from 'lucide-react';
import SectionEditorModal, { type SectionEditorValues } from '../ui/SectionEditorModal';
import { sectionEditorConfigs } from '../../data/sectionEditorConfig';
import { getSectionSchema } from '../../data/sectionSchemas';
import { defaultStructuredInitial, editorValuesToWikiPayload } from '../../lib/sectionArticleHelpers';

interface WikiEditorBarProps {
  sectionId: string;
}

/** Панель редактора — записи отображаются в общей сетке раздела */
export default function WikiEditorBar({ sectionId }: WikiEditorBarProps) {
  const { user } = useAuthState();
  const { isEditor, isAdmin, addWikiArticle, updateWikiArticle } = useAuthActions();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editInitial, setEditInitial] = useState<Partial<SectionEditorValues> | undefined>();

  const config = sectionEditorConfigs[sectionId];
  const schema = getSectionSchema(sectionId);
  const { categories, normalizeId } = useSectionCategories(sectionId);
  const canEdit = Boolean(user) && (isEditor() || isAdmin()) && config;

  if (!canEdit) return null;

  const handleSave = (values: SectionEditorValues) => {
    const payload = editorValuesToWikiPayload(values, schema, normalizeId);
    if (editingId) {
      updateWikiArticle(editingId, {
        title: payload.title,
        content: payload.content,
        icon: payload.icon,
        images: payload.images,
        fields: payload.fields,
      });
    } else {
      addWikiArticle({
        section: sectionId,
        title: payload.title,
        content: payload.content,
        icon: payload.icon,
        images: payload.images,
        fields: payload.fields,
      });
    }
    setShowModal(false);
    setEditingId(null);
    setEditInitial(undefined);
  };

  const openCreate = () => {
    setEditingId(null);
    setEditInitial({
      images: [],
      category: categories[0]?.id || '',
      ...(schema ? defaultStructuredInitial(schema) : {}),
    });
    setShowModal(true);
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-3 bg-gold-400/5 border border-gold-400/20 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <Edit3 className="w-4 h-4 text-gold-400 shrink-0" />
          <p className="text-ink-400 text-xs sm:text-sm truncate">Добавляйте материалы — они появятся в списке ниже</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gold-400/20 text-gold-400 text-xs font-medium hover:bg-gold-400/30 cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Добавить
        </button>
      </div>

      {showModal && (
        <SectionEditorModal
          config={config}
          schema={schema}
          storageFolder={sectionId}
          categoryOptions={categories}
          isEdit={!!editingId}
          initial={editInitial}
          onSave={handleSave}
          onCancel={() => { setShowModal(false); setEditingId(null); setEditInitial(undefined); }}
        />
      )}
    </>
  );
}
