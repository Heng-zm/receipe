/**
 * WalkieTalk Service Worker
 *
 * Strategy:
 *   - App shell (index.html, socket.io CDN, Leaflet CDN) → Cache-first
 *     These assets almost never change; cache hits make the app load instantly.
 *
 *   - API calls (/zones, /health, /zones/ping) → Network-first with fallback
 *     Zone data must be fresh; stale zones are worse than no zones.
 *     Falls back to cache only when truly offline.
 *
 *   - All other requests → Network-only (socket.io WebSocket traffic bypasses SW)
 *
 * Cache busting: change CACHE_VERSION when deploying new app code.
 */

const CACHE_VERSION  = 'wt-v1';
const SHELL_CACHE    = `${CACHE_VERSION}-shell`;
const API_CACHE      = `${CACHE_VERSION}-api`;

// Assets to pre-cache on install — everything the app needs to render offline
const SHELL_ASSETS = [
  '/',                          // index.html (served as /)
  'https://cdn.socket.io/4.7.2/socket.io.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
];

// ── Install: pre-cache the shell ─────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => {
      // addAll fails the whole install if any asset 404s — use individual adds
      // with error suppression so a CDN hiccup doesn't break the install.
      return Promise.allSettled(
        SHELL_ASSETS.map((url) =>
          cache.add(url).catch((err) =>
            console.warn('[SW] pre-cache failed for', url, err)
          )
        )
      );
    }).then(() => self.skipWaiting())   // activate immediately, don't wait for tab close
  );
});

// ── Activate: delete old caches ───────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith('wt-') && k !== SHELL_CACHE && k !== API_CACHE)
          .map((k) => {
            console.log('[SW] deleting old cache:', k);
            return caches.delete(k);
          })
      )
    ).then(() => self.clients.claim())  // take control of existing tabs immediately
  );
});

// ── Fetch: route requests ─────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Let WebSocket upgrades and non-GET requests pass straight through
  if (request.method !== 'GET') return;

  // API endpoints — network-first, cache as fallback
  if (isApiRequest(url)) {
    event.respondWith(networkFirstApi(request));
    return;
  }

  // Shell assets — cache-first, network as fallback
  if (isShellAsset(url)) {
    event.respondWith(cacheFirstShell(request));
    return;
  }

  // Everything else (socket.io polling, external CDN not in shell, etc.) — network only
});

// ── Route helpers ─────────────────────────────────────────────────────────────

function isApiRequest(url) {
  // Matches /zones, /zones/ping, /health on the WalkieTalk server
  return url.hostname === 'server-y327.onrender.com' &&
    (url.pathname.startsWith('/zones') || url.pathname === '/health');
}

function isShellAsset(url) {
  // Same origin (the app HTML + any co-hosted assets)
  if (url.origin === self.location.origin) return true;
  // CDN assets pre-cached in SHELL_ASSETS
  return SHELL_ASSETS.some((a) => a === url.href);
}

// Cache-first: serve from cache, fetch + update in background on miss
async function cacheFirstShell(request) {
  const cached = await caches.match(request, { ignoreSearch: true });
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(SHELL_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    // Fully offline and not cached — return a minimal offline page
    return new Response(
      '<!doctype html><meta charset=utf-8><title>WalkieTalk — offline</title>' +
      '<style>body{background:#060608;color:#fff;font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;flex-direction:column;gap:12px;}</style>' +
      '<p style="font-size:22px">WalkieTalk</p>' +
      '<p style="opacity:.5;font-size:14px">No connection — open when back online</p>',
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
}

// Network-first: try network, fall back to cache, don't cache errors
async function networkFirstApi(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response(
      JSON.stringify({ error: 'offline', cached: false }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
