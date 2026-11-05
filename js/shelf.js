/* ============================================================
   shelf.js — 书架（密排网格版）
   ------------------------------------------------------------
   十二本一屏，书名 + 作者 + 那一句；每次刷新换一批。
   想加书：往 content.js 的 books 池子里加一行。
   ============================================================ */
(function () {
  'use strict';

  const FALLBACK = [
    { t: '大师和玛格丽特', a: '布尔加科夫', l: '手稿是烧不毁的。' },
    { t: '局外人', a: '加缪', l: '今天，妈妈死了。也许是昨天，我不知道。' },
    { t: '三体', a: '刘慈欣', l: '给岁月以文明，而不是给文明以岁月。' },
    { t: '瓦尔登湖', a: '梭罗', l: '我步入丛林，因为我希望生活得有意义。' },
    { t: '银河系漫游指南', a: '道格拉斯·亚当斯', l: '不要恐慌。' },
    { t: '鱼王', a: '阿斯塔菲耶夫', l: '西伯利亚的雪，落在河上不化。' }
  ];

  const PER_VIEW = 12;

  function booksNow() {
    if (window.Pool && Pool.all('books').length) {
      return Pool.pick('books', Math.min(PER_VIEW, Pool.all('books').length))
        .map(function (b) { return { t: b.t, a: b.a, l: b.l }; });
    }
    return FALLBACK.slice(0, PER_VIEW);
  }

  function build() {
    const host = document.getElementById('shelf');
    if (!host || host.dataset.built) return;
    host.dataset.built = '1';

    const books = booksNow();
    const grid = document.createElement('div');
    grid.className = 'shelf-grid';

    books.forEach(function (b, i) {
      const el = document.createElement('article');
      el.className = 'shelf-item';
      el.style.setProperty('--i', i);
      el.innerHTML =
        '<span class="si-n">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<div class="si-body">' +
        '<h4 class="si-t">' + b.t + '</h4>' +
        '<p class="si-a">' + b.a + '</p>' +
        '<p class="si-l">' + b.l + '</p>' +
        '</div>';
      el.addEventListener('click', function () {
        el.classList.toggle('open');
        if (window.Site) Site.track('shelf:open', b.t);
      });
      grid.appendChild(el);
    });

    host.appendChild(grid);

    const more = document.createElement('p');
    more.className = 'shelf-more';
    if (window.Pool) {
      const total = Pool.all('books').length;
      more.textContent = '池子里还有 ' + Math.max(0, total - books.length) + ' 本，每次刷新换一批。';
    }
    host.appendChild(more);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
