(() => {
  'use strict';

  const panel = document.getElementById('visit-demo');
  if (!panel) return;

  const element = id => document.getElementById(id);
  const picker = element('visit-picker');
  const preview = element('visit-preview');
  const specialty = element('booking-service');
  const specialist = element('booking-doctor');
  const date = element('booking-date');
  const slotButtons = Array.from(panel.querySelectorAll('[data-slot]'));
  const error = element('visit-error');
  const { doctors } = JSON.parse(element('site-data').textContent);
  const initial = new URLSearchParams(location.search);
  const displayDate = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  });
  let time = '';

  function populateDoctors(preferred) {
    specialist.replaceChildren(new Option('По направлению', 'any'));
    for (const doctor of doctors) {
      if (specialty.value === 'any' || doctor.areas.includes(specialty.value)) {
        specialist.add(new Option(doctor.name, doctor.id));
      }
    }
    if (Array.from(specialist.options).some(option => option.value === preferred)) {
      specialist.value = preferred;
    }
  }

  function dateInMoscow(daysAhead) {
    const iso = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Moscow' }).format(new Date());
    const day = new Date(iso + 'T12:00:00Z');
    day.setUTCDate(day.getUTCDate() + daysAhead);
    return day.toISOString().slice(0, 10);
  }

  function selectTime(value) {
    time = value;
    slotButtons.forEach(button => {
      const selected = button.dataset.slot === value;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    error.textContent = '';
  }

  function reset(preselect = false) {
    specialty.value = 'any';
    if (preselect && Array.from(specialty.options).some(option => option.value === initial.get('service'))) {
      specialty.value = initial.get('service');
    }
    populateDoctors(preselect ? initial.get('doctor') : null);
    date.min = dateInMoscow(1);
    date.max = dateInMoscow(90);
    date.value = date.min;
    selectTime('');
    for (const id of ['visit-specialty', 'visit-specialist', 'visit-datetime']) {
      element(id).textContent = '';
    }
    preview.hidden = true;
    picker.hidden = false;
  }

  function showPreview() {
    if (!date.checkValidity() || !date.value) {
      error.textContent = 'Выберите дату в ближайшие 90 дней, начиная с завтра.';
      date.focus();
      return;
    }
    if (!time) {
      error.textContent = 'Выберите время для примера визита.';
      slotButtons[0].focus();
      return;
    }
    element('visit-specialty').textContent = specialty.selectedOptions[0].textContent;
    element('visit-specialist').textContent = specialist.value === 'any'
      ? 'Специалист по выбранному направлению'
      : specialist.selectedOptions[0].textContent;
    element('visit-datetime').textContent = displayDate.format(new Date(date.value + 'T12:00:00Z')) +
      ' · ' + time + ' по Москве';
    picker.hidden = true;
    preview.hidden = false;
    element('preview-title').focus();
  }

  specialty.addEventListener('change', () => populateDoctors(specialist.value));
  date.addEventListener('input', () => { error.textContent = ''; });
  slotButtons.forEach(button => button.addEventListener('click', () => selectTime(button.dataset.slot)));
  element('visit-show').addEventListener('click', showPreview);
  element('visit-change').addEventListener('click', () => {
    picker.hidden = false;
    preview.hidden = true;
    specialty.focus();
  });
  element('visit-reset').addEventListener('click', () => { reset(); specialty.focus(); });
  window.addEventListener('pageshow', event => { if (event.persisted) reset(true); });
  reset(true);
})();
