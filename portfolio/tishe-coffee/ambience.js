(() => {
 'use strict';
 const grid=document.querySelector('#drinks');
 const heroToggle=document.querySelector('#motion-toggle');
 const localToggle=document.querySelector('#ambience-toggle');
 const beanCanvas=document.querySelector('#closing-beans');
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const items=new Set(), visible=new Set(), mounted=new WeakMap();
 let paused=heroToggle?.getAttribute('aria-pressed')==='true'||reduced.matches, raf=0, last=0;
 const random=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v)};
 const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
 const smooth=(a,b,v)=>{const x=clamp((v-a)/(b-a));return x*x*(3-2*x)};
 const puff=document.createElement('canvas');puff.width=puff.height=96;
 const puffCtx=puff.getContext('2d');const vapor=puffCtx.createRadialGradient(48,48,0,48,48,48);
 vapor.addColorStop(0,'rgba(246,237,219,.72)');vapor.addColorStop(.25,'rgba(237,225,204,.46)');vapor.addColorStop(.62,'rgba(237,225,204,.12)');vapor.addColorStop(1,'rgba(237,225,204,0)');puffCtx.fillStyle=vapor;puffCtx.fillRect(0,0,96,96);
 const beanImage=new Image();beanImage.decoding='async';let beanStarted=false,beanReady=false,beanRects=[];
 function loadBeans(){if(beanStarted||paused)return;beanStarted=true;beanImage.src='assets/coffee-beans.png'}
 beanImage.onload=()=>{
  const sample=document.createElement('canvas');sample.width=beanImage.naturalWidth;sample.height=beanImage.naturalHeight;
  const context=sample.getContext('2d',{willReadFrequently:true});context.drawImage(beanImage,0,0);
  const halfW=sample.width/2,halfH=sample.height/2;
  for(let i=0;i<4;i++){
   const sx=(i%2)*halfW,sy=Math.floor(i/2)*halfH,data=context.getImageData(sx,sy,halfW,halfH).data;
   let left=halfW,top=halfH,right=0,bottom=0;
   for(let y=0;y<halfH;y++)for(let x=0;x<halfW;x++)if(data[(y*halfW+x)*4+3]>8){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y)}
   beanRects.push({x:sx+Math.max(0,left-3),y:sy+Math.max(0,top-3),w:Math.min(halfW,right-left+7),h:Math.min(halfH,bottom-top+7)});
  }
  beanReady=true;start();
 };
 function size(item){const rect=item.canvas.getBoundingClientRect();item.w=rect.width;item.h=rect.height;const dpr=Math.min(devicePixelRatio||1,1.5);item.canvas.width=Math.round(item.w*dpr);item.canvas.height=Math.round(item.h*dpr);item.ctx.setTransform(dpr,0,0,dpr,0,0)}
 const resize=new ResizeObserver(entries=>{for(const entry of entries){const item=mounted.get(entry.target);if(item)size(item)}start()});
 const observer=new IntersectionObserver(entries=>{
  for(const entry of entries){const item=mounted.get(entry.target);if(!item)continue;if(entry.isIntersecting){visible.add(item);if(item.kind==='beans')loadBeans()}else visible.delete(item)}
  start();
 },{rootMargin:'80px',threshold:0});
 function mount(canvas,kind){
  if(mounted.has(canvas))return;
  const item={canvas,ctx:canvas.getContext('2d'),kind,w:0,h:0,seed:Number(canvas.dataset.steam||0)+1};
  mounted.set(canvas,item);items.add(item);size(item);resize.observe(canvas);observer.observe(canvas);
 }
 function mountPhotos(){
  for(const item of items)if(item.kind==='steam'&&!item.canvas.isConnected){observer.unobserve(item.canvas);resize.unobserve(item.canvas);visible.delete(item);items.delete(item)}
  grid.querySelectorAll('.drink-steam').forEach(canvas=>mount(canvas,'steam'));start();
 }
 function drawSteam(item,t){
  const {ctx,w,h,canvas,seed}=item;if(!w||!h)return;
  ctx.clearRect(0,0,w,h);const x=Number(canvas.dataset.x)*w,y=Number(canvas.dataset.y)*h,rise=Number(canvas.dataset.rise)*h,scale=w/340;
  ctx.save();ctx.beginPath();ctx.rect(0,0,w,y+2);ctx.clip();
  for(let stream=0;stream<3;stream++)for(let n=0;n<13;n++){
   const id=seed*71+stream*19+n,period=4.1+random(seed+stream)*1.4;
   const age=((t*(.88+seed*.023)+n*period/13+stream*.83+seed*.61)%period)/period;
   const drift=(Math.sin(age*6.1-t*.29+seed+stream)*10+Math.sin(age*10.3+t*.19+stream)*5)*scale*age;
   const px=x+(stream-1)*w*.035+drift,py=y-rise*Math.pow(age,.8);
   const rx=(3.0+age*10.0)*(0.82+random(id)*.35)*scale,ry=(9+age*18)*scale;
   ctx.globalAlpha=.14*Math.pow(Math.sin(Math.PI*age),1.05)*(1-age*.5);
   ctx.save();ctx.translate(px,py);ctx.rotate(Math.sin(t*.25+id)*.28);ctx.drawImage(puff,-rx,-ry,rx*2,ry*2);ctx.restore();
  }
  ctx.restore();ctx.globalAlpha=1;
 }
 function drawBeans(item,t){
  const {ctx,w,h}=item;ctx.clearRect(0,0,w,h);if(!beanReady)return;
  const count=w<600?12:20;
  for(let i=0;i<count;i++){
   const seed=i+17,depth=random(seed*3),period=12+random(seed*7)*9;
   const p=((t/period+random(seed*13))%1.3)-.15;
   const side=random(seed*5),x=(side>.23?.56+random(seed*11)*.43:.01+random(seed*17)*.11)*w+Math.sin(t*.23+seed)*12;
   const y=p*h,dimension=(w<600?22:30)+depth*(w<600?30:58),rect=beanRects[i%4];
   const alpha=smooth(-.1,.08,p)*(1-smooth(.9,1.12,p))*(.38+depth*.48);
   ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.rotate(t*(.12+random(seed)*.22)*(i%2?1:-1)+seed);ctx.scale(.86+.14*Math.sin(t*.35+seed),1);
   if(depth<.3)ctx.filter='blur(1px)';ctx.drawImage(beanImage,rect.x,rect.y,rect.w,rect.h,-dimension/2,-dimension*rect.h/rect.w/2,dimension,dimension*rect.h/rect.w);ctx.restore();
  }
 }
 function tick(now){
  raf=0;if(paused||document.hidden||!visible.size)return;
  if(now-last>1000/28){last=now;const t=now/1000;for(const item of visible)if(item.kind==='steam')drawSteam(item,t);else drawBeans(item,t)}
  raf=requestAnimationFrame(tick);
 }
 function start(){if(raf){if(paused||document.hidden||!visible.size){cancelAnimationFrame(raf);raf=0}return}if(!paused&&!document.hidden&&visible.size)raf=requestAnimationFrame(tick)}
 function sync(){paused=heroToggle?.getAttribute('aria-pressed')==='true';localToggle?.setAttribute('aria-pressed',String(paused));if(localToggle){localToggle.textContent=paused?'Включить анимацию':'Пауза анимации';localToggle.setAttribute('aria-label',paused?'Включить анимацию карточек и зерен':'Остановить анимацию карточек и зерен')}if(!paused&&[...visible].some(item=>item.kind==='beans'))loadBeans();start()}
 if(localToggle)localToggle.addEventListener('click',()=>heroToggle?.click());
 if(heroToggle)new MutationObserver(sync).observe(heroToggle,{attributes:true,attributeFilter:['aria-pressed']});
 reduced.addEventListener('change',event=>{if(event.matches&&heroToggle?.getAttribute('aria-pressed')!=='true')heroToggle.click()});
 document.addEventListener('visibilitychange',start);
 new MutationObserver(mountPhotos).observe(grid,{childList:true});
 mountPhotos();if(beanCanvas)mount(beanCanvas,'beans');sync();
})();
