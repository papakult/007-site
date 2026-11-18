(()=>{'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const menuToggle=$('#services-toggle'),menu=$('#services-menu'),mobileToggle=$('#mobile-toggle'),mobile=$('#mobile-menu');
function closeMenus(){menu.hidden=true;mobile.hidden=true;menuToggle.setAttribute('aria-expanded','false');mobileToggle.setAttribute('aria-expanded','false');mobileToggle.setAttribute('aria-label','Открыть меню')}
menuToggle.addEventListener('click',()=>{const open=menu.hidden;closeMenus();menu.hidden=!open;menuToggle.setAttribute('aria-expanded',String(open))});
mobileToggle.addEventListener('click',()=>{const open=mobile.hidden;closeMenus();mobile.hidden=!open;mobileToggle.setAttribute('aria-expanded',String(open));mobileToggle.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню')});
$('[data-close-menu]').addEventListener('click',()=>{closeMenus();menuToggle.focus()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const wasMobile=!mobile.hidden;closeMenus();(wasMobile?mobileToggle:menuToggle).focus()}});
document.addEventListener('click',e=>{if(!e.target.closest('.site-header,.mega,.mobile-menu'))closeMenus()});
const motion=$('.motion-toggle');function setMotion(paused){document.body.classList.toggle('motion-paused',paused);motion.setAttribute('aria-pressed',String(paused));motion.setAttribute('aria-label',paused?'Включить анимацию':'Приостановить анимацию');motion.title=motion.getAttribute('aria-label');motion.textContent=paused?'▷':'Ⅱ';}
if (motion) {
  setMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  motion.addEventListener('click', () => setMotion(!document.body.classList.contains('motion-paused')));
}
const detailTexts=['Снимки по показаниям, цифровые модели и осмотр помогают увидеть клиническую картину до начала лечения.','Врач согласует форму, функцию и последовательность этапов. Вы понимаете, что, когда и зачем предстоит сделать.','После лечения важно оценить состояние зубов, удобство реставраций и составить программу поддерживающего ухода.'];
const tabs=$$('[data-detail]');tabs.forEach((b,i)=>{b.addEventListener('click',()=>{tabs.forEach(x=>x.setAttribute('aria-selected',String(x===b)));$('#precision-text').textContent=detailTexts[i]});b.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const next=tabs[(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length];next.focus();next.click()}})});
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('reveal-in');observer.unobserve(e.target)}}),{threshold:.12});$$('.section-heading,.feature-card,.doctor-card,.visit-steps article,.process-grid article').forEach(e=>observer.observe(e));
if($('#service-search'))$('#service-search').addEventListener('input',e=>{const q=e.target.value.trim().toLocaleLowerCase('ru');let count=0;$$('.catalog-card').forEach(c=>{c.hidden=!c.dataset.search.includes(q);if(!c.hidden)count++});$('#no-services').hidden=count>0});
if($('#price-search'))$('#price-search').addEventListener('input',e=>{const q=e.target.value.trim().toLocaleLowerCase('ru');let count=0;$$('.price-row').forEach(c=>{c.hidden=!c.dataset.search.includes(q);if(!c.hidden)count++});$$('.price-group').forEach(g=>{g.hidden=![...g.querySelectorAll('.price-row')].some(r=>!r.hidden);if(q)g.open=true});$('#no-prices').hidden=count>0});
$$('[data-doctor-filter]').forEach(b=>b.addEventListener('click',()=>{$$('[data-doctor-filter]').forEach(x=>x.classList.toggle('active',x===b));$$('.doctor-card').forEach(c=>c.hidden=b.dataset.doctorFilter!=='all'&&!c.dataset.area.split(' ').includes(b.dataset.doctorFilter))}));
})();
