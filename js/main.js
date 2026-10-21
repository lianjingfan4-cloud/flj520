/* ============================================================
   main.js — 打字机 / 揭幕 / 数字滚动 / 3D 倾斜 / 复制 / 快捷键
   ============================================================ */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = function (s, ctx) { return (ctx || document).querySelector(s); };
  const $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };

  /* ---------------- 提示条 ---------------- */
  const toastEl = $('#toast');
  let toastTimer = 0;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2400);
  }

  /* ---------------- 实时时钟 ---------------- */
  function initClock() {
    const el = $('#clock');
    if (!el) return;
    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function tick() {
      const d = new Date();
      el.innerHTML = pad(d.getHours()) + ':' + pad(d.getMinutes()) + '<span>:' + pad(d.getSeconds()) + '</span>';
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------------- 打字机 ---------------- */
  function initTypewriter() {
    const el = $('#typewriter');
    if (!el) return;
    const ZH = [
      '一个学飞行器设计的山东人',
      '在莫斯科待过一年半',
      '图寻高手',
      '看得开的人',
      '喜欢山和雪的人'
    ];
    const EN = ['An aircraft designer from Shandong', 'Eighteen months in Moscow', 'A GeoGuessr nerd', 'Someone who lets things go', 'A person who likes mountains and snow'];
    let phrases = (document.documentElement.getAttribute('lang') === 'en') ? EN : ZH;
    window.addEventListener('langchange', function (ev) {
      phrases = ev.detail === 'en' ? EN : ZH;
      pi = 0; deleting = false; ci = phrases[0].length;
      el.textContent = phrases[0];
    });
    if (reduceMotion) { el.textContent = phrases[0]; return; }

    let pi = 0, ci = phrases[0].length, deleting = true;
    el.textContent = phrases[0];

    function tick() {
      const p = phrases[pi];
      ci += deleting ? -1 : 1;
      el.textContent = p.slice(0, Math.max(0, ci));

      let delay = deleting ? 42 : 92;
      if (!deleting && ci >= p.length) { deleting = true; delay = 2400; }
      else if (deleting && ci <= 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 420; }

      setTimeout(tick, delay + Math.random() * 70);
    }
    setTimeout(tick, 2600);
  }

  /* ---------------- 滚动揭幕 ---------------- */
  function initReveal() {
    const items = $$('[data-reveal]');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- 数字滚动 ---------------- */
  function initCounters() {
    const nums = $$('.num[data-count]');
    if (!nums.length) return;

    function run(el) {
      const target = parseFloat(el.dataset.count) || 0;
      const suffix = el.dataset.suffix || '';
      if (reduceMotion) { el.textContent = target + suffix; return; }
      const dur = 1400;
      const t0 = performance.now();
      function step(t) {
        const p = Math.min(1, (t - t0) / dur);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * e) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) { nums.forEach(run); return; }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    nums.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- 3D 倾斜 + 光斑 ---------------- */
  function initTilt() {
    if (reduceMotion || !window.matchMedia('(pointer: fine)').matches) return;
    $$('.tilt').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rx = (0.5 - py) * 7;
        const ry = (px - 0.5) * 9;
        el.style.transform = 'perspective(1000px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateY(-4px)';
        el.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        el.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      });
      el.addEventListener('pointerleave', function () {
        el.style.transform = '';
      });
    });
  }

  /* ---------------- 磁吸按钮 ---------------- */
  function initMagnetic() {
    if (reduceMotion || !window.matchMedia('(pointer: fine)').matches) return;
    $$('[data-magnetic]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        el.style.transform = 'translate(' + (dx * 10).toFixed(2) + 'px,' + (dy * 8).toFixed(2) + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------------- 复制邮箱 ---------------- */
  function initCopy() {
    const btn = $('#copyMail');
    if (!btn) return;
    btn.addEventListener('click', function () {
      const mail = btn.dataset.mail || 'hello@nova.studio';
      function done() { toast('已复制 ' + mail + ' ✦'); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(mail).then(done, fallback);
      } else { fallback(); }
      function fallback() {
        const ta = document.createElement('textarea');
        ta.value = mail;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } catch (e) { toast(mail); }
        document.body.removeChild(ta);
      }
    });
  }

  /* ---------------- 滚动进度 / 导航状态 ---------------- */
  function initScroll() {
    const bar = $('#progress');
    const nav = $('#nav');
    let ticking = false;

    function update() {
      const y = window.scrollY || window.pageYOffset;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (bar) bar.style.transform = 'scaleX(' + Math.min(1, y / max).toFixed(4) + ')';
      if (nav) nav.classList.toggle('scrolled', y > 40);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------------- 快捷键 ---------------- */
  function initKeys() {
    const grain = $('.grain');
    const L = function () { return window.LookKit; };

    document.addEventListener('keydown', function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      const k = e.key;

      if (k === 'Escape') { if (L()) L().close(); return; }

      if (k === 't' || k === 'T') {
        e.preventDefault();
        if (L()) L().toggle();
        return;
      }

      if (k === 'g' || k === 'G') {
        e.preventDefault();
        if (!grain) return;
        grain.classList.toggle('off');
        toast(grain.classList.contains('off') ? '颗粒感：关' : '颗粒感：开');
        return;
      }

      if (k === '?') { toast('彩蛋：你大概也是那种会按问号的人 ✦'); return; }

      if (/^[1-8]$/.test(k) && L()) {
        const s = L().styles[parseInt(k, 10) - 1];
        if (s) L().setStyle(s.id, true);
        return;
      }

      if (k === '[' && L()) { e.preventDefault(); L().cyclePalette(-1); return; }
      if (k === ']' && L()) { e.preventDefault(); L().cyclePalette(1); return; }
    });
  }

  /* ---------------- 光斑跟随（所有卡片） ---------------- */
  function initSpotlight() {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    $$('.card').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      });
    });
  }

  /* ---------------- 开场 ---------------- */
  function initCover() {
    const cover = document.getElementById('cover');
    if (!cover) return;
    let done = false;
    function hide() {
      if (done) return;
      done = true;
      cover.classList.add('go');
      setTimeout(function () { cover.remove(); }, 1200);
    }
    // 开场交给粒子：噪点聚成名字，再散成鸟
    if (window.Particles && document.getElementById('introCanvas')) {
      cover.classList.add('p-canvas');
      window.Particles.intro();
      return;
    }
    if (reduceMotion) { hide(); return; }
    const t = setTimeout(hide, 2100);
    ['click', 'keydown', 'wheel', 'touchstart'].forEach(function (ev) {
      window.addEventListener(ev, function () { clearTimeout(t); hide(); }, { once: true, passive: true });
    });
  }

  /* ---------------- 复制微信号 ---------------- */
  function initWechat() {
    const link = document.querySelector('[data-wechat]');
    if (!link) return;
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const num = '18863695857';
      function done() { toast('微信已复制：' + num); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(num).then(done, done);
      } else { done(); }
    });
  }

  /* ---------------- 手机：右侧页点 ---------------- */
  function initPageDots() {
    const ids = ['top', 'quote', 'about', 'record', 'atlas', 'contact'];
    const targets = ids.map(function (id) { return document.getElementById(id); }).filter(Boolean);
    if (targets.length < 2) return;

    const nav = document.createElement('nav');
    nav.className = 'page-dots';
    nav.setAttribute('aria-label', '页面导航');

    const dots = targets.map(function (t) {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', t.id);
      b.addEventListener('click', function () {
        t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      });
      nav.appendChild(b);
      return b;
    });
    document.body.appendChild(nav);

    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        const i = targets.indexOf(en.target);
        dots.forEach(function (d, j) { d.classList.toggle('on', j === i); });
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ---------------- 彩蛋：科乐美秘技 ---------------- */
  function initKonami() {
    const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let at = 0;
    document.addEventListener('keydown', function (e) {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === seq[at]) {
        at++;
        if (at === seq.length) {
          at = 0;
          toast('↑↑↓↓←→←→BA —— 门开了。');
          setTimeout(function () { window.location.href = 'room.html'; }, 900);
        }
      } else {
        at = (k === seq[0]) ? 1 : 0;
      }
    });
  }

  /* ---------------- 名字轮换（中文 / 拼音 / 英文名） ---------------- */
  function initNameCycle() {
    const el = document.querySelector('.ln2');
    if (!el) return;

    const NAMES = [
      { text: '范连璟', kind: 'cn' },
      { text: 'FAN LIANJING', kind: 'pinyin' },
      { text: 'VALENTINE', kind: 'valentine' },
      { text: '瓦伦丁', kind: 'cn' }
    ];

    let at = 0;
    let timer = 0;

    function fitName() {
      el.style.fontSize = '';
      const avail = (el.parentElement && el.parentElement.clientWidth) || 0;
      if (!avail) return;
      const w = el.scrollWidth;
      if (w > avail) {
        const base = parseFloat(getComputedStyle(el).fontSize) || 60;
        el.style.fontSize = Math.floor(base * avail / w * 0.97) + 'px';
      }
    }

    function paint(i, animate) {
      const n = NAMES[i];
      const swap = function () {
        el.dataset.text = n.text;
        el.innerHTML = n.text + '<em class="deg">°</em>';
        el.classList.remove('name-cn', 'name-lat', 'name-pinyin', 'name-valentine');
        el.classList.add('name-' + n.kind);
        el.classList.remove('name-out');
        fitName();
      };
      if (!animate || reduceMotion) { swap(); return; }
      el.classList.add('name-out');
      setTimeout(swap, 260);
    }

    paint(0, false);
    window.addEventListener('resize', fitName);

    function tick() {
      at = (at + 1) % NAMES.length;
      paint(at, true);
    }
    timer = setInterval(tick, 5200);

    el.addEventListener('click', function (e) {
      clearInterval(timer);
      tick();
      timer = setInterval(tick, 5200);
      if (window.Particles) window.Particles.burst(e.clientX, e.clientY, 110);
    });
    el.style.cursor = 'pointer';
    el.title = '点一下，换个名字';
  }

  /* ---------------- 启动 ---------------- */
  function boot() {
    initCover();
    initNameCycle();
    initClock();
    initTypewriter();
    initReveal();
    initCounters();
    initTilt();
    initMagnetic();
    initCopy();
    initWechat();
    initScroll();
    initKeys();
    initSpotlight();
    initPageDots();
    initKonami();

    // 七下太阳之后的彩蛋
    window.addEventListener('egg:door', function () {
      toast('你找到门了 —— 页脚最下面，多了一个字。');
    });

    if (window.FX) window.FX.init();

    // 首次访问时的问候
    let first = false;
    try { first = !localStorage.getItem('nova-seen'); localStorage.setItem('nova-seen', '1'); } catch (e) { }
    if (first) setTimeout(function () { toast('右上角的小太阳 ☀ 有 60 种颜色、10 种风格'); }, 2600);

    console.log('%c 范连璟 ', 'background:linear-gradient(90deg,#4b6bff,#b9c7ff);color:#05060f;font-weight:700;padding:4px 8px;border-radius:4px', '\n这页是自己搭的。\n· 连点七下小太阳，页脚会多一个字\n· 键盘 ↑↑↓↓←→←→BA\n· 房间的口令在第一页念过（四个字）\n· 房间里还有一封没寄出的信（要班号）\n· 按 ? 还有一句');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
