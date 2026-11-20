import Lenis from 'lenis';
import {paintSurface} from './paper-light.js';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const fine = window.matchMedia('(hover:hover) and (pointer:fine)');
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  const scroll = new Lenis({smoothWheel:true, lerp:.15, syncTouch:false,
    anchors:{offset:-12},stopInertiaOnNavigate:true, autoRaf:false});
  const tick = seconds => scroll.raf(seconds * 1000);
  scroll.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(tick);
  const cover = document.querySelector('.cover-story');
  if (cover) {
    gsap.timeline({defaults:{ease:'power3.out'}})
      .fromTo('.cover-print',{scale:1.065},{scale:1,duration:1.12,clearProps:'transform'})
      .fromTo('.story-type h1',{yPercent:20,clipPath:'inset(0 0 18% 0)'},{yPercent:0,clipPath:'inset(0 0 0% 0)',duration:.72,clearProps:'transform,clipPath'},.07)
      .fromTo('.cover-entry',{x:-18},{x:0,duration:.55,clearProps:'transform'},.21);
  }
  const studio = document.querySelector('.salon-space');
  if (studio) {
    gsap.timeline({scrollTrigger:{trigger:studio,start:'top 96%',end:'center 52%',scrub:.35}})
      .fromTo(studio.querySelector('.studio-mat'),{clipPath:'inset(8% 12% 8% 0)'},{clipPath:'inset(0% 0% 0% 0)',ease:'none'})
      .fromTo(studio.querySelector('h2'),{y:32},{y:0,ease:'none'},0);
  }
  const watchMenu = new MutationObserver(() => {
    if (document.body.classList.contains('nav-open')) scroll.stop(); else scroll.start();
  });
  watchMenu.observe(document.body,{attributes:true,attributeFilter:['class']});
  return () => {watchMenu.disconnect();gsap.ticker.remove(tick);scroll.destroy();};
});

let galleryTween;
document.addEventListener('muse:look-change', event => {
  if (reduced.matches) return;
  const {image,previous,caption,direction} = event.detail;
  event.preventDefault();
  galleryTween?.kill();
  galleryTween = gsap.timeline({defaults:{ease:'power3.out'},
    onComplete:() => {previous.remove();gsap.set([image,caption],{clearProps:'transform,clipPath,opacity'});}});
  galleryTween.fromTo(image,{clipPath:direction<0?'inset(0 0 0 100%)':'inset(0 100% 0 0)',scale:1.045},
    {clipPath:'inset(0 0% 0 0%)',scale:1,duration:.44})
    .fromTo(caption,{y:11,opacity:.6},{y:0,opacity:1,duration:.27},.06);
});

let webgl;
function supportsWebGL() {
  if (webgl !== undefined) return webgl;
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
    webgl = Boolean(context);
    context?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {webgl = false;}
  return webgl;
}

const surface = document.querySelector('[data-light]');
let stopLight, mountedFancy, revision = 0, nearby = false;
async function syncEffects() {
  const id = ++revision;
  const animate = !reduced.matches;
  if (!animate || !fine.matches) { mountedFancy?.(); mountedFancy = null; }
  if (!animate || !nearby || document.hidden) { stopLight?.(); stopLight = null; }
  if (animate && fine.matches && !mountedFancy && document.body.classList.contains('home-page')) {
    const mod = await import('./fancy.tsx');
    if (id !== revision) return;
    mountedFancy = mod.mountFancy();
  }
  if (animate && nearby && surface && !document.hidden && !stopLight) {
    try {
      if (supportsWebGL()) {
        const mod = await import('./lighting.js');
        if (id !== revision) return;
        stopLight = mod.lightSurface(surface);
      }
    } catch { webgl = false; }
    if (id === revision && !stopLight) stopLight = paintSurface(surface);
  }
}
if (surface) {
  const observer = new IntersectionObserver(([entry]) => {nearby=entry.isIntersecting;syncEffects();},{rootMargin:'100px'});
  observer.observe(surface);
}
reduced.addEventListener('change',syncEffects);
fine.addEventListener('change',syncEffects);
document.addEventListener('visibilitychange',syncEffects);
syncEffects();
