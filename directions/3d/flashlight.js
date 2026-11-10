import {Group, Vector3} from './engine.js';
import {Box3, Raycaster, Vector2} from './flashlight-geometry.js';
import {buildFlashlight} from './flashlight-model.js';

const visible={
  board:['pcb'],
  wiring:['pcb','led','harness','switch','spring','contact','cellA','cellB']
};
const boardParts=['u1','l1','d1','c1','c2','rs','traces'];
const wireParts=['cellA','cellB','switch','w1','w2','w3','w4','led'];
const productParts=['body','head','bezel','gasket','lens','reflector','led','pcb','contact','cellA','cellB','spring','switch','tail','harness'];
const info={
  body:['Алюминиевый корпус','Защищает батарейки и проводку. На концах видны резьба и посадочные пояски.'],
  head:['Корпус оптики','Удерживает отражатель, линзу и плату со светодиодом.'],
  bezel:['Прижимное кольцо','Фиксирует стекло и уплотнение перед отражателем.'],
  gasket:['Уплотнение','Кольцо между стеклом и корпусом оптики.'],
  lens:['Защитное стекло','Прозрачная вставка перед отражателем.'],
  reflector:['Отражатель','Зеркальная чашка собирает свет от светодиода.'],
  led:['LED · излучатель','Светодиод на алюминиевой плате. Янтарный провод идёт на анод, бирюзовый возвращает ток на цепь FB.'],
  pcb:['Плата драйвера','Круглая плата с TPS61040. Смотрите назначение элементов в режиме «Плата и схема».'],
  contact:['Плюсовой контакт','Снимает питание с плюса первой батарейки и передаёт его на VIN платы.'],
  cellA:['AA № 1','Плюс первой батарейки питает плату через красный провод W1. Две AA включены последовательно.'],
  cellB:['AA № 2','Минус второй батарейки соединён с пружиной и кнопкой питания.'],
  spring:['Пружинный контакт','Поджимает батарейки и соединяет минус батарей с кнопкой.'],
  switch:['S1 · кнопка питания','Замыкает обратный провод от минуса батарей до GND драйвера.'],
  tail:['Задняя крышка','Снимается для замены батареек. Снаружи защищает резиновый колпачок кнопки.'],
  harness:['Жгут проводов','Четыре цветных провода можно выбрать по отдельности в режиме «Проводка».'],
  u1:['U1 · TPS61040','Повышающий драйвер. VIN получает питание, SW управляет дросселем, FB следит за током, EN включает микросхему, GND общий.'],
  l1:['L1 · 10 мкГн','Дроссель накапливает энергию и отдаёт её через диод в выходную цепь.'],
  d1:['D1 · диод Шоттки','Пропускает ток от узла SW к выходу LED+. Полоса на корпусе отмечает катод.'],
  c1:['C1 · 4,7 мкФ','Входной конденсатор между VIN и GND сглаживает питание от батареек.'],
  c2:['C2 · 1 мкФ','Выходной конденсатор между LED+ и GND сглаживает пульсации.'],
  rs:['RS · 82 Ом','Резистор обратной связи соединяет LED− и GND. В учебной схеме ток LED составляет примерно 15 мА.'],
  traces:['Дорожки и площадки','Медные дорожки показаны для визуального изучения платы. Электрические соединения см. на схеме.'],
  w1:['W1 · красный','Плюс батарей → VIN. Питает драйвер.'],
  w2:['W2 · синий','Выход кнопки S1 → GND. Возвращает ток к минусу батарей.'],
  w3:['W3 · янтарный','Выход драйвера → анод LED.'],
  w4:['W4 · бирюзовый','Катод LED → узел FB и резистор тока RS.']
};

const diagram = `<div class="flashlight-scheme-scroll">
<svg class="flashlight-scheme" viewBox="0 0 620 386" role="group" aria-label="Схема фонаря с повышающим драйвером TPS61040">
<!-- Net labels and unselected paths -->
<path class="net" d="M49 48H182M268 48H327M371 48H480M290 48V115M160 48V199H200M160 142H200M260 245V338M113 338H585M456 48V98M456 114V338M520 48V106M520 156V222M520 277V338M353 194H440Q448 182 456 194H520M49 48V129M49 253V338H62M92 338H113M113 48V98M113 114V338"/>
<g class="schematic-part" data-id="cellA" tabindex="0" role="button" aria-label="Батарейка AA номер 1"><rect class="c-hit" x="24" y="117" width="54" height="64" rx="8"/><path class="symbol" d="M49 129V139M33 139H65M40 148H58M49 148V179"/><text class="mark" x="71" y="147">AA 1</text></g>
<g class="schematic-part" data-id="cellB" tabindex="0" role="button" aria-label="Батарейка AA номер 2"><rect class="c-hit" x="24" y="178" width="54" height="79" rx="8"/><path class="symbol" d="M49 179V210M33 210H65M40 219H58M49 219V253"/><text class="mark" x="71" y="216">AA 2</text></g>
<g class="schematic-part" data-id="switch" tabindex="0" role="button" aria-label="Кнопка питания S1"><rect class="c-hit" x="51" y="306" width="48" height="63" rx="8"/><path class="symbol" data-switch-contact d="M62 338L90 322"/><circle class="dot" cx="62" cy="338" r="3"/><circle class="dot" cx="92" cy="338" r="3"/><text class="mark" x="59" y="364">S1</text></g>
<g class="schematic-part" data-id="u1" tabindex="0" role="button" aria-label="Микросхема TPS61040 U1">
<rect class="chipbox" x="200" y="115" width="153" height="130" rx="10"/>
<text class="mark" x="221" y="176">U1 TPS61040</text><text class="mark-small" x="208" y="146">VIN</text><text class="mark-small" x="209" y="203">EN</text>
<text class="mark-small" x="281" y="135">SW</text><text class="mark-small" x="327" y="198">FB</text><text class="mark-small" x="250" y="232">GND</text>
</g>
<g class="schematic-part" data-id="l1" tabindex="0" role="button" aria-label="Дроссель L1"><rect class="c-hit" x="176" y="20" width="96" height="52" rx="8"/><path class="symbol" d="M182 48H190a9 9 0 0 1 18 0a9 9 0 0 1 18 0a9 9 0 0 1 18 0a9 9 0 0 1 18 0H268"/><text class="mark" x="190" y="28">L1 10 µH</text></g>
<g class="schematic-part" data-id="d1" tabindex="0" role="button" aria-label="Диод Шоттки D1"><rect class="c-hit" x="320" y="20" width="65" height="61" rx="8"/><path class="symbol" d="M327 48H335M363 48H371M360 37h3v22h-3"/><path class="symbol fill" d="M337 37V59L357 48Z"/><text class="mark" x="333" y="28">D1</text></g>
<g class="schematic-part" data-id="c1" tabindex="0" role="button" aria-label="Входной конденсатор C1"><rect class="c-hit" x="95" y="82" width="59" height="59" rx="8"/><path class="symbol" d="M113 98V103M99 103H127M99 109H127M113 109V114"/><text class="mark" x="131" y="104">C1</text><text class="mark-small" x="130" y="119">4.7 µF</text></g>
<g class="schematic-part" data-id="c2" tabindex="0" role="button" aria-label="Выходной конденсатор C2"><rect class="c-hit" x="405" y="85" width="69" height="55" rx="8"/><path class="symbol" d="M456 98V103M442 103H470M442 109H470M456 109V114"/><text class="mark" x="418" y="99">C2</text><text class="mark-small" x="408" y="119">1 µF</text></g>
<g class="schematic-part" data-id="led" tabindex="0" role="button" aria-label="Светодиод"><rect class="c-hit" x="496" y="96" width="100" height="68" rx="8"/><path class="symbol" d="M520 106V115M506 137H534M520 137V156M533 119L544 110M541 110H544V114M536 127L549 117M545 117H549V121"/><path class="symbol fill" d="M510 116H530L520 135Z"/><text class="mark" x="550" y="145">LED</text></g>
<g class="schematic-part" data-id="rs" tabindex="0" role="button" aria-label="Резистор тока RS"><rect class="c-hit" x="500" y="213" width="87" height="76" rx="8"/><path class="symbol" d="M520 222V230M520 269V277"/><rect class="symbol" x="512" y="230" width="16" height="39" rx="2"/><text class="mark" x="537" y="247">RS</text><text class="mark-small" x="537" y="264">82 Ω</text></g>
<g class="schematic-part" data-id="w1" tabindex="0" role="button" aria-label="Красный провод W1" style="--wire:#fc7569"><path class="net wire" d="M49 48H113"/><path class="wire-pick" d="M49 48H113"/><text class="mark" x="54" y="35">W1</text></g>
<g class="schematic-part" data-id="w2" tabindex="0" role="button" aria-label="Синий провод W2" style="--wire:#79a6f5"><path class="net wire" d="M92 338H135"/><path class="wire-pick" d="M92 338H135"/><text class="mark" x="102" y="363">W2</text></g>
<g class="schematic-part" data-id="w3" tabindex="0" role="button" aria-label="Янтарный провод W3" style="--wire:#f5ab56"><path class="net wire" d="M480 48H520V106"/><path class="wire-pick" d="M480 48H520V106"/><text class="mark" x="534" y="81">W3</text></g>
<g class="schematic-part" data-id="w4" tabindex="0" role="button" aria-label="Бирюзовый провод W4" style="--wire:#50d9d8"><path class="net wire" d="M520 156V194"/><path class="wire-pick" d="M520 156V194"/><text class="mark" x="533" y="179">W4</text></g>
<circle class="dot" cx="113" cy="48" r="3"/><circle class="dot" cx="160" cy="48" r="3"/><circle class="dot" cx="160" cy="142" r="3"/>
<circle class="dot" cx="290" cy="48" r="3"/><circle class="dot" cx="456" cy="48" r="3"/><circle class="dot" cx="520" cy="194" r="3"/>
<circle class="dot" cx="113" cy="338" r="3"/><circle class="dot" cx="260" cy="338" r="3"/><circle class="dot" cx="456" cy="338" r="3"/><circle class="dot" cx="520" cy="338" r="3"/>
<path class="symbol" d="M585 338v9m-12 0h24m-19 5h14m-10 5h6"/><text class="mark-small" x="553" y="377">GND</text>
</svg>
</div>
<div class="model-actions flashlight-wires" aria-label="Провода"><button type="button" data-pick="w1" aria-pressed="false" style="--wire:#fc7569"><i></i> W1 · питание</button><button type="button" data-pick="w2" aria-pressed="false" style="--wire:#79a6f5"><i></i> W2 · возврат</button><button type="button" data-pick="w3" aria-pressed="false" style="--wire:#f5ab56"><i></i> W3 · LED+</button><button type="button" data-pick="w4" aria-pressed="false" style="--wire:#50d9d8"><i></i> W4 · LED−</button></div>
<p class="flashlight-schematic-note">Типовое включение драйвера белого LED адаптировано для демонстрации. <a class="model-open" href="https://www.ti.com/lit/ds/symlink/tps61040.pdf">Схема Texas Instruments, рис. 7-10</a>.</p>`;

const modes = {
  assembly: {label:'Сборка', parts:productParts, eye:[.53,.30,1]},
  board: {label:'Плата и схема', parts:boardParts, eye:[1,.22,.43]},
  wiring: {label:'Проводка', parts:wireParts, eye:[.20,.33,1]},
};
const enclosed = new Set(['pcb','harness','spring','contact','cellA','cellB','switch']);
const wires = ['w1','w2','w3','w4'];

export function createFlashlight() {
  const {root,nodes,phosphor} = buildFlashlight(new Group());
  const lookup = new Map();
  root.traverse(node=>{
    if (node.userData.id) lookup.set(node.userData.id,node);
  });
  const sections = Object.values(nodes).map(group=>({
    group, origin:group.userData.home, offset:group.userData.offset,
  }));
  let mode = 'assembly';
  let selected = '';
  let spread = 0;

  function visibility() {
    const wire = mode === 'wiring' && wires.includes(selected);
    for (const [id,node] of Object.entries(nodes)) {
      const covered = mode === 'assembly' && spread < 2 && enclosed.has(id);
      node.visible = (mode === "assembly" || visible[mode].includes(id)) && !covered && (!wire || id === 'harness');
    }
    for (const id of wires) lookup.get(id).visible = !wire || id === selected;
  }
  visibility();
  phosphor.emissiveIntensity = .05;

  const model = {
    root, sections, eye:modes.assembly.eye,
    lighting:{environment:1.16, ambient:.74, exposure:1.07, backlight:1.05},
    createControls,
  };
  return model;

  function createControls({stage,canvas,explode,element,button,toggle,stopSpin,signal}) {
    const panel = element('div',null,'model-presets flashlight-controls');
    const row = element('div',null,'model-actions');
    panel.append(element('p','Узлы фонаря'),row);

    const label = element('label','Рассмотреть отдельную деталь');
    const select = element('select');
    select.setAttribute('aria-label','Деталь фонаря');
    label.append(select);
    const partFields = element('div',null,'model-part-fields');
    partFields.append(label);
    const detail = element('p',null,'flashlight-detail');
    detail.setAttribute('aria-live','polite');

    const schematic = element('section',null,'flashlight-schematic');
    schematic.hidden = true;
    const heading = element('h3','Электрическая схема');
    heading.id = 'flashlight-scheme-title';
    schematic.setAttribute('aria-labelledby',heading.id);
    schematic.innerHTML = diagram;
    schematic.prepend(heading);
    const hits = [...schematic.querySelectorAll('[data-id]')];
    const wireButtons = [...schematic.querySelectorAll('[data-pick]')];

    const explodeButton = button('Разобрать',()=>{
      setMode('assembly',spread ? 0 : 100);
    });
    const power = toggle('Включить свет','Выключить свет',on=>{
      phosphor.emissiveIntensity = on ? 3.8 : .05;
      schematic.querySelector('[data-switch-contact]').setAttribute('d',on ? 'M62 338H92' : 'M62 338L90 322');
    });
    const views = Object.entries(modes).map(([id,{label}])=>{
      const control = button(label,()=>setMode(id));
      control.dataset.flashlightMode = id;
      return control;
    });
    row.append(...views,explodeButton,power);
    panel.append(partFields,detail,schematic);

    const canPick = id=>modes[mode].parts.includes(id);
    function sync() {
      visibility();
      const [name,explanation] = info[selected] || ['', ''];
      detail.textContent = name ? name+'. '+explanation : '';
      for (const item of hits) item.classList.toggle('is-selected',item.dataset.id===selected);
      for (const item of wireButtons) item.setAttribute('aria-pressed',String(item.dataset.pick===selected));
      explodeButton.textContent = spread ? 'Собрать' : 'Разобрать';
      explodeButton.setAttribute('aria-pressed',String(spread>0));
      explodeButton.hidden = mode!=='assembly';
      stage.schedule();
    }
    function setMode(id,amount=0) {
      mode=id;
      selected='';
      stopSpin();
      select.replaceChildren(new Option('Выбрать деталь',''));
      for (const part of modes[mode].parts) select.add(new Option(info[part][0],part));
      for (const view of views) view.setAttribute('aria-pressed',String(view.dataset.flashlightMode===mode));
      schematic.hidden=mode==='assembly';
      explode.hidden=mode!=='assembly';
      explode.setValue(amount);
      stage.frameVisible(modes[mode].eye);
    }
    function showPart(id) {
      if (!id) {
        selected='';
        sync();
        stage.frameVisible(modes[mode].eye);
        return;
      }
      if (!canPick(id)) setMode(boardParts.includes(id) ? 'board' : 'wiring');
      if (!canPick(id)) return;
      stopSpin();
      selected=id;
      select.value=id;
      if (mode==='assembly' && spread<20 && (enclosed.has(id)||id==='led')) explode.setValue(67);
      sync();
      const object=lookup.get(id);
      const bounds=new Box3().setFromObject(object);
      const center=bounds.getCenter(new Vector3());
      const size=bounds.getSize(new Vector3()).length();
      const width=Math.min(1,stage.camera.aspect);
      stage.focus(center,Math.max(.26,size*2.55/width),modes[mode].eye);
    }
    model.onExplode = value=>{
      spread=value;
      sync();
      if (!selected && mode==='assembly') stage.frameVisible(modes.assembly.eye);
    };

    select.addEventListener('change',()=>showPart(select.value));
    for (const item of hits) {
      item.addEventListener('click',()=>showPart(item.dataset.id));
      item.addEventListener('keydown',event=>{
        if (event.key==='Enter'||event.key===' ') {
          event.preventDefault();
          showPart(item.dataset.id);
        }
      });
    }
    for (const item of wireButtons) item.addEventListener('click',()=>showPart(item.dataset.pick));

    const ray=new Raycaster();
    let pointer;
    canvas.addEventListener('pointerdown',event=>{
      pointer=event.isPrimary&&event.button===0 ? [event.clientX,event.clientY] : null;
    },{signal});
    canvas.addEventListener('pointercancel',()=>{pointer=null;},{signal});
    canvas.addEventListener('pointerup',event=>{
      const start=pointer;
      pointer=null;
      if (!start||Math.hypot(event.clientX-start[0],event.clientY-start[1])>6) return;
      const rect=canvas.getBoundingClientRect();
      ray.setFromCamera(new Vector2(
        (event.clientX-rect.left)/rect.width*2-1,
        1-(event.clientY-rect.top)/rect.height*2,
      ),stage.camera);
      const shown=Object.values(nodes).filter(node=>node.visible);
      for (const hit of ray.intersectObjects(shown,true)) {
        let id;
        let hidden=false;
        for (let node=hit.object;node&&node!==root;node=node.parent) {
          if (!node.visible) {hidden=true; break;}
          if (!id&&canPick(node.userData.id)) id=node.userData.id;
        }
        if (id&&!hidden) {showPart(id); return;}
      }
    },{signal});
    setMode('assembly');
    return [panel];
  }
}
