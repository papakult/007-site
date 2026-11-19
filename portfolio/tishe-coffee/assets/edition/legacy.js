// Previously shared drink links used fragments on the home page.
(() => {
  function restoreDrinkLink() {
    const drink = /^#drink-(espresso|americano|cappuccino|flatwhite|latte|filter)$/.exec(location.hash);
    if (drink) location.replace(new URL('menu/' + drink[1] + '/', document.querySelector('link[rel="canonical"]').href).pathname);
  }
  restoreDrinkLink();
  window.addEventListener('hashchange', restoreDrinkLink);
})();
