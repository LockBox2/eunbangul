// 판 끝 마을 연출. 게임(index.html)이 처음 쓸 때 불러온다.
// Village.run(opt, onEnd): 판 위에 같은 판을 겹쳐 띄우고, 기울여 마을로 바꾸고, 관리원이 들어가 불이 켜지면 onEnd()
// Village.close(): 지운다
(function () {
  var TW = 225, TH = 130, TILT = Math.acos(TH / TW) * 180 / Math.PI;
  var BASE = 'vil/';
  var A = { grass: [227, 137], dirt: [218, 140], gstone: [222, 140], fence: [252, 138], 'tree-a': [180, 247], 'tree-b': [233, 240], flowers: [257, 187], lamp: [97, 185], sign: [144, 197], hedge: [141, 114], arch: [172, 172] };
  var HM = {"sa-A": {"w": 240, "h": 203, "fw": 0.95, "chim": [0.38, 0.025]}, "sa-B": {"w": 240, "h": 251, "fw": 0.95, "chim": [0.718, 0.016]}, "sb-A": {"w": 233, "h": 233, "fw": 0.9, "chim": [0.654, 0.021]}, "sb-B": {"w": 240, "h": 273, "fw": 0.9, "chim": [0.294, 0.015]}, "ma-A": {"w": 240, "h": 270, "fw": 1.0, "chim": [0.635, 0.019]}, "ma-B": {"w": 240, "h": 290, "fw": 1.0, "chim": [0.714, 0.014]}, "mb-A": {"w": 240, "h": 236, "fw": 1.1, "chim": [0.642, 0.021]}, "mb-B": {"w": 240, "h": 250, "fw": 1.1, "chim": [0.672, 0.016]}, "farm-A": {"w": 240, "h": 206, "fw": 1.05, "chim": [0.622, 0.019]}, "farm-B": {"w": 201, "h": 141, "fw": 1.05, "chim": [0.33, 0.035]}, "bake-A": {"w": 240, "h": 273, "fw": 1.0, "chim": [0.685, 0.015]}, "bake-B": {"w": 218, "h": 165, "fw": 1.0, "chim": [0.514, 0.03]}, "half-A": {"w": 240, "h": 302, "fw": 0.95, "chim": [0.711, 0.013]}, "half-B": {"w": 207, "h": 174, "fw": 0.95, "chim": [0.267, 0.023]}, "town-A": {"w": 240, "h": 461, "fw": 0.6, "chim": [0.301, 0.009]}, "town-B": {"w": 140, "h": 175, "fw": 0.6, "chim": [0.398, 0.029]}, "chap-A": {"w": 240, "h": 272, "fw": 1.0, "chim": [0.642, 0.015]}, "chap-B": {"w": 194, "h": 184, "fw": 1.0, "chim": [0.32, 0.027]}, "manor-A": {"w": 320, "h": 314, "fw": 2.0, "chim": [0.413, 0.013]}, "manor-B": {"w": 248, "h": 215, "fw": 2.0, "chim": [0.644, 0.023]}, "mill-B": {"w": 233, "h": 176, "fw": 1.3, "chim": [0.39, 0.028]}};
  var PR = {"peddler_left": [61, 76], "grandmother_left": [57, 76], "grandmother_right": [58, 76], "basket_woman_left": [52, 76], "peddler_right": [56, 76], "woodcutter_right": [55, 76], "woodcutter_left": [54, 76], "basket_woman_right": [52, 76], "running_child_left": [42, 64], "running_child_right": [43, 64], "chicken_standing": [26, 31], "chicken_pecking": [29, 31], "cat_sitting": [33, 41], "donkey_wagon_compact": [157, 128], "wooden_bench": [102, 72], "well": [105, 106], "flowerpots": [72, 73], "vegetable_garden": [147, 88], "clothesline": [99, 80], "firewood_pile": [100, 66], "mailbox": [54, 81], "stepping_stones_right": [157, 96], "stepping_stones_left": [143, 92]};
  var KINDS = ['sa', 'sb', 'ma', 'mb', 'farm', 'bake', 'half', 'town', 'chap'];
  var css = '' +
    '#vlay{position:fixed;inset:0;z-index:40;overflow:hidden;background:linear-gradient(#e9dcc2,#cdb896);opacity:0}' +
    '#vlay::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 25% 15%,rgba(255,214,150,.35),rgba(255,214,150,0) 60%);mix-blend-mode:soft-light}' +
    '#vlay .vw{position:absolute;left:50%;top:46%}' +
    '#vlay .vi{position:absolute;left:0;top:0;filter:saturate(1.2) contrast(1.1)}' +
    '#vlay .vi>*{position:absolute;display:block;pointer-events:none}' +
    '#vlay .gr{filter:hue-rotate(24deg) saturate(1.15) brightness(.86)}#vlay .rd{filter:saturate(1.2) brightness(.93)}#vlay .tr{filter:hue-rotate(12deg) brightness(.92)}' +
    '#vlay .tint{clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);mix-blend-mode:multiply;opacity:.85}' +
    '#vlay .house{filter:brightness(.72) saturate(.75);transition:filter .5s;transform-origin:50% 100%}' +
    '#vlay .house.lit{filter:brightness(1.05) saturate(1.05) drop-shadow(0 0 5px rgba(255,210,110,.8))}' +
    '#vlay .house.lit.settle{filter:drop-shadow(0 0 2px rgba(255,215,130,.45))}' +
    '#vlay .rise{transform-origin:50% 100%}#vlay .life{opacity:0}' +
    '#vlay .need{font:700 12px system-ui,sans-serif;color:#fff;background:#d9603f;border:2px solid #fff;border-radius:50%;width:20px;height:20px;display:grid;place-items:center;box-shadow:0 2px 4px rgba(0,0,0,.25)}' +
    '#vlay .smoke{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.9);filter:blur(1.6px);opacity:0}' +
    '#vlay .vf{position:absolute;transform-origin:50% 50%;display:grid;background:#3b2f22;box-shadow:0 0 0 3px #3b2f22}' +
    '#vlay .vf i{display:block;position:relative}#vlay .vf i img{position:absolute;left:8%;top:8%;width:84%}' +
    '#vlay .vf i b{position:absolute;inset:22%;border-radius:50%;background:#d9603f;color:#fff;display:grid;place-items:center;font:700 11px system-ui,sans-serif}' +
    '#vlay .vmsg{position:absolute;left:50%;top:calc(14px + env(safe-area-inset-top));transform:translateX(-50%);background:#fdf9ef;border:1px solid #c9b994;border-radius:10px;padding:8px 14px;font-size:14px;color:#3a3326;box-shadow:0 4px 12px rgba(0,0,0,.15);opacity:0;transition:opacity .4s;white-space:nowrap}' +
    '#vlay .vmsg.on{opacity:1}' +
    'body.vOn #reportVeil{background:rgba(10,14,28,.16);align-items:flex-end;padding-bottom:calc(12px + env(safe-area-inset-bottom))}body.vOn #reportVeil .sheet{box-shadow:0 -6px 24px rgba(0,0,0,.25)}';
  var root_cam = null, anims = [], loops = [], timers = [], root = null, onEnd = null, playing = false, ended = false, sound = null;
  function px(v) { return v.toFixed(1) + 'px'; }
  function later(ms, fn) { timers.push(setTimeout(fn, ms)); }
  function an(el, kf, opt) { var o = { fill: 'forwards', easing: 'ease-out' }; for (var k in opt) o[k] = opt[k]; var a = el.animate(kf, o); (o.iterations === Infinity ? loops : anims).push(a); return a; }
  function close() {
    timers.forEach(clearTimeout); timers = []; anims.concat(loops).forEach(function (a) { try { a.cancel(); } catch (e) {} }); anims = []; loops = [];
    if (root) root.remove(); root = null; playing = false; onEnd = null; document.body.classList.remove('vOn');
  }
  function build(o) {
    var n = o.n, sw = window.innerWidth, sh = window.innerHeight, N = n + 4;
    var s = Math.min(sw / ((n + 1.6) * TW), (sh * 0.8) / ((n + 1.6) * TH + 160));
    var tw = TW * s, th = TH * s, oy = -(N * th) / 2 + 40 * s;
    var carts = {}; o.carts.forEach(function (q) { carts[q.r + ',' + q.c] = q.k; });
    var seed = o.seed || 7; function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
    function at(r, c) { return { x: (c - r) * tw / 2, y: oy + (c + r + 4) * th / 2 }; }
    var list = [];
    function add(z, tag, cls, cs) { var el = document.createElement(tag); if (cls) el.className = cls; el.style.cssText = cs; list.push({ z: z, el: el }); return el; }
    function img(z, name, x, baseY, k2, cls) { var a = A[name], iw = a[0] * s * k2, ih = a[1] * s * k2; var e = add(z, 'img', (cls || '') + (/tree|hedge/.test(name) ? ' tr' : ''), 'left:' + px(x - iw / 2) + ';top:' + px(baseY - ih) + ';width:' + px(iw)); e.src = BASE + name + '.webp'; e._h = ih; return e; }
    function prop(z, name, x, baseY, cls) { var big = /_(left|right)$|chicken|cat/.test(name) && !/stepping/.test(name) ? 1.5 : 1, a = PR[name], iw = a[0] * s * big, ih = a[1] * s * big; var e = add(z, 'img', cls || '', 'left:' + px(x - iw / 2) + ';top:' + px(baseY - ih) + ';width:' + px(iw)); e.src = BASE + 'p/' + name + '.webp'; e._h = ih; return e; }
    function tile(z, name, p) { var e = add(z, 'img', name === 'dirt' ? 'rd' : 'gr', 'left:' + px(p.x - 227 * s / 2) + ';top:' + px(p.y) + ';width:' + px(227 * s)); e.src = BASE + name + '.webp'; return e; }
    // 큰 저택(2×2) 자리
    var mAt = null, cover = {}, reg = o.reg, sol = o.sol, big = o.big;
    if (big >= 0) for (var rr = 0; rr < n && !mAt; rr++) { var cc = sol[rr]; if (reg[rr][cc] !== big) continue;
      [[0, 0], [-1, 0], [0, -1], [-1, -1]].forEach(function (d) { if (mAt) return; var r0 = rr + d[0], c0 = cc + d[1]; if (r0 < 0 || c0 < 0 || r0 + 1 >= n || c0 + 1 >= n) return;
        var cells = [[r0, c0], [r0 + 1, c0], [r0, c0 + 1], [r0 + 1, c0 + 1]];
        var ok = cells.every(function (q) { return reg[q[0]][q[1]] === big && !carts[q[0] + ',' + q[1]] && (sol[q[0]] !== q[1] || (q[0] === rr && q[1] === cc)); });
        if (ok) { mAt = (r0 + 1) + ',' + (c0 + 1); cells.forEach(function (q) { if (q[0] !== r0 + 1 || q[1] !== c0 + 1) cover[q[0] + ',' + q[1]] = 1; }); } });
    }
    var seq = { tint: [], fence: [], rise: [], staff: [], life: [], walk: [] }, r, c, p, z, wellDone = false;
    for (r = -2; r < n + 2; r++) for (c = -2; c < n + 2; c++) {
      if (r >= 0 && c >= 0 && r < n && c < n) continue;
      p = at(r, c); z = (r + c + 4) * 10;
      var road = r >= -1 && c >= -1 && r <= n && c <= n;
      tile(z, road ? 'dirt' : 'grass', p);
      if (!road) {
        if (r === Math.floor(n / 2) && c === -2) { var mm = HM['mill-B'], mw = tw * mm.fw, mh = mm.h * mw / mm.w; add(z + 5, 'img', '', 'left:' + px(p.x - mw / 2) + ';top:' + px(p.y + th * 0.85 - mh) + ';width:' + px(mw)).src = BASE + 'h/mill-B.webp'; continue; }
        var x = rnd(), nm = r === n + 1 && c === n + 1 ? 'sign' : x < 0.45 ? 'tree-a' : x < 0.68 ? 'tree-b' : x < 0.72 ? 'flowers' : null;
        if (nm) img(z + 5, nm, p.x, p.y + th * 0.78, nm === 'sign' ? 0.55 : nm === 'flowers' ? 0.55 : 0.62);
      } else if ((r === -1 || r === n) && (c === -1 || c === n)) img(z + 5, 'lamp', p.x, p.y + th * 0.6, 0.55);
    }
    for (r = 0; r < n; r++) for (c = 0; c < n; c++) {
      p = at(r, c); z = (r + c + 4) * 10;
      var g = reg[r][c], col = o.col[g], depth = r + c, key = r + ',' + c;
      var isStaff = sol[r] === c, isHouse = mAt === key || (isStaff && !cover[key]);
      var tl = tile(z, isHouse ? 'gstone' : 'grass', p);
      seq.tint.push(add(z + 1, 'div', 'tint', 'left:' + px(p.x - tw / 2) + ';top:' + px(p.y) + ';width:' + px(tw) + ';height:' + px(th) + ';background:' + o.colors[g]));
      var fw = tw / 2 * 1.1, fh = A.fence[1] * fw / A.fence[0];
      if (c + 1 < n && reg[r][c + 1] !== g) { var f = add(z + 8, 'img', '', 'left:' + px(p.x - fw * 0.05) + ';top:' + px(p.y + th - fh * 0.98) + ';width:' + px(fw) + ';transform-origin:50% 100%;opacity:0'); f.src = BASE + 'fence.webp'; seq.fence.push({ el: f, d: depth, flip: false }); }
      if (r + 1 < n && reg[r + 1][c] !== g) { var f2 = add(z + 8, 'img', '', 'left:' + px(p.x - tw / 2 - fw * 0.05) + ';top:' + px(p.y + th - fh * 0.98) + ';width:' + px(fw) + ';transform-origin:50% 100%;opacity:0'); f2.src = BASE + 'fence.webp'; seq.fence.push({ el: f2, d: depth, flip: true }); }
      var house = null;
      if (isHouse) {
        var id = mAt === key ? (rnd() < 0.5 ? 'manor-A' : 'manor-B') : KINDS[(g * 5 + r * 3 + c) % KINDS.length] + (rnd() < 0.5 ? '-A' : '-B');
        var M = HM[id], hw = tw * M.fw, hh = M.h * hw / M.w, by = mAt === key ? p.y + th : p.y + th * 0.82;
        house = add(z + 5, 'img', 'house', 'left:' + px(p.x - hw / 2) + ';top:' + px(by - hh) + ';width:' + px(hw) + ';opacity:0');
        house.src = BASE + 'h/' + id + '-' + col + '.webp';
        house._door = { x: p.x, y: by - th * 0.15 };
        var chx = p.x - hw / 2 + hw * M.chim[0], chy = by - hh + hh * M.chim[1];
        house._smoke = [0, 1, 2].map(function () { return add(z + 6, 'div', 'smoke', 'left:' + px(chx - 3.5) + ';top:' + px(chy - 6)); });
        house._mansion = mAt === key;
        if (mAt !== key && rnd() < 0.5) seq.life.push(prop(z + 7, 'mailbox', p.x - tw * 0.34, p.y + th * 0.72, 'life'));
        seq.rise.push({ el: house, d: depth });
      } else if (carts[key]) {
        var cart = prop(z + 5, 'donkey_wagon_compact', p.x, p.y + th * 0.82, 'rise'); cart.style.opacity = 0; seq.rise.push({ el: cart, d: depth });
        var bd = add(z + 7, 'b', 'need', 'left:' + px(p.x + tw * 0.22) + ';top:' + px(p.y + th * 0.8 - cart._h - 12) + ';opacity:0'); bd.textContent = carts[key]; seq.rise.push({ el: bd, d: depth, pop: true });
      } else if (!cover[key]) {
        var mid = Math.abs(r - n / 2 + 0.5) + Math.abs(c - n / 2 + 0.5), y = rnd(), dn = null, pn = null;
        if (!wellDone && mid <= 2) { pn = 'well'; wellDone = true; }
        else if (y < 0.13) dn = 'flowers'; else if (y < 0.19) dn = 'hedge'; else if (y < 0.28) dn = 'tree-b'; else if (y < 0.33) dn = 'tree-a'; else if (y < 0.35) dn = 'arch';
        else if (y < 0.45) pn = 'vegetable_garden'; else if (y < 0.50) pn = 'clothesline'; else if (y < 0.55) pn = 'firewood_pile'; else if (y < 0.59) pn = 'wooden_bench'; else if (y < 0.65) pn = 'flowerpots';
        else if (y < 0.72) pn = (r + c) % 2 ? 'stepping_stones_left' : 'stepping_stones_right';
        else if (y < 0.80) tl.src = BASE + 'gstone.webp';
        if (dn) { var e = img(z + 5, dn, p.x, p.y + th * 0.78, dn === 'hedge' ? 0.5 : dn === 'arch' ? 0.48 : 0.52, 'rise'); e.style.opacity = 0; seq.rise.push({ el: e, d: depth, deco: true }); }
        if (pn) { var flatP = /stepping/.test(pn), e2 = prop(z + (flatP ? 2 : 5), pn, p.x, p.y + th * (flatP ? 0.78 : 0.76), 'rise'); e2.style.opacity = 0; seq.rise.push({ el: e2, d: depth, deco: true }); }
        var q2 = rnd();
        if (!pn || /stepping/.test(pn)) {
          if (q2 < 0.10) seq.life.push(prop(z + 6, 'chicken_standing', p.x - tw * 0.12, p.y + th * 0.62, 'life'));
          else if (q2 < 0.17) seq.life.push(prop(z + 6, 'chicken_pecking', p.x + tw * 0.1, p.y + th * 0.7, 'life'));
          else if (q2 < 0.21) seq.life.push(prop(z + 6, 'cat_sitting', p.x, p.y + th * 0.66, 'life'));
          else if (q2 < 0.28) { var who = ['basket_woman', 'grandmother', 'running_child', 'woodcutter'][Math.floor(rnd() * 4)] + (rnd() < .5 ? '_left' : '_right'); seq.life.push(prop(z + 6, who, p.x + tw * 0.05, p.y + th * 0.72, 'life')); }
        }
      }
      if (isStaff) {
        var tk = tw * 0.62, tok = add(9000 + depth, 'img', '', 'left:' + px(p.x - tk / 2) + ';top:' + px(p.y + th * 0.5 - tk * 0.92) + ';width:' + px(tk) + ';transform-origin:50% 100%;opacity:0');
        tok.src = o.staff[r];
        seq.staff.push({ el: tok, d: depth, house: house, x: p.x, y: p.y + th * 0.5 });
      }
    }
    function walker(name, from, to, dur, delay) {
      var a = PR[name], iw = a[0] * s * 1.5, ih = a[1] * s * 1.5, e = add(8500, 'img', 'life', 'left:' + px(from.x - iw / 2) + ';top:' + px(from.y - ih) + ';width:' + px(iw));
      e.src = BASE + 'p/' + name + '.webp'; seq.walk.push({ el: e, dx: to.x - from.x, dy: to.y - from.y, dur: dur, delay: delay });
    }
    function mid2(r, c) { var q = at(r, c); return { x: q.x, y: q.y + th * 0.55 }; }
    walker('peddler_right', mid2(n, -1), mid2(n, n), 14000, 0);
    walker('basket_woman_right', mid2(n, -1), mid2(n, n), 16000, 7000);
    walker('woodcutter_left', mid2(-1, n), mid2(n, n), 15000, 2500);
    walker('running_child_left', mid2(-1, n), mid2(n, n), 7000, 4000);
    var mansion = null; seq.rise.forEach(function (d) { if (d.el._mansion) mansion = d.el; });
    seq.staff.forEach(function (t) { if (!t.house) t.house = mansion; });
    list.sort(function (a, b) { return a.z - b.z; });
    // 화면 구성
    root = document.createElement('div'); root.id = 'vlay';
    var world = document.createElement('div'); world.className = 'vw';
    var iso = document.createElement('div'); iso.className = 'vi'; list.forEach(function (i) { iso.appendChild(i.el); }); iso.style.opacity = 0;
    // 위에서 본 판: 실제 판 자리에서 시작해 기울면 마을과 겹친다
    var a = tw / Math.SQRT2, side = n * a, cy = oy + (n + 4) * th / 2;
    var flat = document.createElement('div'); flat.className = 'vf';
    var fh2 = '';
    for (r = 0; r < n; r++) for (c = 0; c < n; c++) {
      var gg = reg[r][c], bw = Math.max(1, a * 0.07), sh2 = [];
      if (r + 1 < n && reg[r + 1][c] !== gg) sh2.push('inset 0 -' + px(bw) + ' 0 #3b2f22');
      if (c + 1 < n && reg[r][c + 1] !== gg) sh2.push('inset -' + px(bw) + ' 0 0 #3b2f22');
      var inner = sol[r] === c ? '<img src="' + o.staff[r] + '" alt="">' : carts[r + ',' + c] ? '<b>' + carts[r + ',' + c] + '</b>' : '';
      fh2 += '<i style="background:' + o.colors[gg] + (sh2.length ? ';box-shadow:' + sh2.join(',') : '') + '">' + inner + '</i>';
    }
    flat.innerHTML = fh2;
    world.appendChild(iso); world.appendChild(flat); root.appendChild(world);
    var msg = document.createElement('div'); msg.className = 'vmsg'; msg.textContent = '모든 댁에 불이 켜졌습니다'; root.appendChild(msg);
    document.body.appendChild(root);
    // 판 자리 맞추기: 월드 원점(화면 가로 가운데, 세로 46%) 기준으로 실제 판 가운데·크기
    var wx = sw / 2, wy = sh * 0.46, wy0 = wy, br = o.rect;
    var bcx = br ? br.left + br.width / 2 - wx : 0, bcy = br ? br.top + br.height / 2 - wy : 0, start = br ? br.width / side : Math.min(sw * 0.9, sh * 0.6) / side;
    // 카메라: 가까이(판 마름모가 화면 폭보다 조금 넓게)서 시작해, 다 켜지면 물러나 마을 전체를 위쪽에 보여 준다 (아래는 보고서 자리)
    var Z = Math.max(1, sw * 1.38 / (n * tw)), ty = -Z * cy;
    // 물러난 뒤: 보고서 위 빈자리(화면 위쪽 약 36%)에 판과 흙길이 다 들어오게
    var avail = sh * 0.36, Zf = Math.min(1, avail * 0.98 / ((n + 3) * th)), fy = avail / 2 + 10 - wy0;
    root_cam = { near: 'translate(0px,' + px(ty) + ') scale(' + Z.toFixed(4) + ')', far: 'translate(0px,' + px(fy - Zf * cy) + ') scale(' + Zf.toFixed(4) + ')' };
    world.style.transform = root_cam.near;
    var lx = bcx / Z, ly = (bcy - ty) / Z, ls = start / Z;
    flat.style.cssText = 'left:' + px(-side / 2) + ';top:' + px(cy - side / 2) + ';width:' + px(side) + ';height:' + px(side) + ';grid-template-columns:repeat(' + n + ',1fr);gap:' + px(Math.max(0.6, a * 0.03));
    flat._from = 'translate(' + px(lx) + ',' + px(ly - cy) + ') scale(' + ls.toFixed(4) + ') rotateX(0deg) rotateZ(0deg)';
    flat.style.transform = flat._from;
    root._seq = seq; root._iso = iso; root._flat = flat; root._msg = msg; root._world = world; root._cam = root_cam;
  }
  function smokeLoop(h) { h._smoke.forEach(function (sm, j) { an(sm, [{ opacity: 0, transform: 'translate(0,0) scale(.6)' }, { opacity: .8, offset: .2 }, { opacity: 0, transform: 'translate(' + (j - 1) * 3 + 'px,-' + (20 + j * 5) + 'px) scale(2.3)' }], { duration: 2200, delay: j * 730, iterations: Infinity, fill: 'both' }); }); }
  function lifeOn() {
    var seq = root && root._seq; if (!seq || seq._alive) return; seq._alive = true;
    seq.life.forEach(function (e, i) { an(e, [{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 400, delay: i * 60 });
      if (/chicken/.test(e.src)) an(e, [{ transform: 'none' }, { transform: 'translateY(1.5px) rotate(-6deg)', offset: .5 }, { transform: 'none' }], { duration: 900 + i * 37 % 400, delay: 500 + i * 90, iterations: Infinity, fill: 'none' });
      if (/running_child/.test(e.src)) an(e, [{ transform: 'none' }, { transform: 'translateY(-3px)', offset: .5 }, { transform: 'none' }], { duration: 420, iterations: Infinity, fill: 'none' });
    });
    seq.walk.forEach(function (w) { an(w.el, [{ opacity: 0, transform: 'translate(0,0)' }, { opacity: 1, offset: .06 }, { opacity: 1, offset: .94 }, { opacity: 0, transform: 'translate(' + w.dx + 'px,' + w.dy + 'px)' }], { duration: w.dur, delay: w.delay, iterations: Infinity, easing: 'linear', fill: 'both' }); });
  }
  function end() {
    if (ended) return; ended = true; playing = false;
    lifeOn(); if (sound) sound('bell'); root._msg.classList.add('on');
    // 카메라가 물러나 마을 전체를 보여 주고, 보고서는 아래에서 올라온다
    an(root._world, [{ transform: root._cam.near }, { transform: root._cam.far }], { duration: 1500, easing: 'cubic-bezier(.45,0,.25,1)' });
    later(1500, function () { var f = onEnd; onEnd = null; if (f) f(); });
  }
  function skip() {
    if (!playing) { if (!ended) return; var f = onEnd; onEnd = null; if (f) f(); return; }
    timers.forEach(clearTimeout); timers = [];
    anims.forEach(function (a) { try { a.finish(); } catch (e) {} });
    root.querySelectorAll('.house').forEach(function (h) { if (!h.classList.contains('lit')) { h.classList.add('lit', 'settle'); smokeLoop(h); } });
    end();
  }
  function run(o, done) {
    close();
    if (!document.getElementById('vlayCss')) { var st = document.createElement('style'); st.id = 'vlayCss'; st.textContent = css; document.head.appendChild(st); }
    sound = o.sound || null; onEnd = done; ended = false; playing = true; document.body.classList.add('vOn');
    build(o);
    root.addEventListener('click', skip);
    var seq = root._seq, iso = root._iso, flat = root._flat;
    var tilt = 'translate(0px,0px) scale(1) rotateX(' + TILT + 'deg) rotateZ(45deg)';
    // 1) 배경이 깔리고 판이 기울어 마을 각도가 된다
    an(root, [{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
    if (sound) sound('whoosh');
    an(flat, [{ transform: flat._from }, { transform: tilt }], { duration: 900, delay: 150, easing: 'cubic-bezier(.5,0,.3,1)' });
    an(iso, [{ opacity: 0 }, { opacity: 1 }], { duration: 250, delay: 900 });
    an(flat, [{ opacity: 1 }, { opacity: 0 }], { duration: 250, delay: 1000 });
    seq.staff.forEach(function (t) { an(t.el, [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'none' }], { duration: 200, delay: 1000 }); });
    // 2) 판 색이 걷히고 울타리
    var T = 1200;
    seq.tint.forEach(function (t) { an(t, [{ opacity: .85 }, { opacity: 0 }], { duration: 550, delay: T }); });
    seq.fence.forEach(function (f) { var fl = f.flip ? 'scaleX(-1) ' : ''; an(f.el, [{ opacity: 0, transform: fl + 'scaleY(0)' }, { opacity: 1, transform: fl + 'scaleY(1.12)', offset: .65 }, { opacity: 1, transform: fl + 'scaleY(1)' }], { duration: 320, delay: T + 100 + f.d * 26 }); });
    // 3) 집·수레·마당이 땅에서 솟는다
    var T2 = T + 300, maxD = 0;
    seq.rise.forEach(function (d, i) { maxD = Math.max(maxD, d.d); var dl = T2 + d.d * 34 + (d.deco ? 120 : 0);
      if (d.pop) { an(d.el, [{ opacity: 0, transform: 'scale(.3)' }, { opacity: 1, transform: 'none' }], { duration: 250, delay: dl + 250 }); return; }
      an(d.el, [{ opacity: 0, transform: 'scale(.7, .05)' }, { opacity: 1, transform: 'scale(.96, 1.14)', offset: .6 }, { opacity: 1, transform: 'scale(1.02, .97)', offset: .82 }, { opacity: 1, transform: 'none' }], { duration: 430, delay: dl, easing: 'cubic-bezier(.3,.7,.4,1)' });
      if (!d.deco && sound) later(dl, function () { sound('pop', i); });
    });
    // 4) 관리원이 차례로 들어가면 딸깍, 불이 켜지고 굴뚝 연기
    var order = seq.staff.slice().sort(function (a, b) { return a.d - b.d; }), t0 = T2 + maxD * 34 + 450, gap = 210, last = t0;
    order.forEach(function (t, i) {
      var at2 = t0 + i * gap; last = at2;
      var h = t.house, dx = h ? h._door.x - t.x : 0, dy = h ? h._door.y - t.y : 0;
      an(t.el, [{ transform: 'none', opacity: 1 }, { transform: 'translate(' + dx * .5 + 'px,' + (dy * .5 - 10) + 'px) scale(.85)', opacity: 1, offset: .45 }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.3)', opacity: 0 }], { duration: 430, delay: at2, easing: 'ease-in' });
      later(at2 + 430, function () { if (sound) sound('click', i); if (!h || h.classList.contains('lit')) return; h.classList.add('lit'); later(900, function () { h.classList.add('settle'); }); smokeLoop(h); });
    });
    later(last + 900, end);
  }
  window.Village = { run: run, close: close, active: function () { return !!root; } };
})();
