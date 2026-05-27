import { useState } from 'react';
import { weapons } from '../data/gameData';
import { Star, Target, Sparkles, Edit3, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import WikiArticleCards from './wiki/WikiArticleCards';
import SectionEditorModal, { type SectionEditorValues } from './ui/SectionEditorModal';
import { sectionEditorConfigs } from '../data/sectionEditorConfig';

export default function WeaponsSection() {
  const [filterType, setFilterType] = useState<string>('all');
  const [items, setItems] = useState(weapons);
  const [editWeaponId, setEditWeaponId] = useState<string | null>(null);
  const { progress, toggleFavoriteWeapon, isEditor, isAdmin } = useAuth();
  const canManage = isEditor() || isAdmin();
  const types = ['all', ...new Set(items.map(w => w.type))];
  const filtered = filterType === 'all' ? items : items.filter(w => w.type === filterType);
  const editingWeapon = editWeaponId ? items.find(w => w.id === editWeaponId) : null;
  const weaponEditorConfig = sectionEditorConfigs.weapons;

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
            <WeaponCard
              key={weapon.id}
              weapon={weapon}
              canManage={canManage}
              isFavorite={progress.favoriteWeapons.includes(weapon.id)}
              onToggleFavorite={() => toggleFavoriteWeapon(weapon.id)}
              onEdit={() => setEditWeaponId(weapon.id)}
              onDelete={() => {
                if (!confirm('Удалить карточку оружия?')) return;
                setItems(prev => prev.filter(x => x.id !== weapon.id));
              }}
            />
          ))}
          <WikiArticleCards sectionId="weapons" />
        </div>
      </div>
      {editingWeapon && weaponEditorConfig && (
        <SectionEditorModal
          config={weaponEditorConfig}
          storageFolder="weapons"
          isEdit
          initial={{
            title: editingWeapon.name,
            summary: editingWeapon.description,
            category: editingWeapon.type,
            icon: editingWeapon.icon,
            content: [
              `## Получение`,
              editingWeapon.howToGet,
              '',
              `## Секта`,
              editingWeapon.sect,
              '',
              `## Пара`,
              editingWeapon.pair,
            ].join('\n'),
            images: [],
          }}
          onSave={(values: SectionEditorValues) => {
            const lines = values.content.split('\n').map(l => l.trim()).filter(Boolean);
            const readAfter = (title: string) => {
              const idx = lines.findIndex(l => l.toLowerCase() === title.toLowerCase());
              return idx >= 0 ? (lines[idx + 1] || '') : '';
            };
            setItems(prev => prev.map(w => (
              w.id === editingWeapon.id
                ? {
                    ...w,
                    name: values.title,
                    description: values.summary || w.description,
                    type: values.category || w.type,
                    icon: values.icon || w.icon,
                    howToGet: readAfter('## Получение') || w.howToGet,
                    sect: readAfter('## Секта') || w.sect,
                    pair: readAfter('## Пара') || w.pair,
                  }
                : w
            )));
            setEditWeaponId(null);
          }}
          onCancel={() => setEditWeaponId(null)}
        />
      )}
    </section>
  );
}

function WeaponCard({
  weapon,
  isFavorite,
  onToggleFavorite,
  canManage,
  onEdit,
  onDelete,
}: {
  weapon: typeof weapons[0];
  isFavorite: boolean;
  onToggleFavorite: () => void;
  canManage: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div onClick={() => setExpanded(!expanded)}
      className={`relative bg-ink-800/60 border rounded-xl p-4 transition-all cursor-pointer ${expanded ? 'border-gold-400/40' : 'border-ink-700/30 hover:border-gold-700/30 card-hover'}`}>
      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl">{weapon.icon}</span>
        <div className="flex-1">
          <h3 className="font-serif font-bold text-white">{weapon.name}</h3>
          <p className="text-ink-400 text-xs">{weapon.nameEn}</p>
        </div>
        <button onClick={onToggleFavorite}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isFavorite ? 'text-gold-400' : 'text-ink-600 hover:text-gold-400'}`}>
          <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
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
