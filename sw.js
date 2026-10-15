/* KIZUNA - Service Worker
 * - App shell (HTML, CSS, JS, iconos): cache-first, para abrir sin conexión.
 * - Datos servicios.json: network-first, para recibir cambios aprobados en GitHub Actions.
 * - Mapas (tiles OSM) y geocodificación (Nominatim): no se cachean, van siempre a red.
 * Subir CACHE_VERSION al publicar cambios grandes para forzar la actualización.
 */
const CACHE_VERSION = "kizuna-v1.0.1";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./brand.css",
  "./app.css",
  "./i18n.js",
  "./app.js",
  "./icon.svg",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./servicios.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Servicios externos: siempre red, sin caché.
  if (url.origin !== self.location.origin) return;

  // Datos: network-first con respaldo en caché.
  if (url.pathname.endsWith("/servicios.json")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copia = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copia));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // App shell: cache-first con actualización en segundo plano.
  event.respondWith(
    caches.match(req).then((cached) => {
      const red = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copia = res.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(req, copia));
          }
          return res;
        })
        .catch(() => cached);
      return cached || red;
    })
  );
});
