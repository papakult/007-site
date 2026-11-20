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
  const visitLink = document.createElement('a'); visitLink.href = document.querySelector('.procedure-intro .pill')?.href || root + 'visit/'; visitLink.textContent = document.querySelector('.procedure-intro') ? 'Выбрать процедуру' : 'Выбрать визит'; dock.append(serviceLink, visitLink); document.body.append(dock);

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

  const menuPhoto = document.querySelector('[data-service-photo]');
  if (menuPhoto) {
    const lines = [...document.querySelectorAll('[data-preview]')];
    function preview(line) {
      if (menuPhoto.getAttribute('src') === line.dataset.print) return;
      menuPhoto.src = line.dataset.print;
      menuPhoto.alt = line.dataset.alt;
      for (const item of lines) item.classList.toggle('previewed', item === line);
    }
    lines[0]?.classList.add('previewed');
    for (const line of lines) {
      line.addEventListener('pointerenter', e => { if (e.pointerType !== 'touch') preview(line); });
      line.addEventListener('focus', () => preview(line));
    }
  }

  for (const collection of document.querySelectorAll('.lookbook')) {
    const stage = collection.querySelector('.look-stage');
    const name = collection.querySelector('[data-look-name]');
    const caption = collection.querySelector('[data-look-copy]');
    const procedure = collection.querySelector('[data-look-link]');
    const counter = collection.querySelector('[data-look-count]');
    const choices = [...collection.querySelectorAll('[data-look]')];
    const controls = collection.querySelector('[data-look-tools]');
    let index = 0;
    let selection = 0;
    let photo = stage.querySelector('img');
    let transition;
    async function show(next) {
      const direction = next < index ? -1 : 1;
      index = (next + choices.length) % choices.length;
      const choice = choices[index];
      const ticket = ++selection;
      const image = new Image();
      image.alt = choice.dataset.caption;
      image.src = choice.href;
      try { await image.decode(); }
      catch { if (!image.complete || !image.naturalWidth) return; }
      if (ticket !== selection) return;
      transition?.cancel();
      stage.replaceChildren(photo);
      const previous = photo;
      previous.setAttribute('aria-hidden', 'true');
      stage.append(image);
      photo = image;
      name.textContent = choice.dataset.name;
      caption.textContent = choice.dataset.caption;
      procedure.href = root + 'procedures/' + choice.dataset.procedure + '/';
      procedure.textContent = choice.dataset.offer;
      counter.textContent = (index + 1) + ' / ' + choices.length;
      choices.forEach((item, n) => item.setAttribute('aria-current', String(n === index)));
      const unhandled = collection.dispatchEvent(new CustomEvent('muse:look-change', {
        bubbles: true, cancelable: true, detail: { image, previous, caption: name.parentElement, direction }
      }));
      if (!unhandled) return;
      if (!reduced.matches && image.animate) {
        transition = image.animate([{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)'}], {duration:310,easing:'cubic-bezier(.22,.68,.2,1)'});
        transition.onfinish = () => previous.remove();
      } else previous.remove();
    }
    const requestedLook = new URLSearchParams(location.search).get('look');
    const initial = choices.findIndex(choice => choice.dataset.key === requestedLook);
    if (initial > 0) show(initial);
    controls.hidden = false;
    for (const button of controls.querySelectorAll('[data-step]')) button.addEventListener('click', () => show(index + Number(button.dataset.step)));
    choices.forEach((choice, n) => {
      choice.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        show(n);
      });
      choice.addEventListener('keydown', event => {
        const step = {ArrowRight: 1, ArrowLeft: -1}[event.key];
        if (!step) return;
        event.preventDefault();
        const next = (n + step + choices.length) % choices.length;
        choices[next].focus({preventScroll:true});
        show(next);
      });
    });
  }

  const summary = document.querySelector('#visit-summary');
  if (summary) {
    const serviceButtons = [...document.querySelectorAll('[data-visit-service]')];
    const timeButtons = [...document.querySelectorAll('[data-visit-time]')];
    const saveButton = document.querySelector('#save-visit');
    let service = '', duration = '', price = '', time = '';
    function render() {
      summary.replaceChildren();
      const title = document.createElement('h2');
      title.textContent = service || 'Выберите процедуру';
      summary.append(title);
      if (service) {
        const facts = document.createElement('dl');
        facts.className = 'visit-facts';
        for (const [label, value] of [['Стоимость', price], ['Длительность', duration], ['Время дня', time || 'По желанию']]) {
          const term = document.createElement('dt');
          const detail = document.createElement('dd');
          term.textContent = label;
          detail.textContent = value;
          facts.append(term, detail);
        }
        summary.append(facts);
      }
      if (saveButton) saveButton.disabled = !service;
    }
    serviceButtons.forEach(button => button.addEventListener('click', () => {
      service = button.querySelector('span').textContent;
      price = button.dataset.price;
      duration = button.dataset.duration + ' минут'; serviceButtons.forEach(b => b.setAttribute('aria-pressed', String(b === button))); render();
    }));
    timeButtons.forEach(button => button.addEventListener('click', () => { time = button.dataset.visitTime; timeButtons.forEach(b => b.setAttribute('aria-pressed', String(b === button))); render(); }));
    saveButton?.addEventListener('click', () => {
      if (!service) return;
      const contents = `MUSE — мой план визита\n\n${service}\n${price}\n${duration}\n${time || 'Время не выбрано'}\n\nДемонстрационный проект 007-A. План не является записью.\nhttps://007-a.ru/directions/sites/beauty-salon/\n`;
      const url = URL.createObjectURL(new Blob([contents], { type: 'text/plain;charset=utf-8' }));
      const link = document.createElement('a'); link.href = url; link.download = 'MUSE-my-visit.txt'; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000);
    });
    const aliases = { hair: 'precision-cut', nails: 'manicure', makeup: 'evening-makeup', brows: 'brow-architecture' };
    const query = new URLSearchParams(location.search).get('service');
    const chosen = serviceButtons.find(b => b.dataset.visitService === (aliases[query] || query));
    if (chosen) chosen.click(); else render();
  }
})();
