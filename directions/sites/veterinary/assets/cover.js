(() => {
  const cover = document.querySelector('.an-cover');
  if (!cover) return;
  const screen = cover.querySelector('.cover-screen');
  const header = document.querySelector('.an-head');
  const scenes = [...cover.querySelectorAll('.cover-scene')];
  const links = [...cover.querySelectorAll('.scene-link')];
  const counter = cover.querySelector('[data-frame-count]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const enoughHeight = matchMedia('(min-height: 475px)');
  const end = scenes.length - .77;
  const limit = value => Math.max(0,Math.min(1,value));
  let active = -1, pinned = false, queued = 0, previous = -1;

  function choose(index) {
    if (active === index) return;
    const focusMoves = active >= 0 && scenes[active].contains(document.activeElement);
    scenes.forEach((scene,i) => {
      const current = i === index;
      scene.classList.toggle('is-current', current);
      scene.inert = !current;
      if (current) { scene.removeAttribute('aria-hidden'); links[i].setAttribute('aria-current','step'); }
      else { scene.setAttribute('aria-hidden','true'); links[i].removeAttribute('aria-current'); }
    });
    active = index;
    counter.textContent = String(index + 1);
    if (focusMoves) links[index].focus({preventScroll:true});
  }
  function render() {
    queued = 0;
    const box = cover.getBoundingClientRect();
    header.classList.toggle('on-cover', box.top <= 1 && box.bottom > header.offsetHeight);
    if (!pinned) return;
    const distance = box.height - screen.offsetHeight;
    const progress = distance <= 0 ? 0 : limit(-box.top / distance) * end;
    if (Math.abs(previous-progress)<.0001) return;
    previous=progress;
    let index=0;
    scenes.forEach((scene,i) => {
      const t = i===0 ? 1 : limit((progress-i+.69)/.65);
      const mix=t*t*(3-2*t);
      const drift=limit((progress-i+.45)/1.5);
      const zoom=i===1 ? 1.065-.065*drift : 1+.075*drift;
      scene.style.setProperty('--mix',mix.toFixed(3));
      scene.style.setProperty('--zoom',zoom.toFixed(4));
      if (mix>=.5) index=i;
    });
    choose(index);
    links.forEach((link,i) => {
      const fill=i<index ? 1 : i===index ? .3+.7*limit(progress-i+.36) : 0;
      link.style.setProperty('--fill',fill.toFixed(3));
    });
  }
  function schedule() {if (!queued) queued=requestAnimationFrame(render);}
  function go(index,behavior) {
    const box=cover.getBoundingClientRect();
    window.scrollTo({top:window.scrollY+box.top+(box.height-screen.offsetHeight)*index/end,behavior});
  }
  function fragment() {
    const index=scenes.findIndex(scene=>'#'+scene.id===location.hash);
    if (pinned && index>=0) go(index,'instant');
  }
  function configure() {
    const enabled=!reduce.matches && enoughHeight.matches && CSS.supports('position','sticky') && 'inert' in HTMLElement.prototype;
    if (enabled!==pinned) {
      previous=-1;active=-1;pinned=enabled;
      cover.classList.remove('is-ready');
      cover.classList.toggle('enhanced',pinned);
      if (pinned) requestAnimationFrame(()=>requestAnimationFrame(()=>cover.classList.toggle('is-ready',pinned)));
      else {
        scenes.forEach(scene=>{scene.inert=false;scene.removeAttribute('aria-hidden');scene.classList.remove('is-current');});
        links.forEach(link=>link.removeAttribute('aria-current'));
      }
    }
    render();
  }
  links.forEach((link,i)=>link.addEventListener('click',event=>{
    if(!pinned || event.button!==0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();go(i,'smooth');
  }));
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  window.addEventListener('pageshow',schedule);
  window.addEventListener('hashchange',fragment);
  reduce.addEventListener('change',configure);enoughHeight.addEventListener('change',configure);
  configure();
  if (location.hash) requestAnimationFrame(fragment);
})();
