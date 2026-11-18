(() => {
  const container = document.querySelector('[data-cover-sequence]');
  if (!container) return;
  const cover = container.querySelector('.portrait-cover');
  const photos = [...cover.querySelectorAll('.portrait-art > img')];
  const caption = cover.querySelector('[data-cover-caption]');
  if (photos.length !== 3 || !caption) return;

  const header = document.querySelector('.site-header');
  const originalCaption = [...caption.childNodes].map(node => node.cloneNode(true));
  const motion = window.matchMedia('(prefers-reduced-motion: no-preference) and (min-height: 570px)');
  const names = photos.map(img => img.dataset.sceneTitle);
  const controls = document.createElement('div');
  controls.className = 'cover-scenes';
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', 'Кадры обложки');

  let active = -1;
  let manualPosition = 0;
  let inset = 0;
  let pinned = false;
  let frameRequest = 0;
  let visible = true;

  const limit = value => Math.max(0, Math.min(1, value));

  function dissolve(position, start, end) {
    const t = limit((position - start) / (end - start));
    return t * t * (3 - 2 * t);
  }

  function applyScene(index) {
    if (index === active) return;
    active = index;
    photos.forEach((img, n) => {
      img.setAttribute('aria-hidden', String(n !== index));
      buttons[n].setAttribute('aria-pressed', String(n === index));
    });
    if (index === 0) caption.replaceChildren(...originalCaption.map(node => node.cloneNode(true)));
    else if (photos[index].dataset.sceneCopy) caption.textContent = photos[index].dataset.sceneCopy;
  }

  function paint() {
    frameRequest = 0;
    const bounds = container.getBoundingClientRect();
    const travel = Math.max(1, bounds.height - cover.offsetHeight);
    const position = pinned ? limit((inset - bounds.top) / travel) : manualPosition;
    const second = dissolve(position, .15, .42);
    const third = dissolve(position, .56, .85);
    const fades = [1, second, third];
    let reading = 0;

    photos.forEach((img, n) => {
      // A late, slow or unavailable image never obscures an already loaded photograph.
      const ready = n === 0 || (img.complete && img.naturalWidth > 0);
      const alpha = ready ? fades[n] : 0;
      const local = limit(position * 2 - n + .4);
      img.style.setProperty('--frame-opacity', alpha.toFixed(3));
      if (n === 1) cover.style.setProperty('--meeting-mat', alpha.toFixed(3));
      img.style.setProperty('--frame-scale', pinned ? (1 + .027 * local).toFixed(4) : '1');
      if (alpha >= .5) reading = n;
    });
    applyScene(reading);
  }

  function schedulePaint() {
    if (!frameRequest) frameRequest = window.requestAnimationFrame(paint);
  }

  function measure() {
    inset = header ? Math.round(header.getBoundingClientRect().height) : 0;
    container.style.setProperty('--cover-inset', inset + 'px');
    pinned = motion.matches && CSS.supports('position', 'sticky');
    container.classList.toggle('is-pinned', pinned);
    schedulePaint();
  }

  function select(index, fromKeyboard) {
    const position = index / (photos.length - 1);
    if (pinned) {
      const bounds = container.getBoundingClientRect();
      const travel = Math.max(0, bounds.height - cover.offsetHeight);
      const top = window.scrollY + bounds.top - inset + travel * position;
      window.scrollTo({ top, behavior: fromKeyboard ? 'instant' : 'smooth' });
    } else {
      manualPosition = position;
    }
    schedulePaint();
  }

  const buttons = photos.map((img, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = names[index];
    button.setAttribute('aria-pressed', String(index === 0));
    button.addEventListener('click', event => select(index, event.detail === 0));
    button.addEventListener('keydown', event => {
      let next;
      switch (event.key) {
        case 'ArrowLeft': next = (index + photos.length - 1) % photos.length; break;
        case 'ArrowRight': next = (index + 1) % photos.length; break;
        case 'Home': next = 0; break;
        case 'End': next = photos.length - 1; break;
        default: return;
      }
      event.preventDefault();
      buttons[next].focus({ preventScroll: true });
      select(next, true);
    });
    controls.append(button);
    img.addEventListener('load', schedulePaint);
    return button;
  });

  cover.append(controls);
  container.classList.add('is-ready');
  measure();
  paint();

  // Start the extra stills after the initial cover has had a chance to paint.
  function prepareAdditionalFrames() {
    for (const img of photos.slice(1)) {
      img.loading = 'eager';
      if (typeof img.decode === 'function') img.decode().then(schedulePaint, schedulePaint);
    }
  }
  if ('requestIdleCallback' in window) window.requestIdleCallback(prepareAdditionalFrames, { timeout: 700 });
  else window.requestAnimationFrame(prepareAdditionalFrames);

  window.addEventListener('scroll', () => {
    if (visible && pinned) schedulePaint();
  }, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  if (motion.addEventListener) motion.addEventListener('change', measure);
  else if (motion.addListener) motion.addListener(measure);
  if (header && 'ResizeObserver' in window) new ResizeObserver(measure).observe(header);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedulePaint();
    }).observe(container);
  }
})();
