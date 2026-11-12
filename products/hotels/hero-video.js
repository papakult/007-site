(() => {
  'use strict';
  document.querySelectorAll('[data-hotel-motion]').forEach(hero => {
    const video = hero.querySelector('.hotel-hero-video');
    const button = hero.querySelector('.hotel-hero-motion');
    if (!video || !button) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let requested = !reduced.matches && !navigator.connection?.saveData;
    let visible = true;
    let failed = false;
    const updateButton = () => {
      button.textContent = requested ? 'Пауза видео' : 'Включить видео';
      button.setAttribute('aria-label', requested ? 'Остановить видео на обложке' : 'Включить видео на обложке');
    };
    const sync = () => {
      if (failed) return;
      if (!requested || !visible || document.hidden) {
        video.pause();
        return;
      }
      if (!video.getAttribute('src')) {
        video.src = video.dataset.src;
        video.muted = true;
      }
      video.play().catch(error => {
        if (failed || error.name === 'AbortError') return;
        if (visible && !document.hidden && requested) {
          requested = false;
          button.hidden = false;
          updateButton();
        }
      });
    };
    video.addEventListener('playing', () => {
      hero.classList.add('hotel-video-ready');
      button.hidden = false;
      updateButton();
    });
    video.addEventListener('error', () => {
      failed = true;
      video.pause();
      hero.classList.remove('hotel-video-ready');
      button.hidden = true;
    });
    button.addEventListener('click', () => {
      requested = !requested;
      updateButton();
      sync();
    });
    document.addEventListener('visibilitychange', sync);
    reduced.addEventListener('change', () => {
      requested = !reduced.matches && !navigator.connection?.saveData;
      if (reduced.matches) hero.classList.remove('hotel-video-ready');
      button.hidden = failed;
      updateButton();
      sync();
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        sync();
      }, { threshold: 0 }).observe(hero);
    }
    updateButton();
    sync();
  });
})();
