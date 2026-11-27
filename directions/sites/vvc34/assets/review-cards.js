function bindVvcReviews(root) {
  const page = root.querySelector('[data-reviews-page]');
  if (!page || page.dataset.reviewsBound) return;
  page.dataset.reviewsBound = 'true';
  const track = page.querySelector('[data-review-track]');
  const cards = Array.from(track.querySelectorAll('[data-review-card]'));
  if (cards.length === 0) page.querySelector('[data-review-selection]').hidden = true;
  if (cards.length > 1) {
    const controls = page.querySelector('[data-review-controls]');
    const back = controls.querySelector('[data-review-back]');
    const next = controls.querySelector('[data-review-next]');
    const count = controls.querySelector('[data-review-count]');
    const status = controls.querySelector('[data-review-status]');
    let selected = -1;
    let queuedFrame = 0;
    controls.hidden = false;

    function synchronize() {
      queuedFrame = 0;
      const trackLeft = track.getBoundingClientRect().left;
      let nearest = 0;
      for (let i = 1; i < cards.length; i++) {
        if (Math.abs(cards[i].getBoundingClientRect().left - trackLeft) <
            Math.abs(cards[nearest].getBoundingClientRect().left - trackLeft)) nearest = i;
      }
      if (nearest === selected) return;
      selected = nearest;
      count.textContent = (selected + 1) + ' / ' + cards.length;
      status.textContent = 'Отзыв ' + (selected + 1) + ' из ' + cards.length;
      back.setAttribute('aria-disabled', String(selected === 0));
      next.setAttribute('aria-disabled', String(selected === cards.length - 1));
    }
    function schedule() {
      if (!queuedFrame) queuedFrame = requestAnimationFrame(synchronize);
    }
    function go(index) {
      const target = cards[index];
      if (!target) return;
      const left = track.scrollLeft + target.getBoundingClientRect().left - track.getBoundingClientRect().left;
      track.scrollTo({left, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    }
    back.addEventListener('click', () => go(selected - 1));
    next.addEventListener('click', () => go(selected + 1));
    track.addEventListener('scroll', schedule, {passive: true});
    if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(track);
    page.querySelector('[data-review-selection]').addEventListener('keydown', event => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const direction = {'ArrowLeft':selected - 1,'ArrowRight':selected + 1,'Home':0,'End':cards.length - 1};
      if (!Object.prototype.hasOwnProperty.call(direction, event.key)) return;
      event.preventDefault();
      go(direction[event.key]);
    });
    synchronize();
  }
  const load = page.querySelector('[data-reviews-load]');
  const widget = page.querySelector('[data-review-widget]');
  load.addEventListener('click', () => {
    if (widget.hidden) {
      const frame = document.createElement('iframe');
      frame.title = 'Отзывы о Волгоградском ветеринарном центре на Яндекс Картах';
      frame.referrerPolicy = 'no-referrer';
      frame.src = 'https://yandex.ru/maps-reviews-widget/1066278690?comments';
      widget.hidden = false;
      widget.replaceChildren(frame);
      load.textContent = 'Скрыть отзывы Яндекса';
      load.setAttribute('aria-expanded','true');
    } else {
      widget.hidden = true;
      widget.replaceChildren();
      load.textContent = 'Загрузить отзывы Яндекса';
      load.setAttribute('aria-expanded','false');
    }
  });
}

bindVvcReviews(document.querySelector('main'));
