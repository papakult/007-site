(() => {
  'use strict';

  const menu = document.getElementById('menu');
  if (!menu) return;

  const cards = [...menu.querySelectorAll('.drink-card')];
  const filters = menu.querySelector('.filters');

  if (filters) {
    const buttons = [...filters.querySelectorAll('[data-filter]')];
    for (const button of buttons) {
      button.addEventListener('click', () => {
        for (const choice of buttons) choice.setAttribute('aria-pressed', String(choice === button));
        for (const card of cards) {
          card.hidden = button.dataset.filter !== 'all' && card.dataset.group !== button.dataset.filter;
        }
      });
    }
    filters.hidden = false;
  }

  const dialog = document.getElementById('cup-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const find = selector => dialog.querySelector(selector);
  const drinkSelect = find('#cup-drink');
  const milk = find('#cup-milk');
  const sizes = find('#cup-sizes');
  const options = find('#cup-options');
  const summary = find('#cup-summary');
  const photo = find('#cup-image');
  const drinkCards = new Map(cards.map(card => [card.dataset.drink, card]));
  const cupPrice = find('#cup-price');
  let activeCard;
  let opener;

  const money = value => `${value} ₽`;

  function chosenSize() {
    return sizes.querySelector('input:checked');
  }

  function refreshPrice() {
    const base = Number(chosenSize().dataset.price);
    const extra = activeCard.dataset.group === 'milk' ? Number(milk.selectedOptions[0].dataset.price) : 0;
    cupPrice.textContent = money(base + extra);
  }

  function changeDrink(id) {
    const card = drinkCards.get(id);
    activeCard = card;
    drinkSelect.value = id;
    milk.selectedIndex = 0;
    find('#cup-milk-field').hidden = card.dataset.group !== 'milk';
    find('#cup-title').textContent = card.querySelector('.drink-name').textContent;
    find('#cup-description').textContent = card.querySelector('.drink-description').textContent;
    photo.src = card.querySelector('.drink-image img').src;
    sizes.replaceChildren();
    for (const [index, variant] of [...card.querySelectorAll('[data-size]')].entries()) {
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'cup-size';
      radio.value = variant.dataset.size;
      radio.dataset.price = variant.dataset.price;
      radio.checked = index === 0;
      const label = document.createElement('label');
      label.className = 'size-choice';
      const text = document.createElement('span');
      text.textContent = `${radio.value} мл`;
      label.append(radio, text);
      sizes.append(label);
    }
    refreshPrice();
  }

  for (const card of cards) {
    const id = card.dataset.drink;
    const name = card.querySelector('.drink-name').textContent;
    drinkSelect.add(new Option(name, id));

    // Keep the native recipe and prices available when the modal is unsupported.
    const details = card.querySelector('.drink-options');
    const button = document.createElement('button');
    button.className = 'drink-action';
    button.type = 'button';
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-label', `Выбрать напиток «${name}»`);
    button.append('Выбрать ', details.querySelector('svg').cloneNode(true));
    button.addEventListener('click', () => {
      opener = button;
      changeDrink(id);
      options.hidden = false;
      summary.hidden = true;
      dialog.showModal();
      document.documentElement.classList.add('cup-open');
      dialog.scrollTop = 0;
    });
    details.before(button);
    details.hidden = true;
  }

  milk.addEventListener('change', refreshPrice);
  sizes.addEventListener('change', refreshPrice);
  drinkSelect.addEventListener('change', () => changeDrink(drinkSelect.value));

  find('#cup-show-summary').addEventListener('click', () => {
    const recipe = activeCard.querySelector('.drink-recipe').textContent;
    const alternative = {oat: 'овсяный напиток', coconut: 'кокосовый напиток'}[milk.value];
    find('#summary-drink').textContent = find('#cup-title').textContent;
    find('#summary-volume').textContent = `${chosenSize().value} мл`;
    find('#summary-recipe').textContent = alternative ? recipe.replace('молоко', alternative) : recipe;
    find('#summary-price').textContent = cupPrice.textContent;
    options.hidden = true;
    summary.hidden = false;
    summary.querySelector('h3').focus();
  });

  find('#cup-edit').addEventListener('click', () => {
    summary.hidden = true;
    options.hidden = false;
    drinkSelect.focus();
  });

  find('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('cup-open');
    opener?.focus({preventScroll: true});
  });
})();

(() => {
  const dialog = document.querySelector('#film-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const player = dialog.querySelector('video');
  let opener;
  document.querySelectorAll('[data-film]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      dialog.showModal();
      if (!player.querySelector('source')) {
        player.poster = 'assets/film/start.jpg';
        for (const [url, type] of [['assets/film/coffee.webm', 'video/webm'], [link.href, 'video/mp4']]) {
          const source = document.createElement('source');
          source.src = url;
          source.type = type;
          player.append(source);
        }
        player.load();
      }
      player.currentTime = 0;
      player.play().catch(() => { /* Native video controls remain available. */ });
    });
  });
  dialog.querySelector('.film-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    player.pause();
    player.currentTime = 0;
    opener?.focus({preventScroll: true});
  });
})();
