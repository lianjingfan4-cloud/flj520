/* ============================================================
   music.js — 背景乐（WebAudio 实时合成，不用音频文件）
   ------------------------------------------------------------
   五首曲子，都是自己写的和声进行：
     卡农   D–A–Bm–F#m–G–D–G–A
     山谷   慢速长音 + 稀疏的钟
     夜曲   小调，低一点
     极光   挂留和弦，宽
     雨     卡农 + 一层雨声（滤波噪声）
   点小喇叭 → 开面板（播放 / 音量 / 换曲 / 随机）
   ============================================================ */
(function () {
  'use strict';

  const SAVE_VOL = 'nova-music-vol';
  const SAVE_TRACK = 'nova-music-track';
  const SAVE_ON = 'nova-music';

  const TRACKS = [
    {
      id: 'canon', name: '卡农', en: 'Canon',
      step: 0.42, wave: 'triangle', gain: 1, pad: 1, sparkle: 1,
      chords: [
        { bass: 73.42, tones: [293.66, 369.99, 440.00] },
        { bass: 55.00, tones: [220.00, 277.18, 329.63] },
        { bass: 61.74, tones: [246.94, 293.66, 369.99] },
        { bass: 46.25, tones: [185.00, 220.00, 277.18] },
        { bass: 49.00, tones: [196.00, 246.94, 293.66] },
        { bass: 73.42, tones: [293.66, 369.99, 440.00] },
        { bass: 49.00, tones: [196.00, 246.94, 293.66] },
        { bass: 55.00, tones: [220.00, 277.18, 329.63] }
      ],
      arp: [0, 1, 2, 3, 2, 1, 2, 0]
    },
    {
      id: 'valley', name: '山谷', en: 'Valley',
      step: 0.62, wave: 'sine', gain: 1.1, pad: 1.3, sparkle: 0.4,
      chords: [
        { bass: 65.41, tones: [261.63, 329.63, 392.00] },
        { bass: 49.00, tones: [196.00, 246.94, 293.66] },
        { bass: 55.00, tones: [220.00, 261.63, 329.63] },
        { bass: 43.65, tones: [174.61, 220.00, 261.63] },
        { bass: 58.27, tones: [233.08, 293.66, 349.23] },
        { bass: 49.00, tones: [196.00, 246.94, 293.66] },
        { bass: 43.65, tones: [174.61, 220.00, 261.63] },
        { bass: 65.41, tones: [261.63, 329.63, 392.00] }
      ],
      arp: [0, 2, 1, 2, 3, 2, 1, 0]
    },
    {
      id: 'nocturne', name: '夜曲', en: 'Nocturne',
      step: 0.52, wave: 'sine', gain: .95, pad: 1.1, sparkle: .7,
      chords: [
        { bass: 55.00, tones: [220.00, 261.63, 329.63] },
        { bass: 43.65, tones: [174.61, 220.00, 261.63] },
        { bass: 65.41, tones: [261.63, 329.63, 392.00] },
        { bass: 49.00, tones: [196.00, 246.94, 293.66] },
        { bass: 55.00, tones: [220.00, 261.63, 329.63] },
        { bass: 41.20, tones: [164.81, 196.00, 246.94] },
        { bass: 49.00, tones: [196.00, 246.94, 293.66] },
        { bass: 43.65, tones: [174.61, 220.00, 261.63] }
      ],
      arp: [0, 1, 3, 1, 2, 1, 0, 2]
    },
    {
      id: 'aurora', name: '极光', en: 'Aurora',
      step: 0.72, wave: 'triangle', gain: .9, pad: 1.5, sparkle: 1.2,
      chords: [
        { bass: 73.42, tones: [293.66, 440.00, 587.33] },
        { bass: 55.00, tones: [220.00, 329.63, 493.88] },
        { bass: 61.74, tones: [246.94, 369.99, 493.88] },
        { bass: 49.00, tones: [196.00, 293.66, 440.00] },
        { bass: 73.42, tones: [293.66, 440.00, 587.33] },
        { bass: 46.25, tones: [185.00, 277.18, 369.99] },
        { bass: 55.00, tones: [220.00, 329.63, 493.88] },
        { bass: 49.00, tones: [196.00, 293.66, 440.00] }
      ],
      arp: [0, 3, 1, 3, 2, 3, 1, 0]
    },
    {
      id: 'rain', name: '雨', en: 'Rain',
      step: 0.46, wave: 'sine', gain: .95, pad: .9, sparkle: .8, rain: true,
      chords: [
        { bass: 65.41, tones: [261.63, 329.63, 392.00] },
        { bass: 49.00, tones: [196.00, 246.94, 293.66] },
        { bass: 55.00, tones: [220.00, 261.63, 329.63] },
        { bass: 43.65, tones: [174.61, 220.00, 261.63] },
        { bass: 58.27, tones: [233.08, 293.66, 349.23] },
        { bass: 49.00, tones: [196.00, 246.94, 293.66] },
        { bass: 55.00, tones: [220.00, 261.63, 329.63] },
        { bass: 65.41, tones: [261.63, 329.63, 392.00] }
      ],
      arp: [0, 2, 1, 2, 0, 2, 1, 2]
    },
    {
      id: 'birch', name: '白桦', en: 'Birch',
      step: 0.5, wave: 'sine', gain: 1, pad: 1.2, sparkle: .5,
      chords: [
        { bass: 82.41, tones: [164.81, 196.00, 246.94] },
        { bass: 65.41, tones: [130.81, 164.81, 196.00] },
        { bass: 49.00, tones: [196.00, 246.94, 293.66] },
        { bass: 73.42, tones: [146.83, 185.00, 220.00] },
        { bass: 82.41, tones: [164.81, 196.00, 246.94] },
        { bass: 55.00, tones: [220.00, 261.63, 329.63] },
        { bass: 49.00, tones: [196.00, 246.94, 293.66] },
        { bass: 61.74, tones: [246.94, 293.66, 369.99] }
      ],
      arp: [0, 2, 1, 2, 1, 2, 0, 1]
    },
    {
      id: 'orbit', name: '星轨', en: 'Orbit',
      step: 0.8, wave: 'triangle', gain: .85, pad: 1.4, sparkle: 1.4,
      chords: [
        { bass: 73.42, tones: [587.33, 739.99, 880.00] },
        { bass: 55.00, tones: [440.00, 554.37, 659.25] },
        { bass: 61.74, tones: [493.88, 587.33, 739.99] },
        { bass: 49.00, tones: [392.00, 493.88, 587.33] },
        { bass: 73.42, tones: [587.33, 739.99, 880.00] },
        { bass: 43.65, tones: [349.23, 440.00, 523.25] },
        { bass: 55.00, tones: [440.00, 554.37, 659.25] },
        { bass: 49.00, tones: [392.00, 493.88, 587.33] }
      ],
      arp: [0, 3, 2, 3, 1, 3, 2, 0]
    },
    {
      id: 'home', name: '归途', en: 'Homecoming',
      step: 0.56, wave: 'sine', gain: 1, pad: 1.1, sparkle: .6,
      chords: [
        { bass: 43.65, tones: [174.61, 220.00, 261.63] },
        { bass: 65.41, tones: [261.63, 329.63, 392.00] },
        { bass: 49.00, tones: [196.00, 246.94, 293.66] },
        { bass: 55.00, tones: [220.00, 261.63, 329.63] },
        { bass: 43.65, tones: [174.61, 220.00, 261.63] },
        { bass: 58.27, tones: [233.08, 293.66, 349.23] },
        { bass: 49.00, tones: [196.00, 246.94, 293.66] },
        { bass: 65.41, tones: [261.63, 329.63, 392.00] }
      ],
      arp: [0, 2, 3, 2, 1, 2, 3, 0]
    },
    {
      id: 'frost', name: '冻土', en: 'Frost',
      step: 0.9, wave: 'sine', gain: .9, pad: 1.6, sparkle: .35,
      chords: [
        { bass: 36.71, tones: [146.83, 174.61, 220.00] },
        { bass: 58.27, tones: [116.54, 174.61, 233.08] },
        { bass: 43.65, tones: [174.61, 220.00, 261.63] },
        { bass: 32.70, tones: [130.81, 164.81, 196.00] },
        { bass: 36.71, tones: [146.83, 174.61, 220.00] },
        { bass: 49.00, tones: [196.00, 246.94, 293.66] },
        { bass: 43.65, tones: [174.61, 220.00, 261.63] },
        { bass: 58.27, tones: [116.54, 174.61, 233.08] }
      ],
      arp: [0, 1, 2, 1, 0, 1, 2, 1]
    },
    {
      id: 'moscow', name: '莫斯科', en: 'Moscow',
      step: 0.48, wave: 'triangle', gain: .95, pad: 1, sparkle: .9,
      chords: [
        { bass: 41.20, tones: [164.81, 196.00, 246.94] },
        { bass: 55.00, tones: [220.00, 261.63, 329.63] },
        { bass: 36.71, tones: [146.83, 185.00, 220.00] },
        { bass: 49.00, tones: [196.00, 246.94, 293.66] },
        { bass: 41.20, tones: [164.81, 196.00, 246.94] },
        { bass: 61.74, tones: [246.94, 293.66, 369.99] },
        { bass: 55.00, tones: [220.00, 261.63, 329.63] },
        { bass: 36.71, tones: [146.83, 185.00, 220.00] }
      ],
      arp: [0, 2, 1, 3, 1, 2, 0, 2]
    }
  ];

  let ctx = null, master = null, bus = null, wetGain = null, rainNode = null;
  let timer = null, nextTime = 0, step = 0, playing = false, built = false;
  let trackId = 'canon', volume = 72;

  function track() {
    for (let i = 0; i < TRACKS.length; i++) if (TRACKS[i].id === trackId) return TRACKS[i];
    return TRACKS[0];
  }

  function impulse(seconds, decay) {
    const rate = ctx.sampleRate;
    const len = Math.floor(rate * seconds);
    const buf = ctx.createBuffer(2, len, rate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }

  function initAudio() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();

    master = ctx.createGain();
    master.gain.value = 0;

    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16;
    comp.ratio.value = 3;
    comp.attack.value = .01;

    master.connect(comp);
    comp.connect(ctx.destination);

    bus = ctx.createGain();
    bus.gain.value = 1;
    bus.connect(master);

    const conv = ctx.createConvolver();
    conv.buffer = impulse(3.2, 2.2);
    wetGain = ctx.createGain();
    wetGain.gain.value = .42;
    bus.connect(conv);
    conv.connect(wetGain);
    wetGain.connect(master);

    // 雨：一段循环的滤波噪声
    const len = ctx.sampleRate * 2;
    const noise = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = noise.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * 0.35;
    }
    const src = ctx.createBufferSource();
    src.buffer = noise; src.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = 1800; bp.Q.value = .6;
    const ng = ctx.createGain(); ng.gain.value = 0;
    src.connect(bp); bp.connect(ng); ng.connect(master);
    src.start();
    rainNode = ng;
  }

  function voice(freq, at, dur, type, level) {
    const t = track();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filt = ctx.createBiquadFilter();

    osc.type = type || t.wave || 'sine';
    osc.frequency.value = freq;
    filt.type = 'lowpass';
    filt.frequency.value = 3000;
    filt.Q.value = .5;

    const lv = level * (t.gain || 1);
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, lv), at + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);

    osc.connect(filt); filt.connect(gain); gain.connect(bus);
    osc.start(at); osc.stop(at + dur + 0.05);
  }

  function scheduleStep(chordIndex, stepIndex, at) {
    const t = track();
    const chord = t.chords[chordIndex];
    const idx = t.arp[stepIndex];

    if (idx === 3) voice(chord.tones[0] * 2, at, 1.6, 'sine', 0.05);
    else voice(chord.tones[idx], at, 1.3, null, 0.055);

    if (stepIndex === 0) {
      voice(chord.bass, at, t.step * 8 * .95, 'sine', 0.16 * (t.pad || 1));
      voice(chord.tones[2] / 2, at, t.step * 8 * .9, 'sine', 0.05 * (t.pad || 1));
    }
    if (stepIndex === 4 && t.sparkle) {
      voice(chord.tones[2] * 2, at, 2.4, 'sine', 0.03 * t.sparkle);
    }
  }

  function scheduleLoop() {
    if (!playing || !ctx) return;
    const t = track();
    while (nextTime < ctx.currentTime + 0.8) {
      const chordIndex = Math.floor(step / 8) % t.chords.length;
      scheduleStep(chordIndex, step % 8, nextTime);
      nextTime += t.step;
      step++;
    }
  }

  function applyVolume() {
    if (!master || !ctx) return;
    const v = Math.max(0, Math.min(100, volume)) / 100;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(playing ? v * 3.2 : 0, ctx.currentTime, 0.08);
  }

  function start() {
    initAudio();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    playing = true;
    nextTime = ctx.currentTime + 0.12;
    step = 0;
    if (rainNode) rainNode.gain.setTargetAtTime(track().rain ? 0.05 : 0, ctx.currentTime, 0.4);
    applyVolume();
    clearInterval(timer);
    timer = setInterval(scheduleLoop, 240);
    scheduleLoop();
    paint();
    try { localStorage.setItem(SAVE_ON, 'on'); } catch (e) { }
  }

  function stop() {
    if (!ctx) return;
    playing = false;
    clearInterval(timer);
    applyVolume();
    if (rainNode) rainNode.gain.setTargetAtTime(0, ctx.currentTime, 0.2);
    paint();
    try { localStorage.setItem(SAVE_ON, 'off'); } catch (e) { }
  }

  function setTrack(id, restart) {
    if (!TRACKS.some(function (t) { return t.id === id; })) return;
    trackId = id;
    try { localStorage.setItem(SAVE_TRACK, id); } catch (e) { }
    if (playing) {
      clearInterval(timer);
      step = 0;
      nextTime = ctx.currentTime + 0.1;
      if (rainNode) rainNode.gain.setTargetAtTime(track().rain ? 0.05 : 0, ctx.currentTime, 0.3);
      scheduleLoop();
      timer = setInterval(scheduleLoop, 240);
    }
    paint();
  }

  function randomTrack() {
    const others = TRACKS.filter(function (t) { return t.id !== trackId; });
    setTrack(others[Math.floor(Math.random() * others.length)].id, true);
    if (!playing) start();
  }

  /* ---------------- UI ---------------- */
  let btn = null, panel = null, painted = false;

  function paint() {
    if (!btn) return;
    btn.classList.toggle('on', playing);
    btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    btn.innerHTML = playing
      ? '<span class="mbars" aria-hidden="true"><i></i><i></i><i></i></span>'
      : '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M17 9.5a3.5 3.5 0 010 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity=".7"/></svg>';

    if (!panel) return;
    const t = track();
    const name = panel.querySelector('#mpNow');
    if (name) name.textContent = t.name;
    const play = panel.querySelector('#mpPlay');
    if (play) play.textContent = playing ? '暂停' : '播放';
    Array.prototype.forEach.call(panel.querySelectorAll('.mp-track'), function (el) {
      el.classList.toggle('on', el.dataset.id === t.id);
    });
    const vol = panel.querySelector('#mpVol');
    if (vol && !painted) { vol.value = volume; painted = true; }
    const num = panel.querySelector('#mpVolNum');
    if (num) num.textContent = volume;
  }

  function buildPanel() {
    panel = document.createElement('div');
    panel.className = 'music-panel';
    panel.id = 'musicPanel';
    panel.setAttribute('aria-hidden', 'true');
    panel.innerHTML =
      '<div class="mp-head"><span>声音</span><em>正在放：<b id="mpNow">卡农</b></em></div>' +
      '<div class="mp-row">' +
        '<label for="mpVol">音量</label>' +
        '<input id="mpVol" type="range" min="0" max="100" step="1" value="72" aria-label="音量" />' +
        '<b id="mpVolNum">72</b>' +
      '</div>' +
      '<div class="mp-list">' +
        TRACKS.map(function (t) {
          return '<button class="mp-track" type="button" data-id="' + t.id + '">' +
            '<i></i><span>' + t.name + '<em>' + t.en + '</em></span></button>';
        }).join('') +
      '</div>' +
      '<div class="mp-foot">' +
        '<button class="mp-btn" type="button" id="mpPlay">播放</button>' +
        '<button class="mp-btn" type="button" id="mpRandom">随机换一首</button>' +
      '</div>';
    document.body.appendChild(panel);

    panel.querySelector('#mpVol').addEventListener('input', function (e) {
      volume = parseInt(e.target.value, 10) || 0;
      try { localStorage.setItem(SAVE_VOL, String(volume)); } catch (err) { }
      applyVolume();
      paint();
    });
    panel.querySelector('#mpPlay').addEventListener('click', function () { playing ? stop() : start(); });
    panel.querySelector('#mpRandom').addEventListener('click', randomTrack);
    Array.prototype.forEach.call(panel.querySelectorAll('.mp-track'), function (el) {
      el.addEventListener('click', function () { setTrack(el.dataset.id, true); if (!playing) start(); });
    });

    document.addEventListener('click', function (e) {
      if (!panel.classList.contains('open')) return;
      if (panel.contains(e.target) || (btn && btn.contains(e.target))) return;
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
    });
  }

  function togglePanel() {
    if (!panel) return;
    const open = panel.classList.toggle('open');
    panel.setAttribute('aria-hidden', open ? 'false' : 'true');
  }

  function build() {
    if (built) return;
    const right = document.querySelector('.nav-right');
    if (!right) return;
    built = true;

    try {
      const v = parseInt(localStorage.getItem(SAVE_VOL) || '', 10);
      if (!isNaN(v)) volume = Math.max(0, Math.min(100, v));
      const tr = localStorage.getItem(SAVE_TRACK);
      if (tr && TRACKS.some(function (t) { return t.id === tr; })) trackId = tr;
    } catch (e) { }

    btn = document.createElement('button');
    btn.className = 'music-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', '声音设置');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      togglePanel();
      if (!playing) start();
    });
    right.insertBefore(btn, right.firstChild);

    buildPanel();
    paint();

    let saved = null;
    try { saved = localStorage.getItem(SAVE_ON); } catch (e) { }
    if (saved === 'on') {
      btn.classList.add('on');
      const resume = function (e) {
        if (e.target && e.target.closest && (e.target.closest('.music-btn') || e.target.closest('.music-panel'))) return;
        document.removeEventListener('pointerdown', resume);
        if (!playing) start();
      };
      document.addEventListener('pointerdown', resume);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }

  window.MusicKit = {
    start: start, stop: stop, setTrack: setTrack, random: randomTrack,
    isOn: function () { return playing; },
    volume: function (v) { if (v !== undefined) { volume = v; applyVolume(); paint(); } return volume; },
    state: function () { return ctx ? ctx.state : 'none'; },
    tracks: TRACKS.map(function (t) { return t.id; })
  };
})();
