(() => {
  'use strict';

  const key = 'vvc34.externalServices';
  const version = 2;
  const defaults = {map: false, photos: false};
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  const actionSelector = '[data-vvc-external-settings]';
  let dialog;
  let previousFocus;
  let returnRegion;
  let timer;
  let lastMap;
  let lastPhotos;
  let memoryOnly = false;
  let choice = null;

  function readChoice() {
    try {
      const record = JSON.parse(localStorage.getItem(key));
      if (!record || !Number.isFinite(record.expires) || record.expires <= Date.now()) return null;
      if (record.version === 1 && typeof record.allowed === 'boolean') {
        return {version, map: record.allowed, photos: record.allowed, expires: record.expires};
      }
      return record.version === version && typeof record.map === 'boolean' && typeof record.photos === 'boolean'
        ? record : null;
    } catch {
      return null;
    }
  }

  function apply() {
    const {map, photos} = choice || defaults;
    if (map !== lastMap) {
      document.querySelectorAll('[data-vvc-map-blocked]').forEach(node => { node.hidden = map; });
      document.querySelectorAll('template[data-vvc-external-map]').forEach(template => {
        const frame = template.parentElement.querySelector('iframe');
        if (map && !frame) template.after(template.content.cloneNode(true));
        if (!map) frame?.remove();
      });
      lastMap = map;
    }
    if (photos !== lastPhotos) {
      document.querySelectorAll('[data-vvc-when-blocked]').forEach(node => { node.hidden = photos; });
      document.querySelectorAll('[data-vvc-when-allowed]').forEach(node => { node.hidden = !photos; });
      document.querySelectorAll('img[data-vvc-external-src]').forEach(img => {
        if (photos) img.src = img.dataset.vvcExternalSrc;
        else img.removeAttribute('src');
      });
      lastPhotos = photos;
    }

    window.clearTimeout(timer);
    if (choice) {
      // Browser timers accept a signed 32-bit delay. Recheck longer lifetimes in steps.
      timer = window.setTimeout(sync, Math.min(2147483647, choice.expires - Date.now() + 1));
    }
  }

  function sync() {
    if (!memoryOnly) choice = readChoice();
    if (choice && choice.expires <= Date.now()) choice = null;
    const {map, photos} = choice || defaults;
    if (dialog?.open && (lastMap !== map || lastPhotos !== photos)) updateOptions();
    apply();
  }

  function updateOptions() {
    const {map, photos} = choice || defaults;
    dialog.querySelector('[data-vvc-map]').checked = map;
    dialog.querySelector('[data-vvc-photos]').checked = photos;
  }

  function save(map, photos) {
    choice = {version, map, photos, expires: Date.now() + lifetime};
    try {
      localStorage.setItem(key, JSON.stringify(choice));
      memoryOnly = false;
    } catch {
      memoryOnly = true;
      try { localStorage.removeItem(key); } catch { /* Browser storage is unavailable. */ }
    }
    apply();
    if (dialog?.open) dialog.close();
  }

  function openSettings(trigger) {
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.className = 'vvc-ext-dialog';
      dialog.setAttribute('aria-labelledby', 'vvc-ext-title');
      dialog.setAttribute('aria-describedby', 'vvc-ext-explanation');
      dialog.innerHTML = `
        <h2 id="vvc-ext-title">Внешние сервисы Яндекса</h2>
        <p id="vvc-ext-explanation">При загрузке карты или фотографий Яндекс получает IP-адрес и сведения о браузере и может использовать cookie и статистику.</p>
        <div class="vvc-ext-services">
          <label><input type="checkbox" data-vvc-map> Карта на странице контактов</label>
          <label><input type="checkbox" data-vvc-photos> Фотографии и аватары в отзывах</label>
        </div>
        <p>Выбор сохраняется в этом браузере на 180 дней.</p>
        <a class="vvc-ext-link" href="privacy.html#cookies">Подробнее о cookie</a>
        <div class="vvc-ext-options">
          <button type="button" data-vvc-deny>Отключить всё</button>
          <button type="button" data-vvc-save>Сохранить выбор</button>
        </div>
        <button type="button" class="vvc-ext-close" aria-label="Закрыть настройки" autofocus>×</button>`;
      document.body.append(dialog);
      dialog.addEventListener('keydown', event => event.stopPropagation());
      dialog.querySelector('[data-vvc-deny]').addEventListener('click', () => save(false, false));
      dialog.querySelector('[data-vvc-save]').addEventListener('click', () => {
        save(dialog.querySelector('[data-vvc-map]').checked, dialog.querySelector('[data-vvc-photos]').checked);
      });
      dialog.querySelector('.vvc-ext-close').addEventListener('click', () => dialog.close());
      dialog.addEventListener('close', () => {
        if (previousFocus?.isConnected && previousFocus.getClientRects().length) {
          previousFocus.focus({preventScroll: true});
        } else if (returnRegion?.isConnected) {
          returnRegion.tabIndex = -1;
          returnRegion.focus({preventScroll: true});
        }
      });
    }
    if (dialog.open) return;
    previousFocus = trigger || document.activeElement;
    returnRegion = previousFocus?.closest('section');
    sync();
    updateOptions();
    dialog.showModal();
  }

  document.querySelectorAll(actionSelector + ', [data-vvc-show-map]').forEach(button => { button.hidden = false; });
  const showMap = document.querySelector('[data-vvc-show-map]');
  showMap?.addEventListener('click', () => {
    sync();
    save(true, (choice || defaults).photos);
    document.querySelector('.contact-location__map iframe')?.focus({preventScroll: true});
  });
  document.addEventListener('click', event => {
    const control = event.target.closest?.(actionSelector);
    if (control) openSettings(control);
  });
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) {
      memoryOnly = false;
      sync();
    }
  });
  window.addEventListener('pageshow', sync);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) sync(); });
  window.VvcExternalServices = {openSettings};
  sync();
})();
