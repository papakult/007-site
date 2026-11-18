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
    pick.setAttribute('aria-label', 'Посмотреть занятие по программе ' + button.querySelector('b').textContent);
  }));
})();
