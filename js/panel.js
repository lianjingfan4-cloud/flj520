/* ============================================================
   panel.js — 外观面板（全站唯一一份）
   ------------------------------------------------------------
   以前每个页面都内联一份同样的 90 行面板，改一次要改 25 处。
   现在改成这里生成：只要页面里有 <button id="themeBtn">，
   面板就会自动挂上；look.js 在 DOMContentLoaded 时填空。
   ============================================================ */
(function () {
  'use strict';
  if (document.getElementById('themePanel')) return;

  var HTML = "<div class=\"theme-panel\" id=\"themePanel\" role=\"dialog\" aria-modal=\"false\" aria-label=\"外观设置\" aria-hidden=\"true\">\n  <div class=\"tp-head\"><span>换一种光</span><em>T 开关</em></div>\n  <div class=\"tp-tabs\" role=\"tablist\" aria-label=\"外观分类\">\n    <button class=\"tp-tab is-on\" type=\"button\" role=\"tab\" data-tab=\"color\" aria-selected=\"true\">颜色 <b id=\"famNow\">暗夜</b></button>\n    <button class=\"tp-tab\" type=\"button\" role=\"tab\" data-tab=\"style\" aria-selected=\"false\">风格 <b id=\"styleNow\">极简</b></button>\n  </div>\n  <div class=\"tp-pane\" id=\"paneColor\">\n    <div class=\"fam-list\" id=\"famList\"></div>\n    <p class=\"fam-blurb\" id=\"famBlurb\"></p>\n    <div class=\"sw-grid\" id=\"swList\"></div>\n  </div>\n  <div class=\"tp-pane\" id=\"paneStyle\" hidden>\n    <div class=\"st-grid\" id=\"styleList\"></div>\n    <p class=\"tp-tip\">字体、圆角、质感、粒子的运动方式。和颜色互不影响 —— 连画册里的画也会跟着换。</p>\n  </div>\n  <div class=\"tp-foot\" id=\"tpFoot\">5 个色系 · 60 种颜色 · 10 种风格</div>\n</div>";

  var host = document.createElement('div');
  host.innerHTML = HTML;

  var nav = document.getElementById('nav');
  if (nav && nav.parentNode) nav.parentNode.insertBefore(host.firstElementChild, nav.nextSibling);
  else document.body.appendChild(host.firstElementChild);
})();
