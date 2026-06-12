import { useState } from 'react';
import { Plus, RotateCcw, Settings2, Trash2, X } from 'lucide-react';
import FilterPills from './FilterPills';
import { buildSectionFilterOptions, type SectionCategoryDef } from '../../data/sectionCategories';
import { useSectionCategories } from '../../hooks/useSectionCategories';

interface SectionFilterBarProps<T> {
  sectionKey: string;
  items: T[];
  getCategoryId: (item: T) => string;
  active: string;
  onChange: (value: string) => void;
}

export default function SectionFilterBar<T>({
  sectionKey,
  items,
  getCategoryId,
  active,
  onChange,
}: SectionFilterBarProps<T>) {
  const { categories, addCategory, removeCategory, resetCategories, canManage } = useSectionCategories(sectionKey);
  const [showManager, setShowManager] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newIcon, setNewIcon] = useState('✦');

  const options = buildSectionFilterOptions(categories, items, item => getCategoryId(item as T));

  const handleAdd = () => {
    if (!newLabel.trim()) return;
    addCategory(newLabel, newIcon);
    setNewLabel('');
    setNewIcon('✦');
  };

  return (
    <div className="mb-8 space-y-3">
      <FilterPills options={options} active={active} onChange={onChange} />

      {canManage && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setShowManager(v => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gold-300/90 border border-gold-400/25 hover:bg-gold-400/10 cursor-pointer"
          >
            <Settings2 className="w-3.5 h-3.5" />
            {showManager ? 'Скрыть категории' : 'Управление категориями'}
          </button>
        </div>
      )}

      {canManage && showManager && (
        <CategoryManagerPanel
          categories={categories}
          newLabel={newLabel}
          newIcon={newIcon}
          onLabelChange={setNewLabel}
          onIconChange={setNewIcon}
          onAdd={handleAdd}
          onRemove={removeCategory}
          onReset={resetCategories}
          onClose={() => setShowManager(false)}
        />
      )}
    </div>
  );
}

function CategoryManagerPanel({
  categories,
  newLabel,
  newIcon,
  onLabelChange,
  onIconChange,
  onAdd,
  onRemove,
  onReset,
  onClose,
}: {
  categories: SectionCategoryDef[];
  newLabel: string;
  newIcon: string;
  onLabelChange: (v: string) => void;
  onIconChange: (v: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onReset: () => void;
  onClose: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto bg-ink-800/80 border border-gold-400/20 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-ink-200">Категории раздела — используются в фильтрах и при добавлении записей</p>
        <button type="button" onClick={onClose} className="p-1 text-ink-500 hover:text-white cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      <ul className="space-y-1.5 max-h-48 overflow-y-auto">
        {categories.map(cat => (
          <li
            key={cat.id}
            className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-ink-900/60 border border-ink-700/40 text-sm"
          >
            <span className="flex items-center gap-2 min-w-0 text-ink-200">
              <span>{cat.icon || '✦'}</span>
              <span className="truncate">{cat.label}</span>
              <span className="text-[10px] text-ink-600 truncate hidden sm:inline">({cat.id})</span>
            </span>
            <button
              type="button"
              onClick={() => {
                if (confirm(`Удалить категорию «${cat.label}»?`)) onRemove(cat.id);
              }}
              className="p-1 text-crimson-400/80 hover:text-crimson-300 cursor-pointer shrink-0"
              title="Удалить"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </li>
        ))}
      </ul>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={newIcon}
          onChange={e => onIconChange(e.target.value.slice(0, 4))}
          className="w-14 bg-ink-900/80 border border-ink-600/50 rounded-lg px-2 py-2 text-center text-lg focus:outline-none focus:border-gold-400/50"
          title="Иконка (эмодзи)"
        />
        <input
          type="text"
          value={newLabel}
          onChange={e => onLabelChange(e.target.value)}
          placeholder="Название новой категории"
          className="flex-1 bg-ink-900/80 border border-ink-600/50 rounded-lg px-3 py-2 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50"
          onKeyDown={e => { if (e.key === 'Enter') onAdd(); }}
        />
        <button
          type="button"
          onClick={onAdd}
          disabled={!newLabel.trim()}
          className="inline-flex items-center justify-center gap-1 px-4 py-2 rounded-lg bg-gold-400/15 text-gold-300 text-sm border border-gold-400/30 hover:bg-gold-400/25 cursor-pointer disabled:opacity-40"
        >
          <Plus className="w-4 h-4" /> Добавить
        </button>
      </div>

      <button
        type="button"
        onClick={() => { if (confirm('Вернуть категории по умолчанию?')) onReset(); }}
        className="inline-flex items-center gap-1 text-xs text-ink-500 hover:text-ink-300 cursor-pointer"
      >
        <RotateCcw className="w-3 h-3" /> Сбросить к умолчанию
      </button>
    </div>
  );
}
