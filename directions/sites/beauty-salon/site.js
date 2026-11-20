'use strict';
(() => {
  const root = '/directions/sites/beauty-salon/';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const menu = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');
  function closeMenu() {
    if (!mobileNav) return;
    mobileNav.hidden = true; menu?.setAttribute('aria-expanded', 'false'); document.body.classList.remove('nav-open');
  }
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open)); mobileNav.hidden = !open; document.body.classList.toggle('nav-open', open);
  });
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  addEventListener('keydown', e => { if (e.key === 'Escape' && mobileNav && !mobileNav.hidden) { closeMenu(); menu?.focus(); } });
  matchMedia('(min-width:761px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
  document.querySelectorAll('.desktop-nav a, .mobile-nav a').forEach(a => {
    if (new URL(a.href).pathname === location.pathname) a.setAttribute('aria-current', 'page');
  });
  const dock = document.createElement('nav'); dock.className = 'mobile-dock'; dock.setAttribute('aria-label', 'Быстрый переход');
  const serviceLink = document.createElement('a'); serviceLink.href = root + 'services/'; serviceLink.textContent = 'Услуги';
  const visitLink = document.createElement('a'); visitLink.href = root + 'visit/'; visitLink.textContent = 'Выбрать визит'; dock.append(serviceLink, visitLink); document.body.append(dock);

  const video = document.querySelector('#hero-video');
  const videoButton = document.querySelector('#hero-video-toggle');
  if (video && videoButton) {
    let manualChoice = null;
    let visible = true;
    let sourcesLoaded = false;


    function showState() {
      const playing = !video.paused && !video.ended;
      videoButton.classList.toggle('is-playing', playing);
      videoButton.title = playing ? 'Приостановить видео' : 'Воспроизвести видео';
      videoButton.setAttribute('aria-label', playing ? 'Приостановить видео' : 'Воспроизвести видео');
    }
    function play() {
      if (!sourcesLoaded) {
        video.querySelectorAll('source').forEach(source => { source.src = source.dataset.src; });
        sourcesLoaded = true;
        video.load();
      }
      video.play().catch(showState);
    }
    function sync() {
      if (visible && !document.hidden && (manualChoice ?? !reduced.matches)) play();
      else video.pause();
    }
    videoButton.hidden = false;
    videoButton.addEventListener('click', () => {
      manualChoice = video.paused;
      sync();
    });
    video.addEventListener('playing', () => {
      video.classList.add('has-frame');
      showState();
    });
    video.addEventListener('pause', showState);
    video.addEventListener('error', () => {
      video.classList.remove('has-frame');
      videoButton.hidden = true;
    });
    reduced.addEventListener('change', () => { manualChoice = null; sync(); });
    document.addEventListener('visibilitychange', sync);
    if ('IntersectionObserver' in window) {
      dock.hidden = true;
      new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        sync();
      }).observe(video);
      new IntersectionObserver(([entry]) => { dock.hidden = entry.isIntersecting; }).observe(document.querySelector('.cover'));
    }
    sync();
  }

  for (const collection of document.querySelectorAll('.lookbook')) {
    const photo = collection.querySelector('[data-look-photo]');
    const name = collection.querySelector('[data-look-name]');
    const caption = collection.querySelector('[data-look-copy]');
    const procedure = collection.querySelector('[data-look-link]');
    const choices = collection.querySelectorAll('[data-look]');
    for (const choice of choices) {
      choice.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        photo.src = choice.href;
        photo.alt = choice.dataset.caption;
        name.textContent = choice.dataset.name;
        caption.textContent = choice.dataset.caption;
        procedure.href = root + 'procedures/' + choice.dataset.procedure + '/';
        for (const item of choices) item.setAttribute('aria-current', String(item === choice));
      });
    }
  }

  const summary = document.querySelector('#visit-summary');
  if (summary) {
    const serviceButtons = [...document.querySelectorAll('[data-visit-service]')];
    const timeButtons = [...document.querySelectorAll('[data-visit-time]')];
    const saveButton = document.querySelector('#save-visit');
    let service = '', duration = '', time = '';
    function render() {
      summary.textContent = service ? `${service} · ${duration}${time ? ' · ' + time : ''}. Это пример визита; бронирование не производится.` : 'Выберите процедуру — здесь появится ваш план визита.';
      if (saveButton) saveButton.disabled = !service;
    }
    serviceButtons.forEach(button => button.addEventListener('click', () => {
      service = button.querySelector('span').textContent;
      duration = button.dataset.duration + ' минут'; serviceButtons.forEach(b => b.setAttribute('aria-pressed', String(b === button))); render();
    }));
    timeButtons.forEach(button => button.addEventListener('click', () => { time = button.dataset.visitTime; timeButtons.forEach(b => b.setAttribute('aria-pressed', String(b === button))); render(); }));
    saveButton?.addEventListener('click', () => {
      if (!service) return;
      const contents = `MUSE — мой план визита\n\n${service}\n${duration}\n${time || 'Время не выбрано'}\n\nДемонстрационный проект 007-A. План не является записью.\nhttps://007-a.ru/directions/sites/beauty-salon/\n`;
      const url = URL.createObjectURL(new Blob([contents], { type: 'text/plain;charset=utf-8' }));
      const link = document.createElement('a'); link.href = url; link.download = 'MUSE-my-visit.txt'; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000);
    });
    const aliases = { hair: 'precision-cut', nails: 'manicure', makeup: 'evening-makeup', brows: 'brow-architecture' };
    const query = new URLSearchParams(location.search).get('service');
    const chosen = serviceButtons.find(b => b.dataset.visitService === (aliases[query] || query));
    if (chosen) chosen.click(); else render();
  }
})();
