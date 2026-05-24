import { useState } from 'react';
import WikiArticleCards from './wiki/WikiArticleCards';
import { recipes, type Recipe } from '../data/extendedData';
import { ChefHat, Heart, Zap, Clock } from 'lucide-react';

export default function CookingSection() {
  const [filterCategory, setFilterCategory] = useState<'all' | 'healing' | 'buff'>('all');

  const filtered = filterCategory === 'all' ? recipes : recipes.filter(r => r.category === filterCategory);

  return (
    <section id="cooking" className="py-20 bg-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-gold-400 text-3xl mb-3">🍳</div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">Кулинария и Рецепты</h2>
          <p className="text-ink-300 max-w-xl mx-auto">
            20+ блюд для восстановления здоровья и получения баффов. Готовьте у костров по всему миру
          </p>
          <div className="mt-4 h-px max-w-xs mx-auto bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
        </div>

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
        <div className="flex justify-center gap-2 mb-8">
          {[
            { id: 'all', label: 'Все', icon: '🍽️' },
            { id: 'healing', label: 'Исцеление', icon: '❤️' },
            { id: 'buff', label: 'Баффы', icon: '⚡' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterCategory(f.id as typeof filterCategory)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                filterCategory === f.id
                  ? 'bg-gold-400/20 text-gold-400 border border-gold-400/40'
                  : 'bg-ink-800/50 text-ink-300 border border-ink-700/30 hover:text-gold-300'
              }`}
            >
              <span>{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>

        {/* Recipes Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
          <WikiArticleCards sectionId="cooking" />
        </div>
      </div>
    </section>
  );
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div 
      onClick={() => setExpanded(!expanded)}
      className={`bg-ink-800/60 border rounded-xl p-4 transition-all cursor-pointer ${
        expanded ? 'border-gold-400/40' : 'border-ink-700/30 hover:border-gold-700/30 card-hover'
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl">{recipe.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-serif font-bold text-white text-sm">{recipe.name}</h3>
          <p className="text-ink-400 text-xs">{recipe.nameEn}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-2">
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

      <p className="text-jade-400 text-sm font-medium mb-2">{recipe.effect}</p>

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
            <p className="text-ink-300 text-xs">{recipe.howToUnlock}</p>
          </div>
        </div>
      )}
    </div>
  );
}
