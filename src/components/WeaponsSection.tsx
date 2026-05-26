import { useState } from 'react';
import { weapons } from '../data/gameData';
import { Star, Target, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import WikiArticleCards from './wiki/WikiArticleCards';

export default function WeaponsSection() {
  const [filterType, setFilterType] = useState<string>('all');
  const { progress, toggleFavoriteWeapon } = useAuth();
  const types = ['all', ...new Set(weapons.map(w => w.type))];
  const filtered = filterType === 'all' ? weapons : weapons.filter(w => w.type === filterType);

  return (
    <section id="weapons" className="py-20 bg-ink-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-gold-400 text-3xl mb-3">⚔️</div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">Оружие</h2>
          <p className="text-ink-300 max-w-xl mx-auto">Каталог оружия с характеристиками, навыками и способами получения</p>
          <div className="mt-4 h-px max-w-xs mx-auto bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {types.map(t => (
            <button key={t} onClick={() => setFilterType(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${filterType === t ? 'bg-gold-400/20 text-gold-400 border border-gold-400/40' : 'bg-ink-800/50 text-ink-300 border border-ink-700/30 hover:text-gold-300'}`}>
              {t === 'all' ? 'Все' : t}
            </button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(weapon => (
            <WeaponCard key={weapon.id} weapon={weapon} isFavorite={progress.favoriteWeapons.includes(weapon.id)} onToggleFavorite={() => toggleFavoriteWeapon(weapon.id)} />
          ))}
          <WikiArticleCards sectionId="weapons" />
        </div>
      </div>
    </section>
  );
}

function WeaponCard({ weapon, isFavorite, onToggleFavorite }: { weapon: typeof weapons[0]; isFavorite: boolean; onToggleFavorite: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div onClick={() => setExpanded(!expanded)}
      className={`bg-ink-800/60 border rounded-xl p-4 transition-all cursor-pointer ${expanded ? 'border-gold-400/40' : 'border-ink-700/30 hover:border-gold-700/30 card-hover'}`}>
      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl">{weapon.icon}</span>
        <div className="flex-1">
          <h3 className="font-serif font-bold text-white">{weapon.name}</h3>
          <p className="text-ink-400 text-xs">{weapon.nameEn}</p>
        </div>
        <button onClick={e => { e.stopPropagation(); onToggleFavorite(); }}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isFavorite ? 'text-gold-400' : 'text-ink-600 hover:text-gold-400'}`}>
          <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        <span className="text-xs bg-ink-700/50 text-ink-300 px-2 py-0.5 rounded-full">{weapon.type}</span>
        <span className="text-xs bg-ink-700/50 text-ink-300 px-2 py-0.5 rounded-full">{weapon.role}</span>
        <span className="text-xs bg-gold-400/10 text-gold-400 px-2 py-0.5 rounded-full">{weapon.martialArt}</span>
      </div>
      <p className="text-ink-300 text-xs mb-2">{weapon.description}</p>
      {expanded && (
        <div className="mt-3 pt-3 border-t border-ink-700/30 space-y-2 animate-fadeIn">
          <div><h4 className="text-gold-400 font-semibold text-xs mb-1 flex items-center gap-1"><Target className="w-3 h-3" /> Получение</h4><p className="text-ink-300 text-xs">{weapon.howToGet}</p></div>
          <div><h4 className="text-gold-400 font-semibold text-xs mb-1 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Секта</h4><p className="text-ink-300 text-xs">{weapon.sect}</p></div>
          <div><h4 className="text-gold-400 font-semibold text-xs mb-1">Пара</h4><p className="text-ink-300 text-xs">{weapon.pair}</p></div>
        </div>
      )}
    </div>
  );
}
