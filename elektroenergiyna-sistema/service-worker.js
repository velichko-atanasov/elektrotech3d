const CACHE = 'ees-bulgaria-pwa-v66-direct-ppt-3';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  const isPresentation = url.pathname.includes('/prezentatsiya-tehnicheski-zagubi/') || /\.(ppsx|pdf)$/i.test(url.pathname);
  if (isPresentation) {
    event.respondWith(fetch(event.request, {cache:'no-store'}));
    return;
  }
  event.respondWith(fetch(event.request, {cache:'no-cache'}).then(resp => {
    const copy = resp.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return resp;
  }).catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html'))));
});
