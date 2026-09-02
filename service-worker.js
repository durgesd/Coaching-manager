const CACHE_NAME = 'coaching-manager-v3';
const FILES_TO_CACHE = [
  './coaching-manager.html',
  './manifest.json',
  './icon-192.svg',
  './icon-512.svg',
  './icon-192-maskable.svg',
  './icon-512-maskable.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* Network-first: always try to fetch the latest version first (so app
   updates show up immediately), and only fall back to the cached copy
   when there's no internet connection. This avoids ever getting stuck
   showing an old cached version after the app has been updated. */
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
