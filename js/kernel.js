/* ============================================================
   kernel.js — 站点内核（所有页面都加载，必须最先跑）
   ------------------------------------------------------------
   这一层只做三件事：
     1. 给页面一个统一的名字和上下文（Site.page）
     2. 给未来的功能留接口（Site.hooks / Site.features / Site.modal / Site.toast）
     3. 给交互留一个统一的"感觉"（Site.fx）
   页面自身的逻辑不依赖这里，这里也不依赖任何页面。
   ============================================================ */
(function () {
  'use strict';

  /* ---------------- 站点事实 ---------------- */
  const SITE = {
    name: '范连璟',
    handle: 'FAN LIANJING',
    repo: 'https://github.com/lianjingfan4-cloud/flj520',
    live: 'https://lianjingfan4-cloud.github.io/flj520/',
    email: 'flj520@sjtu.edu.cn',
    phone: '18863695857',
    since: 2026,
    version: '1.0.0'
  };

  /* ---------------- 页面表：图标 / 标题 / 分区 ----------------
     新加页面时，在这里登记一行；导航、面包屑、分享卡都读这里。 */
  const PAGES = {
    'index':      { zh: '我',     en: 'MYSELF',   section: 'home' },
    'atlas':      { zh: '画册',   en: 'ATLAS',    section: 'atlas' },
    'works':      { zh: '拾趣',   en: 'TRIFLES',  section: 'works' },
    'ideas':      { zh: '创意',   en: 'DEVICES',  section: 'ideas' },
    'writing':    { zh: '写作',   en: 'WRITINGS', section: 'writing' },
    'guess':      { zh: '图寻',   en: 'GEO',      section: 'geo' },
    'doodle':     { zh: '幼稚园', en: 'SCRIBBLES', section: 'doodle' },
    'garden':     { zh: '一盆花', en: 'GARDEN',   section: 'garden' },
    'puzzle':     { zh: '拼图',   en: 'PUZZLE',   section: 'works' },
    'memory':     { zh: '记忆翻牌', en: 'MEMORY', section: 'works' },
    'orbit':      { zh: '轨道小课堂', en: 'ORBIT', section: 'works' },
    'postcard':   { zh: '明信片', en: 'POSTCARD', section: 'works' },
    'colors':     { zh: '色彩考古', en: 'COLORS', section: 'works' },
    'capsule':    { zh: '时间胶囊', en: 'CAPSULE', section: 'ideas' },
    'print-atlas':{ zh: '打印画册', en: 'PRINT',  section: 'ideas' },
    'type-lab':   { zh: '字体实验室', en: 'TYPE', section: 'works' },
    'resume':     { zh: '简历',   en: 'RESUME',   section: 'home' },
    'pong':       { zh: '乒乓',   en: 'PONG',     section: 'works' },
    'launch':     { zh: '发射窗口', en: 'LAUNCH', section: 'works' },
    'room':       { zh: '房间',   en: 'CHAMBER',  section: 'hidden' },
    'letter':     { zh: '信',     en: 'LETTER',   section: 'hidden' },
    'codex':      { zh: '密码本', en: 'CODEX',    section: 'hidden' },
    'train':      { zh: '火车',   en: 'TRAIN',    section: 'hidden' }
  };

  /* ---------------- 未来功能的登记表 ----------------
     每一项都是一个「已经想好、还没做」的功能。
     要加的时候：把 ready 改成 true，实现 impl，然后在任何地方
       Site.run('audio.recording')
     就会跑起来。不需要改页面结构。
     ------------------------------------------------------------ */
  const FEATURES = {
    'audio.recording': {
      title: '你录的十秒', ready: false, needs: '一段录音',
      note: '把一个 mp3 放进 assets/voice/，这里换成 new Audio(...) 播放。',
      impl: null
    },
    'photos.byDate': {
      title: '照片按年份/地点', ready: false, needs: '照片的拍摄时间与地点',
      note: 'photos.js 每条现在只有 src；补上 t(时间)/p(地点) 后，这里做分组。',
      impl: null
    },
    'guestbook': {
      title: '访客留言', ready: false, needs: '一个后端或 giscus',
      note: '现在 Site.track() 只是本地队列；接上后端后在这里发请求。',
      impl: null
    },
    'leaderboard': {
      title: '图寻排行', ready: false, needs: '一个后端',
      note: '分数已经存在 localStorage（Arcade），这里改成上传/拉取。',
      impl: null
    },
    'share.qr': {
      title: '分享卡带真二维码', ready: false, needs: '二维码库或接口',
      note: 'interact.js 里 makeShareCard() 预留了画二维码的位置。',
      impl: null
    },
    'analytics': {
      title: '访问统计', ready: false, needs: '一个后端或第三方',
      note: 'Site.track 已经会记录每一次事件，接一个上报就行。',
      impl: null
    },
    'voice.intro': {
      title: '用你的声音念开场', ready: false, needs: '录音',
      note: '粒子的开场结束后接一段音频，Site.hooks.on("intro:done") 里挂。',
      impl: null
    },
    'daily.quote': {
      title: '每日一句', ready: false, needs: '句子库',
      note: '按日期取种子，跟 daily.js 的做法一致。',
      impl: null
    }
  };

  /* ---------------- 钩子 ---------------- */
  const listeners = {};
  const ONCE = {};

  const hooks = {
    on: function (name, fn) {
      if (typeof fn !== 'function') return function () { };
      (listeners[name] = listeners[name] || []).push(fn);
      return function off() {
        listeners[name] = (listeners[name] || []).filter(function (f) { return f !== fn; });
      };
    },
    once: function (name, fn) {
      const off = hooks.on(name, function (payload) { off(); fn(payload); });
      (ONCE[name] = ONCE[name] || []).push(fn);
      return off;
    },
    emit: function (name, payload) {
      (listeners[name] || []).slice().forEach(function (fn) {
        try { fn(payload); } catch (e) { console.warn('[hook]', name, e); }
      });
      try { window.dispatchEvent(new CustomEvent('site:' + name, { detail: payload })); } catch (e) { }
    },
    names: function () { return Object.keys(listeners); }
  };

  /* ---------------- 事件（给未来后端留的口子） ---------------- */
  const events = [];
  function track(name, data) {
    events.push({ t: Date.now(), name: name, data: data || null, page: page });
    if (events.length > 200) events.shift();
    hooks.emit('track', { name: name, data: data });
  }

  /* ---------------- 页面 ---------------- */
  let page = 'index';
  (function resolvePage() {
    const file = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '');
    page = file || 'index';
  })();

  /* ---------------- toast（全局一个，排队，去重） ---------------- */
  let toastEl = null, toastTimer = 0, lastMsg = '', lastAt = 0;

  function ensureToast() {
    if (toastEl && document.body.contains(toastEl)) return toastEl;
    toastEl = document.getElementById('toast');
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.id = 'toast';
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    return toastEl;
  }

  function toast(msg, opts) {
    opts = opts || {};
    const now = Date.now();
    if (msg === lastMsg && now - lastAt < 1200) return;   // 同一句话不连弹
    lastMsg = msg; lastAt = now;
    const el = ensureToast();
    el.textContent = msg;
    el.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('on'); }, opts.ms || 2600);
    hooks.emit('toast', msg);
  }

  /* ---------------- modal（可访问的对话框） ---------------- */
  function modal(opts) {
    opts = opts || {};
    const wrap = document.createElement('div');
    wrap.className = 'site-modal';
    wrap.innerHTML =
      '<div class="sm-panel" role="dialog" aria-modal="true" aria-label="' + (opts.title || '对话框') + '">' +
      '<button class="sm-x" type="button" aria-label="关闭">✕</button>' +
      (opts.title ? '<h2 class="sm-t">' + opts.title + '</h2>' : '') +
      '<div class="sm-b">' + (opts.body || '') + '</div>' +
      '<div class="sm-a"></div>' +
      '</div>';
    document.body.appendChild(wrap);
    requestAnimationFrame(function () { wrap.classList.add('on'); });

    const panel = wrap.querySelector('.sm-panel');
    const actions = wrap.querySelector('.sm-a');
    (opts.actions || [{ label: '知道了', primary: true }]).forEach(function (a) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'sm-bt' + (a.primary ? ' primary' : '');
      b.textContent = a.label;
      b.addEventListener('click', function () {
        if (a.onClick) a.onClick();
        if (a.keepOpen) return;
        close();
      });
      actions.appendChild(b);
    });

    let closed = false;
    function close() {
      if (closed) return;
      closed = true;
      wrap.classList.remove('on');
      setTimeout(function () { wrap.remove(); }, 220);
      document.removeEventListener('keydown', onKey);
      hooks.emit('modal:close', opts.title);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }

    wrap.querySelector('.sm-x').addEventListener('click', close);
    wrap.addEventListener('click', function (e) { if (e.target === wrap) close(); });
    document.addEventListener('keydown', onKey);
    setTimeout(function () { const f = panel.querySelector('.sm-bt'); if (f) f.focus(); }, 60);
    hooks.emit('modal:open', opts.title);
    return { close: close, el: wrap };
  }

  /* ---------------- 杂项 ---------------- */
  function reducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  function canHover() {
    return window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }
  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { toast('复制了'); }).catch(function () { toast('复制不了，手动选一下吧'); });
    }
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); toast('复制了'); } catch (e) { toast('复制不了'); }
    ta.remove();
  }
  function run(id) {
    const f = FEATURES[id];
    if (!f) { console.warn('[feature] 未登记：' + id); return; }
    if (!f.ready || typeof f.impl !== 'function') {
      toast('「' + f.title + '」还没接上 —— 缺：' + (f.needs || '素材'));
      hooks.emit('feature:blocked', id);
      return;
    }
    return f.impl();
  }
  function enabled(id) {
    const f = FEATURES[id];
    return !!(f && f.ready);
  }

  /* ---------------- 组装 ---------------- */
  window.Site = {
    site: SITE,
    pages: PAGES,
    features: FEATURES,
    hooks: hooks,
    track: track,
    events: function () { return events.slice(); },
    toast: toast,
    modal: modal,
    copy: copy,
    run: run,
    enabled: enabled,
    reducedMotion: reducedMotion,
    canHover: canHover,
    get page() { return page; },
    get meta() { return PAGES[page] || { zh: page, en: page.toUpperCase(), section: 'other' }; }
  };

  /* 立刻发出的几个通用事件 */
  document.addEventListener('DOMContentLoaded', function () {
    hooks.emit('ready', { page: page });
    const el = document.documentElement;
    el.classList.toggle('can-hover', canHover());
    el.classList.toggle('reduce-motion', reducedMotion());
    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mq.addEventListener) mq.addEventListener('change', function (e) { el.classList.toggle('reduce-motion', e.matches); });
    }
    track('page:view');
  });
  window.addEventListener('load', function () { hooks.emit('loaded', { page: page }); });

  /* 所有失败的图片：统一标记，样式里给一个占位 */
  document.addEventListener('error', function (e) {
    const t = e.target;
    if (t && t.tagName === 'IMG') {
      t.classList.add('img-failed');
      hooks.emit('img:error', t.getAttribute('src'));
    }
  }, true);
})();
