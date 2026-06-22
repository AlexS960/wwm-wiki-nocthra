const CACHE_NAME = 'wwm-wiki-v6';

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

/** Network fetch with cache fallback — promise never rejects (avoids uncaught Failed to fetch). */
function networkFirstWithCacheFallback(request) {
  return fetch(request)
    .then((response) => {
      if (response && response.ok) cachePut(request, response);
      return response;
    })
    .catch(() =>
      caches.match(request).then((cached) => cached || Response.error()),
    );
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  // Navigation, HTML, JS, CSS — не перехватываем: браузер сам грузит с сети без SW-ошибок.
  if (
    request.mode === 'navigate' ||
    request.destination === 'document' ||
    request.destination === 'script' ||
    request.destination === 'style' ||
    url.pathname === '/' ||
    url.pathname === '/index.html' ||
    url.pathname.startsWith('/assets/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.mjs')
  ) {
    return;
  }

  // Картинки и шрифты — cache-first, сеть с безопасным fallback
  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.pathname.startsWith('/images/')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return networkFirstWithCacheFallback(request);
      }),
    );
  }
});
