// Fôrmas Madrid – canteiro: guarda a página no aparelho para funcionar sem internet.
const CACHE = "formas-madrid-dcf6d0c060";
const ARQUIVOS = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png", "./quantitativo.xlsx", "./quantitativo.pdf"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting())) });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("formas-madrid-") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())) });
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  if (req.mode === "navigate") {   // página: tenta a rede (pega versão nova) e cai no que está guardado se estiver sem internet
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put("./index.html", c)); return r }).catch(() => caches.match("./index.html")));
    return;
  }
  // demais arquivos: do aparelho; o que não foi guardado na instalação (ex.: projeto.pdf, 2 MB) fica guardado no 1º download
  e.respondWith(caches.match(req, {ignoreSearch: true}).then(r => r || fetch(req).then(n => { if (n.ok && /projeto\.pdf$/.test(new URL(req.url).pathname)) { const c = n.clone(); caches.open(CACHE).then(x => x.put(req, c)) } return n })));
});
