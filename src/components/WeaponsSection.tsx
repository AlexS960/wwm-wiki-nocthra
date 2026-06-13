import { useMemo, useState } from 'react';
import { weapons } from '../data/gameData';
import { Star, Target, Sparkles, Edit3, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSectionOverrides } from '../hooks/useSectionOverrides';
import { useSectionCategories } from '../hooks/useSectionCategories';
import WikiArticleCards from './wiki/WikiArticleCards';
import RichText from './ui/RichText';
import SectionHeader from './ui/SectionHeader';
import SectionFilterBar from './ui/SectionFilterBar';
import SectionEditorModal, { type SectionEditorValues } from './ui/SectionEditorModal';
import { sectionEditorConfigs } from '../data/sectionEditorConfig';

export default function WeaponsSection() {
  const [filterType, setFilterType] = useState<string>('all');
  const [editWeaponId, setEditWeaponId] = useState<string | null>(null);
  const { progress, toggleFavoriteWeapon, wikiArticles } = useAuth();
  const { items, persistItems, canManage } = useSectionOverrides('weapons', weapons);
  const { categories, matchesFilter, normalizeId, getLabel } = useSectionCategories('weapons');

  const sectionArticles = useMemo(
    () => wikiArticles.filter(a => a.section === 'weapons'),
    [wikiArticles],
  );

  const filterItems = useMemo(
    () => [
      ...items.map(w => ({ categoryId: w.type })),
      ...sectionArticles.map(a => ({ categoryId: a.fields?.category || '' })),
    ],
    [items, sectionArticles],
  );

  const filtered = useMemo(
    () => (filterType === 'all' ? items : items.filter(w => matchesFilter(w.type, filterType))),
    [items, filterType, matchesFilter],
  );

  const editingWeapon = editWeaponId ? items.find(w => w.id === editWeaponId) : null;
  const weaponEditorConfig = sectionEditorConfigs.weapons;

  return (
    <section id="weapons" className="py-20 bg-ink-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          sectionId="weapons"
          icon="⚔️"
          title="Оружие"
          subtitle="Каталог оружия с характеристиками, навыками и способами получения"
        />
        <SectionFilterBar
          sectionKey="weapons"
          items={filterItems}
          getCategoryId={x => x.categoryId}
          active={filterType}
          onChange={setFilterType}
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(weapon => (
            <WeaponCard
              key={weapon.id}
              weapon={weapon}
              typeLabel={getLabel(weapon.type)}
              canManage={canManage}
              isFavorite={progress.favoriteWeapons.includes(weapon.id)}
              onToggleFavorite={() => toggleFavoriteWeapon(weapon.id)}
              onEdit={() => setEditWeaponId(weapon.id)}
              onDelete={() => {
                if (!confirm('Удалить карточку оружия?')) return;
                persistItems(items.filter(x => x.id !== weapon.id));
              }}
            />
          ))}
          <WikiArticleCards
            sectionId="weapons"
            categoryFilter={filterType}
            isFavorite={id => progress.favoriteWeapons.includes(id)}
            onToggleFavorite={toggleFavoriteWeapon}
          />
        </div>
      </div>
      {editingWeapon && weaponEditorConfig && (
        <SectionEditorModal
          config={weaponEditorConfig}
          storageFolder="weapons"
          categoryOptions={categories}
          isEdit
          initial={{
            title: editingWeapon.name,
            summary: editingWeapon.description,
            category: normalizeId(editingWeapon.type),
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
            const nextType = normalizeId(values.category);
            persistItems(items.map(w => (
              w.id === editingWeapon.id
                ? {
                    ...w,
                    name: values.title,
                    description: values.summary || w.description,
                    type: nextType || w.type,
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
  typeLabel,
  isFavorite,
  onToggleFavorite,
  canManage,
  onEdit,
  onDelete,
}: {
  weapon: typeof weapons[0];
  typeLabel: string;
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
      <div className="flex items-start gap-3">
        <span className="text-3xl shrink-0 leading-none">{weapon.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-serif font-bold text-white break-words leading-snug">{weapon.name}</h3>
          <p className="text-ink-400 text-xs break-words mt-0.5">{weapon.nameEn}</p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <span className="text-xs bg-ink-700/50 text-ink-300 px-2 py-0.5 rounded-full">{typeLabel}</span>
            <span className="text-xs bg-ink-700/50 text-ink-300 px-2 py-0.5 rounded-full">{weapon.role}</span>
            <span className="text-xs bg-gold-400/10 text-gold-400 px-2 py-0.5 rounded-full">{weapon.martialArt}</span>
          </div>
          <RichText content={weapon.description} variant="compact" className="mt-1.5" />
        </div>
        <div className="flex flex-col items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
          {canManage && (
            <>
              <button type="button" onClick={onEdit} className="p-1.5 rounded-md text-gold-300 border border-gold-400/30 hover:bg-gold-400/10 cursor-pointer" title="Редактировать">
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button type="button" onClick={onDelete} className="p-1.5 rounded-md text-crimson-300 border border-crimson-400/30 hover:bg-crimson-400/10 cursor-pointer" title="Удалить">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <button
            type="button"
            onClick={onToggleFavorite}
            className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
              isFavorite
                ? 'text-gold-400 border-gold-400/40 bg-gold-400/10'
                : 'text-ink-500 border-ink-600/40 hover:text-gold-400 hover:border-gold-400/30'
            }`}
            title={isFavorite ? 'Убрать из избранного' : 'В избранное'}
          >
            <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
      {expanded && (
        <div className="mt-3 pt-3 border-t border-ink-700/30 space-y-2 animate-fadeIn">
          <div><h4 className="text-gold-400 font-semibold text-xs mb-1 flex items-center gap-1"><Target className="w-3 h-3" /> Получение</h4><RichText content={weapon.howToGet} /></div>
          <div><h4 className="text-gold-400 font-semibold text-xs mb-1 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Секта</h4><RichText content={weapon.sect} /></div>
          <div><h4 className="text-gold-400 font-semibold text-xs mb-1">Пара</h4><RichText content={weapon.pair} /></div>
        </div>
      )}
    </div>
  );
}
