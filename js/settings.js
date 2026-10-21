/* ============================================================
   settings.js — 一个总开关面板
   ------------------------------------------------------------
   你想要的就开，不想要的关。全部记在本地，跨页面生效。
   做法：往 <html> 上加类名，CSS 负责隐藏/停用。
   ============================================================ */
(function () {
  'use strict';

  const KEY = 'nova-settings-v1';

  const ITEMS = [
    { id: 'scene',  name: '背景画',   desc: '每页那一大幅风景', on: true },
    { id: 'random', name: '每次换一张', desc: '打开始随机挑一张背景', on: true },
    { id: 'grain',  name: '颗粒感',   desc: '胶片一样的噪点', on: true },
    { id: 'fog',    name: '鼠标云雾', desc: '跟着鼠标拖的雾', on: true },
    { id: 'dust',   name: '漂浮粒子', desc: '空气里的尘', on: true },
    { id: 'cursor', name: '自定义光标', desc: '换成小圆点', on: true },
    { id: 'motion', name: '动效',     desc: '视差和浮动', on: true },
    { id: 'photos', name: '照片墙',   desc: '画册里你自己那一面墙', on: true },
    { id: 'autoPalette', name: '自动换色', desc: '每 60 秒换一套颜色和背景', on: true },
    { id: 'nowCard', name: '现在的我', desc: '右下角那张小卡', on: false },
    { id: 'contours', name: '等高线', desc: '背景里极淡的地形线', on: true },
    { id: 'altRuler', name: '海拔尺', desc: '右边那根 0–100 km 的尺', on: true }
  ];

  const CLASS = {
    scene: 'off-scene', grain: 'off-grain', fog: 'off-fog',
    dust: 'off-dust', cursor: 'off-cursor', motion: 'off-motion', photos: 'off-photos', random: 'bg-static', autoPalette: 'off-autopalette', nowCard: 'off-nowcard', contours: 'off-contours', altRuler: 'off-altruler'
  };

  let state = {};
  let panel = null, btn = null;

  function load() {
    try { state = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { state = {}; }
    ITEMS.forEach(function (it) { if (typeof state[it.id] !== 'boolean') state[it.id] = it.on; });
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { }
  }

  function apply() {
    const root = document.documentElement;
    ITEMS.forEach(function (it) {
      if (it.id === 'random') { root.classList.toggle(CLASS.random, !state.random); return; }
      root.classList.toggle(CLASS[it.id], !state[it.id]);
    });
    window.dispatchEvent(new CustomEvent('settingschange', { detail: state }));
  }

  function build() {
    load();
    apply();

    const right = document.querySelector('.nav-right');
    if (!right || document.getElementById('settingsBtn')) return;

    btn = document.createElement('button');
    btn.id = 'settingsBtn';
    btn.className = 'icon-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', '设置');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="M4 7h7M17 7h3M4 12h3M13 12h7M4 17h11M19 17h1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
      '<circle cx="14" cy="7" r="2.2" stroke="currentColor" stroke-width="1.6"/>' +
      '<circle cx="10" cy="12" r="2.2" stroke="currentColor" stroke-width="1.6"/>' +
      '<circle cx="17" cy="17" r="2.2" stroke="currentColor" stroke-width="1.6"/>' +
      '</svg>';
    right.insertBefore(btn, right.firstChild);

    panel = document.createElement('div');
    panel.className = 'settings-panel';
    panel.id = 'settingsPanel';
    panel.setAttribute('aria-hidden', 'true');
    panel.innerHTML =
      '<div class="sp-head"><span>设置</span><em>随时开，随时关</em></div>' +
      '<div class="sp-list">' +
      ITEMS.map(function (it) {
        return '<button class="sp-row" type="button" data-id="' + it.id + '" role="switch" aria-checked="true">' +
          '<span class="sp-txt"><b>' + it.name + '</b><i>' + it.desc + '</i></span>' +
          '<span class="sp-switch"><i></i></span></button>';
      }).join('') +
      '</div>' +
      '<button class="sp-action" type="button" id="spShuffle">换一张背景</button>';
    document.body.appendChild(panel);

    const sh = panel.querySelector('#spShuffle');
    if (sh) {
      sh.addEventListener('click', function () {
        if (window.SceneKit) window.SceneKit.shuffle();
      });
    }

    Array.prototype.forEach.call(panel.querySelectorAll('.sp-row'), function (row) {
      row.addEventListener('click', function () {
        const id = row.dataset.id;
        state[id] = !state[id];
        row.setAttribute('aria-checked', state[id] ? 'true' : 'false');
        row.classList.toggle('off', !state[id]);
        apply();
        save();
      });
    });

    const paint = function () {
      Array.prototype.forEach.call(panel.querySelectorAll('.sp-row'), function (row) {
        const on = !!state[row.dataset.id];
        row.setAttribute('aria-checked', on ? 'true' : 'false');
        row.classList.toggle('off', !on);
      });
    };
    paint();

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const open = panel.classList.toggle('open');
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    });
    document.addEventListener('click', function (e) {
      if (!panel.classList.contains('open')) return;
      if (panel.contains(e.target) || btn.contains(e.target)) return;
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }

  window.SettingsKit = {
    get: function (id) { return state[id]; },
    set: function (id, on) { state[id] = !!on; apply(); save(); }
  };
})();
