import { useAuth } from '../context/AuthContext';
import {
  BookOpen, Sword, Map, ChefHat, Sparkles, Users, ExternalLink,
  Crown, Shield, Scroll, Star, ArrowRight, Flame
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onInfoSection: (sectionId: string) => void;
}

export default function HomePage({ onNavigate, onInfoSection }: HomePageProps) {
  const { siteSettings, isAdmin } = useAuth();

  // Show maintenance overlay
  if (siteSettings.maintenanceMode && !isAdmin()) {
    return (
      <div className="min-h-screen bg-ink-900 pt-20 pb-16 flex items-center justify-center">
        <div className="text-center">
          <Flame className="w-20 h-20 text-gold-400 mx-auto mb-6 animate-pulse" />
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">Технические работы</h1>
          <p className="text-ink-400 max-w-md mx-auto mb-8">{siteSettings.siteDescription}</p>
          <p className="text-ink-500 text-sm">Сайт скоро вернётся. Спасибо за ожидание.</p>
        </div>
      </div>
    );
  }

  const infoSections = [
    { id: 'weapons', title: 'Оружие', desc: 'Каталог оружия с характеристиками и способами получения', icon: <Sword className="w-6 h-6" />, emoji: '⚔️' },
    { id: 'builds', title: 'Билды', desc: '6 уникальных путей развития персонажа', icon: <Star className="w-6 h-6" />, emoji: '🛤️' },
    { id: 'sects', title: 'Секты', desc: 'Фракции с уникальными способностями', icon: <Users className="w-6 h-6" />, emoji: '🏛️' },
    { id: 'bosses', title: 'Боссы', desc: 'Стратегии, награды и советы по всем боссам', icon: <Flame className="w-6 h-6" />, emoji: '👹' },
    { id: 'mystic', title: 'Мистические Арты', desc: 'Мощные способности различных стихий', icon: <Sparkles className="w-6 h-6" />, emoji: '✨' },
    { id: 'map', title: 'Карта Мира', desc: 'Интерактивная карта с ключевыми локациями', icon: <Map className="w-6 h-6" />, emoji: '🗺️' },
    { id: 'cooking', title: 'Готовка', desc: 'Рецепты блюд для лечения и баффов', icon: <ChefHat className="w-6 h-6" />, emoji: '🍳' },
    { id: 'tips', title: 'Советы и Коды', desc: 'Полезные советы и актуальные промокоды', icon: <Scroll className="w-6 h-6" />, emoji: '💡' },
  ];

  return (
    <div className="min-h-screen bg-ink-900">
      {/* Hero */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-400/5 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-6 bg-gold-400/10 border border-gold-400/20 rounded-full px-4 py-1.5 text-sm text-gold-400">
              <Crown className="w-4 h-4" /> Гильдия Nocthra представляет
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {siteSettings.siteName}
            </h1>
            <p className="text-ink-300 text-lg md:text-xl mb-8 max-w-xl mx-auto">
              {siteSettings.siteDescription}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={() => onNavigate('guides')}
                className="flex items-center gap-2 px-6 py-3 bg-gold-400/20 text-gold-400 border border-gold-400/40 rounded-xl font-medium hover:bg-gold-400/30 transition-all cursor-pointer w-full sm:w-auto justify-center">
                <BookOpen className="w-5 h-5" /> Гайды и руководства
              </button>
              <button onClick={() => onNavigate('info')}
                className="flex items-center gap-2 px-6 py-3 bg-ink-800/50 text-ink-200 border border-ink-700/30 rounded-xl font-medium hover:bg-ink-700/50 transition-all cursor-pointer w-full sm:w-auto justify-center">
                <Shield className="w-5 h-5" /> База знаний
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements */}
      {siteSettings.announcements.length > 0 && (
        <section className="pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
            {siteSettings.announcements.map(ann => {
              const styles: Record<string, string> = {
                info: 'border-blue-400/30 bg-blue-400/5 text-blue-400',
                warning: 'border-orange-400/30 bg-orange-400/5 text-orange-400',
                success: 'border-jade-400/30 bg-jade-400/5 text-jade-400',
              };
              return (
                <div key={ann.id} className={`rounded-xl p-4 border ${styles[ann.type]}`}>
                  <p className="text-sm">{ann.text}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Info Sections Grid */}
      <section className="py-12 bg-ink-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">База Знаний</h2>
            <p className="text-ink-400">Вся информация об игре в одном месте</p>
            <div className="mt-4 h-px max-w-xs mx-auto bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {infoSections.map(section => {
              const secSettings = siteSettings.sections.find(s => s.id === section.id);
              const isMaintenance = secSettings?.maintenance || false;
              return (
                <button key={section.id} onClick={() => !isMaintenance && onInfoSection(section.id)}
                  disabled={isMaintenance}
                  className={`bg-ink-800/60 border rounded-xl p-5 text-left transition-all ${
                    isMaintenance
                      ? 'border-orange-400/20 opacity-60 cursor-not-allowed'
                      : 'border-ink-700/30 hover:border-gold-400/30 card-hover cursor-pointer group'
                  }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{section.emoji}</span>
                    <h3 className={`font-serif font-bold ${isMaintenance ? 'text-ink-500' : 'text-white group-hover:text-gold-400 transition-colors'}`}>
                      {section.title}
                    </h3>
                    {isMaintenance && <span className="text-[9px] bg-orange-400/10 text-orange-400 px-1.5 py-0.5 rounded">Техработы</span>}
                  </div>
                  <p className="text-ink-400 text-xs mb-3">{isMaintenance ? 'Раздел временно недоступен' : section.desc}</p>
                  {!isMaintenance && (
                    <span className="inline-flex items-center gap-1 text-gold-400 text-xs font-medium group-hover:gap-2 transition-all">
                      Открыть <ArrowRight className="w-3 h-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Guild */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-purple-400/5 to-ink-800/50 border border-purple-400/20 rounded-2xl p-6 md:p-8 text-center">
            <h2 className="font-serif text-2xl font-bold text-purple-300 mb-3">Гильдия Nocthra</h2>
            <p className="text-ink-300 max-w-lg mx-auto text-sm leading-relaxed">
              Мы — русскоязычное сообщество игроков Where Winds Meet. Создаём гайды, помогаем новичкам и развиваем базу знаний.
              Присоединяйтесь к нам!
            </p>
            <a href={siteSettings.discordUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-purple-400/10 text-purple-300 border border-purple-400/30 rounded-xl text-sm font-medium hover:bg-purple-400/20 transition-all cursor-pointer">
              <ExternalLink className="w-4 h-4" /> Discord сервер
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
