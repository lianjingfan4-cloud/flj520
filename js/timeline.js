/* timeline.js — C17 拖动时间轴：拖动就滚到那一年 */
(function () {
  'use strict';

  function build() {
    const range = document.getElementById('jsRange');
    const out = document.getElementById('jsOut');
    const list = document.querySelector('.journey');
    if (!range || !list) return;

    const items = Array.prototype.slice.call(list.children);
    range.max = String(items.length - 1);

    function years() {
      return items.map(function (li) {
        const y = li.querySelector('.yr');
        return y ? y.textContent.trim() : '';
      });
    }
    const YS = years();

    function go(i, smooth) {
      const li = items[i];
      if (!li) return;
      items.forEach(function (x) { x.classList.remove('hi'); });
      li.classList.add('hi');
      if (out) out.textContent = YS[i] || '';
      li.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'center' });
      if (window.EggKit) window.EggKit.bump('timeline');
    }

    range.addEventListener('input', function () { go(parseInt(range.value, 10), true); });
    if (out) out.textContent = YS[0] || '';
    items.forEach(function (li, i) {
      li.addEventListener('click', function () { range.value = String(i); go(i, true); });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
