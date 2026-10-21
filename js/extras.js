/* ============================================================
   extras.js — 几个只在特定页面生效的彩蛋
   ------------------------------------------------------------
   房间：深夜窗上下雪 / 手机倒过来变天花板视角 / 窗外那趟车
   信：  点印章，盖一枚新的，可以下载
   ============================================================ */
(function () {
  'use strict';

  const page = (location.pathname.split('/').pop() || '').toLowerCase();
  const bump = function (k) { if (window.EggKit) window.EggKit.bump(k); };

  /* ---------------- 房间 ---------------- */
  if (page === 'room.html' || page === '') {
    const night = (function () { const h = new Date().getHours(); return h >= 22 || h < 6; })();

    /* 1. 深夜下雪 */
    if (night) {
      const cv = document.createElement('canvas');
      cv.className = 'room-snow';
      cv.setAttribute('aria-hidden', 'true');
      document.body.appendChild(cv);
      const ctx = cv.getContext('2d');
      let W = 0, H = 0, flakes = [];
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      function fit() {
        W = window.innerWidth; H = window.innerHeight;
        cv.width = W * dpr; cv.height = H * dpr;
        cv.style.width = W + 'px'; cv.style.height = H + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        flakes = [];
        const n = Math.round(W / 14);
        for (let i = 0; i < n; i++) {
          flakes.push({
            x: Math.random() * W, y: Math.random() * H,
            r: 0.8 + Math.random() * 2.2,
            vy: 0.3 + Math.random() * 0.9,
            vx: (Math.random() - .5) * 0.4,
            a: 0.25 + Math.random() * 0.5
          });
        }
      }

      function frame() {
        ctx.clearRect(0, 0, W, H);
        flakes.forEach(function (f) {
          f.y += f.vy; f.x += f.vx;
          if (f.y > H + 4) { f.y = -6; f.x = Math.random() * W; }
          if (f.x < -6) f.x = W + 6;
          if (f.x > W + 6) f.x = -6;
          ctx.globalAlpha = f.a;
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.r, 0, 6.283);
          ctx.fill();
        });
        requestAnimationFrame(frame);
      }

      fit();
      window.addEventListener('resize', fit);
      requestAnimationFrame(frame);
      bump('snow');
    }

    /* 2. 手机倒过来 → 天花板视角 */
    let flipped = false;
    function onOrient(e) {
      const b = e.beta || 0;
      const upside = Math.abs(b) > 135;
      if (upside && !flipped) {
        flipped = true;
        document.body.classList.add('ceiling');
        bump('flip');
      } else if (!upside && flipped) {
        flipped = false;
        document.body.classList.remove('ceiling');
      }
    }
    if (window.DeviceOrientationEvent) window.addEventListener('deviceorientation', onOrient);

    /* 3. 窗外那趟车 */
    if (!document.querySelector('.to-train')) {
      const a = document.createElement('a');
      a.className = 'to-train';
      a.href = 'train.html';
      a.textContent = '窗 外 的 车';
      document.body.appendChild(a);

      const c = document.createElement('a');
      c.className = 'to-codex';
      c.href = 'codex.html';
      c.textContent = '密 码 本';
      document.body.appendChild(c);
    }
  }

  /* ---------------- 信 ---------------- */
  if (page === 'letter.html') {
    const seal = document.querySelector('.l-seal');
    if (seal) {
      seal.style.cursor = 'pointer';
      seal.title = '点一下，盖一枚新的';
      seal.addEventListener('click', function () {
        const glyphs = ['璟', '雪', '山', '归', '夜', '灯'];
        const g = glyphs[Math.floor(Math.random() * glyphs.length)];
        seal.textContent = g;
        seal.classList.remove('stamped');
        void seal.offsetWidth;
        seal.classList.add('stamped');
        bump('stamp');

        // 画一枚可以下载的印章
        const c = document.createElement('canvas');
        c.width = 240; c.height = 240;
        const x = c.getContext('2d');
        x.clearRect(0, 0, 240, 240);
        x.strokeStyle = '#c0392b';
        x.lineWidth = 6;
        x.strokeRect(14, 14, 212, 212);
        x.fillStyle = '#c0392b';
        x.font = '700 120px "KaiTi","STKaiti","Songti SC",serif';
        x.textAlign = 'center';
        x.textBaseline = 'middle';
        x.fillText(g, 120, 124);

        let box = document.getElementById('sealBox');
        if (!box) {
          box = document.createElement('div');
          box.id = 'sealBox';
          box.className = 'seal-box';
          document.body.appendChild(box);
          box.addEventListener('click', function (e) { if (e.target === box) box.classList.remove('on'); });
        }
        const url = c.toDataURL('image/png');
        box.innerHTML = '<div class="sb-in"><img src="' + url + '" alt="印章" />' +
          '<p>盖好了。' + g + '</p>' +
          '<a class="g-btn" download="seal-' + g + '.png" href="' + url + '">保存这张印章</a>' +
          '<button class="g-btn ghost" type="button" onclick="document.getElementById(\'sealBox\').classList.remove(\'on\')">收起来</button></div>';
        box.classList.add('on');
      });
    }
  }
})();
