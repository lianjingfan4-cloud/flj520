/* ============================================================
   i18n.js — 中英切换（同一个地址，顶栏那颗 EN）
   ------------------------------------------------------------
   做法：一张 中→英 表，按文本节点精确匹配替换。
   没收录的句子保持中文（不会出现乱码或半句）。
   动态生成的界面用 window.t('中文') 取译文。
   ============================================================ */
(function () {
  'use strict';

  const KEY = 'nova-lang';

  const DICT = {
    /* ---------- 全站 ---------- */
    '跳到正文': 'Skip to content',
    '回到主页': 'Back home',
    '← 回到主页': '← Back home',
    '房间': 'Room',
    '换一种光': 'Change the light',
    '颜色': 'Color',
    '风格': 'Style',
    '字体、圆角、质感。颜色变了，页面里的画也跟着变。': 'Type, radius, texture. Change the colors and the artwork follows.',
    '字体、圆角、质感。': 'Type, radius, texture.',
    '5 个色系 · 60 种颜色 · 10 种风格': '5 families · 60 colors · 10 styles',
    '右上角的小太阳 ✳ 有 60 种颜色、10 种风格': 'The little sun holds 60 colors and 10 styles',
    '简历': 'Résumé',
    '分享卡': 'Share card',

    /* ---------- 首页 ---------- */
    '你好，我是': "Hi, I'm",
    '走进来': 'Come in',
    '翻画册': 'Open the atlas',
    '坐标': 'Coordinates',
    '此刻': 'Right now',
    '眼睛': 'Eyes',
    '莫斯科': 'Moscow',
    '在算蜂窝夹层的等效': 'Sizing a honeycomb sandwich',
    '棕色。想是红的、蓝的、紫的。': 'Brown. I wish it were red, blue, purple.',
    '00 — 题记': '00 — EPIGRAPH',
    '—— 毛泽东《浪淘沙 · 北戴河》': '— Mao Zedong, “Langtaosha · Beidaihe”',
    '有人问我怎么一句话介绍自己，我想到的就是这几句。': 'When someone asks for one line about me, this is what comes to mind.',
    '01 — 我这个人': '01 — WHO I AM',
    '看着有点忧郁，': 'A little melancholy on the surface,',
    '其实什么都看得开。': 'and honestly, I let most things go.',
    '山东潍坊高密人，中共党员。学航空的。剩下的，你往下看。':
      'Born in Gaomi, Weifang, Shandong. CPC member. I study aerospace. The rest is below.',
    '深夜是我的白天。': 'Late night is my daytime.',
    '灵感通常在我准备睡觉的时候敲门。': 'Ideas usually knock when I am about to sleep.',
    '一个人可以被看见的方式有很多种。我选的这种，比较慢。':
      'There are many ways to be seen. I picked a slow one.',
    '— 关于这个网站': '— About this site',
    '手里有什么': 'What I work with',
    '最直接的方式': 'The shortest way',
    '想聊聊山、火箭，或者让我帮你定位一张照片。':
      'Want to talk about mountains, rockets, or have me locate a photo?',
    '复刻': 'copy',
    '02 — 做过的事': '02 — WHAT I DID',
    '把喜欢的事，': 'Do the things you like,',
    '做到底。': 'all the way.',
    '从铝合金棒的一条裂纹，到两千人的一场晚会，我都在学同一件事：怎么把复杂的事做干净。':
      'From a crack in an aluminium bar to a night with two thousand people — I keep learning one thing: how to make the complicated look clean.',
    '学业 / 科研': 'STUDY / RESEARCH',
    '学生工作': 'STUDENT WORK',
    '实践 / 竞赛': 'PRACTICE / COMPETITION',
    '失败清单': 'FAILURE LOG',
    '考砸过几次，': 'I failed a few exams.',
    '也记住了。': 'I remember them too.',
    '成功清单谁都会写。这一页写的是没考好的。': 'Anyone can write a list of wins. This one is the losses.',
    '大学物理（一）': 'University Physics I',
    'C++ 程序设计': 'C++ Programming',
    '概率论': 'Probability Theory',
    '期末 30': 'final 30',
    '期末 33': 'final 33',
    '期末 25': 'final 25',
    '刚体转动那一章，我从头到尾没转过来。': 'Rigid-body rotation: I never got it to spin.',
    '指针。当时是真不懂，现在也是边写边查。': 'Pointers. I did not get them then; I still look them up now.',
    '最低的一次。后来做结构可靠性，才算补回来一点。':
      'My lowest. Structural reliability later paid some of it back.',
    '这三门后来都用上了 —— 物理在结构里，C++ 在这页网站里，概率在每次做实验的误差里。':
      'All three came back: physics in structures, C++ in this site, probability in every experiment’s error.',
    '书架 · 划过看一句': 'SHELF · HOVER FOR A LINE',
    '这些书': 'The books',
    '我读完了': 'I actually finished',
    '有的是记得一句，有的是还记得那个下午。': 'Some left a line, some left an afternoon.',
    '03 — 画册': '03 — ATLAS',
    '我把喜欢的，': 'The things I like,',
    '都画在这儿。': 'drawn here.',
    '这些不是图片，是代码画的线。所以你把整个网站换一个色系，它们就跟着换一种光 —— 永远和这一页是一伙的。':
      'Not images — lines of code. Change the palette and they change their light.',
    '进去看看': 'Step inside',
    '04 — 找我': '04 — SAY HI',
    '有话直说，': 'Just say it,',
    '不用客气。': 'no need to be polite.',
    '山东高密人。现在在上海，偶尔回莫斯科看看雪。':
      'From Gaomi, Shandong. Now in Shanghai; occasionally back to Moscow for the snow.',
    '微信 · 同手机号': 'WeChat · same as phone',
    'B 站': 'Bilibili',
    '学院公示': 'Faculty notice',

    '上海交大 · 飞行器设计 · 2025.3–2026.7 在莫斯科': 'SJTU · Aircraft Design · 2025.3–2026.7 in Moscow',
    '山东高密人。本科最后一年半在莫斯科航空学院（2025.3–': 'From Gaomi, Shandong. My last eighteen months of undergrad were at Moscow Aviation Institute (2025.3–',
    '），现在在上海交大读飞行器设计。': '); now I read aircraft design at Shanghai Jiao Tong.',
    '喜欢陡峭的山、极光、星空，和那些蛮不讲理的苏联老海报。': 'I like steep mountains, aurora, starry skies, and old Soviet posters that do not ask for permission.',
    '棕色': 'Brown.',
    '想是红的、蓝的、紫的': 'I wish red, blue, purple.',
    '右上角的小太阳 ☀ 有 60 种颜色、10 种风格': 'The little sun up there holds 60 colors and 10 styles',
    '上海': 'Shanghai',
    '莫斯科': 'Moscow',
    '晴': 'clear', '阴': 'overcast', '雨': 'rain', '雪': 'snow',

    /* ---------- 拾趣 ---------- */
    '拾趣 · ODDMENTS': 'ODDMENTS',
    '自己写的小东西，': 'Little things I wrote,',
    '摆在这儿。': 'kept here.',
    '不是作品集，是杂物间。一堆自己写的东西，加上十几本书。': 'Not a portfolio — a junk room. A pile of things I wrote, plus a dozen books.',
    '全部可以点开，全部是手写的 —— 没有模板。': 'All of them open. All hand-written — no templates.',
    '01 — HTML 作品': '01 — HTML WORKS',
    '这些': 'These',
    '都能玩': 'all playable',
    '每一个都是单个 HTML 文件，打开就能用，不联网也行。': 'Each is a single HTML file. Open it, it works offline.',
    '打开 →': 'Open →',
    '下去 →': 'Descend →',
    '起航 →': 'Set sail →',
    '拆开 →': 'Unpack →',
    '进去 →': 'Enter →',
    '查案 →': 'Investigate →',
    '活下去 →': 'Survive →',
    '出题 →': 'Generate →',
    '看回放 →': 'Watch →',
    '来一局 →': 'Play →',
    '点火 →': 'Launch →',
    '试试 →': 'Try →',
    '02 — 书': '02 — BOOKS',
    '笔名叫': 'I write as',
    '写了十几本长篇，都在番茄小说上。': 'A dozen novels, all on Fanqie.',
    '去番茄读 →': 'Read on Fanqie →',
    '其它': 'Others',
    '在番茄搜「寒砚清」，作者页里有全部作品。': 'Search “寒砚清” on Fanqie — every book is on the author page.',

    /* ---------- 画册 ---------- */
    '画册 · ATLAS': 'ATLAS',
    '九幅真画，全部来自大都会博物馆的开放版权藏品。换一个色系，灯光跟着换，画还是那幅画。':
      'Nine real paintings, all open-access from The Met. Change the palette and the light changes; the painting stays.',
    '抽一张': 'Draw one',
    '四种字体': 'Four fonts',
    '纸纹': 'Paper',
    '网点': 'Halftone',
    '只看收藏': 'Favorites only',
    '你可能会想的一句话': 'A line you might think',
    '这幅配的色': 'Colors for this plate',
    '收藏': 'Save',
    '已收藏': 'Saved',
    '照片 · 拾趣': 'PHOTOS',
    '这面墙，': 'This wall,',
    '等你的照片': 'waiting for your photos',
    '相册': 'Album',
    '照片墙': 'Wall',
    '随便看一张': 'Random one',
    '再看一些': 'Load more',
    '按颜色': 'By color',
    '红': 'Red', '橙': 'Orange', '黄': 'Yellow', '绿': 'Green',
    '青': 'Cyan', '蓝': 'Blue', '紫': 'Purple', '粉': 'Pink',
    '全部': 'All',
    '上一组': '← Prev',
    '下一组': 'Next →',
    '随机一组': 'Shuffle',

    /* ---------- 图寻 / 游戏 ---------- */
    '图寻 · GEOGUESS': 'GEOGUESS',
    '得分': 'Score',
    '最高': 'Best',
    '命': 'Lives',
    '开始': 'Start',
    '暂停': 'Pause',
    '播放': 'Play',
    '关闭': 'Close',
    '接住': 'Catch it',
    '，别掉': ', do not drop it',
    '乒乓': 'Ping-pong',
    '把卫星': 'Put the satellite',
    '送进窗口': 'through the window',
    '发射角': 'Angle',
    '推力': 'Thrust',
    '最佳': 'Best',
    '试了': 'Tries',
    '点一下，浇一滴。': 'Tap once, water once.',
    '水滴': 'Water',
    '鸡蛋': 'Eggs',
    '开花进度': 'Bloom',
    '合成小鸡': 'Merge chicks',
    '浇水': 'Water',
    '摸摸': 'Pet',
    '重种': 'Replant',

    /* ---------- 其它 ---------- */
    '字体实验室': 'Type Lab',
    '打几个字，看十种字体并排。站里那十种风格，就是这十种字。':
      'Type something. Ten faces, side by side. The ten styles on this site are these ten faces.',
    '密码本': 'Password book',
    '三处地方各有一句口令。走到过的，这里会记得。':
      'Three places hold a passphrase. This page remembers the ones you have reached.',
    '三个都齐了，最后那页才会亮。': 'When all three are here, the last part lights up.',
    '三个都在的时候': 'When all three are here',
    '给二十年后的我：': 'To me, twenty years from now:',
    '见字如晤。': 'I hope this finds you well.',
    '← 回到房间': '← Back to the room',
    '六天五夜，': 'Six days and five nights,',
    '窗外的雪一直没停': 'the snow outside never stopped',
    '保存为 PDF': 'Save as PDF',
    '← 回主页': '← Home'
  };

  function lang() {
    return document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'zh';
  }

  function translate(zh) {
    if (lang() !== 'en') return zh;
    return DICT[zh] || zh;
  }
  window.t = translate;

  const SKIP = /^(SCRIPT|STYLE|CODE|PRE|KBD|SVG|NOSCRIPT)$/;

  function walk(root, fn) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        let p = node.parentNode;
        while (p && p !== root) {
          if (SKIP.test(p.tagName || '')) return NodeFilter.FILTER_REJECT;
          if (p.dataset && p.dataset.noI18n !== undefined) return NodeFilter.FILTER_REJECT;
          p = p.parentNode;
        }
        return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const list = [];
    while (w.nextNode()) list.push(w.currentNode);
    list.forEach(fn);
  }

  function applyTo(root, l) {
    walk(root, function (node) {
      if (node.__zh === undefined) node.__zh = node.nodeValue;
      if (l === 'en') {
        const key = node.__zh.trim();
        const hit = DICT[key];
        if (hit) {
          const lead = node.__zh.match(/^\s*/)[0];
          const tail = node.__zh.match(/\s*$/)[0];
          node.nodeValue = lead + hit + tail;
        } else {
          node.nodeValue = node.__zh;
        }
      } else {
        node.nodeValue = node.__zh;
      }
    });

    const els = root.querySelectorAll('[title],[aria-label],[placeholder],[alt]');
    Array.prototype.forEach.call(els, function (el) {
      ['title', 'aria-label', 'placeholder', 'alt'].forEach(function (a) {
        if (!el.hasAttribute(a)) return;
        const k = '__zh_' + a.replace('-', '_');
        if (el[k] === undefined) el[k] = el.getAttribute(a);
        if (l === 'en' && DICT[el[k].trim()]) el.setAttribute(a, DICT[el[k].trim()]);
        else el.setAttribute(a, el[k]);
      });
    });
  }

  function apply(l) {
    document.documentElement.setAttribute('lang', l === 'en' ? 'en' : 'zh-CN');
    document.documentElement.classList.toggle('is-en', l === 'en');
    applyTo(document.body, l);
    if (window.NavKit) window.NavKit.repaint();
    if (window.SettingsKit && window.SettingsKit.repaint) window.SettingsKit.repaint();
    window.dispatchEvent(new CustomEvent('langchange', { detail: l }));
  }

  function set(l) {
    try { localStorage.setItem(KEY, l); } catch (e) { }
    apply(l);
  }

  function init() {
    let l = 'zh';
    try {
      const q = new URLSearchParams(location.search).get('lang');
      const saved = localStorage.getItem(KEY);
      if (q === 'en' || (!q && saved === 'en')) l = 'en';
    } catch (e) { }
    if (l === 'en') apply('en');
    setTimeout(function () { if (lang() === 'en') applyTo(document.body, 'en'); }, 900);
  }

  window.I18n = {
    get: lang,
    set: set,
    toggle: function () { set(lang() === 'en' ? 'zh' : 'en'); },
    apply: apply,
    dict: DICT
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
