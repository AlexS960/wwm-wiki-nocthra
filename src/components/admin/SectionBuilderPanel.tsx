import { useEffect, useMemo, useState } from 'react';
import {
  Plus, Trash2, ChevronDown, ChevronUp, Layers, GripVertical, Save, Eye, EyeOff,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { CustomSectionDefinition, SectionCategoryDef, SectionFieldDef, SectionFieldType } from '../../types/site';
import {
  createEmptySection,
  DEFAULT_SECTION_ICONS,
  DEFAULT_WIKI_FIELDS,
  sanitizeSectionDefinitions,
} from '../../lib/sectionRegistry';

const FIELD_TYPES: { value: SectionFieldType; label: string }[] = [
  { value: 'text', label: 'Текст' },
  { value: 'textarea', label: 'Многострочный' },
  { value: 'markdown', label: 'Редактор (Markdown)' },
  { value: 'category', label: 'Категория' },
  { value: 'icon', label: 'Иконка' },
  { value: 'number', label: 'Число' },
  { value: 'tags', label: 'Теги (через запятую)' },
];

const inputCls = 'w-full bg-ink-900/60 border border-ink-600/40 rounded-lg px-3 py-2 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50';

export default function SectionBuilderPanel() {
  const { siteSettings, updateSiteSettings } = useAuth();
  const [defs, setDefs] = useState<CustomSectionDefinition[]>(
    () => sanitizeSectionDefinitions(siteSettings.sectionDefinitions),
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDefs(sanitizeSectionDefinitions(siteSettings.sectionDefinitions));
  }, [siteSettings.sectionDefinitions]);

  const persist = (next: CustomSectionDefinition[]) => {
    setDefs(next);
    updateSiteSettings(prev => {
      const sections = [...(prev.sections || [])];
      for (const d of next) {
        if (!sections.find(s => s.id === d.id)) {
          sections.push({
            id: d.id,
            title: d.title,
            maintenance: false,
            message: 'Раздел на технических работах.',
          });
        }
      }
      const catPatch = { ...(prev.sectionCategories || {}) };
      for (const d of next) {
        if (d.categories?.length && !catPatch[d.id]?.length) {
          catPatch[d.id] = d.categories;
        }
      }
      return { sectionDefinitions: next, sections, sectionCategories: catPatch };
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addSection = () => {
    const label = newLabel.trim();
    if (!label) return;
    const section = createEmptySection(label);
    persist([...defs, section]);
    setNewLabel('');
    setExpandedId(section.id);
  };

  const updateSection = (id: string, patch: Partial<CustomSectionDefinition>) => {
    persist(defs.map(d => (d.id === id ? { ...d, ...patch } : d)));
  };

  const removeSection = (id: string) => {
    if (!confirm('Удалить раздел? Записи вики останутся в базе.')) return;
    persist(defs.filter(d => d.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const addField = (sectionId: string) => {
    const field: SectionFieldDef = {
      key: `field_${Date.now()}`,
      type: 'text',
      label: 'Новое поле',
      showInCard: true,
    };
    updateSection(sectionId, {
      fields: [...(defs.find(d => d.id === sectionId)?.fields || []), field],
    });
  };

  const updateField = (sectionId: string, key: string, patch: Partial<SectionFieldDef>) => {
    const sec = defs.find(d => d.id === sectionId);
    if (!sec) return;
    updateSection(sectionId, {
      fields: sec.fields.map(f => (f.key === key ? { ...f, ...patch } : f)),
    });
  };

  const removeField = (sectionId: string, key: string) => {
    const sec = defs.find(d => d.id === sectionId);
    if (!sec || ['title', 'content', 'category'].includes(key)) return;
    updateSection(sectionId, { fields: sec.fields.filter(f => f.key !== key) });
  };

  const addCategory = (sectionId: string, label: string) => {
    const sec = defs.find(d => d.id === sectionId);
    if (!sec || !label.trim()) return;
    const cat: SectionCategoryDef = { id: label.trim(), label: label.trim(), icon: '✦' };
    if (sec.categories?.some(c => c.id === cat.id)) return;
    updateSection(sectionId, { categories: [...(sec.categories || []), cat] });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-ink-800/50 border border-gold-400/20 rounded-xl p-4">
        <h3 className="text-gold-400 font-semibold text-sm flex items-center gap-2 mb-2">
          <Layers className="w-4 h-4" /> Конструктор разделов вики
        </h3>
        <p className="text-ink-400 text-xs leading-relaxed">
          Создавайте разделы с полями, категориями и иконками. Схема — в <code className="text-ink-300">site_settings</code>,
          записи — в <code className="text-ink-300">wiki_articles</code> (без новых таблиц).
        </p>
        {saved && <p className="text-jade-400 text-xs mt-2 flex items-center gap-1"><Save className="w-3 h-3" /> Сохранено</p>}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={newLabel}
          onChange={e => setNewLabel(e.target.value)}
          placeholder="Название раздела (напр. Транспорт)"
          className={`${inputCls} flex-1`}
          onKeyDown={e => { if (e.key === 'Enter') addSection(); }}
        />
        <button
          type="button"
          onClick={addSection}
          disabled={!newLabel.trim()}
          className="inline-flex items-center justify-center gap-1 px-4 py-2 rounded-lg bg-gold-400/15 text-gold-300 border border-gold-400/30 hover:bg-gold-400/25 cursor-pointer disabled:opacity-40"
        >
          <Plus className="w-4 h-4" /> Создать раздел
        </button>
      </div>

      <div className="space-y-3">
        {defs.length === 0 && (
          <p className="text-ink-500 text-sm text-center py-8">Пока нет пользовательских разделов</p>
        )}
        {defs.map(sec => (
          <SectionCard
            key={sec.id}
            section={sec}
            expanded={expandedId === sec.id}
            onToggle={() => setExpandedId(expandedId === sec.id ? null : sec.id)}
            onUpdate={patch => updateSection(sec.id, patch)}
            onRemove={() => removeSection(sec.id)}
            onAddField={() => addField(sec.id)}
            onUpdateField={(key, patch) => updateField(sec.id, key, patch)}
            onRemoveField={key => removeField(sec.id, key)}
            onAddCategory={label => addCategory(sec.id, label)}
          />
        ))}
      </div>
    </div>
  );
}

function SectionCard({
  section,
  expanded,
  onToggle,
  onUpdate,
  onRemove,
  onAddField,
  onUpdateField,
  onRemoveField,
  onAddCategory,
}: {
  section: CustomSectionDefinition;
  expanded: boolean;
  onToggle: () => void;
  onUpdate: (p: Partial<CustomSectionDefinition>) => void;
  onRemove: () => void;
  onAddField: () => void;
  onUpdateField: (key: string, p: Partial<SectionFieldDef>) => void;
  onRemoveField: (key: string) => void;
  onAddCategory: (label: string) => void;
}) {
  const [catLabel, setCatLabel] = useState('');

  return (
    <div className="bg-ink-800/50 border border-ink-700/30 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-ink-700/20" onClick={onToggle}>
        <span className="text-xl">{section.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-white font-medium truncate">{section.label}</div>
          <div className="text-ink-500 text-[10px]">/{section.id} · {section.fields.length} полей</div>
        </div>
        <button
          type="button"
          onClick={e => { e.stopPropagation(); onUpdate({ visible: section.visible === false ? true : false }); }}
          className="p-1.5 text-ink-500 hover:text-gold-300 cursor-pointer"
          title={section.visible === false ? 'Показать' : 'Скрыть'}
        >
          {section.visible === false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
        <button type="button" onClick={e => { e.stopPropagation(); onRemove(); }} className="p-1.5 text-crimson-400/80 hover:text-crimson-300 cursor-pointer">
          <Trash2 className="w-4 h-4" />
        </button>
        {expanded ? <ChevronUp className="w-5 h-5 text-gold-400" /> : <ChevronDown className="w-5 h-5 text-ink-500" />}
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-ink-700/30 pt-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Название в меню">
              <input className={inputCls} value={section.label} onChange={e => onUpdate({ label: e.target.value })} />
            </Field>
            <Field label="Заголовок страницы">
              <input className={inputCls} value={section.title} onChange={e => onUpdate({ title: e.target.value })} />
            </Field>
            <Field label="Иконка раздела">
              <input className={inputCls} value={section.icon} onChange={e => onUpdate({ icon: e.target.value })} />
            </Field>
            <Field label="URL-путь">
              <input className={inputCls} value={section.path || `/${section.id}`} onChange={e => onUpdate({ path: e.target.value })} />
            </Field>
          </div>
          <Field label="Описание">
            <textarea className={`${inputCls} resize-y`} rows={2} value={section.description} onChange={e => onUpdate({ description: e.target.value })} />
          </Field>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-ink-300 text-xs font-medium">Поля формы</span>
              <button type="button" onClick={onAddField} className="text-xs text-gold-400 hover:text-gold-300 cursor-pointer flex items-center gap-1">
                <Plus className="w-3 h-3" /> Поле
              </button>
            </div>
            <div className="space-y-2">
              {section.fields.map(field => (
                <div key={field.key} className="flex flex-wrap items-center gap-2 bg-ink-900/50 rounded-lg p-2 border border-ink-700/40">
                  <GripVertical className="w-4 h-4 text-ink-600 shrink-0" />
                  <input className={`${inputCls} w-28`} value={field.key} disabled={['title', 'content', 'category'].includes(field.key)} onChange={e => onUpdateField(field.key, { key: e.target.value })} />
                  <input className={`${inputCls} flex-1 min-w-[120px]`} value={field.label} onChange={e => onUpdateField(field.key, { label: e.target.value })} />
                  <select className={`${inputCls} w-36`} value={field.type} onChange={e => onUpdateField(field.key, { type: e.target.value as SectionFieldType })}>
                    {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  <label className="flex items-center gap-1 text-[10px] text-ink-400">
                    <input type="checkbox" checked={Boolean(field.required)} onChange={e => onUpdateField(field.key, { required: e.target.checked })} />
                    Обяз.
                  </label>
                  {!['title', 'content', 'category'].includes(field.key) && (
                    <button type="button" onClick={() => onRemoveField(field.key)} className="p-1 text-crimson-400 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={() => onUpdate({ fields: [...DEFAULT_WIKI_FIELDS] })} className="text-[10px] text-ink-500 hover:text-ink-300 mt-2 cursor-pointer">
              Сбросить поля к стандартным
            </button>
          </div>

          <div>
            <span className="text-ink-300 text-xs font-medium block mb-2">Категории по умолчанию</span>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(section.categories || []).map(c => (
                <span key={c.id} className="text-xs px-2 py-0.5 rounded-full bg-ink-700/50 text-ink-300">{c.icon} {c.label}</span>
              ))}
            </div>
            <div className="flex gap-2">
              <input className={`${inputCls} flex-1`} value={catLabel} onChange={e => setCatLabel(e.target.value)} placeholder="Новая категория" />
              <button type="button" onClick={() => { onAddCategory(catLabel); setCatLabel(''); }} className="px-3 py-2 rounded-lg bg-ink-700 text-gold-300 text-xs cursor-pointer">
                Добавить
              </button>
            </div>
          </div>

          <div>
            <span className="text-ink-300 text-xs font-medium block mb-2">Иконки для записей</span>
            <input
              className={inputCls}
              value={(section.iconChoices || DEFAULT_SECTION_ICONS).join(' ')}
              onChange={e => onUpdate({ iconChoices: e.target.value.split(/\s+/).filter(Boolean) })}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-ink-400 text-xs mb-1 block">{label}</label>
      {children}
    </div>
  );
}
