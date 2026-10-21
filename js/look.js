/* ============================================================
   look.js — 外观系统（色系 × 颜色 × 风格）
   ------------------------------------------------------------
   轴 1「色系」：5 个色系，每个 12 色，共 60 种配色
   轴 2「风格」：8 种字体/质感/形状气质
   两轴正交：颜色管"什么色"，风格管"什么性格"，随便组合
   ============================================================ */
(function () {
  'use strict';

  /* ============================================================
     一、色系数据
     每个颜色只写 5 个值：bg 底 / fg 字 / a1 a2 a3 三个主色
     其余（分隔线、卡片、雾、光晕、按钮字色……）全部由算法推导
     ============================================================ */
  const FAMILIES = [
    {
      id: 'vivid', name: '霓彩', en: 'Vivid', mode: 'dark',
      blurb: '高饱和、带电。像深夜里一场不肯停的烟火 —— 冲，亮，敢撞色。',
      palettes: [
        { id: 'aurora',   name: '极光',   en: 'Aurora',    bg: '#05060f', fg: '#eaf2ff', a1: '#6ff3ff', a2: '#a98bff', a3: '#ff5fc8' },
        { id: 'acid',     name: '酸柠',   en: 'Acid',      bg: '#060805', fg: '#f0ffe8', a1: '#c8ff2e', a2: '#2bff9b', a3: '#16e0ff' },
        { id: 'magenta',  name: '洋红',   en: 'Magenta',   bg: '#0a050a', fg: '#ffe8f6', a1: '#ff2ea6', a2: '#b02bff', a3: '#ff7bd5' },
        { id: 'cyber',    name: '赛博',   en: 'Cyber',     bg: '#03070a', fg: '#e6ffee', a1: '#24e8ff', a2: '#ff2ea6', a3: '#c8ff2e' },
        { id: 'lava',     name: '熔岩',   en: 'Lava',      bg: '#0a0504', fg: '#fff0e6', a1: '#ff5a1f', a2: '#ffcf3d', a3: '#ff2d55' },
        { id: 'toxic',    name: '毒绿',   en: 'Toxic',     bg: '#04080a', fg: '#e8fffb', a1: '#3dffa2', a2: '#00d4ff', a3: '#c6ff00' },
        { id: 'ultra',    name: '紫外',   en: 'Ultra',     bg: '#070513', fg: '#efe9ff', a1: '#7b5cff', a2: '#ff4fd8', a3: '#46e6ff' },
        { id: 'ember',    name: '赤焰',   en: 'Ember',     bg: '#0b0603', fg: '#ffeedd', a1: '#ff8a1f', a2: '#ff3d6e', a3: '#ffd166' },
        { id: 'ice',      name: '冰爆',   en: 'Ice Pop',   bg: '#021018', fg: '#e9fbff', a1: '#61f4ff', a2: '#4d8dff', a3: '#d16bff' },
        { id: 'bubble',   name: '泡泡糖', en: 'Bubblegum', bg: '#120610', fg: '#ffeaf7', a1: '#ff4fa3', a2: '#ff9f45', a3: '#a45cff' },
        { id: 'matrix',   name: '矩阵',   en: 'Matrix',    bg: '#020a04', fg: '#d9ffe3', a1: '#00ff85', a2: '#9dff00', a3: '#00e0d0' },
        { id: 'cobalt',   name: '钴蓝',   en: 'Cobalt',    bg: '#020814', fg: '#e6f2ff', a1: '#2f7bff', a2: '#00e5ff', a3: '#9d7bff' }
      ]
    },
    {
      id: 'morandi', name: '莫兰迪', en: 'Morandi', mode: 'light',
      blurb: '所有颜色里都掺了一点灰，像被时间和光磨过一遍。安静，克制，久看不累。',
      palettes: [
        { id: 'mist-sage',  name: '雾苔',   en: 'Mist Sage',   bg: '#e8e9e3', fg: '#2e332f', a1: '#8ea58d', a2: '#b6a894', a3: '#6d8279' },
        { id: 'dust-rose',  name: '灰玫瑰', en: 'Dust Rose',   bg: '#ece3e3', fg: '#382f30', a1: '#b1838a', a2: '#9b8e86', a3: '#7c6a6b' },
        { id: 'terracotta', name: '陶土',   en: 'Terracotta',  bg: '#eee3d8', fg: '#3a2e27', a1: '#b1765c', a2: '#9a8a6e', a3: '#6f7a72' },
        { id: 'fog-blue',   name: '雾蓝',   en: 'Fog Blue',    bg: '#e5e9ec', fg: '#2b3238', a1: '#8499ab', a2: '#a7b5bd', a3: '#5e7080' },
        { id: 'oat',        name: '燕麦',   en: 'Oat',         bg: '#f0eadf', fg: '#35312a', a1: '#bfa781', a2: '#99a288', a3: '#7a6e5d' },
        { id: 'muted-violet', name: '灰紫', en: 'Muted Violet', bg: '#e8e4ea', fg: '#322c38', a1: '#9b8eaa', a2: '#b8a7b4', a3: '#6c6275' },
        { id: 'moss',       name: '苔绿',   en: 'Moss',        bg: '#e6e8df', fg: '#2e332b', a1: '#8c9971', a2: '#a7a48d', a3: '#5e6a51' },
        { id: 'ochre',      name: '赭石',   en: 'Ochre',       bg: '#ece1d4', fg: '#3b2e25', a1: '#a8724e', a2: '#bfa182', a3: '#796955' },
        { id: 'slate',      name: '石板',   en: 'Slate',       bg: '#e3e6e6', fg: '#2a2f31', a1: '#7e8d91', a2: '#a2adad', a3: '#5a696d' },
        { id: 'sand-gold',  name: '沙金',   en: 'Sand Gold',   bg: '#efe8d9', fg: '#36302a', a1: '#bda268', a2: '#a3987c', a3: '#7d7156' },
        { id: 'pale-clay',  name: '粉陶',   en: 'Pale Clay',   bg: '#ede4e0', fg: '#382e2b', a1: '#ad8b7e', a2: '#a49c8e', a3: '#796b63' },
        { id: 'silver-mist', name: '银雾',  en: 'Silver Mist', bg: '#e7eaea', fg: '#2b3031', a1: '#8f9da0', a2: '#b3bdbc', a3: '#667676' }
      ]
    },
    {
      id: 'pastel', name: '淡彩', en: 'Pastel', mode: 'light',
      blurb: '几乎是白纸，只在上头轻轻染了一层。轻盈，透气，像刚洗过的晴天。',
      palettes: [
        { id: 'peach',    name: '蜜桃',   en: 'Peach',    bg: '#fdf5f0', fg: '#4a3730', a1: '#f0a487', a2: '#f3c9a8', a3: '#c98f7e' },
        { id: 'mint',     name: '薄荷',   en: 'Mint',     bg: '#f0faf6', fg: '#2f4540', a1: '#7fd8bb', a2: '#a8e3cd', a3: '#5aa79a' },
        { id: 'lilac',    name: '丁香',   en: 'Lilac',    bg: '#f7f3fb', fg: '#3c3348', a1: '#b79ce0', a2: '#d3c2ef', a3: '#8f7bb5' },
        { id: 'sky',      name: '天青',   en: 'Sky',      bg: '#f0f7fc', fg: '#2f3d4a', a1: '#8cc6ea', a2: '#b7dbf2', a3: '#6b93b8' },
        { id: 'butter',   name: '奶油',   en: 'Butter',   bg: '#fdfaf0', fg: '#473f2e', a1: '#efcf7a', a2: '#f3e3b0', a3: '#b89a55' },
        { id: 'coral',    name: '珊瑚',   en: 'Coral',    bg: '#fff4f2', fg: '#4a3230', a1: '#f59b91', a2: '#f7c2b6', a3: '#c4746c' },
        { id: 'seafoam',  name: '海沫',   en: 'Seafoam',  bg: '#f1faf8', fg: '#2f4544', a1: '#9fe0d8', a2: '#c3ece7', a3: '#64a8a3' },
        { id: 'rose',     name: '蔷薇',   en: 'Rose',     bg: '#fdf2f5', fg: '#48313a', a1: '#efa1b8', a2: '#f5c6d4', a3: '#bf7d93' },
        { id: 'lime',     name: '嫩芽',   en: 'Lime',     bg: '#f7fbf0', fg: '#3a4330', a1: '#c3dd86', a2: '#dcecad', a3: '#8ba45f' },
        { id: 'cotton',   name: '棉糖',   en: 'Cotton',   bg: '#fbf6fb', fg: '#423a46', a1: '#d9b6dc', a2: '#ebd3ea', a3: '#a98bac' },
        { id: 'ice-blue', name: '冰蓝',   en: 'Ice Blue', bg: '#f4f9fb', fg: '#33424a', a1: '#a7d3e0', a2: '#c9e6ee', a3: '#6f9aa8' },
        { id: 'apricot',  name: '杏',     en: 'Apricot',  bg: '#fdf7f1', fg: '#493a2e', a1: '#eebd93', a2: '#f4dcc0', a3: '#b98f68' }
      ]
    },
    {
      id: 'oriental', name: '东方', en: 'Oriental', mode: 'light',
      blurb: '宣纸、松烟、朱砂、青瓷。不是复古，是把老的颜色重新用一遍。',
      palettes: [
        { id: 'xuan',      name: '宣纸', en: 'Xuan Paper', bg: '#efe7d9', fg: '#16130f', a1: '#c03a24', a2: '#2f4b46', a3: '#8b7f68' },
        { id: 'celadon',   name: '青瓷', en: 'Celadon',   bg: '#e9efe9', fg: '#1b2620', a1: '#4f8a72', a2: '#9db8a8', a3: '#2f5c4c' },
        { id: 'indigo',    name: '靛蓝', en: 'Indigo',    bg: '#e8ecf2', fg: '#151c26', a1: '#2f4f8f', a2: '#6f86b5', a3: '#1f3a6b' },
        { id: 'ochre-ink', name: '赭墨', en: 'Ochre Ink', bg: '#f0e8da', fg: '#221c14', a1: '#9c5b2a', a2: '#6b5a3e', a3: '#c0392b' },
        { id: 'moon',      name: '月白', en: 'Moon',      bg: '#eef2f4', fg: '#171d22', a1: '#5a7d94', a2: '#9fb4c0', a3: '#34556b' },
        { id: 'cinnabar',  name: '朱砂', en: 'Cinnabar',  bg: '#f2e9e2', fg: '#1e1512', a1: '#b52d1f', a2: '#8a6a4a', a3: '#d4763a' },
        { id: 'pine',      name: '松烟', en: 'Pine Soot', bg: '#e9ebe6', fg: '#141814', a1: '#365046', a2: '#6f8375', a3: '#8a9a72' },
        { id: 'gamboge',   name: '藤黄', en: 'Gamboge',   bg: '#f5edda', fg: '#241d10', a1: '#c99218', a2: '#7a6a3e', a3: '#a34a1c' },
        { id: 'dai',       name: '黛青', en: 'Dai Blue',  bg: '#e7eaee', fg: '#12161c', a1: '#3b4a63', a2: '#6d7e96', a3: '#24303f' },
        { id: 'lotus',     name: '藕荷', en: 'Lotus',     bg: '#f2ebee', fg: '#241a20', a1: '#8f5570', a2: '#b08f9e', a3: '#5f3b4e' },
        { id: 'crab',      name: '蟹壳', en: 'Crab Shell', bg: '#f0e9e0', fg: '#1d1812', a1: '#a35a3a', a2: '#7b6a52', a3: '#4a5d52' },
        { id: 'jade',      name: '墨玉', en: 'Jade',      bg: '#e9ecea', fg: '#131714', a1: '#2f4b46', a2: '#4f7a6a', a3: '#9aa88f' }
      ]
    },
    {
      id: 'nocturne', name: '暗夜', en: 'Nocturne', mode: 'dark',
      blurb: '黑底上的宝石色。不喧哗，但很贵 —— 适合深夜一个人安静地看。',
      palettes: [
        { id: 'midnight',  name: '午夜', en: 'Midnight',  bg: '#05070f', fg: '#e6ecff', a1: '#4b6bff', a2: '#6f8cff', a3: '#b9c7ff' },
        { id: 'emerald',   name: '翡翠', en: 'Emerald',   bg: '#03110d', fg: '#dcfff2', a1: '#2fbf8f', a2: '#57e3b8', a3: '#b8f5dd' },
        { id: 'burgundy',  name: '酒红', en: 'Burgundy',  bg: '#0e0507', fg: '#ffe8ea', a1: '#b0334a', a2: '#e05a6e', a3: '#ffb3bd' },
        { id: 'plum',      name: '李子', en: 'Plum',      bg: '#0b0510', fg: '#f6e9ff', a1: '#8b4fd8', a2: '#b47cf0', a3: '#e3c9ff' },
        { id: 'graphite',  name: '石墨', en: 'Graphite',  bg: '#0a0b0c', fg: '#eceff1', a1: '#8a99a6', a2: '#b8c4cd', a3: '#e3eaef' },
        { id: 'copper',    name: '铜',   en: 'Copper',    bg: '#0d0705', fg: '#ffefe2', a1: '#c47a3e', a2: '#e8a86a', a3: '#ffd8b0' },
        { id: 'teal-noir', name: '墨青', en: 'Teal Noir', bg: '#030c0e', fg: '#d9f7f7', a1: '#2a8f8f', a2: '#57c4c0', a3: '#b0efe9' },
        { id: 'royal',     name: '宝蓝', en: 'Royal',     bg: '#040713', fg: '#e8f0ff', a1: '#2a5bd7', a2: '#5586f0', a3: '#a9c4ff' },
        { id: 'moss-noir', name: '深苔', en: 'Moss Noir', bg: '#070b06', fg: '#eafbe0', a1: '#5f8f3a', a2: '#8fbf5c', a3: '#cbe8a8' },
        { id: 'rosewood',  name: '紫檀', en: 'Rosewood',  bg: '#0c0608', fg: '#ffeef0', a1: '#8f3f52', a2: '#b96a7c', a3: '#e8b6bf' },
        { id: 'steel',     name: '冷钢', en: 'Steel',     bg: '#07080a', fg: '#eef2f5', a1: '#5f7f9f', a2: '#8fb0c9', a3: '#cfe3ef' },
        { id: 'ink-noir',  name: '焦墨', en: 'Ink Noir',  bg: '#08090a', fg: '#f0f0ee', a1: '#b9b2a6', a2: '#8a8378', a3: '#e5ddcd' }
      ]
    }
  ];

  /* ============================================================
     二、风格数据（字体 / 形状 / 质感 / 粒子运动）
     ============================================================ */
  const STYLES = [
    { id: 'minimal',   name: '极简', en: 'Minimal',   hint: '无衬线 · 干净', particles: { motion: 'drift', size: 1.5, count: 60 } },
    { id: 'print',     name: '印刷', en: 'Print',     hint: '宋体 · 纸感 · 网点', particles: { motion: 'drift', size: 1.2, count: 40 } },
    { id: 'cinematic', name: '电影', en: 'Cinematic', hint: '细宋 + 斜体 · 宽字距', particles: { motion: 'rise', size: 2.2, count: 55 } },
    { id: 'cyber',     name: '赛博', en: 'Cyber',     hint: '等宽 · 大写 · 硬边', particles: { motion: 'drift', size: 1.5, count: 80 } },
    { id: 'soft',      name: '柔和', en: 'Soft',      hint: '卡通圆体 · 大圆角', particles: { motion: 'fall', size: 3.6, count: 44 } },
    { id: 'ocean',     name: '深海', en: 'Ocean',     hint: '细无衬线 · 字距很开', particles: { motion: 'rise', size: 2.0, count: 64 } },
    { id: 'glass',     name: '玻璃', en: 'Glass',     hint: '粗无衬线 · 毛玻璃', particles: { motion: 'drift', size: 1.1, count: 40 } },
    { id: 'poster',    name: '海报', en: 'Poster',    hint: '超粗黑体 · 全大写', particles: { motion: 'rise', size: 2.4, count: 46 } },
    { id: 'ink',       name: '书法', en: 'Calligraphy', hint: '毛笔字 · 印章边', particles: { motion: 'drift', size: 1.8, count: 46 } },
    { id: 'hand',      name: '手写', en: 'Handwriting', hint: '钢笔字 · 草稿纸', particles: { motion: 'drift', size: 1.6, count: 42 } }
  ];

  const DEFAULT_PALETTE = 'aurora';
  const DEFAULT_STYLE = 'minimal';
  const KEY_P = 'nova-palette';
  const KEY_S = 'nova-style';

  /* ============================================================
     三、颜色工具
     ============================================================ */
  function h2r(hex) {
    let h = hex.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    const n = parseInt(h, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  function toHex(c) {
    const f = function (v) { return Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0'); };
    return '#' + f(c.r) + f(c.g) + f(c.b);
  }
  function mix(a, b, t) {
    const x = h2r(a), y = h2r(b);
    return toHex({ r: x.r + (y.r - x.r) * t, g: x.g + (y.g - x.g) * t, b: x.b + (y.b - x.b) * t });
  }
  function rgba(hex, a) {
    const c = h2r(hex);
    return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + a + ')';
  }
  function rgbList(hex) {
    const c = h2r(hex);
    return c.r + ',' + c.g + ',' + c.b;
  }
  function lum(hex) {
    const c = h2r(hex);
    const s = function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * s(c.r) + 0.7152 * s(c.g) + 0.0722 * s(c.b);
  }
  function contrast(a, b) {
    const l1 = lum(a), l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }

  /* ============================================================
     四、索引
     ============================================================ */
  function findPalette(id) {
    for (let i = 0; i < FAMILIES.length; i++) {
      const f = FAMILIES[i];
      for (let j = 0; j < f.palettes.length; j++) {
        if (f.palettes[j].id === id) return { family: f, palette: f.palettes[j] };
      }
    }
    return null;
  }
  function findStyle(id) {
    return STYLES.filter(function (s) { return s.id === id; })[0] || null;
  }

  /* ============================================================
     五、推导 CSS 变量
     ============================================================ */
  function derive(palette, family) {
    const mode = palette.mode || family.mode;
    const light = mode === 'light';
    const p = palette;

    // 从三个候选色里挑一个在整条渐变上都够清楚的文字色
    const stops = [p.a1, p.a2, p.a3];
    const candidates = [p.fg, '#ffffff', '#0b0b0e'];
    let best = candidates[0], bestScore = -1;
    candidates.forEach(function (c) {
      let min = 99;
      stops.forEach(function (s) { min = Math.min(min, contrast(c, s)); });
      if (min > bestScore) { bestScore = min; best = c; }
    });

    const bgTop = mix(p.bg, p.a2, light ? 0.1 : 0.16);
    const fog = light ? mix(p.fg, p.a1, 0.38) : mix(p.a1, '#ffffff', 0.14);

    return {
      mode: mode,
      vars: {
        '--bg': p.bg,
        '--bg-grad': 'radial-gradient(130% 110% at 50% -10%, ' + bgTop + ' 0%, ' + p.bg + ' 58%)',
        '--fg': p.fg,
        '--fg-dim': rgba(p.fg, light ? 0.72 : 0.64),
        '--fg-faint': rgba(p.fg, light ? 0.46 : 0.34),
        '--line': rgba(p.fg, light ? 0.16 : 0.13),
        '--line-strong': rgba(p.fg, light ? 0.34 : 0.28),
        '--card': light ? 'rgba(255,255,255,.50)' : 'rgba(255,255,255,.05)',
        '--card-line': rgba(p.fg, light ? 0.14 : 0.12),
        '--a1': p.a1,
        '--a2': p.a2,
        '--a3': p.a3,
        '--a1-t': light ? mix(p.a1, p.fg, 0.48) : mix(p.a1, '#ffffff', 0.24),
        '--on-accent': best,
        '--glow': light ? '0 0 70px -16px ' + rgba(p.a1, 0.4) : '0 0 90px -10px ' + rgba(p.a1, 0.45),
        '--nav-bg': rgba(p.bg, light ? 0.62 : 0.55),
        '--shadow': light
          ? '0 30px 60px -42px ' + rgba(mix(p.bg, '#000000', 0.55), 0.5)
          : '0 30px 80px -40px rgba(0,0,0,.9)',
        '--blend-mesh': light ? 'multiply' : 'screen',
        '--grain-blend': light ? 'multiply' : 'overlay',
        '--mesh-op': light ? '0.42' : '1'
      },
      fog: rgbList(fog),
      dust: light
        ? [mix(p.a1, p.fg, 0.35), mix(p.a2, p.fg, 0.35), mix(p.a3, p.fg, 0.3)]
        : [p.a1, p.a2, p.a3]
    };
  }

  /* ============================================================
     六、状态与持久化
     ============================================================ */
  const root = document.documentElement;

  let curPaletteId = DEFAULT_PALETTE;
  let curStyleId = DEFAULT_STYLE;
  let curDerived = null;

  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, val); } catch (e) { }
  }

  function applyPalette(id, silent) {
    const found = findPalette(id) || findPalette(DEFAULT_PALETTE);
    const d = derive(found.palette, found.family);
    curPaletteId = found.palette.id;
    curDerived = d;
    root.dataset.palette = found.palette.id;
    root.dataset.family = found.family.id;
    root.dataset.mode = d.mode;
    root.style.colorScheme = d.mode;
    Object.keys(d.vars).forEach(function (k) {
      root.style.setProperty(k, d.vars[k]);
    });
    if (!silent) {
      write(KEY_P, found.palette.id);
      emit();
    }
    return found;
  }

  function applyStyle(id, silent) {
    const s = findStyle(id) || findStyle(DEFAULT_STYLE);
    curStyleId = s.id;
    root.dataset.style = s.id;
    if (!silent) {
      write(KEY_S, s.id);
      emit();
    }
    return s;
  }

  function emit() {
    window.dispatchEvent(new CustomEvent('lookchange', { detail: current() }));
  }

  function current() {
    const found = findPalette(curPaletteId);
    return {
      palette: found.palette,
      family: found.family,
      style: findStyle(curStyleId),
      fog: curDerived.fog,
      dust: curDerived.dust,
      mode: curDerived.mode
    };
  }

  /* ---------------- 主题切换：从太阳按钮炸开一圈光 ---------------- */
  let animating = false;

  function wipeTo(target, done) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { done(); return; }

    let layer = document.getElementById('brushWipe');
    if (!layer) {
      layer = document.createElement('div');
      layer.id = 'brushWipe';
      layer.className = 'brush-wipe';
      layer.innerHTML = '<i></i><b></b>';
      document.body.appendChild(layer);
    }
    const brush = layer.querySelector('i');
    const edge = layer.querySelector('b');
    const bg = target.palette.bg;

    brush.style.background = bg;
    edge.style.background = target.palette.a1;

    layer.getAnimations({ subtree: true }).forEach(function (a) { a.cancel(); });
    layer.style.opacity = '1';

    // 一块很大的斜方形，从右上角外 -> 左下角外
    const from = 'translate3d(100vw, -105vh, 0) rotate(-26deg)';
    const to = 'translate3d(-45vw, 20vh, 0) rotate(-26deg)';
    const timing = { duration: 700, easing: 'cubic-bezier(.36,0,.24,1)', fill: 'forwards' };

    brush.animate([{ transform: from }, { transform: to }], timing);
    edge.animate([{ transform: from }, { transform: to }], {
      duration: 700, easing: 'cubic-bezier(.36,0,.24,1)', fill: 'forwards', delay: 40
    });

    // 等笔刷把屏幕盖满，再换颜色（这样那条斜边才看得见）
    setTimeout(done, 600);

    setTimeout(function () {
      const out = layer.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 230, easing: 'ease-out', fill: 'forwards'
      });
      out.onfinish = function () { layer.style.opacity = '0'; };
    }, 640);
  }

  function switchPalette(id, animate) {
    const found = findPalette(id);
    if (!found) return;
    if (found.palette.id === curPaletteId) return;
    if (!animate) { applyPalette(id); syncUI(); return; }
    wipeTo(found, function () { applyPalette(id); syncUI(); });
  }

  function switchStyle(id, animate) {
    const s = findStyle(id);
    if (!s || s.id === curStyleId) return;
    if (!animate) { applyStyle(id); syncUI(); return; }
    const found = findPalette(curPaletteId);
    wipeTo(found, function () { applyStyle(id); syncUI(); });
  }

  function cyclePalette(dir) {
    const fam = findPalette(curPaletteId).family;
    const idx = fam.palettes.findIndex(function (p) { return p.id === curPaletteId; });
    const next = fam.palettes[(idx + dir + fam.palettes.length) % fam.palettes.length];
    switchPalette(next.id, true);
  }

  /* ============================================================
     七、启动（在 <head> 里就跑，避免闪一下旧颜色）
     ============================================================ */
  (function boot() {
    const params = new URLSearchParams(window.location.search);
    const qp = params.get('palette');
    const qs = params.get('style');
    const storedP = read(KEY_P);
    const storedS = read(KEY_S);
    // 每页可以在 <html data-palette="..."> 上写自己的默认外观
    const attrP = root.dataset.palette;
    const attrS = root.dataset.style;

    // 深夜（22 点后 / 6 点前）：没手动选过的话，自动换一套更暗的光
    // 某些页（幼稚园、花房）可以写 data-night="off" 拒绝变暗
    const hour = new Date().getHours();
    const isNight = hour >= 22 || hour < 6;
    const nightOff = root.dataset.night === 'off';
    let nightPick = null;
    if (isNight && !nightOff && !storedP && !qp) {
      const near = attrP ? findPalette(attrP) : null;
      nightPick = near && near.family.mode === 'dark'
        ? near.palette.id
        : (findPalette('graphite') ? 'graphite' : null);
    }

    const finalP = (qp && findPalette(qp)) ? qp
      : (storedP && findPalette(storedP)) ? storedP
        : nightPick ? nightPick
          : (attrP && findPalette(attrP)) ? attrP
            : DEFAULT_PALETTE;
    const finalS = (qs && findStyle(qs)) ? qs
      : (storedS && findStyle(storedS)) ? storedS
        : (attrS && findStyle(attrS)) ? attrS
          : DEFAULT_STYLE;

    applyPalette(finalP, true);
    applyStyle(finalS, true);

    if (nightPick && isNight && nightPick !== attrP) {
      setTimeout(function () {
        const t = document.getElementById('toast');
        if (!t) return;
        t.textContent = '夜深了，我把它调暗了一点';
        t.classList.add('show');
        setTimeout(function () { t.classList.remove('show'); }, 2600);
      }, 1800);
    }
  })();

  /* ============================================================
     八、面板 UI（DOM 就绪后构建）
     ============================================================ */
  // 这个文件在 <head> 里执行，DOM 还没解析，所以元素一律现取
  const $ = function (id) { return document.getElementById(id); };

  function syncUI() {
    const found = findPalette(curPaletteId);
    const label = $('themeLabel');
    const btn = $('themeBtn');
    if (label) {
      label.textContent = found.palette.name;
      label.title = found.family.name + ' · ' + found.palette.name;
    }
    if (btn) {
      btn.setAttribute('aria-label', '外观设置（当前：' + found.family.name + ' ' + found.palette.name + ' / ' + findStyle(curStyleId).name + '）');
    }
    const famNow = document.getElementById('famNow');
    if (famNow) famNow.textContent = found.family.name;
    const styleNow = document.getElementById('styleNow');
    if (styleNow) styleNow.textContent = findStyle(curStyleId).name;
    const foot = document.getElementById('tpFoot');
    if (foot) foot.textContent = FAMILIES.length + ' 个色系 · ' + totalPalettes() + ' 种颜色 · ' + STYLES.length + ' 种风格';

    // 家族高亮
    const famBox = document.getElementById('famList');
    if (famBox) {
      Array.prototype.forEach.call(famBox.children, function (el) {
        el.classList.toggle('on', el.dataset.family === found.family.id);
      });
    }
    // 色块高亮
    const swBox = document.getElementById('swList');
    if (swBox) {
      Array.prototype.forEach.call(swBox.children, function (el) {
        el.classList.toggle('on', el.dataset.palette === curPaletteId);
      });
    }
    // 风格高亮
    const stBox = document.getElementById('styleList');
    if (stBox) {
      Array.prototype.forEach.call(stBox.children, function (el) {
        el.classList.toggle('on', el.dataset.style === curStyleId);
      });
    }
  }

  function totalPalettes() {
    return FAMILIES.reduce(function (n, f) { return n + f.palettes.length; }, 0);
  }

  function openPanel() {
    const panel = $('themePanel');
    if (!panel) return;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    const btn = $('themeBtn');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }
  function closePanel() {
    const panel = $('themePanel');
    if (!panel) return;
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    const btn = $('themeBtn');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }
  function togglePanel() {
    const panel = $('themePanel');
    if (!panel) return;
    panel.classList.contains('open') ? closePanel() : openPanel();
  }

  function setTab(name) {
    Array.prototype.forEach.call(document.querySelectorAll('.tp-tab'), function (t) {
      t.classList.toggle('is-on', t.dataset.tab === name);
      t.setAttribute('aria-selected', t.dataset.tab === name ? 'true' : 'false');
    });
    const pc = document.getElementById('paneColor');
    const ps = document.getElementById('paneStyle');
    if (pc) pc.hidden = name !== 'color';
    if (ps) ps.hidden = name !== 'style';
  }

  function renderSwatches(familyId) {
    const box = document.getElementById('swList');
    const blurb = document.getElementById('famBlurb');
    const fam = FAMILIES.filter(function (f) { return f.id === familyId; })[0] || FAMILIES[0];
    if (blurb) blurb.textContent = fam.blurb;
    if (!box) return;
    box.innerHTML = '';
    fam.palettes.forEach(function (p) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'sw-item';
      b.dataset.palette = p.id;
      b.innerHTML =
        '<span class="sw-dot" style="background:conic-gradient(from 140deg,' + p.a1 + ',' + p.a2 + ',' + p.a3 + ',' + p.a1 + ');box-shadow:inset 0 0 0 3px ' + p.bg + '"></span>' +
        '<span class="sw-name">' + p.name + '</span>';
      b.addEventListener('click', function () { switchPalette(p.id, true); });
      box.appendChild(b);
    });
  }

  function buildUI() {
    const famBox = document.getElementById('famList');
    if (famBox) {
      FAMILIES.forEach(function (f) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'fam-chip';
        b.dataset.family = f.id;
        b.innerHTML = f.name + '<i>' + f.palettes.length + '</i>';
        b.addEventListener('click', function () {
          renderSwatches(f.id);
          // 顺手把这一系的第一个颜色也用上，换系立刻有感觉
          if (findPalette(curPaletteId).family.id !== f.id) {
            switchPalette(f.palettes[0].id, true);
            setTimeout(syncUI, 60);
          }
          syncUI();
        });
        famBox.appendChild(b);
      });
    }

    const stBox = document.getElementById('styleList');
    if (stBox) {
      STYLES.forEach(function (s) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'st-item';
        b.dataset.style = s.id;
        b.title = s.en + ' · ' + s.hint;
        b.innerHTML =
          '<span class="st-aa" aria-hidden="true" data-s="' + s.id + '">Aa</span>' +
          '<span class="st-txt">' + s.name + '<i>' + s.hint + '</i></span>';
        b.addEventListener('click', function () { switchStyle(s.id, true); });
        stBox.appendChild(b);
      });
    }

    Array.prototype.forEach.call(document.querySelectorAll('.tp-tab'), function (t) {
      t.addEventListener('click', function () { setTab(t.dataset.tab); });
    });

    const btnEl = $('themeBtn');
    if (btnEl) {
      let sunClicks = 0;
      let sunTimer = 0;
      btnEl.addEventListener('click', function (e) {
        e.stopPropagation();
        togglePanel();
        // 彩蛋：连着点七下太阳，门就开了
        sunClicks++;
        clearTimeout(sunTimer);
        sunTimer = setTimeout(function () { sunClicks = 0; }, 2600);
        if (sunClicks >= 7) {
          sunClicks = 0;
          root.classList.add('door-open');
          try { localStorage.setItem('nova-door', '1'); } catch (err) { }
          window.dispatchEvent(new CustomEvent('egg:door'));
        }
      });
    }
    document.addEventListener('click', function (e) {
      const panel = $('themePanel');
      if (!panel || !panel.classList.contains('open')) return;
      const btn = $('themeBtn');
      if (panel.contains(e.target) || (btn && btn.contains(e.target))) return;
      closePanel();
    });

    renderSwatches(findPalette(curPaletteId).family.id);
    setTab('color');
    syncUI();

    // 以前开过门的话，直接把门留在页脚
    try { if (localStorage.getItem('nova-door') === '1') root.classList.add('door-open'); } catch (err) { }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildUI);
  } else {
    buildUI();
  }

  /* ============================================================
     九、对外接口
     ============================================================ */
  window.LookKit = {
    families: FAMILIES,
    styles: STYLES,
    total: totalPalettes(),
    current: current,
    paletteId: function () { return curPaletteId; },
    styleId: function () { return curStyleId; },
    setPalette: switchPalette,
    setStyle: switchStyle,
    cyclePalette: cyclePalette,
    find: findPalette,
    toggle: togglePanel,
    close: closePanel,
    sync: syncUI
  };
})();
