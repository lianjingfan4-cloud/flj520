/* ============================================================
   arcade.js — 小游戏共用底座：露水、最高分、证书
   ------------------------------------------------------------
   露水（dew）是小游戏之间的通用货币，存在本地。
   证书是把 canvas 画出来，可以右键/按钮保存成图片。
   ============================================================ */
(function () {
  'use strict';

  const DEW = 'nova-dew';
  const BEST = 'nova-best';

  function num(k, d) {
    try { return parseInt(localStorage.getItem(k) || '', 10) || d; } catch (e) { return d; }
  }
  function save(k, v) {
    try { localStorage.setItem(k, String(v)); } catch (e) { }
  }

  function coins() { return num(DEW, 0); }
  function add(n) {
    const v = Math.max(0, coins() + (n | 0));
    save(DEW, v);
    window.dispatchEvent(new CustomEvent('dewchange', { detail: v }));
    return v;
  }
  function spend(n) {
    if (coins() < n) return false;
    add(-n);
    return true;
  }

  function best(key) { return num(BEST + '-' + key, 0); }
  function setBest(key, v) {
    if (v > best(key)) { save(BEST + '-' + key, v); return true; }
    return false;
  }

  function palette() {
    const cs = getComputedStyle(document.documentElement);
    const g = function (n) { return cs.getPropertyValue(n).trim(); };
    return {
      bg: g('--bg') || '#0b0b12',
      fg: g('--fg') || '#eef2ff',
      a1: g('--a1') || '#6ff3ff',
      a2: g('--a2') || '#a98bff',
      a3: g('--a3') || '#ff5fc8',
      dim: g('--fg-dim') || '#9aa4bb'
    };
  }

  /* ---------------- 证书 ---------------- */
  function certificate(opts) {
    opts = opts || {};
    const W = 1000, H = 700;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const x = c.getContext('2d');
    const p = palette();

    x.fillStyle = p.bg;
    x.fillRect(0, 0, W, H);

    // 边框
    x.strokeStyle = p.a1;
    x.lineWidth = 2;
    x.strokeRect(28, 28, W - 56, H - 56);
    x.strokeStyle = p.a3;
    x.lineWidth = 1;
    x.strokeRect(40, 40, W - 80, H - 80);

    // 顶部小字
    x.fillStyle = p.dim;
    x.font = '600 16px "JetBrains Mono", monospace';
    x.textAlign = 'center';
    x.fillText('FAN LIANJING · 拾趣', W / 2, 92);

    // 标题
    x.fillStyle = p.fg;
    x.font = '700 54px "Noto Serif SC", "Songti SC", serif';
    x.fillText(opts.title || '完成证明', W / 2, 190);

    // 名字
    x.fillStyle = p.a1;
    x.font = '700 40px "Songti SC", "Noto Serif SC", serif';
    x.fillText(opts.name || '范连璟', W / 2, 270);

    // 明细
    x.fillStyle = p.dim;
    x.font = '400 20px "Noto Serif SC", serif';
    const lines = opts.lines || [];
    lines.forEach(function (t, i) {
      x.fillText(t, W / 2, 340 + i * 42);
    });

    // 日期
    const d = new Date();
    x.fillStyle = p.fg;
    x.font = '400 18px "Noto Serif SC", serif';
    x.fillText(d.getFullYear() + ' 年 ' + (d.getMonth() + 1) + ' 月 ' + d.getDate() + ' 日', W / 2, H - 110);

    x.fillStyle = p.a3;
    x.font = '700 22px "Ma Shan Zheng", "STKaiti", serif';
    x.fillText('璟', W / 2, H - 66);

    const url = c.toDataURL('image/png');

    let box = document.getElementById('certBox');
    if (!box) {
      box = document.createElement('div');
      box.id = 'certBox';
      box.className = 'cert-box';
      document.body.appendChild(box);
      box.addEventListener('click', function (e) { if (e.target === box) box.classList.remove('on'); });
    }
    box.innerHTML = '<div class="cert-in">' +
      '<img alt="证书" src="' + url + '" />' +
      '<div class="cert-acts">' +
      '<a class="g-btn" download="fanlianjing-cert.png" href="' + url + '">保存图片</a>' +
      '<button class="g-btn" type="button" onclick="document.getElementById(\'certBox\').classList.remove(\'on\')">关闭</button>' +
      '</div></div>';
    box.classList.add('on');
    return url;
  }

  window.Arcade = {
    coins: coins, add: add, spend: spend,
    best: best, setBest: setBest,
    certificate: certificate,
    palette: palette
  };
})();
