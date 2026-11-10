'use strict';

const rooms = [
  {
    id: '03', name: 'Классика', size: 24, capacity: 2, rate: 8500,
    cover: 'classic.webp', alt: 'Две кровати и окно со светлыми шторами',
    description: 'Две отдельные кровати и окно во внутренний двор.',
  },
  {
    id: '05', name: 'Комфорт', size: 31, capacity: 2, rate: 11200,
    cover: 'comfort.jpg', alt: 'Спальня в оливковых тонах с большой кроватью',
    description: 'Большая кровать, оливковые стены и кресло для чтения.',
  },
  {
    id: '07', name: 'Люкс 07', size: 46, capacity: 3, rate: 15800,
    cover: 'suite.webp', alt: 'Двуспальная кровать у высокого арочного окна',
    description: 'Арочное окно на старый город и отдельный уголок с диваном, где можно выпить кофе.',
  },
];

const oneDay = 86400000;
const money = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });
const shortDate = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const fullDate = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', timeZone: 'UTC' });
const dayName = new Intl.DateTimeFormat('ru-RU', { weekday: 'short', timeZone: 'UTC' });
const now = new Date();
const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString().slice(0, 10);

const form = document.querySelector('#date-form');
const arrival = form.elements.arrival;
const departure = form.elements.departure;
const guests = form.elements.guests;
const grid = document.querySelector('#room-grid');
const template = document.querySelector('#room-template');
const checkout = document.querySelector('#checkout');
const confirm = document.querySelector('#confirm');
const seeBooking = document.querySelector('#see-booking');
const seeStudio = document.querySelector('#see-studio');
const table = document.querySelector('.table-scroll');
const occupied = new Map();
const reservations = new Map();
let firstDay = today;
let selectedDate = today;
let selection;
let draft;
let nextBooking = 3;

function addDays(iso, count) {
  return new Date(Date.parse(iso) + count * oneDay).toISOString().slice(0, 10);
}

function dateLabel(date) {
  return shortDate.format(new Date(date));
}

function rangeLabel(start, end) {
  return dateLabel(start) + ' по ' + dateLabel(end);
}

function getStay() {
  const start = arrival.value;
  const end = departure.value;
  const nights = (Date.parse(end) - Date.parse(start)) / oneDay;
  if (!start || !end || start < today || !Number.isInteger(nights) || nights < 1 || nights > 30) return null;
  return { start, end, nights, people: Number(guests.value) };
}

function getNights(stay) {
  return Array.from({ length: stay.nights }, (_, index) => addDays(stay.start, index));
}

function isAvailable(room, stay) {
  return room.capacity >= stay.people && getNights(stay).every(date => !occupied.has(room.id + date));
}

function nightsLabel(nights) {
  const tens = nights % 100;
  const units = nights % 10;
  if (tens >= 11 && tens <= 14) return nights + ' ночей';
  if (units === 1) return nights + ' ночь';
  return nights + (units >= 2 && units <= 4 ? ' ночи' : ' ночей');
}

function renderRooms() {
  const stay = getStay();
  const summary = document.querySelector('#availability');
  grid.replaceChildren();
  if (!stay) {
    summary.textContent = 'Выберите даты, от одной до 30 ночей.';
    return;
  }
  const free = rooms.filter(room => isAvailable(room, stay)).length;
  summary.textContent = 'С ' + rangeLabel(stay.start, stay.end) + ' · ' + nightsLabel(stay.nights) + ' · свободно ' + free + ' из ' + rooms.length;
  for (const room of rooms) {
    const card = template.content.cloneNode(true);
    const image = card.querySelector('img');
    const available = isAvailable(room, stay);
    image.src = 'assets/' + room.cover;
    image.alt = room.alt;
    card.querySelector('.room-state').textContent = available ? 'Свободен' : 'Недоступен';
    card.querySelector('.room-meta').textContent = room.size + ' м² · до ' + room.capacity + ' гостей';
    card.querySelector('h3').textContent = room.name;
    card.querySelector('.room-description').textContent = room.description;
    card.querySelector('.room-price').textContent = money.format(room.rate * stay.nights);
    card.querySelector('.room-rate').textContent = money.format(room.rate) + ' за ночь';
    const book = card.querySelector('.room-action button');
    book.textContent = available ? 'Забронировать' : 'Недоступен';
    book.disabled = !available;
    book.setAttribute('aria-label', available ? 'Забронировать номер ' + room.name : room.name + ' недоступен');
    book.addEventListener('click', () => openCheckout(room));
    const tour = card.querySelector('.room-image');
    tour.setAttribute('aria-label', 'Открыть в 3D: ' + room.name);
    tour.setAttribute('aria-haspopup', 'dialog');
    tour.addEventListener('click', () => openDetail(room));
    grid.append(card);
  }
}

function openDetail(room) {
  const stay = getStay();
  const available = stay && isAvailable(room, stay);
  openHotelTour(room, available, () => {
    if (available) openCheckout(room);
    else {
      document.querySelector('#stay').scrollIntoView();
      arrival.focus({ preventScroll: true });
    }
  });
}

function openCheckout(room) {
  const stay = getStay();
  if (!stay || !isAvailable(room, stay)) return;
  draft = { ...stay, room };
  document.querySelector('#checkout-title').textContent = 'Пробная бронь';
  document.querySelector('#checkout-details').textContent =
    room.name + ' · С ' + rangeLabel(stay.start, stay.end) + ' · ' + nightsLabel(stay.nights) + ' · ' + money.format(room.rate * stay.nights);
  document.querySelector('#checkout-message').textContent = 'Для тестовой брони достаточно подтвердить выбранные даты.';
  confirm.hidden = false;
  seeBooking.hidden = true;
  seeStudio.hidden = true;
  checkout.showModal();
}

function addReservation(number, room, start, end, people) {
  const stay = { number, room, start, end, people, nights: (Date.parse(end) - Date.parse(start)) / oneDay };
  reservations.set(number, stay);
  for (const date of getNights(stay)) occupied.set(room.id + date, number);
  return stay;
}

function selectDate(date, event) {
  selectedDate = date;
  selection = event;
  renderCalendar();
}

function returnToControl(key) {
  const target = table.querySelector('[data-control="' + key + '"]');
  target?.focus({ preventScroll: true });
}

function dayButton(date) {
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.control = date;
  button.setAttribute('aria-pressed', String(date === selectedDate));
  button.setAttribute('aria-label', fullDate.format(new Date(date)));
  const day = document.createElement('span');
  day.textContent = dayName.format(new Date(date));
  const number = document.createElement('b');
  number.textContent = String(Number(date.slice(-2)));
  button.append(day, number);
  button.addEventListener('click', () => {
    selectDate(date);
    returnToControl(date);
  });
  return button;
}

function roomRow(room, days) {
  const row = document.createElement('tr');
  const name = document.createElement('th');
  const roomNumber = document.createElement('b');
  name.scope = 'row';
  roomNumber.textContent = room.id;
  name.append(roomNumber, document.createTextNode(room.name));
  row.append(name);
  for (let index = 0; index < days.length; index++) {
    const date = days[index];
    const td = document.createElement('td');
    const state = occupied.get(room.id + date);
    const stay = reservations.get(state);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'calendar-cell ' + (stay ? 'booked' : state ? 'blocked' : 'free');
    if (stay) {
      let span = 1;
      while (index + span < days.length && occupied.get(room.id + days[index + span]) === state) span++;
      td.colSpan = span;
      index += span - 1;
      button.dataset.control = state;
      button.classList.toggle('is-selected', selection === stay);
      button.textContent = 'Бронь ' + stay.number;
      button.setAttribute('aria-label', button.textContent + ', ' + room.name);
      button.addEventListener('click', () => {
        selectDate(stay.start < firstDay ? firstDay : stay.start, stay);
        returnToControl(state);
      });
    } else {
      const key = room.id + date;
      td.classList.toggle('selected-day', date === selectedDate);
      button.dataset.control = key;
      button.classList.toggle('is-selected', selection?.key === key);
      button.textContent = state ? 'Закрыто' : 'Свободно';
      button.setAttribute('aria-label', room.name + ', ' + dateLabel(date) + ', ' + button.textContent.toLowerCase());
      button.addEventListener('click', () => {
        selectDate(date, { room, key, date });
        returnToControl(key);
      });
    }
    td.append(button);
    row.append(td);
  }
  return row;
}

function renderDesk() {
  const arrivals = [...reservations.values()].filter(stay => stay.start === selectedDate);
  const departures = [...reservations.values()].filter(stay => stay.end === selectedDate);
  const free = rooms.filter(room => !occupied.has(room.id + selectedDate));
  document.querySelector('#metric-arrivals').textContent = arrivals.length;
  document.querySelector('#metric-departures').textContent = departures.length;
  document.querySelector('#metric-free').textContent = free.length + '/' + rooms.length;
  const kicker = document.querySelector('#desk-detail-kicker');
  const title = document.querySelector('#desk-detail-title');
  const content = document.querySelector('#desk-detail-content');
  content.replaceChildren();
  if (selection) {
    const { room, number, key, date } = selection;
    kicker.textContent = number ? 'Карточка брони' : 'Доступность номера';
    title.textContent = number ? 'Бронь ' + number : room.name;
    const summary = document.createElement('p');
    const blocked = key && occupied.has(key);
    summary.textContent = number
      ? room.name + ', номер ' + room.id + '. С ' + rangeLabel(selection.start, selection.end) + '.'
      : fullDate.format(new Date(date)) + '. ' + (blocked ? 'Ночь закрыта.' : 'Ночь открыта для брони.');
    content.append(summary);
    if (number) {
      const price = document.createElement('strong');
      price.textContent = money.format(room.rate * selection.nights);
      content.append(price);
    } else {
      const toggle = document.createElement('button');
      toggle.className = 'button button-dark';
      toggle.type = 'button';
      toggle.textContent = blocked ? 'Открыть ночь' : 'Закрыть ночь';
      toggle.addEventListener('click', () => {
        if (blocked) occupied.delete(key);
        else occupied.set(key, 'blocked');
        renderRooms();
        renderCalendar();
        document.querySelector('#desk-detail-content .button').focus({ preventScroll: true });
        document.querySelector('#calendar-status').textContent = blocked ? 'Ночь открыта для брони.' : 'Ночь закрыта.';
      });
      content.append(toggle);
    }
    return;
  }
  kicker.textContent = 'Выбранный день';
  title.textContent = fullDate.format(new Date(selectedDate));
  for (const [label, stays] of [['Заезжают', arrivals], ['Выезжают', departures]]) {
    const block = document.createElement('div');
    block.className = 'desk-day-item';
    const heading = document.createElement('b');
    heading.textContent = label;
    const detail = document.createElement('span');
    detail.textContent = stays.length ? stays.map(stay => stay.room.name + ' · ' + stay.number).join(', ') : 'Нет';
    block.append(heading, detail);
    content.append(block);
  }
}

function renderCalendar() {
  const end = addDays(firstDay, 6);
  const days = Array.from({ length: 7 }, (_, index) => addDays(firstDay, index));
  document.querySelector('#calendar-period').textContent = rangeLabel(firstDay, end);
  const heading = document.createElement('tr');
  const label = document.createElement('th');
  label.scope = 'col';
  label.textContent = 'Номер';
  heading.append(label);
  for (const date of days) {
    const th = document.createElement('th');
    th.scope = 'col';
    th.append(dayButton(date));
    heading.append(th);
  }
  document.querySelector('#calendar-head').replaceChildren(heading);
  document.querySelector('#calendar-body').replaceChildren(...rooms.map(room => roomRow(room, days)));
  renderDesk();
}

function setWeek(day, event) {
  firstDay = day;
  table.scrollLeft = 0;
  selectDate(day, event);
}

function setDepartureRange() {
  if (!arrival.value) return;
  departure.min = addDays(arrival.value, 1);
  departure.max = addDays(arrival.value, 30);
  if (!departure.value || departure.value < departure.min || departure.value > departure.max) {
    departure.value = addDays(arrival.value, 2);
  }
}

form.addEventListener('change', event => {
  if (event.target === arrival) setDepartureRange();
  renderRooms();
});
form.addEventListener('submit', event => {
  event.preventDefault();
  renderRooms();
  document.querySelector('#rooms').scrollIntoView({ block: 'start' });
});

confirm.addEventListener('click', () => {
  const stay = draft;
  if (!stay || !isAvailable(stay.room, stay)) return;
  const number = '№' + String(nextBooking++).padStart(3, '0');
  const booking = addReservation(number, stay.room, stay.start, stay.end, stay.people);
  setWeek(stay.start, booking);
  document.querySelector('#calendar-status').textContent = stay.room.name + ' · тестовая бронь ' + number + ' · ' + rangeLabel(stay.start, stay.end);
  document.querySelector('#checkout-title').textContent = 'Бронь ' + number + ' готова';
  document.querySelector('#checkout-message').textContent = 'Тестовая бронь появилась в расписании отельера.';
  confirm.hidden = true;
  seeBooking.hidden = false;
  seeStudio.hidden = false;
  seeBooking.focus();
  renderRooms();
});

for (const link of [seeBooking, seeStudio]) {
  link.addEventListener('click', () => checkout.close());
}

for (const button of document.querySelectorAll('[data-open-tour]')) {
  const room = rooms.find(item => item.id === button.dataset.openTour);
  button.addEventListener('click', () => openDetail(room));
}
document.querySelector('#prev-week').addEventListener('click', () => setWeek(addDays(firstDay, -7)));
document.querySelector('#next-week').addEventListener('click', () => setWeek(addDays(firstDay, 7)));
document.querySelector('#today').addEventListener('click', () => setWeek(today));

addReservation('№001', rooms[0], today, addDays(today, 1), 2);
addReservation('№002', rooms[1], addDays(today, 4), addDays(today, 6), 2);
arrival.min = today;
arrival.value = addDays(today, 1);
setDepartureRange();
renderRooms();
renderCalendar();


const previewVideo = document.querySelector('#preview-video');
const previewMotion = document.querySelector('#preview-motion');
const landscapeVideo = document.querySelector('#landscape-video');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
let previewPaused = false;

function updatePreviewMotion() {
  previewMotion.textContent = previewVideo.paused ? 'Играть' : 'Пауза';
}

async function playPreview() {
  if (reduceMotion.matches || previewPaused) return;
  try {
    await previewVideo.play();
    previewMotion.hidden = false;
  } catch {
    previewMotion.hidden = true;
  }
}

const previewVisibility = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) void playPreview();
  else previewVideo.pause();
}, { threshold: .45 });
previewVisibility.observe(previewVideo);
reduceMotion.addEventListener('change', () => {
  if (reduceMotion.matches) {
    previewVideo.pause();
    previewMotion.hidden = true;
  } else {
    void playPreview();
  }
});
previewMotion.addEventListener('click', () => {
  previewPaused = !previewPaused;
  if (previewPaused) previewVideo.pause();
  else void playPreview();
});
previewVideo.addEventListener('play', updatePreviewMotion);
previewVideo.addEventListener('pause', updatePreviewMotion);
document.querySelector('.landscape-preview').addEventListener('click', () => {
  void landscapeVideo.play().catch(() => {});
});
