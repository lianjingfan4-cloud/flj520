/* ============================================================
   scene.js — 给每页铺一张"会跟着色系变"的画
   ------------------------------------------------------------
   每个色系配一张真实风景照（灰度），由当前色系的 a1/a2/a3 重新上色。
   前面再压一道山脊剪影：背景跟滚动、前景跟鼠标，速度不同 → 景深。
   ============================================================ */
(function () {
  'use strict';

  /* 每个颜色一张图（js/scenes.js）；没登记的颜色退回色系图 */
  const BY_FAMILY = {
    vivid:    'assets/scene/canyon.jpg',
    morandi:  'assets/scene/ridge.jpg',
    pastel:   'assets/scene/falls.jpg',
    oriental: 'assets/scene/snow.jpg',
    nocturne: 'assets/scene/fjord.jpg'
  };

  const RIDGE =
    '<svg viewBox="0 0 1440 300" preserveAspectRatio="none" aria-hidden="true">' +
      '<path d="M0,232 L120,150 L214,206 L330,108 L432,192 L524,148 L640,228 L762,168 L878,238 L992,178 L1110,248 L1232,188 L1332,238 L1440,198 L1440,300 L0,300 Z" fill="var(--fg)" opacity=".16"/>' +
      '<path d="M0,286 L162,218 L282,266 L402,198 L522,268 L662,218 L802,288 L942,238 L1082,298 L1222,248 L1362,294 L1440,268 L1440,300 L0,300 Z" fill="var(--fg)" opacity=".3"/>' +
    '</svg>';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let scenes = [];
  let raf = 0;

  function family() {
    return document.documentElement.dataset.family || 'nocturne';
  }

  const picked = {};

  function paint(force) {
    const fam = BY_FAMILY[family()] ? family() : 'nocturne';
    const pid = document.documentElement.dataset.palette || '';
    const list = (window.SCENES && window.SCENES[pid]) || null;
    const keep = document.documentElement.classList.contains('bg-static');

    let src;
    if (list && list.length) {
      if (keep) {
        src = list[0];
      } else {
        if (force || !picked[pid]) picked[pid] = list[Math.floor(Math.random() * list.length)];
        src = picked[pid];
      }
    } else {
      src = BY_FAMILY[fam];
    }

    scenes.forEach(function (el) {
      const img = el.querySelector('.scene-photo img');
      if (img) {
        if (img.getAttribute('src') !== src) img.setAttribute('src', src);
        img.style.objectPosition = '50% 50%';
      }
      const ridge = el.querySelector('.scene-ridge');
      if (ridge && !ridge.firstElementChild) ridge.innerHTML = RIDGE;
      el.dataset.sceneFamily = fam;
    });
    window.dispatchEvent(new CustomEvent('scenechange', { detail: src }));
  }

  function shuffle() {
    const pid = document.documentElement.dataset.palette || '';
    delete picked[pid];
    paint(true);
  }

  /* 滚动：背景层慢慢上移 */
  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = 0;
      const vh = window.innerHeight;
      scenes.forEach(function (el) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -240 || r.top > vh + 240) return;
        const p = Math.max(-150, Math.min(150, -r.top * 0.2));
        el.style.setProperty('--par', p.toFixed(1));
      });
    });
  }

  /* 鼠标：前景层反向小幅偏移 */
  function onMove(e) {
    const mx = ((e.clientX / window.innerWidth) - 0.5) * 30;
    scenes.forEach(function (el) { el.style.setProperty('--mx', mx.toFixed(1)); });
  }

  function init() {
    scenes = Array.prototype.slice.call(document.querySelectorAll('[data-scene]'));
    if (!scenes.length) return;
    paint();
    window.addEventListener('lookchange', function () { paint(false); });
    window.addEventListener('settingschange', function () { paint(false); });
    if (reduce) return;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('pointermove', onMove, { passive: true });
    onScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.SceneKit = { repaint: paint, shuffle: shuffle };
})();
