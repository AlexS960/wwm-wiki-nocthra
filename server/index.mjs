/**
 * Заготовка API-сервера. Реализация эндпоинтов — следующий этап после деплоя на FirstVDS.
 * Запуск (когда зависимости добавлены): npm run dev
 */
import { createServer } from 'node:http';

const PORT = Number(process.env.PORT) || 3001;

const server = createServer((req, res) => {
  if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, service: 'wwm-wiki-api' }));
    return;
  }
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`[api] health: http://127.0.0.1:${PORT}/api/health`);
});
