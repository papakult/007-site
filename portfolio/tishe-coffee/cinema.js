(() => {
 'use strict';
 const stage=document.querySelector('.cinema-stage');
 const video=document.querySelector('#intro-decoder');
 const canvas=document.querySelector('#hero-canvas');
 const ctx=canvas.getContext('2d',{alpha:false});
 const foreground=document.querySelector('#hero-foreground');
 const front=foreground.getContext('2d');
 const word=document.querySelector('.hero-word');
 const copies=[...document.querySelectorAll('.scene-copy')];
 const toggle=document.querySelector('#motion-toggle');
 const dialog=document.querySelector('#film-dialog'), player=dialog.querySelector('video');
 const staticMode=matchMedia('(prefers-reduced-motion:reduce)').matches||navigator.connection?.saveData===true;
 const mobile=()=>innerWidth<=600;
 const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
 const ease=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t)};
 const mix=(a,b,t)=>a+(b-a)*t;
 let videoTime=0,previousTime=0,lastGeometry=null,dirty=true,paused=staticMode,visible=true,blend=null;
 const poster=new Image();poster.src='assets/film/start.jpg';
 const filmProgress=()=>clamp((videoTime-2)/10);
 function geometry(source,p=filmProgress()){
  const w=source.videoWidth||source.naturalWidth||source.width,h=source.videoHeight||source.naturalHeight||source.height,cw=canvas.width,ch=canvas.height;
  if(!w||!h)return null;let dw,dh,dx,dy;
  if(mobile()){
   const left=mix(.34,.26,ease(.52,.95,p));dw=cw/(1-left);dh=dw*h/w;dx=-left*dw;dy=ch*mix(.43,.46,ease(.5,.95,p))-dh/2;
   const close=ease(.1,.25,p)*(1-ease(.64,.84,p)),cover=Math.max(cw/w,ch/h),fw=w*cover,fh=h*cover;
   dx=mix(dx,(cw-fw)*.67,close);dy=mix(dy,(ch-fh)/2,close);dw=mix(dw,fw,close);dh=mix(dh,fh,close);
  }else{
   const opening=1-ease(0,3.5,videoTime),scale=Math.max(cw/w,ch/h)*mix(1,.92,opening);dw=w*scale;dh=h*scale;dx=mix((cw-dw)/2,cw-dw,opening);dy=mix((ch-dh)/2,ch*.18,opening);
  }
  return {w,h,dx,dy,dw,dh};
 }
 const pourSampler=document.createElement('canvas');pourSampler.width=512;pourSampler.height=1;const pourContext=pourSampler.getContext('2d',{willReadFrequently:true});
 const cup = new Path2D('M 752 270 C 748 70 1462 62 1465 270 C 1452 457 1409 662 1309 792 C 1229 858 994 855 903 785 C 828 718 788 508 752 270 Z M 1447 365 C 1530 245 1656 265 1660 380 C 1667 509 1502 653 1380 703 L 1422 607 C 1535 539 1621 435 1600 373 C 1581 311 1506 337 1437 424 Z M 1091 0 L 1151 0 L 1119 388 L 1090 388 Z');
 function paint(source,p=filmProgress()){
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
  if(videoTime<2.2){
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
  canvas.classList.add('ready');foreground.classList.add('ready');dirty=false;return true;
 }

 function setCopy(element,opacity,y){element.style.opacity=String(opacity);element.style.visibility=opacity>.01?'visible':'hidden';element.style.transform=`translateY(${y}px)`;element.style.pointerEvents=opacity>.6?'auto':'none';element.inert=opacity<.6}
 function updateCopy(t){
  const opening=1-ease(1.3,2.8,t),middle=ease(3.2,3.8,t)*(1-ease(6.2,6.8,t)),ending=ease(9,9.6,t)*(1-ease(11.4,12,t));
  setCopy(copies[0],opening,-18*(1-opening));setCopy(copies[1],middle,12*(1-middle));setCopy(copies[2],ending,12*(1-ending));
  const type=staticMode&&paused?1:ease(0,.2,t)*(1-ease(1.5,2.6,t));word.style.opacity=String(type);word.style.transform=`scale(${1+.04*(1-type)})`;
  stage.style.setProperty('--macro-shade',String(middle*.75));stage.dataset.filmTime=t.toFixed(2);stage.dataset.autoplay=String(!video.paused);
 }
 function render(t){
  if(t<previousTime-.5){const shot=document.createElement('canvas');shot.width=canvas.width;shot.height=canvas.height;shot.getContext('2d').drawImage(canvas,0,0);blend=shot}
  videoTime=t;previousTime=t;
  try{
   if(video.readyState>=2)paint(video,filmProgress());else if(poster.complete)paint(poster,0);
   if(blend){const alpha=1-clamp(t/.4);ctx.globalAlpha=alpha;ctx.drawImage(blend,0,0,canvas.width,canvas.height);ctx.globalAlpha=1;front.clearRect(0,0,foreground.width,foreground.height);if(!alpha)blend=null}
  }catch(_){canvas.classList.remove('ready');foreground.classList.remove('ready')}
  updateCopy(t);
 }
 function size(){const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);foreground.width=canvas.width;foreground.height=canvas.height;dirty=true;render(video.currentTime||0)}
 function canPlay(){return !paused&&visible&&!document.hidden&&!dialog.open&&!document.querySelector('#order-dialog').open}
 function play(){if(canPlay())video.play().catch(()=>{toggle.textContent='Включить';toggle.setAttribute('aria-label','Включить анимацию')})}
 function controls(){toggle.textContent=paused?'Продолжить':'Пауза';toggle.setAttribute('aria-label',paused?'Включить анимацию':'Остановить анимацию');toggle.setAttribute('aria-pressed',String(paused))}
 video.muted=true;video.playsInline=true;video.loop=true;
 if(staticMode){document.documentElement.classList.add('scene-static');controls();toggle.textContent='Включить'}else{video.preload='auto';video.load();play()}
 video.addEventListener('loadeddata',()=>{size();play()});
 video.addEventListener('play',()=>{stage.dataset.autoplay='true'});video.addEventListener('pause',()=>{stage.dataset.autoplay='false'});
 if(video.requestVideoFrameCallback){const tick=(now,metadata)=>{render(metadata.mediaTime);video.requestVideoFrameCallback(tick)};video.requestVideoFrameCallback(tick)}
 else{let last=-1;function tick(){if(video.currentTime!==last||dirty){render(video.currentTime);last=video.currentTime}requestAnimationFrame(tick)}requestAnimationFrame(tick)}
 poster.onload=()=>{if(video.readyState<2)render(0)};size();addEventListener('resize',size,{passive:true});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible)video.pause();else play()}).observe(stage);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else play()});
 toggle.addEventListener('click',()=>{paused=!paused;document.documentElement.classList.toggle('scene-static',paused&&staticMode);controls();if(paused)video.pause();else{if(video.preload==='none'){video.preload='auto';video.load()}play()}});
 document.querySelector('#watch-film').addEventListener('click',()=>{video.pause();dialog.showModal();document.body.style.overflow='hidden';player.currentTime=0;player.play().catch(()=>{})});
 dialog.querySelector('.close-film').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{player.pause();document.body.style.overflow='';play();document.querySelector('#watch-film').focus({preventScroll:true})});
 document.querySelector('#order-dialog').addEventListener('close',play);
})();
