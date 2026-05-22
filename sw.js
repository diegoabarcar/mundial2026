const CACHE = 'mundial2026-v1';
const ASSETS = [
  './mundial2026-firebase.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://fonts.googleapis.com/css2?family=Anton&family=Barlow:wght@400;500;600;700&display=swap',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(()=>{}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network first for Firebase, cache first for static assets
  if (e.request.url.includes('firebase') || e.request.url.includes('googleapis.com/identitytoolkit')) {
    return; // Let Firebase handle its own requests
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
