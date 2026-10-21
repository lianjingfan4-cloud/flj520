/* ============================================================
   art.js — 画册
   ------------------------------------------------------------
   所有画都是手写 SVG，颜色只用 var(--fg) / --a1 --a2 --a3 / --bg。
   于是：换任何色系、任何颜色，画会自动跟着变，永远协调。
   （这是你定的规矩：牺牲自由度，换永远不突兀。）
   加一幅画 = 往 PLATES 里加一个对象。
   ============================================================ */
(function () {
  'use strict';

  const PLATES = [
    /* ---------------------------------------------------------- */
    {
      id: 'sky', title: '夜空', en: 'Night Sky', tone: '背景', hidden: true,
      note: '首页的背景。只有星、极光和一道很远的山脊。',
      svg: `<svg viewBox="0 0 600 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <linearGradient id="sk-a" x1="0" y1="0" x2="1" y2="0.6">
      <stop offset="0" stop-color="var(--a1)" stop-opacity="0"/>
      <stop offset="0.34" stop-color="var(--a1)" stop-opacity=".42"/>
      <stop offset="0.72" stop-color="var(--a2)" stop-opacity=".32"/>
      <stop offset="1" stop-color="var(--a2)" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="sk-moon">
      <stop offset="0" stop-color="var(--a3)" stop-opacity=".4"/>
      <stop offset="1" stop-color="var(--a3)" stop-opacity="0"/>
    </radialGradient>
    <filter id="sk-blur" x="-20%" y="-40%" width="140%" height="180%">
      <feGaussianBlur stdDeviation="16"/>
    </filter>
  </defs>

  <g fill="var(--fg)" opacity=".6">
    <circle cx="72" cy="88" r="1.5"/><circle cx="146" cy="42" r="1"/><circle cx="214" cy="118" r="1.3"/>
    <circle cx="286" cy="66" r="1"/><circle cx="352" cy="132" r="1.5"/><circle cx="418" cy="58" r="1.1"/>
    <circle cx="486" cy="96" r="1.3"/><circle cx="556" cy="46" r="1"/><circle cx="530" cy="182" r="1.2"/>
    <circle cx="112" cy="212" r="1"/><circle cx="196" cy="252" r="1.2"/><circle cx="300" cy="206" r="1"/>
    <circle cx="392" cy="238" r="1"/><circle cx="470" cy="286" r="1.3"/><circle cx="60" cy="330" r="1"/>
    <circle cx="580" cy="330" r="1.1"/><circle cx="244" cy="330" r=".9"/><circle cx="512" cy="386" r="1"/>
  </g>

  <circle cx="486" cy="150" r="46" fill="url(#sk-moon)"/>
  <circle cx="486" cy="150" r="16" fill="none" stroke="var(--a3)" stroke-width="1.1" opacity=".7"/>

  <g filter="url(#sk-blur)" opacity=".95">
    <path d="M-40,300 C120,210 240,360 380,270 C480,204 560,290 660,240 L660,420 C520,450 420,360 300,430 C180,500 80,410 -40,470 Z" fill="url(#sk-a)"/>
  </g>

  <path d="M-20,600 L90,520 L160,570 L250,500 L330,580 L420,530 L510,600 L620,556 L620,780 L-20,780 Z"
        fill="var(--fg)" opacity=".06"/>
  <path d="M-20,600 L90,520 L160,570 L250,500 L330,580 L420,530 L510,600 L620,556"
        fill="none" stroke="var(--fg)" stroke-width="1" opacity=".16"/>
</svg>`
    },

    /* ---------------------------------------------------------- */
    {
      id: 'peaks', title: '柏树', en: 'Cypresses', tone: '梵高 · 1889', photo: 'assets/art/m437980.jpg', year: 1889, whisper: '这些树看起来像在往上烧。', pal: 'moss-noir',
      note: '雪线以上没有信号，只有风和光。我想去那儿站一会儿。',
      svg: `<svg viewBox="0 0 600 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <linearGradient id="pk-a" x1="0" y1="0" x2="1" y2="0.5">
      <stop offset="0" stop-color="var(--a1)" stop-opacity="0"/>
      <stop offset="0.3" stop-color="var(--a1)" stop-opacity=".6"/>
      <stop offset="0.66" stop-color="var(--a2)" stop-opacity=".5"/>
      <stop offset="1" stop-color="var(--a2)" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="pk-m1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="var(--fg)" stop-opacity=".22"/>
      <stop offset="1" stop-color="var(--fg)" stop-opacity=".05"/>
    </linearGradient>
    <linearGradient id="pk-m2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="var(--fg)" stop-opacity=".48"/>
      <stop offset="1" stop-color="var(--fg)" stop-opacity=".16"/>
    </linearGradient>
    <linearGradient id="pk-m3" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="var(--fg)" stop-opacity=".85"/>
      <stop offset="1" stop-color="var(--fg)" stop-opacity=".4"/>
    </linearGradient>
    <radialGradient id="pk-glow">
      <stop offset="0" stop-color="var(--a3)" stop-opacity=".45"/>
      <stop offset="1" stop-color="var(--a3)" stop-opacity="0"/>
    </radialGradient>
    <filter id="pk-blur" x="-20%" y="-40%" width="140%" height="180%">
      <feGaussianBlur stdDeviation="14"/>
    </filter>
  </defs>

  <g fill="var(--fg)" opacity=".75">
    <circle cx="62" cy="96" r="1.7"/><circle cx="128" cy="52" r="1.1"/><circle cx="188" cy="120" r="1.4"/>
    <circle cx="246" cy="70" r="1"/><circle cx="318" cy="112" r="1.6"/><circle cx="372" cy="58" r="1.1"/>
    <circle cx="520" cy="86" r="1.3"/><circle cx="566" cy="150" r="1"/><circle cx="420" cy="196" r="1.2"/>
    <circle cx="96" cy="210" r="1"/><circle cx="170" cy="250" r="1.5"/><circle cx="284" cy="206" r="1"/>
    <circle cx="540" cy="268" r="1.4"/><circle cx="38" cy="330" r="1"/><circle cx="600" cy="330" r="1.2"/>
  </g>

  <circle cx="452" cy="132" r="72" fill="url(#pk-glow)"/>
  <circle cx="452" cy="132" r="30" fill="var(--bg)" stroke="var(--a3)" stroke-width="1.3" opacity=".9"/>

  <g filter="url(#pk-blur)" opacity=".9">
    <path d="M-40,236 C120,146 240,296 380,206 C480,140 560,226 660,176 L660,306 C520,336 420,246 300,316 C180,386 80,296 -40,356 Z" fill="url(#pk-a)"/>
    <path d="M-40,306 C140,256 260,366 420,296 C520,250 590,326 660,296 L660,392 C520,422 400,342 280,412 C160,482 60,392 -40,442 Z" fill="url(#pk-a)" opacity=".62"/>
  </g>

  <path d="M-20,486 L118,332 L198,412 L288,300 L378,422 L468,352 L558,442 L620,402 L620,780 L-20,780 Z" fill="url(#pk-m1)"/>
  <path d="M-20,572 L88,432 L168,502 L268,392 L358,508 L448,458 L538,542 L620,512 L620,780 L-20,780 Z" fill="url(#pk-m2)"/>
  <path d="M-20,660 L138,472 L228,572 L300,502 L398,642 L498,582 L620,692 L620,780 L-20,780 Z" fill="url(#pk-m3)"/>

  <path d="M138,472 L172,516 L152,520 L188,560 L148,546 L118,584 L96,536 L120,524 Z" fill="var(--bg)" opacity=".3"/>
  <path d="M300,502 L330,540 L312,544 L344,580 L308,566 L282,600 L262,556 L286,546 Z" fill="var(--bg)" opacity=".22"/>

  <g fill="var(--fg)">
    <circle cx="486" cy="606" r="4.2"/>
    <path d="M482.6,611 h7 l1.4,17 h-9.8 z"/>
    <path d="M481,616 l-6,11" stroke="var(--fg)" stroke-width="2.6" stroke-linecap="round" fill="none"/>
    <path d="M490,616 l6,10" stroke="var(--fg)" stroke-width="2.6" stroke-linecap="round" fill="none"/>
  </g>
</svg>`
    },

    /* ---------------------------------------------------------- */
    {
      id: 'eye', title: '自画像', en: 'Self-Portrait', tone: '梵高 · 1887', photo: 'assets/art/m436532.jpg', year: 1887, whisper: '他画自己的时候，比画麦田还狠。', pal: 'copper',
      note: '我的眼睛是棕色的。但如果可以选，我想是红的、蓝的、紫的 —— 绿的就不必了。',
      svg: `<svg viewBox="0 0 600 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <radialGradient id="ey-i" cx="0.42" cy="0.34" r="0.78">
      <stop offset="0" stop-color="var(--a1)"/>
      <stop offset="0.52" stop-color="var(--a2)"/>
      <stop offset="1" stop-color="var(--a3)"/>
    </radialGradient>
    <radialGradient id="ey-glow">
      <stop offset="0" stop-color="var(--a1)" stop-opacity=".35"/>
      <stop offset="1" stop-color="var(--a1)" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <ellipse cx="300" cy="380" rx="250" ry="170" fill="url(#ey-glow)"/>

  <path d="M62,384 C158,252 442,252 538,384 C442,516 158,516 62,384 Z"
        fill="none" stroke="var(--fg)" stroke-width="2.2" opacity=".85"/>
  <path d="M78,392 C170,282 430,282 522,392" fill="none" stroke="var(--fg)" stroke-width="1" opacity=".35"/>

  <circle cx="300" cy="384" r="118" fill="url(#ey-i)" opacity=".92"/>
  <g stroke="var(--fg)" stroke-width="1" opacity=".4" fill="none">
    <circle cx="300" cy="384" r="96"/>
    <circle cx="300" cy="384" r="72"/>
  </g>
  <circle cx="300" cy="384" r="46" fill="var(--bg)"/>
  <circle cx="300" cy="384" r="46" fill="none" stroke="var(--a3)" stroke-width="1.2" opacity=".45"/>
  <circle cx="276" cy="356" r="14" fill="var(--fg)" opacity=".55"/>
  <circle cx="324" cy="410" r="5" fill="var(--fg)" opacity=".3"/>

  <g stroke="var(--fg)" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".9">
    <path d="M96,344 l-22,-30"/><path d="M140,306 l-14,-34"/><path d="M192,282 l-6,-36"/>
    <path d="M248,268 l2,-34"/><path d="M304,264 l8,-32"/><path d="M360,272 l14,-32"/>
    <path d="M414,292 l20,-30"/><path d="M466,322 l26,-26"/>
  </g>
  <g stroke="var(--fg)" stroke-width="1.6" stroke-linecap="round" fill="none" opacity=".45">
    <path d="M120,424 q20,8 40,4"/><path d="M440,428 q22,4 42,-6"/>
  </g>
</svg>`
    },

    /* ---------------------------------------------------------- */
    {
      id: 'soviet', title: '苏格拉底之死', en: 'The Death of Socrates', tone: '大卫 · 1787', photo: 'assets/art/m436105.jpg', year: 1787, whisper: '死之前，他还在跟人辩论。', pal: 'graphite',
      note: '那些老的苏联海报有一种蛮不讲理的力量：一块红、一个星、一条斜线，就够了。',
      svg: `<svg viewBox="0 0 600 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <linearGradient id="sv-beam" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" stop-color="var(--a1)" stop-opacity=".95"/>
      <stop offset="1" stop-color="var(--a1)" stop-opacity=".15"/>
    </linearGradient>
    <radialGradient id="sv-glow">
      <stop offset="0" stop-color="var(--a3)" stop-opacity=".5"/>
      <stop offset="1" stop-color="var(--a3)" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <circle cx="430" cy="210" r="150" fill="url(#sv-glow)"/>
  <circle cx="430" cy="210" r="118" fill="none" stroke="var(--a2)" stroke-width="2" opacity=".8"/>
  <circle cx="430" cy="210" r="128" fill="none" stroke="var(--a2)" stroke-width="1" opacity=".4"/>

  <path d="M-40,780 L640,236 L640,392 L-40,936 Z" fill="url(#sv-beam)"/>

  <path d="M430,132 l20,62 h66 l-53,40 20,62 -53-40 -53,40 20-62 -53-40 h66 z"
        fill="var(--a3)" opacity=".95"/>

  <g fill="var(--fg)" opacity=".92">
    <path d="M196,420 l24,150 -24,-26 -24,26 z" opacity=".28"/>
    <path d="M196,300 c14,0 26,12 26,28 v150 c0,10 -8,18 -18,18 h-16 c-10,0 -18,-8 -18,-18 v-150 c0,-16 12,-28 26,-28 z"/>
    <circle cx="196" cy="392" r="12" fill="var(--bg)" opacity=".85"/>
    <path d="M196,496 l-40,54 18,8 28,-34" opacity=".5"/>
    <path d="M196,496 l40,54 -18,8 -28,-34" opacity=".5"/>
    <path d="M186,506 q10,34 2,56" stroke="var(--a3)" stroke-width="4" fill="none" opacity=".9"/>
  </g>

  <g fill="var(--fg)" opacity=".26">
    <rect x="64" y="614" width="188" height="7"/>
    <rect x="64" y="634" width="132" height="7"/>
    <rect x="64" y="654" width="160" height="7"/>
  </g>
  <g fill="var(--a2)" opacity=".7">
    <rect x="64" y="700" width="46" height="46"/>
    <rect x="120" y="700" width="46" height="46" opacity=".5"/>
  </g>
</svg>`
    },

    /* ---------------------------------------------------------- */
    {
      id: 'wave', title: '神奈川冲浪里', en: 'The Great Wave', tone: '葛饰北斋 · 1831', photo: 'assets/art/m45434.jpg', year: 1831, whisper: '浪要落下来了，船上的人还在划。', pal: 'indigo',
      note: '浮世绘里的浪不是水，是一口气提起来又砸下去的东西。',
      svg: `<svg viewBox="0 0 600 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <linearGradient id="wv-body" x1="0" y1="1" x2="0.3" y2="0">
      <stop offset="0" stop-color="var(--a2)"/>
      <stop offset="1" stop-color="var(--a1)"/>
    </linearGradient>
    <radialGradient id="wv-sun">
      <stop offset="0" stop-color="var(--a3)" stop-opacity=".55"/>
      <stop offset="1" stop-color="var(--a3)" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <circle cx="446" cy="196" r="96" fill="url(#wv-sun)"/>
  <circle cx="446" cy="196" r="50" fill="var(--a3)" opacity=".9"/>

  <path d="M-20,640 C60,470 200,404 330,494 C424,558 480,506 524,452 C566,402 610,410 640,444 L640,800 L-20,800 Z"
        fill="url(#wv-body)" opacity=".92"/>
  <path d="M-20,700 C120,596 250,652 366,706 C478,758 566,706 640,730 L640,800 L-20,800 Z"
        fill="var(--fg)" opacity=".22"/>

  <g fill="var(--bg)" opacity=".9">
    <circle cx="330" cy="490" r="13"/><circle cx="352" cy="470" r="9"/><circle cx="372" cy="492" r="7"/>
    <circle cx="306" cy="474" r="8"/><circle cx="316" cy="512" r="6"/><circle cx="284" cy="500" r="5"/>
    <circle cx="392" cy="474" r="5"/><circle cx="410" cy="492" r="4"/><circle cx="262" cy="516" r="5"/>
    <circle cx="240" cy="532" r="4"/><circle cx="428" cy="476" r="3.4"/>
  </g>
  <g fill="var(--bg)" opacity=".55">
    <circle cx="352" cy="510" r="4"/><circle cx="288" cy="536" r="3.4"/><circle cx="386" cy="520" r="3"/>
    <circle cx="470" cy="512" r="4"/><circle cx="500" cy="536" r="3"/>
  </g>

  <path d="M-20,690 q80,-30 160,0 t160,0 t160,0 t160,0" fill="none" stroke="var(--bg)" stroke-width="2" opacity=".45"/>
  <path d="M-20,720 q80,-26 160,0 t160,0 t160,0 t160,0" fill="none" stroke="var(--bg)" stroke-width="1.6" opacity=".28"/>

  <path d="M470,300 l16,54 h-32 z" fill="var(--fg)" opacity=".5"/>
  <path d="M470,354 q-10,22 -22,30 M470,354 q10,22 22,30" stroke="var(--fg)" stroke-width="1.4" fill="none" opacity=".35"/>
</svg>`
    },

    /* ---------------------------------------------------------- */
    {
      id: 'ink', title: '亚里士多德', en: 'Aristotle', tone: '伦勃朗 · 1653', photo: 'assets/art/m437394.jpg', year: 1653, whisper: '他摸的不是石头，是一个人。', pal: 'ochre',
      note: '水墨最好的地方是留白 —— 没画的地方，才是我要说的话。',
      svg: `<svg viewBox="0 0 600 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <filter id="ik-rough" x="-15%" y="-15%" width="130%" height="130%">
      <feTurbulence type="fractalNoise" baseFrequency="0.014 0.045" numOctaves="3" seed="9" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="16" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <linearGradient id="ik-fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="var(--fg)" stop-opacity=".34"/>
      <stop offset="1" stop-color="var(--fg)" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <circle cx="418" cy="190" r="42" fill="var(--a1)" opacity=".75"/>

  <g filter="url(#ik-rough)">
    <path d="M-20,470 L70,380 L130,430 L200,340 L260,412 L330,360 L390,430 L470,372 L540,440 L620,400 L620,640 L-20,640 Z"
          fill="var(--fg)" opacity=".1"/>
    <path d="M-20,540 L60,462 L120,510 L190,430 L250,502 L320,452 L380,516 L460,462 L530,520 L620,486 L620,700 L-20,700 Z"
          fill="var(--fg)" opacity=".18"/>
    <path d="M-20,620 L80,552 L150,604 L230,540 L300,600 L380,556 L450,614 L540,566 L620,606 L620,780 L-20,780 Z"
          fill="url(#ik-fade)" opacity=".85"/>
  </g>

  <path d="M-20,690 q120,-24 240,0 t240,0" fill="none" stroke="var(--fg)" stroke-width="1" opacity=".22"/>

  <g fill="var(--fg)" opacity=".62">
    <path d="M180,668 q26,-10 52,0 l-8,10 q-18,-6 -36,0 z"/>
    <path d="M206,668 v-26" stroke="var(--fg)" stroke-width="1.6"/>
    <path d="M206,644 q10,-8 18,-2" stroke="var(--fg)" stroke-width="1.4" fill="none"/>
  </g>

  <g opacity=".8">
    <rect x="470" y="628" width="56" height="56" fill="var(--a1)" opacity=".92"/>
    <text x="498" y="668" text-anchor="middle" font-size="34" font-family="Songti SC, SimSun, serif"
          fill="var(--bg)">璟</text>
  </g>

  <g stroke="var(--fg)" stroke-width="1" opacity=".3">
    <path d="M92,120 v150"/><path d="M112,120 v110"/>
  </g>
</svg>`
    },

    /* ---------------------------------------------------------- */
    {
      id: 'room', title: '倒水的女人', en: 'Young Woman with a Water Pitcher', tone: '维米尔 · 1664', photo: 'assets/art/m437881.jpg', year: 1664, whisper: '光从左边来，屋子就会安静。', pal: 'xuan',
      note: '一个人的房间，就是他没说完的那部分自己。',
      svg: `<svg viewBox="0 0 600 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <radialGradient id="rm-lamp">
      <stop offset="0" stop-color="var(--a1)" stop-opacity=".55"/>
      <stop offset="1" stop-color="var(--a1)" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rm-win" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="var(--a2)" stop-opacity=".35"/>
      <stop offset="1" stop-color="var(--a2)" stop-opacity=".05"/>
    </linearGradient>
  </defs>

  <rect x="70" y="60" width="280" height="330" fill="url(#rm-win)" opacity=".8"/>
  <g fill="var(--fg)" opacity=".8">
    <circle cx="120" cy="112" r="1.8"/><circle cx="176" cy="86" r="1.2"/><circle cx="236" cy="130" r="1.5"/>
    <circle cx="296" cy="96" r="1"/><circle cx="150" cy="176" r="1.3"/><circle cx="270" cy="196" r="1.6"/>
    <circle cx="206" cy="228" r="1"/><circle cx="110" cy="252" r="1.2"/>
  </g>
  <circle cx="286" cy="146" r="26" fill="var(--bg)" stroke="var(--a3)" stroke-width="1.2" opacity=".9"/>
  <rect x="70" y="60" width="280" height="330" fill="none" stroke="var(--fg)" stroke-width="3" opacity=".55"/>
  <path d="M210,60 v330 M70,225 h280" stroke="var(--fg)" stroke-width="2.4" opacity=".45"/>

  <ellipse cx="410" cy="600" rx="210" ry="120" fill="url(#rm-lamp)"/>
  <path d="M470,330 v150" stroke="var(--fg)" stroke-width="2" opacity=".5"/>
  <path d="M410,486 q60,-16 120,0 l-24,-44 q-36,-10 -72,0 z" fill="var(--a1)" opacity=".75"/>
  <circle cx="470" cy="492" r="8" fill="var(--a3)"/>

  <path d="M60,600 h480 l26,40 h-532 z" fill="var(--fg)" opacity=".5"/>
  <path d="M104,640 v90 M496,640 v90" stroke="var(--fg)" stroke-width="6" opacity=".35"/>

  <g fill="var(--fg)" opacity=".55">
    <rect x="120" y="566" width="96" height="8" rx="1"/>
    <rect x="128" y="556" width="76" height="8" rx="1" opacity=".7"/>
  </g>
  <g opacity=".85">
    <rect x="252" y="560" width="10" height="40" fill="var(--a2)"/>
    <rect x="266" y="550" width="10" height="50" fill="var(--a3)"/>
    <rect x="280" y="564" width="10" height="36" fill="var(--a1)"/>
  </g>

  <g fill="var(--fg)" opacity=".6">
    <path d="M352,600 l10,-72 h20 l10,72 z"/>
    <path d="M362,528 l-6,-16 h32 l-6,16 z" opacity=".7"/>
    <circle cx="372" cy="572" r="5" fill="var(--a3)" opacity=".9"/>
  </g>

  <path d="M150,600 q40,-96 84,0" fill="none" stroke="var(--fg)" stroke-width="3" opacity=".4"/>
  <path d="M150,600 v-40" stroke="var(--fg)" stroke-width="3" opacity=".4"/>
</svg>`
    },
    /* ---------------------------------------------------------- */
    {
      id: 'still', title: '鸢尾花', en: 'Irises', tone: '梵高 · 1890', photo: 'assets/art/m436528.jpg', year: 1890, whisper: '花是刚剪的，叶子还立着。', pal: 'celadon',
      note: '花剪下来就不长了，但它在你桌上还能好看一个礼拜。',
      svg: `<svg viewBox="0 0 600 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <linearGradient id="sl-vase" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="var(--a1)" stop-opacity=".9"/>
      <stop offset="1" stop-color="var(--a2)" stop-opacity=".45"/>
    </linearGradient>
  </defs>

  <circle cx="418" cy="226" r="196" fill="var(--a3)" opacity=".06"/>

  <path d="M0,560 H600" stroke="var(--fg)" stroke-width="2" opacity=".45"/>
  <path d="M0,560 H600 V760 H0 Z" fill="var(--fg)" opacity=".03"/>
  <path d="M0,560 C90,586 150,548 240,572 C330,596 420,556 600,584"
        fill="none" stroke="var(--fg)" stroke-width="1.2" opacity=".18"/>

  <g stroke="var(--fg)" stroke-width="2.2" fill="none" opacity=".9">
    <path d="M300,314 C288,254 262,214 228,186"/>
    <path d="M300,314 C300,250 300,206 300,160"/>
    <path d="M300,314 C312,254 340,214 372,188"/>
  </g>
  <g stroke="var(--fg)" stroke-width="1.6">
    <g fill="var(--a3)"><circle cx="228" cy="180" r="22"/><circle cx="300" cy="152" r="25"/><circle cx="372" cy="182" r="21"/></g>
    <g fill="var(--a1)"><circle cx="228" cy="180" r="7"/><circle cx="300" cy="152" r="8"/><circle cx="372" cy="182" r="7"/></g>
  </g>

  <path d="M236,560 C206,500 200,440 222,398 C204,366 214,320 300,314 C386,320 396,366 378,398 C400,440 394,500 364,560 Z"
        fill="url(#sl-vase)" stroke="var(--fg)" stroke-width="2.4"/>
  <path d="M244,512 q28,-12 56,0" stroke="var(--fg)" stroke-width="1.2" fill="none" opacity=".28"/>

  <circle cx="188" cy="534" r="26" fill="var(--a1)" opacity=".85" stroke="var(--fg)" stroke-width="1.8"/>
  <circle cx="236" cy="546" r="18" fill="var(--a3)" opacity=".8" stroke="var(--fg)" stroke-width="1.6"/>

  <rect x="392" y="540" width="140" height="18" fill="var(--fg)" opacity=".24"/>
  <rect x="404" y="526" width="112" height="14" fill="var(--fg)" opacity=".15"/>
</svg>`
    },

    /* ---------------------------------------------------------- */
    {
      id: 'figure', title: '舞蹈课', en: 'The Dance Class', tone: '德加 · 1874', photo: 'assets/art/m438817.jpg', year: 1874, whisper: '排练的时候，没人看她们。', pal: 'dust-rose',
      note: '一笔画到底。画完才发现，人原来是一根很长的线。',
      svg: `<svg viewBox="0 0 600 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <ellipse cx="300" cy="420" rx="200" ry="270" fill="var(--a1)" opacity=".07"/>
  <circle cx="300" cy="168" r="42" fill="var(--bg)" stroke="var(--fg)" stroke-width="2.6" opacity=".95"/>

  <path d="M292,210 C250,280 252,372 288,436 C316,486 300,520 258,556 C216,592 214,640 252,672
           C296,708 366,700 402,660 C436,622 428,570 392,540"
        fill="none" stroke="var(--fg)" stroke-width="3" stroke-linecap="round" opacity=".92"/>

  <path d="M304,214 C344,282 344,374 312,438" fill="none" stroke="var(--fg)" stroke-width="2.2" stroke-linecap="round" opacity=".75"/>
  <path d="M286,244 C258,306 250,370 266,414" fill="none" stroke="var(--fg)" stroke-width="2" stroke-linecap="round" opacity=".5"/>
  <path d="M312,248 C340,306 348,368 334,412" fill="none" stroke="var(--fg)" stroke-width="2" stroke-linecap="round" opacity=".5"/>

  <path d="M150,700 H470" stroke="var(--fg)" stroke-width="1.4" opacity=".28"/>
  <path d="M300,128 v-26 M300,128 l18,-16" stroke="var(--a3)" stroke-width="1.6" opacity=".6" fill="none"/>

  <g fill="var(--a2)" opacity=".7">
    <circle cx="420" cy="250" r="3"/><circle cx="446" cy="292" r="2"/><circle cx="404" cy="320" r="2.4"/>
  </g>
</svg>`
    },

    /* ---------------------------------------------------------- */
    {
      id: 'stars', title: '麦田与柏树', en: 'Wheat Field with Cypresses', tone: '梵高 · 1889', photo: 'assets/art/m436535.jpg', year: 1889, whisper: '天空在转，树却一动不动。', pal: 'royal',
      note: '抬头看久了会发现，星星之间是人自己连的线。',
      svg: `<svg viewBox="0 0 600 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <circle cx="300" cy="380" r="250" fill="none" stroke="var(--fg)" stroke-width="1" opacity=".12" stroke-dasharray="3 9"/>
  <circle cx="300" cy="380" r="180" fill="none" stroke="var(--fg)" stroke-width="1" opacity=".09" stroke-dasharray="2 7"/>
  <path d="M60,380 H540 M300,100 V660" stroke="var(--fg)" stroke-width="1" opacity=".07"/>

  <g stroke="var(--a2)" stroke-width="1.2" opacity=".55" fill="none">
    <path d="M196,214 L268,262 L300,344 L246,398 L286,470"/>
    <path d="M268,262 L352,232 L410,300 L366,372 L300,344"/>
    <path d="M246,398 L188,470 L226,546"/>
  </g>

  <g fill="var(--fg)">
    <circle cx="196" cy="214" r="3.2"/><circle cx="268" cy="262" r="2.6"/><circle cx="352" cy="232" r="2.2"/>
    <circle cx="410" cy="300" r="2.8"/><circle cx="366" cy="372" r="2.2"/><circle cx="300" cy="344" r="3.4"/>
    <circle cx="246" cy="398" r="2.4"/><circle cx="286" cy="470" r="2"/><circle cx="188" cy="470" r="2.6"/>
    <circle cx="226" cy="546" r="2.2"/>
  </g>

  <g fill="var(--a1)">
    <circle cx="300" cy="344" r="7" opacity=".9"/>
    <circle cx="196" cy="214" r="5.6" opacity=".8"/>
    <circle cx="410" cy="300" r="5" opacity=".7"/>
  </g>
  <g stroke="var(--a1)" stroke-width="1" opacity=".35" fill="none">
    <circle cx="300" cy="344" r="16"/><circle cx="196" cy="214" r="13"/><circle cx="410" cy="300" r="12"/>
  </g>

  <g fill="var(--fg)" opacity=".7">
    <circle cx="470" cy="180" r="1.6"/><circle cx="120" cy="330" r="1.4"/><circle cx="500" cy="420" r="1.8"/>
    <circle cx="150" cy="600" r="1.4"/><circle cx="392" cy="560" r="1.6"/><circle cx="470" cy="620" r="1.2"/>
    <circle cx="92" cy="220" r="1.2"/><circle cx="330" cy="640" r="1.4"/>
  </g>

  <g font-family="JetBrains Mono, monospace" font-size="9" fill="var(--fg)" opacity=".45" letter-spacing="2">
    <text x="318" y="336">α</text>
    <text x="176" y="206">β</text>
    <text x="424" y="294">γ</text>
  </g>
</svg>`
    }

  ];

  function byId(id) {
    for (let i = 0; i < PLATES.length; i++) if (PLATES[i].id === id) return PLATES[i];
    return null;
  }

  function svgOf(id) {
    const p = byId(id);
    return p ? p.svg : '';
  }

  function render(el, id) {
    if (!el) return;
    const p = byId(id);
    if (!p) return;
    el.classList.add('plate');
    el.innerHTML = p.svg;
  }

  function hydrate(rootEl) {
    const scope = rootEl || document;
    Array.prototype.forEach.call(scope.querySelectorAll('[data-plate]'), function (el) {
      if (!el.firstElementChild) render(el, el.dataset.plate);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { hydrate(); });
  } else {
    hydrate();
  }

  window.ArtKit = { plates: PLATES, get: byId, svgOf: svgOf, render: render, hydrate: hydrate };
})();
