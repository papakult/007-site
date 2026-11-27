function bindVvcReviewDeck(root = document) {
  const page = root.matches?.('.vvc-reviews') ? root : root.querySelector('.vvc-reviews');
  const carousel = page?.querySelector('.rv-carousel');
  const viewport = carousel?.querySelector('.deck-viewport');
  const stack = viewport?.querySelector('.deck-stack');
  if (!stack || carousel.dataset.deckReady) return;

  const cards = Array.from(stack.children).filter(node => node.matches('article.deck-card'));
  if (!cards.length) return;
  carousel.dataset.deckReady = 'true';
  const indexForKey = new Map(cards.map((card, index) => [card.dataset.key, index]));
  const previous = page.querySelector('.deck-prev');
  const next = page.querySelector('.deck-next');
  const count = page.querySelector('.deck-count');
  const strip = page.querySelector('.deck-photo-strip');
  const photoPrev = page.querySelector('.deck-photo-prev');
  const photoNext = page.querySelector('.deck-photo-next');
  const thumbs = Array.from(strip?.querySelectorAll('.deck-photo[data-target]') || []);
  const thumbsForKey = new Map();
  for (const thumb of thumbs) {
    const key = thumb.dataset.target;
    if (!thumbsForKey.has(key)) thumbsForKey.set(key, []);
    thumbsForKey.get(key).push(thumb);
    thumb.removeAttribute('aria-current');
  }
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let selected = 0;
  let painted = [];
  let transient = null;
  let animationTimer = 0;
  let pointer = null;

  for (const card of cards) {
    card.removeAttribute('data-depth');
    card.removeAttribute('data-enter');
    card.removeAttribute('data-exit');
    card.inert = true;
    card.setAttribute('aria-hidden', 'true');
  }
  carousel.classList.add('is-enhanced');
  stack.classList.add('is-ready');
  if (!viewport.hasAttribute('tabindex')) viewport.tabIndex = 0;
  if (count) {
    count.setAttribute('aria-live', 'polite');
    count.setAttribute('aria-atomic', 'true');
  }

  function setDisabled(button, disabled) {
    button?.setAttribute('aria-disabled', String(disabled));
  }

  function render() {
    const visible = cards.slice(selected, selected + 4);
    for (const card of painted) {
      if (!visible.includes(card)) card.removeAttribute('data-depth');
    }
    visible.forEach((card, depth) => { card.dataset.depth = String(depth); });
    painted = visible;
    const current = cards[selected];
    current.inert = false;
    current.setAttribute('aria-hidden', 'false');
    if (count) {
      count.textContent = (selected + 1) + ' / ' + cards.length;
      count.setAttribute('aria-label', 'Отзыв ' + (selected + 1) + ' из ' + cards.length);
    }
    setDisabled(previous, selected === 0);
    setDisabled(next, selected === cards.length - 1);
  }

  function revealThumb(button) {
    const rail = strip.getBoundingClientRect();
    const thumb = button.getBoundingClientRect();
    const left = rail.left + strip.clientLeft;
    const right = left + strip.clientWidth;
    const delta = thumb.left < left ? thumb.left - left : thumb.right > right ? thumb.right - right : 0;
    if (Math.abs(delta) > 1) strip.scrollBy({left: delta, behavior: motion.matches ? 'instant' : 'smooth'});
  }

  function markPhotos(key, active, reveal = true) {
    const group = thumbsForKey.get(key) || [];
    for (const thumb of group) {
      if (active) thumb.setAttribute('aria-current', 'true');
      else thumb.removeAttribute('aria-current');
    }
    if (active && reveal && group.length) revealThumb(group[0]);
  }

  function finishAnimation() {
    window.clearTimeout(animationTimer);
    if (transient) {
      transient.removeAttribute('data-enter');
      transient.removeAttribute('data-exit');
      transient = null;
    }
  }

  function resetDrag() {
    const id = pointer?.id;
    pointer = null;
    stack.classList.remove('is-dragging');
    stack.style.removeProperty('--drag-x');
    stack.style.removeProperty('--drag-tilt');
    if (id != null && viewport.hasPointerCapture(id)) viewport.releasePointerCapture(id);
  }

  function navigate(index, fromGallery = false) {
    resetDrag();
    if (index < 0 || index >= cards.length || index === selected) return;
    finishAnimation();
    const old = cards[selected];
    const step = index - selected;
    if (old.contains(document.activeElement)) viewport.focus({preventScroll: true});
    old.inert = true;
    old.setAttribute('aria-hidden', 'true');
    markPhotos(old.dataset.key, false);

    selected = index;
    if (!motion.matches && Math.abs(step) === 1) {
      if (step > 0) {
        transient = old;
        old.dataset.exit = 'next';
      } else {
        transient = cards[index];
        transient.dataset.enter = 'prev';
      }
      animationTimer = window.setTimeout(finishAnimation, 360);
    }
    render();
    markPhotos(cards[index].dataset.key, true, !fromGallery);
  }

  previous?.addEventListener('click', () => navigate(selected - 1));
  next?.addEventListener('click', () => navigate(selected + 1));
  page.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (!(viewport.contains(event.target) || event.target === previous || event.target === next)) return;
    if (event.target.closest('input, select, textarea, [contenteditable="true"]')) return;
    const actions = {ArrowLeft: selected - 1, ArrowRight: selected + 1, Home: 0, End: cards.length - 1};
    if (!Object.hasOwn(actions, event.key)) return;
    event.preventDefault();
    navigate(actions[event.key]);
  });

  viewport.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0 || pointer) return;
    if (event.target.closest('a, button, input, select, textarea, label, summary, [contenteditable="true"]')) return;
    if (event.target.closest('.deck-card') !== cards[selected]) return;
    finishAnimation();
    pointer = {id: event.pointerId, x: event.clientX, y: event.clientY, time: event.timeStamp, dragging: false};
    viewport.setPointerCapture(event.pointerId);
  });
  viewport.addEventListener('pointermove', event => {
    if (!pointer || pointer.id !== event.pointerId) return;
    const x = event.clientX - pointer.x;
    const y = event.clientY - pointer.y;
    if (!pointer.dragging) {
      if (Math.max(Math.abs(x), Math.abs(y)) < 7) return;
      if (Math.abs(y) >= Math.abs(x)) {
        resetDrag();
        return;
      }
      pointer.dragging = true;
      stack.classList.add('is-dragging');
    }
    const atEnd = (x > 0 && selected === 0) || (x < 0 && selected === cards.length - 1);
    const distance = atEnd ? x * .18 : x;
    stack.style.setProperty('--drag-x', distance.toFixed(1) + 'px');
    const tilt = motion.matches ? 0 : Math.max(-9, Math.min(9, distance / Math.max(1, viewport.clientWidth) * 15));
    stack.style.setProperty('--drag-tilt', tilt.toFixed(2) + 'deg');
  });
  viewport.addEventListener('pointerup', event => {
    if (!pointer || pointer.id !== event.pointerId) return;
    const x = event.clientX - pointer.x;
    const elapsed = Math.max(1, event.timeStamp - pointer.time);
    const threshold = Math.min(80, Math.max(38, viewport.clientWidth * .16));
    const swipe = pointer.dragging && (Math.abs(x) >= threshold || (Math.abs(x) >= 24 && Math.abs(x) / elapsed > .5));
    if (swipe) navigate(selected + (x < 0 ? 1 : -1));
    else resetDrag();
  });
  const cancelPointer = event => { if (pointer?.id === event.pointerId) resetDrag(); };
  viewport.addEventListener('pointercancel', cancelPointer);
  viewport.addEventListener('lostpointercapture', cancelPointer);
  viewport.addEventListener('dragstart', event => {
    if (!event.target.closest('a')) event.preventDefault();
  });
  window.addEventListener('blur', resetDrag);
  motion.addEventListener('change', () => { if (motion.matches) finishAnimation(); });

  if (strip && thumbs.length) {
    strip.addEventListener('click', event => {
      const thumb = event.target.closest('.deck-photo[data-target]');
      const index = thumb && indexForKey.get(thumb.dataset.target);
      if (Number.isInteger(index)) navigate(index, true);
    });
    function updateRail() {
      setDisabled(photoPrev, strip.scrollLeft <= 1);
      setDisabled(photoNext, strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 1);
    }
    function pageRail(direction) {
      const pitch = thumbs.length > 1
        ? thumbs[1].getBoundingClientRect().left - thumbs[0].getBoundingClientRect().left
        : strip.clientWidth;
      strip.scrollBy({left: direction * pitch * 3, behavior: motion.matches ? 'instant' : 'smooth'});
    }
    photoPrev?.addEventListener('click', () => pageRail(-1));
    photoNext?.addEventListener('click', () => pageRail(1));
    strip.addEventListener('scroll', updateRail, {passive: true});
    if ('ResizeObserver' in window) new ResizeObserver(updateRail).observe(strip);
    updateRail();
  }
  render();
  markPhotos(cards[0].dataset.key, true, false);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => bindVvcReviewDeck(), {once: true});
} else {
  bindVvcReviewDeck();
}
