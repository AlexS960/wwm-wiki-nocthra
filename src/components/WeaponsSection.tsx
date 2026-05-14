import { useState } from 'react';
import { Swords, Shield, Heart, Target, ChevronRight, Info, Star } from 'lucide-react';
import { weapons, type Weapon } from '../data/gameData';
import { useAuth } from '../context/AuthContext';

export default function WeaponsSection() {
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
  const [filterType, setFilterType] = useState<string>('Все');
  const { user, progress, toggleFavoriteWeapon } = useAuth();

  const types = ['Все', ...new Set(weapons.map(w => w.type))];
  const filtered = filterType === 'Все' ? weapons : weapons.filter(w => w.type === filterType);

  const roleIcon = (role: string) => {
    if (role.includes('Танк')) return <Shield className="w-4 h-4" />;
    if (role.includes('Целитель')) return <Heart className="w-4 h-4" />;
    if (role.includes('Дальний')) return <Target className="w-4 h-4" />;
    return <Swords className="w-4 h-4" />;
  };

  const roleColor = (role: string) => {
    if (role.includes('Танк')) return 'text-blue-400';
    if (role.includes('Целитель')) return 'text-emerald-400';
    if (role.includes('Дальний')) return 'text-purple-400';
    if (role.includes('DoT')) return 'text-red-400';
    return 'text-orange-400';
  };

  const handleFavorite = (e: React.MouseEvent, weaponId: string) => {
    e.stopPropagation();
    toggleFavoriteWeapon(weaponId);
  };

  return (
    <section id="weapons" className="py-20 bg-ink-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="text-gold-400 text-3xl mb-3">⚔️</div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">Арсенал Оружия</h2>
          <p className="text-ink-300 max-w-xl mx-auto">
            7 типов оружия, 12+ боевых искусств — от мечей до зонтов. Каждое определяет ваш стиль боя
          </p>
          <div className="mt-4 h-px max-w-xs mx-auto bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
        </div>

        {/* Type Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                filterType === t
                  ? 'bg-gold-400/20 text-gold-400 border border-gold-400/40'
                  : 'bg-ink-800/50 text-ink-300 border border-ink-700/30 hover:text-gold-300 hover:border-gold-700/40'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Weapons Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(weapon => {
            const isFavorite = progress.favoriteWeapons.includes(weapon.id);
            return (
              <div
                key={weapon.id}
                onClick={() => setSelectedWeapon(selectedWeapon?.id === weapon.id ? null : weapon)}
                className={`relative text-left bg-ink-800/60 border rounded-xl p-4 transition-all duration-300 card-hover cursor-pointer ${
                  selectedWeapon?.id === weapon.id 
                    ? 'border-gold-400/50 bg-gold-400/5' 
                    : 'border-ink-700/30 hover:border-gold-700/40'
                }`}
              >
                {/* Favorite Button */}
                {user && (
                  <button
                    onClick={(e) => handleFavorite(e, weapon.id)}
                    className={`absolute top-3 right-3 p-1.5 rounded-lg transition-all cursor-pointer ${
                      isFavorite 
                        ? 'text-gold-400 bg-gold-400/20' 
                        : 'text-ink-500 hover:text-gold-400 hover:bg-gold-400/10'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{weapon.icon}</span>
                  <div className="flex-1 min-w-0 pr-6">
                    <h3 className="font-serif font-bold text-white text-sm truncate">{weapon.name}</h3>
                    <p className="text-ink-400 text-xs">{weapon.nameEn}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`flex items-center gap-1 text-xs font-medium ${roleColor(weapon.role)}`}>
                    {roleIcon(weapon.role)}
                    {weapon.role}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs bg-ink-700/50 text-ink-300 px-2 py-0.5 rounded-full">{weapon.type}</span>
                  <span className="text-xs bg-ink-700/50 text-ink-300 px-2 py-0.5 rounded-full">{weapon.martialArt}</span>
                </div>
                <div className="mt-3 flex items-center gap-1 text-gold-400/60 text-xs">
                  <Info className="w-3 h-3" />
                  <span>Нажмите для подробностей</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Weapon Detail */}
        {selectedWeapon && (
          <div className="mt-8 bg-ink-800/70 border border-gold-400/30 rounded-xl p-6 animate-fadeInUp">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{selectedWeapon.icon}</span>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-white">{selectedWeapon.name}</h3>
                    <p className="text-ink-400">{selectedWeapon.nameEn}</p>
                  </div>
                </div>
                <p className="text-ink-200 leading-relaxed mb-4">{selectedWeapon.description}</p>
                <div className="space-y-2">
                  <DetailRow label="Тип" value={selectedWeapon.type} />
                  <DetailRow label="Роль" value={selectedWeapon.role} />
                  <DetailRow label="Боевое искусство" value={selectedWeapon.martialArt} />
                  <DetailRow label="Парное оружие" value={selectedWeapon.pair} />
                </div>
              </div>
              <div>
                <div className="bg-ink-700/30 rounded-lg p-4 mb-4">
                  <h4 className="text-gold-400 font-semibold text-sm mb-2 flex items-center gap-2">
                    <ChevronRight className="w-4 h-4" /> Связанная секта
                  </h4>
                  <p className="text-ink-200 text-sm">{selectedWeapon.sect}</p>
                </div>
                <div className="bg-jade-400/5 border border-jade-400/20 rounded-lg p-4">
                  <h4 className="text-jade-400 font-semibold text-sm mb-2 flex items-center gap-2">
                    <ChevronRight className="w-4 h-4" /> Как получить
                  </h4>
                  <p className="text-ink-200 text-sm">{selectedWeapon.howToGet}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="text-ink-400 w-32 shrink-0">{label}:</span>
      <span className="text-ink-200">{value}</span>
    </div>
  );
}
