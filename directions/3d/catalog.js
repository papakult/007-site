import { catalog } from './catalog-models.js';

const shelf = document.querySelector('#model-shelf');
const filters = document.querySelector('#model-filters');
const count = document.querySelector('#model-count');
const dialog = document.querySelector('#model-dialog');
const title = dialog.querySelector('#model-title');
const description = dialog.querySelector('#model-description');
const image = dialog.querySelector('#model-fallback');
const canvas = dialog.querySelector('#model-canvas');
const extras = dialog.querySelector('#model-extras');
const notice = dialog.querySelector('#model-notice');
const spin = dialog.querySelector('[data-model-spin]');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const categories = {
  all: 'Все модели', industry: 'Промышленность', architecture: 'Архитектура',
  products: 'Предметы', tech: 'Техника',
};
const poster = id => `./posters/${id}.webp`;
const byId = new Map(catalog.map(item => [item.id,item]));
const modelHash = id => '#model-' + id;
let selected = null;
let lastTrigger = null;
let stage = null;
let stagePromise = null;
let transition = 0;

function element(tag,text,css) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (css) node.className = css;
  return node;
}

function button(label,handler,css) {
  const node = element('button',label,css);
  node.type = 'button';
  node.addEventListener('click',handler);
  return node;
}

function drawShelf(category) {
  const items = catalog.filter(item => category === 'all' || item.category === category);
  count.textContent = `${items.length} из ${catalog.length}`;
  shelf.replaceChildren(...items.map(item => {
    const article = element('article',null,'model-card');
    const link = element('a',null,'model-card-link');
    link.href = modelHash(item.id);
    link.addEventListener('click',event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      lastTrigger = link;
      history.pushState(null,'',link.href);
      openModel(item);
    });
    const preview = element('div',null,'model-preview');
    preview.dataset.group = item.category;
    const picture = element('img');
    picture.src = poster(item.id);
    picture.alt = '';
    picture.width = 560;
    picture.height = 350;
    picture.loading = catalog.indexOf(item) < 4 ? 'eager' : 'lazy';
    picture.decoding = 'async';
    preview.append(picture,element('span',String(catalog.indexOf(item)+1).padStart(2,'0'),'model-index'));
    const content = element('div',null,'model-card-copy');
    content.append(element('small',categories[item.category]),element('h3',item.title),
      element('p',item.description),element('span','Открыть 3D','model-open'));
    link.append(preview,content);
    article.append(link);
    return article;
  }));
}

function setFilter(category) {
  for (const chip of filters.querySelectorAll('button'))
    chip.setAttribute('aria-pressed',String(chip.dataset.filter === category));
  drawShelf(category);
}

for (const [key,label] of Object.entries(categories)) {
  const chip = button(label,()=>setFilter(key),'filter-chip');
  chip.dataset.filter = key;
  filters.append(chip);
}
setFilter('all');

function slider(label,initial,update) {
  const row = element('label',null,'model-range');
  const labelText = element('span',label);
  const input = element('input');
  input.type = 'range';
  input.min = '0';
  input.max = '100';
  input.value = String(initial);
  const output = element('output',initial+'%');
  input.addEventListener('input',()=>{
    output.value = input.value+'%';
    update(input.valueAsNumber);
    stage.schedule();
  });
  row.append(labelText,output,input);
  return row;
}

function toggle(label,enabledLabel,update) {
  let active = false;
  const control = button(label,()=>{
    active = !active;
    control.textContent = active ? enabledLabel : label;
    control.setAttribute('aria-pressed',String(active));
    update(active);
    stage.schedule();
  });
  control.setAttribute('aria-pressed','false');
  return control;
}

function extraControls(model) {
  const controls = [];
  if (model.sections.some(section=>section.offset.lengthSq()>0)) {
    controls.push(slider('Разборка',0,value=>{
      for (const section of model.sections)
        section.group.position.copy(section.origin).addScaledVector(section.offset,value/100);
    }));
  }
  if (model.adjust) {
    const {label,initial,apply} = model.adjust;
    apply(initial);
    controls.push(slider(label,initial,apply));
  }
  if (model.shell) controls.push(toggle(model.shell.label,'Вернуть оболочку',visible=>{
    model.shell.group.visible = !visible;
  }));
  if (model.motion) controls.push(toggle('Запустить механизм','Остановить механизм',value=>stage.animate(value)));
  if (model.finish) {
    const colors = [model.finish.color.getHex(),0xb47050,0x4d6587,0x647b65,0x2b333d];
    let index = 0;
    controls.push(button('Сменить отделку',()=>{
      index = (index+1)%colors.length;
      model.finish.color.setHex(colors[index]);
      stage.schedule();
    }));
  }
  extras.replaceChildren(...controls);
}

function stopSpin() {
  if (stage) stage.controls.autoRotate = false;
  spin.setAttribute('aria-pressed','false');
  spin.textContent = 'Автовращение';
}
function enableViewer() {
  if (!stagePromise) stagePromise = import('./catalog-view.js').then(({createStage})=>{
    stage = createStage(canvas);
    stage.controls.addEventListener('start',stopSpin);
    return stage;
  });
  return stagePromise;
}

async function openModel(item) {
  const version = ++transition;
  selected = item;
  title.textContent = item.title;
  description.textContent = item.description;
  image.src = poster(item.id);
  image.alt = `Эскиз модели ${item.title}`;
  image.hidden = false;
  canvas.hidden = true;
  dialog.dataset.group = item.category;
  notice.textContent = 'Загрузка 3D';
  extras.replaceChildren();
  if (!dialog.open) dialog.showModal();
  stopSpin();
  for (const control of dialog.querySelectorAll('[data-needs-stage]')) control.disabled = true;
  try {
    await enableViewer();
    if (version !== transition || !dialog.open) return;
    const model = item.create();
    canvas.hidden = false;
    stage.show(model);
    image.hidden = true;
    notice.textContent = 'Поворот перетаскиванием. Масштаб двумя пальцами или кнопками';
    extraControls(model);
    for (const control of dialog.querySelectorAll('[data-needs-stage]')) control.disabled = false;
  } catch (error) {
    if (version !== transition) return;
    canvas.hidden = true;
    notice.textContent = '3D недоступно в этом браузере. Доступен кадр модели';
    console.warn('Model viewer:',error);
  }
}

function followHash() {
  const hash = location.hash;
  const item = hash.startsWith('#model-') ? byId.get(hash.slice(7)) : null;
  if (item && (selected !== item || !dialog.open)) openModel(item);
  else if (!item && dialog.open) dialog.close();
}
window.addEventListener('hashchange',followHash);
window.addEventListener('popstate',followHash);

dialog.querySelector('[data-model-close]').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{
  transition++;
  stage?.clear();
  if (location.hash.startsWith('#model-')) history.replaceState(null,'',location.pathname+location.search);
  selected = null;
  lastTrigger?.focus();
  lastTrigger = null;
});
dialog.querySelector('[data-model-reset]').addEventListener('click',()=>{
  stopSpin();
  stage.reset();
});
for (const [selector,factor] of [['[data-model-plus]',.82],['[data-model-minus]',1.22]])
  dialog.querySelector(selector).addEventListener('click',()=>stage.zoom(factor));
spin.addEventListener('click',()=>{
  if (stage.controls.autoRotate) stopSpin();
  else {
    stage.controls.autoRotate = true;
    spin.setAttribute('aria-pressed','true');
    spin.textContent = 'Пауза';
    stage.schedule();
  }
});
motion.addEventListener('change',event=>{if(event.matches)stopSpin();});
canvas.addEventListener('keydown',event=>{
  if (!stage || !['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-'].includes(event.key)) return;
  event.preventDefault();
  if (event.key === '+' || event.key === '-') {
    stage.zoom(event.key === '+' ? .82 : 1.22);
    return;
  }
  stopSpin();
  const {camera,controls} = stage;
  const direction = camera.position.clone().sub(controls.target);
  const horizontal = event.key === 'ArrowLeft' || event.key === 'ArrowRight';
  const axis = horizontal ? camera.up : camera.up.clone().cross(direction).normalize();
  direction.applyAxisAngle(axis,event.key === 'ArrowLeft'||event.key === 'ArrowUp' ? .13 : -.13);
  camera.position.copy(controls.target).add(direction);
  controls.update(0);
  stage.schedule();
});
dialog.querySelector('[data-model-share]').addEventListener('click',async event=>{
  const control = event.currentTarget;
  const link = new URL(modelHash(selected.id),location.href);
  try {
    await navigator.clipboard.writeText(link.href);
    control.textContent = 'Ссылка скопирована';
    setTimeout(()=>{control.textContent='Скопировать ссылку';},1900);
  } catch {
    notice.textContent = 'Ссылку на модель можно скопировать из адресной строки';
  }
});
for (const [selector,delta] of [['[data-model-prev]',-1],['[data-model-next]',1]]) {
  dialog.querySelector(selector).addEventListener('click',()=>{
    const next = catalog[(catalog.indexOf(selected)+delta+catalog.length)%catalog.length];
    history.replaceState(null,'',modelHash(next.id));
    openModel(next);
  });
}
followHash();
