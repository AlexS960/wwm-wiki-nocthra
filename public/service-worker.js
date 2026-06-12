const CACHE_NAME = 'wwm-wiki-v3';
const SHELL_CACHE = [
  '/',
  '/index.html',
  '/site.webmanifest',
  '/robots.txt',
  '/images/hero-bg.jpg',
  '/images/wwm-logo.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(SHELL_CACHE).catch((err) => {
        console.warn('Cache addAll error:', err);
        return cache.add('/index.html');
      }),
    ),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
        }),
      ),
    ),
  );
  self.clients.claim();
});

function cachePut(request, response) {
  if (!response || !response.ok) return;
  const copy = response.clone();
  void caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  // Хешированные чанки Vite — всегда с сети (иначе после деплоя остаётся старый JS)
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          cachePut(request, response);
          return response;
        })
        .catch(() => caches.match(request).then((r) => r || new Response('', { status: 503 }))),
    );
    return;
  }

  // index.html — network-first, чтобы подхватывать новые ссылки на чанки
  if (url.pathname === '/' || url.pathname === '/index.html') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          cachePut(request, response);
          return response;
        })
        .catch(() => caches.match('/index.html').then((r) => r || caches.match('/'))),
    );
    return;
  }

  // Статика (картинки, шрифты) — cache-first с подгрузкой из сети
  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.pathname.startsWith('/images/')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          cachePut(request, response);
          return response;
        });
      }),
    );
    return;
  }
});
