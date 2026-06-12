import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  RefreshCw, Download, Play, Loader2, Key, CheckCircle2, AlertTriangle,
  SkipForward, Globe, Link2, Save,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  buildSettingsPatch,
  fetchSyncSections,
  formatSyncDiff,
  getStoredSyncKey,
  isPayloadEmpty,
  runParserSync,
  setStoredSyncKey,
  type SyncResult,
  type SyncSectionInfo,
} from '../../lib/adminSync';
import { buildParserSourcesPatch, getParserUrl } from '../../lib/parserSources';

type LogEntry = {
  id: string;
  section: string;
  status: 'ok' | 'skip' | 'error';
  message: string;
};

export default function ParsersPanel() {
  const { siteSettings, updateSiteSettings, hasPermission } = useAuth();
  const canSync = hasPermission('site.settings') || hasPermission('admin.panel');

  const [sections, setSections] = useState<SyncSectionInfo[]>([]);
  const [urlDrafts, setUrlDrafts] = useState<Record<string, string>>({});
  const [syncKey, setSyncKey] = useState(getStoredSyncKey);
  const [fetchGame8, setFetchGame8] = useState(true);
  const [dryRun, setDryRun] = useState(false);
  const [applyToSite, setApplyToSite] = useState(true);
  const [running, setRunning] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [urlsDirty, setUrlsDirty] = useState(false);

  useEffect(() => {
    void fetchSyncSections().then(setSections).catch(() => {});
  }, []);

  useEffect(() => {
    if (!sections.length) return;
    setUrlDrafts(prev => {
      const next = { ...prev };
      for (const s of sections) {
        if (next[s.id] === undefined) {
          next[s.id] = getParserUrl(s.id, siteSettings.parserSources, s.defaultUrl);
        }
      }
      return next;
    });
  }, [sections, siteSettings.parserSources]);

  const sourceUrlsForSync = useMemo(() => {
    const out: Record<string, string> = {};
    for (const s of sections) {
      const url = urlDrafts[s.id]?.trim();
      if (url) out[s.id] = url;
    }
    return out;
  }, [sections, urlDrafts]);

  const pushLog = useCallback((entry: Omit<LogEntry, 'id'>) => {
    setLogs(prev => [{ ...entry, id: `${Date.now()}-${Math.random()}` }, ...prev].slice(0, 40));
  }, []);

  const applyResult = useCallback((result: SyncResult) => {
    if (!result.payload || dryRun || isPayloadEmpty(result.payload)) return;
    const patch = buildSettingsPatch(siteSettings, result.payload, result.section);
    if (Object.keys(patch).length) updateSiteSettings(patch);
  }, [dryRun, siteSettings, updateSiteSettings]);

  const saveUrls = useCallback(() => {
    updateSiteSettings({ parserSources: buildParserSourcesPatch(urlDrafts) });
    setUrlsDirty(false);
    pushLog({ section: 'urls', status: 'ok', message: 'Ссылки на источники сохранены' });
  }, [urlDrafts, updateSiteSettings, pushLog]);

  const runSection = useCallback(async (sectionId: string) => {
    const url = urlDrafts[sectionId]?.trim();
    if (fetchGame8 && !url) {
      pushLog({ section: sectionId, status: 'error', message: 'Укажите URL страницы-источника' });
      return null;
    }
    return runParserSync({
      section: sectionId,
      dryRun,
      fetch: fetchGame8,
      sourceUrl: url,
      sourceUrls: sourceUrlsForSync,
    });
  }, [urlDrafts, fetchGame8, dryRun, sourceUrlsForSync]);

  const handleRun = useCallback(async (sectionId: string) => {
    if (!canSync) return;
    setStoredSyncKey(syncKey);
    setRunning(sectionId);
    try {
      const data = await runSection(sectionId);
      if (!data) return;
      const { result } = data;
      if (!result) throw new Error('Пустой ответ');

      if (result.error) {
        pushLog({ section: sectionId, status: 'error', message: result.error });
        return;
      }
      if (result.skipped) {
        pushLog({ section: sectionId, status: 'skip', message: result.reason || 'Пропущено' });
        return;
      }

      const diffStr = formatSyncDiff(result.diff);
      let msg = `Записей: ${result.count ?? 0}${diffStr ? ` (${diffStr})` : ''}`;

      if (applyToSite && result.payload) {
        applyResult(result);
        msg += ' · применено на сайте';
      } else if (applyToSite && !dryRun && !result.payload) {
        msg += ' · без данных для Supabase';
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
  }, [canSync, syncKey, applyToSite, dryRun, pushLog, applyResult, runSection]);

  const handleRunAll = useCallback(async () => {
    if (!canSync) return;
    if (urlsDirty) saveUrls();
    setStoredSyncKey(syncKey);
    setRunning('all');
    const batch = ['riddles', 'innerpath', 'npcs-locations', 'weapons'];
    try {
      for (const sectionId of batch) {
        const data = await runSection(sectionId);
        if (!data) continue;
        const r = data.result;
        if (!r) {
          pushLog({ section: sectionId, status: 'error', message: 'Пустой ответ' });
          continue;
        }
        if (r.error) pushLog({ section: sectionId, status: 'error', message: r.error });
        else if (r.skipped) pushLog({ section: sectionId, status: 'skip', message: r.reason || 'Пропущено' });
        else {
          if (applyToSite && r.payload && !isPayloadEmpty(r.payload)) applyResult(r);
          const diffStr = formatSyncDiff(r.diff);
          pushLog({
            section: sectionId,
            status: 'ok',
            message: `${r.count ?? 0} записей${diffStr ? ` (${diffStr})` : ''}`,
          });
        }
      }
    } catch (e) {
      pushLog({ section: 'all', status: 'error', message: e instanceof Error ? e.message : 'Ошибка' });
    } finally {
      setRunning(null);
    }
  }, [canSync, syncKey, urlsDirty, saveUrls, applyToSite, pushLog, applyResult, runSection]);

  const handleClearSync = useCallback(() => {
    if (!confirm('Сбросить синхронизированные данные парсеров? Вернётся встроенный контент из сборки.')) return;
    const next = { ...(siteSettings.sectionOverrides || {}) };
    delete next.innerpath;
    updateSiteSettings({ parsedContent: undefined, sectionOverrides: next });
    pushLog({ section: 'reset', status: 'ok', message: 'Синхронизация сброшена' });
  }, [siteSettings.sectionOverrides, updateSiteSettings, pushLog]);

  const meta = siteSettings.parsedContent?.meta || {};

  if (!canSync) {
    return <p className="text-ink-400 text-sm">Нужно право «Настройки сайта» или «Админ-панель».</p>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-ink-800/40 border border-ink-700/50 rounded-xl p-5">
        <h2 className="font-serif text-lg font-bold text-white mb-1 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-gold-400" /> Синхронизация контента
        </h2>
        <p className="text-ink-400 text-sm mb-4">
          Для каждого раздела укажите <strong className="text-ink-300">ссылку на страницу-источник</strong>{' '}
          (Game8 или другой гайд). Парсер скачает именно её и извлечёт данные.
          Ссылки сохраняются в настройках сайта (Supabase).
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <label className="block">
            <span className="text-xs text-ink-400 flex items-center gap-1 mb-1">
              <Key className="w-3 h-3" /> Секрет SYNC_API_SECRET
            </span>
            <input
              type="password"
              value={syncKey}
              onChange={e => setSyncKey(e.target.value)}
              placeholder="Из .env или Vercel"
              className="w-full bg-ink-900/80 border border-ink-600/40 rounded-lg px-3 py-2 text-sm text-white"
            />
          </label>
          <div className="flex flex-col gap-2 justify-end text-sm">
            <label className="flex items-center gap-2 text-ink-300 cursor-pointer">
              <input type="checkbox" checked={fetchGame8} onChange={e => setFetchGame8(e.target.checked)} />
              <Globe className="w-4 h-4" /> Скачать страницу по URL (обязательно на Vercel)
            </label>
            <label className="flex items-center gap-2 text-ink-300 cursor-pointer">
              <input type="checkbox" checked={dryRun} onChange={e => setDryRun(e.target.checked)} />
              Только превью (dry-run)
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
          <button
            type="button"
            disabled={!urlsDirty}
            onClick={saveUrls}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/15 text-emerald-400 text-sm hover:bg-emerald-500/25 disabled:opacity-40 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Сохранить ссылки
          </button>
          <button
            type="button"
            disabled={Boolean(running)}
            onClick={handleClearSync}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ink-700/50 text-ink-300 text-sm hover:bg-ink-700 disabled:opacity-50 cursor-pointer"
          >
            Сбросить синхронизацию
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {sections.map(sec => {
          const last = meta[sec.id];
          const isRunning = running === sec.id;
          return (
            <div
              key={sec.id}
              className="bg-ink-800/30 border border-ink-700/40 rounded-xl p-4 flex flex-col gap-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-3 justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-white font-medium text-sm">{sec.label}</h3>
                  <p className="text-ink-500 text-xs font-mono">{sec.id}</p>
                  {last?.syncedAt && (
                    <p className="text-ink-500 text-xs mt-1">
                      Синх.: {new Date(last.syncedAt).toLocaleString('ru-RU')}
                      {last.count != null ? ` · ${last.count} зап.` : ''}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  disabled={Boolean(running)}
                  onClick={() => void handleRun(sec.id)}
                  className="shrink-0 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-ink-700/50 text-ink-200 text-sm hover:bg-ink-700 disabled:opacity-50 cursor-pointer"
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

              <label className="block">
                <span className="text-xs text-ink-400 flex items-center gap-1 mb-1">
                  <Link2 className="w-3 h-3" /> URL страницы-источника
                </span>
                <input
                  type="url"
                  value={urlDrafts[sec.id] ?? ''}
                  onChange={e => {
                    setUrlDrafts(prev => ({ ...prev, [sec.id]: e.target.value }));
                    setUrlsDirty(true);
                  }}
                  placeholder={sec.defaultUrl || 'https://game8.co/games/Where-Winds-Meet/archives/…'}
                  className="w-full bg-ink-900/80 border border-ink-600/40 rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
                {sec.defaultUrl && urlDrafts[sec.id] !== sec.defaultUrl && (
                  <button
                    type="button"
                    className="text-xs text-gold-400/80 mt-1 hover:text-gold-400 cursor-pointer"
                    onClick={() => {
                      setUrlDrafts(prev => ({ ...prev, [sec.id]: sec.defaultUrl || '' }));
                      setUrlsDirty(true);
                    }}
                  >
                    Вернуть по умолчанию
                  </button>
                )}
              </label>
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
        DeepSeek (ИИ-перевод/обогащение): ключ только в <code className="text-ink-400">.env</code> как{' '}
        <code className="text-ink-400">DEEPSEEK_API_KEY</code> на сервере — не вводите его в браузере.
        ИИ-этап подключим отдельно после стабильной работы парсеров по вашим ссылкам.
      </p>
    </div>
  );
}
