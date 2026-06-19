/**
 * Node-сервер для /api/sync-content на FirstVDS (замена Vercel serverless).
 * Запуск: node server/index.mjs  (из корня репозитория)
 */
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
process.chdir(ROOT);

const PORT = Number(process.env.SYNC_API_PORT || process.env.PORT || 3001);
const HOST = process.env.SYNC_API_HOST || '127.0.0.1';

const { handleSyncRequest } = await import('../api/sync-content.mjs');

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  if (url.pathname === '/health') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true, service: 'sync-api' }));
    return;
  }

  if (url.pathname === '/api/sync-content') {
    handleSyncRequest(req, res).catch(err => {
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: err?.message || 'Internal error' }));
      }
    });
    return;
  }

  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, HOST, () => {
  console.log(`[sync-api] http://${HOST}:${PORT}/api/sync-content`);
  if (!process.env.SYNC_API_SECRET) {
    console.warn('[sync-api] SYNC_API_SECRET не задан — запросы принимаются только с localhost');
  }
});
