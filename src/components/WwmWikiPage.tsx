import { ArrowLeft, BookOpen } from 'lucide-react';
import { useAuthState } from '../context/AuthContext';
import { resolveAllWikiSections } from '../lib/sectionRegistry';
import type { NavigatePayload } from './Header';

interface WwmWikiPageProps {
  onNavigate: (section: string, payload?: NavigatePayload) => void;
  onBack?: () => void;
}

export default function WwmWikiPage({ onNavigate, onBack }: WwmWikiPageProps) {
  const { siteSettings } = useAuthState();
  const sections = resolveAllWikiSections(siteSettings);

  return (
    <main className="pt-16 md:pt-20 pb-12">
      <div className="bg-ink-800/60 border-b border-ink-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-1.5 rounded-lg text-ink-400 hover:text-gold-400 hover:bg-ink-700/50 cursor-pointer transition-colors"
              aria-label="Назад"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            <h1 className="font-serif text-lg font-bold text-white">WWM Вики</h1>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <p className="text-ink-300 max-w-2xl mx-auto">
            Все разделы собраны на одной странице. Выберите нужный раздел кнопкой ниже.
          </p>
          <div className="mt-4 h-px max-w-xs mx-auto bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sections.map(section => (
            <button
              key={section.id}
              type="button"
              onClick={() => onNavigate(section.id)}
              className="hover-glow-btn surface-card text-left border rounded-xl p-4 hover:border-gold-500/40 hover:bg-gold-500/5 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{section.icon}</span>
                <span className="font-serif text-white font-bold">{section.label}</span>
              </div>
              <p className="text-ink-400 text-sm">{section.description}</p>
            </button>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-ink-500 text-xs">
          <BookOpen className="w-3.5 h-3.5" />
          Нажатие на кнопку откроет выбранный раздел
        </div>
      </section>
    </main>
  );
}
