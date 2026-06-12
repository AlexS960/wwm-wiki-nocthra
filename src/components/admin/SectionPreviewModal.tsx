import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Edit3, ExternalLink, Plus, X } from 'lucide-react';
import type { CustomSectionDefinition, SectionFieldDef } from '../../types/site';
import AppModal from '../ui/AppModal';
import SectionHeader from '../ui/SectionHeader';
import FilterPills from '../ui/FilterPills';
import { buildSectionFilterOptions } from '../../lib/sectionCategoriesMerge';
import { DEFAULT_SECTION_ICONS } from '../../lib/sectionRegistry';

type PreviewTab = 'page' | 'hub' | 'form';

interface SectionPreviewModalProps {
  section: CustomSectionDefinition;
  onClose: () => void;
}

const FIELD_TYPE_LABELS: Record<string, string> = {
  text: 'Текст',
  textarea: 'Многострочный',
  markdown: 'Markdown',
  category: 'Категория',
  icon: 'Иконка',
  number: 'Число',
  tags: 'Теги',
};

export default function SectionPreviewModal({ section, onClose }: SectionPreviewModalProps) {
  const [tab, setTab] = useState<PreviewTab>('page');
  const [filterCat, setFilterCat] = useState('all');

  const categories = section.categories?.length
    ? section.categories
    : [{ id: 'прочее', label: 'Прочее', icon: '✦' }];

  const iconChoices = section.iconChoices?.length ? section.iconChoices : DEFAULT_SECTION_ICONS;

  const mockArticles = useMemo(
    () => buildMockArticles(section, categories, iconChoices),
    [section, categories, iconChoices],
  );

  const filterOptions = useMemo(
    () => buildSectionFilterOptions(
      categories,
      mockArticles,
      a => a.categoryId,
      section.id,
    ),
    [categories, mockArticles, section.id],
  );

  const filteredArticles = filterCat === 'all'
    ? mockArticles
    : mockArticles.filter(a => a.categoryId === filterCat);

  const cardFields = section.fields.filter(f => f.showInCard !== false && !['content', 'icon'].includes(f.key));
  const formOnlyFields = section.fields.filter(f => f.showInCard === false || ['content'].includes(f.key));

  const checklist = useMemo(() => buildChecklist(section, categories), [section, categories]);

  return (
    <AppModal open onClose={onClose} layer="top" className="max-w-4xl w-full">
      <div className="flex flex-col max-h-[92vh] rounded-2xl overflow-hidden shadow-2xl border border-gold-500/25 bg-ink-800">
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-ink-700/50">
          <div>
            <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <span>{section.icon}</span>
              Превью: {section.label}
            </h2>
            <p className="text-ink-400 text-xs mt-1">
              Пример того, как раздел будет выглядеть на сайте. Данные карточек — демо.
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-2 text-ink-400 hover:text-white cursor-pointer shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-1 px-5 pt-3 border-b border-ink-700/30">
          {([
            ['page', 'Страница раздела'],
            ['hub', 'Карточка в вики-хабе'],
            ['form', 'Форма записи'],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`px-3 py-1.5 rounded-t-lg text-xs font-medium cursor-pointer transition-colors ${
                tab === id
                  ? 'bg-ink-900/80 text-gold-300 border border-b-0 border-gold-400/30'
                  : 'text-ink-400 hover:text-ink-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {tab === 'page' && (
            <div className="p-4 sm:p-5">
              <ChecklistPanel items={checklist} />
              <div className="mt-4 rounded-xl border border-ink-600/40 overflow-hidden bg-ink-900/40">
                <div className="px-3 py-2 bg-ink-900/60 border-b border-ink-700/40 flex items-center gap-2 text-[10px] text-ink-500">
                  <ExternalLink className="w-3 h-3" />
                  {section.path || `/${section.id}`}
                  {section.visible === false && (
                    <span className="ml-auto text-orange-400">Раздел скрыт</span>
                  )}
                </div>
                <div className="p-4 sm:p-6 scale-[0.98] origin-top">
                  <SectionHeader
                    sectionId={section.id}
                    icon={section.icon}
                    title={section.title || section.label}
                    subtitle={section.description || `Раздел «${section.label}»`}
                  />

                  <div className="mb-4 flex justify-end">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-400/15 text-gold-300 text-xs border border-gold-400/30">
                      <Plus className="w-3.5 h-3.5" /> Добавить запись
                    </span>
                  </div>

                  {categories.length > 0 && (
                    <FilterPills options={filterOptions} active={filterCat} onChange={setFilterCat} />
                  )}

                  {filteredArticles.length === 0 ? (
                    <p className="text-center text-ink-500 py-8 text-sm">В этой категории нет записей</p>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {filteredArticles.map(article => (
                        <PreviewArticleCard key={article.id} article={article} cardFields={cardFields} />
                      ))}
                    </div>
                  )}

                  {mockArticles.length === 0 && (
                    <div className="text-center py-6 border border-dashed border-ink-600/40 rounded-xl">
                      <Edit3 className="w-6 h-6 text-ink-600 mx-auto mb-2" />
                      <p className="text-ink-500 text-xs">Пустой раздел — кнопка «Добавить запись»</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === 'hub' && (
            <div className="p-4 sm:p-5 space-y-4">
              <ChecklistPanel items={checklist.filter(c => c.group === 'hub' || c.group === 'all')} />
              {section.showInWikiHub === false ? (
                <p className="text-orange-400/90 text-sm text-center py-8 border border-orange-400/20 rounded-xl bg-orange-400/5">
                  Раздел не будет показан в вики-хабе (снята галочка «Показывать в вики-хабе»).
                </p>
              ) : (
                <div className="max-w-sm mx-auto">
                  <p className="text-ink-500 text-[10px] mb-2 text-center">WWM-Вики Ру — сетка разделов</p>
                  <div className="bg-ink-800/60 border border-ink-700/30 rounded-xl p-4 ring-2 ring-gold-400/30">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{section.icon}</span>
                      <span className="font-serif text-white font-bold">{section.label}</span>
                    </div>
                    <p className="text-ink-400 text-sm">
                      {section.description || 'Добавьте описание — оно отображается здесь'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'form' && (
            <div className="p-4 sm:p-5 space-y-4">
              <ChecklistPanel items={checklist.filter(c => c.group === 'form' || c.group === 'all')} />
              <div className="rounded-xl border border-ink-600/40 bg-ink-900/50 p-4 space-y-3">
                <p className="text-ink-400 text-xs font-medium">Поля при создании записи</p>
                {section.fields.map(field => (
                  <PreviewFormField key={field.key} field={field} categories={categories} iconChoices={iconChoices} />
                ))}
                <div className="pt-2 border-t border-ink-700/40">
                  <p className="text-ink-500 text-[10px] mb-2">Загрузка изображений</p>
                  <div className="h-16 rounded-lg border border-dashed border-ink-600/50 bg-ink-900/40 flex items-center justify-center text-ink-600 text-xs">
                    ImageUploader
                  </div>
                </div>
              </div>

              {cardFields.length > 0 && (
                <div className="rounded-xl border border-jade-400/20 bg-jade-400/5 p-3">
                  <p className="text-jade-300 text-xs font-medium mb-1">На карточке записи видно:</p>
                  <p className="text-ink-400 text-[11px]">
                    {cardFields.map(f => f.label).join(' · ')}
                    {section.fields.some(f => f.key === 'category') ? ' · категория' : ''}
                  </p>
                </div>
              )}

              {formOnlyFields.length > 0 && (
                <div className="rounded-xl border border-ink-600/30 bg-ink-900/30 p-3">
                  <p className="text-ink-300 text-xs font-medium mb-1">Только в форме / при раскрытии:</p>
                  <p className="text-ink-500 text-[11px]">
                    {formOnlyFields.map(f => f.label).join(' · ')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppModal>
  );
}

function ChecklistPanel({ items }: { items: ChecklistItem[] }) {
  if (!items.length) return null;
  return (
    <div className="rounded-xl border border-ink-700/40 bg-ink-900/50 p-3 space-y-1.5">
      <p className="text-ink-300 text-xs font-medium mb-2">Что проверить</p>
      {items.map(item => (
        <div key={item.id} className={`flex items-start gap-2 text-[11px] ${item.ok ? 'text-jade-400/90' : 'text-orange-300/90'}`}>
          <span className="shrink-0">{item.ok ? '✓' : '○'}</span>
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  );
}

interface ChecklistItem {
  id: string;
  text: string;
  ok: boolean;
  group: 'all' | 'hub' | 'form' | 'page';
}

function buildChecklist(section: CustomSectionDefinition, categories: { id: string; label: string }[]): ChecklistItem[] {
  const hasDescription = Boolean(section.description?.trim());
  const hasCategories = categories.length > 0;
  const hasSummary = section.fields.some(f => f.key === 'summary' || (f.type === 'textarea' && f.showInCard !== false));
  const customFields = section.fields.filter(f => !['title', 'content', 'category', 'icon', 'summary'].includes(f.key));

  return [
    { id: 'desc', text: hasDescription ? 'Описание заполнено' : 'Добавьте описание — оно видно в шапке и вики-хабе', ok: hasDescription, group: 'all' },
    { id: 'hub', text: section.showInWikiHub !== false ? 'Раздел будет в вики-хабе' : 'Раздел скрыт из вики-хаба', ok: section.showInWikiHub !== false, group: 'hub' },
    { id: 'visible', text: section.visible !== false ? 'Раздел доступен по URL' : 'Раздел скрыт (не откроется на сайте)', ok: section.visible !== false, group: 'page' },
    { id: 'cats', text: hasCategories ? `Категории: ${categories.length}` : 'Добавьте категории для фильтров', ok: hasCategories, group: 'page' },
    { id: 'summary', text: hasSummary ? 'Краткое описание на карточках' : 'Нет поля summary — карточки покажут начало текста', ok: hasSummary, group: 'form' },
    { id: 'required', text: section.fields.filter(f => f.required).length
      ? `Обязательных полей: ${section.fields.filter(f => f.required).length}`
      : 'Нет обязательных полей', ok: true, group: 'form' },
    { id: 'custom', text: customFields.length
      ? `Доп. полей: ${customFields.length}`
      : 'Только стандартные поля вики', ok: true, group: 'form' },
  ];
}

interface MockArticle {
  id: string;
  title: string;
  summary: string;
  categoryId: string;
  categoryLabel: string;
  icon: string;
}

function buildMockArticles(
  section: CustomSectionDefinition,
  categories: { id: string; label: string; icon?: string }[],
  iconChoices: string[],
): MockArticle[] {
  const cat1 = categories[0];
  const cat2 = categories[1] || cat1;
  const titleField = section.fields.find(f => f.key === 'title');
  const summaryField = section.fields.find(f => f.key === 'summary' || (f.type === 'textarea' && f.showInCard !== false));

  return [
    {
      id: 'mock-1',
      title: titleField ? `Пример: ${titleField.label}` : 'Пример записи',
      summary: summaryField
        ? `Текст поля «${summaryField.label}» будет показан на карточке при свёрнутом виде.`
        : 'Краткое описание или начало содержания записи…',
      categoryId: cat1.id,
      categoryLabel: cat1.label,
      icon: iconChoices[0] || section.icon,
    },
    {
      id: 'mock-2',
      title: 'Вторая демо-запись',
      summary: 'Ещё одна карточка, чтобы показать сетку и фильтры по категориям.',
      categoryId: cat2.id,
      categoryLabel: cat2.label,
      icon: iconChoices[1] || iconChoices[0] || section.icon,
    },
  ];
}

function PreviewArticleCard({
  article,
  cardFields,
}: {
  article: MockArticle;
  cardFields: SectionFieldDef[];
}) {
  const [expanded, setExpanded] = useState(false);
  const extraFields = cardFields.filter(f => !['title', 'summary'].includes(f.key) && f.key !== 'category');

  return (
    <div
      onClick={() => setExpanded(v => !v)}
      className={`bg-ink-800/60 border rounded-xl p-3 transition-all cursor-pointer ${
        expanded ? 'border-gold-400/40' : 'border-ink-700/30'
      }`}
    >
      <div className="flex items-start gap-2">
        <span className="text-2xl shrink-0">{article.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <h3 className="font-serif font-bold text-white text-sm">{article.title}</h3>
            {expanded ? <ChevronUp className="w-4 h-4 text-gold-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-ink-400 shrink-0" />}
          </div>
          <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-gold-400/10 text-gold-400 border border-gold-400/30">
            {article.categoryLabel}
          </span>
          {!expanded && (
            <p className="text-ink-400 text-[11px] mt-2 line-clamp-2">{article.summary}</p>
          )}
          {extraFields.length > 0 && !expanded && (
            <p className="text-ink-600 text-[10px] mt-1">
              + {extraFields.map(f => f.label).join(', ')}
            </p>
          )}
          <p className="text-ink-600 text-[10px] mt-1">Автор · дата</p>
        </div>
      </div>
      {expanded && (
        <div className="mt-2 pt-2 border-t border-ink-700/30 text-ink-400 text-[11px]">
          <p className="italic text-ink-500 mb-1">Содержание (Markdown) — при раскрытии карточки</p>
          <p>Здесь будет полный текст записи из поля «Содержание».</p>
        </div>
      )}
    </div>
  );
}

function PreviewFormField({
  field,
  categories,
  iconChoices,
}: {
  field: SectionFieldDef;
  categories: { id: string; label: string; icon?: string }[];
  iconChoices: string[];
}) {
  const inputCls = 'w-full bg-ink-900/80 border border-ink-600/50 rounded-lg px-3 py-2 text-ink-500 text-xs';

  return (
    <div>
      <label className="text-gold-400/70 text-[10px] mb-1 block">
        {field.label}
        {field.required ? ' *' : ''}
        <span className="text-ink-600 ml-1">({FIELD_TYPE_LABELS[field.type] || field.type})</span>
        {field.showInCard === false && <span className="text-ink-600 ml-1">· не на карточке</span>}
      </label>
      {field.type === 'textarea' || field.type === 'markdown' ? (
        <div className={`${inputCls} min-h-[60px] flex items-center`}>
          {field.type === 'markdown' ? 'Редактор Markdown…' : `Поле «${field.label}»…`}
        </div>
      ) : field.type === 'category' ? (
        <select className={`${inputCls} cursor-default`} disabled>
          {categories.map(c => (
            <option key={c.id}>{c.icon ? `${c.icon} ` : ''}{c.label}</option>
          ))}
        </select>
      ) : field.type === 'icon' ? (
        <div className="flex gap-1 flex-wrap">
          {iconChoices.slice(0, 6).map(ic => (
            <span key={ic} className="w-8 h-8 rounded-lg bg-ink-900/80 border border-ink-600/40 flex items-center justify-center text-sm">
              {ic}
            </span>
          ))}
        </div>
      ) : (
        <div className={inputCls}>{field.placeholder || `…`}</div>
      )}
    </div>
  );
}
