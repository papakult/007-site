import {createStage} from './stage.js';
import {Vector3,Mesh,SphereGeometry,MeshBasicMaterial} from '../engine.js';
import {Raycaster,Vector2,Box3} from '../flashlight-geometry.js';
import {createRockson} from './model.js';

const $=id=>document.getElementById(id);
const canvas=$('model');
const stage=createStage(canvas);
const model=createRockson();
stage.show(model);stage.zoom(.84);
const ray=new Raycaster(),pointer=new Vector2();
let selected=null,highlighted=false,tourFrame=null,scope='all',inspecting=false;
for(const assembly of model.assemblies){
 const option=document.createElement('option');option.value=assembly.id;option.textContent=assembly.name;$('scope').append(option);
}
$('stats').textContent=model.stats.parts.toLocaleString('ru')+' элементов · '+model.stats.fasteners.toLocaleString('ru')+' крепежных соединений · '+model.stats.assemblies+' узлов';
$('loading').hidden=true;
document.documentElement.dataset.ready='true';
canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();$('loading').hidden=false;$('loading').textContent='Графический просмотр остановлен. Обновите страницу';});
function stopTour(){
 cancelAnimationFrame(tourFrame);tourFrame=null;$('tour').textContent='Смотреть демонстрацию';
}
function apply(){
 if(inspecting){model.setFasteners(Number($('fasteners').value)/100);$('fastener-value').textContent=$('fasteners').value+'%';stage.schedule();return;}
 model.setExplode(Number($('explode').value)/100,scope);
 model.setFasteners(Number($('fasteners').value)/100);
 model.setRamps(Number($('ramp').value)/100);
 $('explode-value').textContent=$('explode').value+'%';
 $('fastener-value').textContent=$('fasteners').value+'%';
 $('ramp-value').textContent=Number($('ramp').value)>40?'Погрузка':'Транспортное';
 $('scene-label').textContent=scope==='all'?'Трал в сборе':model.assemblies.find(a=>a.id===scope).name;
 model.setIsolation($('isolate').checked&&scope!=='all'?scope:null);
 model.setDeckVisible($('deck').checked&&(!$('isolate').checked||scope==='deck'||scope==='all'));
 model.setStakesVisible($('stakes').checked&&(!$('isolate').checked||scope==='stakes'||scope==='all'));
 stage.schedule();
}
function updatePartList(){
 const select=$('part-select');select.replaceChildren();
 const first=document.createElement('option');first.value='';first.textContent='Выберите деталь или нажмите на модель';select.append(first);
 if(scope==='all')return;
 for(const part of [...model.parts,...model.fastenerParts].filter(p=>p.assembly===scope)){
  const option=document.createElement('option');
  option.value=String(part.id);option.textContent=part.name;select.append(option);
 }
}
function leaveInspection(){
 if(inspecting){model.closeInspection();inspecting=false;$('return').hidden=true;apply();}
}
function chooseScope(value){
 leaveInspection();
 scope=value;$('scope').value=scope;
 $('explode').value='0';$('fasteners').value='0';
 updatePartList();apply();
}
function focusScope(){
 const object=model.getScope(scope),box=new Box3().setFromObject(object);
 const point=box.getCenter(new Vector3());
 const size=box.getSize(new Vector3());
 stage.focus(point,Math.max(1.05,size.length()*1.75/Math.min(1,stage.camera.aspect)),[.74,.43,1]);
}
function reset(){
 stopTour();model.reset();inspecting=false;$('return').hidden=true;scope='all';$('scope').value='all';
 for(const id of ['explode','fasteners','ramp'])$(id).value='0';
 for(const id of ['deck','stakes'])$(id).checked=true;
 $('isolate').checked=false;
 $('selection').hidden=true;selected=null;
 updatePartList();apply();stage.reset();stage.zoom(.84);
}
$('scope').onchange=()=>{stopTour();chooseScope($('scope').value);};
for(const id of ['explode','fasteners','ramp'])$(id).oninput=()=>{stopTour();apply();};
for(const id of ['deck','stakes','isolate'])$(id).onchange=()=>{stopTour();apply();};
$('highlight').onclick=()=>{highlighted=!highlighted;model.highlightBolts(highlighted);$('highlight').setAttribute('aria-pressed',String(highlighted));stage.schedule();};
$('focus-scope').onclick=()=>{stopTour();focusScope();};
$('plus').onclick=()=>stage.zoom(.77);
$('minus').onclick=()=>stage.zoom(1.30);
$('reset').onclick=reset;
let startPointer=null;
canvas.addEventListener('pointerdown',event=>{startPointer=[event.clientX,event.clientY];});
canvas.addEventListener('pointerup',event=>{
 if(!startPointer||Math.hypot(event.clientX-startPointer[0],event.clientY-startPointer[1])>6)return;
 const bounds=canvas.getBoundingClientRect();
 pointer.set((event.clientX-bounds.left)/bounds.width*2-1,-(event.clientY-bounds.top)/bounds.height*2+1);
 ray.setFromCamera(pointer,stage.camera);
 model.root.updateMatrixWorld(true);
 const hits=ray.intersectObjects(model.root.children,true).filter(hit=>{for(let o=hit.object;o;o=o.parent)if(!o.visible)return false;return true;});
 selected=hits.length?model.pick(hits[0]):null;
 $('selection').hidden=!selected;
 if(selected){$('part-name').textContent=selected.name;scope=selected.assembly;$('scope').value=scope;updatePartList();$('inspect').hidden=!selected.fastener;}
});
function focusSelected(){
 if(!selected)return;
 stage.focus(selected.point,Math.max(.10,selected.radius*1.35/Math.min(1,stage.camera.aspect)),[.60,.35,1]);
}
$('part-select').onchange=()=>{
 if(!$('part-select').value)return;
 leaveInspection();selected=model.resolvePart($('part-select').value);
 $('selection').hidden=false;$('part-name').textContent=selected.name;$('inspect').hidden=!selected.fastener;
 focusSelected();
};
function inspect(){
 if(!selected?.fastener)return;
 stopTour();
 const object=model.inspectFastener(selected);inspecting=true;
 $('return').hidden=false;$('fasteners').value='60';$('fastener-value').textContent='60%';$('scope').value=scope;updatePartList();
 stage.focus(new Vector3(0,selected.diameter*1.7,0),selected.diameter*15/Math.min(1,stage.camera.aspect),[.70,.40,1]);
 stage.schedule();$('scene-label').textContent=selected.name;
}
$('inspect').onclick=inspect;
$('return').onclick=()=>{leaveInspection();stage.reset();stage.zoom(.84);};

$('focus-part').onclick=()=>{
 if(!selected)return;
 stopTour();
 stage.focus(selected.point,Math.max(.10,selected.radius*1.35/Math.min(1,stage.camera.aspect)),[.60,.35,1]);
};
canvas.addEventListener('keydown',event=>{
 if(!['+','-','='].includes(event.key))return;event.preventDefault();stage.zoom(event.key==='-'?1.22:.82);
});
stage.controls.addEventListener('start',stopTour);
function view(name){
 reset();
 if(name==='frame'){$('deck').checked=false;$('stakes').checked=false;scope='frame';}
 if(name==='bolt'){scope='axle0';selected=model.resolvePart(model.fastenerParts.find(p=>p.assembly==='axle0'&&p.name.includes('M22')).id);inspect();return;}
 if(name==='axle'){scope='axle0';$('isolate').checked=true;$('explode').value='82';}
 if(name==='ramps'){scope='ramps';$('ramp').value='88';$('explode').value='24';}
 if(name==='exploded'){$('explode').value='76';$('fasteners').value='75';}
 $('scope').value=scope;updatePartList();apply();
 if(name==='assembly'||name==='exploded'){stage.reset();stage.zoom(.84);}
 else focusScope();
}
for(const button of document.querySelectorAll('[data-view]'))button.onclick=()=>view(button.dataset.view);
function animate(t){
 const blend=(a,b,r)=>a+(b-a)*r;
 const smooth=x=>x*x*(3-2*x);
 const mix=(a,b,r)=>a.map((v,i)=>blend(v,b[i],r));
 if(t>=26&&t<32){
  if(!inspecting){
   selected=model.resolvePart(model.fastenerParts.find(p=>p.assembly==='axle0'&&p.name.includes('M22')).id);
   model.inspectFastener(selected);inspecting=true;$('return').hidden=false;
  }
  const r=(t-26)/6,d=selected.diameter;
  $('fasteners').value=String(Math.round(45+40*r));apply();
  $('scene-label').textContent='Колесная шпилька. Резьба, шайба и гайка';
  stage.focus(new Vector3(0,d*1.8,0),d*(15-1.8*Math.sin(r*Math.PI))/Math.min(1,stage.camera.aspect),[.70-r*.5,.45,1]);
  stage.draw();return;
 }
 if(inspecting){model.closeInspection();inspecting=false;$('return').hidden=true;}
 const shots=[
  {t:0,pos:[0,1.0,0],d:32,eye:[.90,.62,1],e:0,f:0,scope:'all'},
  {t:5,pos:[1.3,1.0,0],d:25,eye:[-.20,.65,1],e:0,f:0,scope:'all'},
  {t:10,pos:[3.6,.86,0],d:14,eye:[.8,.46,1],e:0,f:0,scope:'all'},
  {t:15,pos:[0,1.02,0],d:32,eye:[.65,.68,1],e:.82,f:0,scope:'all'},
  {t:19,pos:[2.72,.61,0],d:10,eye:[.6,.42,1],e:.82,f:.65,scope:'axle0'},
  {t:25.999,pos:[2.72,.61,.6],d:7,eye:[.34,.39,1],e:1,f:1,scope:'axle0'},
  {t:32,pos:[6.9,1.1,0],d:11,eye:[1,.5,.7],e:.24,f:.45,scope:'ramps'},
  {t:36,pos:[6.9,1.1,0],d:8,eye:[.5,.45,1],e:.24,f:.45,scope:'ramps'},
  {t:41,pos:[0,1.0,0],d:32,eye:[.90,.62,1],e:0,f:0,scope:'all'}
 ];
 let index=shots.findIndex(s=>s.t>t);if(index<1)index=t<shots[0].t?1:shots.length-1;
 const a=shots[index-1],b=shots[index];
 const r=smooth(Math.min(1,Math.max(0,(t-a.t)/(b.t-a.t))));
 const segment=r<.5?a:b;scope=segment.scope;
 $('scope').value=scope;$('isolate').checked=scope==='axle0';
 $('explode').value=String(Math.round(blend(a.e,b.e,r)*100));
 $('fasteners').value=String(Math.round(blend(a.f,b.f,r)*100));
 $('ramp').value=t>=32&&t<38?'85':'0';
 apply();
 $('scene-label').textContent=t<10?'Трал в сборе. Обзор конструкции':t<17?'Секционный настил и рама':t<26?'Отдельная ось. Разборка колеса и ступицы':t<38?'Аппарели. Шарниры и крепеж':'Трал в сборе';
 stage.focus(new Vector3(...mix(a.pos,b.pos,r)),blend(a.d,b.d,r)/Math.min(1,stage.camera.aspect),mix(a.eye,b.eye,r));stage.draw();
}
function play(){
 if(tourFrame){stopTour();return;}
 reset();$('tour').textContent='Остановить демонстрацию';
 const start=performance.now();document.documentElement.dataset.tour='playing';
 function tick(now){
  const t=(now-start)/1000;
  if(t>=41){reset();document.documentElement.dataset.tour='done';return;}
  animate(t);tourFrame=requestAnimationFrame(tick);
 }
 tourFrame=requestAnimationFrame(tick);
}
$('tour').onclick=play;
updatePartList();
window.rockson={model,stage,view,animate,apply,reset,play,inspect};
