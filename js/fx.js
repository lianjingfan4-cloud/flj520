/* ============================================================
   fx.js — 鼠标云雾 / 漂浮粒子 / 自定义光标
   想调手感：FOG 里的 alpha、DAMP 决定雾的浓度和拖尾长度
   ============================================================ */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  function look() {
    const k = window.LookKit;
    if (!k) return {
      fog: '130,244,255', dust: ['#6ff3ff'], motion: 'drift', size: 1.6, count: 60, mode: 'dark'
    };
    const c = k.current();
    const pt = c.style.particles;
    return {
      fog: c.fog,
      dust: c.dust,
      motion: pt.motion,
      size: pt.size,
      count: pt.count,
      mode: c.mode
    };
  }

  /* ============================================================
     鼠标云雾
     ============================================================ */
  function initFog() {
    const cv = document.getElementById('fog');
    if (!cv) return;
    const ctx = cv.getContext('2d', { alpha: true });
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1;
    let fogRGB = '130,244,255';
    let raf = 0;
    let lastMove = 0;
    const pts = [];
    const MAX = 46;
    const DAMP = 0.075;     // 每帧淡出：越大尾巴越短
    const ALPHA = 0.075;    // 单点浓度

    function sizeCanvas() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = Math.floor(w * dpr);
      cv.height = Math.floor(h * dpr);
      cv.style.width = w + 'px';
      cv.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
    }

    function tint() {
      const t = look();
      fogRGB = t.fog || '130,244,255';
      const light = t.mode === 'light';
      cv.style.mixBlendMode = light ? 'multiply' : 'screen';
      cv.style.opacity = light ? '0.3' : '0.5';
    }

    function add(x, y, power) {
      pts.push({
        x: x, y: y,
        r: (55 + Math.random() * 95) * (power || 1),
        life: 1,
        seed: Math.random() * 100,
        vy: -0.12 - Math.random() * 0.2
      });
      if (pts.length > MAX) pts.splice(0, pts.length - MAX);
    }

    let px = null, py = null;
    function onMove(e) {
      const x = e.clientX, y = e.clientY;
      lastMove = performance.now();
      if (px === null) { add(x, y, 1); px = x; py = y; return; }
      const dist = Math.hypot(x - px, y - py);
      const steps = Math.min(7, Math.max(1, Math.round(dist / 42)));
      for (let i = 1; i <= steps; i++) {
        add(px + (x - px) * (i / steps), py + (y - py) * (i / steps), 0.65 + 0.35 * (i / steps));
      }
      px = x; py = y;
    }

    function onDown(e) { add(e.clientX, e.clientY, 1.6); }

    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,' + DAMP + ')';
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = 'source-over';
      for (let i = pts.length - 1; i >= 0; i--) {
        const p = pts[i];
        p.life *= 0.973;
        if (p.life < 0.02) { pts.splice(i, 1); continue; }
        p.x += Math.sin(now * 0.0004 + p.seed) * 0.55;
        p.y += p.vy;

        const r = p.r * (1.45 - p.life * 0.45);
        const a = ALPHA * p.life;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        g.addColorStop(0, 'rgba(' + fogRGB + ',' + a + ')');
        g.addColorStop(0.42, 'rgba(' + fogRGB + ',' + (a * 0.42) + ')');
        g.addColorStop(1, 'rgba(' + fogRGB + ',0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 没人动鼠标时，也留一层缓慢呼吸的雾
    setInterval(function () {
      if (document.hidden) return;
      if (performance.now() - lastMove < 3200) return;
      add(Math.random() * w, h * (0.6 + Math.random() * 0.4), 0.5);
    }, 2600);

    sizeCanvas();
    tint();
    window.addEventListener('resize', sizeCanvas);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('lookchange', tint);

    if (!reduceMotion) raf = requestAnimationFrame(frame);
    else { /* 减少动效时只画一帧底色 */ }
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && !reduceMotion && !raf) raf = requestAnimationFrame(frame);
    });
  }

  /* ============================================================
     漂浮粒子（每个主题的运动方式不同）
     ============================================================ */
  function initDust() {
    const cv = document.getElementById('dust');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1, raf = 0;
    let parts = [];
    let conf = { dust: ['#6ff3ff'], motion: 'drift', size: 1.6, count: 60, mode: 'dark' };

    function sizeCanvas() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      cv.width = Math.floor(w * dpr);
      cv.height = Math.floor(h * dpr);
      cv.style.width = w + 'px';
      cv.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawn(initial) {
      const c = conf;
      const speed = c.motion === 'rise' ? -(0.18 + Math.random() * 0.5)
        : c.motion === 'fall' ? (0.25 + Math.random() * 0.55)
          : (Math.random() - 0.5) * 0.24;
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : (c.motion === 'rise' ? h + 20 : c.motion === 'fall' ? -20 : Math.random() * h),
        r: (c.size || 1.6) * (0.5 + Math.random() * 1.4),
        vx: (Math.random() - 0.5) * 0.22,
        vy: speed,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.02,
        ph: Math.random() * Math.PI * 2,
        sp: 0.4 + Math.random() * 1.2,
        color: c.dust[Math.floor(Math.random() * c.dust.length)],
        alpha: 0.25 + Math.random() * 0.5
      };
    }

    function seed() {
      conf = look();
      const n = Math.round((conf.count || 60) * (window.innerWidth < 760 ? 0.55 : 1));
      parts = [];
      for (let i = 0; i < n; i++) parts.push(spawn(true));
    }

    function frame(t) {
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      ctx.clearRect(0, 0, w, h);
      const isLight = conf.mode === 'light';
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.x += p.vx + Math.sin(t * 0.0006 * p.sp + p.ph) * 0.32;
        p.y += p.vy;
        p.rot += p.vr;

        if (p.y < -60) p.y = h + 40;
        if (p.y > h + 60) p.y = -40;
        if (p.x < -60) p.x = w + 40;
        if (p.x > w + 60) p.x = -40;

        const tw = 0.45 + 0.55 * Math.abs(Math.sin(t * 0.0012 * p.sp + p.ph));
        ctx.globalAlpha = p.alpha * tw * (isLight ? 0.75 : 1);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        if (conf.motion === 'fall') {
          ctx.ellipse(p.x, p.y, p.r * 1.5, p.r * 0.7, p.rot, 0, Math.PI * 2);
        } else {
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        }
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    sizeCanvas();
    seed();
    window.addEventListener('resize', function () { sizeCanvas(); seed(); });
    window.addEventListener('lookchange', seed);
    if (!reduceMotion) raf = requestAnimationFrame(frame);
  }

  /* ============================================================
     自定义光标
     ============================================================ */
  function initCursor() {
    if (!finePointer) return;
    let cur = document.getElementById('cursor');
    // 没有就自己建一个 —— 这样每一页的光标都一样，不会再丢
    if (!cur) {
      cur = document.createElement('div');
      cur.id = 'cursor';
      cur.className = 'cursor';
      cur.setAttribute('aria-hidden', 'true');
      cur.innerHTML = '<span class="cursor-dot"></span><span class="cursor-ring"></span>';
      document.body.appendChild(cur);
    }
    document.documentElement.classList.add('has-cursor');
    const dot = cur.querySelector('.cursor-dot');
    const ring = cur.querySelector('.cursor-ring');

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    window.addEventListener('pointermove', function (e) {
      mx = e.clientX; my = e.clientY;
      cur.classList.add('on');
    }, { passive: true });

    document.addEventListener('pointerover', function (e) {
      const el = e.target;
      if (el && el.closest && el.closest('a, button, .card, .work, .tp-item, .sun')) {
        cur.classList.add('grow');
      } else {
        cur.classList.remove('grow');
      }
    });

    window.addEventListener('pointerdown', function () {
      cur.classList.add('grow');
      setTimeout(function () { cur.classList.remove('grow'); }, 260);
    });

    (function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if (dot) dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
      if (ring) ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
      requestAnimationFrame(loop);
    })();
  }

  window.FX = {
    init: function () {
      initFog();
      initDust();
      initCursor();
    }
  };
})();
