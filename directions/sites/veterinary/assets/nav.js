(() => {
  const menu = document.querySelector('.an-mobile');
  if (!menu) return;
  const summary = menu.querySelector('summary');
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      summary.focus();
    }
  });
  document.addEventListener('click', event => {
    if (menu.open && (!menu.contains(event.target) || event.target.closest('nav a'))) menu.open = false;
  });
  menu.addEventListener('focusout', event => {
    if (event.relatedTarget && !menu.contains(event.relatedTarget)) menu.open = false;
  });
  matchMedia('(min-width: 1001px)').addEventListener('change', event => {if (event.matches) menu.open=false;});
})();
