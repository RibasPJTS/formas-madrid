// Fôrmas Madrid – canteiro: guarda a página no aparelho para funcionar sem internet.
const CACHE = "formas-madrid-6fed00f790";
const ARQUIVOS = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png", "./quantitativo.xlsx", "./quantitativo.pdf"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting())) });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("formas-madrid-") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())) });
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  if (req.mode === "navigate") {   // página: tenta a rede (pega versão nova) e cai no que está guardado se estiver sem internet
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put("./index.html", c)); return r }).catch(() => caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(req).then(r => r || fetch(req)));
});
