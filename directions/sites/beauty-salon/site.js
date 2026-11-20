'use strict';
(() => {
  const root = '/directions/sites/beauty-salon/';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');
  function closeMenu() { if (!mobileNav) return; mobileNav.hidden = true; menuButton?.setAttribute('aria-expanded', 'false'); }
  menuButton?.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; menuButton.setAttribute('aria-expanded', String(open)); mobileNav.hidden = !open; });
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  addEventListener('keydown', event => { if (event.key === 'Escape' && mobileNav && !mobileNav.hidden) { closeMenu(); menuButton?.focus(); } });
  matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

  const serviceImage = document.querySelector('#service-image');
  const serviceTag = document.querySelector('#service-tag');
  document.querySelectorAll('[data-service-image]').forEach(link => {
    const select = () => {
      if (!serviceImage) return;
      document.querySelectorAll('.service-item').forEach(item => item.classList.toggle('is-active', item === link));
      serviceImage.src = root + 'assets/' + link.dataset.serviceImage;
      serviceImage.alt = link.dataset.serviceAlt;
      serviceTag.textContent = link.dataset.serviceTag;
    };
    link.addEventListener('mouseenter', select); link.addEventListener('focus', select);
  });

  const moodSection = document.querySelector('.mood');
  const words = ['смелая.', 'утончённая.', 'в моменте.'];
  const captions = ['Медный оттенок. Чистая линия. Новое ощущение себя.', 'Глубокая вишня. Точная деталь. Тихая уверенность.', 'Тёплый свет. Мягкое кресло. Время только для себя.'];
  let currentMood = 0;
  const moodButtons = [...document.querySelectorAll('[data-mood]')];
  function setMood(index) {
    currentMood = index;
    document.querySelectorAll('.mood-frame').forEach((frame, i) => frame.classList.toggle('is-active', i === index));
    moodButtons.forEach((button, i) => { button.classList.toggle('is-active', i === index); button.setAttribute('aria-pressed', String(i === index)); });
    const word = document.querySelector('#mood-word'); if (word) word.textContent = words[index];
    const caption = document.querySelector('#mood-description'); if (caption) caption.textContent = captions[index];
  }
  let pending = false;
  function updateScrollMood() {
    pending = false;
    if (!moodSection || reduceMotion.matches) return;
    const rect = moodSection.getBoundingClientRect();
    const travel = rect.height - innerHeight;
    if (rect.top > 0 || rect.bottom < innerHeight || travel <= 0) return;
    const progress = Math.max(0, Math.min(.999, -rect.top / travel));
    const next = Math.min(2, Math.floor(progress * 3));
    if (next !== currentMood) setMood(next);
  }
  if (moodSection) {
    addEventListener('scroll', () => { if (!pending) { pending = true; requestAnimationFrame(updateScrollMood); } }, { passive: true });
    moodButtons.forEach((button, index) => button.addEventListener('click', () => {
      setMood(index);
      if (!reduceMotion.matches) {
        const top = scrollY + moodSection.getBoundingClientRect().top;
        const travel = moodSection.offsetHeight - innerHeight;
        scrollTo({ top: top + Math.max(0, travel) * ((index + .2) / 3), behavior: 'instant' });
      }
    }));
    updateScrollMood();
  }

  let previousFocus;
  function openDialog(dialog) {
    if (!dialog) return;
    previousFocus = document.activeElement; dialog.showModal(); document.body.classList.add('modal-open');
  }
  document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => button.closest('dialog')?.close()));
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('click', event => { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); });
    dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); dialog.querySelector('video')?.pause(); previousFocus?.focus(); });
  });
  const filmDialog = document.querySelector('#film-dialog');
  const storyFrames = [...document.querySelectorAll('.story-frame')];
  const storyButtons = [...document.querySelectorAll('[data-story-index]')];
  const storyPause = document.querySelector('#story-pause');
  let storyTimer = null, storyIndex = 0;
  const stopStory = () => { clearInterval(storyTimer); storyTimer = null; if (storyPause) storyPause.textContent = 'Продолжить'; };
  function setStory(index) {
    storyIndex = index;
    storyFrames.forEach((frame, i) => { frame.classList.toggle('is-active', i === index); frame.setAttribute('aria-hidden', String(i !== index)); });
    storyButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  }
  function playStory() {
    stopStory();
    if (storyIndex === storyFrames.length - 1) setStory(0);
    if (storyPause) storyPause.textContent = 'Пауза';
    storyTimer = setInterval(() => { if (storyIndex < storyFrames.length - 1) setStory(storyIndex + 1); else stopStory(); }, 3500);
  }
  storyButtons.forEach((button, index) => button.addEventListener('click', () => { stopStory(); setStory(index); }));
  storyPause?.addEventListener('click', () => { if (storyTimer) stopStory(); else playStory(); });
  filmDialog?.addEventListener('close', stopStory);
  document.querySelectorAll('[data-open-film]').forEach(button => button.addEventListener('click', () => { openDialog(filmDialog); setStory(0); if (!reduceMotion.matches) playStory(); else stopStory(); }));
  const imageDialog = document.querySelector('#image-dialog');
  document.querySelectorAll('[data-lightbox]').forEach(button => button.addEventListener('click', () => {
    if (!imageDialog) return;
    imageDialog.querySelector('img').src = root + button.dataset.lightbox;
    imageDialog.querySelector('img').alt = button.dataset.caption;
    imageDialog.querySelector('p').textContent = button.dataset.caption;
    openDialog(imageDialog);
  }));

  const visitSummary = document.querySelector('#visit-summary');
  if (visitSummary) {
    let service = '', duration = '', time = '';
    const serviceButtons = [...document.querySelectorAll('[data-visit-service]')];
    const timeButtons = [...document.querySelectorAll('[data-visit-time]')];
    const saveButton = document.querySelector('#save-visit');
    const summaryText = () => service ? `${service} · ${duration || 'Продолжительность уточняется'}${time ? ' · ' + time : ''}. Это пример визита; бронирование не производится.` : 'Выберите направление, чтобы увидеть свой план визита.';
    const renderVisit = () => { visitSummary.textContent = summaryText(); if (saveButton) saveButton.disabled = !service; };
    serviceButtons.forEach(button => button.addEventListener('click', () => { service = button.querySelector('span')?.textContent || button.dataset.visitService; duration = button.dataset.duration + ' минут'; serviceButtons.forEach(b => b.setAttribute('aria-pressed', String(b === button))); renderVisit(); }));
    timeButtons.forEach(button => button.addEventListener('click', () => { time = button.dataset.visitTime; timeButtons.forEach(b => b.setAttribute('aria-pressed', String(b === button))); renderVisit(); }));
    saveButton?.addEventListener('click', () => {
      if (!service) return;
      const contents = `MUSE — мой план визита\n\n${service}\n${duration || ''}\n${time || 'Время не выбрано'}\n\nДемонстрационный концепт студии 007-A. План не является записью.\nhttps://007-a.ru/directions/sites/beauty-salon/\n`;
      const url = URL.createObjectURL(new Blob([contents], { type: 'text/plain;charset=utf-8' }));
      const link = document.createElement('a'); link.href = url; link.download = 'MUSE-my-visit.txt'; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000);
    });
    const requestedService = new URLSearchParams(location.search).get('service');
    const requestedButton = serviceButtons.find(button => button.dataset.visitService === requestedService);
    if (requestedButton) requestedButton.click(); else renderVisit();
  }
})();
