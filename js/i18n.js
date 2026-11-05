/* ============================================================
   i18n.js — 中英切换（同一个地址，顶栏那颗 EN）
   ------------------------------------------------------------
   英文用的是莎士比亚腔：thou / thee / -eth / 倒装。
   做法：一张 中→英 表，按文本节点精确匹配替换。
   没收录的句子保持中文（不会出现半句）。
   ============================================================ */
(function () {
  'use strict';

  const KEY = 'nova-lang';

  const DICT = {
    /* ---------- 全站 ---------- */
    '跳到正文': 'Skip unto the text',
    '回到主页': 'Return to the house',
    '← 回到主页': '← Return to the house',
    '房间': 'The Chamber',
    '换一种光': 'Change thy light',
    '颜色': 'Hue',
    '风格': 'Manner',
    '字体、圆角、质感。颜色变了，页面里的画也跟着变。':
      'Type, corner, grain. Alter the hues, and the pictures alter with them.',
    '字体、圆角、质感。': 'Type, corner, grain.',
    '5 个色系 · 60 种颜色 · 10 种风格': 'Five houses · sixty hues · ten manners',
    '右上角的小太阳 ✳ 有 60 种颜色、10 种风格':
      'Yon little sun above holds sixty hues and ten manners',
    '简历': 'Chronicle',
    '分享卡': 'A card to share',

    /* ---------- 首页 ---------- */
    '你好，我是': 'Hail, I am',
    '走进来': 'Enter, pray',
    '翻画册': 'Turn the atlas',
    '坐标': 'Where I stand',
    '此刻': 'At this hour',
    '眼睛': 'Mine eyes',
    '在算蜂窝夹层的等效': 'Reckoning a honeycomb’s like',
    '棕色。想是红的、蓝的、紫的。': 'Brown. Fain would I have them red, blue, violet.',
    '00 — 题记': '00 — EPIGRAPH',
    '—— 毛泽东《浪淘沙 · 北戴河》': '— Mao Zedong, “Langtaosha · Beidaihe”',
    '有人问我怎么一句话介绍自己，我想到的就是这几句。':
      'When one asks me for a single line of myself, these are the words that come.',
    '01 — 我这个人': '01 — WHAT MANNER OF MAN',
    '看着有点忧郁，': 'A little melancholy to the eye,',
    '其实什么都看得开。': 'yet suffer I most things to pass.',
    '山东潍坊高密人，中共党员。学航空的。剩下的，你往下看。':
      'Born in Gaomi of Weifang, Shandong; a member of the Party. I study the flying craft. The rest lieth below.',
    '深夜是我的白天。': 'The deep of night is my day.',
    '灵感通常在我准备睡觉的时候敲门。':
      'Inspiration is wont to knock when I make ready for sleep.',
    '一个人可以被看见的方式有很多种。我选的这种，比较慢。':
      'Many are the ways a man may be seen. The one I chose is slow.',
    '— 关于这个网站': '— Touching this house of pages',
    '手里有什么': 'What I have in hand',
    '最直接的方式': 'The shortest way',
    '想聊聊山、火箭，或者让我帮你定位一张照片。':
      'Wouldst speak of mountains, of rockets, or have me find where a photograph was taken?',
    '复刻': 'copy',
    '02 — 做过的事': '02 — WHAT I HAVE DONE',
    '把喜欢的事，': 'What thou lovest,',
    '做到底。': 'do it unto the end.',
    '从铝合金棒的一条裂纹，到两千人的一场晚会，我都在学同一件事：怎么把复杂的事做干净。':
      'From a crack in an aluminium rod unto a night of two thousand souls, I learn but one thing: how to make the tangled clean.',
    '学业 / 科研': 'STUDY / DISCOVERY',
    '学生工作': 'SERVICE',
    '实践 / 竞赛': 'PRACTICE / CONTEST',
    '失败清单': 'A LEDGER OF FAILURES',
    '考砸过几次，': 'Certain examinations I failed,',
    '也记住了。': 'and remember them still.',
    '成功清单谁都会写。这一页写的是没考好的。':
      'Any man can write his triumphs. This page writeth the rest.',
    '大学物理（一）': 'Natural Philosophy, First Part',
    'C++ 程序设计': 'The Craft of C++',
    '概率论': 'Of Chances',
    '期末 30': 'at the end, 30',
    '期末 33': 'at the end, 33',
    '期末 25': 'at the end, 25',
    '刚体转动那一章，我从头到尾没转过来。':
      'The chapter upon the turning of bodies: never once did it turn for me.',
    '指针。当时是真不懂，现在也是边写边查。':
      'Pointers. I understood them not then; even now I write and look them up.',
    '最低的一次。后来做结构可靠性，才算补回来一点。':
      'My lowest. Structural reliability hath since repaid a little of it.',
    '这三门后来都用上了 —— 物理在结构里，C++ 在这页网站里，概率在每次做实验的误差里。':
      'All three returned to me: philosophy in the structures, C++ in these pages, chance in every error of the bench.',
    '书架 · 划过看一句': 'THE SHELF · HOVER FOR A LINE',
    '这些书': 'These books',
    '我读完了': 'I have finished',
    '有的是记得一句，有的是还记得那个下午。':
      'Some left me a line; some left me an afternoon.',
    '03 — 画册': '03 — THE ATLAS',
    '我把喜欢的，': 'The things I love,',
    '都画在这儿。': 'are drawn herein.',
    '这些不是图片，是代码画的线。所以你把整个网站换一个色系，它们就跟着换一种光 —— 永远和这一页是一伙的。':
      'No pictures these, but lines of code. Change thou the hue of the whole house, and they take a new light with it.',
    '进去看看': 'Step within',
    '04 — 找我': '04 — SEEK ME',
    '有话直说，': 'Speak plainly,',
    '不用客气。': 'let courtesy alone.',
    '山东高密人。现在在上海，偶尔回莫斯科看看雪。':
      'Of Gaomi in Shandong. Now in Shanghai; now and then to Moscow, to look upon the snow.',
    '微信 · 同手机号': 'WeChat · the same as my number',
    'B 站': 'Bilibili',
    '学院公示': 'A notice of the faculty',

    '上海交大 · 飞行器设计 · 2025.3–2026.7 在莫斯科': 'Shanghai Jiao Tong · the craft of flying · 2025.3–2026.7 in Moscow',
    '山东高密人。本科最后一年半在莫斯科航空学院（2025.3–': 'Of Gaomi in Shandong. My last year and a half of study was at the Moscow Aviation Institute (2025.3–',
    '），现在在上海交大读飞行器设计。': '); now I read the craft of flying at Shanghai Jiao Tong.',
    '喜欢陡峭的山、极光、星空，和那些蛮不讲理的苏联老海报。': 'I love steep mountains, the northern lights, the stars, and old Soviet posters that ask no leave.',
    '棕色': 'Brown.',
    '想是红的、蓝的、紫的': 'fain would I have them red, blue, violet',
    '右上角的小太阳 ☀ 有 60 种颜色、10 种风格': 'Yon little sun above holds sixty hues and ten manners',
    '上海': 'Shanghai',
    '晴': 'clear', '阴': 'overcast', '雨': 'rain', '雪': 'snow',

    /* ---------- 拾趣 ---------- */
    '拾趣 · ODDMENTS': 'TRIFLES',
    '自己写的小东西，': 'Little things I have written,',
    '摆在这儿。': 'set down here.',
    '不是作品集，是杂物间。一堆自己写的东西，加上十几本书。':
      'No portfolio, but a lumber-room: a heap of my own making, and a dozen books.',
    '全部可以点开，全部是手写的 —— 没有模板。':
      'All may be opened; all are hand-wrought — no pattern was taken.',
    '01 — HTML 作品': '01 — WORKS IN HTML',
    '这些': 'These',
    '都能玩': 'all may be played',
    '每一个都是单个 HTML 文件，打开就能用，不联网也行。':
      'Each is one file of HTML; open it and it serveth, even without the net.',
    '打开 →': 'Open →',
    '下去 →': 'Descend →',
    '起航 →': 'Set sail →',
    '拆开 →': 'Unpack →',
    '进去 →': 'Enter →',
    '查案 →': 'Enquire →',
    '活下去 →': 'Endure →',
    '出题 →': 'Set a riddle →',
    '看回放 →': 'Behold →',
    '来一局 →': 'Play a bout →',
    '点火 →': 'Light the fire →',
    '试试 →': 'Try it →',
    '02 — 书': '02 — BOOKS',
    '写了十几本长篇，都在番茄小说上。':
      'Some dozen long tales, all upon Fanqie.',
    '去番茄读 →': 'Read on Fanqie →',
    '其它': 'Others',
    '在番茄搜「寒砚清」，作者页里有全部作品。':
      'Search “寒砚清” upon Fanqie; all my works wait upon the author’s page.',

    /* ---------- 创意 ---------- */
    '创意 · EXPERIMENTS': 'DEVICES',
    '算完结构之后，': 'When the sums are done,',
    '我还想做点什么。': 'I would yet make something.',
    '这里不放游戏（那些在拾趣），放的是实验、模拟和写了一半的工具。':
      'No games here (those dwell in Trifles), but experiments, simulations, and tools half-begun.',
    '有的是网页，有的是脚本，有的只有一张表。':
      'Some are pages, some are scripts, and some but a single table.',
    '代码项目 · 未做成网页': 'A code project · not yet a page',
    '文档 · 未整理': 'Documents · not yet ordered',
    '文档 · 未做成网页': 'Documents · not yet a page',
    '项目 · 部分素材未公开': 'A project · some matter not made public',

    /* ---------- 写作 ---------- */
    '写作 · FICTION': 'WRITINGS',
    '我还有一个名字，': 'I bear another name,',
    '白天算结构，晚上写小说。写了十几本，都在番茄小说上。':
      'By day I reckon structures; by night I write tales. A dozen and more, all upon Fanqie.',
    '《镜淵書》是最近完结的一本 —— 七章，一万八千字。':
      '《镜淵書》 is the last of them — seven chapters, eighteen thousand words.',

    /* ---------- 画册 ---------- */
    '画册 · ATLAS': 'THE ATLAS',
    '九幅真画，全部来自大都会博物馆的开放版权藏品。换一个色系，灯光跟着换，画还是那幅画。':
      'Nine true paintings, all from the open holdings of the Met. Change the hue, and the light changes; the painting abideth.',
    '抽一张': 'Draw one',
    '四种字体': 'Four faces',
    '纸纹': 'Paper',
    '网点': 'Stipple',
    '只看收藏': 'Only what I keep',
    '你可能会想的一句话': 'A line thou mightest think',
    '这幅配的色': 'The hues that serve it',
    '收藏': 'Keep',
    '已收藏': 'Kept',
    '照片 · 拾趣': 'PHOTOGRAPHS',
    '这面墙，': 'This wall,',
    '等你的照片': 'awaiteth thy pictures',
    '相册': 'Album',
    '照片墙': 'The wall',
    '随便看一张': 'Any one at hazard',
    '再看一些': 'A few more',
    '按颜色': 'By hue',
    '红': 'Red', '橙': 'Orange', '黄': 'Yellow', '绿': 'Green',
    '青': 'Cyan', '蓝': 'Blue', '紫': 'Purple', '粉': 'Pink',
    '全部': 'All',
    '上一组': '← The former',
    '下一组': 'The next →',
    '随机一组': 'At hazard',

    /* ---------- 图寻 / 游戏 ---------- */
    '图寻 · GEOGUESS': 'GEOGUESS',
    '这是': 'Where',
    '哪儿': 'is this',
    '得分': 'Score',
    '最高': 'Best',
    '命': 'Lives',
    '开始': 'Begin',
    '暂停': 'Stay',
    '播放': 'Play',
    '关闭': 'Close',
    '接住': 'Catch it',
    '，别掉': ', let it not fall',
    '乒乓': 'The little ball',
    '把卫星': 'Send the moon’s companion',
    '送进窗口': 'through the window',
    '发射角': 'The angle',
    '推力': 'The thrust',
    '最佳': 'Best',
    '试了': 'Tried',
    '点一下，浇一滴。': 'Touch once, and one drop falleth.',
    '水滴': 'Drops',
    '鸡蛋': 'Eggs',
    '开花进度': 'Toward bloom',
    '合成小鸡': 'Join two chicks',
    '浇水': 'Water it',
    '摸摸': 'Stroke it',
    '重种': 'Plant anew',

    /* ---------- 其它 ---------- */
    '字体实验室': 'The Type Chamber',
    '打几个字，看十种字体并排。站里那十种风格，就是这十种字。':
      'Write a few words, and behold ten faces in a row. The ten manners of this house are these ten.',
    '密码本': 'The book of pass-words',
    '三处地方各有一句口令。走到过的，这里会记得。':
      'Three places keep a pass-word each. What thou hast reached, this page remembereth.',
    '三个都齐了，最后那页才会亮。': 'When all three are come, the last leaf shall shine.',
    '三个都在的时候': 'When the three are together',
    '给二十年后的我：': 'Unto myself, twenty years hence:',
    '见字如晤。': 'I hope this finds thee well.',
    '← 回到房间': '← Back to the chamber',
    '六天五夜，': 'Six days and five nights,',
    '窗外的雪一直没停': 'the snow without never ceased',
    '保存为 PDF': 'Save as PDF',
    '← 回主页': '← Home',
    '不留余地': 'No quarter',
    '先动手再谈': 'Strike, then talk',
    '能不打就不打': 'Avoids a fight',
    '从不主动出手': 'Never strikes first',
    '关起门来': 'Doors shut',
    '互相做生意': 'Trade with each other',
    '所有人都做买卖': 'Everyone trades',
    '毁灭性的': 'Destructive',
    '一波接着一波': 'One after another',
    '偶尔来一次': 'Now and then',
    '几乎风平浪静': 'Almost calm',
    '先顾自己': 'Self first',
    '各干各的': 'Each to their own',
    '先帮别人': 'Others first',
    '大家愿意搭伙': 'Willing to pool together',
    '长期停滞': 'Stagnant for long',
    '进展艰难': 'Progress is hard',
    '几乎失控地快': 'Almost out of control',
    '进步很快': 'It learns quickly',
    '一切都紧缺': 'Everything is scarce',
    '够用，但不宽裕': 'Enough, not plenty',
    '略有盈余': 'A little to spare',
    '什么都不缺': 'Nothing is missing',
    '残酷': 'Brutal',
    '好战': 'Warlike',
    '温和扩张': 'Mild expansion',
    '和平': 'Pacifist',
    '贸易封闭': 'Closed trade',
    '贸易开放': 'Open trade',
    '贸易狂热': 'Trade frenzy',
    '灾害极端': 'Extreme disaster',
    '灾害多': 'Many disasters',
    '灾害少': 'Few disasters',
    '灾害极少': 'Almost no disaster',
    '自利': 'Selfish',
    '低度合作': 'Low cooperation',
    '利他': 'Altruistic',
    '高度合作': 'High cooperation',
    '技术低迷': 'Stagnant tech',
    '技术缓慢': 'Slow tech',
    '技术飞快': 'Fast tech',
    '技术狂飙': 'Tech rush',
    '资源匮乏': 'Scarce',
    '资源偏少': 'Low',
    '资源富足': 'Rich',
    '资源丰沛': 'Abundant',
    '回首页吧，那边路比较清楚。': 'Go back home — the roads are clearer there.',
    '可能是链接过期了，也可能我从没写过。': 'Perhaps the link expired. Perhaps I never wrote it.',
    '这页不在': 'This page is not here',
    '回到主页 →': '← Back to the house',
    '每次打开都换一批': 'A fresh batch on every visit',
    '本，每次刷新换一批。': ' books, a new batch each refresh.',
    '里还有': ' more inside — a new batch each visit.',
    '铁砚录按上、下两卷算。十二本都接上了。': 'Tie Yan Lu counts as two volumes, upper and lower. All twelve are now linked.',
    '和番茄上那些不是一路。这套是写给胆子大一点的读者的 —— 十三到二十四册，点一下直接下载，Word 打开就能看。': 'Not the same road as the Fanqie books. These are for braver readers — volumes thirteen to twenty-four, download and open in Word.',
    '下载 ↓': 'Download ↓',
    '原作停在第十二册。后面这十二册是我接着往下写的 —— 写给胆子大一点的读者，点一下直接下载。': 'The originals stop at volume twelve. These twelve are my continuation — for readers with a little more nerve. One click to download.',
    '十二册续篇': 'twelve more volumes',
    '接着往下写：': 'Carrying on: ',
    '03 — 潘宫的秘密 · 续写': '03 — THE SECRET OF PAN PALACE · CONTINUED',
    '（原作，司徒平安）': '(originals, by Situ Ping’an)',
    '插图提示词总表': 'Illustration prompt index',
    '潘宫的秘密 · 人物志': 'The Secret of Pan Palace · Who’s Who',
    '另附：': 'Also included: ',
    '我把它们收在这里，是因为后面那十二册是从这儿长出来的。': 'I keep them here because the twelve that follow grew out of them.',
    '这套不是我写的 —— 是司徒平安的原作。带插图，一本六到九兆，Word 打开就能看。': 'These are not mine — they are Situ Ping’an’s originals. Illustrated, six to nine megabytes each, open them in Word.',
    '十二册': 'twelve volumes',
    '的': '',
    '02 — 潘宫的秘密 · 原作': '02 — THE SECRET OF PAN PALACE · ORIGINAL',
    '种': 'kinds',
    '从和平到残酷。': 'From peace to cruelty.',
    '扩张': 'Expansion',
    '开门做生意，还是关起门来。': 'Open the doors, or close them.',
    '贸易': 'Trade',
    '天灾频率，从平静到毁灭。': 'How often the sky falls — from calm to ruin.',
    '灾害': 'Disaster',
    '愿意搭伙，还是各干各的。': 'Willing to share, or each to their own.',
    '合作': 'Cooperation',
    '技术快慢，决定它长得像什么。': 'How fast it learns decides what it becomes.',
    '技术': 'Technology',
    '从丰沛到匮乏，看文明怎么被物产决定。': 'From plenty to scarcity — watch a civilisation be decided by what it has.',
    '资源': 'Resources',
    '所有参数取中间值，用来对照。': 'Every dial at the middle, kept for comparison.',
    '基线': 'Baseline',
    '同一个引擎，二十四种参数。资源、技术、合作、灾害、贸易、侵略 —— 每换一个旋钮，那个文明就长成另一副样子。点开任何一个，是一段完整的、从头到尾的回放。': 'One engine, twenty-four settings. Resources, tech, cooperation, disaster, trade, aggression — turn one dial and the civilisation grows a different face. Any one of them opens a full replay, start to finish.',
    '不一样的路': 'different roads',
    '二十四条': 'Twenty-four',
    '文明模拟 · 回放库': 'CIVILISATION SIM · REPLAYS',
    '这个筛选下没有故事': 'No story under this filter',
    '没有匹配的故事。': 'No story matches.',
    '颗星': ' stars',
    '鼠标划过星链，会有微光跟过去 —— 那是我在写的时候心里那点光。': 'Move the pointer along the chain and a faint light follows — that is the little light I had while writing.',
    '点星链上的任意一颗星，或者按「抽一颗」。': 'Touch any star on the chain, or press “Draw one”.',
    '还没有选中': 'Nothing chosen yet',
    '找一句话、一个词…': 'Find a line, find a word…',
    '抽一颗 ✦': 'Draw one ✦',
    '目标是四百到五百颗 —— 现在还只是开头。': 'The aim is four or five hundred. This is only the beginning.',
    '每一个小故事都是一颗星，挂在同一条链上。抽一颗，或者自己在星链上找。': 'Every little story is a star, hung upon the same chain. Draw one, or go looking.',
    '捞一颗星': 'one star at a time',
    '从海里': 'Fished from the sea,',
    '故事 · 瀚海撷星': 'STORIES · GATHERING STARS'
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
          if (p.dataset && (p.dataset.noI18n !== undefined)) return NodeFilter.FILTER_REJECT;
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
