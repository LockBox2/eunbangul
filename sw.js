// 은방울 관리일지: 한 번 받은 파일을 기기에 넣어 두고 인터넷 없이도 연다
var CACHE = 'eunbangul-4a8a9ec4';
var FILES = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "img/cart.webp", "img/donkey-base.webp", "img/donkey-stubborn.webp", "img/icon.webp", "img/logo.webp", "img/office.webp", "img/op1.webp", "img/op2.webp", "img/op3.webp", "img/op4.webp", "img/op5.webp", "img/op6.webp", "img/rina-awkward.webp", "img/rina-base.webp", "img/rina-flustered.webp", "img/rina-joy.webp", "img/staff-awkward.webp", "img/staff-base.webp", "snd/clash.mp3", "snd/clear.mp3", "snd/hint.mp3", "snd/place.mp3"];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (hit) {
    return hit || fetch(e.request).then(function (res) {
      if (res.ok && new URL(e.request.url).origin === location.origin) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copy); }); }
      return res;
    });
  }));
});
