import { useState } from 'react';
import { buildPaths, type BuildPath } from '../data/gameData';
import { ChevronDown, ChevronUp, Check, X as XIcon, Zap, Star, Edit3, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import WikiArticleCards from './wiki/WikiArticleCards';
import SectionEditorModal, { type SectionEditorValues } from './ui/SectionEditorModal';
import { sectionEditorConfigs } from '../data/sectionEditorConfig';

export default function BuildsSection() {
  const [expandedBuild, setExpandedBuild] = useState<string | null>(null);
  const [items, setItems] = useState(buildPaths);
  const [editId, setEditId] = useState<string | null>(null);
  const { user, progress, setSelectedBuild, isEditor, isAdmin } = useAuth();
  const canManage = isEditor() || isAdmin();
  const buildConfig = sectionEditorConfigs.builds;
  const editingBuild = editId ? items.find(b => b.id === editId) : null;

  const handleSelectBuild = (e: React.MouseEvent, buildId: string) => {
    e.stopPropagation();
    setSelectedBuild(progress.selectedBuild === buildId ? null : buildId);
  };

  return (
    <section id="builds" className="py-20 bg-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="text-gold-400 text-3xl mb-3">🛤️</div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">Пути Развития (Build Paths)</h2>
          <p className="text-ink-300 max-w-xl mx-auto">
            6 уникальных путей боя — от ближнего DPS до целителя. Выберите свой стиль
          </p>
          {user && progress.selectedBuild && (
            <p className="text-gold-400 text-sm mt-2">
              ⭐ Мой билд: {buildPaths.find(b => b.id === progress.selectedBuild)?.name}
            </p>
          )}
          <div className="mt-4 h-px max-w-xs mx-auto bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
        </div>

        {/* Build Paths Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(build => (
            <BuildCard
              key={build.id}
              build={build}
              canManage={canManage}
              isExpanded={expandedBuild === build.id}
              onToggle={() => setExpandedBuild(expandedBuild === build.id ? null : build.id)}
              isSelected={progress.selectedBuild === build.id}
              onSelect={(e) => handleSelectBuild(e, build.id)}
              showSelectButton={!!user}
              onEdit={() => setEditId(build.id)}
              onDelete={() => {
                if (!confirm('Удалить этот билд?')) return;
                setItems(prev => prev.filter(x => x.id !== build.id));
              }}
            />
          ))}
          <WikiArticleCards sectionId="builds" />
        </div>

        {/* Comparison hint */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 bg-ink-800/50 border border-ink-700/30 rounded-full px-5 py-3 text-sm text-ink-300">
            <Zap className="w-4 h-4 text-gold-400" />
            <span>
              {user
                ? 'Нажмите ⭐ чтобы выбрать свой билд, или раскройте карточку для деталей'
                : 'Нажмите на карточку для просмотра деталей каждого билда'}
            </span>
          </div>
        </div>
      </div>
      {editingBuild && buildConfig && (
        <SectionEditorModal
          config={buildConfig}
          storageFolder="builds"
          isEdit
          initial={{
            title: editingBuild.name,
            summary: editingBuild.description,
            category: editingBuild.role,
            icon: editingBuild.icon,
            content: [
              '## Оружие',
              ...editingBuild.weapons.map(w => `- ${w}`),
              '',
              `## Сильные стороны`,
              ...editingBuild.strengths.map(s => `- ${s}`),
              '',
              '## Слабые стороны',
              ...editingBuild.weaknesses.map(w => `- ${w}`),
            ].join('\n'),
            images: [],
          }}
          onSave={(values: SectionEditorValues) => {
            const lines = values.content.split('\n').map(l => l.trim());
            const pullList = (header: string) => {
              const idx = lines.findIndex(l => l.toLowerCase() === header.toLowerCase());
              if (idx < 0) return [];
              const out: string[] = [];
              for (let i = idx + 1; i < lines.length; i++) {
                const line = lines[i];
                if (!line) continue;
                if (line.startsWith('## ')) break;
                if (line.startsWith('- ')) out.push(line.slice(2).trim());
              }
              return out;
            };
            setItems(prev => prev.map(b => (
              b.id === editingBuild.id
                ? {
                    ...b,
                    name: values.title,
                    description: values.summary || b.description,
                    role: values.category || b.role,
                    icon: values.icon || b.icon,
                    weapons: pullList('## Оружие').length ? pullList('## Оружие') : b.weapons,
                    strengths: pullList('## Сильные стороны').length ? pullList('## Сильные стороны') : b.strengths,
                    weaknesses: pullList('## Слабые стороны').length ? pullList('## Слабые стороны') : b.weaknesses,
                  }
                : b
            )));
            setEditId(null);
          }}
          onCancel={() => setEditId(null)}
        />
      )}
    </section>
  );
}

interface BuildCardProps {
  build: BuildPath;
  canManage: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  showSelectButton: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

function BuildCard({ build, canManage, isExpanded, onToggle, isSelected, onSelect, showSelectButton, onEdit, onDelete }: BuildCardProps) {
  const diffColor: Record<string, string> = {
    'Низкая': 'text-jade-400 bg-jade-400/10',
    'Средняя': 'text-gold-400 bg-gold-400/10',
    'Высокая': 'text-crimson-400 bg-crimson-400/10',
  };

  return (
    <div className={`relative bg-ink-800/60 border rounded-xl overflow-hidden transition-all duration-300 ${
      isSelected 
        ? 'border-gold-400/60 ring-1 ring-gold-400/30' 
        : isExpanded 
          ? 'border-gold-400/40' 
          : 'border-ink-700/30 hover:border-gold-700/30 card-hover'
    }`}>
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-400/0 via-gold-400 to-gold-400/0" />
      )}

      <div className="relative">
        <button onClick={onToggle} className="w-full text-left p-5 cursor-pointer">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 pr-8">
              <span className="text-3xl">{build.icon}</span>
              <div>
                <h3 className={`font-serif text-lg font-bold ${isSelected ? 'text-gold-400' : 'text-white'}`}>
                  {build.name}
                </h3>
                <span className="text-sm text-gold-400">{build.role}</span>
              </div>
            </div>
            {canManage && (
              <div className="absolute top-4 right-4 flex gap-1 z-20" onClick={e => e.stopPropagation()}>
                <button onClick={onEdit} className="p-1.5 rounded-md text-gold-300 border border-gold-400/30 hover:bg-gold-400/10 cursor-pointer" title="Редактировать">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button onClick={onDelete} className="p-1.5 rounded-md text-crimson-300 border border-crimson-400/30 hover:bg-crimson-400/10 cursor-pointer" title="Удалить">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            {isExpanded ? <ChevronUp className="w-5 h-5 text-ink-400" /> : <ChevronDown className="w-5 h-5 text-ink-400" />}
          </div>

          {/* Difficulty & Weapons */}
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-1 rounded-full ${diffColor[build.difficulty]}`}>
              Сложность: {build.difficulty}
            </span>
            {isSelected && (
              <span className="text-xs px-2 py-1 rounded-full bg-gold-400/20 text-gold-400 flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" /> Мой билд
              </span>
            )}
          </div>

          {/* Weapons Tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {build.weapons.map(w => (
              <span key={w} className="text-xs bg-ink-700/50 text-ink-200 px-2 py-0.5 rounded-full">
                {w}
              </span>
            ))}
          </div>
        </button>

        {/* Favorite / Select Button */}
        {showSelectButton && (
          <button
            onClick={onSelect}
            className={`absolute ${canManage ? 'top-14' : 'top-4'} right-4 p-2 rounded-lg transition-all cursor-pointer z-10 ${
              isSelected
                ? 'text-gold-400 bg-gold-400/20 shadow-md shadow-gold-400/10'
                : 'text-ink-500 hover:text-gold-400 hover:bg-gold-400/10'
            }`}
            title={isSelected ? 'Убрать из избранного' : 'Выбрать как мой билд'}
          >
            <Star className={`w-5 h-5 ${isSelected ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-5 pb-5 animate-fadeIn">
          <div className="border-t border-ink-700/30 pt-4 space-y-4">
            {/* Description */}
            <p className="text-ink-200 text-sm leading-relaxed">{build.description}</p>

            {/* Strengths */}
            <div>
              <h4 className="text-jade-400 font-semibold text-sm mb-2">✅ Сильные стороны</h4>
              <div className="space-y-1">
                {build.strengths.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-ink-200">
                    <Check className="w-3 h-3 text-jade-400 shrink-0" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weaknesses */}
            <div>
              <h4 className="text-crimson-400 font-semibold text-sm mb-2">❌ Слабые стороны</h4>
              <div className="space-y-1">
                {build.weaknesses.map((w, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-ink-200">
                    <XIcon className="w-3 h-3 text-crimson-400 shrink-0" />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Select as My Build Button */}
            {showSelectButton && (
              <button
                onClick={onSelect}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all cursor-pointer font-medium text-sm ${
                  isSelected
                    ? 'bg-gold-400/20 text-gold-400 border border-gold-400/40'
                    : 'bg-ink-700/50 text-ink-300 border border-ink-600/30 hover:bg-gold-400/10 hover:text-gold-400 hover:border-gold-400/40'
                }`}
              >
                <Star className={`w-4 h-4 ${isSelected ? 'fill-current' : ''}`} />
                {isSelected ? 'Это мой текущий билд' : 'Выбрать как мой билд'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
