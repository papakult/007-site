(() => {
 'use strict';
 const wrap = document.querySelector('.cinema-wrap');
 const stage = wrap.querySelector('.cinema-stage');
 const canvas = document.querySelector('#hero-canvas');
 const ctx = canvas.getContext('2d', {alpha:false});
 const foreground = document.querySelector('#hero-foreground');
 const front = foreground.getContext('2d');
 const word = document.querySelector('.hero-word');
 const intro = document.querySelector('#intro-decoder');
 const toggle = document.querySelector('#motion-toggle');
 const filmDialog = document.querySelector('#film-dialog');
 const filmPlayer = filmDialog.querySelector('video');
 const copies = [...wrap.querySelectorAll('.scene-copy')];
 const choices = document.querySelector('#scene-drinks');
 const pins = [...choices.querySelectorAll('.scene-drink')];
 const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
 const staticMode = reduced || navigator.connection?.saveData === true;
 const mobile = () => innerWidth <= 600;
 const clamp = (v,a=0,b=1) => Math.min(b,Math.max(a,v));
 const ease = (a,b,x) => {const t=clamp((x-a)/(b-a));return t*t*(3-2*t)};
 const mix = (a,b,t) => a+(b-a)*t;
 const frames = new Map(), pending = new Map();
 let queue=[], active=0, wanted=0, target=0, progress=0, paused=staticMode, visible=true;
 let previous=performance.now(), mode='intro', blend=null, dirty=true, lastFrame=-1, lastVideo=-1, lastCopy=-1, previousLod=mobile();
 let fallbackIndex=-1, missingSince=0, lastGeometry=null, trigger;
 const orbit={x:0,y:0,tx:0,ty:0};
 const pourSampler=document.createElement('canvas');pourSampler.width=512;pourSampler.height=1;const pourContext=pourSampler.getContext('2d',{willReadFrequently:true});
 const cup = new Path2D('M 752 270 C 748 70 1462 62 1465 270 C 1452 457 1409 662 1309 792 C 1229 858 994 855 903 785 C 828 718 788 508 752 270 Z M 1447 365 C 1530 245 1656 265 1660 380 C 1667 509 1502 653 1380 703 L 1422 607 C 1535 539 1621 435 1600 373 C 1581 311 1506 337 1437 424 Z M 1091 0 L 1151 0 L 1119 388 L 1090 388 Z');
 const fallback=document.createElement('video');
 fallback.id='journey-decoder';fallback.muted=true;fallback.playsInline=true;fallback.preload='none';fallback.src='assets/film/journey.mp4';fallback.setAttribute('aria-hidden','true');fallback.tabIndex=-1;stage.append(fallback);
 const poster=new Image();poster.src='assets/film/start.jpg';
 const filmProgress = p => clamp((p-.025)/.645);
 function geometry(source,p=0){
  const w=source.videoWidth||source.naturalWidth||source.width;
  const h=source.videoHeight||source.naturalHeight||source.height;
  const cw=canvas.width,ch=canvas.height;
  if(!w||!h)return null;
  let dw,dh,dx,dy;
  if(mobile()){
   const left=mix(.34,.26,ease(.52,.95,p));
   dw=cw/(1-left);dh=dw*h/w;dx=-left*dw;dy=ch*mix(.43,.46,ease(.5,.95,p))-dh/2;
   const close=ease(.10,.25,p)*(1-ease(.64,.84,p));
   const cover=Math.max(cw/w,ch/h);
   const fullW=w*cover,fullH=h*cover;
   dx=mix(dx,(cw-fullW)*.67,close);dy=mix(dy,(ch-fullH)/2,close);dw=mix(dw,fullW,close);dh=mix(dh,fullH,close);
  }else{
   const opening=1-ease(0,.18,p);
   const scale=Math.max(cw/w,ch/h)*mix(1,.92,opening);
   dw=w*scale;dh=h*scale;dx=mix((cw-dw)/2,cw-dw,opening)+orbit.x*canvas.width/innerWidth;dy=mix((ch-dh)/2,ch*.18,opening)+orbit.y*canvas.height/innerHeight;
  }
  return {w,h,dx,dy,dw,dh};
 }
 function paint(source,p=filmProgress(progress)){
  const g=geometry(source,p);if(!g)return false;
  ctx.fillStyle='#190c06';ctx.fillRect(0,0,canvas.width,canvas.height);
  let pour=null;
  if(!mobile()&&g.dx>0){
   const edge=g.w*g.dx/g.dw;ctx.save();ctx.translate(g.dx,0);ctx.scale(-1,1);ctx.drawImage(source,0,0,edge,g.h,0,g.dy,g.dx,g.dh);if(g.dy>0)ctx.drawImage(source,0,0,edge,4,0,0,g.dx,g.dy+1);ctx.restore();
  }
  ctx.drawImage(source,g.dx,g.dy,g.dw,g.dh);
  if(!mobile()&&g.dy>10){
   ctx.save();ctx.filter='blur(24px)';ctx.drawImage(source,0,0,g.w,4,g.dx-12,-24,g.dw+24,g.dy+48);ctx.restore();
   try{
    pourContext.drawImage(source,0,0,g.w,6,0,0,512,1);const row=pourContext.getImageData(0,0,512,1).data;let left=512,right=-1;
    for(let x=300;x<390;x++){const r=row[x*4],green=row[x*4+1],blue=row[x*4+2];if(r>90&&r>green*1.35&&green>blue*1.2){left=Math.min(left,x);right=x}}
    if(right>=left){pour={left:Math.max(0,left-.5)/512,width:(right-left+2)/512};ctx.drawImage(source,g.w*pour.left,0,g.w*pour.width,4,g.dx+g.dw*pour.left,0,g.dw*pour.width,g.dy+1)}
   }catch(_){}
  }
  front.clearRect(0,0,foreground.width,foreground.height);
  if(progress<.09){
   front.save();front.translate(g.dx,g.dy);front.scale(g.dw/1672,g.dh/941);front.clip(cup);front.drawImage(source,0,0,1672,941);front.restore();
   if(pour)front.drawImage(source,g.w*pour.left,0,g.w*pour.width,4,g.dx+g.dw*pour.left,0,g.dw*pour.width,g.dy+1);
  }
  if(mobile()){
   const feather=Math.min(65,Math.max(20,g.dh*.12));
   for(const bottom of [false,true]){
    const y=bottom?g.dy+g.dh-feather:g.dy;
    const gradient=ctx.createLinearGradient(0,y,0,y+feather);
    gradient.addColorStop(0,bottom?'#190c0600':'#190c06');gradient.addColorStop(1,bottom?'#190c06':'#190c0600');ctx.fillStyle=gradient;ctx.fillRect(0,y,canvas.width,feather);
   }
  }
  lastGeometry=g;
  if(!mobile()&&p>.72){
   for(const pin of pins){
    pin.style.left=`${(g.dx+g.dw*Number(pin.style.getPropertyValue('--pin-x'))/100)/canvas.width*100}%`;
    pin.style.top=`${(g.dy+g.dh*Number(pin.style.getPropertyValue('--pin-y'))/100)/canvas.height*100}%`;
   }
  }
  canvas.classList.add('ready');foreground.classList.add('ready');dirty=false;return true;
 }
 function size(){
  const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,mobile()?1.5:1.5);
  canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);foreground.width=canvas.width;foreground.height=canvas.height;dirty=true;
  if(previousLod!==mobile()){frames.forEach(image=>image.close?.());frames.clear();pending.forEach(task=>task.controller.abort());previousLod=mobile();prioritize(wanted)}
  measure();if(paused&&poster.complete)paint(poster,0);
 }
 function evict(){
  const cap=mobile()?20:18;
  const keys=[...frames.keys()].sort((a,b)=>Math.abs(b-wanted)-Math.abs(a-wanted));
  for(const key of keys.slice(0,Math.max(0,frames.size-cap))){frames.get(key)?.close?.();frames.delete(key)}
 }
 async function loadFrame(index,signal){
  const file=`frame_${String(index+1).padStart(4,'0')}.webp`;
  let response=await fetch(`assets/film/${mobile()?'frames':'frames-hd'}/${file}`,{signal});
  if(!response.ok&&!mobile())response=await fetch(`assets/film/frames/${file}`,{signal});
  if(!response.ok)throw Error('Frame unavailable');
  const blob=await response.blob();
  if(window.createImageBitmap)return createImageBitmap(blob);
  const image=new Image(),url=URL.createObjectURL(blob);image.src=url;
  try{await image.decode();return image}finally{URL.revokeObjectURL(url)}
 }
 function pump(){
  while(active<4&&queue.length){
   const index=queue.shift();if(frames.has(index)||pending.has(index))continue;
   const controller=new AbortController();active++;
   const promise=loadFrame(index,controller.signal).then(image=>{frames.set(index,image);dirty=true;evict()}).catch(()=>{}).finally(()=>{pending.delete(index);active--;pump()});
   pending.set(index,{controller,promise});
  }
 }
 function prioritize(index){
  wanted=clamp(Math.round(index),0,239);if(paused)return;
  const radius=mobile()?9:7;queue=[];
  pending.forEach((task,i)=>{if(Math.abs(i-wanted)>radius*3)task.controller.abort()});
  for(let distance=0;distance<=radius;distance++)for(const i of distance?[wanted+distance,wanted-distance]:[wanted])if(i>=0&&i<240&&!frames.has(i)&&!pending.has(i))queue.push(i);
  evict();pump();
 }
 function nearest(index){
  if(frames.has(index))return {index,image:frames.get(index)};
  for(let d=1;d<=3;d++)for(const i of [index-d,index+d])if(frames.has(i))return {index:i,image:frames.get(i)};
  return null;
 }
 function seekFallback(index){
  fallbackIndex=index;
  if(fallback.preload==='none'){fallback.preload='auto';fallback.load()}
  if(fallback.readyState>=1&&!fallback.seeking&&Math.abs(fallback.currentTime-index/24)>.055)fallback.currentTime=Math.min(index/24,9.95);
 }
 fallback.addEventListener('loadedmetadata',()=>seekFallback(fallbackIndex<0?0:fallbackIndex));
 fallback.addEventListener('seeked',()=>{dirty=true;if(Math.abs(fallback.currentTime-fallbackIndex/24)>.055)seekFallback(fallbackIndex)});
 function setCopy(element,opacity,y){
  element.style.opacity=String(opacity);element.style.visibility=opacity>.01?'visible':'hidden';element.style.transform=`translateY(${y}px)`;element.style.pointerEvents=opacity>.6?'auto':'none';element.inert=opacity<.6;
 }
 function updateCopy(p){
  if(Math.abs(p-lastCopy)<.0001)return;lastCopy=p;
  const opening=1-ease(.015,.10,p),middle=ease(.16,.22,p)*(1-ease(.34,.40,p)),ending=ease(.57,.66,p)*(1-ease(.91,1,p));
  wrap.style.setProperty("--macro-shade",String(middle*.85));setCopy(copies[0],opening,-20*(1-opening));setCopy(copies[1],middle,18*(1-middle));setCopy(copies[2],ending,15*(1-ending));
  const type=1-ease(.005,.075,p);word.style.opacity=String(type);word.style.transform=`translateY(${-32*(1-type)}px) scale(${1+.06*(1-type)})`;
  const choiceOpacity=ease(.66,.73,p)*(1-ease(.87,.97,p));choices.style.opacity=String(choiceOpacity);choices.style.visibility=choiceOpacity>.01?'visible':'hidden';choices.style.pointerEvents=choiceOpacity>.9?'auto':'none';choices.inert=choiceOpacity<.9;
  document.querySelector('#scene-label').textContent=p<.12?'Листайте, чтобы заглянуть в кофе':p<.57?'Внутри вкуса':'Выберите свою чашку';
  wrap.querySelector('.scene-rail i').style.transform=`scaleX(${p})`;wrap.dataset.sceneProgress=p.toFixed(3);wrap.dataset.filmProgress=filmProgress(p).toFixed(3);
 }
 function playIntro(){if(!paused&&visible&&!document.hidden&&!filmDialog.open&&!document.querySelector('#order-dialog').open)intro.play().catch(()=>{toggle.textContent='Включить';toggle.setAttribute('aria-label','Включить движение')})}
 function enterJourney(now){
  if(mode==='journey')return;
  const snapshot=document.createElement('canvas');snapshot.width=canvas.width;snapshot.height=canvas.height;snapshot.getContext('2d').drawImage(canvas,0,0);blend={image:snapshot,started:now};intro.pause();mode='journey';dirty=true;
 }
 function enterIntro(now){
  if(mode==='intro')return;
  const snapshot=document.createElement('canvas');snapshot.width=canvas.width;snapshot.height=canvas.height;snapshot.getContext('2d').drawImage(canvas,0,0);
  blend={image:snapshot,started:now};mode='intro';lastVideo=-1;dirty=true;playIntro();
 }
 function compositeBlend(now){
  if(!blend)return;
  const alpha=1-clamp((now-blend.started)/260);ctx.globalAlpha=alpha;ctx.drawImage(blend.image,0,0,canvas.width,canvas.height);ctx.globalAlpha=1;if(!alpha)blend=null;
 }
 function tick(now){
  const delta=Math.min(80,now-previous);previous=now;
  orbit.x=mix(orbit.x,orbit.tx,.06);orbit.y=mix(orbit.y,orbit.ty,.06);
  const orderOpen=document.querySelector('#order-dialog').open;
  if(!paused&&visible&&!document.hidden&&!filmDialog.open&&!orderOpen){
   progress+=(target-progress)*(1-Math.exp(-delta/70));if(Math.abs(progress-target)<.00015)progress=target;updateCopy(progress);
   const p=filmProgress(progress),index=Math.round(p*239);
   if(progress>.002){
    if(index!==wanted)prioritize(index);
    let frame=nearest(index);
    if(!frame){if(!missingSince)missingSince=now;if(now-missingSince>100){seekFallback(index);if(fallback.readyState>=2&&Math.abs(fallback.currentTime-index/24)<.2)frame={index:Math.round(fallback.currentTime*24),image:fallback}}}else missingSince=0;
    if(frame){enterJourney(now);if(dirty||lastFrame!==frame.index||blend){paint(frame.image,p);lastFrame=frame.index;wrap.dataset.sceneFrame=String(frame.index);compositeBlend(now)}}
   }else{
    enterIntro(now);
    if(intro.readyState>=2&&(dirty||blend||Math.abs(intro.currentTime-lastVideo)>1/30||Math.abs(orbit.x-orbit.tx)>.1)){paint(intro,0);compositeBlend(now);lastVideo=intro.currentTime}else if(dirty&&poster.complete)paint(poster,0);
   }
  }else if(dirty&&poster.complete&&!canvas.classList.contains('ready'))paint(poster,0);
  requestAnimationFrame(tick);
 }
 function measure(){target=clamp(-wrap.getBoundingClientRect().top/Math.max(1,wrap.offsetHeight-stage.offsetHeight))}
 function connect(){trigger?.kill();if(!document.documentElement.classList.contains('scene-static')&&window.ScrollTrigger){gsap.registerPlugin(ScrollTrigger);trigger=ScrollTrigger.create({trigger:wrap,start:'top top',end:'bottom bottom',onUpdate:measure,onRefresh:measure});measure()}}
 poster.onload=()=>{if(mode==='intro'&&!intro.videoWidth)paint(poster,0)};
 if(staticMode){document.documentElement.classList.add('scene-static');toggle.textContent='Включить';toggle.setAttribute('aria-label','Включить движение')}else{intro.preload='auto';intro.load();intro.addEventListener('loadeddata',playIntro,{once:true});prioritize(0)}
 size();connect();updateCopy(0);requestAnimationFrame(tick);
 addEventListener('scroll',measure,{passive:true});addEventListener('resize',size,{passive:true});
 stage.addEventListener('pointermove',event=>{if(mobile()||paused||event.pointerType!=='mouse')return;orbit.tx=(event.clientX/innerWidth-.5)*-8;orbit.ty=(event.clientY/innerHeight-.5)*-5;dirty=true});
 stage.addEventListener('pointerleave',()=>{orbit.tx=orbit.ty=0;dirty=true});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible)intro.pause();else if(mode==='intro')playIntro()}).observe(stage);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)intro.pause();else if(mode==='intro')playIntro()});
 toggle.addEventListener('click',()=>{paused=!paused;toggle.textContent=paused?'Продолжить':'Пауза';toggle.setAttribute('aria-label',paused?'Включить движение':'Остановить движение');toggle.setAttribute('aria-pressed',String(paused));if(paused)intro.pause();else{if(document.documentElement.classList.contains('scene-static')){document.documentElement.classList.remove('scene-static');intro.preload='auto';intro.load();size();connect()}prioritize(wanted);if(mode==='intro')playIntro()}});
 document.querySelector('#watch-film').addEventListener('click',()=>{intro.pause();filmDialog.showModal();document.body.style.overflow='hidden';filmPlayer.currentTime=0;filmPlayer.play().catch(()=>{})});
 filmDialog.querySelector('.close-film').addEventListener('click',()=>filmDialog.close());
 filmDialog.addEventListener('close',()=>{filmPlayer.pause();document.body.style.overflow='';measure();if(mode==='intro')playIntro();document.querySelector('#watch-film').focus({preventScroll:true})});
 window.addEventListener('coffee:focus', event=>{
  const visual=document.querySelector('.visual-layer');
  const x=lastGeometry?(lastGeometry.dx+lastGeometry.dw*event.detail.sourceX/100)/canvas.width:event.detail.x;
  const y=lastGeometry?(lastGeometry.dy+lastGeometry.dh*event.detail.sourceY/100)/canvas.height:event.detail.y;
  visual.style.transformOrigin=`${clamp(x)*100}% ${clamp(y)*100}%`;
  visual.style.transform='scale(1.16)';stage.dataset.focusing='true';choices.inert=true;
 });
 document.querySelector('#order-dialog').addEventListener('close',()=>{
  document.querySelector('.visual-layer').style.transform='';delete stage.dataset.focusing;lastCopy=-1;updateCopy(progress);dirty=true;measure();if(mode==='intro')playIntro();
 });
 if(new URLSearchParams(location.search).get('tour')==='1'&&!reduced){
  document.documentElement.style.scrollBehavior='auto';history.scrollRestoration='manual';scrollTo({top:0,behavior:'instant'});
  setTimeout(()=>{
   const start=performance.now();let opened=false,submitted=false,closed=false;
   function tour(now){
    const t=(now-start)/1000,travel=wrap.offsetHeight-stage.offsetHeight,menu=document.querySelector('#menu');
    let y=t<3?0:t<14?(t-3)/11*travel*.75:travel*.75;
    if(t>=23)y=travel*.75+ease(23,28,t)*(menu.offsetTop+200-travel*.75);
    if(!opened||closed)scrollTo({top:y,behavior:'instant'});
    if(t>=17&&!opened){document.querySelector('[data-scene-drink="flatwhite"]').click();setTimeout(()=>{document.querySelectorAll('#size-options input')[1].checked=true;document.querySelector('#order-milk').selectedIndex=1;document.querySelector('#order-milk').dispatchEvent(new Event('change',{bubbles:true}))},420);opened=true}
    if(t>=20&&!submitted){document.querySelector('#order-form').requestSubmit();submitted=true}
    if(t>=23&&!closed){document.querySelector('#order-dialog').close();closed=true}
    if(t<29)requestAnimationFrame(tour);
   }
   requestAnimationFrame(tour);
  },1000);
 }
})();
