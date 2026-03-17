// Simple service worker for offline PWA
const CACHE_NAME = 'smart-calculator-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/utils.js',
  '/js/calculator.js',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

