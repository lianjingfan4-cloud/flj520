/* ============================================================
   atlas.js — 画册：立体书翻页 / 网格 / 照片墙
   ------------------------------------------------------------
   书的结构（物理上说得通）：
     左页 = 当前这幅画
     右页 = 下一页的字（被"叶子"盖着）
     叶子正面 = 当前这页的字
     叶子背面 = 下一页的画
   往前翻：叶子绕书脊转 -180°，落到左边，露出下面的右页。
   往后翻：左边那层叶子转回 0°，把左页盖回去、把右页的字露出来。
   ============================================================ */
(function () {
  'use strict';

  const plates = ((window.ArtKit && window.ArtKit.plates) || []).filter(function (p) { return !p.hidden; });
  if (!plates.length) return;

  const $ = function (id) { return document.getElementById(id); };
  const book = $('book');
  const pageL = $('pageL');
  const pageR = $('pageR');
  const leafF = $('leafF');
  const leafB = $('leafB');
  const leafFFront = $('leafFFront');
  const leafFBack = $('leafFBack');
  const leafBFront = $('leafBFront');
  const leafBBack = $('leafBBack');
  const noL = $('noL');
  const noR = $('noR');
  const stageCount = $('stageCount');
  const prevBtn = $('prevBtn');
  const nextBtn = $('nextBtn');
  const grid = $('plateGrid');
  const wall = $('photoWall');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wideQuery = window.matchMedia('(min-width: 901px)');

  let current = 0;
  // 预加载九幅画，翻页时不再等图片加载
  plates.forEach(function (p) { if (p.photo) { const im = new Image(); im.src = p.photo; } });

  let busy = false;

  const FAV_KEY = 'nova-fav';
  function favs() {
    try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]') || []; } catch (e) { return []; }
  }
  function isFav(id) { return favs().indexOf(id) >= 0; }
  function toggleFav(id) {
    let list = favs();
    if (list.indexOf(id) >= 0) list = list.filter(function (x) { return x !== id; });
    else list.push(id);
    try { localStorage.setItem(FAV_KEY, JSON.stringify(list)); } catch (e) { }
    return list.indexOf(id) >= 0;
  }

  const pad = function (n) { return n < 10 ? '0' + n : '' + n; };
  const n = function () { return plates.length; };
  const idx = function (i) { return ((i % plates.length) + plates.length) % plates.length; };

  // 书页里让画"整幅装进去"（像一张裱好的印张），不要裁掉
  const fitSvg = function (p) {
    if (p.photo) {
      return '<span class="plate-shot"><img src="' + p.photo + '" alt="' + p.title + '" decoding="sync" /></span>';
    }
    return p.svg.replace('preserveAspectRatio="xMidYMid slice"', 'preserveAspectRatio="xMidYMid meet"');
  };
  const artHTML = function (p) { return '<div class="page-art">' + fitSvg(p) + '</div>'; };
  function swatches(p) {
    let out = '';
    try {
      const found = window.LookKit && window.LookKit.find ? window.LookKit.find(p.pal) : null;
      const q = found && found.palette;
      if (q) {
        out = '<div class="pt-colors">' +
          '<i>这幅配的色</i>' +
          [q.a1, q.a2, q.a3].map(function (c) {
            return '<button type="button" class="pt-sw" data-pal="' + p.pal + '" style="background:' + c + '" title="' + c + ' → 换到这套"></button>';
          }).join('') +
          '<span>' + (q.name || p.pal) + '</span></div>';
      }
    } catch (e) { }
    return out;
  }

  const textHTML = function (p, i) {
    return '<div class="page-text">' +
      '<p class="pt-k">' + p.tone + '</p>' +
      '<h2>' + p.title + '</h2>' +
      '<p class="pt-n">' + p.note + '</p>' +
      (p.whisper ? '<button type="button" class="pt-w">你可能会想的一句话<i>+</i></button>' +
        '<p class="pt-whisper">' + p.whisper + '</p>' : '') +
      '<button type="button" class="pt-fav" data-fav="' + p.id + '">' +
        (isFav(p.id) ? '♥ 已收藏' : '♡ 收藏') + '</button>' +
      swatches(p) +
      '<p class="pt-m">PLATE ' + pad(i + 1) + ' / ' + pad(n()) + '</p>' +
      '</div>';
  };

  function set(el, html) { if (el) el.innerHTML = html; }

  /* 同一个 <img> 只换 src：浏览器用已解码的那张，翻页不再等 (解码) */
  function setArt(el, p) {
    if (!el) return;
    let shot = el.querySelector('.page-art .plate-shot');
    if (!p.photo) {
      el.innerHTML = artHTML(p);
      return;
    }
    if (!shot) {
      el.innerHTML = '<div class="page-art"><span class="plate-shot"><img alt="" /></span></div>';
      shot = el.querySelector('.plate-shot');
    }
    const img = shot.querySelector('img');
    const src = p.photo;
    if (img.getAttribute('src') !== src) img.setAttribute('src', src);
    img.alt = p.title;
  }

  /* 瞬间把叶子放回原位：关掉过渡 → 改 transform → 强制重排 → 恢复过渡 */
  function resetLeaf(el) {
    if (!el) return;
    el.style.transition = 'none';
    el.style.transform = '';
    void el.offsetWidth;
    el.style.transition = '';
  }

  function paintMeta() {
    if (stageCount) stageCount.textContent = pad(current + 1) + ' / ' + pad(n());
    if (grid) {
      Array.prototype.forEach.call(grid.children, function (el, i) {
        el.classList.toggle('on', i === current);
      });
    }
  }

  /* 把整本书摆到 state 这一页（noAnim=true 时不做过渡） */
  function sync(state, noAnim) {
    if (!book) return;

    if (wideQuery.matches) {
      // 桌面：左页画 / 右页（被叶子盖着）下一页的字 / 叶子前后两面
      setArt(pageL, plates[state]);
      set(pageR, textHTML(plates[idx(state + 1)], idx(state + 1)));
      set(leafFFront, textHTML(plates[state], state));
      setArt(leafFBack, plates[idx(state + 1)]);
      set(leafBFront, textHTML(plates[idx(state - 1)], idx(state - 1)));
      setArt(leafBBack, plates[state]);
      resetLeaf(leafF);
      resetLeaf(leafB);
      if (noR) noR.textContent = pad(idx(state + 1) + 1);
    } else {
      // 手机：上画下字，同一页
      setArt(pageL, plates[state]);
      set(pageR, textHTML(plates[state], state));
      if (noR) noR.textContent = pad(state + 1);
    }

    if (noL) noL.textContent = pad(state + 1);
    paintMeta();
  }

  /* ---------------- 翻页 ---------------- */
  function fadeTo(state) {
    current = state;
    sync(state, true);
    if (reduceMotion || !pageL.animate) return;
    const frames = [{ opacity: .2, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }];
    pageL.animate(frames, { duration: 340, easing: 'cubic-bezier(.16,1,.3,1)' });
    if (pageR) pageR.animate(frames, { duration: 340, easing: 'cubic-bezier(.16,1,.3,1)' });
  }

  let flips = 0, glitched = false;

  function showGlitch() {
    let box = document.getElementById('glitchBox');
    if (!box) {
      box = document.createElement('div');
      box.id = 'glitchBox';
      box.className = 'glitch-box';
      box.innerHTML = '<div class="gl-in"><pre>PLATE 10 / 09</pre>' +
        '<div class="gl-canvas"></div>' +
        '<h3>这张画不存在</h3>' +
        '<p>你翻了九页。第十页是空的 —— 但书还想再给你一页。</p>' +
        '<button type="button" class="g-btn" id="glClose">合上</button></div>';
      document.body.appendChild(box);
      box.querySelector('#glClose').addEventListener('click', function () { box.classList.remove('on'); });
      box.addEventListener('click', function (e) { if (e.target === box) box.classList.remove('on'); });
    }
    box.classList.add('on');
    setTimeout(function () { box.classList.remove('on'); }, 6000);
  }

  function next() {
    if (busy) return;
    const target = idx(current + 1);
    fadeTo(target);
    return;
  }
  function nextOld() {
    const target = idx(current + 1);
    if (!wideQuery.matches) { fadeTo(target); return; }
    flips++;
    if (flips >= 9 && !glitched) { glitched = true; showGlitch(); return; }
    busy = true;
    // 先把底下那页换成目标页 —— 此刻它被叶子盖着，看不见
    setArt(pageL, plates[target]);
    set(pageR, textHTML(plates[idx(target + 1)], idx(target + 1)));
    if (noL) noL.textContent = pad(target + 1);
    if (leafF) leafF.style.transform = 'rotateY(-180deg)';
    setTimeout(function () {
      current = target;
      sync(current, true);
      busy = false;
    }, reduceMotion ? 20 : 1000);
  }

  function prev() {
    if (busy) return;
    fadeTo(idx(current - 1));
    return;
  }
  function prevOld() {
    if (false) { return; }
    busy = true;
    // 叶子左面下方先换成上一页的画（被盖着，看不见）
    setArt(pageL, plates[idx(current - 1)]);
    if (noL) noL.textContent = pad(idx(current - 1) + 1);
    if (leafB) leafB.style.transform = 'rotateY(0deg)';
    setTimeout(function () {
      current = idx(current - 1);
      sync(current, true);
      busy = false;
    }, reduceMotion ? 20 : 1000);
  }

  function goTo(i) {
    if (i === current) return;
    // 一次只翻一页，保证书上每一页都对得上；远处的点按方向翻
    if (i > current) next(); else prev();
  }

  if (prevBtn) prevBtn.addEventListener('click', function (e) { e.stopPropagation(); prev(); });
  if (nextBtn) nextBtn.addEventListener('click', function (e) { e.stopPropagation(); next(); });
  if (pageR) pageR.addEventListener('click', next);
  if (leafF) leafF.addEventListener('click', next);

  /* 一句话 / 色号 */
  document.addEventListener('click', function (e) {
    const w = e.target.closest && e.target.closest('.pt-w');
    if (w) {
      const box = w.parentNode.querySelector('.pt-whisper');
      if (box) { box.classList.toggle('on'); w.classList.toggle('open'); }
      return;
    }
    const fav = e.target.closest && e.target.closest('.pt-fav');
    if (fav) {
      const on = toggleFav(fav.dataset.fav);
      fav.textContent = on ? '♥ 已收藏' : '♡ 收藏';
      fav.classList.toggle('on', on);
      if (grid) {
        Array.prototype.forEach.call(grid.children, function (el, i) {
          el.classList.toggle('is-fav', isFav(plates[i].id));
        });
      }
      if (window.EggKit) window.EggKit.bump('fav');
      return;
    }
    const sw = e.target.closest && e.target.closest('.pt-sw');
    if (sw && window.LookKit) {
      window.LookKit.setPalette(sw.dataset.pal, true);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (lightboxOpen()) {
      if (e.key === 'Escape') { closeLightbox(); return; }
      if (e.key === 'ArrowRight') { e.preventDefault(); stepLightbox(1); return; }
      if (e.key === 'ArrowLeft') { e.preventDefault(); stepLightbox(-1); return; }
      return;
    }
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    if (/^[1-8]$/.test(e.key)) {
      const i = parseInt(e.key, 10) - 1;
      if (i < n() && i !== current) {
        if (i > current) next(); else prev();
      }
    }
  });

  /* ---------------- 网格 ---------------- */
  if (grid) {
    plates.forEach(function (p, i) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'plate-card';
      b.innerHTML =
        '<span class="plate-frame">' + fitSvg(p) + '</span>' +
        '<span class="pc-meta"><b>' + p.title + '</b><i>' + p.tone + '</i></span>';
      b.addEventListener('click', function () { goTo(i); });
      grid.appendChild(b);
    });
  }

  /* ---------------- 照片墙 ---------------- */
  /* ---------------- 照片墙 + 大图 ---------------- */
  let lb = null, lbImg = null, lbCap = null, lbIdx = 0, photos = [];

  function lightboxOpen() { return lb && lb.classList.contains('on'); }

  function buildLightbox() {
    if (lb) return;
    lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML =
      '<button class="lb-close" type="button" aria-label="关闭">✕</button>' +
      '<button class="lb-nav prev" type="button" aria-label="上一张">←</button>' +
      '<figure><img alt="" /><figcaption></figcaption></figure>' +
      '<button class="lb-nav next" type="button" aria-label="下一张">→</button>';
    document.body.appendChild(lb);
    lbImg = lb.querySelector('img');
    lbCap = lb.querySelector('figcaption');

    lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
    lb.querySelector('.lb-nav.prev').addEventListener('click', function (e) { e.stopPropagation(); stepLightbox(-1); });
    lb.querySelector('.lb-nav.next').addEventListener('click', function (e) { e.stopPropagation(); stepLightbox(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
  }

  function openLightbox(i) {
    if (!photos.length) return;
    buildLightbox();
    lbIdx = (i + photos.length) % photos.length;
    lbImg.src = photos[lbIdx].src;
    lbCap.textContent = (lbIdx + 1) + ' / ' + photos.length;
    lb.classList.add('on');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lb) return;
    lb.classList.remove('on');
    document.body.style.overflow = '';
  }

  function stepLightbox(d) {
    lbIdx = (lbIdx + d + photos.length) % photos.length;
    lbImg.src = photos[lbIdx].src;
    lbCap.textContent = (lbIdx + 1) + ' / ' + photos.length;
  }

  function emptyTile(i, word) {
    const d = document.createElement('div');
    d.className = 'photo-tile';
    d.innerHTML = '<span class="pt-mono">PHOTO ' + pad(i + 1) + '</span>' +
      '<span class="pt-word">' + (word || '等你') + '</span>';
    return d;
  }

  if (wall) {
    photos = (window.PHOTOS || []).filter(function (p) { return p && p.src; });

    if (photos.length) {
      /* ---- 两种看法：墙 / 相册 ---- */
      const tabs = document.createElement('div');
      tabs.className = 'wall-tabs';
      tabs.innerHTML =
        '<button type="button" class="wt on" data-v="album">相册</button>' +
        '<button type="button" class="wt" data-v="wall">照片墙</button>' +
        '<span class="wt-count">' + photos.length + ' 张</span>';
      wall.parentNode.insertBefore(tabs, wall);

      /* 墙：一次先给 180 张，剩下的按需加载 */
      const CHUNK = 180;
      const allPhotos = photos.slice();
      let nowFilter = 'all';

      const colorBar = document.createElement('div');
      colorBar.className = 'color-bar';
      colorBar.innerHTML = '<span>按颜色</span>' +
        [['all', '全部'], ['r', '红'], ['o', '橙'], ['y', '黄'], ['g', '绿'], ['c', '青'], ['b', '蓝'], ['p', '紫'], ['k', '粉']]
          .map(function (c) { return '<button type="button" class="cb" data-c="' + c[0] + '"' + (c[0] === 'all' ? ' class="cb on" data-c="all"' : '') + '>' + c[1] + '</button>'; })
          .join('');
      wall.parentNode.insertBefore(colorBar, wall);
      let shown = 0;
      const bar = document.createElement('div');
      bar.className = 'photo-bar';
      bar.innerHTML = '<span id="wallCount"></span>' +
        '<span><button type="button" class="g-btn" id="morePhoto" hidden>再看一些</button> ' +
        '<button type="button" class="g-btn" id="randomPhoto">随便看一张</button></span>';

      function addTiles() {
        const end = Math.min(photos.length, shown + CHUNK);
        for (let i = shown; i < end; i++) {
          const p = photos[i];
          const d = document.createElement('button');
          d.type = 'button';
          d.className = 'photo-tile has-img';
          d.innerHTML =
            '<img src="' + p.src + '" alt="" loading="lazy" decoding="async" />' +
            '<span class="pt-cap">NO.' + pad(i + 1) + '</span>';
          d.addEventListener('click', function () { openLightbox(i); });
          wall.appendChild(d);
        }
        shown = end;
        const c = document.getElementById('wallCount');
        if (c) c.textContent = '已显示 ' + shown + ' / ' + photos.length;
        function inBucket(p, c) {
        if (c === 'all') return true;
        const h = p.h || 0, s = p.s || 0;
        const range = { r: [345, 15], o: [15, 45], y: [45, 70], g: [70, 160], c: [160, 200], b: [200, 260], p: [260, 300], k: [300, 345] }[c];
        if (!range || s < 0.12) return false;
        const lo = range[0], hi = range[1];
        return lo > hi ? (h >= lo || h <= hi) : (h >= lo && h <= hi);
      }

      Array.prototype.forEach.call(colorBar.querySelectorAll('.cb'), function (b) {
        b.addEventListener('click', function () {
          Array.prototype.forEach.call(colorBar.querySelectorAll('.cb'), function (x) { x.classList.remove('on'); });
          b.classList.add('on');
          nowFilter = b.dataset.c;
          photos = allPhotos.filter(function (p) { return inBucket(p, nowFilter); });
          wall.innerHTML = '';
          shown = 0;
          addTiles();
        });
      });

      const more = document.getElementById('morePhoto');
        if (more) more.hidden = shown >= photos.length;
      }
      addTiles();
      wall.parentNode.insertBefore(bar, wall.nextSibling);

      const more = document.getElementById('morePhoto');
      if (more) more.addEventListener('click', addTiles);
      const rp = document.getElementById('randomPhoto');
      if (rp) rp.addEventListener('click', function () { openLightbox(Math.floor(Math.random() * photos.length)); });

      /* 相册：一次三张，一大两小 */
      const album = document.createElement('div');
      album.className = 'album';
      album.classList.remove('hide');
      album.innerHTML =
        '<div class="album-spread" id="albumSpread"></div>' +
        '<div class="album-bar">' +
        '<button type="button" class="g-btn" id="albumPrev">← 上一组</button>' +
        '<span id="albumCount"></span>' +
        '<button type="button" class="g-btn" id="albumShuffle">随机一组</button>' +
        '<button type="button" class="g-btn" id="albumNext">下一组 →</button>' +
        '</div>';
      wall.parentNode.insertBefore(album, bar.nextSibling);

      let deck = [], at = 0;
      const LAYOUTS = ['big', 'strip', 'hero', 'offset', 'film'];

      function reshuffle() {
        deck = photos.map(function (_, i) { return i; });
        for (let k = deck.length - 1; k > 0; k--) {
          const j = Math.floor(Math.random() * (k + 1));
          const t = deck[k]; deck[k] = deck[j]; deck[j] = t;
        }
        at = 0;
      }

      function paintAlbum() {
        if (!deck.length) reshuffle();
        const spread = document.getElementById('albumSpread');
        if (!spread) return;
        const picks = [0, 1, 2].map(function (o) {
          const i = deck[(at * 3 + o) % deck.length];
          return { i: i, src: photos[i].src };
        });
        spread.innerHTML = picks.map(function (p, k) {
          return '<button type="button" class="al' + (k === 0 ? ' big' : '') + '" data-i="' + p.i + '">' +
            '<img src="' + p.src + '" alt="" loading="lazy" />' +
            '<span>NO.' + pad(p.i + 1) + '</span></button>';
        }).join('');
        spread.dataset.layout = LAYOUTS[Math.floor(Math.random() * LAYOUTS.length)];
        Array.prototype.forEach.call(spread.children, function (b) {
          b.addEventListener('click', function () { openLightbox(parseInt(b.dataset.i, 10)); });
        });
        const c = document.getElementById('albumCount');
        if (c) c.textContent = '第 ' + (at + 1) + ' 组';
      }

      const nextA = function () { at++; paintAlbum(); };
      const prevA = function () { at = Math.max(0, at - 1); paintAlbum(); };

      document.getElementById('albumNext').addEventListener('click', nextA);
      document.getElementById('albumPrev').addEventListener('click', prevA);
      document.getElementById('albumShuffle').addEventListener('click', function () { reshuffle(); paintAlbum(); });

      wall.classList.add('hide');
      bar.classList.add('hide');
      reshuffle();
      paintAlbum();

      Array.prototype.forEach.call(tabs.querySelectorAll('.wt'), function (t) {
        t.addEventListener('click', function () {
          Array.prototype.forEach.call(tabs.querySelectorAll('.wt'), function (x) { x.classList.remove('on'); });
          t.classList.add('on');
          const isAlbum = t.dataset.v === 'album';
          wall.classList.toggle('hide', isAlbum);
          bar.classList.toggle('hide', isAlbum);
          album.classList.toggle('hide', !isAlbum);
          if (isAlbum && !deck.length) { reshuffle(); paintAlbum(); }
        });
      });
    } else {
      ['山', '雪', '灯', '路', '手', '窗', '云', '旧'].forEach(function (t, i) {
        wall.appendChild(emptyTile(i, t));
      });
    }
  }

  /* ---------------- 画册小工具：轴 / 抽卡 / 四字体 / 纸纹 ---------------- */
  function buildTools() {
    let host = document.querySelector('.at-tools');
    if (!host) {
      const bookEl = document.getElementById('book');
      if (!bookEl) return;
      host = document.createElement('div');
      host.className = 'at-tools';
      host.innerHTML =
        '<button type="button" data-act="card">抽一张</button>' +
        '<button type="button" data-act="fonts">四种字体</button>' +
        '<button type="button" data-act="paper">纸纹</button>' +
        '<button type="button" data-act="dots">网点</button>' +
        '<button type="button" data-act="neg">底片</button>' +
        '<div class="at-axis" id="atAxis"></div>';
      bookEl.parentNode.insertBefore(host, bookEl);
    }
    const axis = document.getElementById('atAxis');

    /* 年代轴 */
    if (axis) {
      const years = plates.map(function (p) { return p.year || 0; });
      const lo = Math.min.apply(null, years.filter(Boolean));
      const hi = Math.max.apply(null, years);
      axis.innerHTML = '<span class="ax-lo">' + lo + '</span><span class="ax-line"></span><span class="ax-hi">' + hi + '</span>';
      const line = axis.querySelector('.ax-line');
      plates.forEach(function (p, i) {
        if (!p.year) return;
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'ax-dot';
        b.style.left = ((p.year - lo) / (hi - lo || 1) * 100) + '%';
        b.dataset.i = i;
        b.title = p.title + ' · ' + p.year;
        b.addEventListener('click', function () { goTo(i); });
        line.appendChild(b);
      });
    }

    /* 只看收藏 */
    if (host && grid && !document.getElementById('favBtn')) {
      const fb = document.createElement('button');
      fb.type = 'button';
      fb.id = 'favBtn';
      fb.textContent = '只看收藏';
      fb.addEventListener('click', function () {
        const on = grid.classList.toggle('only-fav');
        fb.classList.toggle('on', on);
      });
      host.appendChild(fb);
    }

    /* 抽一张 */
    host.addEventListener('click', function (e) {
      const btn = e.target.closest('button[data-act]');
      if (!btn) return;
      const act = btn.dataset.act;

      if (act === 'card') {
        let i = Math.floor(Math.random() * plates.length);
        if (i === current) i = (i + 1) % plates.length;
        drawCard(i);
        return;
      }

      if (act === 'fonts') { fontsOverlay(); return; }

      if (act === 'neg') {
        const bk = document.getElementById('book');
        if (!bk) return;
        bk.classList.toggle('neg');
        btn.classList.toggle('on', bk.classList.contains('neg'));
        return;
      }

      if (act === 'paper' || act === 'dots') {
        const bookEl = document.getElementById('book');
        if (!bookEl) return;
        const cls = act === 'paper' ? 'mode-paper' : 'mode-dots';
        const other = act === 'paper' ? 'mode-dots' : 'mode-paper';
        const on = !bookEl.classList.contains(cls);
        bookEl.classList.remove(other);
        bookEl.classList.toggle(cls, on);
        Array.prototype.forEach.call(host.querySelectorAll('button[data-act]'), function (b) {
          if (b.dataset.act === 'paper' || b.dataset.act === 'dots') {
            b.classList.toggle('on', document.getElementById('book').classList.contains('mode-' + b.dataset.act));
          }
        });
        return;
      }
    });
  }

  /* 抽卡：一张牌飞出来，然后翻到那一页 */
  function drawCard(i) {
    const p = plates[i];
    let box = document.getElementById('drawCard');
    if (!box) {
      box = document.createElement('div');
      box.id = 'drawCard';
      box.className = 'draw-card';
      document.body.appendChild(box);
    }
    box.innerHTML = '<div class="dc-in"><span class="dc-k">抽到</span>' +
      (p.photo ? '<img src="' + p.photo + '" alt="" />' : '') +
      '<b>' + p.title + '</b><i>' + p.tone + '</i></div>';
    box.classList.add('on');
    setTimeout(function () {
      box.classList.remove('on');
      goTo(i);
    }, 1250);
  }

  /* 四种字体并排 */
  function fontsOverlay() {
    const p = plates[current];
    let box = document.getElementById('fontBox');
    if (!box) {
      box = document.createElement('div');
      box.id = 'fontBox';
      box.className = 'font-box';
      document.body.appendChild(box);
      box.addEventListener('click', function (e) { if (e.target === box) box.classList.remove('on'); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') box.classList.remove('on'); });
    }
    const rows = [
      ['极简', 'ff-min'], ['印刷', 'ff-print'],
      ['电影', 'ff-cine'], ['书法', 'ff-ink']
    ].map(function (r) {
      return '<div class="fb-row"><span>' + r[0] + '</span><b class="' + r[1] + '">' + p.title + '</b></div>';
    }).join('');
    box.innerHTML = '<div class="fb-in"><h4>' + p.title + ' · 四种字体</h4>' + rows + '<p>点一下外面关掉</p></div>';
    box.classList.add('on');
  }

  buildTools();

  /* ---------------- 启动 ---------------- */
  const kicker = document.getElementById('allKicker');
  if (kicker) kicker.textContent = '全部 · ' + pad(n()) + ' 幅';

  // 支持 atlas.html?plate=still 直接翻到某一幅（可以拿去分享）
  try {
    const want = new URLSearchParams(window.location.search).get('plate');
    if (want) {
      const i = plates.findIndex(function (p) { return p.id === want; });
      if (i >= 0) current = i;
    }
  } catch (e) { }

  sync(current, true);

  // 窗口从窄变宽时，重新摆一次书
  if (wideQuery.addEventListener) {
    wideQuery.addEventListener('change', function () { sync(current, true); });
  }
})();
