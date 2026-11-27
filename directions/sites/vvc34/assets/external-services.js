(() => {
  'use strict';

  const key = 'vvc34.externalServices';
  const version = 1;
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  const actionSelector = '[data-vvc-external-settings]';
  let dialog;
  let previousFocus;
  let returnRegion;
  let timer;
  let lastAllowed;
  let memoryOnly = false;
  let choice = null;

  function valid(record) {
    return record?.version === version && typeof record.allowed === 'boolean'
      && Number.isFinite(record.expires) && record.expires > Date.now();
  }

  function readChoice() {
    try {
      const record = JSON.parse(localStorage.getItem(key));
      return valid(record) ? record : null;
    } catch {
      return null;
    }
  }

  function apply() {
    const allowed = valid(choice) && choice.allowed;
    if (allowed !== lastAllowed) {
      document.querySelectorAll('[data-vvc-when-blocked]').forEach(node => { node.hidden = allowed; });
      document.querySelectorAll('[data-vvc-when-allowed]').forEach(node => { node.hidden = !allowed; });
      document.querySelectorAll('img[data-vvc-external-src]').forEach(img => {
        if (allowed) img.src = img.dataset.vvcExternalSrc;
        else img.removeAttribute('src');
      });
      document.querySelectorAll('template[data-vvc-external-map]').forEach(template => {
        const frame = template.parentElement.querySelector('iframe');
        if (allowed && !frame) template.after(template.content.cloneNode(true));
        if (!allowed) frame?.remove();
      });
      lastAllowed = allowed;
    }

    if (dialog?.open) updateStatus();
    window.clearTimeout(timer);
    if (valid(choice)) {
      // Browser timers accept a signed 32-bit delay. Recheck longer lifetimes in steps.
      timer = window.setTimeout(sync, Math.min(2147483647, choice.expires - Date.now() + 1));
    }
  }

  function sync() {
    if (!memoryOnly) choice = readChoice();
    if (!valid(choice)) choice = null;
    apply();
  }

  function updateStatus() {
    dialog.querySelector('[data-vvc-current]').textContent = choice?.allowed
      ? 'Сейчас загрузка разрешена.' : 'Сейчас загрузка выключена.';
  }

  function save(allowed) {
    choice = {version, allowed, expires: Date.now() + lifetime};
    try {
      localStorage.setItem(key, JSON.stringify(choice));
      memoryOnly = false;
    } catch {
      memoryOnly = true;
      try { localStorage.removeItem(key); } catch { /* Browser storage is unavailable. */ }
    }
    apply();
    dialog.close();
  }

  function openSettings(trigger) {
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.className = 'vvc-ext-dialog';
      dialog.setAttribute('aria-labelledby', 'vvc-ext-title');
      dialog.setAttribute('aria-describedby', 'vvc-ext-explanation');
      dialog.innerHTML = `
        <h2 id="vvc-ext-title">Внешние сервисы Яндекса</h2>
        <p id="vvc-ext-explanation">Яндекс загружает интерактивную карту на странице контактов и изображения в отзывах. При загрузке Яндекс получает ваш IP-адрес и сведения о браузере и может использовать cookie.</p>
        <p>Адрес клиники и тексты отзывов доступны при любом выборе. Выбор сохраняется в этом браузере на 180 дней. Изменить его можно внизу любой страницы.</p>
        <p class="vvc-ext-status" data-vvc-current></p>
        <a class="vvc-ext-link" href="privacy.html#cookies">Подробнее о cookie</a>
        <div class="vvc-ext-options">
          <button type="button" data-vvc-deny>Не разрешать</button>
          <button type="button" data-vvc-allow>Разрешить</button>
        </div>
        <button type="button" class="vvc-ext-close" aria-label="Закрыть настройки" autofocus>×</button>`;
      document.body.append(dialog);
      dialog.addEventListener('keydown', event => event.stopPropagation());
      dialog.querySelector('[data-vvc-deny]').addEventListener('click', () => save(false));
      dialog.querySelector('[data-vvc-allow]').addEventListener('click', () => save(true));
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
    updateStatus();
    dialog.showModal();
  }

  document.querySelectorAll(actionSelector).forEach(button => { button.hidden = false; });
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
