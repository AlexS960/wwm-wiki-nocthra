import { useMemo, useState } from 'react';
import { Edit3, Save, X, Eye } from 'lucide-react';
import type { SectionEditorConfig } from '../../data/sectionEditorConfig';
import type { SectionSchema } from '../../data/sectionSchemas';
import { buildSectionContent } from '../../lib/sectionContent';
import { renderWikiContent } from '../../lib/wikiContent';
import AppModal, { type ModalLayer } from './AppModal';
import ImageUploader from './ImageUploader';
import ContentImages from '../ContentImages';
import ContentRichEditor from './ContentRichEditor';
import { asText, trimText } from '../../lib/asText';

export interface SectionEditorValues {
  title: string;
  summary: string;
  content: string;
  category: string;
  icon: string;
  images: string[];
  nameEn?: string;
  tagValues?: Record<string, string>;
  structuredText?: Record<string, string>;
  structuredLists?: Record<string, string>;
}

interface SectionEditorModalProps {
  config: SectionEditorConfig;
  schema?: SectionSchema;
  initial?: Partial<SectionEditorValues>;
  isEdit?: boolean;
  onSave: (values: SectionEditorValues) => void;
  onCancel: () => void;
  layer?: ModalLayer;
  storageFolder?: string;
  categoryOptions?: { id: string; label: string; icon?: string }[];
}

export default function SectionEditorModal({
  config,
  schema,
  initial,
  isEdit,
  onSave,
  onCancel,
  layer = 'default',
  storageFolder = 'uploads',
  categoryOptions,
}: SectionEditorModalProps) {
  const resolvedCategories = categoryOptions?.length
    ? categoryOptions
    : config.categories.map(c => ({ id: c, label: c }));
  const defaultCategory = asText(initial?.category) || asText(resolvedCategories[0]?.id);
  const [title, setTitle] = useState(() => asText(initial?.title));
  const [summary, setSummary] = useState(() => asText(initial?.summary));
  const [content, setContent] = useState(() => asText(initial?.content) || asText(schema?.defaultContentTemplate));
  const [category, setCategory] = useState(defaultCategory);
  const [icon, setIcon] = useState(() => asText(initial?.icon) || config.icons[0]);
  const [images, setImages] = useState<string[]>(initial?.images || []);
  const [nameEn, setNameEn] = useState(() => asText(initial?.nameEn));
  const [tagValues, setTagValues] = useState<Record<string, string>>(() => {
    const base: Record<string, string> = {};
    schema?.tagFields?.forEach(f => { base[f.id] = asText(initial?.tagValues?.[f.id]); });
    return base;
  });
  const [structuredText, setStructuredText] = useState<Record<string, string>>(() => {
    const base: Record<string, string> = {};
    schema?.contentFields.filter(f => f.kind !== 'list').forEach(f => {
      base[f.id] = asText(initial?.structuredText?.[f.id]);
    });
    return base;
  });
  const [structuredLists, setStructuredLists] = useState<Record<string, string>>(() => {
    const base: Record<string, string> = {};
    schema?.contentFields.filter(f => f.kind === 'list').forEach(f => {
      base[f.id] = asText(initial?.structuredLists?.[f.id]);
    });
    return base;
  });
  const [showPreview, setShowPreview] = useState(false);

  const structured = !!schema && schema.contentFields.length > 0;

  const previewContent = useMemo(() => {
    if (!structured || !schema) return content;
    const sections = schema.contentFields.map(field => ({
      header: field.header,
      body: field.kind === 'list'
        ? asText(structuredLists[field.id]).split('\n').map(l => l.trim()).filter(Boolean)
        : asText(structuredText[field.id]),
    }));
    return buildSectionContent(sections);
  }, [structured, schema, content, structuredText, structuredLists]);

  const isValid = trimText(title) && (structured ? true : trimText(content));

  const handleSubmit = () => {
    if (!isValid) return;
    onSave({
      title: title.trim(),
      summary: summary.trim(),
      content: structured ? previewContent : content.trim(),
      category,
      icon,
      images,
      nameEn: nameEn.trim() || undefined,
      tagValues: schema?.tagFields?.length ? tagValues : undefined,
      structuredText: structured ? structuredText : undefined,
      structuredLists: structured ? structuredLists : undefined,
    });
  };

  return (
    <AppModal open onClose={onCancel} layer={layer} className="max-w-2xl">
      <div className="flex flex-col h-full sm:h-auto sm:max-h-[90vh] rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl border border-gold-500/25 bg-ink-800">
        <div className="h-1 bg-gradient-to-r from-transparent via-gold-400/60 to-transparent shrink-0" />

        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-ink-700/50 shrink-0 gap-2">
          <h2 className="font-serif text-base sm:text-lg font-bold text-white flex items-center gap-2 min-w-0">
            <Edit3 className="w-5 h-5 text-gold-400 shrink-0" />
            <span className="truncate">{isEdit ? config.titleEdit : config.titleNew}</span>
          </h2>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs text-gold-300/80 border border-gold-500/30 hover:border-gold-400/50 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{showPreview ? 'Редактор' : 'Превью'}</span>
            </button>
            <button type="button" onClick={onCancel} className="p-2 text-ink-400 hover:text-white rounded-lg cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 min-h-0">
          {showPreview ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{icon}</span>
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">{title || 'Без названия'}</h3>
                  {nameEn && <p className="text-ink-400 text-sm">{nameEn}</p>}
                  {summary && <p className="text-ink-400 text-sm mt-0.5">{summary}</p>}
                  <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-gold-400/10 text-gold-400 border border-gold-400/30">
                    {resolvedCategories.find(c => c.id === category)?.label || category}
                  </span>
                </div>
              </div>
              <div className="space-y-2 pt-2">{renderWikiContent(previewContent)}</div>
              <ContentImages images={images} />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-gold-400/70 text-xs mb-1.5 block tracking-wide">Иконка</label>
                <div className="flex gap-1.5 flex-wrap">
                  {config.icons.map(ic => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setIcon(ic)}
                      className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center cursor-pointer transition-all ${
                        icon === ic ? 'bg-gold-400/20 border border-gold-400/50' : 'bg-ink-900/80 border border-ink-600/40 hover:border-gold-500/30'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-gold-400/70 text-xs mb-1.5 block">Заголовок *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder={config.titlePlaceholder}
                  className="w-full bg-ink-900/80 border border-ink-600/50 rounded-xl px-4 py-2.5 text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50"
                />
              </div>

              {schema?.showNameEn && (
                <div>
                  <label className="text-gold-400/70 text-xs mb-1.5 block">Название (EN)</label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={e => setNameEn(e.target.value)}
                    placeholder="English name…"
                    className="w-full bg-ink-900/80 border border-ink-600/50 rounded-xl px-4 py-2.5 text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50"
                  />
                </div>
              )}

              <div>
                <label className="text-gold-400/70 text-xs mb-1.5 block">{config.summaryLabel}</label>
                <input
                  type="text"
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  placeholder={config.summaryPlaceholder}
                  className="w-full bg-ink-900/80 border border-ink-600/50 rounded-xl px-4 py-2.5 text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50"
                />
              </div>

              <div>
                <label className="text-gold-400/70 text-xs mb-1.5 block">Категория</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-ink-900/80 border border-ink-600/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold-400/50 cursor-pointer"
                >
                  {resolvedCategories.map(c => (
                    <option key={c.id} value={c.id}>{c.icon ? `${c.icon} ` : ''}{c.label}</option>
                  ))}
                </select>
              </div>

              {schema?.tagFields?.map(field => (
                <div key={field.id}>
                  <label className="text-gold-400/70 text-xs mb-1.5 block">{field.label}</label>
                  <input
                    type="text"
                    value={tagValues[field.id] || ''}
                    onChange={e => setTagValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full bg-ink-900/80 border border-ink-600/50 rounded-xl px-4 py-2.5 text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50"
                  />
                </div>
              ))}

              <ImageUploader images={images} onChange={setImages} storageFolder={storageFolder} />

              {structured && schema ? (
                schema.contentFields.map(field => (
                  <div key={field.id}>
                    <label className="text-gold-400/70 text-xs mb-1.5 block tracking-wide">{field.label}</label>
                    {field.kind === 'list' ? (
                      <>
                        <p className="text-ink-500 text-[10px] mb-2">Одна строка — один пункт</p>
                        <textarea
                          value={structuredLists[field.id] || ''}
                          onChange={e => setStructuredLists(prev => ({ ...prev, [field.id]: e.target.value }))}
                          rows={4}
                          placeholder={field.placeholder}
                          className="w-full bg-ink-900/80 border border-ink-600/50 rounded-xl px-4 py-2.5 text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50 text-sm resize-y min-h-[80px]"
                        />
                      </>
                    ) : field.kind === 'textarea' ? (
                      <ContentRichEditor
                        value={structuredText[field.id] || ''}
                        onChange={v => setStructuredText(prev => ({ ...prev, [field.id]: v }))}
                        rows={4}
                        placeholder={field.placeholder}
                      />
                    ) : (
                      <input
                        type="text"
                        value={structuredText[field.id] || ''}
                        onChange={e => setStructuredText(prev => ({ ...prev, [field.id]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full bg-ink-900/80 border border-ink-600/50 rounded-xl px-4 py-2.5 text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50"
                      />
                    )}
                  </div>
                ))
              ) : (
                <div data-content-editor="v2">
                  <label className="text-gold-400/70 text-xs mb-1.5 block tracking-wide">
                    Содержание *{' '}
                    {config.contentHint && <span className="text-ink-500 font-normal">{config.contentHint}</span>}
                  </label>
                  <p className="text-ink-500 text-[10px] mb-2">
                    Выделите текст и используйте панель форматирования над полем
                  </p>
                  <ContentRichEditor
                    value={content}
                    onChange={setContent}
                    rows={12}
                    placeholder={config.contentPlaceholder}
                    emphasized
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 px-4 sm:px-5 py-3 sm:py-4 border-t border-ink-700/50 shrink-0 bg-ink-900/50 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={onCancel}
            className="sm:order-2 px-6 bg-ink-700 text-ink-300 py-3 rounded-xl hover:bg-ink-600 cursor-pointer"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid}
            className="sm:order-1 flex-1 flex items-center justify-center gap-2 bg-ink-900 text-gold-400 border border-gold-400/50 py-3 rounded-xl font-medium hover:bg-gold-400/10 cursor-pointer disabled:opacity-40"
          >
            <Save className="w-4 h-4" />
            {isEdit ? 'Сохранить изменения' : config.publishLabel}
          </button>
        </div>
      </div>
    </AppModal>
  );
}
