import { useCallback, useEffect, useState } from 'react';
import { Activity, CheckCircle2, RefreshCw, Server, XCircle } from 'lucide-react';
import {
  checkSiteHealth,
  checkSupabaseHealth,
  checkSyncApiHealth,
  formatBuildTime,
  loadBuildInfo,
  type BuildInfo,
  type HealthCheckResult,
  type HealthState,
} from '../../lib/serverHealth';

function statusLabel(state: HealthState): string {
  switch (state) {
    case 'ok': return 'Доступен';
    case 'error': return 'Ошибка';
    case 'pending': return 'Проверка…';
    case 'skipped': return 'Не настроен';
  }
}

function StatusIcon({ state }: { state: HealthState }) {
  if (state === 'ok') return <CheckCircle2 className="w-4 h-4 text-jade-400 shrink-0" />;
  if (state === 'error') return <XCircle className="w-4 h-4 text-crimson-400 shrink-0" />;
  if (state === 'pending') return <RefreshCw className="w-4 h-4 text-gold-400 animate-spin shrink-0" />;
  return <Activity className="w-4 h-4 text-ink-500 shrink-0" />;
}

function StatusRow({ title, result }: { title: string; result: HealthCheckResult }) {
  return (
    <div className="flex items-start justify-between gap-3 py-3 border-b border-ink-700/30 last:border-0">
      <div className="min-w-0">
        <p className="text-sm text-ink-200">{title}</p>
        {result.detail && <p className="text-[11px] text-ink-500 mt-0.5 truncate">{result.detail}</p>}
      </div>
      <div className="flex items-center gap-2 shrink-0 text-xs">
        {typeof result.latencyMs === 'number' && result.state === 'ok' && (
          <span className="text-ink-500">{result.latencyMs} ms</span>
        )}
        <StatusIcon state={result.state} />
        <span className={
          result.state === 'ok' ? 'text-jade-400'
            : result.state === 'error' ? 'text-crimson-300'
              : 'text-ink-500'
        }>
          {statusLabel(result.state)}
        </span>
      </div>
    </div>
  );
}

const pending: HealthCheckResult = { state: 'pending' };

export default function ServerStatusPanel() {
  const [site, setSite] = useState<HealthCheckResult>(pending);
  const [supabase, setSupabase] = useState<HealthCheckResult>(pending);
  const [syncApi, setSyncApi] = useState<HealthCheckResult>(pending);
  const [buildInfo, setBuildInfo] = useState<BuildInfo | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const runChecks = useCallback(async () => {
    setRefreshing(true);
    setSite(pending);
    setSupabase(pending);
    setSyncApi(pending);
    const [siteResult, supabaseResult, syncResult, info] = await Promise.all([
      checkSiteHealth(),
      checkSupabaseHealth(),
      checkSyncApiHealth(),
      loadBuildInfo(),
    ]);
    setSite(siteResult);
    setSupabase(supabaseResult);
    setSyncApi(syncResult);
    setBuildInfo(info);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    void runChecks();
  }, [runChecks]);

  const embeddedBuildTime = import.meta.env.VITE_BUILD_TIME;

  return (
    <div className="bg-ink-800/50 border border-ink-700/30 rounded-xl p-5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-gold-400 font-semibold text-sm flex items-center gap-2">
            <Server className="w-4 h-4" /> Состояние сервера
          </h3>
          <p className="text-ink-500 text-xs mt-1">
            Проверка nginx/статики, Supabase API и (опционально) sync-api. Без отдельного бэкенда на VPS.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void runChecks()}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs bg-ink-700/50 text-ink-300 hover:bg-ink-600 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          Обновить
        </button>
      </div>

      <div className="rounded-lg bg-ink-900/40 px-4">
        <StatusRow title="Сайт / nginx (health.json)" result={site} />
        <StatusRow title="Supabase API" result={supabase} />
        <StatusRow title="Sync API (server/index.mjs)" result={syncApi} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="bg-ink-900/40 rounded-lg px-3 py-2.5">
          <p className="text-ink-500">Сборка (health.json)</p>
          <p className="text-ink-200 mt-0.5">{formatBuildTime(buildInfo?.buildTime)}</p>
        </div>
        <div className="bg-ink-900/40 rounded-lg px-3 py-2.5">
          <p className="text-ink-500">Версия / env</p>
          <p className="text-ink-200 mt-0.5">
            v{buildInfo?.version ?? '—'}
            {embeddedBuildTime && embeddedBuildTime !== buildInfo?.buildTime && (
              <span className="text-ink-500"> · bundle {formatBuildTime(embeddedBuildTime)}</span>
            )}
          </p>
        </div>
        <div className="bg-ink-900/40 rounded-lg px-3 py-2.5 sm:col-span-2">
          <p className="text-ink-500">Публичный URL</p>
          <p className="text-ink-200 mt-0.5 font-mono text-[11px] break-all">
            {buildInfo?.siteUrl || import.meta.env.VITE_SITE_URL || '—'}
          </p>
        </div>
      </div>
    </div>
  );
}
