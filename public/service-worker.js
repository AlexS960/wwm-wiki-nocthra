const CACHE_NAME = 'wwm-wiki-v5';

/** Только статика изображений — HTML и JS никогда не кэшируем (ломает lazy-чанки после деплоя). */
const IMAGE_CACHE = [
  '/images/hero-bg.jpg',
  '/images/wwm-logo.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(IMAGE_CACHE).catch((err) => {
        console.warn('SW image cache error:', err);
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

  // HTML, JS, CSS — только сеть (иначе мобильные получают старые ссылки на чанки)
  if (
    url.pathname === '/' ||
    url.pathname === '/index.html' ||
    url.pathname.startsWith('/assets/')
  ) {
    event.respondWith(fetch(request));
    return;
  }

  // Картинки — cache-first
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
