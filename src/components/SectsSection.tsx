import { useState } from 'react';
import { sects, type Sect } from '../data/gameData';
import { Users, Shield, Scroll, ChevronRight, AlertTriangle, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SectsSection() {
  const [selectedSect, setSelectedSect] = useState<Sect | null>(null);
  const { user, progress, toggleFavoriteSect } = useAuth();

  const handleFavorite = (e: React.MouseEvent, sectId: string) => {
    e.stopPropagation();
    toggleFavoriteSect(sectId);
  };

  return (
    <section id="sects" className="py-20 bg-ink-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="text-gold-400 text-3xl mb-3">🏛️</div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">Секты Цзянху</h2>
          <p className="text-ink-300 max-w-xl mx-auto">
            8 уникальных фракций со своей философией, правилами и наградами. Каждая формирует ваш путь в мире
          </p>
          <div className="mt-4 h-px max-w-xs mx-auto bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sects List */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="font-serif text-lg font-bold text-gold-400 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" /> Выберите секту
            </h3>
            {sects.map(sect => {
              const isFavorite = progress.favoriteSects.includes(sect.id);
              return (
                <div
                  key={sect.id}
                  onClick={() => setSelectedSect(sect)}
                  className={`relative w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                    selectedSect?.id === sect.id
                      ? 'bg-gold-400/10 border-gold-400/40 shadow-lg shadow-gold-400/5'
                      : 'bg-ink-800/50 border-ink-700/30 hover:border-gold-700/30 hover:bg-ink-800/70'
                  }`}
                >
                  {/* Favorite Button */}
                  {user && (
                    <button
                      onClick={(e) => handleFavorite(e, sect.id)}
                      className={`absolute top-3 right-3 p-1.5 rounded-lg transition-all cursor-pointer z-10 ${
                        isFavorite 
                          ? 'text-gold-400 bg-gold-400/20' 
                          : 'text-ink-500 hover:text-gold-400 hover:bg-gold-400/10'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  )}

                  <div className="flex items-center gap-3 pr-8">
                    <span className="text-2xl">{sect.icon}</span>
                    <div>
                      <h4 className="font-serif font-bold text-white text-sm">{sect.name}</h4>
                      <p className="text-ink-400 text-xs">{sect.nameEn}</p>
                    </div>
                    {selectedSect?.id === sect.id && (
                      <ChevronRight className="w-4 h-4 text-gold-400 ml-auto" />
                    )}
                  </div>
                  <p className="text-ink-300 text-xs mt-2 line-clamp-1">{sect.theme}</p>
                </div>
              );
            })}
          </div>

          {/* Sect Detail */}
          <div className="lg:col-span-2">
            {selectedSect ? (
              <div className="bg-ink-800/60 border border-gold-400/20 rounded-xl p-6 animate-fadeIn sticky top-24">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-5xl">{selectedSect.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-serif text-2xl md:text-3xl font-bold text-white">{selectedSect.name}</h3>
                    <p className="text-ink-400">{selectedSect.nameEn}</p>
                    <p className="text-gold-400 text-sm mt-1">{selectedSect.theme}</p>
                  </div>
                  {user && (
                    <button
                      onClick={(e) => handleFavorite(e, selectedSect.id)}
                      className={`p-2 rounded-lg transition-all cursor-pointer ${
                        progress.favoriteSects.includes(selectedSect.id) 
                          ? 'text-gold-400 bg-gold-400/20' 
                          : 'text-ink-500 hover:text-gold-400 hover:bg-gold-400/10'
                      }`}
                    >
                      <Star className={`w-5 h-5 ${progress.favoriteSects.includes(selectedSect.id) ? 'fill-current' : ''}`} />
                    </button>
                  )}
                </div>

                <p className="text-ink-200 leading-relaxed mb-6">{selectedSect.description}</p>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Weapon */}
                  <div className="bg-ink-700/30 rounded-lg p-4">
                    <h4 className="text-gold-400 font-semibold text-sm mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Оружие / Боевое искусство
                    </h4>
                    <p className="text-ink-200 text-sm">{selectedSect.weapon}</p>
                  </div>

                  {/* How to Join */}
                  <div className="bg-jade-400/5 border border-jade-400/20 rounded-lg p-4">
                    <h4 className="text-jade-400 font-semibold text-sm mb-2 flex items-center gap-2">
                      <Scroll className="w-4 h-4" /> Как вступить
                    </h4>
                    <p className="text-ink-200 text-sm">{selectedSect.howToJoin}</p>
                  </div>
                </div>

                {/* Rules */}
                <div className="mt-4 bg-crimson-400/5 border border-crimson-400/20 rounded-lg p-4">
                  <h4 className="text-crimson-400 font-semibold text-sm mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Правила секты
                  </h4>
                  <ul className="space-y-2">
                    {selectedSect.rules.map((rule, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-ink-200">
                        <span className="text-crimson-400 mt-0.5">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div className="mt-4 bg-gold-400/5 border border-gold-400/20 rounded-lg p-4">
                  <h4 className="text-gold-400 font-semibold text-sm mb-3 flex items-center gap-2">
                    ✨ Преимущества
                  </h4>
                  <ul className="space-y-2">
                    {selectedSect.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-ink-200">
                        <span className="text-gold-400 mt-0.5">•</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-ink-800/40 border border-ink-700/20 rounded-xl p-12 text-center sticky top-24">
                <Users className="w-16 h-16 text-ink-600 mx-auto mb-4" />
                <h3 className="font-serif text-xl text-ink-400 mb-2">Выберите секту</h3>
                <p className="text-ink-500 text-sm">Нажмите на название секты слева, чтобы увидеть подробную информацию</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
