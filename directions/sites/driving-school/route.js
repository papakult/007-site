(() => {
  function initRoute() {
    const route = document.querySelector('.ad-route');
    if (!route) return;
    const markers = [...route.querySelectorAll('[data-route-stop]')];
    const tabs = [...route.querySelectorAll('[role="tab"]')];
    const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
    function select(index) {
      tabs.forEach((tab, position) => {
        const active = position === index;
        tab.tabIndex = active ? 0 : -1;
        tab.setAttribute('aria-selected', String(active));
        markers[position].classList.toggle('is-active', active);
        markers[position].setAttribute('aria-pressed', String(active));
        panels[position].hidden = !active;
      });
    }
    const focusNext = (event, index, controls) => {
      let target;
      switch (event.key) {
        case 'Home': target = 0; break;
        case 'End': target = controls.length - 1; break;
        case 'ArrowLeft': target = (index + controls.length - 1) % controls.length; break;
        case 'ArrowRight': target = (index + 1) % controls.length; break;
        default: return;
      }
      event.preventDefault();
      select(target);
      controls[target].focus();
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(index));
      tab.addEventListener('keydown', event => focusNext(event, index, tabs));
    });
    markers.forEach((marker, index) => {
      marker.addEventListener('click', () => select(index));
      marker.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          select(index);
        } else {
          focusNext(event, index, markers);
        }
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initRoute, { once:true });
  else initRoute();
})();
