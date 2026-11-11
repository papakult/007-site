(() => {
  const video = document.querySelector('[data-logo-loop]');
  if (!video) return;
  const frame = video.closest('.brand-chrome-hero');
  const hero = document.querySelector('#hero-cloud');
  const gate = document.querySelector('#gate');
  const toggle = document.querySelector('.brand-motion-toggle');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = navigator.connection?.saveData === true;
  let wanted = !reduce.matches && !saveData;
  let onScreen = true;
  let failed = false;
  const entered = () => !gate || getComputedStyle(gate).display === 'none';
  function label() {
    toggle.hidden = reduce.matches || failed;
    toggle.textContent = wanted ? 'Остановить знак' : 'Оживить знак';
    toggle.setAttribute('aria-label', wanted ? 'Остановить анимацию логотипа' : 'Включить анимацию логотипа');
    toggle.setAttribute('aria-pressed', String(!wanted));
  }
  function sync() {
    label();
    if (failed || reduce.matches || !wanted || !onScreen || document.hidden || !entered()) {
      video.pause();
      return;
    }
    if (!video.getAttribute('src')) {
      video.src = video.dataset.src;
      video.load();
    }
    video.play().catch(() => { video.pause(); frame.dataset.playing = 'false'; wanted = false; label(); });
  }
  video.addEventListener('playing', () => { frame.dataset.playing = 'true'; });
  video.addEventListener('error', () => { failed = true; frame.dataset.playing = 'false'; sync(); });
  toggle.addEventListener('click', () => { wanted = !wanted; sync(); });
  reduce.addEventListener('change', () => { wanted = !reduce.matches && !saveData; if (reduce.matches) frame.dataset.playing = 'false'; sync(); });
  document.addEventListener('visibilitychange', sync);
  new IntersectionObserver(entries => { onScreen = entries[0].isIntersecting; sync(); }, { threshold: .05 }).observe(hero);
  if (gate) new MutationObserver(sync).observe(gate, { attributes: true, attributeFilter: ['style', 'class'] });
  sync();
})();

(() => {
  const section = document.querySelector('#s3');
  const toggle = document.querySelector('.direction-motion-toggle');
  if (!section || !toggle) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const forced = matchMedia('(forced-colors: active)');
  let wanted = true;
  let visible = false;
  function sync() {
    const allowed = !reduce.matches && !forced.matches;
    section.classList.toggle('directions-shimmering', allowed && wanted && visible && !document.hidden);
    toggle.disabled = !allowed;
    toggle.setAttribute('aria-pressed', String(!wanted));
    toggle.setAttribute('aria-label', !allowed ? 'Направления' : wanted ? 'Остановить перелив названий направлений' : 'Включить перелив названий направлений');
    toggle.title = !allowed ? 'Направления' : wanted ? 'Нажмите, чтобы остановить перелив' : 'Нажмите, чтобы включить перелив';
  }
  toggle.addEventListener('click', () => { wanted = !wanted; sync(); });
  reduce.addEventListener('change', sync);
  forced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, { threshold: .05 }).observe(section);
  sync();
})();
