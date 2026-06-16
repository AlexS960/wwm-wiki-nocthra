import { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { loadVisitStats } from '../../lib/analytics';
import type { VisitStats } from '../../lib/db';
import { StatBox } from './AdminShared';

export default function AnalyticsPanel() {
  const [days, setDays] = useState(7);
  const [stats, setStats] = useState<VisitStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    void loadVisitStats(days).then(result => {
      if (!active) return;
      if (result.error) setError(result.error);
      setStats(result.stats);
      setLoading(false);
    });
    return () => { active = false; };
  }, [days]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gold-400" /> Статистика посещений
          </h2>
          <p className="text-ink-400 text-sm mt-1">
            Учитываются все посетители, включая гостей без регистрации (анонимный ID в браузере).
          </p>
        </div>
        <select
          value={days}
          onChange={e => setDays(Number(e.target.value))}
          className="bg-ink-800 border border-ink-700/50 rounded-lg px-4 py-2 text-sm text-white cursor-pointer"
        >
          <option value={1}>За 24 часа</option>
          <option value={7}>За 7 дней</option>
          <option value={30}>За 30 дней</option>
        </select>
      </div>

      {loading && <p className="text-ink-400 text-sm">Загрузка…</p>}
      {error && <p className="text-crimson-300 text-sm">{error}</p>}

      {stats && !loading && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatBox label="Просмотры" value={stats.totalHits} icon="👁️" />
            <StatBox label="Уникальные" value={stats.uniqueVisitors} icon="👥" />
            <StatBox label="Гости" value={stats.anonymousHits} icon="🌐" />
            <StatBox label="Авторизованные" value={stats.registeredHits} icon="✅" />
          </div>

          <div className="bg-ink-800/50 border border-ink-700/30 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-ink-700/30 text-sm font-medium text-gold-300">
              Популярные страницы
            </div>
            {stats.topPaths.length === 0 ? (
              <p className="p-6 text-ink-500 text-sm text-center">Пока нет данных. Статистика начнёт собираться после посещений.</p>
            ) : (
              <div className="divide-y divide-ink-700/30">
                {stats.topPaths.map(row => (
                  <div key={row.path} className="flex items-center justify-between px-4 py-2.5 text-sm">
                    <span className="text-ink-200 truncate font-mono">{row.path}</span>
                    <span className="text-gold-400 shrink-0 ml-3">{row.hits}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {stats.daily.length > 0 && (
            <div className="bg-ink-800/50 border border-ink-700/30 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-ink-700/30 text-sm font-medium text-gold-300">
                По дням
              </div>
              <div className="divide-y divide-ink-700/30">
                {stats.daily.map(row => (
                  <div key={row.day} className="flex items-center justify-between px-4 py-2 text-sm">
                    <span className="text-ink-300">{row.day}</span>
                    <span className="text-ink-400">
                      {row.hits} просм. · {row.uniqueVisitors} уник.
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
