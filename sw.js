/* Service worker mínimo: permite instalar la app y abrirla aunque falle la conexión.
   Siempre intenta traer la versión nueva de la red; usa la guardada solo si no hay internet. */
var CACHE="hockey-union-v1";
var BASE=["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./apple-touch-icon.png","./favicon.png"];
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(BASE);}).then(function(){return self.skipWaiting();}));
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));
});
self.addEventListener("fetch",function(e){
  var r=e.request;if(r.method!=="GET")return;
  var u=new URL(r.url);if(u.origin!==self.location.origin)return;
  e.respondWith(fetch(r).then(function(res){
    if(res&&res.ok){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(r,cp);});}
    return res;
  }).catch(function(){return caches.match(r).then(function(m){return m||caches.match("./index.html");});}));
});
