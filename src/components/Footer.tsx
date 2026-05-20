import { Scroll, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-ink-900 border-t border-gold-700/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Logo & Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Scroll className="w-5 h-5 text-gold-400" />
              <span className="font-serif text-gold-400 text-lg font-bold">WWM Wiki</span>
            </div>
            <p className="text-ink-400 text-sm leading-relaxed">
              Русскоязычная база знаний по игре Where Winds Meet. Создана и поддерживается гильдией <span className="font-serif font-bold text-purple-300">Nocthra</span>.
            </p>
            <p className="text-ink-500 text-xs mt-3">
              Where Winds Meet © Everstone Studio / NetEase Games.
              Все права на игру принадлежат правообладателям.
            </p>
          </div>

          {/* Resources */}
          <div className="md:justify-self-end md:text-right">
            <h3 className="font-serif text-gold-400 font-bold mb-4">Полезные ссылки</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://store.steampowered.com/app/3564740/Where_Winds_Meet/" target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-1.5 text-ink-300 text-sm hover:text-gold-400 transition-colors md:justify-end">
                  <ExternalLink className="w-3 h-3" /> Steam — Where Winds Meet
                </a>
              </li>
              <li>
                <a href="https://wherewindsmeet.wiki.fextralife.com/" target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-1.5 text-ink-300 text-sm hover:text-gold-400 transition-colors md:justify-end">
                  <ExternalLink className="w-3 h-3" /> Fextralife Wiki (EN)
                </a>
              </li>
              <li>
                <a href="https://game8.co/games/Where-Winds-Meet" target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-1.5 text-ink-300 text-sm hover:text-gold-400 transition-colors md:justify-end">
                  <ExternalLink className="w-3 h-3" /> Game8 Wiki (EN)
                </a>
              </li>
              <li>
                <a href="https://bgonegaming.win/wherewindmeets/" target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-1.5 text-ink-300 text-sm hover:text-gold-400 transition-colors md:justify-end">
                  <ExternalLink className="w-3 h-3" /> Интерактивная карта
                </a>
              </li>
              <li>
                <a href="https://www.reddit.com/r/wherewindsmeet_/" target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-1.5 text-ink-300 text-sm hover:text-gold-400 transition-colors md:justify-end">
                  <ExternalLink className="w-3 h-3" /> Reddit Сообщество
                </a>
              </li>
            </ul>
          </div>
        </div>

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
