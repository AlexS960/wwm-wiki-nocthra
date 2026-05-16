import { ChevronDown } from 'lucide-react';
import { GuildBadgeHero } from './GuildBadge';

interface HeroSectionProps {
  onNavigate?: (section: string) => void;
}

export default function HeroSection({ onNavigate: _onNavigate }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/images/hero-bg.jpg" 
          alt="Where Winds Meet" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/60 via-ink-900/40 to-ink-900" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16 md:pt-20">
        <div className="animate-fadeInUp">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold text-white text-shadow-glow mb-4">
            Where Winds Meet
          </h1>
          <p className="font-serif text-xl sm:text-2xl md:text-3xl text-gold-300 text-shadow mb-2">
            Там, Где Встречаются Ветра
          </p>
          <p className="text-ink-200 text-base sm:text-lg max-w-2xl mx-auto mb-8">
            Полная русскоязычная база знаний: гайды, интерактивная карта, секты, оружие, билды и всё для освоения мира Цзянху
          </p>
        </div>

        {/* Guild Nocthra Badge */}
        <div className="mb-6">
          <GuildBadgeHero />
        </div>

        {/* Discord Button */}
        <div className="mb-10 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
          <a
            href="https://discord.gg/mYqKkN3u4"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-xl
                       bg-[#5865F2]/20 border border-[#5865F2]/40 backdrop-blur-sm
                       hover:bg-[#5865F2]/30 hover:border-[#5865F2]/60 hover:scale-105
                       transition-all duration-300 group"
          >
            <svg className="w-5 h-5 text-[#5865F2] group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
              <div className="text-left">
              <div className="text-white font-semibold text-sm group-hover:text-white transition-colors">
                Nocthra
              </div>
              <div className="text-[#5865F2]/70 text-xs group-hover:text-[#5865F2] transition-colors">
                Присоединиться в Discord
              </div>
            </div>
          </a>
        </div>

        {/* Stats */}
        <div className="max-w-4xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.7s' }}>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 bg-ink-900/40 backdrop-blur-sm rounded-2xl border border-gold-700/20 px-4 py-5">
            <StatItem value="7" label="Оружий" />
            <StatItem value="6" label="Билдов" />
            <StatItem value="8" label="Сект" />
            <StatItem value="15+" label="Боссов" />
            <StatItem value="40+" label="Арт" />
            <StatItem value="20+" label="Рецептов" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-12 animate-float">
          <ChevronDown className="w-6 h-6 text-gold-400/60 mx-auto" />
        </div>
      </div>

      {/* Bottom decorative border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
    </section>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="group">
      <div className="font-serif text-xl md:text-2xl font-bold text-gold-400 group-hover:text-gold-300 transition-colors">{value}</div>
      <div className="text-ink-400 text-[10px] md:text-xs mt-0.5">{label}</div>
    </div>
  );
}
