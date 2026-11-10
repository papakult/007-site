import {createStage} from '../../catalog-view.js';
import {Vector3} from '../../engine.js';
import {createScene} from './scenes.js';
const [notes,jobs]=await Promise.all(['./notes.json','./jobs.json'].map(async path=>{
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
let scene,labels,key,tick,activeStep=0,serial=0;
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
 highlight(i);focus(scene.views[i]);setPose(p,1);
}
const timeline=[
 [0,0,0],[2.45,0,0,[-.16,.36,1]],[5.4,1,.57],[7.5,1,.64],
 [9.8,2,.84],[12.7,2,.91],[15.9,0,0],[16.6,0,0]
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
window.renderFrame=frameAt;
function play(){
 stop();const start=performance.now();
 $('play').textContent='Остановить демонстрацию';
 document.documentElement.dataset.tour='playing';
 function render(now){
  const t=(now-start)/1000;
  if(t>=16.6){snap(0);document.documentElement.dataset.tour='done';return;}
  frameAt(t);tick=requestAnimationFrame(render);
 }
 tick=requestAnimationFrame(render);
}
async function open(nextKey,nextJob){
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
 key=nextKey;
 scene=selected;
 labels=nextJob?.labels||['Изделие в сборе',...notes[key].slice(1,3)];
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
$('explode').oninput=()=>{if(scene){stop();setPose(Number($('explode').value)/100,1.4);}};
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
