(() => {
  'use strict';
  const wrap = document.querySelector('.cinema-wrap');
  const stage = wrap.querySelector('.cinema-stage');
  const canvas = document.querySelector('#hero-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const intro = document.querySelector('#intro-decoder');
  const pauseButton = document.querySelector('#motion-toggle');
  const filmDialog = document.querySelector('#film-dialog');
  const filmPlayer = filmDialog.querySelector('video');
  const copies = [...wrap.querySelectorAll('.scene-copy')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection?.saveData === true;
  const mobile = () => innerWidth <= 600;
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const frames = new Map();
  const pending = new Map();
  let frameCount = 240;
  let wanted = 0;
  let queue = [];
  let active = 0;
  let target = 0;
  let progress = 0;
  let paused = reduced || saveData;
  let visible = true;
  let manifestReady = false;
  let mode = 'intro';
  let blend = null;
  let lastVideoTime = -1;
  let lastFrame = -1;
  let dirty = true;
  let previousTime = performance.now();
  let trigger;

  function size() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, mobile() ? 1.5 : 1.7);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    dirty = true;
  }
  function draw(source, p = progress) {
    const w = source.width || source.videoWidth || source.naturalWidth;
    const h = source.height || source.videoHeight || source.naturalHeight;
    if (!w || !h || !canvas.width || !canvas.height) return false;
    ctx.fillStyle = '#190c06';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (mobile()) {
      const zoomOut = smooth(0.52, 1, p);
      const left = 0.42 - 0.16 * zoomOut;
      const sw = w * (1 - left);
      const ratio = Math.min(canvas.width / sw, canvas.height / h);
      const dw = sw * ratio;
      const dh = h * ratio;
      const dx = (canvas.width - dw) / 2;
      const dy = (canvas.height - dh) / 2;
      ctx.drawImage(source, w * left, 0, sw, h, dx, dy, dw, dh);
      const feather = Math.min(dh * 0.13, 70 * (canvas.width / innerWidth));
      const topShade = ctx.createLinearGradient(0, dy, 0, dy + feather);
      topShade.addColorStop(0, '#190c06');
      topShade.addColorStop(1, '#190c0600');
      ctx.fillStyle = topShade;
      ctx.fillRect(dx, dy, dw, feather);
      const bottomShade = ctx.createLinearGradient(0, dy + dh - feather, 0, dy + dh);
      bottomShade.addColorStop(0, '#190c0600');
      bottomShade.addColorStop(1, '#190c06');
      ctx.fillStyle = bottomShade;
      ctx.fillRect(dx, dy + dh - feather, dw, feather);
    } else {
      const ratio = Math.max(canvas.width / w, canvas.height / h);
      const dw = w * ratio;
      const dh = h * ratio;
      ctx.drawImage(source, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
    }
    canvas.classList.add('ready');
    dirty = false;
    return true;
  }
  const poster = new Image();
  poster.onload = () => { if (!intro.videoWidth && mode === 'intro') draw(poster, 0); };
  poster.src = 'assets/film/start.jpg';
  function evict() {
    const cap = mobile() ? 20 : 40;
    if (frames.size <= cap) return;
    const keys = [...frames.keys()].sort((a, b) => Math.abs(b - wanted) - Math.abs(a - wanted));
    for (const key of keys.slice(0, frames.size - cap)) {
      frames.get(key)?.close?.();
      frames.delete(key);
    }
  }
  async function loadFrame(index) {
    const response = await fetch(`assets/film/frames/frame_${String(index + 1).padStart(4, '0')}.webp`);
    if (!response.ok) throw new Error(`Frame unavailable: ${index}`);
    const blob = await response.blob();
    if (window.createImageBitmap) return createImageBitmap(blob);
    const image = new Image();
    const url = URL.createObjectURL(blob);
    image.src = url;
    try { await image.decode(); return image; } finally { URL.revokeObjectURL(url); }
  }
  function pump() {
    while (active < 4 && queue.length) {
      const index = queue.shift();
      if (frames.has(index) || pending.has(index)) continue;
      active++;
      const task = loadFrame(index).then(image => {
        frames.set(index, image);
        dirty = true;
        evict();
      }).catch(() => {}).finally(() => { pending.delete(index); active--; pump(); });
      pending.set(index, task);
    }
  }
  function prioritize(index) {
    wanted = clamp(index, 0, frameCount - 1);
    if (!manifestReady || paused) return;
    const radius = mobile() ? 9 : 18;
    queue = [];
    for (let distance = 0; distance <= radius; distance++) {
      const candidates = distance ? [wanted + distance, wanted - distance] : [wanted];
      for (const candidate of candidates) {
        if (candidate >= 0 && candidate < frameCount && !frames.has(candidate) && !pending.has(candidate)) queue.push(candidate);
      }
    }
    evict();
    pump();
  }
  function nearest(index) {
    if (frames.has(index)) return { index, image: frames.get(index) };
    for (let distance = 1; distance <= 10; distance++) {
      for (const i of [index - distance, index + distance]) if (frames.has(i)) return { index: i, image: frames.get(i) };
    }
    return null;
  }
  function setCopy(element, opacity, y) {
    element.style.opacity = String(opacity);
    element.style.visibility = opacity > 0.01 ? 'visible' : 'hidden';
    element.style.transform = `translateY(${y}px)`;
    element.style.pointerEvents = opacity > 0.6 ? 'auto' : 'none';
    element.inert = opacity < 0.6;
  }
  function updateCopy(p) {
    const opening = 1 - smooth(0.07, 0.22, p);
    const middle = smooth(0.22, 0.34, p) * (1 - smooth(0.48, 0.62, p));
    const ending = smooth(0.72, 0.88, p);
    setCopy(copies[0], opening, -30 * (1 - opening));
    setCopy(copies[1], middle, 20 * (1 - middle));
    setCopy(copies[2], ending, 20 * (1 - ending));
    wrap.style.setProperty('--scene-shade', String(middle * 0.85));
    wrap.querySelector('.hero-caption').style.opacity = String(1 - smooth(0.6, 0.8, p));
    wrap.querySelector('.scene-rail i').style.transform = `scaleX(${p})`;
    document.querySelector('#scene-label').textContent = p < 0.12 ? 'ЛИСТАЙТЕ, КОФЕ ПРОДОЛЖАЕТ ИСТОРИЮ' : p < 0.65 ? 'ВКУС В ДВИЖЕНИИ' : 'ДАЛЬШЕ ВАША ЧАШКА';
    wrap.dataset.sceneProgress = p.toFixed(3);
  }
  function playIntro() {
    if (!paused && visible && !document.hidden && !filmDialog.open) intro.play().catch(() => {
      pauseButton.textContent = 'Включить';
      pauseButton.setAttribute('aria-label', 'Включить движение');
    });
  }
  function enterJourney(now) {
    if (mode === 'journey') return;
    const shot = document.createElement('canvas');
    shot.width = canvas.width;
    shot.height = canvas.height;
    shot.getContext('2d').drawImage(canvas, 0, 0);
    blend = { image: shot, started: now };
    intro.pause();
    mode = 'journey';
    dirty = true;
  }
  function enterIntro() {
    if (mode === 'intro') return;
    mode = 'intro';
    blend = null;
    intro.currentTime = 0;
    lastVideoTime = -1;
    dirty = true;
    playIntro();
  }
  function tick(now) {
    const delta = Math.min(80, now - previousTime);
    previousTime = now;
    if (!paused && visible && !document.hidden && !filmDialog.open) {
      progress += (target - progress) * (1 - Math.exp(-delta / 90));
      if (Math.abs(progress - target) < 0.0002) progress = target;
      updateCopy(progress);
      if (progress > 0.002) {
        const index = Math.round(progress * (frameCount - 1));
        if (index !== wanted) prioritize(index);
        const frame = nearest(index);
        if (frame) {
          enterJourney(now);
          if (dirty || lastFrame !== frame.index || blend) {
            draw(frame.image);
            lastFrame = frame.index;
            wrap.dataset.sceneFrame = String(frame.index);
            if (blend) {
              const alpha = 1 - clamp((now - blend.started) / 220);
              ctx.globalAlpha = alpha;
              ctx.drawImage(blend.image, 0, 0, canvas.width, canvas.height);
              ctx.globalAlpha = 1;
              if (!alpha) blend = null;
            }
          }
        }
      } else {
        enterIntro();
        if (intro.readyState >= 2 && (dirty || Math.abs(intro.currentTime - lastVideoTime) > 1 / 45)) {
          draw(intro, 0);
          lastVideoTime = intro.currentTime;
        } else if (dirty && poster.complete) draw(poster, 0);
      }
    } else if (dirty && poster.complete && !canvas.classList.contains('ready')) draw(poster, 0);
    requestAnimationFrame(tick);
  }
  size();
  addEventListener('resize', () => { size(); if (mode === 'intro' && poster.complete && !intro.videoWidth) draw(poster, 0); });
  if (reduced || saveData) {
    document.documentElement.classList.add('scene-static');
    pauseButton.textContent = 'Включить';
    pauseButton.setAttribute('aria-label', 'Включить движение');
  } else {
    intro.preload = 'auto';
    intro.load();
    intro.addEventListener('loadeddata', playIntro, { once: true });
  }
  function measure() {
    target = clamp(-wrap.getBoundingClientRect().top / Math.max(1, wrap.offsetHeight - stage.offsetHeight));
  }
  addEventListener('scroll', measure, { passive: true });
  addEventListener('resize', measure, { passive: true });
  function connectScroll() {
    trigger?.kill();
    if (!document.documentElement.classList.contains('scene-static') && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      trigger = ScrollTrigger.create({ trigger: wrap, start: 'top top', end: 'bottom bottom', onUpdate: measure, onRefresh: measure });
      measure();
    }
  }
  connectScroll();
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (!visible) intro.pause(); else if (mode === 'intro') playIntro();
  });
  observer.observe(stage);
  document.addEventListener('visibilitychange', () => { if (document.hidden) intro.pause(); else if (mode === 'intro') playIntro(); });
  async function loadManifest() {
    try {
      const response = await fetch('assets/film/manifest.json');
      if (!response.ok) return;
      const manifest = await response.json();
      frameCount = manifest.count;
      manifestReady = true;
      prioritize(wanted);
    } catch (_) {}
  }
  if (!paused) loadManifest();
  pauseButton.addEventListener('click', () => {
    paused = !paused;
    pauseButton.textContent = paused ? 'Продолжить' : 'Пауза';
    pauseButton.setAttribute('aria-label', paused ? 'Включить движение' : 'Остановить движение');
    pauseButton.setAttribute('aria-pressed', String(paused));
    if (paused) intro.pause(); else {
      if (document.documentElement.classList.contains('scene-static')) {
        document.documentElement.classList.remove('scene-static');
        intro.preload = 'auto';
        intro.load();
        connectScroll();
        size();
      }
      if (!manifestReady) loadManifest(); else prioritize(wanted);
      if (mode === 'intro') playIntro();
    }
  });
  document.querySelector('#watch-film').addEventListener('click', () => {
    intro.pause();
    filmDialog.showModal();
    document.body.style.overflow = 'hidden';
    filmPlayer.play().catch(() => {});
  });
  filmDialog.querySelector('.close-film').addEventListener('click', () => filmDialog.close());
  filmDialog.addEventListener('close', () => {
    filmPlayer.pause();
    document.body.style.overflow = '';
    if (mode === 'intro') playIntro();
    document.querySelector('#watch-film').focus({ preventScroll: true });
  });
  updateCopy(0);
  requestAnimationFrame(tick);

  if (new URLSearchParams(location.search).get('tour') === '1' && !reduced) {
    document.documentElement.style.scrollBehavior = 'auto';
    setTimeout(() => {
      const start = performance.now();
      let opened = false;
      let submitted = false;
      function tour(now) {
        const t = (now - start) / 1000;
        const travel = wrap.offsetHeight - stage.offsetHeight;
        const menu = document.querySelector('#menu');
        let y = 0;
        if (t > 4 && t < 16) y = ((t - 4) / 12) * travel;
        else if (t >= 16 && t < 19) y = travel + smooth(16, 19, t) * (menu.offsetTop + 250 - travel);
        else if (t >= 19) y = menu.offsetTop + 250;
        if (!opened) scrollTo({ top: y, behavior: 'instant' });
        if (t >= 22 && !opened) {
          document.querySelector('.add-drink[data-drink="flatwhite"]').click();
          document.querySelectorAll('#size-options input')[1].checked = true;
          const milk = document.querySelector('#order-milk');
          milk.selectedIndex = 1;
          milk.dispatchEvent(new Event('change', { bubbles: true }));
          opened = true;
        }
        if (t >= 25 && !submitted) { document.querySelector('#order-form').requestSubmit(); submitted = true; }
        if (t < 29) requestAnimationFrame(tour);
      }
      requestAnimationFrame(tour);
    }, 1500);
  }
})();
