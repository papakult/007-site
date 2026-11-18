(() => {
  const section = document.querySelector('#route.journey');
  if (!section) return;
  const pins = Array.from(section.querySelectorAll('.journey__pin'));
  const tabs = Array.from(section.querySelectorAll('[role="tab"]'));
  const panels = Array.from(section.querySelectorAll('[role="tabpanel"]'));

  const atlas=section.querySelector('.journey__atlas');
  let selected=null;
  function loadCity() {
    import('./route-city.js?v=2').then(({mountCity})=>{
      mountCity(atlas,()=>{
        if(selected!==null)atlas.dispatchEvent(new CustomEvent('route-select',{detail:selected}));
      });
    }).catch(()=>{/* The rendered city and all lesson stops remain available. */});
  }
  if('IntersectionObserver' in window) {
    const loader=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)){loader.disconnect();loadCity();}
    },{rootMargin:'420px'});
    loader.observe(atlas);
  } else loadCity();

  function showStop(index) {
    selected=index;
    atlas.dispatchEvent(new CustomEvent('route-select',{detail:index}));
    tabs.forEach((tab, position) => {
      const active = position === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      pins[position].setAttribute('aria-pressed', String(active));
      const panel = panels[position];
      const wasHidden = panel.hidden;
      panel.hidden = !active;
      panel.classList.toggle('journey__note--enter', active && wasHidden);
    });
  }

  section.querySelectorAll('[data-journey-stop]').forEach(button => {
    button.addEventListener('click', () => showStop(Number(button.dataset.journeyStop)));
  });
  section.addEventListener('keydown', event => {
    const current = event.target.closest('[data-journey-stop]');
    if (!current || event.altKey || event.ctrlKey || event.metaKey) return;
    const index = Number(current.dataset.journeyStop);
    const options = {
      ArrowLeft: (index - 1 + tabs.length) % tabs.length,
      ArrowRight: (index + 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    };
    if (!(event.key in options)) return;
    event.preventDefault();
    const target = options[event.key];
    showStop(target);
    (current.classList.contains('journey__pin') ? pins : tabs)[target].focus();
  });
})();
