import { useRef, useState } from 'react';
import { Edit3, Save, X, Eye } from 'lucide-react';
import type { SectionEditorConfig } from '../../data/sectionEditorConfig';
import { renderWikiContent } from '../../lib/wikiContent';
import AppModal, { type ModalLayer } from './AppModal';
import ImageUploader from './ImageUploader';
import ContentImages from '../ContentImages';
import ContentFormatToolbar from './ContentFormatToolbar';

export interface SectionEditorValues {
  title: string;
  summary: string;
  content: string;
  category: string;
  icon: string;
  images: string[];
}

interface SectionEditorModalProps {
  config: SectionEditorConfig;
  initial?: Partial<SectionEditorValues>;
  isEdit?: boolean;
  onSave: (values: SectionEditorValues) => void;
  onCancel: () => void;
  layer?: ModalLayer;
  storageFolder?: string;
}

export default function SectionEditorModal({
  config,
  initial,
  isEdit,
  onSave,
  onCancel,
  layer = 'default',
  storageFolder = 'uploads',
}: SectionEditorModalProps) {
  const [title, setTitle] = useState(initial?.title || '');
  const [summary, setSummary] = useState(initial?.summary || '');
  const [content, setContent] = useState(initial?.content || '');
  const [category, setCategory] = useState(initial?.category || config.categories[0]);
  const [icon, setIcon] = useState(initial?.icon || config.icons[0]);
  const [images, setImages] = useState<string[]>(initial?.images || []);
  const [showPreview, setShowPreview] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    onSave({
      title: title.trim(),
      summary: summary.trim(),
      content: content.trim(),
      category,
      icon,
      images,
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
                  {summary && <p className="text-ink-400 text-sm mt-0.5">{summary}</p>}
                  <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-gold-400/10 text-gold-400 border border-gold-400/30">{category}</span>
                </div>
              </div>
              <div className="space-y-2 pt-2">{renderWikiContent(content)}</div>
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
                  {config.categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <ImageUploader images={images} onChange={setImages} storageFolder={storageFolder} />

              <div data-content-editor="v2">
                <label className="text-gold-400/70 text-xs mb-1.5 block tracking-wide">
                  Содержание *
                </label>
                <p className="text-ink-500 text-[10px] mb-2">
                  Выделите текст и используйте панель форматирования ниже
                </p>
                <div className="rounded-xl border-2 border-gold-500/40 overflow-hidden bg-ink-900/60 shadow-[inset_0_0_0_1px_rgba(212,165,40,0.08)]">
                  <ContentFormatToolbar
                    value={content}
                    onChange={setContent}
                    textareaRef={contentRef}
                  />
                  <textarea
                    ref={contentRef}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    rows={12}
                    placeholder={config.contentPlaceholder}
                    className="w-full bg-ink-900/90 px-4 py-3 text-white text-sm placeholder:text-ink-500 focus:outline-none focus:ring-1 focus:ring-gold-400/30 resize-y leading-relaxed min-h-[160px] border-0 border-t border-ink-700/50 rounded-none"
                  />
                </div>
              </div>
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
            disabled={!title.trim() || !content.trim()}
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
