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
  if (video) {
    let userPaused = false, visible = true;
    if (matchMedia('(max-width:760px)').matches) video.poster = root + 'assets/hero-mobile-poster.webp';
    video.muted = true; video.defaultMuted = true; video.playsInline = true;
    function syncVideoButton() {
      if (!videoButton) return;
      const playing = !video.paused;
      videoButton.firstChild.nodeValue = playing ? 'Пауза' : 'Смотреть';
      videoButton.setAttribute('aria-label', playing ? 'Приостановить фоновое видео' : 'Воспроизвести фоновое видео');
      videoButton.querySelector('span').textContent = playing ? 'Ⅱ' : '✷';
    }
    function resumeVideo() {
      if (userPaused || reduced.matches || document.hidden || !visible) return;
      video.play().catch(syncVideoButton);
    }
    video.addEventListener('play', syncVideoButton); video.addEventListener('pause', syncVideoButton);
    videoButton?.addEventListener('click', () => {
      if (video.paused) { userPaused = false; video.play().catch(syncVideoButton); }
      else { userPaused = true; video.pause(); }
    });
    reduced.addEventListener('change', e => { if (e.matches) video.pause(); else resumeVideo(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); else resumeVideo(); });
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) resumeVideo(); else video.pause();
    }, { threshold: .01 }).observe(video);
    if (reduced.matches) { video.autoplay = false; video.pause(); syncVideoButton(); } else resumeVideo();
  }

  const treatments = {
    'precision-cut': { name: 'Стрижка и укладка', copy: 'Форма с учётом текстуры волос и вашего ритма. Обсуждение длины, точная стрижка и завершающая укладка.', price: '6 500 ₽', duration: '75 минут', image: 'styling.webp', alt: 'Работа стилиста с формой и текстурой волос' },
    'signature-color': { name: 'Окрашивание Signature', copy: 'Ровный оттенок с глубиной и блеском. Обсуждение цвета, окрашивание и завершающая укладка.', price: '9 500 ₽', duration: '120 минут', image: 'color.webp', alt: 'Нанесение красителя на прядь волос' },
    'balayage': { name: 'Мягкое осветление', copy: 'Световые пряди и мягкая растяжка оттенка. Обсуждение рисунка, осветление, тонирование и укладка.', price: '16 000 ₽', duration: '180 минут', image: 'color.webp', alt: 'Точная работа с осветлением волос' },
    'hair-care': { name: 'Уход и укладка', copy: 'Внимание к длине и фактуре. Подбор ухода, работа с волосами и мягкая укладка, которая завершает образ.', price: '5 500 ₽', duration: '60 минут', image: 'styling.webp', alt: 'Укладка каштановых волн с брашингом' },
    'manicure': { name: 'Маникюр с покрытием', copy: 'Аккуратная форма, выбранная вами палитра и точный блик. Все детали любимого жеста.', price: '4 200 ₽', duration: '90 минут', image: 'nails.webp', alt: 'Маникюр глубокого вишнёвого оттенка' },
    'pedicure': { name: 'Педикюр с покрытием', copy: 'Обработка стоп и ногтей, выбор формы и оттенка. Самостоятельная процедура с понятным составом визита.', price: '5 500 ₽', duration: '90 минут', image: 'nails.webp', alt: 'Палитра вишнёвого оттенка для ногтевого сервиса' },
    'evening-makeup': { name: 'Вечерний макияж', copy: 'Живой тон и выразительные акценты для вашего события. Свет, одежда и настроение помогают собрать образ.', price: '7 500 ₽', duration: '75 минут', image: 'makeup.webp', alt: 'Вечерний макияж с бронзовым акцентом' },
    'brow-architecture': { name: 'Форма и окрашивание', copy: 'Линия и оттенок, которые подчёркивают ваш взгляд. Обсуждение насыщенности, форма и аккуратный цвет.', price: '3 500 ₽', duration: '45 минут', image: 'hero.webp', alt: 'Естественная форма бровей в портрете MUSE' }
  };
  const treatmentButtons = [...document.querySelectorAll('[data-treatment]')];
  treatmentButtons.forEach(button => button.addEventListener('click', () => {
    const slug = button.dataset.treatment, item = treatments[slug]; if (!item) return;
    treatmentButtons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    const image = document.querySelector('#treat-image'); image.src = root + 'assets/' + item.image; image.alt = item.alt;
    document.querySelector('#treat-name').textContent = item.name; document.querySelector('#treat-copy').textContent = item.copy;
    document.querySelector('#treat-price').textContent = item.price; document.querySelector('#treat-duration').textContent = item.duration;
    document.querySelector('#treat-link').href = root + 'procedures/' + slug + '/';
  }));

  let priorFocus;
  document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => button.closest('dialog')?.close()));
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); priorFocus?.focus(); });
    dialog.addEventListener('click', e => { const box = dialog.getBoundingClientRect(); if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) dialog.close(); });
  });
  const imageDialog = document.querySelector('#image-dialog');
  document.querySelectorAll('[data-lightbox]').forEach(button => button.addEventListener('click', () => {
    if (!imageDialog) return;
    imageDialog.querySelector('img').src = root + button.dataset.lightbox;
    imageDialog.querySelector('img').alt = button.dataset.caption;
    imageDialog.querySelector('p').textContent = button.dataset.caption;
    priorFocus = document.activeElement; imageDialog.showModal(); document.body.classList.add('modal-open');
  }));

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
      service = button.querySelector('span')?.textContent || treatments[button.dataset.visitService]?.name || button.dataset.visitService;
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
