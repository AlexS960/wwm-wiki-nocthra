import { useState } from 'react';
import WikiArticleCards from './wiki/WikiArticleCards';
import RichText, { RichInline } from './ui/RichText';
import { recipes, type Recipe } from '../data/extendedData';
import { ChefHat, Heart, Zap, Clock, Edit3, Trash2 } from 'lucide-react';
import { useSectionOverrides } from '../hooks/useSectionOverrides';
import { useSectionCategories } from '../hooks/useSectionCategories';
import SectionHeader from './ui/SectionHeader';
import SectionFilterBar from './ui/SectionFilterBar';
import SectionEditorModal, { type SectionEditorValues } from './ui/SectionEditorModal';
import { sectionEditorConfigs } from '../data/sectionEditorConfig';

export default function CookingSection() {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [editId, setEditId] = useState<string | null>(null);
  const { items, persistItems, canManage } = useSectionOverrides('cooking', recipes);
  const { categories } = useSectionCategories('cooking');
  const cookingConfig = sectionEditorConfigs.cooking;
  const editingItem = editId ? items.find(r => r.id === editId) : null;

  const filtered = filterCategory === 'all' ? items : items.filter(r => r.category === filterCategory);

  return (
    <section id="cooking" className="py-20 bg-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          sectionId="cooking"
          icon="🍳"
          title="Кулинария и Рецепты"
          subtitle="20+ блюд для восстановления здоровья и получения баффов. Готовьте у костров по всему миру"
        />

        {/* Info Card */}
        <div className="bg-ink-800/50 border border-gold-400/20 rounded-xl p-5 mb-8 max-w-2xl mx-auto">
          <h3 className="font-serif text-lg font-bold text-gold-400 mb-3 flex items-center gap-2">
            <ChefHat className="w-5 h-5" /> Основы кулинарии
          </h3>
          <ul className="space-y-2 text-sm text-ink-200">
            <li className="flex items-start gap-2">
              <span className="text-gold-400">•</span>
              <span><b>Костры с котлами</b> — ищите у поселений, точек отдыха и лагерей</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-400">•</span>
              <span><b>Выносливость:</b> максимум 2,500, восстановление 450/день в 5:00 утра</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-400">•</span>
              <span><b>Ингредиенты:</b> охота, собирательство, рыбалка, покупка у торговцев</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-400">•</span>
              <span><b>Рецепты разблокируются</b> через квесты, рыболовные конкурсы и достижение уровней</span>
            </li>
          </ul>
        </div>

        {/* Filter */}
        <SectionFilterBar
          sectionKey="cooking"
          items={items}
          getCategoryId={r => r.category}
          active={filterCategory}
          onChange={v => setFilterCategory(v)}
        />

        {/* Recipes Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              canManage={canManage}
              onEdit={() => setEditId(recipe.id)}
              onDelete={() => {
                if (!confirm('Удалить рецепт?')) return;
                persistItems(items.filter(x => x.id !== recipe.id));
              }}
            />
          ))}
          <WikiArticleCards sectionId="cooking" categoryFilter={filterCategory} />
        </div>
      </div>
      {editingItem && cookingConfig && (
        <SectionEditorModal
          config={cookingConfig}
          storageFolder="cooking"
          categoryOptions={categories}
          isEdit
          initial={{
            title: editingItem.name,
            summary: editingItem.effect,
            category: editingItem.category === 'healing' ? 'Рецепт' : 'Бафф',
            icon: editingItem.icon,
            content: [
              '## Уровень',
              String(editingItem.level),
              '',
              '## Выносливость',
              editingItem.stamina,
              '',
              '## Ингредиенты',
              ...editingItem.ingredients.map(x => `- ${x}`),
              '',
              '## Разблокировка',
              editingItem.howToUnlock,
            ].join('\n'),
            images: [],
          }}
          onSave={(values: SectionEditorValues) => {
            const lines = values.content.split('\n').map(l => l.trim());
            const line = (header: string) => {
              const idx = lines.findIndex(l => l.toLowerCase() === header.toLowerCase());
              return idx >= 0 ? (lines[idx + 1] || '') : '';
            };
            const list = (header: string) => {
              const idx = lines.findIndex(l => l.toLowerCase() === header.toLowerCase());
              if (idx < 0) return [];
              const out: string[] = [];
              for (let i = idx + 1; i < lines.length; i++) {
                const cur = lines[i];
                if (!cur) continue;
                if (cur.startsWith('## ')) break;
                if (cur.startsWith('- ')) out.push(cur.slice(2).trim());
              }
              return out;
            };
            persistItems(items.map(r => (
              r.id === editingItem.id
                ? {
                    ...r,
                    name: values.title,
                    effect: values.summary || r.effect,
                    icon: values.icon || r.icon,
                    level: Number(line('## Уровень')) || r.level,
                    stamina: line('## Выносливость') || r.stamina,
                    ingredients: list('## Ингредиенты').length ? list('## Ингредиенты') : r.ingredients,
                    howToUnlock: line('## Разблокировка') || r.howToUnlock,
                  }
                : r
            )));
            setEditId(null);
          }}
          onCancel={() => setEditId(null)}
        />
      )}
    </section>
  );
}

function RecipeCard({
  recipe,
  canManage,
  onEdit,
  onDelete,
}: {
  recipe: Recipe;
  canManage: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div 
      onClick={() => setExpanded(!expanded)}
      className={`relative bg-ink-800/60 border rounded-xl p-4 transition-all cursor-pointer ${
        expanded ? 'border-gold-400/40' : 'border-ink-700/30 hover:border-gold-700/30 card-hover'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl shrink-0 leading-none">{recipe.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-serif font-bold text-white text-sm">{recipe.name}</h3>
          <p className="text-ink-400 text-xs mt-0.5">{recipe.nameEn}</p>
          <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
            <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
              recipe.category === 'healing'
                ? 'bg-crimson-400/10 text-crimson-400'
                : 'bg-blue-400/10 text-blue-400'
            }`}>
              {recipe.category === 'healing' ? <Heart className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
              {recipe.category === 'healing' ? 'Исцеление' : 'Бафф'}
            </span>
            <span className="text-xs bg-ink-700/50 text-ink-300 px-2 py-0.5 rounded-full">
              Ур. {recipe.level}
            </span>
            <span className="text-xs bg-ink-700/50 text-ink-300 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3" /> {recipe.stamina}
            </span>
          </div>
          <RichText content={recipe.effect} variant="compact" className="mt-1.5 text-jade-400 [&_p]:text-jade-400 [&_p]:font-medium" />
        </div>
      </div>
      {canManage && (
        <div className="absolute top-3 right-3 flex items-center gap-1 z-10" onClick={e => e.stopPropagation()}>
          <button onClick={onEdit} className="p-1.5 rounded-md text-gold-300 border border-gold-400/30 hover:bg-gold-400/10 cursor-pointer" title="Редактировать">
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button onClick={onDelete} className="p-1.5 rounded-md text-crimson-300 border border-crimson-400/30 hover:bg-crimson-400/10 cursor-pointer" title="Удалить">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {expanded && (
        <div className="mt-3 pt-3 border-t border-ink-700/30 space-y-2 animate-fadeIn">
          <div>
            <h4 className="text-gold-400 font-semibold text-xs mb-1">Ингредиенты:</h4>
            <div className="flex flex-wrap gap-1">
              {recipe.ingredients.map((ing, i) => (
                <span key={i} className="text-xs bg-ink-700/50 text-ink-200 px-2 py-0.5 rounded-full">
                  {ing}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-gold-400 font-semibold text-xs mb-1">Разблокировка:</h4>
            <RichText content={recipe.howToUnlock} />
          </div>
        </div>
      )}
    </div>
  );
}
