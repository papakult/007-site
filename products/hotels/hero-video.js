(() => {
  'use strict';
  document.querySelectorAll('[data-hotel-motion]').forEach(hero => {
    const video = hero.querySelector('.hotel-hero-video');
    const button = hero.querySelector('.hotel-hero-motion');
    if (!video || !button) return;
    const film = hero.querySelector('.hotel-film-dialog');
    const filmVideo = film?.querySelector('video');
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
      if (!requested || !visible || document.hidden || film?.open) {
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
    hero.querySelectorAll('[data-open-hotel-film]').forEach(open => {
      open.addEventListener('click', () => {
        if (!film || !filmVideo) return;
        film.showModal();
        if (!filmVideo.getAttribute('src')) filmVideo.src = filmVideo.dataset.src;
        const preview = hero.querySelector('#preview-video');
        preview?.pause();
        sync();
        filmVideo.currentTime = 0;
        filmVideo.play().catch(() => {});
      });
    });
    hero.querySelector('[data-close-hotel-film]')?.addEventListener('click', () => film.close());
    film?.addEventListener('close', () => {
      filmVideo.pause();
      sync();
    });
    film?.addEventListener('click', event => {
      if (event.target === film) {
        const box = film.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) film.close();
      }
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
