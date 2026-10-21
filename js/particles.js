/* ============================================================
   particles.js — 开场：噪点聚成名字 → 散成鸟
   ------------------------------------------------------------
   每次打开随机三件事：
     1. 名字（中文 / 拼音 / VALENTINE / 瓦伦丁）
     2. 粒子形状（圆点 / 方片 / 三角 / 爱心 / 星 / 鸟 / 花瓣）
     3. 一套颜色（三色）
   一次只用一种形状、一套颜色 —— 聚起来是一整片，散开是一整群。
   ============================================================ */
(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const NAMES = [
    { text: '范连璟', cn: true },
    { text: 'FAN LIANJING', cn: false },
    { text: 'VALENTINE', cn: false },
    { text: '瓦伦丁', cn: true }
  ];

  const SHAPES = ['dot', 'square', 'triangle', 'heart', 'star', 'bird', 'petal'];

  const SCHEMES = [
    ['#7cf3ff', '#b79cff', '#ff6ec7'],
    ['#ffd166', '#ff7b54', '#ffe9a8'],
    ['#8affc1', '#5eead4', '#b8fff0'],
    ['#ff5f6d', '#ffc371', '#ffe29a'],
    ['#a0c4ff', '#bdb2ff', '#ffc6ff'],
    ['#f2f6ff', '#c9d8ff', '#9fb8ff'],
    ['#ffd6e0', '#ff9ecb', '#c77dff']
  ];

  function fontFor(cn, size) {
    return (cn ? '700 ' : '600 ') + size + 'px ' +
      (cn ? '"Songti SC","Noto Serif SC","SimSun",serif' : '"Space Grotesk","Helvetica Neue",sans-serif');
  }

  function sampleText(text, cn, W, H, step) {
    const probe = document.createElement('canvas').getContext('2d');
    let size = Math.min(H * 0.5, 400);
    probe.font = fontFor(cn, size);
    let w = probe.measureText(text).width;
    const maxW = W * 0.82;
    if (w > maxW) size = size * (maxW / w);
    size = Math.max(36, size);
    probe.font = fontFor(cn, size);
    w = probe.measureText(text).width;
    if (w > maxW) size = size * (maxW / w) * 0.98;

    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const x = c.getContext('2d');
    x.fillStyle = '#fff';
    x.textAlign = 'center';
    x.textBaseline = 'middle';
    x.font = fontFor(cn, size);
    x.fillText(text, W / 2, H / 2);

    const data = x.getImageData(0, 0, W, H).data;
    const pts = [];
    for (let y = 0; y < H; y += step) {
      for (let px = 0; px < W; px += step) {
        const idx = ((y | 0) * W + (px | 0)) * 4 + 3;
        if (data[idx] > 120) {
          pts.push([px + (Math.random() - .5) * step, y + (Math.random() - .5) * step]);
        }
      }
    }
    return pts;
  }

  /* ---------------- 形状 ---------------- */
  function drawParticle(ctx, shape, x, y, s, rot) {
    const r = s;
    switch (shape) {
      case 'square':
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(x, y - r * 1.4);
        ctx.lineTo(x + r * 1.25, y + r * .85);
        ctx.lineTo(x - r * 1.25, y + r * .85);
        ctx.closePath();
        ctx.fill();
        break;
      case 'heart':
        ctx.beginPath();
        ctx.moveTo(x, y + r * 1.1);
        ctx.bezierCurveTo(x - r * 2.1, y - r * .4, x - r * .75, y - r * 1.75, x, y - r * .55);
        ctx.bezierCurveTo(x + r * .75, y - r * 1.75, x + r * 2.1, y - r * .4, x, y + r * 1.1);
        ctx.fill();
        break;
      case 'star': {
        const spikes = 5, outer = r * 1.5, inner = r * 0.62;
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
          const rad = i % 2 === 0 ? outer : inner;
          const a = (i * Math.PI) / spikes - Math.PI / 2 + rot * .2;
          const px = x + Math.cos(a) * rad;
          const py = y + Math.sin(a) * rad;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        break;
      }
      case 'bird':
        ctx.beginPath();
        ctx.moveTo(x - r * 1.8, y + r * .3);
        ctx.quadraticCurveTo(x - r * .7, y - r * 1.1, x, y - r * .1);
        ctx.quadraticCurveTo(x + r * .7, y - r * 1.1, x + r * 1.8, y + r * .3);
        ctx.lineWidth = Math.max(1, s * .42);
        ctx.stroke();
        break;
      case 'petal':
        ctx.beginPath();
        ctx.ellipse(x, y, r * .75, r * 1.45, rot, 0, Math.PI * 2);
        ctx.fill();
        break;
      default:
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }
  }

  /* ---------------- 开场 ---------------- */
  function intro(opts) {
    const canvas = document.getElementById('introCanvas');
    const cover = document.getElementById('cover');
    if (!canvas || !cover) return;

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    let pts = [];
    let raf = 0, phase = 'gather', t0 = 0, now = 0;

    const pick = (opts && opts.text)
      ? { text: opts.text, cn: /[\u4e00-\u9fa5]/.test(opts.text) }
      : NAMES[Math.floor(Math.random() * NAMES.length)];

    /* 每次打开：一种形状 + 一套颜色 */
    const shape = (opts && opts.shape) || SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const scheme = SCHEMES[Math.floor(Math.random() * SCHEMES.length)];
    cover.dataset.shape = shape;
    cover.dataset.name = pick.text;

    function size() {
      W = canvas.clientWidth || window.innerWidth;
      H = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function build() {
      const step = W < 600 ? 4 : (W < 1100 ? 3 : 3);
      const targets = sampleText(pick.text, pick.cn, W, H, step);
      const max = 4200;
      const stride = Math.max(1, Math.ceil(targets.length / max));
      pts = [];
      for (let i = 0; i < targets.length; i += stride) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.max(W, H) * (0.55 + Math.random() * 0.5);
        pts.push({
          tx: targets[i][0], ty: targets[i][1],
          x: W / 2 + Math.cos(a) * r,
          y: H / 2 + Math.sin(a) * r,
          vx: 0, vy: 0,
          s: 0.75 + Math.random() * 0.85,
          ph: Math.random() * 6.283,
          rot: Math.random() * 6.283,
          rotv: (Math.random() - .5) * 0.04,
          c: scheme[i % scheme.length],
          bird: false
        });
      }
    }

    const ease = function (t) { return 1 - Math.pow(1 - t, 3); };

    function draw(t) {
      now = t;
      const el = t - t0;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';

      if (phase === 'gather') {
        const k = ease(Math.min(1, el / 1250));
        pts.forEach(function (p) {
          p.x += (p.tx - p.x) * (0.055 + k * 0.19);
          p.y += (p.ty - p.y) * (0.055 + k * 0.19);
          ctx.globalAlpha = 0.28 + k * 0.7;
          ctx.fillStyle = p.c;
          ctx.strokeStyle = p.c;
          drawParticle(ctx, shape, p.x, p.y, p.s * (1.15 - k * 0.25), p.rot);
        });
        if (el > 1350) { phase = 'hold'; t0 = t; }
      } else if (phase === 'hold') {
        pts.forEach(function (p) {
          p.x += (p.tx - p.x) * 0.24 + Math.sin(now * 0.002 + p.ph) * 0.1;
          p.y += (p.ty - p.y) * 0.24 + Math.cos(now * 0.0017 + p.ph) * 0.1;
          p.rot += p.rotv;
          ctx.globalAlpha = 0.92;
          ctx.fillStyle = p.c;
          ctx.strokeStyle = p.c;
          drawParticle(ctx, shape, p.x, p.y, p.s, p.rot);
        });
        if (el > 950) {
          phase = 'fly';
          t0 = t;
          pts.forEach(function (p) {
            const a = Math.atan2(p.y - H / 2, p.x - W / 2) + (Math.random() - .5) * .9;
            const v = 0.9 + Math.random() * 2.1;
            p.vx = Math.cos(a) * v;
            p.vy = Math.sin(a) * v * .6 - (0.5 + Math.random() * 1.3);
            if (Math.random() < 0.34) p.bird = true;
          });
        }
      } else {
        const k = Math.min(1, el / 2200);
        ctx.globalCompositeOperation = 'source-over';
        pts.forEach(function (p) {
          if (p.bird) {
            p.vx += (Math.random() - .5) * 0.05;
            p.vy += (Math.random() - .5) * 0.05 - 0.004;
            const sp = Math.hypot(p.vx, p.vy) || 1;
            const want = 1.2 + p.s * 1.2;
            p.vx = p.vx / sp * want;
            p.vy = p.vy / sp * want;
            p.x += p.vx;
            p.y += p.vy;
            const flap = Math.sin(now * 0.012 + p.ph);
            ctx.globalAlpha = Math.max(0, 1 - k * 1.05);
            ctx.strokeStyle = p.c;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            const s = p.s * 3.1, w = s * 1.6, lift = flap * s * 1.15;
            ctx.moveTo(p.x - w, p.y - lift * .3);
            ctx.quadraticCurveTo(p.x - w * .45, p.y - lift, p.x, p.y);
            ctx.quadraticCurveTo(p.x + w * .45, p.y - lift, p.x + w, p.y - lift * .3);
            ctx.stroke();
          } else {
            p.x += p.vx * .5;
            p.y += p.vy * .5;
            p.vy -= 0.008;
            p.rot += p.rotv * 2;
            ctx.globalAlpha = Math.max(0, (1 - k) * .6);
            ctx.fillStyle = p.c;
            ctx.strokeStyle = p.c;
            drawParticle(ctx, shape, p.x, p.y, p.s * .6, p.rot);
          }
        });
        if (k >= 1) {
          cancelAnimationFrame(raf);
          cover.classList.add('go');
          setTimeout(function () { if (cover.parentNode) cover.parentNode.removeChild(cover); }, 900);
          return;
        }
      }
      raf = requestAnimationFrame(draw);
    }

    size();
    build();
    // 中文字体没加载完时，canvas 上的字会是空的 —— 等字体就绪再采一次
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { build(); });
    }
    if (!pts.length) {
      // 兜底：用系统衬线字体再采一次
      size();
      const back = sampleText(pick.text, true, W, H, W < 600 ? 3.2 : 2.6);
      if (back.length) {
        pts = [];
        for (let i = 0; i < back.length; i += Math.max(1, Math.ceil(back.length / 4200))) {
          pts.push({ tx: back[i][0], ty: back[i][1], x: W / 2, y: H / 2, vx: 0, vy: 0, s: 0.75 + Math.random() * 0.85, ph: Math.random() * 6.283, rot: Math.random() * 6.283, rotv: (Math.random() - .5) * 0.04, c: scheme[i % scheme.length], bird: false });
        }
      }
    }
    window.addEventListener('resize', function () { size(); });
    if (reduce) {
      cover.classList.add('go');
      setTimeout(function () { if (cover.parentNode) cover.parentNode.removeChild(cover); }, 400);
      return;
    }
    raf = requestAnimationFrame(function (t) { t0 = t; draw(t); });

    cover.addEventListener('click', function () {
      cancelAnimationFrame(raf);
      cover.classList.add('go');
      setTimeout(function () { if (cover.parentNode) cover.parentNode.removeChild(cover); }, 900);
    });
  }

  /* ---------------- 点名字：炸一小片 ---------------- */
  let burstCanvas = null, bctx = null;

  function burst(x, y, n) {
    if (reduce) return;
    if (!burstCanvas) {
      burstCanvas = document.createElement('canvas');
      burstCanvas.className = 'burst-canvas';
      document.body.appendChild(burstCanvas);
      bctx = burstCanvas.getContext('2d');
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    burstCanvas.width = window.innerWidth * dpr;
    burstCanvas.height = window.innerHeight * dpr;
    burstCanvas.style.width = window.innerWidth + 'px';
    burstCanvas.style.height = window.innerHeight + 'px';
    bctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const scheme = SCHEMES[Math.floor(Math.random() * SCHEMES.length)];
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const list = [];
    const count = n || 110;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * 6.283;
      const v = 0.6 + Math.random() * 4.6;
      list.push({
        x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 0.6,
        life: 1, s: 0.7 + Math.random() * 1.9,
        rot: Math.random() * 6.28,
        c: scheme[i % scheme.length]
      });
    }
    (function frame() {
      bctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      let alive = false;
      list.forEach(function (p) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.035; p.vx *= 0.985;
        p.life -= 0.012;
        if (p.life > 0) {
          alive = true;
          bctx.globalAlpha = Math.max(0, p.life);
          bctx.fillStyle = p.c;
          bctx.strokeStyle = p.c;
          drawParticle(bctx, shape, p.x, p.y, p.s, p.rot);
        }
      });
      if (alive) requestAnimationFrame(frame);
      else bctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    })();
  }

  window.Particles = { intro: intro, burst: burst, names: NAMES, shapes: SHAPES, schemes: SCHEMES };
})();
