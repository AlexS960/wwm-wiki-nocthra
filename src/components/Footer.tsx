import { Scroll, ExternalLink } from 'lucide-react';
import { GuildBadgeFooter } from './GuildBadge';

export default function Footer() {
  return (
    <footer className="bg-ink-900 border-t border-gold-700/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo & Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Scroll className="w-5 h-5 text-gold-400" />
              <span className="font-serif text-gold-400 text-lg font-bold">WWM Wiki</span>
            </div>
            <p className="text-ink-400 text-sm leading-relaxed">
              Русскоязычная база знаний по игре Where Winds Meet.
              Создана и поддерживается гильдией <span className="font-serif font-bold text-purple-300">Nocthra</span>.
            </p>
            <p className="text-ink-500 text-xs mt-3">
              Where Winds Meet © Everstone Studio / NetEase Games. 
              Все права на игру принадлежат правообладателям.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-gold-400 font-bold mb-4">Разделы</h3>
            <ul className="space-y-2">
              {['Гайды', 'Оружие', 'Билды', 'Секты', 'Карта', 'Навыки', 'FAQ'].map(item => (
                <li key={item}>
                  <span className="text-ink-300 text-sm hover:text-gold-400 transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-serif text-gold-400 font-bold mb-4">Полезные ссылки</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://store.steampowered.com/app/3564740/Where_Winds_Meet/" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-1.5 text-ink-300 text-sm hover:text-gold-400 transition-colors">
                  <ExternalLink className="w-3 h-3" /> Steam — Where Winds Meet
                </a>
              </li>
              <li>
                <a href="https://wherewindsmeet.wiki.fextralife.com/" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-1.5 text-ink-300 text-sm hover:text-gold-400 transition-colors">
                  <ExternalLink className="w-3 h-3" /> Fextralife Wiki (EN)
                </a>
              </li>
              <li>
                <a href="https://game8.co/games/Where-Winds-Meet" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-1.5 text-ink-300 text-sm hover:text-gold-400 transition-colors">
                  <ExternalLink className="w-3 h-3" /> Game8 Wiki (EN)
                </a>
              </li>
              <li>
                <a href="https://bgonegaming.win/wherewindmeets/" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-1.5 text-ink-300 text-sm hover:text-gold-400 transition-colors">
                  <ExternalLink className="w-3 h-3" /> Интерактивная карта
                </a>
              </li>
              <li>
                <a href="https://www.reddit.com/r/wherewindsmeet_/" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-1.5 text-ink-300 text-sm hover:text-gold-400 transition-colors">
                  <ExternalLink className="w-3 h-3" /> Reddit Сообщество
                </a>
              </li>
            </ul>

            {/* Discord Guild Link */}
            <a
              href="https://discord.gg/nocthra"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex items-center gap-3 px-4 py-3 rounded-xl
                         bg-[#5865F2]/10 border border-[#5865F2]/30
                         hover:bg-[#5865F2]/20 hover:border-[#5865F2]/50
                         transition-all duration-300 group"
            >
              <svg className="w-5 h-5 text-[#5865F2] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <div>
                <div className="text-white font-semibold text-sm group-hover:text-[#5865F2] transition-colors">
                  Гильдия Nocthra
                </div>
                <div className="text-ink-400 text-xs">
                  Присоединиться в Discord
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Guild Nocthra Footer Badge */}
        <GuildBadgeFooter />

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-ink-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-ink-500 text-xs">
              © 2025 WWM Wiki — Русская База Знаний гильдии Nocthra.
            </p>
            <div className="flex items-center gap-1 text-ink-500 text-xs">
              <span>Сделано с</span>
              <span className="text-purple-400">🌙</span>
              <span>гильдией</span>
              <span className="font-serif font-bold text-purple-400/70">Nocthra</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
