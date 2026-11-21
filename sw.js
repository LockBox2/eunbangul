// 은방울 관리일지: 한 번 받은 파일을 기기에 넣어 두고 인터넷 없이도 연다
var CACHE = 'eunbangul-6448f144';
var FILES = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "img/btn-navy.webp", "img/btn-wood.webp", "img/cart.webp", "img/ch10a.webp", "img/ch10b.webp", "img/ch11a.webp", "img/ch11b.webp", "img/ch12a.webp", "img/ch2a.webp", "img/ch2b.webp", "img/ch3a.webp", "img/ch3b.webp", "img/ch4a.webp", "img/ch4b.webp", "img/ch5a.webp", "img/ch5b.webp", "img/ch6a.webp", "img/ch6b.webp", "img/ch7a.webp", "img/ch7b.webp", "img/ch7c.webp", "img/ch8a.webp", "img/ch8b.webp", "img/ch9a.webp", "img/desk.webp", "img/donkey-base.webp", "img/donkey-stubborn.webp", "img/end.webp", "img/icon.webp", "img/logo.webp", "img/office.webp", "img/op1.webp", "img/op2.webp", "img/op3.webp", "img/op4.webp", "img/op5.webp", "img/op6.webp", "img/plaque.webp", "img/rina-awkward.webp", "img/rina-base.webp", "img/rina-flustered.webp", "img/rina-joy.webp", "img/staff-1.webp", "img/staff-2.webp", "img/staff-3.webp", "img/staff-4.webp", "img/staff-5.webp", "img/staff-6.webp", "img/staff-7.webp", "img/staff-8.webp", "img/staff-9.webp", "img/stamp.webp", "img/xmark.webp", "snd/bell.mp3", "snd/bgm.mp3", "snd/clash.mp3", "snd/clear.mp3", "snd/hint.mp3", "snd/place.mp3", "snd/stamp.mp3"];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
// 게임 화면(index.html)은 인터넷이 되면 늘 새것을 받고, 안 되면 넣어 둔 것을 쓴다. 그림과 소리는 넣어 둔 것부터 쓴다
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== location.origin) return;  // 순위표 서버처럼 바깥으로 가는 요청은 그대로 둔다
  var url = new URL(e.request.url), page = e.request.mode === 'navigate' || /\/(index\.html)?$/.test(url.pathname);
  if (page && url.origin === location.origin) {
    e.respondWith(fetch(e.request, { cache: 'no-store' }).then(function (res) {
      if (res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put('index.html', copy); }); }
      return res;
    }).catch(function () { return caches.match('index.html').then(function (hit) { return hit || caches.match('./'); }); }));
    return;
  }
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (hit) {
    return hit || fetch(e.request).then(function (res) {
      if (res.ok && url.origin === location.origin) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copy); }); }
      return res;
    });
  }));
});
