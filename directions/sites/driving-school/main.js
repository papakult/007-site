(() => {
  const menu = document.querySelector('.mast-nav');
  const toggle = document.querySelector('.menu-switch');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  }
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') === 'false'));
  menu.addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); toggle.focus(); }
  });
  document.addEventListener('click', event => {
    if (menu.classList.contains('open') && !event.target.closest('.mast-nav,.menu-switch')) setMenu(false);
  });
  matchMedia('(min-width:761px)').addEventListener('change', event => { if (event.matches) setMenu(false); });

  const frames = Array.from(document.querySelectorAll('[data-frame]'));
  const dashes = Array.from(document.querySelectorAll('.slide-dashes i'));
  const captions = ['На повороте', 'Вдоль набережной', 'За рулём'];
  let index = 0;
  function changeFrame(delta) {
    index = (index + delta + frames.length) % frames.length;
    frames.forEach((frame, i) => { frame.hidden = i !== index; dashes[i].classList.toggle('active', i === index); });
    document.querySelector('.slide-count b').textContent = String(index + 1).padStart(2, '0');
    document.querySelector('.slide-label').textContent = captions[index];
  }
  document.querySelectorAll('[data-slide]').forEach(button => button.addEventListener('click', () => changeFrame(Number(button.dataset.slide))));
  const gallery = document.querySelector('.cover-media');
  let startX, startY;
  gallery.addEventListener('touchstart', event => {
    if (event.touches.length === 1) { startX = event.touches[0].clientX; startY = event.touches[0].clientY; }
  }, { passive: true });
  gallery.addEventListener('touchend', event => {
    const dx = event.changedTouches[0].clientX - startX;
    const dy = event.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.6) changeFrame(dx < 0 ? 1 : -1);
  }, { passive: true });

  const programs = {
    start: {title:'Первое знакомство с машиной', summary:'Настроите посадку, почувствуете педаль тормоза и проедете свой первый поворот вместе с инструктором.', image:'detail', alt:'Руки водителя на руле учебного автомобиля'},
    city: {title:'Дорога, по которой вы ездите', summary:'Выберите привычный адрес. Вместе разберём сложный съезд, перестроение перед поворотом и парковку в конце пути.', image:'street', alt:'Автомобиль на городской набережной'},
    return: {title:'Спокойное возвращение за руль', summary:'Начнём на тихой улице. Освежите работу с зеркалами и манёвры, затем попробуете знакомый маршрут в городском потоке.', image:'instructor', alt:'Инструктор и ученица обсуждают маршрут в салоне автомобиля'}
  };
  const selectors = Array.from(document.querySelectorAll('[data-course]'));
  const photo = document.querySelector('#course-photo');
  const pick = document.querySelector('.course-open');
  selectors.forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.course;
    const course = programs[id];
    selectors.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelector('#course-heading').textContent = course.title;
    document.querySelector('#course-summary').textContent = course.summary;
    photo.src = './assets/' + course.image + '.webp';
    photo.alt = course.alt;
    pick.dataset.book = id;
    pick.setAttribute('aria-label', 'Подобрать занятие по программе ' + button.querySelector('b').textContent);
  }));
})();
