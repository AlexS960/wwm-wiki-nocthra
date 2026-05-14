import { useState } from 'react';
import { mysticArts, innerWays, type MysticArt, type InnerWay } from '../data/extendedData';
import { Sparkles, Flame, ChevronRight } from 'lucide-react';

export default function MysticArtsSection() {
  const [activeTab, setActiveTab] = useState<'mystic' | 'inner'>('mystic');
  const [selectedArt, setSelectedArt] = useState<MysticArt | null>(null);
  const [selectedInner, setSelectedInner] = useState<InnerWay | null>(null);

  const priorityColor: Record<string, string> = {
    'Must-Have': 'text-crimson-400 bg-crimson-400/10 border-crimson-400/30',
    'Recommended': 'text-gold-400 bg-gold-400/10 border-gold-400/30',
    'Optional': 'text-ink-300 bg-ink-700/50 border-ink-600/30',
  };

  const tierColor: Record<string, string> = {
    'SS': 'text-purple-400 bg-purple-400/10 border-purple-400/40',
    'S': 'text-gold-400 bg-gold-400/10 border-gold-400/40',
    'A': 'text-blue-400 bg-blue-400/10 border-blue-400/40',
    'B': 'text-ink-300 bg-ink-700/50 border-ink-600/40',
  };

  return (
    <section id="mystic" className="py-20 bg-ink-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-gold-400 text-3xl mb-3">✨</div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">Мистические Искусства и Inner Ways</h2>
          <p className="text-ink-300 max-w-xl mx-auto">
            40+ мистических искусств и 37 пассивных способностей для создания уникального билда
          </p>
          <div className="mt-4 h-px max-w-xs mx-auto bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('mystic')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'mystic'
                ? 'bg-gold-400/20 text-gold-400 border border-gold-400/40'
                : 'bg-ink-800/50 text-ink-300 border border-ink-700/30 hover:text-gold-300'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Mystic Arts
          </button>
          <button
            onClick={() => setActiveTab('inner')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'inner'
                ? 'bg-gold-400/20 text-gold-400 border border-gold-400/40'
                : 'bg-ink-800/50 text-ink-300 border border-ink-700/30 hover:text-gold-300'
            }`}
          >
            <Flame className="w-4 h-4" />
            Inner Ways
          </button>
        </div>

        {/* Mystic Arts Tab */}
        {activeTab === 'mystic' && (
          <div className="grid lg:grid-cols-3 gap-6 animate-fadeIn">
            {/* List */}
            <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {mysticArts.map(art => (
                <button
                  key={art.id}
                  onClick={() => setSelectedArt(art)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedArt?.id === art.id
                      ? 'bg-gold-400/10 border-gold-400/40'
                      : 'bg-ink-800/50 border-ink-700/30 hover:border-gold-700/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{art.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-bold text-white text-sm truncate">{art.name}</h4>
                      <p className="text-ink-400 text-xs">{art.nameEn}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${priorityColor[art.priority]}`}>
                      {art.priority === 'Must-Have' ? '★★★' : art.priority === 'Recommended' ? '★★' : '★'}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Detail */}
            <div className="lg:col-span-2">
              {selectedArt ? (
                <div className="bg-ink-800/60 border border-gold-400/20 rounded-xl p-6 sticky top-24 animate-fadeIn">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-5xl">{selectedArt.icon}</span>
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-white">{selectedArt.name}</h3>
                      <p className="text-ink-400">{selectedArt.nameEn}</p>
                      <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full border ${priorityColor[selectedArt.priority]}`}>
                        {selectedArt.priority}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-crimson-400/5 border border-crimson-400/20 rounded-lg p-4">
                      <h4 className="text-crimson-400 font-semibold text-sm mb-2">⚔️ В бою</h4>
                      <p className="text-ink-200 text-sm">{selectedArt.combatEffect}</p>
                    </div>
                    <div className="bg-jade-400/5 border border-jade-400/20 rounded-lg p-4">
                      <h4 className="text-jade-400 font-semibold text-sm mb-2">🌍 Вне боя</h4>
                      <p className="text-ink-200 text-sm">{selectedArt.utilityEffect || 'Нет эффекта вне боя'}</p>
                    </div>
                  </div>

                  <div className="mt-4 bg-gold-400/5 border border-gold-400/20 rounded-lg p-4">
                    <h4 className="text-gold-400 font-semibold text-sm mb-2 flex items-center gap-1">
                      <ChevronRight className="w-4 h-4" /> Как получить
                    </h4>
                    <p className="text-ink-200 text-sm">{selectedArt.howToUnlock}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-ink-800/40 border border-ink-700/20 rounded-xl p-12 text-center">
                  <Sparkles className="w-12 h-12 text-ink-600 mx-auto mb-3" />
                  <p className="text-ink-400">Выберите Mystic Art для просмотра деталей</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Inner Ways Tab */}
        {activeTab === 'inner' && (
          <div className="grid lg:grid-cols-3 gap-6 animate-fadeIn">
            {/* List */}
            <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {innerWays.map(inner => (
                <button
                  key={inner.id}
                  onClick={() => setSelectedInner(inner)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedInner?.id === inner.id
                      ? 'bg-gold-400/10 border-gold-400/40'
                      : 'bg-ink-800/50 border-ink-700/30 hover:border-gold-700/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{inner.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-bold text-white text-sm truncate">{inner.name}</h4>
                      <p className="text-ink-400 text-xs">{inner.nameEn}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${tierColor[inner.tier]}`}>
                      {inner.tier}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Detail */}
            <div className="lg:col-span-2">
              {selectedInner ? (
                <div className="bg-ink-800/60 border border-gold-400/20 rounded-xl p-6 sticky top-24 animate-fadeIn">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-5xl">{selectedInner.icon}</span>
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-white">{selectedInner.name}</h3>
                      <p className="text-ink-400">{selectedInner.nameEn}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${tierColor[selectedInner.tier]}`}>
                          Тир {selectedInner.tier}
                        </span>
                        <span className="text-xs bg-ink-700/50 text-ink-300 px-2 py-0.5 rounded-full">
                          {selectedInner.type === 'universal' ? '🌐 Универсальный' : '⚔️ Для оружия'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-400/5 border border-purple-400/20 rounded-lg p-4 mb-4">
                    <h4 className="text-purple-400 font-semibold text-sm mb-2">✨ Эффект</h4>
                    <p className="text-ink-200 text-sm">{selectedInner.effect}</p>
                  </div>

                  <div className="bg-gold-400/5 border border-gold-400/20 rounded-lg p-4 mb-4">
                    <h4 className="text-gold-400 font-semibold text-sm mb-2">📍 Как получить</h4>
                    <p className="text-ink-200 text-sm">{selectedInner.howToGet}</p>
                  </div>

                  <div>
                    <h4 className="text-jade-400 font-semibold text-sm mb-2">✅ Лучше всего для</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedInner.bestFor.map((b, i) => (
                        <span key={i} className="text-xs bg-jade-400/10 text-jade-400 px-2 py-0.5 rounded-full">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-ink-800/40 border border-ink-700/20 rounded-xl p-12 text-center">
                  <Flame className="w-12 h-12 text-ink-600 mx-auto mb-3" />
                  <p className="text-ink-400">Выберите Inner Way для просмотра деталей</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
