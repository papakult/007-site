(() => {
  const filters = document.querySelector('[data-op-filters]');
  if (filters) {
    const controls = Array.from(filters.querySelectorAll('[data-op-filter]'));
    const families = Array.from(document.querySelectorAll('[data-op-family]'));
    const status = document.querySelector('[data-op-filter-status]');
    filters.hidden = false;
    for (const control of controls) {
      control.addEventListener('click', () => {
        const task = control.dataset.opFilter;
        for (const button of controls) button.setAttribute('aria-pressed', String(button === control));
        let count = 0;
        for (const family of families) {
          const included = task === 'all' || family.dataset.opFamily.split(' ').includes(task);
          family.hidden = !included;
          if (included) count++;
        }
        if (status) status.textContent = 'Направлений техники в подборке: ' + count;
      });
    }
  }

  const viewer = document.querySelector('[data-op-process]');
  if (!viewer) return;
  const list = viewer.querySelector('.op-stage-tabs');
  const tabs = Array.from(list.querySelectorAll('[data-op-tab]'));
  const panels = Array.from(viewer.querySelectorAll('[data-op-panel]'));
  list.setAttribute('role', 'tablist');
  viewer.classList.add('op-enhanced');

  function select(index) {
    const selected = tabs[index];
    for (const tab of tabs) {
      const active = tab === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    }
    for (const panel of panels) panel.hidden = panel.dataset.opPanel !== selected.dataset.opTab;
  }

  function indexFromHash() {
    const index = tabs.findIndex(tab => tab.hash === window.location.hash);
    return index < 0 ? 0 : index;
  }

  tabs.forEach((tab, index) => {
    const panel = panels[index];
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panel.id);
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
    tab.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      select(index);
      history.replaceState(null, '', tab.hash);
    });
    tab.addEventListener('keydown', event => {
      let next;
      switch (event.key) {
        case 'ArrowRight': next = (index + 1) % tabs.length; break;
        case 'ArrowLeft': next = (index + tabs.length - 1) % tabs.length; break;
        case 'Home': next = 0; break;
        case 'End': next = tabs.length - 1; break;
        case ' ':
          event.preventDefault();
          tab.click();
          return;
        default: return;
      }
      event.preventDefault();
      tabs[next].focus();
      tabs[next].click();
    });
  });
  select(indexFromHash());
  window.addEventListener('hashchange', () => select(indexFromHash()));
})();

const comparison = document.querySelector("[data-comparison]");
if (comparison) {
  const control = comparison.querySelector("input");
  comparison.classList.add("comparing");
  document.getElementById("compare-hint").hidden = false;
  control.hidden = false;
  function showSplit() {
    comparison.style.setProperty("--split", control.value + "%");
    control.setAttribute("aria-valuetext", control.value + "% кадра с каркасом");
  }
  control.addEventListener("input", showSplit);
  showSplit();
}
