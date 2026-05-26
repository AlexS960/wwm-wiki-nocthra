import { useState } from 'react';
import { buildPaths, type BuildPath } from '../data/gameData';
import { ChevronDown, ChevronUp, Check, X as XIcon, Zap, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import WikiArticleCards from './wiki/WikiArticleCards';

export default function BuildsSection() {
  const [expandedBuild, setExpandedBuild] = useState<string | null>(null);
  const { user, progress, setSelectedBuild } = useAuth();

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
          {buildPaths.map(build => (
            <BuildCard
              key={build.id}
              build={build}
              isExpanded={expandedBuild === build.id}
              onToggle={() => setExpandedBuild(expandedBuild === build.id ? null : build.id)}
              isSelected={progress.selectedBuild === build.id}
              onSelect={(e) => handleSelectBuild(e, build.id)}
              showSelectButton={!!user}
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
    </section>
  );
}

interface BuildCardProps {
  build: BuildPath;
  isExpanded: boolean;
  onToggle: () => void;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  showSelectButton: boolean;
}

function BuildCard({ build, isExpanded, onToggle, isSelected, onSelect, showSelectButton }: BuildCardProps) {
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
            className={`absolute top-4 right-4 p-2 rounded-lg transition-all cursor-pointer z-10 ${
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
