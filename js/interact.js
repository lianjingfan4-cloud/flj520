/* ============================================================
   interact.js — 41–50 的交互
   ------------------------------------------------------------
   41 名词悬停弹一张小图
   42 年份可点，点开是那一年的一张照片
   45 复制邮箱，信封飘上去
   46 页面底部：你在这里待了多久
   49 摇一摇，换一个配色
   50 跟随系统的深浅，但允许手动锁死
   ============================================================ */
(function () {
  'use strict';

  const $ = function (s, r) { return (r || document).querySelector(s); };

  /* ---------------- 41. 名词 → 小图 ---------------- */
  const TERMS = {
    '山': 'assets/scene/snow.jpg',
    '极光': 'assets/scene/fjord.jpg',
    '苏联': 'assets/scene/canyon.jpg',
    '莫斯科': 'assets/scene/fjord.jpg',
    '雪': 'assets/scene/snow.jpg',
    '星星': 'assets/scene/p/1015.jpg',
    '星空': 'assets/scene/p/1015.jpg',
    '海': 'assets/scene/falls.jpg',
    '走廊': 'assets/scene/ridge.jpg',
    '高密': 'assets/photos/p001.jpg',
    '上海': 'assets/photos/p010.jpg',
    '书': 'assets/photos/p020.jpg'
  };

  let bubble = null;

  function makeBubble() {
    if (bubble) return bubble;
    bubble = document.createElement('div');
    bubble.className = 'term-bubble';
    bubble.innerHTML = '<img alt="" /><span></span>';
    document.body.appendChild(bubble);
    return bubble;
  }

  function showTerm(el, e) {
    const word = el.dataset.term;
    const src = TERMS[word];
    if (!src) return;
    const b = makeBubble();
    b.querySelector('img').src = src;
    b.querySelector('span').textContent = word;
    b.classList.add('on');
    moveBubble(e);
  }
  function moveBubble(e) {
    if (!bubble) return;
    const pad = 18;
    let x = e.clientX + pad;
    let y = e.clientY + pad;
    const w = 190, h = 150;
    if (x + w > window.innerWidth - 12) x = e.clientX - w - pad;
    if (y + h > window.innerHeight - 12) y = e.clientY - h - pad;
    bubble.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
  }
  function hideTerm() { if (bubble) bubble.classList.remove('on'); }

  function wrapTerms() {
    const hosts = document.querySelectorAll('.hero-sub, .section-note, .r-story, .q-note, .contact-note, .atlas-sub, .ab-body p');
    const words = Object.keys(TERMS);
    Array.prototype.forEach.call(hosts, function (host) {
      if (host.dataset.termed) return;
      host.dataset.termed = '1';
      const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT, null);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(function (node) {
        const text = node.nodeValue;
        let out = '', i = 0, hit = false;
        while (i < text.length) {
          let found = null;
          for (let k = 0; k < words.length; k++) {
            if (text.startsWith(words[k], i)) { found = words[k]; break; }
          }
          if (found) {
            out += '<span class="term" data-term="' + found + '">' + found + '</span>';
            i += found.length;
            hit = true;
          } else {
            out += text[i];
            i++;
          }
        }
        if (!hit) return;
        const span = document.createElement('span');
        span.innerHTML = out;
        node.parentNode.replaceChild(span, node);
      });
    });

    document.addEventListener('mouseover', function (e) {
      const t = e.target.closest && e.target.closest('.term');
      if (t) showTerm(t, e); else hideTerm();
    });
    document.addEventListener('mousemove', function (e) {
      if (bubble && bubble.classList.contains('on')) moveBubble(e);
    });
  }

  /* ---------------- 42. 年份 → 那一年的照片 ---------------- */
  function initYears() {
    const photos = window.PHOTOS || [];
    if (!photos.length) return;
    document.addEventListener('click', function (e) {
      const y = e.target.closest && e.target.closest('.yr');
      if (!y) return;
      const year = parseInt(y.textContent, 10);
      if (!year) return;
      // 用年份做个稳定的下标，每年固定同一张
      const idx = (year * 37) % photos.length;
      openPhoto(photos[idx].src, year + ' 年');
    });
  }

  function openPhoto(src, cap) {
    let box = $('#photoBox');
    if (!box) {
      box = document.createElement('div');
      box.id = 'photoBox';
      box.className = 'photo-box-pop';
      box.innerHTML = '<img alt="" /><span></span><button type="button" aria-label="关闭">✕</button>';
      document.body.appendChild(box);
      box.addEventListener('click', function (e) { if (e.target === box) box.classList.remove('on'); });
      box.querySelector('button').addEventListener('click', function () { box.classList.remove('on'); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') box.classList.remove('on'); });
    }
    box.querySelector('img').src = src;
    box.querySelector('span').textContent = cap || '';
    box.classList.add('on');
  }

  /* ---------------- 微信二维码：点开看 ---------------- */
  function initQR() {
    document.addEventListener('click', function (e) {
      const q = e.target.closest && e.target.closest('[data-qr]');
      if (!q) return;
      e.preventDefault();
      openPhoto(q.dataset.qr, '微信 · 扫码加我');
    });
  }

  /* ---------------- 45. 复制邮箱 → 信封 ---------------- */
  function initEnvelope() {
    document.addEventListener('click', function (e) {
      const t = e.target.closest && e.target.closest('[data-copy], .copy-mail, [href^="mailto:"]');
      if (!t) return;
      const f = document.createElement('div');
      f.className = 'envelope';
      f.innerHTML = '<svg viewBox="0 0 48 32" fill="none"><rect x="1" y="1" width="46" height="30" rx="3" stroke="currentColor" stroke-width="1.6"/><path d="M2 3l22 16L46 3" stroke="currentColor" stroke-width="1.6"/></svg>';
      const r = t.getBoundingClientRect();
      f.style.left = (r.left + r.width / 2) + 'px';
      f.style.top = r.top + 'px';
      document.body.appendChild(f);
      setTimeout(function () { f.remove(); }, 1600);
    });
  }

  /* ---------------- 46. 停留计时 ---------------- */
  function initDwell() {
    const foot = document.querySelector('.footer .f-c') || document.querySelector('.footer');
    if (!foot || document.getElementById('dwell')) return;
    const el = document.createElement('span');
    el.id = 'dwell';
    el.className = 'dwell';
    foot.appendChild(el);
    const t0 = Date.now();
    const paint = function () {
      const s = Math.floor((Date.now() - t0) / 1000);
      const m = Math.floor(s / 60);
      el.textContent = ' · 你在这里待了 ' + (m ? m + ' 分 ' : '') + (s % 60) + ' 秒';
    };
    paint();
    setInterval(paint, 1000);
  }

  /* ---------------- 49. 摇一摇换色 ---------------- */
  function initShake() {
    if (!window.DeviceMotionEvent || !window.LookKit) return;
    let lastX = null, lastY = null, lastZ = null, lastT = 0;
    window.addEventListener('devicemotion', function (e) {
      const a = e.accelerationIncludingGravity;
      if (!a) return;
      const now = Date.now();
      if (now - lastT < 220) return;
      lastT = now;
      if (lastX !== null) {
        const d = Math.abs(a.x - lastX) + Math.abs(a.y - lastY) + Math.abs(a.z - lastZ);
        if (d > 34) {
          window.LookKit.cyclePalette(1);
          if (window.toast) window.toast('摇一摇，换了一种光');
        }
      }
      lastX = a.x; lastY = a.y; lastZ = a.z;
    });
  }

  /* ---------------- 50. 跟随系统 ---------------- */
  function initAutoTheme() {
    if (!window.LookKit) return;
    let locked = false, auto = true;
    try {
      locked = localStorage.getItem('nova-lock-theme') === '1';
      auto = localStorage.getItem('nova-auto-theme') === 'on';
    } catch (e) { }

    const isDark = function () {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    function apply() {
      if (locked || !auto) return;
      const want = isDark() ? 'midnight' : 'xuan';
      try { window.LookKit.setPalette(want, false); } catch (e) { }
    }

    // 用户手动点过颜色，就不再自动
    window.addEventListener('lookchange', function (e) {
      if (!e.detail || !e.detail.manual) return;
      auto = false;
      try { localStorage.setItem('nova-auto-theme', 'off'); } catch (err) { }
    });

    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      if (mq.addEventListener) mq.addEventListener('change', apply);
    }

    window.followSystem = function (on) {
      auto = on !== false;
      locked = !auto;
      try {
        localStorage.setItem('nova-auto-theme', auto ? 'on' : 'off');
        localStorage.setItem('nova-lock-theme', locked ? '1' : '0');
      } catch (e) { }
      if (auto) apply();
      return auto ? '已跟随系统' : '已锁死当前外观';
    };

    if (auto) apply();
  }


  /* ---------------- 44. 分享卡 ---------------- */
  function shareCard() {
    const W = 900, H = 1260;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const x = c.getContext('2d');
    const cs = getComputedStyle(document.documentElement);
    const g = function (n, d) { return (cs.getPropertyValue(n) || d).trim(); };
    const bg = g('--bg', '#0a0a12'), fg = g('--fg', '#eef2ff');
    const a1 = g('--a1', '#6ff3ff'), a3 = g('--a3', '#ff5fc8');

    const grd = x.createLinearGradient(0, 0, W, H);
    grd.addColorStop(0, bg);
    grd.addColorStop(1, a1);
    x.fillStyle = bg; x.fillRect(0, 0, W, H);
    x.globalAlpha = .18; x.fillStyle = grd; x.fillRect(0, 0, W, H); x.globalAlpha = 1;

    // 星
    x.fillStyle = fg;
    for (let i = 0; i < 160; i++) {
      x.globalAlpha = ((i * 53) % 80) / 100 + .1;
      x.fillRect((i * 137.7) % W, (i * 89.3) % H, 1.6, 1.6);
    }
    x.globalAlpha = 1;

    x.textAlign = 'center';
    x.fillStyle = fg;
    x.font = '600 92px "Songti SC","Noto Serif SC",serif';
    x.fillText('范连璟', W / 2, 300);

    x.fillStyle = a1;
    x.font = '500 22px "JetBrains Mono", monospace';
    x.fillText('FAN LIANJING  ·  VALENTINE', W / 2, 352);

    x.fillStyle = fg;
    x.globalAlpha = .82;
    x.font = '400 30px "Noto Serif SC", serif';
    x.fillText('往事越千年，魏武挥鞭，', W / 2, 520);
    x.fillText('萧瑟秋风今又是，换了人间。', W / 2, 572);
    x.globalAlpha = 1;

    x.fillStyle = a3;
    x.font = '400 20px "JetBrains Mono", monospace';
    x.fillText('上海交大 · 飞行器设计', W / 2, 660);

    // 装饰码
    x.strokeStyle = a1; x.globalAlpha = .35; x.lineWidth = 1;
    for (let i = 0; i < 26; i++) {
      const h = 30 + ((i * 37) % 90);
      x.beginPath();
      x.moveTo(W / 2 - 130 + i * 10, H - 300);
      x.lineTo(W / 2 - 130 + i * 10, H - 300 + h);
      x.stroke();
    }
    x.globalAlpha = 1;

    x.fillStyle = fg; x.globalAlpha = .5;
    x.font = '400 16px "JetBrains Mono", monospace';
    x.fillText('THE WORLD HAS CHANGED', W / 2, H - 180);
    x.fillText('fanlianjing', W / 2, H - 148);
    x.globalAlpha = 1;

    let box = document.getElementById('shareBox');
    if (!box) {
      box = document.createElement('div');
      box.id = 'shareBox';
      box.className = 'seal-box';
      document.body.appendChild(box);
      box.addEventListener('click', function (e) { if (e.target === box) box.classList.remove('on'); });
    }
    const url = c.toDataURL('image/png');
    box.innerHTML = '<div class="sb-in"><img src="' + url + '" alt="分享卡" style="width:min(300px,70vw);height:auto" />' +
      '<p>存下来，发给别人。</p>' +
      '<a class="g-btn" download="fanlianjing-card.png" href="' + url + '">保存这张卡</a>' +
      '<button class="g-btn" type="button" onclick="document.getElementById(\'shareBox\').classList.remove(\'on\')">收起来</button></div>';
    box.classList.add('on');
  }

  function addFooterLinks() {
    const f = document.querySelector('.footer .f-c') || document.querySelector('.footer');
    if (!f || document.getElementById('shareBtn')) return;
    const a = document.createElement('a');
    a.href = 'resume.html';
    a.textContent = '简历';
    a.className = 'f-link';
    const b = document.createElement('button');
    b.id = 'shareBtn';
    b.type = 'button';
    b.className = 'f-link';
    b.textContent = '分享卡';
    b.addEventListener('click', shareCard);
    f.appendChild(a);
    f.appendChild(b);
  }
  /* ---------------- 肖像：三张轮换 ---------------- */
  function initPortrait() {
    const img = document.querySelector('[data-cycle]');
    if (!img) return;
    const list = img.dataset.cycle.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    if (list.length < 2) return;
    list.forEach(function (src) { const im = new Image(); im.src = src; });
    let i = 0;
    setInterval(function () {
      i = (i + 1) % list.length;
      img.style.opacity = '0';
      setTimeout(function () { img.src = list[i]; img.style.opacity = '1'; }, 280);
    }, 6500);
  }

  /* ---------------- 启动 ---------------- */
  function boot() {
    try { wrapTerms(); } catch (e) { }
    initYears();
    initEnvelope();
    initQR();
    initDwell();
    initShake();
    initAutoTheme();
    addFooterLinks();
    initPortrait();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  window.Interact = { openPhoto: openPhoto, followSystem: function (v) { return window.followSystem && window.followSystem(v); } };
})();
