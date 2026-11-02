const CACHE = 'ees-bulgaria-pwa-v76-2-scada-link';
const APP_SHELL = ['./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
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
  const isPresentation = url.pathname.includes('/prezentatsiya-tehnicheski-zagubi/') || url.pathname.includes('/prezentatsiya-scada-ami/') || /\.ppsx$/i.test(url.pathname);
  if (isPresentation) {
    event.respondWith(fetch(event.request, {cache:'no-store'}));
    return;
  }
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request, {cache:'reload'}).catch(() => caches.match('./index.html')));
    return;
  }
  event.respondWith(fetch(event.request, {cache:'no-cache'}).then(resp => {
    const copy = resp.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return resp;
  }).catch(() => caches.match(event.request)));
});
