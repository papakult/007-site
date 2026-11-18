(() => {
  const section = document.querySelector('#route.journey');
  if (!section) return;
  const pins = Array.from(section.querySelectorAll('.journey__pin'));
  const tabs = Array.from(section.querySelectorAll('[role="tab"]'));
  const panels = Array.from(section.querySelectorAll('[role="tabpanel"]'));

  function showStop(index) {
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
