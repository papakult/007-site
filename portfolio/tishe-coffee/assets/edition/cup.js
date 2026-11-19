(() => {
  const page = document.querySelector('[data-cup-page]');
  if (!page) return;

  const controls = page.querySelector('.cup-controls');
  const price = page.querySelector('[data-cup-price]');
  const volume = page.querySelector('[data-cup-volume]');
  const ingredients = page.querySelector('[data-cup-recipe]');
  const originalRecipe = ingredients.textContent;
  const milkNames = {oat: 'овсяный напиток', coconut: 'кокосовый напиток'};

  function updateCup() {
    const portion = controls.querySelector('input[name="portion"]:checked');
    const milk = controls.querySelector('input[name="milk"]:checked');
    const extra = milk ? Number(milk.dataset.extra) : 0;
    const alternative = milk ? milkNames[milk.value] : '';
    price.textContent = (Number(portion.dataset.price) + extra) + ' ₽';
    volume.textContent = 'за ' + portion.value + ' мл';
    ingredients.textContent = alternative ? originalRecipe.replace('молоко', alternative) : originalRecipe;
  }

  controls.addEventListener('change', updateCup);
  window.addEventListener('pageshow', updateCup);
  updateCup();
  controls.hidden = false;
  page.querySelector('.cup-static-prices').hidden = true;
})();
