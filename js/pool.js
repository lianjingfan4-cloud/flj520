/* ============================================================
   pool.js — 随机内容引擎
   ------------------------------------------------------------
   页面上任何一块内容都可以写成"池子"，每次打开随机抽，
   并且记住抽过什么，尽量不重复。

     Pool.pick('intro', 1)                  取一条
     Pool.fill(el, 'meta', { n: 3 })        填进去
     Pool.rotate(el, 'poem', { ms: 12000 }) 每隔一段时间换一条

   池子本身写在 content.js 里：Pool.define('intro', [...])
   ============================================================ */
(function () {
  'use strict';

  const POOLS = {};
  const SEEN_KEY = 'nova-pool-seen';
  const MAX_SEEN = 400;

  /* 记录"最近出现过什么"，避免连着两次一样 */
  function loadSeen() {
    try { return JSON.parse(sessionStorage.getItem(SEEN_KEY) || '{}'); } catch (e) { return {}; }
  }
  function saveSeen(obj) {
    try {
      const keys = Object.keys(obj);
      if (keys.length > 60) { /* 太多就清一半 */ }
      sessionStorage.setItem(SEEN_KEY, JSON.stringify(obj));
    } catch (e) { }
  }
  let seenCache = loadSeen();

  function seenOf(name) {
    if (!seenCache[name]) seenCache[name] = [];
    return seenCache[name];
  }

  function define(name, arr) {
    POOLS[name] = Array.isArray(arr) ? arr : [];
    return POOLS[name];
  }

  function all(name) { return POOLS[name] || []; }

  /* 抽 n 条：优先没见过的，池子用掉一半后自动清空重来 */
  function pick(name, n) {
    const pool = all(name);
    if (!pool.length) return [];
    const k = Math.max(1, Math.min(n || 1, pool.length));

    let seen = seenOf(name);
    const limit = Math.max(3, Math.floor(pool.length * 0.6));
    if (seen.length > limit) {
      seen = seen.slice(-Math.floor(limit / 2));
      seenCache[name] = seen;
    }

    const fresh = pool.filter(function (_, i) { return seen.indexOf(i) < 0; });
    const old = pool.filter(function (_, i) { return seen.indexOf(i) >= 0; });

    const shuffle = function (a) {
      a = a.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = a[i]; a[i] = a[j]; a[j] = t;
      }
      return a;
    };

    let out = shuffle(fresh.length >= k ? fresh : fresh.concat(old)).slice(0, k);

    /* 记录索引 */
    out.forEach(function (item) {
      const i = pool.indexOf(item);
      if (i >= 0 && seen.indexOf(i) < 0) seen.push(i);
      if (i >= 0) {
        const p = seenCache._pos || {};
      }
    });
    while (seen.length > MAX_SEEN) seen.shift();
    saveSeen(seenCache);
    return out;
  }

  /* ---------- 具体渲染 ---------- */

  function textOf(item) {
    if (typeof item === 'string') return item;
    return item.text || item.v || '';
  }

  function paint(el, items, opt) {
    opt = opt || {};
    const sep = opt.sep || '';
    if (opt.mode === 'lines') {
      el.innerHTML = items.map(function (it) {
        const t = textOf(it);
        const sub = (it && typeof it === 'object' && it.sub) ? '<span class="pool-sub">' + it.sub + '</span>' : '';
        return '<span class="pool-line">' + t + sub + '</span>';
      }).join(sep);
    } else if (opt.mode === 'dl') {
      el.innerHTML = items.map(function (it) {
        const o = (it && typeof it === 'object') ? it : { v: String(it) };
        return '<div><dt>' + (o.k || '') + '</dt><dd>' + (o.v || '') +
          (o.sub ? ' <span class="faint">' + o.sub + '</span>' : '') + '</dd></div>';
      }).join('');
    } else {
      el.innerHTML = items.map(function (it) { return '<li>' + textOf(it) + '</li>'; }).join(sep);
    }
  }

  function fill(el, name, opt) {
    if (!el) return;
    opt = opt || {};
    const items = pick(name, opt.n || 1);
    if (!items.length) return;
    paint(el, items, opt);
    return items;
  }

  /* 定时轮换：淡出 → 换内容 → 淡入 */
  function rotate(el, name, opt) {
    if (!el) return function () { };
    opt = opt || {};
    fill(el, name, opt);

    const ms = opt.ms || 12000;
    let timer = 0;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function step() {
      if (document.hidden) return;
      el.classList.add('pool-out');
      setTimeout(function () {
        fill(el, name, opt);
        el.classList.remove('pool-out');
        el.classList.add('pool-in');
        setTimeout(function () { el.classList.remove('pool-in'); }, 600);
      }, reduce ? 0 : 320);
    }

    function start() { stop(); timer = setInterval(step, ms); }
    function stop() { if (timer) { clearInterval(timer); timer = 0; } }

    start();
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });
    if (opt.hoverPause !== false) {
      el.addEventListener('mouseenter', stop);
      el.addEventListener('mouseleave', start);
    }
    return { next: step, stop: stop, start: start };
  }

  window.Pool = {
    define: define,
    all: all,
    pick: pick,
    fill: fill,
    rotate: rotate,
    paint: paint
  };
})();
