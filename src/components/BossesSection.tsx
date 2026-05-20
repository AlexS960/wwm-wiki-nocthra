import { useState } from 'react';
import { bosses, type Boss } from '../data/extendedData';
import { MapPin, ChevronDown, ChevronUp, Target, Gift, Lightbulb } from 'lucide-react';

export default function BossesSection() {
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const types = [
    { id: 'all', label: 'Все', icon: '👹' },
    { id: 'campaign', label: 'Сюжетные', icon: '📖' },
    { id: 'world', label: 'Мировые', icon: '🌍' },
  ];

  const filtered = filterType === 'all' ? bosses : bosses.filter(b => b.type === filterType);

  const diffColor: Record<string, string> = {
    'Лёгкая': 'text-jade-400 bg-jade-400/10',
    'Лёгкая-Средняя': 'text-jade-400 bg-jade-400/10',
    'Средняя': 'text-gold-400 bg-gold-400/10',
    'Средняя-Высокая': 'text-orange-400 bg-orange-400/10',
    'Высокая': 'text-crimson-400 bg-crimson-400/10',
    'Очень высокая': 'text-purple-400 bg-purple-400/10',
  };

  return (
    <section id="bosses" className="py-20 bg-ink-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-gold-400 text-3xl mb-3">👹</div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">Боссы и Стратегии</h2>
          <p className="text-ink-300 max-w-xl mx-auto">
            Полное руководство по всем боссам: локации, стратегии, награды и советы
          </p>
          <div className="mt-4 h-px max-w-xs mx-auto bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {types.map(t => (
            <button
              key={t.id}
              onClick={() => setFilterType(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                filterType === t.id
                  ? 'bg-gold-400/20 text-gold-400 border border-gold-400/40'
                  : 'bg-ink-800/50 text-ink-300 border border-ink-700/30 hover:text-gold-300'
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Bosses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(boss => (
            <div
              key={boss.id}
              onClick={() => setSelectedBoss(selectedBoss?.id === boss.id ? null : boss)}
              className={`bg-ink-800/60 border rounded-xl p-4 transition-all cursor-pointer ${
                selectedBoss?.id === boss.id
                  ? 'border-gold-400/40 bg-gold-400/5'
                  : 'border-ink-700/30 hover:border-gold-700/30 card-hover'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{boss.icon}</span>
                  <div>
                    <h3 className="font-serif font-bold text-white">{boss.name}</h3>
                    <p className="text-ink-400 text-xs">{boss.nameEn}</p>
                  </div>
                </div>
                {selectedBoss?.id === boss.id ? (
                  <ChevronUp className="w-5 h-5 text-gold-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-ink-400" />
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${diffColor[boss.difficulty] || ''}`}>
                  {boss.difficulty}
                </span>
                <span className="text-xs bg-ink-700/50 text-ink-300 px-2 py-0.5 rounded-full">
                  Ур. {boss.level}
                </span>
                <span className="text-xs bg-ink-700/50 text-ink-300 px-2 py-0.5 rounded-full">
                  {boss.type === 'campaign' ? '📖 Сюжет' : '🌍 Мировой'}
                </span>
              </div>

              <div className="flex items-center gap-1 text-ink-400 text-xs">
                <MapPin className="w-3 h-3" />
                <span>{boss.region} — {boss.location}</span>
              </div>

              {/* Expanded Content */}
              {selectedBoss?.id === boss.id && (
                <div className="mt-4 pt-4 border-t border-ink-700/30 space-y-4 animate-fadeIn">
                  {/* Strategy */}
                  <div>
                    <h4 className="text-gold-400 font-semibold text-sm mb-2 flex items-center gap-1">
                      <Target className="w-4 h-4" /> Стратегия
                    </h4>
                    <ul className="space-y-1.5">
                      {boss.strategy.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-ink-200">
                          <span className="text-gold-400 mt-0.5">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Rewards */}
                  <div>
                    <h4 className="text-jade-400 font-semibold text-sm mb-2 flex items-center gap-1">
                      <Gift className="w-4 h-4" /> Награды
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {boss.rewards.map((r, i) => (
                        <span key={i} className="text-xs bg-jade-400/10 text-jade-400 px-2 py-0.5 rounded-full">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="bg-gold-400/5 border border-gold-400/20 rounded-lg p-3">
                    <h4 className="text-gold-400 font-semibold text-sm mb-2 flex items-center gap-1">
                      <Lightbulb className="w-4 h-4" /> Советы
                    </h4>
                    <ul className="space-y-1">
                      {boss.tips.map((t, i) => (
                        <li key={i} className="text-sm text-ink-200">★ {t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
