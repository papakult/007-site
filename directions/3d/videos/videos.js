const grid = document.querySelector('#video-list');
const cards = Array.from(grid.querySelectorAll('.video-card'));
const search = document.querySelector('#video-search');
const category = document.querySelector('#video-category');
const count = document.querySelector('#video-count');
const pagination = document.querySelector('.video-pagination');
const more = document.querySelector('#show-more');
const dialog = document.querySelector('#video-dialog');
const title = document.querySelector('#video-title');
const player = dialog.querySelector('video');
const direct = document.querySelector('#open-mp4');
const model = document.querySelector('#open-model');
const pageSize = 24;
const normalize = text => text.toLocaleLowerCase('ru').replaceAll('ё', 'е');
const cardTitles = cards.map(card => normalize(card.querySelector('h2').textContent));
let limit = pageSize;
let active = null;
let trigger = null;

function showCards() {
  const words = normalize(search.value.trim()).split(/\s+/);
  let matched = 0;
  for (const [index, card] of cards.entries()) {
    const inCategory = !category.value || card.dataset.group === category.value;
    const relevant = inCategory && words.every(word => cardTitles[index].includes(word));
    card.hidden = !relevant || ++matched > limit;
  }
  count.textContent = `Найдено ${matched} из ${cards.length}`;
  pagination.hidden = matched <= limit;
}

function resetFilter() {
  limit = pageSize;
  showCards();
}

function openVideo(card, autoplay) {
  if (active === card && dialog.open) return;
  const video = card.querySelector('[data-play]');
  const assembly = card.querySelector('a[href*="?model="]');
  active = card;
  title.textContent = card.querySelector('h2').textContent;
  direct.href = video.href;
  model.hidden = !assembly;
  if (assembly) model.href = assembly.href;
  player.poster = video.querySelector('img').src;
  player.src = video.href;
  if (!dialog.open) dialog.showModal();
  if (autoplay) player.play().catch(() => {});
}

function followHash() {
  const hash = location.hash.slice(1);
  const card = hash.startsWith('demo-') ? document.getElementById(hash) : null;
  if (card) openVideo(card, false);
  else if (dialog.open) dialog.close();
}

search.addEventListener('input', resetFilter);
category.addEventListener('change', resetFilter);
more.addEventListener('click', () => {
  limit += pageSize;
  showCards();
});
grid.addEventListener('click', event => {
  const link = event.target.closest('[data-play]');
  if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey ||
      typeof dialog.showModal !== 'function') return;
  event.preventDefault();
  const card = link.closest('.video-card');
  trigger = link;
  history.replaceState(null, '', '#' + card.id);
  openVideo(card, true);
});
document.querySelector('#video-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => {
  player.pause();
  player.removeAttribute('src');
  player.load();
  if (location.hash.slice(1) === active?.id) history.replaceState(null, '', location.pathname + location.search);
  active = null;
  trigger?.focus();
  trigger = null;
});
document.querySelector('.video-tools').hidden = false;
showCards();
if (typeof dialog.showModal === 'function') {
  window.addEventListener('hashchange', followHash);
  followHash();
}
