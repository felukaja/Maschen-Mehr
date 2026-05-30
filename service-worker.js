/* ═══════════════════════════════════════════════════════════════
   MASCHEN & MASSE — Service Worker
   Ermöglicht Offline-Nutzung und Homescreen-Installation
   ═══════════════════════════════════════════════════════════════ */

const CACHE_NAME = 'maschen-masse-v1';
const ASSETS = [
  '/Maschen-Mehr/',
  '/Maschen-Mehr/index.html',
  '/Maschen-Mehr/style.css',
  '/Maschen-Mehr/app.js',
  '/Maschen-Mehr/anleitungen.js',
  '/Maschen-Mehr/rechner.js',
  '/Maschen-Mehr/notizen.js',
  '/Maschen-Mehr/icon-192.png',
  '/Maschen-Mehr/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600&family=DM+Mono&family=Caveat:wght@600&display=swap',
];

// Installation — Assets cachen
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Aktivierung — alten Cache löschen
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — Network first, Cache als Fallback
self.addEventListener('fetch', e => {
  // Supabase-Anfragen nie cachen
  if (e.request.url.includes('supabase.co')) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Erfolgreiche Antwort auch im Cache speichern
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
