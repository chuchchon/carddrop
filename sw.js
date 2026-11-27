/* CardDrop: open offline from the last copy; always try the network first so updates arrive */
const C = "carddrop-v3", SHELL = ["./", "index.html", "namecard.jpg", "line-qr.png", "icon-192.png", "manifest.webmanifest", "questrial.ttf"];
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(SHELL)).catch(() => {})); });
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  const mine = u.origin === location.origin && u.pathname.includes("/carddrop/");
  const lib = /fonts\.(googleapis|gstatic)\.com|cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net/.test(u.host);
  if (!mine && !lib) return;
  e.respondWith(fetch(e.request, mine ? { cache: "no-cache" } : {}).then(r => { if (r.ok) { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); } return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match("index.html"))));
});
