const C='binome-v3';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','manifest.webmanifest','icon-192.png','icon-512.png','supabase.js','icon-32.png','icon-180.png','favicon.ico','fonts/bricolage-grotesque-latin-wght-normal.woff2','fonts/source-sans-3-latin-wght-normal.woff2'])))});
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
e.respondWith(fetch(e.request).then(r=>{const x=r.clone();caches.open(C).then(c=>c.put(e.request,x));return r}).catch(()=>caches.match(e.request)))});
