/* daily.js — E27 图寻每日一题：一天一道，连对天数记在本地 */
(function () {
  'use strict';

  const KEY = 'nova-geo-daily';

  function today() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function seedOf(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return Math.abs(h);
  }
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; }
  }
  function save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { } }
  function yesterday() {
    const d = new Date(); d.setDate(d.getDate() - 1);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function build() {
    const bank = window.GEO || [];
    const main = document.querySelector('.guess-wrap') || document.querySelector('main');
    if (!bank.length || !main || document.getElementById('dailyBox')) return;

    const day = today();
    const seed = seedOf(day);
    const city = bank[seed % bank.length];

    const others = [];
    let k = seed;
    while (others.length < 3) {
      k = (k * 1103515245 + 12345) & 0x7fffffff;
      const c = bank[k % bank.length];
      if (c.name !== city.name && others.indexOf(c.name) < 0) others.push(c.name);
    }
    const opts = [city.name].concat(others);
    for (let i = opts.length - 1; i > 0; i--) {
      const j = (seed + i * 7) % (i + 1);
      const t = opts[i]; opts[i] = opts[j]; opts[j] = t;
    }

    const st = load() || { date: '', streak: 0, done: false, correct: 0 };
    if (st.date !== day) { st.date = day; st.done = false; save(st); }

    const sec = document.createElement('section');
    sec.id = 'dailyBox';
    sec.style.cssText = 'margin-top:46px;padding-top:26px;border-top:1px solid var(--line-strong)';
    sec.innerHTML =
      '<p class="kicker" style="margin-bottom:8px">每日一题 · DAILY</p>' +
      '<h2 style="font-family:var(--font-display);font-size:clamp(20px,3vw,34px);margin-bottom:12px">今天这张，是哪儿？</h2>' +
      '<div style="position:relative;border:1px solid var(--card-line);border-radius:4px;overflow:hidden;max-width:720px">' +
      '<img alt="" src="' + city.src + '" style="width:100%;display:block;aspect-ratio:3/2;object-fit:cover" />' +
      '</div>' +
      '<div class="daily-opts" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:720px;margin-top:10px"></div>' +
      '<p class="daily-msg" style="margin-top:10px;font-size:13px;color:var(--fg-dim);min-height:22px"></p>' +
      '<p class="daily-streak" style="font-family:var(--font-mono);font-size:10px;letter-spacing:.16em;color:var(--fg-faint)"></p>';

    main.appendChild(sec);

    const box = sec.querySelector('.daily-opts');
    const msg = sec.querySelector('.daily-msg');
    const streakEl = sec.querySelector('.daily-streak');

    const paintStreak = function () {
      streakEl.textContent = '连对 ' + st.streak + ' 天' + (st.done ? ' · 今天已答' : '');
    };
    paintStreak();

    opts.forEach(function (name) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = name;
      b.style.cssText = 'padding:13px 16px;text-align:left;border:1px solid var(--line-strong);background:transparent;color:var(--fg);font-size:14px;border-radius:3px;cursor:pointer';
      b.addEventListener('click', function () {
        if (st.done) { msg.textContent = '今天已经答过了，明天再来。'; return; }
        st.done = true;
        if (name === city.name) {
          const last = load();
          st.streak = (last && last.date === yesterday() && last.streak) ? last.streak + 1 : 1;
          st.correct = (st.correct || 0) + 1;
          msg.innerHTML = '对了 —— <b>' + city.name + '</b>。';
          if (window.Arcade) { Arcade.add(1); }
        } else {
          st.streak = 0;
          msg.innerHTML = '不是这里 —— 是 <b>' + city.name + '</b>。';
        }
        save(st);
        paintStreak();
        Array.prototype.forEach.call(box.children, function (x) {
          x.disabled = true;
          if (x.textContent === city.name) x.style.borderColor = 'var(--a1)';
        });
      });
      box.appendChild(b);
    });

    if (st.done) {
      msg.textContent = '今天已经答过了，明天再来。';
      Array.prototype.forEach.call(box.children, function (x) { x.disabled = true; });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
