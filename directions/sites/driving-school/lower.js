(() => {
  function init() {
    const garage = document.getElementById('garage');
    if (!garage) return;
    const tabs = [...garage.querySelectorAll('[role="tab"]')];
    function select(tab) {
      for (const item of tabs) {
        const selected = item === tab;
        const panel = document.getElementById(item.getAttribute('aria-controls'));
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
        panel.hidden = !selected;
        panel.classList.toggle('ad-car-enter', selected);
      }
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (event) => {
        let destination;
        switch (event.key) {
          case 'Home': destination = 0; break;
          case 'End': destination = tabs.length - 1; break;
          case 'ArrowRight': destination = (index + 1) % tabs.length; break;
          case 'ArrowLeft': destination = (index + tabs.length - 1) % tabs.length; break;
          default: return;
        }
        event.preventDefault();
        select(tabs[destination]);
        tabs[destination].focus();
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
