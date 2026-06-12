import { useMemo, useState } from 'react';
import { Edit3, Save, X } from 'lucide-react';
import type { CustomSectionDefinition, SectionFieldDef } from '../../types/site';
import { useSectionCategories } from '../../hooks/useSectionCategories';
import AppModal from './AppModal';
import ImageUploader from './ImageUploader';
import ContentRichEditor from './ContentRichEditor';
import { DEFAULT_SECTION_ICONS } from '../../lib/sectionRegistry';

export interface DynamicEditorValues {
  title: string;
  icon: string;
  images: string[];
  fields: Record<string, string>;
}

interface DynamicSectionEditorModalProps {
  definition: CustomSectionDefinition;
  initial?: Partial<DynamicEditorValues>;
  isEdit?: boolean;
  onSave: (values: DynamicEditorValues) => void;
  onCancel: () => void;
  storageFolder?: string;
}

function fieldValue(values: DynamicEditorValues, key: string): string {
  if (key === 'title') return values.title;
  if (key === 'icon') return values.icon;
  if (key === 'content') return values.fields.content || '';
  return values.fields[key] || '';
}

function setFieldValue(
  prev: DynamicEditorValues,
  field: SectionFieldDef,
  value: string,
): DynamicEditorValues {
  if (field.key === 'title') return { ...prev, title: value };
  if (field.key === 'icon') return { ...prev, icon: value };
  return { ...prev, fields: { ...prev.fields, [field.key]: value } };
}

export default function DynamicSectionEditorModal({
  definition,
  initial,
  isEdit,
  onSave,
  onCancel,
  storageFolder,
}: DynamicSectionEditorModalProps) {
  const { categories } = useSectionCategories(definition.id);
  const categoryOptions = categories.length
    ? categories
    : (definition.categories || [{ id: 'Прочее', label: 'Прочее', icon: '✦' }]);
  const iconChoices = definition.iconChoices?.length ? definition.iconChoices : DEFAULT_SECTION_ICONS;

  const [values, setValues] = useState<DynamicEditorValues>(() => ({
    title: initial?.title || '',
    icon: initial?.icon || iconChoices[0] || '✦',
    images: initial?.images || [],
    fields: { ...(initial?.fields || {}) },
  }));

  const requiredOk = useMemo(() => {
    return definition.fields.every(f => {
      if (!f.required) return true;
      const v = fieldValue(values, f.key);
      return Boolean(String(v).trim());
    });
  }, [definition.fields, values]);

  const updateField = (field: SectionFieldDef, value: string) => {
    setValues(prev => setFieldValue(prev, field, value));
  };

  const renderField = (field: SectionFieldDef) => {
    const val = fieldValue(values, field.key);
    const inputCls = 'w-full bg-ink-900/80 border border-ink-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50';

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={field.key === 'title' ? values.title : val}
            onChange={e => updateField(field, e.target.value)}
            placeholder={field.placeholder}
            className={inputCls}
          />
        );
      case 'textarea':
        return (
          <textarea
            value={val}
            onChange={e => updateField(field, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className={`${inputCls} resize-y`}
          />
        );
      case 'markdown':
        return (
          <ContentRichEditor
            value={val}
            onChange={v => updateField(field, v)}
            rows={12}
            placeholder={field.placeholder || 'Текст записи…'}
            emphasized
          />
        );
      case 'category':
        return (
          <select
            value={values.fields.category || categoryOptions[0]?.id || ''}
            onChange={e => updateField(field, e.target.value)}
            className={`${inputCls} cursor-pointer`}
          >
            {categoryOptions.map(c => (
              <option key={c.id} value={c.id}>{c.icon ? `${c.icon} ` : ''}{c.label}</option>
            ))}
          </select>
        );
      case 'icon':
        return (
          <div className="flex gap-1.5 flex-wrap">
            {iconChoices.map(ic => (
              <button
                key={ic}
                type="button"
                onClick={() => setValues(v => ({ ...v, icon: ic }))}
                className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center cursor-pointer ${
                  values.icon === ic ? 'bg-gold-400/20 border border-gold-400/50' : 'bg-ink-900/80 border border-ink-600/40'
                }`}
              >
                {ic}
              </button>
            ))}
          </div>
        );
      case 'number':
        return (
          <input
            type="number"
            value={val}
            onChange={e => updateField(field, e.target.value)}
            className={inputCls}
          />
        );
      case 'tags':
        return (
          <input
            type="text"
            value={val}
            onChange={e => updateField(field, e.target.value)}
            placeholder={field.placeholder || 'через запятую'}
            className={inputCls}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AppModal open onClose={onCancel} className="max-w-2xl">
      <div className="flex flex-col max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl border border-gold-500/25 bg-ink-800">
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink-700/50">
          <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-gold-400" />
            {isEdit ? `Редактировать — ${definition.label}` : `Новая запись — ${definition.label}`}
          </h2>
          <button type="button" onClick={onCancel} className="p-2 text-ink-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {definition.fields.map(field => (
            <div key={field.key}>
              <label className="text-gold-400/70 text-xs mb-1.5 block">
                {field.label}{field.required ? ' *' : ''}
              </label>
              {renderField(field)}
            </div>
          ))}
          <ImageUploader
            images={values.images}
            onChange={imgs => setValues(v => ({ ...v, images: imgs }))}
            storageFolder={storageFolder || definition.id}
          />
        </div>

        <div className="flex gap-3 px-5 py-4 border-t border-ink-700/50 bg-ink-900/50">
          <button type="button" onClick={onCancel} className="px-6 py-3 rounded-xl bg-ink-700 text-ink-300 hover:bg-ink-600 cursor-pointer">
            Отмена
          </button>
          <button
            type="button"
            disabled={!requiredOk}
            onClick={() => onSave(values)}
            className="flex-1 flex items-center justify-center gap-2 bg-ink-900 text-gold-400 border border-gold-400/50 py-3 rounded-xl font-medium hover:bg-gold-400/10 cursor-pointer disabled:opacity-40"
          >
            <Save className="w-4 h-4" />
            {isEdit ? 'Сохранить' : 'Опубликовать'}
          </button>
        </div>
      </div>
    </AppModal>
  );
}
