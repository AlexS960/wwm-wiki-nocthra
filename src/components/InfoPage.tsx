import { useAuth } from '../context/AuthContext';
import { ArrowRight, Wrench } from 'lucide-react';

interface InfoPageProps {
  onBack: () => void;
  onSection: (sectionId: string) => void;
  isEmbedded?: boolean;
}

export default function InfoPage({ onBack, onSection }: InfoPageProps) {
  const { siteSettings } = useAuth();

  const sections = [
    { id: 'weapons', title: 'Оружие', desc: 'Каталог оружия с характеристиками и способами получения', icon: '⚔️', color: 'from-blue-400/10 to-blue-400/5 border-blue-400/20' },
    { id: 'builds', title: 'Билды', desc: '6 уникальных путей развития персонажа', icon: '🛤️', color: 'from-gold-400/10 to-gold-400/5 border-gold-400/20' },
    { id: 'sects', title: 'Секты', desc: 'Фракции с уникальными способностями и оружием', icon: '🏛️', color: 'from-purple-400/10 to-purple-400/5 border-purple-400/20' },
    { id: 'bosses', title: 'Боссы', desc: 'Стратегии, награды и советы по всем боссам', icon: '👹', color: 'from-crimson-400/10 to-crimson-400/5 border-crimson-400/20' },
    { id: 'mystic', title: 'Мистические Арты', desc: 'Мощные способности различных стихий', icon: '✨', color: 'from-cyan-400/10 to-cyan-400/5 border-cyan-400/20' },
    { id: 'map', title: 'Карта Мира', desc: 'Интерактивная карта с ключевыми локациями', icon: '🗺️', color: 'from-jade-400/10 to-jade-400/5 border-jade-400/20' },
    { id: 'cooking', title: 'Готовка', desc: 'Рецепты блюд для лечения и баффов', icon: '🍳', color: 'from-orange-400/10 to-orange-400/5 border-orange-400/20' },
    { id: 'tips', title: 'Советы и Коды', desc: 'Полезные советы и актуальные промокоды', icon: '💡', color: 'from-yellow-400/10 to-yellow-400/5 border-yellow-400/20' },
  ];

  return (
    <div className="min-h-screen bg-ink-900 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <button onClick={onBack} className="flex items-center gap-2 text-ink-400 hover:text-gold-400 transition-colors mb-8 cursor-pointer">
          ← На главную
        </button>

        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">📚 База Знаний</h1>
          <p className="text-ink-300 max-w-xl mx-auto">Выберите раздел для изучения</p>
          <div className="mt-4 h-px max-w-xs mx-auto bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sections.map(section => {
            const secSettings = siteSettings.sections.find(s => s.id === section.id);
            const isMaintenance = secSettings?.maintenance || false;

            return (
              <button
                key={section.id}
                onClick={() => !isMaintenance && onSection(section.id)}
                disabled={isMaintenance}
                className={`bg-gradient-to-br ${section.color} border rounded-xl p-5 text-left transition-all ${
                  isMaintenance
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:scale-[1.02] cursor-pointer card-hover group'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{section.icon}</span>
                  <div>
                    <h3 className={`font-serif font-bold ${isMaintenance ? 'text-ink-500' : 'text-white group-hover:text-gold-400 transition-colors'}`}>
                      {section.title}
                    </h3>
                  </div>
                </div>
                <p className="text-ink-400 text-xs mb-3">
                  {isMaintenance ? 'На технических работах' : section.desc}
                </p>
                {isMaintenance ? (
                  <span className="inline-flex items-center gap-1 text-orange-400 text-xs font-medium">
                    <Wrench className="w-3 h-3" /> Техработы
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-gold-400 text-xs font-medium group-hover:gap-2 transition-all">
                    Открыть раздел <ArrowRight className="w-3 h-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
