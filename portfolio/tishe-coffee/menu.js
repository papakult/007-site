(() => {
  const section = document.querySelector('.cuvee');
  if (!section) return;
  const list = section.querySelector('.cuvee-list');
  const filters = section.querySelector('.cuvee-filters');
  const fallback = section.querySelector('.cuvee-fallback');
  const sizes = section.querySelector('.cuvee-sizes');
  const milkField = section.querySelector('.cuvee-milk');
  const milk = milkField.querySelector('select');
  const ingredients = section.querySelector('.cuvee-ingredients');
  let picture = section.querySelector('#cuvee-image');
  const frame = picture.parentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let photoRevision = 0;
  let activeWipe;
  const total = section.querySelector('.cuvee-total');
  const drinks = [...fallback.querySelectorAll('details')].map(source => ({
    key: source.dataset.key,
    category: source.dataset.category,
    name: source.querySelector('summary').textContent,
    character: source.querySelector('.cuvee-character').textContent,
    recipe: source.querySelector('.cuvee-recipe').textContent,
    photo: source.querySelector('img').getAttribute('src'),
    portions: [...source.querySelectorAll('[data-volume]')].map(el => ({
      volume: el.dataset.volume,
      price: Number(el.dataset.price)
    }))
  }));
  const drinkButtons = [];
  let current;
  let portion;

  function updatePrice() {
    const includesMilk = current.category === 'milk';
    const extra = includesMilk ? Number(milk.selectedOptions[0].dataset.extra) : 0;
    total.textContent = (portion.price + extra) + ' ₽';
    const alternative = {oat: 'овсяный напиток', coconut: 'кокосовый напиток'}[milk.value];
    ingredients.querySelector('p').textContent = includesMilk && alternative
      ? current.recipe.replace('молоко', alternative)
      : current.recipe;
  }

  async function changePhoto(drink, userInitiated) {
    const revision = ++photoRevision;
    if (!activeWipe && picture.getAttribute('src') === drink.photo) return;
    const next = document.createElement('img');
    next.width = next.height = 512;
    next.alt = drink.name;
    next.decoding = 'async';
    const loaded = new Promise(resolve => {
      next.onload = () => resolve(true);
      next.onerror = () => resolve(false);
    });
    next.src = drink.photo;
    if (next.decode) {
      try {
        await next.decode();
      } catch {
        if (!(await loaded)) return;
      }
    } else if (!(await loaded)) return;

    // Keep the current photograph visible while the next file decodes.
    // Finish any running reveal, then discard superseded selections.
    if (activeWipe) await activeWipe.finished;
    if (revision !== photoRevision || picture.getAttribute('src') === drink.photo) return;
    const canAnimate = userInitiated && !reducedMotion.matches && typeof next.animate === 'function';
    if (canAnimate) {
      next.className = 'cuvee-incoming';
      next.setAttribute('aria-hidden', 'true');
      frame.append(next);
      activeWipe = next.animate([
        {clipPath: 'inset(0 100% 0 0)', transform: 'scale(1.035)'},
        {clipPath: 'inset(0 0% 0 0)', transform: 'scale(1)'}
      ], {duration: 470, easing: 'cubic-bezier(.22,.72,.18,1)'});
      await activeWipe.finished;
      activeWipe = null;
      next.classList.remove('cuvee-incoming');
      next.removeAttribute('aria-hidden');
    }
    picture.replaceWith(next);
    next.id = 'cuvee-image';
    picture = next;
  }

  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches && activeWipe) activeWipe.finish();
  });

  function showDrink(drink, userInitiated = false) {
    current = drink;
    portion = drink.portions[0];
    drinkButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.key === drink.key)));
    changePhoto(drink, userInitiated);
    section.querySelector('#cuvee-name').textContent = drink.name;
    section.querySelector('#cuvee-character').textContent = drink.character;
    ingredients.open = false;
    milkField.hidden = drink.category !== 'milk';
    milk.value = 'regular';
    sizes.replaceChildren();
    drink.portions.forEach((item, index) => {
      const label = document.createElement('label');
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'cuvee-volume';
      radio.value = item.volume;
      radio.checked = index === 0;
      radio.addEventListener('change', () => { portion = item; updatePrice(); });
      const text = document.createElement('span');
      text.textContent = item.volume + ' мл';
      label.append(radio, text);
      sizes.append(label);
    });
    updatePrice();
  }

  drinks.forEach(drink => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.key = drink.key;
    button.textContent = drink.name;
    button.setAttribute('aria-controls', 'cuvee-feature');
    button.addEventListener('click', () => showDrink(drink, true));
    drinkButtons.push(button);
    list.append(button);
  });

  filters.addEventListener('click', event => {
    const target = event.target.closest('button[data-category]');
    if (!target) return;
    const group = target.dataset.category;
    filters.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button === target)));
    const matches = drink => group === 'all' || drink.category === group;
    drinkButtons.forEach((button, index) => { button.hidden = !matches(drinks[index]); });
    if (!matches(current)) showDrink(drinks.find(matches), true);
  });
  milk.addEventListener('change', updatePrice);
  function followDrinkLink() {
    const drink = drinks.find(item => '#drink-' + item.key === window.location.hash);
    if (!drink) return;
    filters.querySelector('[data-category="all"]').click();
    showDrink(drink);
    section.scrollIntoView({block: 'start'});
  }

  showDrink(drinks[0]);
  fallback.hidden = true;
  filters.hidden = false;
  list.hidden = false;
  section.querySelector('.cuvee-editor').hidden = false;
  section.classList.add('cuvee-ready');
  window.addEventListener('hashchange', followDrinkLink);
  followDrinkLink();
})();
