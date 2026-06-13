import WikiArticleCards from './wiki/WikiArticleCards';
import { SECTION_ITEMS_LIST_CLASS } from './wiki/sectionLayout';
import SectionHeader from './ui/SectionHeader';

export default function LifeSkillsSection() {
  return (
    <section id="lifeskills" className="py-20 bg-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          sectionId="lifeskills"
          icon="🎨"
          title="Жизненные Навыки"
          subtitle="16 систем профессий формируют целостное общество древнего Китая — от ремесла до астрономии"
        />

        <div className={SECTION_ITEMS_LIST_CLASS}>
          <WikiArticleCards sectionId="lifeskills" />
        </div>

        <div className={`${SECTION_ITEMS_LIST_CLASS} mt-12 max-w-3xl`}>
          <div className="bg-ink-800/50 border border-ink-700/30 rounded-xl p-5">
            <h3 className="font-serif text-lg font-bold text-gold-400 mb-3">🍳 Кулинария</h3>
            <p className="text-ink-200 text-sm leading-relaxed">
              Готовьте блюда древнего Китая, используя ингредиенты со всего мира.
              Каждое блюдо даёт уникальные баффы: увеличение HP, регенерация, бонус к атаке или защите.
            </p>
          </div>
          <div className="bg-ink-800/50 border border-ink-700/30 rounded-xl p-5">
            <h3 className="font-serif text-lg font-bold text-gold-400 mb-3">🎣 Рыбалка</h3>
            <p className="text-ink-200 text-sm leading-relaxed">
              Более 20 рыболовных точек по всему миру. Редкие рыбы используются в высокоуровневых рецептах кулинарии.
            </p>
          </div>
          <div className="bg-ink-800/50 border border-ink-700/30 rounded-xl p-5">
            <h3 className="font-serif text-lg font-bold text-gold-400 mb-3">🏗️ Архитектура</h3>
            <p className="text-ink-200 text-sm leading-relaxed">
              Проектируйте и стройте свои здания в стиле древнекитайской архитектуры.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
