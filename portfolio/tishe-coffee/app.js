(() => {
  'use strict';
  const drinks = [
    { id: 'espresso', name: 'Эспрессо', type: 'black', price: 180, sizes: [30, 60], extra: 70, note: 'Плотный. Короткий. Настоящий.' },
    { id: 'americano', name: 'Американо', type: 'black', price: 220, sizes: [200, 300], extra: 40, note: 'Чистый вкус, больше времени.' },
    { id: 'cappuccino', name: 'Капучино', type: 'milk', price: 280, sizes: [200, 300], extra: 50, note: 'Нежная пена, мягкий характер.' },
    { id: 'flatwhite', name: 'Флэт уайт', type: 'milk', price: 310, sizes: [200, 300], extra: 60, note: 'Больше кофе. Тоньше молоко.' },
    { id: 'latte', name: 'Латте', type: 'milk', price: 300, sizes: [300, 400], extra: 60, note: 'Мягкий и неспешный.' },
    { id: 'filter', name: 'Фильтр-кофе', type: 'black', price: 240, sizes: [250, 350], extra: 50, note: 'Легкий, прозрачный, ароматный.' }
  ];
  const positions = ['0% 0%', '50% 0%', '100% 0%', '0% 100%', '50% 100%', '100% 100%'];
  const grid = document.querySelector('#drinks');
  const dialog = document.querySelector('#order-dialog');
  const form = document.querySelector('#order-form');
  const drinkSelect = document.querySelector('#order-drink');
  const milkSelect = document.querySelector('#order-milk');
  const sizes = document.querySelector('#size-options');
  const result = document.querySelector('#order-result');
  let selected = drinks[0];
  let lastOpener;
  const money = value => `${value} ₽`;
  const plus = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5v14"/></svg>';

  function renderMenu(filter = 'all') {
    grid.innerHTML = drinks.filter(d => filter === 'all' || d.type === filter).map(d => {
      const index = drinks.indexOf(d);
      return `<article class="drink-card" style="--photo-position:${positions[index]}"><div class="drink-photo"><span class="drink-number">0${index + 1}</span><button class="photo-select" data-drink="${d.id}" aria-label="Посмотреть ${d.name}"><span class="photo-label">ВАША ЧАШКА</span></button></div><div class="drink-heading"><h3>${d.name}</h3><span class="price">${money(d.price)}</span></div><div class="drink-detail"><p>${d.note}<br><small>${d.sizes.join(' / ')} мл</small></p><button class="add-drink" data-drink="${d.id}" aria-label="Выбрать ${d.name}">${plus}</button></div></article>`;
    }).join('');
  }
  renderMenu();
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(b => {
      const active = b === button;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    renderMenu(button.dataset.filter);
  }));
  drinkSelect.innerHTML = drinks.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
  function total() {
    const large = form.querySelector('input[name="size"]:checked')?.value === String(selected.sizes[1]);
    return selected.price + (large ? selected.extra : 0) + (selected.type === 'milk' ? Number(milkSelect.value) : 0);
  }
  function updatePrice() { document.querySelector('#total-price').textContent = money(total()); }
  function updateDrink() {
    selected = drinks.find(d => d.id === drinkSelect.value) || drinks[0];
    document.querySelector('#milk-label').hidden = selected.type !== 'milk';
    milkSelect.value = '0';
    sizes.innerHTML = selected.sizes.map((size, i) => `<label class="size-choice"><input type="radio" name="size" value="${size}" ${i === 0 ? 'checked' : ''}><span>${size} мл${i ? ` / +${selected.extra} ₽` : ''}</span></label>`).join('');
    document.querySelector('#order-photo').style.setProperty('--photo-position', positions[drinks.indexOf(selected)]);
    updatePrice();
  }
  function openOrder(id, opener) {
    lastOpener = opener;
    drinkSelect.value = id;
    form.hidden = false;
    result.hidden = true;
    updateDrink();
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    drinkSelect.focus({ preventScroll: true });
  }
  grid.addEventListener('click', event => {
    const button = event.target.closest('[data-drink]');
    if (button) openOrder(button.dataset.drink, button);
  });
  drinkSelect.addEventListener('change', updateDrink);
  form.addEventListener('change', updatePrice);
  function closeOrder() { dialog.close(); }
  dialog.querySelector('.close-dialog').addEventListener('click', closeOrder);
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeOrder();
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = '';
    lastOpener?.focus({ preventScroll: true });
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const size = form.querySelector('input[name="size"]:checked').value;
    const milk = selected.type === 'milk' ? `, ${milkSelect.selectedOptions[0].textContent.split(',')[0].toLowerCase()} молоко` : '';
    document.querySelector('#result-text').textContent = `${selected.name}, ${size} мл${milk}. ${money(total())}.`;
    form.hidden = true;
    result.hidden = false;
    result.querySelector('button').focus();
  });
  result.querySelector('.result-back').addEventListener('click', () => {
    result.hidden = true;
    form.hidden = false;
    drinkSelect.focus();
  });

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection?.saveData;
  const video = document.querySelector('#brew-video');
  const chapters = [...document.querySelectorAll('[data-chapter]')];
  const progressLine = document.querySelector('.craft-progress i');
  let targetTime = 0;
  let ready = false;
  let chapter = 0;
  let scheduled = false;
  function seek() {
    scheduled = false;
    if (!ready || video.seeking || Math.abs(video.currentTime - targetTime) < 0.035) return;
    video.currentTime = targetTime;
  }
  function scheduleSeek() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(seek); }
  }
  video.addEventListener('seeked', scheduleSeek);
  video.addEventListener('loadeddata', () => {
    ready = true;
    scheduleSeek();
  });
  function updateStory(progress) {
    progressLine.style.transform = `scaleX(${progress})`;
    const next = progress < 0.52 ? 0 : 1;
    if (chapter !== next) {
      chapter = next;
      chapters.forEach((element, index) => { element.hidden = index !== chapter; });
      document.querySelector('#chapter-count').textContent = `${chapter ? '02' : '01'} / 02`;
      if (!reducedMotion && window.gsap) gsap.fromTo(chapters[chapter], { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, overwrite: true });
    }
    if (ready && !reducedMotion && !saveData) {
      targetTime = progress * Math.max(0, video.duration - 0.06);
      scheduleSeek();
    }
  }
  if (!reducedMotion && !saveData) {
    video.preload = 'auto';
    video.load();
  }
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create({ trigger: '#craft', start: 'top top', end: 'bottom bottom', onUpdate: self => updateStory(self.progress) });
  } else {
    const story = document.querySelector('#craft');
    addEventListener('scroll', () => {
      const rect = story.getBoundingClientRect();
      updateStory(Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - innerHeight))));
    }, { passive: true });
  }

  if (new URLSearchParams(location.search).get('tour') === '1' && !reducedMotion) {
    document.documentElement.style.scrollBehavior = 'auto';
    setTimeout(() => {
      const started = performance.now();
      const story = document.querySelector('#craft');
      const menu = document.querySelector('#menu');
      let opened = false;
      let submitted = false;
      const ease = x => x * x * (3 - 2 * x);
      function tour(now) {
        const t = (now - started) / 1000;
        const storyStart = story.offsetTop;
        const menuTop = menu.offsetTop;
        let y = 0;
        if (t >= 3 && t < 6) y = ease((t - 3) / 3) * storyStart;
        else if (t >= 6 && t < 12) y = storyStart + ((t - 6) / 6) * (story.offsetHeight - innerHeight);
        else if (t >= 12 && t < 15) y = storyStart + story.offsetHeight - innerHeight + ease((t - 12) / 3) * (menuTop + 250 - (storyStart + story.offsetHeight - innerHeight));
        else if (t >= 15) y = menuTop + 250;
        if (!opened) scrollTo({ top: y, behavior: 'instant' });
        if (t >= 18 && !opened) {
          openOrder('flatwhite', grid.querySelector('[data-drink="flatwhite"]'));
          sizes.querySelectorAll('input')[1].checked = true;
          milkSelect.selectedIndex = 1;
          updatePrice();
          opened = true;
        }
        if (t >= 22 && !submitted) { form.requestSubmit(); submitted = true; }
        if (t < 27) requestAnimationFrame(tour);
      }
      requestAnimationFrame(tour);
    }, 1800);
  }
})();
