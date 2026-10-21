/* ============================================================
   narrative.js — A1 / A2 / B7 / C16 / C19
   ------------------------------------------------------------
   A1 「现在的我」小卡（时间 / 天气 / 在听什么）
   A2 滚动 = 海拔，背景跟着变暗
   B7 等高线背景（跟着色系走）
   C16 停手 3 秒 → 只剩星星
   C19 键盘：moscow 下雪，gaomi 变麦田
   ============================================================ */
(function () {
  'use strict';

  const $ = function (s, r) { return (r || document).querySelector(s); };

  /* ---------------- A1 现在的我 ---------------- */
  function nowCard() {
    if ($('.now-card')) return;
    const el = document.createElement('aside');
    el.className = 'now-card';
    el.innerHTML =
      '<button type="button" class="nc-toggle" aria-label="关掉">✕</button>' +
      '<p class="nc-k">现在的我</p>' +
      '<div class="nc-rows">' +
      '<div><span>上海</span><b id="ncSH">--:--</b></div>' +
      '<div><span>莫斯科</span><b id="ncMS">--:--</b></div>' +
      '<div><span>天气</span><b id="ncWX">—</b></div>' +
      '<div><span>在听</span><b id="ncNow">还没开</b></div>' +
      '</div>' +
      '<p class="nc-note" id="ncNote">停在这个页面的时候，时间是走着的。</p>';
    document.body.appendChild(el);

    const t = el.querySelector('.nc-toggle');
    t.addEventListener('click', function () {
      if (window.SettingsKit) window.SettingsKit.set('nowCard', false);
      else document.documentElement.classList.add('off-nowcard');
    });

    const WX = [['晴', '☀'], ['阴', '☁'], ['雨', '☂'], ['雪', '❄']];
    const d = new Date();
    const wx = WX[(d.getFullYear() * 1000 + (d.getMonth() + 1) * 40 + d.getDate()) % 4];

    function two(n) { return (n < 10 ? '0' : '') + n; }

    function tick() {
      const n = new Date();
      const sh = document.getElementById('ncSH'), ms = document.getElementById('ncMS'),
            w = document.getElementById('ncWX'), now = document.getElementById('ncNow');
      if (sh) sh.textContent = two(n.getHours()) + ':' + two(n.getMinutes());
      if (ms) {
        const m = new Date(n.getTime() - 5 * 3600 * 1000);
        ms.textContent = two(m.getHours()) + ':' + two(m.getMinutes());
      }
      if (w) w.textContent = wx[1] + ' ' + wx[0];
      if (now) {
        const mp = document.getElementById('mpNow');
        const on = document.querySelector('.music-btn.on');
        now.textContent = on && mp ? mp.textContent : '还没开';
      }
    }
    tick();
    setInterval(tick, 15000);
  }

  /* ---------------- A2 海拔 ---------------- */
  function altitude() {
    const ruler = document.createElement('div');
    ruler.className = 'alt-ruler';
    ruler.innerHTML = '<span id="altNum">0 m</span><i id="altBar"></i><em>KÁRMÁN</em>';
    document.body.appendChild(ruler);

    let raf = 0;
    function paint() {
      raf = 0;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.min(1, window.scrollY / max);
      const km = p * 100;
      const num = document.getElementById('altNum');
      const bar = document.getElementById('altBar');
      if (num) num.textContent = km < 1 ? Math.round(km * 1000) + ' m' : km.toFixed(1) + ' km';
      if (bar) bar.style.height = (p * 100) + '%';
      document.documentElement.style.setProperty('--alt', p.toFixed(3));
    }
    window.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(paint); }, { passive: true });
    window.addEventListener('resize', paint);
    paint();
  }

  /* ---------------- B7 等高线 ---------------- */
  function contours() {
    const wrap = document.createElement('div');
    wrap.className = 'contours';
    wrap.setAttribute('aria-hidden', 'true');
    let paths = '';
    for (let i = 0; i < 18; i++) {
      const y = 30 + i * 46;
      const amp = 10 + ((i * 37) % 26);
      const ph = (i * 1.7) % 6.28;
      let d = 'M -40 ' + y;
      for (let x = -40; x <= 1480; x += 40) {
        const yy = y + Math.sin((x / 210) + ph) * amp + Math.cos((x / 90) + ph * 2) * amp * 0.3;
        d += ' L ' + x + ' ' + yy.toFixed(1);
      }
      paths += '<path d="' + d + '" fill="none" stroke="currentColor" stroke-width="1"/>';
    }
    wrap.innerHTML = '<svg viewBox="0 0 1440 900" preserveAspectRatio="none">' + paths + '</svg>';
    document.body.appendChild(wrap);
  }

  /* ---------------- C16 停手 3 秒 ---------------- */
  function idleStars() {
    let timer = 0;
    let armed = false;   // 先动一下鼠标，才开始算"停手"
    function reset() {
      document.documentElement.classList.remove('only-stars');
      if (!armed) return;
      clearTimeout(timer);
      timer = setTimeout(function () {
        document.documentElement.classList.add('only-stars');
      }, 4000);
    }
    ['pointermove', 'pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(function (ev) {
      window.addEventListener(ev, function () { armed = true; reset(); }, { passive: true });
    });
  }

  /* ---------------- C19 键盘口令 ---------------- */
  function keyWords() {
    let buf = '';
    const snow = function () {
      const box = document.createElement('div');
      box.className = 'kw-snow';
      let flakes = '';
      for (let i = 0; i < 70; i++) {
        flakes += '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;animation-delay:' + (Math.random() * 2).toFixed(2) + 's;animation-duration:' + (2.6 + Math.random() * 2.4).toFixed(2) + 's;font-size:' + (8 + Math.random() * 10).toFixed(0) + 'px">❄</i>';
      }
      box.innerHTML = flakes;
      document.body.appendChild(box);
      setTimeout(function () { box.remove(); }, 7000);
    };
    const wheat = function () {
      const box = document.createElement('div');
      box.className = 'kw-wheat';
      box.innerHTML = '<div class="ww-sky"></div><div class="ww-field"></div><p>高密 · 一望无际的平地</p>';
      document.body.appendChild(box);
      setTimeout(function () { box.remove(); }, 6500);
    };
    document.addEventListener('keydown', function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.length !== 1) return;
      buf = (buf + e.key.toLowerCase()).slice(-10);
      if (buf.indexOf('moscow') >= 0) { buf = ''; snow(); }
      if (buf.indexOf('gaomi') >= 0) { buf = ''; wheat(); }
    });
  }

  function boot() {
    try { nowCard(); } catch (e) { }
    if (!document.documentElement.classList.contains('off-altruler')) { try { altitude(); } catch (e) { } }
    if (!document.documentElement.classList.contains('off-contours')) { try { contours(); } catch (e) { } }
    try { idleStars(); } catch (e) { }
    try { keyWords(); } catch (e) { }
    try { autoPalette(); } catch (e) { }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
