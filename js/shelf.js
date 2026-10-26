/* ============================================================
   shelf.js — 书架
   ------------------------------------------------------------
   想加书：往 BOOKS 里加一行就行。
   { t: 书名, a: 作者, l: 那一句, y: 年份 }
   ============================================================ */
(function () {
  'use strict';

  const FALLBACK = [
    { t: '大师和玛格丽特', a: '布尔加科夫', l: '手稿是烧不毁的。', y: '1940' },
    { t: '局外人', a: '加缪', l: '今天，妈妈死了。也许是昨天，我不知道。', y: '1942' },
    { t: '三体', a: '刘慈欣', l: '给岁月以文明，而不是给文明以岁月。', y: '2008' },
    { t: '瓦尔登湖', a: '梭罗', l: '我步入丛林，因为我希望生活得有意义。', y: '1854' },
    { t: '银河系漫游指南', a: '道格拉斯·亚当斯', l: '不要恐慌。', y: '1979' },
    { t: '鱼王', a: '阿斯塔菲耶夫', l: '西伯利亚的雪，落在河上不化。', y: '1976', own: true },
    { t: '静静的顿河', a: '肖洛霍夫', l: '一个人走近土地的时候，会安静下来。', y: '1940', own: true },
    { t: '切尔诺贝利的祈祷', a: '阿列克谢耶维奇', l: '他们讲的时候，都不看我的眼睛。', y: '1997', own: true },
    { t: '万物简史', a: '比尔·布莱森', l: '我们是一颗普通恒星旁边的一粒尘。', y: '2003', own: true },
    { t: '查令十字街 84 号', a: '海莲·汉芙', l: '你们若恰好路经查令十字街 84 号。', y: '1970' }
  ];

  /* 优先用 content.js 里的 books 池子，抽三本轮着换 */
  function booksNow() {
    if (window.Pool && Pool.all('books').length) {
      var picked = Pool.pick('books', Math.min(4, Pool.all('books').length));
      return picked.map(function (b) { return { t: b.t, a: b.a, l: b.l, y: '' }; });
    }
    return FALLBACK.slice(0, 4);
  }

  function build() {
    const host = document.getElementById('shelf');
    if (!host || host.dataset.built) return;
    host.dataset.built = '1';

    const row = document.createElement('div');
    row.className = 'shelf-row';

    var BOOKS = booksNow();
    BOOKS.forEach(function (b, i) {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'spine t' + (i % 5);
      el.style.setProperty('--h', (150 + ((i * 37) % 56)) + 'px');
      el.innerHTML = '<span class="sp-t">' + b.t + '</span><span class="sp-a">' + b.a + '</span>';
      el.dataset.i = i;
      row.appendChild(el);
    });

    const board = document.createElement('div');
    board.className = 'shelf-board';

    host.appendChild(row);
    host.appendChild(board);

    /* 浮出的那一句 */
    let card = null;
    function show(i, el) {
      const b = BOOKS[i];
      if (!card) {
        card = document.createElement('div');
        card.className = 'shelf-card';
        document.body.appendChild(card);
      }
      card.innerHTML = '<p class="sc-l">' + b.l + '</p>' +
        '<p class="sc-m">' + b.t + ' · ' + b.a + ' · ' + b.y + (b.own ? ' · 我记下的一句' : '') + '</p>';
      const r = el.getBoundingClientRect();
      card.classList.add('on');
      const w = 300;
      let x = r.left + r.width / 2 - w / 2;
      x = Math.max(12, Math.min(window.innerWidth - w - 12, x));
      card.style.left = x + 'px';
      card.style.top = Math.max(12, r.top - 92) + 'px';
    }
    function hide() { if (card) card.classList.remove('on'); }

    Array.prototype.forEach.call(row.children, function (el) {
      el.addEventListener('mouseenter', function () { show(parseInt(el.dataset.i, 10), el); });
      el.addEventListener('mouseleave', hide);
      el.addEventListener('focus', function () { show(parseInt(el.dataset.i, 10), el); });
      el.addEventListener('blur', hide);
      el.addEventListener('click', function () { show(parseInt(el.dataset.i, 10), el); });
    });
    document.addEventListener('scroll', hide, { passive: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
