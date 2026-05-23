import { useState } from 'react';
import { Edit3, Save, X, Eye, Star } from 'lucide-react';
import type { SectionEditorConfig } from '../../data/sectionEditorConfig';

export interface SectionEditorValues {
  title: string;
  summary: string;
  content: string;
  category: string;
  icon: string;
}

interface SectionEditorModalProps {
  config: SectionEditorConfig;
  initial?: Partial<SectionEditorValues>;
  isEdit?: boolean;
  onSave: (values: SectionEditorValues) => void;
  onCancel: () => void;
}

export default function SectionEditorModal({
  config,
  initial,
  isEdit,
  onSave,
  onCancel,
}: SectionEditorModalProps) {
  const [title, setTitle] = useState(initial?.title || '');
  const [summary, setSummary] = useState(initial?.summary || '');
  const [content, setContent] = useState(initial?.content || '');
  const [category, setCategory] = useState(initial?.category || config.categories[0]);
  const [icon, setIcon] = useState(initial?.icon || config.icons[0]);
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    onSave({ title: title.trim(), summary: summary.trim(), content: content.trim(), category, icon });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-gold-500/25 bg-ink-800">
        <div className="h-1 bg-gradient-to-r from-transparent via-gold-400/60 to-transparent shrink-0" />

        <div className="flex items-center justify-between px-5 py-4 border-b border-ink-700/50 shrink-0">
          <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-gold-400" />
            {isEdit ? config.titleEdit : config.titleNew}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gold-300/80 border border-gold-500/30 hover:border-gold-400/50 hover:text-gold-300 cursor-pointer transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              {showPreview ? 'Редактор' : 'Превью'}
            </button>
            <button type="button" onClick={onCancel} className="p-2 text-ink-400 hover:text-white rounded-lg hover:bg-ink-700/50 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
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
              <div className="space-y-2 pt-2">
                {content.split('\n').map((line, i) => {
                  if (line.startsWith('## ')) return <h4 key={i} className="font-serif text-lg font-bold text-gold-400 mt-3">{line.replace('## ', '')}</h4>;
                  if (line.startsWith('- ')) return (
                    <div key={i} className="flex items-start gap-2 text-sm text-ink-200">
                      <Star className="w-3 h-3 text-gold-400 mt-1 shrink-0" />
                      <span>{line.replace('- ', '')}</span>
                    </div>
                  );
                  if (!line.trim()) return <div key={i} className="h-2" />;
                  return <p key={i} className="text-ink-200 text-sm leading-relaxed">{line}</p>;
                })}
              </div>
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

              <div>
                <label className="text-gold-400/70 text-xs mb-1.5 block">
                  Содержание * {config.contentHint && <span className="text-ink-500">{config.contentHint}</span>}
                </label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={12}
                  placeholder={config.contentPlaceholder}
                  className="w-full bg-ink-900/80 border border-ink-600/50 rounded-xl px-4 py-3 text-white text-sm placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50 resize-y font-mono leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 px-5 py-4 border-t border-ink-700/50 shrink-0 bg-ink-900/50">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()}
            className="flex-1 flex items-center justify-center gap-2 bg-ink-900 text-gold-400 border border-gold-400/50 py-3 rounded-xl font-medium hover:bg-gold-400/10 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isEdit ? 'Сохранить изменения' : config.publishLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 bg-ink-700 text-ink-300 py-3 rounded-xl hover:bg-ink-600 cursor-pointer transition-all"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
