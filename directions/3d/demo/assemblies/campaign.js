import {createStage} from '../../catalog-view.js';
import {Vector3} from '../../engine.js';
import {createScene} from './scenes.js?v=refined-20261111';
const [notes,jobs]=await Promise.all(['./notes.json','./jobs.json?v=refined-20261111'].map(async path=>{
 const response=await fetch(path);
 if(!response.ok)throw new Error('Не загрузился список моделей');
 return response.json();
}));
const parameters=new URLSearchParams(location.search);
const film=parameters.has('video');
if(film)document.body.classList.add('film');
const $=id=>document.getElementById(id);
let stage;
try { stage=createStage($('model')); }
catch (error) { $('error').hidden=false; console.warn(error); }
const steps=Array.from({length:3},(_,i)=>$('step'+i));
let scene,labels,key,job,tick,activeStep=0,serial=0;
function smooth(t){return t*t*(3-2*t);}
function mix(a,b,r){return a+(b-a)*r;}
function vector(a,b,r){return a.map((x,i)=>mix(x,b[i],r));}
function highlight(i){
 activeStep=i;
 $('shot').textContent=labels[i];
 $('detail').textContent=i===0?'Поверните модель, чтобы увидеть её с другой стороны':i===1?labels[1]:labels[2];
 steps.forEach((b,n)=>b.setAttribute('aria-pressed',String(n===i)));
}
function focus(view){
 stage.focus(new Vector3(...view.target),view.distance*Math.max(1,1.15/stage.camera.aspect),view.eye);
}
function setPose(p,t){
 scene.pose(p,t);
 $('explode').value=Math.round(p*100);$('percent').value=Math.round(p*100)+'%';
 stage.draw();
}
function stop(){
 cancelAnimationFrame(tick);tick=null;
 $('play').textContent='Смотреть демонстрацию';
}
function snap(i){
 stop();
 const p=[0,.57,.82][i];
 highlight(i);focus(scene.views[i]);setPose(p,1);correctFraming([0,11,18][i]);
}
const timeline=[
 [0,0,0],[3.5,0,0,[-.35,.40,1]],[6.5,0,0],[10,1,.68],[13,1,.91],
 [16,2,.96],[21,2,1],[25.5,0,0],[27,0,0]
];
function frameAt(t){
 const ix=Math.min(timeline.length-1,Math.max(1,timeline.findIndex(x=>x[0]>t)));
 const a=timeline[ix-1],b=timeline[ix];
 const r=smooth(Math.max(0,Math.min(1,(t-a[0])/(b[0]-a[0]))));
 const i=r>.5?b[1]:a[1];
 if(i!==activeStep)highlight(i);
 const va=scene.views[a[1]],vb=scene.views[b[1]];
 focus({target:vector(va.target,vb.target,r),distance:mix(va.distance,vb.distance,r),eye:vector(a[3]||va.eye,b[3]||vb.eye,r)});
 setPose(mix(a[2],b[2],r),t);
}
function correctFraming(t){
 if(!job?.auditFix)return;
 function bounds(g){
  const min=new Vector3(Infinity,Infinity,Infinity),max=new Vector3(-Infinity,-Infinity,-Infinity);
  g.updateWorldMatrix(true,true);g.traverseVisible(o=>{if(o.isMesh){if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();const b=o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld);min.min(b.min);max.max(b.max);}});
  return {center:min.clone().add(max).multiplyScalar(.5),size:max.clone().sub(min)};
 }
 const whole=bounds(scene.root);
 const detail=job.focusBox?{center:new Vector3(...job.focusBox.center),size:new Vector3(...job.focusBox.size)}:scene.focusRoot?bounds(scene.focusRoot):whole;
 const k=smooth(Math.max(0,Math.min(1,(t-13)/3)))*(1-smooth(Math.max(0,Math.min(1,(t-21)/3))));
 const center=whole.center.clone().lerp(detail.center,k),size=whole.size.clone().lerp(detail.size,k);
 const eye=stage.camera.position.clone().sub(stage.controls.target).normalize();
 const right=new Vector3().crossVectors(stage.camera.up,eye).normalize();
 const up=new Vector3().crossVectors(eye,right),corner=new Vector3(),tan=Math.tan(stage.camera.fov*Math.PI/360);
 let distance=0;
 for(const x of [-.5,.5])for(const y of [-.5,.5])for(const z of [-.5,.5]){
  corner.set(x*size.x,y*size.y,z*size.z);
  distance=Math.max(distance,corner.dot(eye)+Math.max(Math.abs(corner.dot(up))/tan,Math.abs(corner.dot(right))/(tan*stage.camera.aspect)));
 }
 stage.focus(center,distance*1.10,eye.toArray());stage.draw();
}
const originalFrameAt=frameAt;
window.renderFrame=t=>{originalFrameAt(t);correctFraming(t)}; window.getScene=()=>scene;
function play(){
 stop();const start=performance.now();
 $('play').textContent='Остановить демонстрацию';
 document.documentElement.dataset.tour='playing';
 function render(now){
  const t=(now-start)/1000;
  if(t>=27){snap(0);document.documentElement.dataset.tour='done';return;}
  window.renderFrame(t);tick=requestAnimationFrame(render);
 }
 tick=requestAnimationFrame(render);
}
async function open(nextKey,nextJob){
 if(nextJob?.i===125){location.replace(new URL('../../eurocontainer/',import.meta.url));return;}
 stop();const id=++serial;
 const title=nextJob?.title||notes[nextKey][0];
 $('title').textContent=title;
 document.title=title+' | 007-A';
 $('picker').value=nextJob?'item-'+nextJob.i:'type-'+nextKey;
 $('matching-video').hidden=!nextJob;
 if(nextJob)$('matching-video').href='../../videos/#demo-'+nextJob.i;
 if(!stage)return;
 const selected=await createScene(nextKey,nextJob?.config);
 if(id!==serial){stage.dispose(selected.root);return;}
 key=nextKey;job=nextJob;
 scene=selected;
 labels=scene.labels||nextJob?.labels||['Изделие в сборе',...notes[key].slice(1,3)];
 steps.forEach((button,i)=>button.textContent='0'+(i+1)+'  '+labels[i]);
 stage.show(scene);snap(0);
 $('model').dataset.scene=key;
 document.documentElement.dataset.ready='true';
}
function appendOption(parent,value,title){
 const option=document.createElement('option');
 option.value=value;
 option.textContent=title;
 parent.append(option);
}
const specific=document.createElement('optgroup');
specific.label='Изделия из видеогалереи';
const samples=document.createElement('optgroup');
samples.label='Другие промышленные модели';
const byId=new Map(jobs.map(item=>[String(item.i),item]));
for(const item of jobs)appendOption(specific,'item-'+item.i,item.title);
for(const [key,value] of Object.entries(notes))appendOption(samples,'type-'+key,value[0]);
$('picker').append(specific,samples);
async function followLocation(){
 const params=new URLSearchParams(location.search);
 const chosen=byId.get(params.get('model')||params.get('video'));
 const key=chosen?.family||location.hash.slice(1);
 try{
  $('error').hidden=Boolean(stage);
  await open(Object.hasOwn(notes,key)?key:'pack',chosen);
 }catch(error){
  $('error').hidden=false;
  console.warn(error);
 }
}
$('picker').onchange=()=>{
 const value=$('picker').value;
 const url=new URL(location.href);
 url.search='';
 url.hash='';
 if(value.startsWith('item-'))url.searchParams.set('model',value.slice(5));
 else url.hash=value.slice(5);
 history.pushState(null,'',url);
 followLocation();
};
window.addEventListener('popstate',followLocation);
window.addEventListener('hashchange',followLocation);
$('explode').oninput=()=>{if(scene){stop();setPose(Number($('explode').value)/100,1.4);correctFraming(activeStep===2?18:11);}};
steps.forEach((button,i)=>button.onclick=()=>{if(scene)snap(i);});
$('play').onclick=()=>{if(scene){if(tick)stop();else play();}};
$('zoom-in').onclick=()=>stage?.zoom(.82);
$('zoom-out').onclick=()=>stage?.zoom(1.22);
$('model').addEventListener('keydown',event=>{
 if(event.key==='+'||event.key==='-'){
  event.preventDefault();
  stage?.zoom(event.key==='+'?.82:1.22);
 }
});
stage?.controls.addEventListener('start',stop);
await followLocation();
window.startTour=play;
