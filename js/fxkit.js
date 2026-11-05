/* ============================================================
   fxkit.js — 原生版 React Bits 效果层
   ------------------------------------------------------------
   参考 https://reactbits.dev 的效果清单，用零依赖的
   JS + CSS 重写，按页面分配不同组合：

     SplitText / BlurText   标题逐字逐词入场
     ShinyText              文字上扫过一道光
     GradientText           渐变字（颜色缓慢游动）
     DecryptedText          乱码解密成正文
     CountUp                数字滚动
     SpotlightCard          鼠标位置的高光
     TiltedCard             3D 倾斜
     GlareHover             斜向反光扫过
     StarBorder             旋转的渐变边框
     ClickSpark             点击迸出小火花
     Aurora / DotGrid       背景层

   用法：
     <h1 class="fx-split">…</h1>       自动拆字
     <span class="fx-shine">…</span>   扫光
     <div class="fx-spot">…</div>      卡片高光
     <div class="fx-tilt">…</div>      倾斜
     <div class="fx-star">…</div>      边框
     <b class="fx-count" data-to="9804">0</b>
   ============================================================ */
(function () {
  'use strict';

  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const page = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '') || 'index';

  function all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ---------------- 1. SplitText / BlurText ---------------- */
  function splitText(el, mode) {
    if (!el || el.dataset.fxSplit) return;
    el.dataset.fxSplit = '1';

    const walk = function (node, out) {
      Array.prototype.forEach.call(node.childNodes, function (n) {
        if (n.nodeType === 3) {
          const text = n.nodeValue;
          const parts = mode === 'word' ? text.split(/(\s+)/) : Array.from(text);
          parts.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { out.push(document.createTextNode(p)); return; }
            const s = document.createElement('span');
            s.className = 'fx-ch';
            s.textContent = p;
            out.push(s);
          });
        } else if (n.nodeType === 1) {
          if (n.classList && (n.classList.contains('fx-ch') || n.tagName === 'BR')) { out.push(n); return; }
          const c = document.createElement(n.tagName === 'EM' ? 'em' : 'span');
          if (n.tagName === 'EM') c.className = 'fx-em';
          walk(n, c.childNodes ? [] : []);
          const kids = [];
          walk(n, kids);
          kids.forEach(function (k) { c.appendChild(k); });
          out.push(c);
        }
      });
      return out;
    };

    const frag = document.createDocumentFragment();
    const kids = [];
    Array.prototype.forEach.call(el.childNodes, function (n) {
      if (n.nodeType === 3) {
        const parts = mode === 'word' ? n.nodeValue.split(/(\s+)/) : Array.from(n.nodeValue);
        parts.forEach(function (p) {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
          const s = document.createElement('span');
          s.className = 'fx-ch';
          s.textContent = p;
          frag.appendChild(s);
          kids.push(s);
        });
      } else if (n.nodeType === 1) {
        if (n.tagName === 'BR') { frag.appendChild(n); return; }
        const wrapper = document.createElement(n.tagName.toLowerCase());
        if (n.className) wrapper.className = n.className;
        const inner = [];
        Array.prototype.forEach.call(n.childNodes, function (c) {
          if (c.nodeType === 3) {
            const parts = mode === 'word' ? c.nodeValue.split(/(\s+)/) : Array.from(c.nodeValue);
            parts.forEach(function (p) {
              if (!p) return;
              if (/^\s+$/.test(p)) { wrapper.appendChild(document.createTextNode(p)); return; }
              const s = document.createElement('span');
              s.className = 'fx-ch';
              s.textContent = p;
              wrapper.appendChild(s);
              inner.push(s);
            });
          } else {
            wrapper.appendChild(c);
          }
        });
        frag.appendChild(wrapper);
        kids.push.apply(kids, inner);
      }
    });

    el.innerHTML = '';
    el.appendChild(frag);
    kids.forEach(function (k, i) { k.style.setProperty('--k', i); });

    el.classList.add('fx-split-ready');
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          el.classList.add('fx-in');
          io.disconnect();
        }
      });
    }, { threshold: 0.2 });
    io.observe(el);
  }

  /* ---------------- 2. DecryptedText ---------------- */
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+/<>{}[]';
  function decrypt(el) {
    if (!el || el.dataset.fxDec) return;
    el.dataset.fxDec = '1';
    const final = el.textContent;
    let raf = 0;

    function run() {
      if (reduce) return;
      let frame = 0;
      cancelAnimationFrame(raf);
      const step = function () {
        frame++;
        const revealed = Math.floor(frame / 2);
        let out = '';
        for (let i = 0; i < final.length; i++) {
          if (i < revealed || final[i] === ' ') out += final[i];
          else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        el.textContent = out;
        if (revealed < final.length) raf = requestAnimationFrame(step);
        else el.textContent = final;
      };
      raf = requestAnimationFrame(step);
    }
    el.addEventListener('mouseenter', run);
    el.addEventListener('focus', run);
  }

  /* ---------------- 3. CountUp ---------------- */
  function countUp(el) {
    if (!el || el.dataset.fxCount) return;
    el.dataset.fxCount = '1';
    const to = parseFloat(el.dataset.to || el.textContent.replace(/[^\d.]/g, '')) || 0;
    const suffix = el.dataset.suffix || '';
    const dur = 1100;
    let started = false;

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting || started) return;
        started = true;
        if (reduce) { el.textContent = to + suffix; io.disconnect(); return; }
        const t0 = performance.now();
        const tick = function (now) {
          const p = clamp((now - t0) / dur, 0, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(to * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      });
    }, { threshold: 0.4 });
    io.observe(el);
  }

  /* ---------------- 4. Spotlight / Glare / Tilt ---------------- */
  function spotlight(el) {
    if (!hover) return;
    el.classList.add('fx-spot');
    el.addEventListener('pointermove', function (e) {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
  }

  function glare(el) {
    if (!hover) return;
    el.classList.add('fx-glare');
  }

  function tilt(el) {
    if (!hover || reduce) return;
    el.classList.add('fx-tilt');
    let raf = 0;
    el.addEventListener('pointermove', function (e) {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(700px) rotateX(' + (-py * 6).toFixed(2) + 'deg) rotateY(' + (px * 6).toFixed(2) + 'deg) translateZ(0)';
      });
    });
    el.addEventListener('pointerleave', function () { el.style.transform = ''; });
  }

  /* ---------------- 5. ClickSpark ---------------- */
  function clickSpark() {
    if (reduce) return;
    document.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      const spark = document.createElement('span');
      spark.className = 'fx-spark';
      spark.style.left = e.clientX + 'px';
      spark.style.top = e.clientY + 'px';
      for (let i = 0; i < 6; i++) {
        const d = document.createElement('i');
        const a = (Math.PI * 2 / 6) * i + Math.random() * 0.4;
        d.style.setProperty('--dx', (Math.cos(a) * (14 + Math.random() * 12)).toFixed(1) + 'px');
        d.style.setProperty('--dy', (Math.sin(a) * (14 + Math.random() * 12)).toFixed(1) + 'px');
        spark.appendChild(d);
      }
      document.body.appendChild(spark);
      setTimeout(function () { spark.remove(); }, 620);
    }, { passive: true });
  }

  /* ---------------- 6. 背景层：Aurora / DotGrid ---------------- */
  function aurora() {
    if (document.querySelector('.fx-aurora')) return;
    const box = document.createElement('div');
    box.className = 'fx-aurora';
    box.setAttribute('aria-hidden', 'true');
    box.innerHTML = '<i></i><i></i><i></i>';
    document.body.insertBefore(box, document.body.firstChild);
  }

  function dotGrid() {
    if (!hover || reduce) return;
    if (document.querySelector('.fx-dotgrid')) return;
    const box = document.createElement('div');
    box.className = 'fx-dotgrid';
    box.setAttribute('aria-hidden', 'true');
    document.body.appendChild(box);

    let raf = 0;
    document.addEventListener('pointermove', function (e) {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        box.style.setProperty('--gx', e.clientX + 'px');
        box.style.setProperty('--gy', e.clientY + 'px');
      });
    }, { passive: true });
  }

  /* ---------------- 7. 自动分配 ---------------- */
  function boot() {
    /* 标题：拆字入场 */
    /* hero-title 里有名字轮换的 JS，不能被拆开 */
    all('.fx-split, .section-title, .pg-title, .tc-t').forEach(function (el, i) {
      splitText(el, i % 3 === 2 ? 'word' : 'char');
    });

    /* 扫光 / 渐变 / 解密 */
    all('.fx-shine').forEach(function (el) { el.classList.add('fx-shine-on'); });
    all('.fx-grad').forEach(function (el) { el.classList.add('fx-grad-on'); });
    all('.fx-decrypt').forEach(decrypt);
    all('.fx-count').forEach(countUp);

    /* 卡片 */
    all('.card, .wk, .bk, .idea, .record, .shelf-item, .puzzle-tile').forEach(function (el, i) {
      if (i % 3 === 0) tilt(el);
      else if (i % 3 === 1) spotlight(el);
      else glare(el);
    });

    /* 按钮：反光 */
    all('.btn-primary, .btn-ghost, .g-btn, .tc-btn, .sm-bt').forEach(glare);

    /* 边框光：按页给不同元素 */
    all('.mail-copy, .g-btn.primary, .tc-btn').forEach(function (el) { el.classList.add('fx-star'); });

    /* 数字 */
    all('.stat b, .metric b, [data-count]').forEach(countUp);

    clickSpark();

    /* 每页不同背景 */
    const bg = document.documentElement.dataset.fxbg;
    if (bg === 'aurora') aurora();
    else if (bg === 'dotgrid') dotGrid();
    else if (bg === 'both') { aurora(); dotGrid(); }

    document.documentElement.classList.add('fx-on');
    if (window.Site && window.Site.hooks) Site.hooks.emit('fx:ready', { page: page });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  /* 动态插入的内容再扫一遍 */
  if (window.MutationObserver) {
    let t = 0;
    const mo = new MutationObserver(function () {
      clearTimeout(t);
      t = setTimeout(function () {
        all('.wk, .bk, .idea').forEach(function (el) {
          if (!el.dataset.fxTouched) {
            el.dataset.fxTouched = '1';
            spotlight(el);
            glare(el);
          }
        });
      }, 260);
    });
    document.addEventListener('DOMContentLoaded', function () {
      mo.observe(document.body, { childList: true, subtree: true });
    });
  }
})();
