(() => {
  const section = document.querySelector('[data-visit]');
  if (!section) return;

  const intro = document.querySelector('.film-intro[href="#visit"]');
  const preferences = window.matchMedia('(prefers-reduced-motion: reduce)');
  const stage = section.querySelector('.visit-stage');
  const movie = section.querySelector('video');
  const toggle = section.querySelector('[data-visit-toggle]');
  const label = section.querySelector('[data-visit-action]');
  const group = section.querySelector('.visit-chapters');
  const picks = [...group.querySelectorAll('[data-visit-start]')];
  const chapters = [...section.querySelectorAll('.visit-chapter')];
  const status = section.querySelector('[data-visit-status]');
  const seekPoints = picks.map(button => Number(button.dataset.visitStart));
  let current = 0;
  let position = 0;
  let changing = 0;
  let playerVisible = false;
  let arrivingFromIntro = false;
  let arrivalTimer;

  const sceneAt = time => {
    for (let i = seekPoints.length - 1; i >= 1; i--) {
      if (time >= seekPoints[i]) return i;
    }
    return 0;
  };

  function display(index) {
    current = index;
    chapters.forEach((chapter, i) => { chapter.hidden = i !== index; });
    picks.forEach((button, i) => {
      button.setAttribute('aria-pressed', String(i === index));
      button.querySelector('i').style.transform = 'scaleX(0)';
    });
  }

  function refreshToggle() {
    const playing = !movie.paused && !movie.ended;
    toggle.toggleAttribute('data-playing', playing);
    section.classList.toggle('is-running', playing);
    if (playing) label.textContent = 'Пауза';
    else if (movie.ended && playerVisible) label.textContent = 'Смотреть ещё раз';
    else label.textContent = position > 0 ? 'Продолжить фильм' : 'Смотреть фильм';
  }

  function showPlayer(show) {
    playerVisible = show;
    movie.hidden = !show;
    stage.classList.toggle('is-playing', show);
  }

  function finishArrival() {
    arrivingFromIntro = false;
    window.clearTimeout(arrivalTimer);
  }

  function select(index) {
    finishArrival();
    changing++;
    if (!movie.paused) movie.pause();
    showPlayer(false);
    position = seekPoints[index];
    display(index);
    refreshToggle();
    status.textContent = chapters[index].querySelector('h3').textContent;
  }

  async function play() {
    const request = ++changing;
    if (!movie.getAttribute('src')) movie.src = movie.dataset.src;
    if (movie.ended && playerVisible) position = 0;
    try {
      movie.currentTime = position;
      movie.hidden = false;
      // play() runs inside the visitor's tap, including on mobile Safari.
      await movie.play();
      if (request !== changing) return;
      showPlayer(true);
      refreshToggle();
    } catch {
      if (request !== changing) return;
      showPlayer(false);
      refreshToggle();
      status.textContent = 'Фильм не открылся. Выберите любую из трёх сцен ниже.';
    }
  }

  toggle.addEventListener('click', () => {
    if (!movie.paused && !movie.ended) {
      stopOffscreen();
    } else {
      play();
    }
  });
  picks.forEach((button, index) => {
    button.addEventListener('click', () => select(index));
    button.addEventListener('keydown', event => {
      let next;
      switch (event.key) {
        case 'ArrowLeft': next = (index + picks.length - 1) % picks.length; break;
        case 'ArrowRight': next = (index + 1) % picks.length; break;
        case 'Home': next = 0; break;
        case 'End': next = picks.length - 1; break;
        default: return;
      }
      event.preventDefault();
      picks[next].focus();
      select(next);
    });
  });

  movie.addEventListener('timeupdate', () => {
    if (!playerVisible) return;
    position = movie.currentTime;
    const index = sceneAt(position);
    if (index !== current) display(index);
    const length = (seekPoints[index + 1] || movie.duration || 12) - seekPoints[index];
    const elapsed = Math.min(1, Math.max(0, (position - seekPoints[index]) / length));
    picks[index].querySelector('i').style.transform = 'scaleX(' + elapsed + ')';
  });
  movie.addEventListener('pause', refreshToggle);
  movie.addEventListener('ended', () => {
    position = 0;
    refreshToggle();
  });
  movie.addEventListener('error', () => {
    showPlayer(false);
    refreshToggle();
    status.textContent = 'Выберите сцену, чтобы посмотреть её в фотографиях.';
  });

  function stopOffscreen() {
    finishArrival();
    changing++;
    if (!movie.paused) {
      position = movie.currentTime;
      movie.pause();
    }
  }

  function startFromIntro(event) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    finishArrival();
    arrivingFromIntro = true;
    // Ignore an initial offscreen notification while moving from the cover to the film.
    arrivalTimer = window.setTimeout(() => {
      finishArrival();
      const bounds = section.getBoundingClientRect();
      if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) stopOffscreen();
    }, 1600);
    if (window.location.hash !== '#visit') window.history.pushState(null, '', '#visit');
    section.scrollIntoView({ behavior: preferences.matches ? 'instant' : 'smooth', block: 'start' });
    toggle.focus({ preventScroll: true });
    if (movie.paused || movie.ended) play();
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopOffscreen();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([item]) => {
      if (item.isIntersecting) finishArrival();
      else if (!arrivingFromIntro) stopOffscreen();
    }).observe(section);
  }
  if (preferences.addEventListener) {
    preferences.addEventListener('change', event => {
      if (event.matches) stopOffscreen();
    });
  }

  display(0);
  group.hidden = false;
  if (movie.canPlayType('video/mp4')) {
    toggle.hidden = false;
    if (intro) {
      intro.querySelector('strong').textContent = 'Смотреть фильм';
      intro.querySelector('small').textContent = 'Первый визит · 12 секунд';
      intro.setAttribute('aria-label', 'Смотреть фильм «Первый визит», 12 секунд');
      intro.setAttribute('aria-controls', movie.id);
      intro.addEventListener('click', startFromIntro);
    }
  }
  section.classList.add('is-enhanced');
})();
