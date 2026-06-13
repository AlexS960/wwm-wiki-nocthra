import { ChefHat } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';
import SectionWikiBody from './wiki/SectionWikiBody';

export default function CookingSection() {
  return (
    <section id="cooking" className="py-20 bg-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          sectionId="cooking"
          icon="🍳"
          title="Кулинария и Рецепты"
          subtitle="20+ блюд для восстановления здоровья и получения бафов. Готовьте у костров по всему миру"
        />

        <div className="bg-ink-800/50 border border-gold-400/20 rounded-xl p-5 mb-8 max-w-2xl mx-auto">
          <h3 className="font-serif text-lg font-bold text-gold-400 mb-3 flex items-center gap-2">
            <ChefHat className="w-5 h-5" /> Основы кулинарии
          </h3>
          <ul className="space-y-2 text-sm text-ink-200">
            <li className="flex items-start gap-2"><span className="text-gold-400">•</span><span><b>Костры с котлами</b> — ищите у поселений, точек отдыха и лагерей</span></li>
            <li className="flex items-start gap-2"><span className="text-gold-400">•</span><span><b>Выносливость:</b> максимум 2,500, восстановление 450/день в 5:00 утра</span></li>
            <li className="flex items-start gap-2"><span className="text-gold-400">•</span><span><b>Ингредиенты:</b> охота, собирательство, рыбалка, покупка у торговцев</span></li>
            <li className="flex items-start gap-2"><span className="text-gold-400">•</span><span><b>Рецепты разблокируются</b> через квесты, рыболовные конкурсы и достижение уровней</span></li>
          </ul>
        </div>

        <SectionWikiBody sectionId="cooking" />
      </div>
    </section>
  );
}
