(() => {
  'use strict';

  const examples = {
    start: {
      title: 'С нуля',
      focus: 'Посадка, зеркала и первый поворот',
      steps: ['Настроить кресло и зеркала с инструктором.', 'На площадке почувствовать отклик тормоза.', 'Пройти поворот и плавно остановиться у ориентира.'],
    },
    city: {
      title: 'Мой маршрут',
      focus: 'Знакомая поездка по городу',
      steps: ['Разобрать выезд из двора на схеме.', 'Выбрать полосу перед сложным перекрёстком.', 'Повторить маршрут и обсудить парковку у финиша.'],
    },
    return: {
      title: 'Снова за руль',
      focus: 'Спокойное возвращение после перерыва',
      steps: ['На тихой улице вспомнить габариты автомобиля.', 'Повторить перестроение вместе с инструктором.', 'Потренироваться в парковке на свободном месте.'],
    },
  };

  function init() {
    const dialog = document.createElement('dialog');
    dialog.className = 'adb-dialog';
    dialog.setAttribute('aria-labelledby', 'adb-heading');
    dialog.innerHTML = `<div class="adb-body">
      <div class="adb-mast"><span class="adb-mast-label">Образец занятия</span>
        <button class="adb-close" type="button" aria-label="Закрыть">×</button>
      </div>
      <h2 class="adb-heading" id="adb-heading">Первый урок</h2>
      <div class="adb-options" aria-label="Готовые программы" role="group"></div>
      <div aria-live="polite"><h3 class="adb-focus"></h3><ol class="adb-steps"></ol></div>
      <div class="adb-actions"><button class="adb-next" type="button">Скачать пример</button></div>
    </div>`;
    document.body.appendChild(dialog);
    const controls = dialog.querySelector('.adb-options');
    const focus = dialog.querySelector('.adb-focus');
    const list = dialog.querySelector('.adb-steps');
    let current = examples.start;
    let opener;

    function show(id) {
      current = Object.hasOwn(examples, id) ? examples[id] : examples.start;
      focus.textContent = current.focus;
      list.replaceChildren(...current.steps.map(text => {
        const item = document.createElement('li');
        item.textContent = text;
        return item;
      }));
      for (const button of controls.children) {
        button.setAttribute('aria-pressed', String(examples[button.dataset.example] === current));
      }
    }

    for (const [id, example] of Object.entries(examples)) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'adb-example';
      button.dataset.example = id;
      button.textContent = example.title;
      button.addEventListener('click', () => show(id));
      controls.appendChild(button);
    }

    function open(id, trigger) {
      if (dialog.open) return;
      show(id);
      opener = trigger;
      dialog.showModal();
      document.documentElement.classList.add('adb-modal-open');
      controls.querySelector('[aria-pressed="true"]').focus({ preventScroll: true });
    }

    dialog.querySelector('.adb-next').addEventListener('click', () => {
      const content = ['ATELIER DRIVE', current.title, '', current.focus, ...current.steps].join('\n');
      const file = URL.createObjectURL(new Blob(['\uFEFF', content], { type: 'text/plain;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = file;
      link.download = 'atelier-drive-plan.txt';
      dialog.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(file), 1000);
    });
    dialog.querySelector('.adb-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.documentElement.classList.remove('adb-modal-open');
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    });
    document.addEventListener('click', event => {
      const trigger = event.target.closest('[data-book]');
      if (!trigger || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      open(trigger.dataset.book, trigger);
    });
    const params = new URLSearchParams(location.search);
    if (params.get('book') === '1') open(params.get('course'), null);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
