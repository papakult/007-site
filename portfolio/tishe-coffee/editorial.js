(() => {
  const trigger = document.querySelector('[data-open-film]');
  const cinema = document.getElementById('cinema');
  const reel = document.getElementById('reel');
  const closeButton = cinema.querySelector('.reel-close');
  const errorNote = cinema.querySelector('.reel-error');
  const backdropContent = [...document.querySelectorAll('.mast, .cover-copy, .film-strip')];

  function closeFilm() {
    reel.pause();
    cinema.hidden = true;
    backdropContent.forEach(element => { element.inert = false; });
    trigger.focus({ preventScroll: true });
  }

  trigger.addEventListener('click', async event => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (!reel.getAttribute('src')) reel.src = trigger.href;
    errorNote.hidden = true;
    cinema.hidden = false;
    backdropContent.forEach(element => { element.inert = true; });
    if (reel.readyState >= 1) reel.currentTime = 0;
    closeButton.focus({ preventScroll: true });
    try {
      await reel.play();
    } catch (error) {
      if (!cinema.hidden && error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
        errorNote.hidden = false;
      }
    }
  });
  closeButton.addEventListener('click', closeFilm);
  reel.addEventListener('error', () => { errorNote.hidden = false; });
  document.addEventListener('keydown', event => {
    if (!cinema.hidden && event.key === 'Escape' && !document.fullscreenElement) closeFilm();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) reel.pause(); });
})();

(() => {
  const gallery = document.querySelector('.shots');
  const cover = document.querySelector('.cover');
  const descriptions = {
    room: 'Утренний свет в кофейне с барной стойкой из бордового мрамора.',
    cover: 'Фарфоровая чашка эспрессо в боковом свете на бордовом мраморе.',
    drop: 'Макрокадр янтарной капли над поверхностью эспрессо.'
  };
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let displayed = cover.querySelector('.cover-photo');
  let requested = 'room';
  let pending = null;

  async function selectShot(button) {
    const key = button.dataset.scene;
    if (requested === key) return;
    requested = key;
    pending?.remove();
    pending = null;
    if (key === displayed.dataset.scene) return;

    const next = document.createElement('picture');
    const source = document.createElement('source');
    const image = document.createElement('img');
    next.className = 'cover-photo';
    next.dataset.scene = key;
    next.setAttribute('aria-hidden', 'true');
    next.style.opacity = '0';
    source.media = '(max-width: 650px)';
    source.srcset = 'assets/editorial/' + key + '-portrait.webp';
    image.alt = descriptions[key];
    next.append(source, image);
    displayed.after(next);
    image.src = 'assets/editorial/' + key + '.webp';
    pending = next;
    try {
      await image.decode();
    } catch {
      if (pending === next) {
        pending = null;
        requested = displayed.dataset.scene;
      }
      next.remove();
      return;
    }
    if (pending !== next) return;
    const previous = displayed;
    displayed = next;
    pending = null;
    next.style.opacity = '1';
    previous.setAttribute('aria-hidden', 'true');
    next.removeAttribute('aria-hidden');
    gallery.querySelectorAll('button').forEach(item => {
      item.setAttribute('aria-pressed', String(item === button));
    });
    if (!reducedMotion.matches && next.animate) {
      const reveal = next.animate([{opacity: 0}, {opacity: 1}], {duration: 400, easing: 'ease-out'});
      await reveal.finished.catch(() => {});
    }
    previous.remove();
  }
  displayed.dataset.scene = 'room';
  gallery.hidden = false;
  gallery.addEventListener('click', event => {
    const button = event.target.closest('button[data-scene]');
    if (button) selectShot(button);
  });
})();
