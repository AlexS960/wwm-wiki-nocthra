import { useCallback, useEffect, useState } from 'react';
import {
  RefreshCw, Download, Play, Loader2, Key, CheckCircle2, AlertTriangle,
  SkipForward, Globe,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  buildSettingsPatch,
  fetchSyncSections,
  formatSyncDiff,
  getStoredSyncKey,
  runParserSync,
  setStoredSyncKey,
  type SyncResult,
  type SyncSectionInfo,
} from '../../lib/adminSync';

type LogEntry = {
  id: string;
  section: string;
  status: 'ok' | 'skip' | 'error';
  message: string;
};

const QUICK_SECTIONS = [
  { id: 'riddles', hint: 'Загадки из Game8' },
  { id: 'innerpath', hint: 'Внутренний путь' },
  { id: 'npcs-locations', hint: 'Локации NPC' },
  { id: 'npcs-bundle', hint: 'Пересборка aiNpcs.ts (только сервер)' },
];

export default function ParsersPanel() {
  const { siteSettings, updateSiteSettings, hasPermission } = useAuth();
  const canSync = hasPermission('site.settings') || hasPermission('admin.panel');

  const [sections, setSections] = useState<SyncSectionInfo[]>([]);
  const [syncKey, setSyncKey] = useState(getStoredSyncKey);
  const [fetchGame8, setFetchGame8] = useState(false);
  const [dryRun, setDryRun] = useState(false);
  const [applyToSite, setApplyToSite] = useState(true);
  const [running, setRunning] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    void fetchSyncSections().then(setSections).catch(() => {
      setSections(QUICK_SECTIONS.map(s => ({ id: s.id, label: s.hint })));
    });
  }, []);

  const pushLog = useCallback((entry: Omit<LogEntry, 'id'>) => {
    setLogs(prev => [{ ...entry, id: `${Date.now()}-${Math.random()}` }, ...prev].slice(0, 40));
  }, []);

  const applyResult = useCallback((result: SyncResult) => {
    if (!result.payload || dryRun) return;
    const patch = buildSettingsPatch(siteSettings, result.payload, result.section);
    updateSiteSettings(patch);
  }, [dryRun, siteSettings, updateSiteSettings]);

  const handleRun = useCallback(async (sectionId: string) => {
    if (!canSync) return;
    setStoredSyncKey(syncKey);
    setRunning(sectionId);
    try {
      const { result } = await runParserSync({
        section: sectionId,
        dryRun,
        fetch: fetchGame8,
      });
      if (!result) throw new Error('Пустой ответ');

      if (result.error) {
        pushLog({ section: sectionId, status: 'error', message: result.error });
        return;
      }
      if (result.skipped) {
        pushLog({
          section: sectionId,
          status: 'skip',
          message: result.reason || 'Пропущено',
        });
        return;
      }

      const diffStr = formatSyncDiff(result.diff);
      let msg = `Записей: ${result.count ?? 0}${diffStr ? ` (${diffStr})` : ''}`;

      if (applyToSite && result.payload) {
        applyResult(result);
        msg += ' · применено на сайте';
      } else if (applyToSite && !dryRun && !result.payload) {
        msg += ' · без данных для Supabase (только файлы на сервере)';
      }

      pushLog({ section: sectionId, status: 'ok', message: msg });
    } catch (e) {
      pushLog({
        section: sectionId,
        status: 'error',
        message: e instanceof Error ? e.message : 'Ошибка синхронизации',
      });
    } finally {
      setRunning(null);
    }
  }, [canSync, syncKey, dryRun, fetchGame8, applyToSite, pushLog, applyResult]);

  const handleRunAll = useCallback(async () => {
    if (!canSync) return;
    setStoredSyncKey(syncKey);
    setRunning('all');
    try {
      const { results } = await runParserSync({
        sections: ['riddles', 'innerpath', 'npcs-locations'],
        dryRun,
        fetch: fetchGame8,
      });
      for (const result of results || []) {
        if (result.error) {
          pushLog({ section: result.section, status: 'error', message: result.error });
        } else if (result.skipped) {
          pushLog({ section: result.section, status: 'skip', message: result.reason || 'Пропущено' });
        } else {
          if (applyToSite && result.payload) applyResult(result);
          const diffStr = formatSyncDiff(result.diff);
          pushLog({
            section: result.section,
            status: 'ok',
            message: `${result.count ?? 0} записей${diffStr ? ` (${diffStr})` : ''}`,
          });
        }
      }
    } catch (e) {
      pushLog({
        section: 'all',
        status: 'error',
        message: e instanceof Error ? e.message : 'Ошибка',
      });
    } finally {
      setRunning(null);
    }
  }, [canSync, syncKey, dryRun, fetchGame8, applyToSite, pushLog, applyResult]);

  const meta = siteSettings.parsedContent?.meta || {};

  if (!canSync) {
    return (
      <p className="text-ink-400 text-sm">Нужно право «Настройки сайта» или «Админ-панель».</p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-ink-800/40 border border-ink-700/50 rounded-xl p-5">
        <h2 className="font-serif text-lg font-bold text-white mb-1 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-gold-400" /> Синхронизация контента
        </h2>
        <p className="text-ink-400 text-sm mb-4">
          Парсеры Game8 обновляют разделы вики. Результат сохраняется в Supabase и сразу виден на сайте
          (редакции в разделах и wiki-статьи не затрагиваются).
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <label className="block">
            <span className="text-xs text-ink-400 flex items-center gap-1 mb-1">
              <Key className="w-3 h-3" /> Ключ API (SYNC_API_SECRET)
            </span>
            <input
              type="password"
              value={syncKey}
              onChange={e => setSyncKey(e.target.value)}
              placeholder="Из Vercel Environment Variables"
              className="w-full bg-ink-900/80 border border-ink-600/40 rounded-lg px-3 py-2 text-sm text-white"
            />
          </label>
          <div className="flex flex-col gap-2 justify-end text-sm">
            <label className="flex items-center gap-2 text-ink-300 cursor-pointer">
              <input type="checkbox" checked={fetchGame8} onChange={e => setFetchGame8(e.target.checked)} />
              <Globe className="w-4 h-4" /> Скачать свежий markdown с Game8
            </label>
            <label className="flex items-center gap-2 text-ink-300 cursor-pointer">
              <input type="checkbox" checked={dryRun} onChange={e => setDryRun(e.target.checked)} />
              Только превью (dry-run, без записи)
            </label>
            <label className="flex items-center gap-2 text-ink-300 cursor-pointer">
              <input type="checkbox" checked={applyToSite} onChange={e => setApplyToSite(e.target.checked)} />
              Применить на сайт (Supabase)
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={Boolean(running)}
            onClick={() => void handleRunAll()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-400/20 text-gold-400 text-sm font-medium hover:bg-gold-400/30 disabled:opacity-50 cursor-pointer"
          >
            {running === 'all' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Синхронизировать всё
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {(sections.length ? sections : QUICK_SECTIONS.map(s => ({ id: s.id, label: s.hint }))).map(sec => {
          const last = meta[sec.id];
          const isRunning = running === sec.id;
          return (
            <div
              key={sec.id}
              className="bg-ink-800/30 border border-ink-700/40 rounded-xl p-4 flex flex-col gap-3"
            >
              <div>
                <h3 className="text-white font-medium text-sm">{sec.label}</h3>
                <p className="text-ink-500 text-xs font-mono">{sec.id}</p>
                {last?.syncedAt && (
                  <p className="text-ink-500 text-xs mt-1">
                    Последняя синх.: {new Date(last.syncedAt).toLocaleString('ru-RU')}
                    {last.count != null ? ` · ${last.count} зап.` : ''}
                  </p>
                )}
                {sec.requiresNetwork && (
                  <p className="text-amber-500/80 text-xs mt-1">Требует интернет · может занять много времени</p>
                )}
                {sec.note && <p className="text-ink-500 text-xs mt-1">{sec.note}</p>}
              </div>
              <button
                type="button"
                disabled={Boolean(running)}
                onClick={() => void handleRun(sec.id)}
                className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-ink-700/50 text-ink-200 text-sm hover:bg-ink-700 disabled:opacity-50 cursor-pointer"
              >
                {isRunning ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : sec.requiresNetwork ? (
                  <Download className="w-4 h-4" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Запустить
              </button>
            </div>
          );
        })}
      </div>

      {logs.length > 0 && (
        <div className="bg-ink-900/50 border border-ink-700/40 rounded-xl p-4">
          <h3 className="text-sm font-medium text-ink-300 mb-3">Журнал</h3>
          <ul className="space-y-2 max-h-64 overflow-y-auto text-sm">
            {logs.map(log => (
              <li key={log.id} className="flex items-start gap-2 text-ink-400">
                {log.status === 'ok' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                {log.status === 'skip' && <SkipForward className="w-4 h-4 text-ink-500 shrink-0 mt-0.5" />}
                {log.status === 'error' && <AlertTriangle className="w-4 h-4 text-crimson-400 shrink-0 mt-0.5" />}
                <span>
                  <span className="text-ink-300 font-mono text-xs">{log.section}</span>
                  {' — '}
                  {log.message}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-ink-500 text-xs">
        Локально: задайте <code className="text-ink-400">SYNC_API_SECRET</code> в <code className="text-ink-400">.env</code>.
        На Vercel: Settings → Environment Variables → Redeploy. Диалоги NPC (<code className="text-ink-400">npcs-dialogues</code>)
        лучше запускать через <code className="text-ink-400">npm run sync</code> — долгий скрейп.
      </p>
    </div>
  );
}
