/* ============================================================
   nav.js — 全站同一套导航 + 返回 + 移动端菜单 + 语言切换
   ------------------------------------------------------------
   所有页面共用这份清单，所以不会再出现"进去以后只剩三个模块"。
   ============================================================ */
(function () {
  'use strict';

  const ITEMS = [
    { zh: '我', en: 'MYSELF', href: 'index.html#about' },
    { zh: '履历', en: 'LEDGER', href: 'index.html#record' },
    { zh: '画册', en: 'ATLAS', href: 'atlas.html' },
    { zh: '拾趣', en: 'TRIFLES', href: 'works.html' },
    { zh: '创意', en: 'DEVICES', href: 'ideas.html' },
    { zh: '写作', en: 'WRITINGS', href: 'writing.html' },
    { zh: '图寻', en: 'GEO', href: 'guess.html' },
    { zh: '玩', en: 'PLAY', href: 'play.html' },
    { zh: '联系', en: 'PARLEY', href: 'index.html#contact' }
  ];

  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const isIndex = here === '' || here === 'index.html';
  const lang = function () { return document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'zh'; };

  function href(it) {
    if (isIndex && it.href.indexOf('index.html') === 0) return it.href.replace('index.html', '');
    return it.href;
  }
  function current(it) {
    const base = it.href.split('#')[0];
    return base === here || (isIndex && it.href.indexOf('index.html#') === 0);
  }

  function build() {
    const links = document.querySelector('.nav-links');
    if (!links) return;

    links.innerHTML = ITEMS.map(function (it) {
      const on = (!it.href.split('#')[1] && current(it)) ? ' class="on"' : '';
      return '<a href="' + href(it) + '"' + on + '>' + it[lang()] + '</a>';
    }).join('');

    // 返回
    if (!document.querySelector('.nav-back')) {
      const back = document.createElement('button');
      back.className = 'nav-back';
      back.type = 'button';
      back.setAttribute('aria-label', '返回');
      back.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      back.addEventListener('click', function () {
        if (history.length > 1) history.back();
        else location.href = 'index.html';
      });
      const brand = document.querySelector('.brand');
      if (brand && brand.parentNode) brand.parentNode.insertBefore(back, brand);
    }

    // 移动端菜单
    let toggle = document.querySelector('.nav-toggle');
    if (!toggle) {
      toggle = document.createElement('button');
      toggle.className = 'nav-toggle';
      toggle.type = 'button';
      toggle.setAttribute('aria-label', '菜单');
      toggle.innerHTML = '<span></span><span></span>';
      const brand = document.querySelector('.brand');
      if (brand && brand.parentNode) brand.parentNode.insertBefore(toggle, brand.nextSibling);
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        links.classList.toggle('open');
      });
      document.addEventListener('click', function (e) {
        if (!links.classList.contains('open')) return;
        if (links.contains(e.target) || toggle.contains(e.target)) return;
        links.classList.remove('open');
      });
    }

    // 语言按钮
    let langBtn = document.querySelector('.lang-btn');
    if (!langBtn) {
      langBtn = document.createElement('button');
      langBtn.className = 'lang-btn';
      langBtn.type = 'button';
      langBtn.setAttribute('aria-label', '切换语言');
      const right = document.querySelector('.nav-right');
      if (right) right.insertBefore(langBtn, right.firstChild);
      langBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (window.I18n) window.I18n.toggle();
        paintLang();
      });
    }
    paintLang();
  }

  function paintLang() {
    const btn = document.querySelector('.lang-btn');
    if (!btn) return;
    btn.textContent = lang() === 'en' ? '中' : 'EN';
    btn.title = lang() === 'en' ? '切成中文' : 'Switch to English';
    // 重新画导航文字
    const links = document.querySelector('.nav-links');
    if (links) {
      Array.prototype.forEach.call(links.children, function (a, i) {
        if (ITEMS[i]) a.textContent = ITEMS[i][lang()];
      });
    }
  }

  document.addEventListener('DOMContentLoaded', build);
  if (document.readyState !== 'loading') build();

  window.NavKit = { items: ITEMS, repaint: paintLang };
})();
