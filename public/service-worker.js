const CACHE_NAME = 'wwm-wiki-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/site.webmanifest',
  '/robots.txt',
  '/images/hero-bg.jpg',
  '/images/wwm-logo.png',
];

// Install event - cache files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((err) => {
        console.warn('Cache addAll error:', err);
        return cache.addAll(urlsToCache.slice(0, 3)); // Fallback to essential files
      });
    })
  );
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests and non-GET requests
  if (url.origin !== location.origin || request.method !== 'GET') {
    return;
  }

  // Network-first strategy for API calls and dynamic content
  if (url.pathname.includes('/api/') || url.pathname.includes('/auth/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const cache = caches.open(CACHE_NAME);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((response) => {
            return response || new Response('Offline - resource not available', { status: 503 });
          });
        })
    );
    return;
  }

  // Cache-first strategy for static assets (JS, CSS, images)
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request).then((fetchResponse) => {
          if (fetchResponse.ok) {
            const cache = caches.open(CACHE_NAME);
            cache.then((c) => c.put(request, fetchResponse.clone()));
          }
          return fetchResponse;
        }).catch(() => {
          if (request.destination === 'image') {
            return new Response('', { status: 404 });
          }
          return new Response('', { status: 503 });
        });
      })
    );
    return;
  }

  // Default strategy: network-first
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const cache = caches.open(CACHE_NAME);
          cache.then((c) => c.put(request, response.clone()));
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then((response) => {
          return response || new Response('Offline - page not available', { status: 503 });
        });
      })
  );
});
