/* ============================================================
   eggs.js — 额外彩蛋
   ------------------------------------------------------------
   输入「抬头」/ 按 / / 控制台 help() / 发呆 45 秒 / 彩蛋计数
   ============================================================ */
(function () {
  'use strict';

  const KEY = 'nova-eggs';

  function bump(key) {
    let got = {};
    try { got = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { got = {}; }
    if (got[key]) return;
    got[key] = 1;
    try { localStorage.setItem(KEY, JSON.stringify(got)); } catch (e) { }
    const n = Object.keys(got).length;
    if (n >= 7) {
      const f = document.querySelector('.f-c');
      if (f && !f.querySelector('.egg-seven')) {
        const s = document.createElement('span');
        s.className = 'egg-seven';
        s.textContent = ' · 第七个';
        f.appendChild(s);
      }
    }
    if (n >= 3) {
      const f = document.querySelector('.f-c');
      if (f && !f.querySelector('.egg-count')) {
        const s = document.createElement('span');
        s.className = 'egg-count';
        s.textContent = ' · 彩蛋 ' + n;
        f.appendChild(s);
      } else if (f) {
        const s = f.querySelector('.egg-count');
        if (s) s.textContent = ' · 彩蛋 ' + n;
      }
    }
  }

  function toast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._eg);
    t._eg = setTimeout(function () { t.classList.remove('show'); }, 2000);
  }

  /* 已打开的隐藏页也算 */
  try {
    if (localStorage.getItem('nova-room-open') === '1') bump('room');
    if (localStorage.getItem('nova-letter-open') === '1') bump('letter');
  } catch (e) { }
  window.addEventListener('egg:door', function () { bump('door'); });

  /* 输入「抬头」 */
  let buf = '';
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key.length !== 1) return;
    buf = (buf + e.key).slice(-6);
    if (buf.indexOf('抬头') >= 0) {
      buf = '';
      document.body.classList.add('lift');
      setTimeout(function () { document.body.classList.remove('lift'); }, 1600);
      bump('lift');
      toast('抬头。');
    }
  });

  /* 控制台 help() */
  window.help = function () {
    console.log('%c 彩蛋清单 ', 'background:#4b6bff;color:#fff;padding:2px 6px;border-radius:3px');
    console.log('1  连点 7 下小太阳 → 房间');
    console.log('2  ↑↑↓↓←→←→BA → 房间');
    console.log('3  房间口令：换了人间');
    console.log('4  信的口令：空天2202');
    console.log('5  输入「抬头」两个字');
    console.log('6  按 / 看快捷键');
    console.log('7  停手 45 秒，画面会暗下来，只剩星星');
    console.log('8  深夜进房间，窗外会下雪');
    console.log('9  房间里还有一扇门 → 去莫斯科的那趟车');
    console.log('10 房间里那本《密码本》，集齐三个口令才会亮');
    console.log('11 画册连翻 9 页，第 10 页不是画');
    console.log('12 点信上的印章，会盖一枚新的，可以存下来');
    console.log('13 手机倒过来（没试过的人不会信）');
    console.log('14 birthday("04-12") —— 把那天空出来');
    return '一共 14 个。';
  };

  /* / 快捷键面板 */
  document.addEventListener('keydown', function (e) {
    if (e.key !== '/') return;
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    e.preventDefault();
    let box = document.querySelector('.keys-box');
    if (!box) {
      box = document.createElement('div');
      box.className = 'keys-box';
      box.innerHTML =
        '<div class="kb-in"><h4>快捷键</h4><ul>' +
        '<li><kbd>T</kbd> 外观面板</li><li><kbd>1</kbd>–<kbd>8</kbd> 换风格</li>' +
        '<li><kbd>[</kbd> <kbd>]</kbd> 换颜色</li><li><kbd>G</kbd> 颗粒</li>' +
        '<li><kbd>←</kbd> <kbd>→</kbd> 画册翻页</li><li><kbd>/</kbd> 这张表</li>' +
        '<li><kbd>Esc</kbd> 关闭</li><li>打字「抬头」</li></ul></div>';
      document.body.appendChild(box);
      box.addEventListener('click', function (ev) { if (ev.target === box) box.classList.remove('on'); });
    }
    box.classList.add('on');
    bump('keys');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    const box = document.querySelector('.keys-box');
    if (box) box.classList.remove('on');
  });

  /* 发呆 45 秒：暗下来，只剩星星 */
  let idle = 0;
  function resetIdle() {
    document.documentElement.classList.remove('idle-dim');
    clearTimeout(idle);
    idle = setTimeout(function () {
      document.documentElement.classList.add('idle-dim');
      bump('idle');
    }, 45000);
  }
  ['pointermove', 'keydown', 'scroll', 'pointerdown', 'touchstart'].forEach(function (ev) {
    window.addEventListener(ev, resetIdle, { passive: true });
  });
  resetIdle();

  /* 生日：把日期写进本地，那天打开会多一句 */
  window.birthday = function (mmdd) {
    if (!mmdd || !/^\d{2}-\d{2}$/.test(mmdd)) {
      try { localStorage.removeItem('nova-birthday'); } catch (e) { }
      return '已清除。';
    }
    try { localStorage.setItem('nova-birthday', mmdd); } catch (e) { }
    return '记住了：每年 ' + mmdd + '。';
  };

  const DEFAULT_BIRTHDAY = '03-25';   // 3 月 25 日

  (function birthdayCheck() {
    let bd = null;
    try { bd = localStorage.getItem('nova-birthday'); } catch (e) { }
    if (!bd) bd = DEFAULT_BIRTHDAY;
    if (!bd) return;
    const d = new Date();
    const today = ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    if (today !== bd) return;
    bump('birthday');
    const el = document.createElement('div');
    el.className = 'egg-birthday';
    el.textContent = '今天是你生日。这一页记得。';
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 9000);
  })();

  window.EggKit = { bump: bump, count: function () { return Object.keys(JSON.parse(localStorage.getItem(KEY) || '{}')).length; } };
})();
