(() => {
  const cinema = document.querySelector('.cinema');
  const screen = cinema.querySelector('.cinema-screen');
  const intro = cinema.querySelector('.cinema-intro');
  const loop = cinema.querySelector('.garage-loop');
  const ambient = cinema.querySelector('.ambient-toggle');
  const chapters = [...cinema.querySelectorAll('[data-chapter]')];
  const dialog = document.querySelector('.film-dialog');
  const stills = [...dialog.querySelectorAll('.drive-story img')];
  const toggle = dialog.querySelector('[data-story-toggle]');
  const caption = dialog.querySelector('[data-story-caption]');
  const next = dialog.querySelector('[data-story-next]');
  const titles = ['Гараж','Зеркало','Москва'];
  let storyTimer = 0;
  let scene = 0;
  let playing = false;
  function showScene(index) {
    scene = index;
    stills.forEach((image, i) => image.classList.toggle('on', i === scene));
    caption.textContent = (scene + 1) + ' / 3 · ' + titles[scene];
    next.textContent = scene === 2 ? 'Сначала ↺' : 'Дальше →';
  }
  function playStory(play) {
    clearTimeout(storyTimer);
    playing = play;
    toggle.textContent = play ? 'Пауза' : 'Смотреть';
    if (play) storyTimer = setTimeout(() => {
      if (scene === 2) { playStory(false); return; }
      showScene(scene + 1);
      playStory(true);
    }, 5000);
  }
  toggle.addEventListener('click', () => {
    if (!playing && scene === 2) showScene(0);
    playStory(!playing);
  });
  next.addEventListener('click', () => { showScene((scene + 1) % 3); playStory(playing); });
  const filmLink = cinema.querySelector('.cinema-film');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const wide = matchMedia('(min-width:641px) and (min-aspect-ratio:1/1), (min-width:1025px)');
  const positions = [0, .50, .84];
  let paused = false;
  let frame = 0;
  let manualPosition = 0;
  let inView = true;
  let ambientAllowed = false;
  let lastPlayState = null;
  let activeChapter = -1;
  const clamp = x => Math.max(0, Math.min(1, x));
  function fade(from, to, position) {
    const t = clamp((position - from) / (to - from));
    return t * t * (3 - 2 * t);
  }
  function syncAmbient() {
    const permitted = wide.matches && !reduced.matches && !navigator.connection?.saveData;
    ambient.hidden = !permitted || !ambientAllowed;
    const play = permitted && ambientAllowed && inView && !paused && !dialog.open && !document.hidden;
    if (play === lastPlayState) return;
    lastPlayState = play;
    if (play) {
      if (!loop.getAttribute('src')) loop.src = './assets/garage-light.mp4';
      loop.play().catch(() => {
        if (lastPlayState) loop.classList.remove('is-playing');
      });
    } else {
      loop.pause();
      loop.classList.remove('is-playing');
    }
  }
  loop.addEventListener('playing', () => loop.classList.toggle('is-playing', lastPlayState === true));
  function render() {
    frame = 0;
    const bounds = cinema.getBoundingClientRect();
    const travel = bounds.height - screen.offsetHeight;
    const position = reduced.matches || travel < 2 ? manualPosition : clamp(-bounds.top / travel);
    const mirror = fade(.13,.40,position);
    const city = fade(.57,.78,position);
    const values = {
      '--garage-opacity': 1 - mirror,
      '--garage-zoom': 1 + .18 * mirror,
      '--mirror-opacity': mirror * (1 - city),
      '--mirror-zoom': 1 + .18 * fade(.35,.55,position) + 1.65 * fade(.49,.75,position),
      '--city-opacity': city,
      '--city-zoom': 1.045 - .045 * fade(.64,1,position),
      '--intro-opacity': 1 - fade(.05,.22,position),
      '--mirror-copy': fade(.32,.41,position) * (1 - fade(.54,.65,position)),
      '--city-copy': fade(.69,.78,position) * (1 - fade(.88,.99,position)),
      '--line-opacity': fade(.82,.96,position),
      '--line-offset': 1 - fade(.81,1,position)
    };
    for (const [key,value] of Object.entries(values)) cinema.style.setProperty(key,value.toFixed(4));
    intro.inert = position >= .22;
    const chapter = position < .34 ? 0 : position < .68 ? 1 : 2;
    if (chapter !== activeChapter) {
      activeChapter = chapter;
      chapters.forEach((button,i) => button.setAttribute('aria-pressed',String(i === chapter)));
    }
    ambientAllowed = position < .135;
    syncAmbient();
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(render); }
  chapters.forEach((button,i) => button.addEventListener('click', () => {
    manualPosition = positions[i];
    if (reduced.matches) { render(); return; }
    const start = window.scrollY + cinema.getBoundingClientRect().top;
    const distance = cinema.offsetHeight - screen.offsetHeight;
    window.scrollTo({top:start + manualPosition * distance,behavior:'smooth'});
  }));
  ambient.addEventListener('click', () => {
    paused = !paused;
    ambient.setAttribute('aria-pressed',String(paused));
    const label = paused ? 'Включить движение фона' : 'Остановить движение фона';
    ambient.setAttribute('aria-label',label);
    ambient.title = label;
    syncAmbient();
  });
  filmLink.addEventListener('click', event => {
    if (!dialog.showModal || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    dialog.showModal();
    syncAmbient();
    showScene(0);
    playStory(!reduced.matches);
  });
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => { playStory(false); syncAmbient(); });
  new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; syncAmbient(); }).observe(cinema);
  document.addEventListener('visibilitychange', syncAmbient);
  window.addEventListener('scroll', schedule, {passive:true});
  window.addEventListener('resize',schedule);
  reduced.addEventListener('change',schedule);
  wide.addEventListener('change',schedule);
  cinema.classList.add('is-ready');
  render();
})();
