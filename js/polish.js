/* ============================================================
   polish.js — 交互层（在 kernel 之后加载）
   ------------------------------------------------------------
   只做"手感"，不改任何业务：
     · 顶部阅读进度
     · 回到顶部
     · 图片淡入（加载完才显）
     · 导航当前分区高亮
     · 主按钮的轻微磁性跟随
     · Esc 关掉所有浮层
     · 所有内部事件走 Site.hooks，方便以后挂新东西
   ============================================================ */
(function () {
  'use strict';

  if (!window.Site) return;
  const Site = window.Site;
  const rm = Site.reducedMotion();

  /* ---------- 1. 阅读进度 ---------- */
  (function progress() {
    const bar = document.createElement('div');
    bar.id = 'siteProgress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    let raf = 0;
    function update() {
      raf = 0;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? Math.min(1, h.scrollTop / max) : 0;
      bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      bar.classList.toggle('on', p > 0.01);
    }
    function onScroll() { if (!raf) raf = requestAnimationFrame(update); }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  })();

  /* ---------- 2. 回到顶部 ---------- */
  (function backToTop() {
    const b = document.createElement('button');
    b.id = 'siteTop';
    b.type = 'button';
    b.setAttribute('aria-label', '回到顶部');
    b.innerHTML = '↑';
    document.body.appendChild(b);

    let raf = 0;
    function update() {
      raf = 0;
      b.classList.toggle('on', window.scrollY > 900);
    }
    window.addEventListener('scroll', function () {
      if (!raf) raf = requestAnimationFrame(update);
    }, { passive: true });

    b.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: rm ? 'auto' : 'smooth' });
      Site.hooks.emit('ui:top');
    });
    update();
  })();

  /* ---------- 3. 图片淡入 ---------- */
  (function images() {
    function arm(img) {
      if (img.dataset.fadeArmed) return;
      img.dataset.fadeArmed = '1';
      img.classList.add('img-fade');
      if (img.complete && img.naturalWidth > 0) {
        img.classList.add('img-in');
        return;
      }
      img.addEventListener('load', function () { img.classList.add('img-in'); }, { once: true });
      img.addEventListener('error', function () {
        img.classList.add('img-in', 'img-failed');
      }, { once: true });
    }
    function scan(root) {
      (root.querySelectorAll ? root.querySelectorAll('img:not([data-fade-skip])') : []).forEach(arm);
    }
    scan(document);
    /* 动态插入的图片（画廊、翻牌……）也照顾到 */
    if (window.MutationObserver) {
      const mo = new MutationObserver(function (muts) {
        muts.forEach(function (m) {
          m.addedNodes.forEach(function (n) {
            if (!n || n.nodeType !== 1) return;
            if (n.tagName === 'IMG') arm(n);
            else scan(n);
          });
        });
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }
  })();

  /* ---------- 4. 导航当前分区 ---------- */
  (function activeNav() {
    const links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
    if (!links.length) return;
    const sections = Array.prototype.slice.call(document.querySelectorAll('section[id]'));
    if (!sections.length) return;

    const byHash = {};
    links.forEach(function (a) {
      const h = (a.getAttribute('href') || '').split('#')[1];
      if (h) byHash[h] = a;
    });

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        const a = byHash[en.target.id];
        if (!a) return;
        links.forEach(function (x) { x.classList.remove('is-active'); });
        a.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { io.observe(s); });
  })();

  /* ---------- 5. 主按钮的磁性跟随 ---------- */
  (function magnetic() {
    if (rm || !Site.canHover()) return;
    Array.prototype.forEach.call(document.querySelectorAll('.btn-primary, .btn-ghost'), function (b) {
      b.addEventListener('pointermove', function (e) {
        const r = b.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        b.style.transform = 'translate3d(' + (dx * 5).toFixed(2) + 'px,' + (dy * 4).toFixed(2) + 'px,0)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  })();

  /* ---------- 6. Esc 关掉浮层 ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    const closers = [
      '.settings-panel .sp-close',
      '.music-panel .mp-close',
      '.lightbox .lb-close',
      '.site-modal .sm-x',
      '[data-close]'
    ];
    let closed = false;
    closers.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (b) {
        if (b.offsetParent !== null) { b.click(); closed = true; }
      });
    });
    if (closed) Site.hooks.emit('ui:escape');
  });

  /* ---------- 7. 点击反馈 ---------- */
  document.addEventListener('pointerdown', function (e) {
    const t = e.target.closest && e.target.closest('button, .wk, .bk, .idea, .spine');
    if (!t || rm) return;
    t.classList.add('is-press');
    setTimeout(function () { t.classList.remove('is-press'); }, 180);
  }, { passive: true });

  /* ---------- 8. 键盘用户：跳过的第一站 ---------- */
  (function skipLink() {
    if (document.querySelector('.skip-link')) return;
    const a = document.createElement('a');
    a.className = 'skip-link';
    a.href = '#main, main';
    a.textContent = '跳到正文';
    a.addEventListener('click', function (e) {
      const m = document.querySelector('main');
      if (!m) return;
      e.preventDefault();
      m.setAttribute('tabindex', '-1');
      m.focus();
      m.scrollIntoView({ behavior: rm ? 'auto' : 'smooth', block: 'start' });
    });
    document.body.appendChild(a);
  })();


  /* ---------- 9. 设置面板里的「未来功能」清单 ---------- */
  (function futureList() {
    function inject(panel) {
      if (!panel || panel.querySelector('.sf-future')) return;
      const list = panel.querySelector('.sp-list');
      if (!list) return;

      const box = document.createElement('div');
      box.className = 'sf-future';
      box.innerHTML = '<p class="sf-title">还没接上的</p>';

      Object.keys(Site.features).forEach(function (id) {
        const f = Site.features[id];
        const row = document.createElement('button');
        row.type = 'button';
        row.className = 'sf-row' + (f.ready ? ' ready' : '');
        row.innerHTML = '<span>' + f.title + '</span><em>' + (f.ready ? '可用' : f.needs || '待定') + '</em>';
        row.addEventListener('click', function () { Site.run(id); });
        box.appendChild(row);
      });

      const note = document.createElement('p');
      note.className = 'sf-note';
      note.textContent = '这些接口已经在代码里登记了（js/kernel.js 的 FEATURES）。等素材或后端到位，改一行 ready: true 就通。';
      box.appendChild(note);

      list.appendChild(box);
    }

    if (window.MutationObserver) {
      const mo = new MutationObserver(function () {
        inject(document.querySelector('.settings-panel'));
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }
    inject(document.querySelector('.settings-panel'));
  })();

  Site.hooks.emit('polish:ready');
})();
