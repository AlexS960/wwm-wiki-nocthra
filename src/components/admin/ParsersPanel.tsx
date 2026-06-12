import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  RefreshCw, Download, Play, Loader2, Key, CheckCircle2, AlertTriangle,
  SkipForward, Globe, Link2, Save, ScanSearch, Sparkles, Radio,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  buildSettingsPatch,
  discoverParserSources,
  fetchAiStatus,
  fetchSyncSections,
  formatSyncDiff,
  getStoredSyncKey,
  isPayloadEmpty,
  runParserSync,
  setStoredSyncKey,
  type AiStatus,
  type SyncResult,
  type SyncSectionInfo,
} from '../../lib/adminSync';
import { buildParserSourcesPatch, getParserUrl } from '../../lib/parserSources';

type LogEntry = {
  id: string;
  section: string;
  status: 'ok' | 'skip' | 'error' | 'ai';
  message: string;
};

const DEFAULT_WIKI = 'https://game8.co/games/Where-Winds-Meet';

function formatAiLine(ai: SyncResult['ai']): string {
  if (!ai) return '';
  const tag = ai.provider === 'deepseek' ? 'DeepSeek' : 'LM Studio';
  if (ai.error) return ` · ${tag}: ${ai.error}`;
  if (ai.used) return ` · ${tag}: ${ai.message || `+${ai.enriched ?? 0}`}`;
  if (ai.reason === 'no_key_or_payload' || ai.reason === 'no_ai_or_payload') return '';
  return ai.message ? ` · ${ai.message}` : '';
}

export default function ParsersPanel() {
  const { siteSettings, updateSiteSettings, hasPermission } = useAuth();
  const canSync = hasPermission('site.settings') || hasPermission('admin.panel');

  const [sections, setSections] = useState<SyncSectionInfo[]>([]);
  const [urlDrafts, setUrlDrafts] = useState<Record<string, string>>({});
  const [discovered, setDiscovered] = useState<Record<string, { label: string; matched: boolean }>>({});
  const [syncKey, setSyncKey] = useState(getStoredSyncKey);
  const [wikiUrl, setWikiUrl] = useState(DEFAULT_WIKI);
  const [fetchGame8, setFetchGame8] = useState(true);
  const [autoDiscover, setAutoDiscover] = useState(true);
  const [useAi, setUseAi] = useState(true);
  const [dryRun, setDryRun] = useState(false);
  const [applyToSite, setApplyToSite] = useState(true);
  const [running, setRunning] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [aiStatus, setAiStatus] = useState<AiStatus | null>(null);
  const [aiRefreshing, setAiRefreshing] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [urlsDirty, setUrlsDirty] = useState(false);

  const refreshAiStatus = useCallback(async () => {
    setAiRefreshing(true);
    try {
      const ai = await fetchAiStatus();
      setAiStatus(ai);
    } catch {
      setAiStatus({ configured: false, active: false, message: 'Не удалось проверить ИИ' });
    } finally {
      setAiRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchSyncSections().then(data => {
      setSections(data.sections);
      setWikiUrl(data.wikiUrl || DEFAULT_WIKI);
      setAiStatus(data.ai);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => { void refreshAiStatus(); }, 45000);
    return () => clearInterval(t);
  }, [refreshAiStatus]);

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
    setLogs(prev => [{ ...entry, id: `${Date.now()}-${Math.random()}` }, ...prev].slice(0, 50));
  }, []);

  const applyResult = useCallback((result: SyncResult) => {
    if (!result.payload || dryRun || isPayloadEmpty(result.payload)) return false;
    updateSiteSettings(prev => buildSettingsPatch(prev, result.payload!, result.section));
    return true;
  }, [dryRun, updateSiteSettings]);

  const saveUrls = useCallback(() => {
    updateSiteSettings({ parserSources: buildParserSourcesPatch(urlDrafts) });
    setUrlsDirty(false);
    pushLog({ section: 'urls', status: 'ok', message: 'Ссылки на источники сохранены' });
  }, [urlDrafts, updateSiteSettings, pushLog]);

  const handleScanWiki = useCallback(async () => {
    if (!canSync) return;
    setStoredSyncKey(syncKey);
    setScanning(true);
    pushLog({ section: 'scan', status: 'ai', message: `Сканирование ${wikiUrl}…` });
    try {
      const data = await discoverParserSources(wikiUrl);
      const nextUrls: Record<string, string> = { ...urlDrafts };
      const nextDiscovered: Record<string, { label: string; matched: boolean }> = {};
      for (const [id, src] of Object.entries(data.sources)) {
        if (src.url) nextUrls[id] = src.url;
        nextDiscovered[id] = { label: src.label, matched: src.matched };
      }
      setUrlDrafts(nextUrls);
      setDiscovered(nextDiscovered);
      setUrlsDirty(true);
      pushLog({
        section: 'scan',
        status: 'ok',
        message: `Найдено ${data.linkCount} ссылок · источники подобраны для ${Object.keys(data.sources).length} парсеров`,
      });
    } catch (e) {
      pushLog({
        section: 'scan',
        status: 'error',
        message: e instanceof Error ? e.message : 'Ошибка сканирования',
      });
    } finally {
      setScanning(false);
    }
  }, [canSync, syncKey, wikiUrl, urlDrafts, pushLog]);

  const runSection = useCallback(async (sectionId: string) => {
    const url = urlDrafts[sectionId]?.trim();
    if (fetchGame8 && !url && !autoDiscover) {
      pushLog({ section: sectionId, status: 'error', message: 'Укажите URL или включите авто-поиск на Game8' });
      return null;
    }
    if (useAi && aiStatus?.configured) {
      pushLog({ section: sectionId, status: 'ai', message: `Парсинг + ${aiStatus?.label || 'ИИ'}…` });
    }
    return runParserSync({
      section: sectionId,
      dryRun,
      fetch: fetchGame8,
      sourceUrl: url,
      sourceUrls: sourceUrlsForSync,
      wikiUrl,
      autoDiscover,
      useAi,
    });
  }, [urlDrafts, fetchGame8, autoDiscover, dryRun, sourceUrlsForSync, wikiUrl, useAi, aiStatus, pushLog]);

  const logSyncResult = useCallback((sectionId: string, result: SyncResult) => {
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
    if (result.sourceUrl) msg += ` · ${result.sourceUrl.replace(/^https?:\/\/game8\.co/, '')}`;
    if (result.discovered?.matched) msg += ' · авто-ссылка';
    msg += formatAiLine(result.ai);

    if (result.ai?.used) {
      pushLog({ section: sectionId, status: 'ai', message: msg });
    } else {
      pushLog({ section: sectionId, status: 'ok', message: msg });
    }
  }, [pushLog]);

  const handleRun = useCallback(async (sectionId: string) => {
    if (!canSync) return;
    setStoredSyncKey(syncKey);
    setRunning(sectionId);
    try {
      const data = await runSection(sectionId);
      if (!data) return;
      const { result } = data;
      if (!result) throw new Error('Пустой ответ');

      if (result.error || result.skipped) {
        logSyncResult(sectionId, result);
      } else {
        const applied = applyToSite && applyResult(result);
        const diffStr = formatSyncDiff(result.diff);
        let msg = `Записей: ${result.count ?? 0}${diffStr ? ` (${diffStr})` : ''}`;
        if (result.sourceUrl) msg += ` · ${result.sourceUrl.replace(/^https?:\/\/game8\.co/, '')}`;
        if (result.discovered?.matched) msg += ' · авто-ссылка';
        if (result.ai?.error) msg += ` · ${result.ai.error}`;
        else msg += formatAiLine(result.ai);
        if (applied) msg += ' · применено на сайте';
        else if (applyToSite && !dryRun && !result.payload) msg += ' · без данных для Supabase';
        pushLog({
          section: sectionId,
          status: result.ai?.error ? 'skip' : (result.ai?.used ? 'ai' : 'ok'),
          message: msg,
        });
      }

      void refreshAiStatus();
    } catch (e) {
      pushLog({
        section: sectionId,
        status: 'error',
        message: e instanceof Error ? e.message : 'Ошибка синхронизации',
      });
    } finally {
      setRunning(null);
    }
  }, [canSync, syncKey, applyToSite, dryRun, pushLog, applyResult, runSection, logSyncResult, refreshAiStatus]);

  const handleRunAll = useCallback(async () => {
    if (!canSync) return;
    if (urlsDirty) saveUrls();
    setStoredSyncKey(syncKey);
    setRunning('all');
    const batch = ['riddles', 'innerpath', 'npcs-locations', 'weapons'];
    try {
      for (const sectionId of batch) {
        try {
          const data = await runSection(sectionId);
          if (!data) continue;
          const r = data.result;
          if (!r) {
            pushLog({ section: sectionId, status: 'error', message: 'Пустой ответ' });
            continue;
          }
          if (r.error || r.skipped) {
            logSyncResult(sectionId, r);
            continue;
          }
          const applied = applyToSite && applyResult(r);
          const diffStr = formatSyncDiff(r.diff);
          let msg = `${r.count ?? 0} записей${diffStr ? ` (${diffStr})` : ''}`;
          if (r.ai?.error) msg += ` · ${r.ai.error}`;
          else if (r.ai?.used) msg += formatAiLine(r.ai);
          if (applied) msg += ' · применено';
          pushLog({
            section: sectionId,
            status: r.ai?.error ? 'skip' : (r.error ? 'error' : 'ok'),
            message: msg,
          });
        } catch (e) {
          pushLog({
            section: sectionId,
            status: 'error',
            message: e instanceof Error ? e.message : 'Ошибка',
          });
        }
      }
      void refreshAiStatus();
    } catch (e) {
      pushLog({ section: 'all', status: 'error', message: e instanceof Error ? e.message : 'Ошибка' });
    } finally {
      setRunning(null);
    }
  }, [canSync, syncKey, urlsDirty, saveUrls, applyToSite, pushLog, applyResult, runSection, logSyncResult, refreshAiStatus]);

  const handleClearSync = useCallback(() => {
    if (!confirm('Сбросить синхронизированные данные парсеров? Вернётся встроенный контент из сборки.')) return;
    const next = { ...(siteSettings.sectionOverrides || {}) };
    delete next.innerpath;
    updateSiteSettings({ parsedContent: undefined, sectionOverrides: next });
    pushLog({ section: 'reset', status: 'ok', message: 'Синхронизация сброшена' });
  }, [siteSettings.sectionOverrides, updateSiteSettings, pushLog]);

  const meta = siteSettings.parsedContent?.meta || {};
  const aiActive = Boolean(aiStatus?.configured && aiStatus?.active);
  const aiBusy = Boolean(running) && useAi && aiActive;

  if (!canSync) {
    return <p className="text-ink-400 text-sm">Нужно право «Настройки сайта» или «Админ-панель».</p>;
  }

  return (
    <div className="space-y-6">
      {/* LM Studio / ИИ */}
      <div className={`border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 ${
        aiActive ? 'bg-violet-500/10 border-violet-500/30' : 'bg-ink-800/40 border-ink-700/50'
      }`}>
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`relative shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            aiActive ? 'bg-violet-500/20' : 'bg-ink-700/50'
          }`}>
            <Sparkles className={`w-5 h-5 ${aiActive ? 'text-violet-300' : 'text-ink-500'}`} />
            {aiBusy && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-violet-400 animate-pulse ring-2 ring-ink-900" />
            )}
            {aiActive && !aiBusy && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-ink-900" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-white font-medium text-sm">{aiStatus?.label || 'ИИ-ассистент'}</h3>
              {aiStatus?.localOnly && (
                <span className="text-xs text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full">Локально</span>
              )}
              {aiActive && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <Radio className="w-3 h-3" /> Активен
                </span>
              )}
              {aiStatus?.configured && !aiStatus.active && (
                <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">Офлайн</span>
              )}
              {!aiStatus?.configured && (
                <span className="text-xs text-ink-500 bg-ink-700/50 px-2 py-0.5 rounded-full">Не настроен</span>
              )}
            </div>
            <p className="text-ink-400 text-xs mt-0.5 line-clamp-2">
              {aiBusy ? 'Обогащение контента…' : (aiStatus?.message || 'Проверка…')}
              {aiStatus?.model ? ` · ${aiStatus.model}` : ''}
            </p>
            {aiStatus?.localOnly && !aiActive && (
              <p className="text-ink-500 text-xs mt-1">
                LM Studio → загрузите ministral-3-3b → Start Server (порт 1234) → npm run dev
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <label className="flex items-center gap-2 text-sm text-ink-300 cursor-pointer">
            <input
              type="checkbox"
              checked={useAi}
              onChange={e => setUseAi(e.target.checked)}
              disabled={!aiStatus?.configured || (aiStatus.localOnly && !aiStatus.active)}
            />
            Использовать при синхронизации
          </label>
          <button
            type="button"
            onClick={() => void refreshAiStatus()}
            disabled={aiRefreshing}
            className="p-2 rounded-lg bg-ink-700/50 text-ink-300 hover:bg-ink-700 disabled:opacity-50 cursor-pointer"
            title="Обновить статус"
          >
            <RefreshCw className={`w-4 h-4 ${aiRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="bg-ink-800/40 border border-ink-700/50 rounded-xl p-5">
        <h2 className="font-serif text-lg font-bold text-white mb-1 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-gold-400" /> Синхронизация контента
        </h2>
        <p className="text-ink-400 text-sm mb-4">
          Сканируйте главную вики Game8 — каждый парсер получит свою страницу-источник автоматически.
          Или укажите ссылки вручную. Локальная модель в LM Studio переводит и дополняет записи после парсинга (только при npm run dev на вашем ПК).
        </p>

        <label className="block mb-4">
          <span className="text-xs text-ink-400 flex items-center gap-1 mb-1">
            <Globe className="w-3 h-3" /> Главная вики Game8
          </span>
          <input
            type="url"
            value={wikiUrl}
            onChange={e => setWikiUrl(e.target.value)}
            className="w-full bg-ink-900/80 border border-ink-600/40 rounded-lg px-3 py-2 text-sm text-white font-mono"
          />
        </label>

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
              <input type="checkbox" checked={autoDiscover} onChange={e => setAutoDiscover(e.target.checked)} />
              Авто-поиск ссылок на Game8 при запуске
            </label>
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
            disabled={Boolean(running) || scanning}
            onClick={() => void handleScanWiki()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500/15 text-sky-300 text-sm font-medium hover:bg-sky-500/25 disabled:opacity-50 cursor-pointer"
          >
            {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanSearch className="w-4 h-4" />}
            Сканировать Game8
          </button>
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
          const disc = discovered[sec.id];
          return (
            <div
              key={sec.id}
              className="bg-ink-800/30 border border-ink-700/40 rounded-xl p-4 flex flex-col gap-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-3 justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-white font-medium text-sm flex items-center gap-2 flex-wrap">
                    {sec.label}
                    {disc?.matched && (
                      <span className="text-xs text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full">
                        авто: {disc.label}
                      </span>
                    )}
                  </h3>
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
                {log.status === 'ai' && <Sparkles className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />}
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
    </div>
  );
}
