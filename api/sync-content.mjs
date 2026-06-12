import { runSyncSection, runSyncSections, PARSERS, SYNC_ORDER, SAFE_SYNC_ORDER } from '../scripts/parsers/run-handler.mjs';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Sync-Key',
};

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  for (const [k, v] of Object.entries(corsHeaders)) res.setHeader(k, v);
  res.end(JSON.stringify(body));
}

function checkAuth(req) {
  const secret = process.env.SYNC_API_SECRET;
  if (!secret) {
    const host = req.headers?.host || '';
    if (/^localhost(:\d+)?$/i.test(host) || /^127\.0\.0\.1(:\d+)?$/i.test(host)) {
      return { ok: true };
    }
    return { ok: false, error: 'SYNC_API_SECRET не задан на сервере' };
  }
  const key = req.headers['x-sync-key'];
  if (key !== secret) {
    const hint = key?.startsWith('sb_publishable_') || key?.startsWith('eyJ')
      ? ' Это ключ Supabase — он не подходит. Нужен SYNC_API_SECRET из Vercel Environment Variables.'
      : '';
    return { ok: false, error: `Неверный ключ синхронизации.${hint}` };
  }
  return { ok: true };
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  return JSON.parse(raw);
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    for (const [k, v] of Object.entries(corsHeaders)) res.setHeader(k, v);
    res.end();
    return;
  }

  if (req.method === 'GET') {
    return json(res, 200, {
      sections: SYNC_ORDER.map(id => ({
        id,
        label: PARSERS[id].label,
        requiresNetwork: Boolean(PARSERS[id].requiresNetwork),
        note: PARSERS[id].note,
      })),
    });
  }

  if (req.method !== 'POST') {
    return json(res, 405, { error: 'Method not allowed' });
  }

  const auth = checkAuth(req);
  if (!auth.ok) return json(res, 401, { error: auth.error });

  try {
    const body = await readBody(req);
    const { section, sections, dryRun, fetch: doFetch, onlyMissing, limit } = body;

    if (section === 'all' || sections?.includes?.('all')) {
      const results = await runSyncSections(SAFE_SYNC_ORDER, {
        dryRun: dryRun === true,
        fetch: doFetch === true,
        onlyMissing,
        limit: limit ?? 0,
      });
      return json(res, 200, { results });
    }

    if (sections?.length) {
      const results = await runSyncSections(sections, {
        dryRun: dryRun === true,
        fetch: doFetch === true,
        onlyMissing,
        limit: limit ?? 0,
      });
      return json(res, 200, { results });
    }

    if (!section || !PARSERS[section]) {
      return json(res, 400, { error: 'Укажите section или sections' });
    }

    const result = await runSyncSection(section, {
      dryRun: dryRun === true,
      fetch: doFetch === true,
      onlyMissing,
      limit: limit ?? 0,
    });
    return json(res, 200, { result });
  } catch (e) {
    return json(res, 500, { error: e.message || 'Internal error' });
  }
}

/** Для Vite dev middleware (Node http) */
export async function handleSyncRequest(req, res) {
  return handler(req, res);
}
