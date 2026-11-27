function bindVvcReviews(root = document) {
  const carousel = root.querySelector('.rv-carousel');
  if (!carousel || carousel.hasAttribute('data-rv-bound')) return;
  const viewport = carousel.querySelector('.rv-viewport');
  const track = viewport?.querySelector('.rv-track');
  if (!track) return;
  const allSlides = Array.from(track.querySelectorAll('.rv-slide'));
  const withPhotos = allSlides.filter(slide => slide.dataset.hasPhoto === 'true');
  const region = carousel.closest('.vvc-reviews') || root;
  const filters = Array.from(region.querySelectorAll('.rv-filter[data-filter]'));
  let slides = allSlides;
  let activeFilter = 'all';

  carousel.dataset.rvBound = 'true';
  const previous = carousel.querySelector('.rv-prev');
  const next = carousel.querySelector('.rv-next');
  const position = carousel.querySelector('.rv-position');
  const progress = carousel.querySelector('.rv-progress i');
  const status = carousel.querySelector('[data-review-status]');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let indexBySlide;
  let last;
  let selected = -1;
  let api = null;

  function update(index) {
    if (index === selected) return;
    if (selected >= 0) {
      slides[selected].classList.remove('is-selected');
      slides[selected].removeAttribute('aria-current');
    }
    selected = index;
    const slide = slides[index];
    if (slide) {
      slide.classList.add('is-selected');
      slide.setAttribute('aria-current', 'true');
    }
    if (position) position.textContent = (index + 1) + ' / ' + slides.length;
    if (status) status.textContent = slide ? 'Отзыв ' + (index + 1) + ' из ' + slides.length : 'Отзывов с выбранным фильтром нет';
    if (progress) progress.style.width = (slide ? (index + 1) / slides.length * 100 : 0) + '%';
    previous?.setAttribute('aria-disabled', String(index <= 0));
    next?.setAttribute('aria-disabled', String(index >= last));
  }

  if (!viewport.hasAttribute('tabindex')) viewport.tabIndex = 0;
  allSlides.forEach(slide => {
    slide.classList.remove('is-selected');
    slide.removeAttribute('aria-current');
  });

  function mount() {
    indexBySlide = new Map(slides.map((slide, i) => [slide, i]));
    last = slides.length - 1;
    selected = -2;
    viewport.scrollLeft = 0;
    for (const filter of filters) {
      filter.setAttribute('aria-pressed', String(filter.dataset.filter === activeFilter));
    }
    if (!slides.length) {
      update(-1);
      return;
    }
    if (typeof window.EmblaCarousel === 'function') {
      try {
        carousel.classList.add('is-enhanced');
        api = window.EmblaCarousel(viewport, {
          align: 'center', containScroll: false, loop: false, watchFocus: false, watchSlides: false,
          container: track, slides, breakpoints: {'(prefers-reduced-motion: reduce)': {duration: 0}}
        });
        const sync = () => update(api.selectedScrollSnap());
        api.on('select', sync).on('reInit', sync);
        sync();
        return;
      } catch {
        api?.destroy();
        api = null;
        carousel.classList.remove('is-enhanced');
      }
    }
    viewport.style.overflowX = 'auto';
    viewport.style.scrollSnapType = 'x mandatory';
    update(0);
  }

  function applyFilter(value) {
    if (value === activeFilter || (value !== 'all' && value !== 'photo')) return;
    api?.destroy();
    api = null;
    carousel.classList.remove('is-enhanced');
    viewport.style.removeProperty('overflow-x');
    viewport.style.removeProperty('scroll-snap-type');
    if (selected >= 0) {
      slides[selected].classList.remove('is-selected');
      slides[selected].removeAttribute('aria-current');
    }
    activeFilter = value;
    slides = value === 'photo' ? withPhotos : allSlides;
    track.replaceChildren(...slides);
    mount();
  }

  for (const filter of filters) {
    filter.addEventListener('click', () => applyFilter(filter.dataset.filter));
  }
  mount();

  function middle(slide) {
    const bounds = slide.getBoundingClientRect();
    return bounds.left + bounds.width / 2;
  }

  function nativeSelected() {
    if (viewport.scrollLeft < 1) return 0;
    if (viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 1) return last;
    const center = middle(viewport);
    let low = 0;
    let high = last;
    while (low < high) {
      const mid = (low + high) >>> 1;
      if (middle(slides[mid]) < center) low = mid + 1;
      else high = mid;
    }
    return low > 0 && center - middle(slides[low - 1]) < middle(slides[low]) - center
      ? low - 1 : low;
  }

  let frame = 0;
  function syncNativeScroll() {
    if (api || !slides.length || frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (!api && slides.length) update(nativeSelected());
    });
  }
  viewport.addEventListener('scroll', syncNativeScroll, {passive: true});
  if ('ResizeObserver' in window) new ResizeObserver(syncNativeScroll).observe(viewport);

  function go(index, immediate = false) {
    if (index < 0 || index > last) return;
    const jump = immediate || motion.matches || Math.abs(index - selected) > 3;
    if (api) {
      api.scrollTo(index, jump);
    } else {
      const left = viewport.scrollLeft + middle(slides[index]) - middle(viewport);
      viewport.scrollTo({left, behavior: jump ? 'instant' : 'smooth'});
      if (jump) update(index);
    }
  }

  previous?.addEventListener('click', () => go(selected - 1));
  next?.addEventListener('click', () => go(selected + 1));

  carousel.addEventListener('focusin', event => {
    const slide = event.target.closest('.rv-slide');
    if (!indexBySlide.has(slide)) return;
    if (api && viewport.scrollLeft) viewport.scrollLeft = 0;
    go(indexBySlide.get(slide), true);
  });

  carousel.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey ||
        event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    const target = {ArrowLeft: selected - 1, ArrowRight: selected + 1, Home: 0, End: last}[event.key];
    if (typeof target !== 'number') return;
    event.preventDefault();
    if (target < 0 || target > last) return;
    if (event.target.closest('.rv-slide')) viewport.focus({preventScroll: true});
    go(target);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => bindVvcReviews(document), {once: true});
} else {
  bindVvcReviews(document);
}
