(() => {
  const cover = document.querySelector('.coffee-film');
  if (!cover) return;
  const stage = cover.querySelector('.film-stage');
  const frames = Array.from(cover.querySelectorAll('.film-frame'));
  const links = Array.from(cover.querySelectorAll('.film-chapter'));
  const mast = document.querySelector('.site-mast');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const usableHeight = matchMedia('(min-height: 470px)');
  const last = frames.length - 1;
  const end = last + .28;
  const clamp = x => Math.max(0, Math.min(1, x));
  const smooth = x => { const t = clamp(x); return t * t * (3 - 2 * t); };
  let active = -1;
  let pin = false;
  let frameRequest = 0;
  let lastPosition = -1;

  function select(index) {
    if (active === index) return;
    const previous = frames[active];
    const moveFocus = previous && previous.contains(document.activeElement);
    frames.forEach((frame, i) => {
      frame.classList.toggle('current', i === index);
      frame.inert = i !== index;
      if (i === index) {
        frame.removeAttribute('aria-hidden');
        links[i].setAttribute('aria-current', 'step');
      } else {
        frame.setAttribute('aria-hidden', 'true');
        links[i].removeAttribute('aria-current');
      }
    });
    active = index;
    if (moveFocus) links[index].focus({preventScroll:true});
  }

  function render() {
    frameRequest = 0;
    const bounds = cover.getBoundingClientRect();
    mast.classList.toggle('over-film', bounds.top <= 1 && bounds.bottom > mast.offsetHeight);
    if (!pin) return;
    const travel = bounds.height - stage.offsetHeight;
    const position = travel > 0 ? clamp(-bounds.top / travel) * end : 0;
    if (Math.abs(position - lastPosition) < .0001) return;
    lastPosition = position;
    let current = 0;
    frames.forEach((frame, i) => {
      const mix = i === 0 ? 1 : smooth((position - i + .72) / .62);
      const advance = clamp((position - i + .55) / 1.55);
      // Match the direction of the cut to the subject in each photograph.
      const scale = [1 + .12 * advance, 1.09 - .09 * advance, 1 + .09 * advance, 1.05 - .05 * advance][i];
      frame.style.setProperty('--mix', mix.toFixed(4));
      frame.style.setProperty('--zoom', scale.toFixed(4));
      if (mix >= .5) current = i;
    });
    select(current);
    links.forEach((link,i) => {
      const progress = i < current ? 1 : (i === current ? .27 + .73 * clamp((position - i + .4) / .97) : 0);
      link.style.setProperty('--fill', progress.toFixed(3));
    });
  }
  function queueRender() {
    if (!frameRequest) frameRequest = requestAnimationFrame(render);
  }
  function moveTo(index, behavior) {
    if (!pin) return;
    const box = cover.getBoundingClientRect();
    const travel = box.height - stage.offsetHeight;
    const offset = index === 0 ? 0 : (index + .015) / end;
    window.scrollTo({top:window.scrollY + box.top + travel * offset, behavior});
  }
  function openFragment() {
    const target = frames.findIndex(frame => '#' + frame.id === location.hash);
    if (target !== -1 && pin) moveTo(target, 'instant');
  }
  function configure() {
    const next = !reduced.matches && usableHeight.matches && CSS.supports('position','sticky') && 'inert' in HTMLElement.prototype;
    if (next !== pin) {
      pin = next;
      active = -1;
      lastPosition = -1;
      cover.classList.remove('motion-ready');
      cover.classList.toggle('is-pinned', pin);
      if (pin) requestAnimationFrame(() => requestAnimationFrame(() => cover.classList.toggle('motion-ready', pin)));
      if (!pin) {
        frames.forEach(frame => {
          frame.inert = false;
          frame.removeAttribute('aria-hidden');
          frame.classList.remove('current');
        });
        links.forEach(link => link.removeAttribute('aria-current'));
      }
    }
    render();
  }

  links.forEach((link, index) => link.addEventListener('click', event => {
    if (!pin || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    moveTo(index, 'smooth');
  }));
  window.addEventListener('scroll', queueRender, {passive:true});
  window.addEventListener('resize', queueRender, {passive:true});
  window.addEventListener('pageshow', queueRender);
  window.addEventListener('hashchange', openFragment);
  reduced.addEventListener('change', configure);
  usableHeight.addEventListener('change', configure);
  configure();
  if (location.hash) requestAnimationFrame(openFragment);
})();
