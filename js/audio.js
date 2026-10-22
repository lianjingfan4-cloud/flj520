/* ============================================================
   audio.js — 点击声 / 雪声（全部 WebAudio 合成，不用音频文件）
   ------------------------------------------------------------
   设置里两个开关：
     · 点击声（默认开）
     · 雪的声音（默认关，开了才有风雪底噪）
   ============================================================ */
(function () {
  'use strict';

  let ctx = null, master = null;
  let snowGain = null, snowSrc = null, snowOn = false;
  let last = 0;

  function ensure() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
    return ctx;
  }

  function off(cls) {
    return document.documentElement.classList.contains(cls);
  }

  /* 一下很轻的"嗒" */
  function tick() {
    if (off('off-sfx')) return;
    const now = performance.now();
    if (now - last < 45) return;
    last = now;
    if (!ensure()) return;
    if (ctx.state === 'suspended') ctx.resume();

    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    o.type = 'sine';
    o.frequency.setValueAtTime(880, t);
    o.frequency.exponentialRampToValueAtTime(520, t + 0.06);
    f.type = 'lowpass';
    f.frequency.value = 3200;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.05, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    o.connect(f); f.connect(g); g.connect(master);
    o.start(t); o.stop(t + 0.1);
  }

  /* 风雪：带通噪声 + 慢速起伏 */
  function snowStart() {
    if (snowOn || !ensure()) return;
    if (ctx.state === 'suspended') ctx.resume();
    snowOn = true;

    const len = ctx.sampleRate * 3;
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * 0.5;
    }
    snowSrc = ctx.createBufferSource();
    snowSrc.buffer = buf;
    snowSrc.loop = true;

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 700;
    bp.Q.value = 0.7;

    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 220;

    snowGain = ctx.createGain();
    snowGain.gain.value = 0;

    snowSrc.connect(hp); hp.connect(bp); bp.connect(snowGain); snowGain.connect(master);
    snowSrc.start();

    const t = ctx.currentTime;
    snowGain.gain.setTargetAtTime(0.11, t, 1.2);

    // 缓慢的强弱起伏
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.07;
    lfoGain.gain.value = 0.045;
    lfo.connect(lfoGain); lfoGain.connect(snowGain.gain);
    lfo.start();
  }

  function snowStop() {
    if (!snowOn || !snowGain) return;
    snowGain.gain.setTargetAtTime(0, ctx.currentTime, 0.6);
    snowOn = false;
  }

  function sync() {
    if (off('off-snowsound')) snowStop();
    else if (!document.hidden) snowStart();
  }

  document.addEventListener('pointerdown', tick, { passive: true });
  window.addEventListener('settingschange', sync);
  document.addEventListener('visibilitychange', sync);

  setTimeout(sync, 1200);
  window.SoundKit = { tick: tick, snow: snowStart, quiet: snowStop };
})();
