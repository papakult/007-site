import { catalog as models } from './catalog-models.js?v=watch-first';

const shelf = document.querySelector('#model-shelf');
const filters = document.querySelector('#model-filters');
const count = document.querySelector('#model-count');
const dialog = document.querySelector('#model-dialog');
const film = document.querySelector('#watch-film');
const filmVideo = film.querySelector('video');
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
  products: 'Предметы', tech: 'Техника', electrical: 'Электротехника',
};
const poster = id => `./posters/${id}.webp${id==='watch'?'?v=2':''}`;
const flashlight = {
  id: 'flashlight', title: 'Фонарь на батарейках', category: 'electrical',
  description: 'Разборка корпуса, плата драйвера и четыре провода',
  create: () => import('./flashlight.js').then(({createFlashlight})=>createFlashlight()),
};
const firstIds = ['tolmachevo', 'staircase'];
const catalog = [
  flashlight, ...firstIds.map(id=>models.find(item=>item.id===id)),
  ...models.filter(item=>!firstIds.includes(item.id)),
];
const electricalIds = new Set(['flashlight', 'motor', 'lamp', 'charger', 'headphones']);
const byId = new Map(catalog.map(item=>[item.id,item]));
const films = {
  watch: {title:'Часы 007. Макроразборка', url:'/assets/watch-007-macro.mp4'},
  flashlight: {title:'Фонарь на батарейках. Разборка', url:'./flashlight/razborka.mp4'},
};
const modelHash = id => '#model-' + id;
let selected = null;
let lastTrigger = null;
let stage = null;
let stagePromise = null;
let transition = 0;
let controlsLifetime = null;

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

function alternateLinkAction(event) {
  return event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey;
}

function bindModelLink(link,item) {
  link.addEventListener('click',event => {
    if (alternateLinkAction(event)) return;
    event.preventDefault();
    lastTrigger = link;
    history.pushState(null,'',link.href);
    openModel(item);
  });
}

function filmLink(details) {
  const link = element('a','Смотреть видео','model-open');
  link.href = details.url;
  link.addEventListener('click',event=>{
    if (typeof film.showModal !== 'function' || alternateLinkAction(event)) return;
    event.preventDefault();
    film.querySelector('h2').textContent = details.title;
    if (filmVideo.src !== link.href) filmVideo.src = link.href;
    film.showModal();
    filmVideo.play().catch(()=>{});
  });
  return link;
}

film.querySelector('button').addEventListener('click', () => film.close());
film.addEventListener('close', () => filmVideo.pause());

function drawShelf(category) {
  const items = catalog.filter(item =>
    category === 'all' || item.category === category ||
    (category === 'electrical' && electricalIds.has(item.id)));
  count.textContent = `${items.length} из ${catalog.length}`;
  shelf.replaceChildren(...items.map(item => {
    const article = element('article',null,'model-card');
    const link = element('a',null,'model-card-link');
    link.href = modelHash(item.id);
    bindModelLink(link,item);
    const preview = element('div',null,'model-preview');
    preview.dataset.group = item.category;
    const picture = element('img');
    picture.src = poster(item.id);
    picture.alt = '';
    picture.width = 560;
    picture.height = 350;
    const index = catalog.indexOf(item);
    picture.loading = index < 4 ? 'eager' : 'lazy';
    picture.decoding = 'async';
    preview.append(picture,element('span',String(index+1).padStart(2,'0'),'model-index'));
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

function slider(label,initial,update,{min=0,max=100,unit='%'} = {}) {
  const row = element('label',null,'model-range');
  const labelText = element('span',label);
  const input = element('input');
  input.type = 'range';
  input.setAttribute('aria-label',label);
  input.min = String(min);
  input.max = String(max);
  input.value = String(initial);
  const output = element('output',initial+unit);
  input.setAttribute('aria-valuetext',output.value);
  input.addEventListener('input',()=>{
    output.value = input.value+unit;
    input.setAttribute('aria-valuetext',output.value);
    update(input.valueAsNumber);
    stage.schedule();
  });
  row.append(labelText,output,input);
  row.setValue = value => {
    input.value = String(value);
    input.dispatchEvent(new Event('input'));
  };
  return row;
}

function toggle(label,enabledLabel,update) {
  let active = false;
  function set(value) {
    active = value;
    control.textContent = active ? enabledLabel : label;
    control.setAttribute('aria-pressed',String(active));
    update(active);
    stage.schedule();
  }
  const control = button(label,()=>set(!active));
  control.reset = () => set(false);
  control.hide = () => set(true);
  control.setAttribute('aria-pressed','false');
  return control;
}

const shapeLabels = {
  BoxGeometry:'Панель или профиль', CylinderGeometry:'Цилиндрическая деталь',
  TorusGeometry:'Кольцо', SphereGeometry:'Сферическая деталь', ExtrudeGeometry:'Фасонная деталь',
};

function partInspector(model) {
  const inspector = element('details',null,'model-inspector');
  const summary = element('summary','Рассмотреть отдельную деталь');
  const row = element('div',null,'model-part-fields');
  const layers = model.sections.map(({group})=>group);
  const groups = layers.map(group=>{
    const meshes = [];
    group.traverse(item=>{if (item.isMesh) meshes.push(item);});
    return {group,meshes};
  }).filter(({meshes})=>meshes.length);
  const staticParts = [];
  for (const item of model.root.children) {
    if (!layers.includes(item)) item.traverse(part=>{if (part.isMesh) staticParts.push(part);});
  }
  if (staticParts.length) groups.push({group:model.root,meshes:staticParts});
  const groupSelect = element('select');
  const partSelect = element('select');
  groupSelect.setAttribute('aria-label','Группа деталей');
  partSelect.setAttribute('aria-label','Элемент');
  const groupLabel = element('label','Группа деталей');
  const partLabel = element('label','Элемент');
  groupSelect.append(...groups.map(({group,meshes},index)=>
    new Option(`${group.name || (group===model.root?'Основание':'Группа '+(index+1))} · ${meshes.length}`,String(index))));
  groupLabel.append(groupSelect);
  partLabel.append(partSelect);

  const selectedPart = () => groups[groupSelect.selectedIndex].meshes[partSelect.selectedIndex];
  const resetParts = () => {
    const {meshes} = groups[groupSelect.selectedIndex];
    partSelect.replaceChildren(...meshes.map((item,index)=>
      new Option(`${index+1} · ${item.name || shapeLabels[item.geometry.type] || 'Деталь сборки'}`,String(index))));
  };
  let hidden = [];
  function restore() {
    for (const item of hidden) item.visible = true;
    hidden = [];
  }
  function focusPart() {
    stopSpin();
    const {group} = groups[groupSelect.selectedIndex];
    if (!group.visible) {
      group.visible = true;
      model.visibilityControls?.get(group)?.reset();
    }
    stage.focusPart(selectedPart());
  }
  function inspectAlone() {
    restore();
    const item = selectedPart();
    model.root.traverse(other=>{
      if (other.isMesh && other !== item && other.visible) {
        other.visible = false;
        hidden.push(other);
      }
    });
    focusPart();
  }
  const isolate = toggle('Показать только деталь','Вернуть сборку',value=>{
    if (value) inspectAlone();
    else { restore(); stage.reset(); }
  });
  function updateFocus() {
    if (isolate.getAttribute('aria-pressed') === 'true') inspectAlone();
    else focusPart();
  }
  groupSelect.addEventListener('change',()=>{resetParts(); updateFocus();});
  partSelect.addEventListener('change',updateFocus);
  resetParts();
  row.append(groupLabel,partLabel,button('Приблизить деталь',updateFocus),isolate);
  inspector.append(summary,row);
  inspector.restore = ()=>{ if (hidden.length) isolate.reset(); };
  return inspector;
}

function extraControls(model,item) {
  const controls = [];
  let explode;
  if (model.sections.some(section=>section.offset.lengthSq()>0)) {
    explode = slider('Разборка',0,value=>{
      for (const {group,origin,offset,start=0} of model.sections) {
        const progress = Math.max(0,(value/100-start)/(1-start));
        group.position.copy(origin).addScaledVector(offset,progress);
      }
      model.onExplode?.(value);
    });
    controls.push(explode);
  }
  const adjustments = [model.adjust, ...(model.adjustments || [])].filter(Boolean);
  const adjustmentRows = [];
  for (const {label,initial,apply,...options} of adjustments) {
    apply(initial);
    const row = slider(label,initial,apply,options);
    adjustmentRows.push({row,initial});
    controls.push(row);
  }
  model.visibilityControls = new Map();
  function visibility(groups,label,restore) {
    const control = toggle(label,restore,hidden=>{
      for (const group of groups) group.visible = !hidden;
    });
    for (const group of groups) model.visibilityControls.set(group,control);
    controls.push(control);
  }
  if (model.shell) visibility([model.shell.group],model.shell.label,model.shell.restoreLabel || 'Вернуть оболочку');
  for (const {groups,label,restoreLabel} of model.shells || []) visibility(groups,label,restoreLabel);
  if (model.fasteners) visibility(model.fasteners,'Скрыть крепёж','Показать крепёж');
  for (const view of model.views || []) {
    controls.push(button(view.label,()=>{
      stopSpin();
      model.visibilityControls.get(view.group)?.reset();
      const covers = new Set(view.reveal?.map(group=>model.visibilityControls.get(group)));
      for (const control of covers) control?.hide();
      const target = view.target.clone();
      if (view.group) view.group.localToWorld(target);
      stage.focus(target,view.distance,view.eye);
    }));
  }
  if (model.motion) controls.push(toggle(model.motionLabel || 'Запустить механизм','Остановить механизм',value=>stage.animate(value)));
  if (model.finish) {
    const colors = [model.finish.color.getHex(),0xb47050,0x4d6587,0x647b65,0x2b333d];
    let index = 0;
    controls.push(button('Сменить отделку',()=>{
      index = (index+1)%colors.length;
      model.finish.color.setHex(colors[index]);
      stage.schedule();
    }));
  }
  const inspector = (model.views || model.presets) ? partInspector(model) : null;
  if (model.presets) {
    const panel = element('div',null,'model-presets');
    const row = element('div',null,'model-actions');
    panel.append(element('p','Узлы часов'),row);
    row.append(...model.presets.map(preset=>button(preset.label,event=>{
      stopSpin();
      inspector.restore();
      for (const {group} of model.sections) group.visible = !preset.groups || preset.groups.includes(group);
      explode.setValue(preset.amount);
      if (!preset.groups && preset.amount===0) {
        for (const {row,initial} of adjustmentRows) row.setValue(initial);
      }
      for (const button of row.children) button.setAttribute('aria-pressed',String(button===event.currentTarget));
      stage.frameVisible(preset.eye);
    })));
    for (const [index,control] of [...row.children].entries())
      control.setAttribute('aria-pressed',String(index===0));
    controls.unshift(panel);
  }
  if (inspector) controls.push(inspector);
  if (model.createControls) {
    const custom = model.createControls({
      stage, canvas, explode, element, button, toggle, stopSpin, signal:controlsLifetime.signal,
    });
    controls.unshift(...custom);
  }
  if (films[item.id]) controls.push(filmLink(films[item.id]));
  extras.replaceChildren(...controls);
}

function stopSpin() {
  if (stage) stage.controls.autoRotate = false;
  spin.setAttribute('aria-pressed','false');
  spin.textContent = 'Автовращение';
}
function enableViewer() {
  if (!stagePromise) stagePromise = import('./catalog-view.js?v=calibre007v2').then(({createStage})=>{
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
  controlsLifetime?.abort();
  controlsLifetime = new AbortController();
  extras.replaceChildren();
  if (!dialog.open) dialog.showModal();
  stopSpin();
  stage?.clear();
  for (const control of dialog.querySelectorAll('[data-needs-stage]')) control.disabled = true;
  try {
    await enableViewer();
    if (version !== transition || !dialog.open) return;
    const model = await item.create();
    if (version !== transition || !dialog.open) {
      stage.dispose(model.root);
      return;
    }
    canvas.hidden = false;
    stage.show(model);
    canvas.dataset.model = item.id;
    image.hidden = true;
    notice.textContent = 'Поворот перетаскиванием. Масштаб двумя пальцами или кнопками';
    extraControls(model,item);
    stage.schedule();
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
  controlsLifetime?.abort();
  stage?.clear();
  if (location.hash.startsWith('#model-')) history.replaceState(null,'',location.pathname+location.search);
  selected = null;
  lastTrigger?.focus();
  lastTrigger = null;
});
dialog.querySelector('[data-model-reset]').addEventListener('click',()=>{
  stopSpin();
  if (selected?.id === 'watch' || selected?.id === 'flashlight') stage.frameVisible();
  else stage.reset();
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
