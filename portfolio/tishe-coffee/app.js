import * as THREE from 'three';
import { RoomEnvironment } from './assets/vendor/RoomEnvironment.js';

const drinks = [
  {id:'espresso',name:'Эспрессо',category:'black',price:180,sizes:[30,60],extra:[0,70],note:'Карамель, какао, плотная крема',description:'Короткий. Плотный. С карамельным послевкусием.'},
  {id:'americano',name:'Американо',category:'black',price:220,sizes:[200,300],extra:[0,40],note:'Эспрессо и горячая вода',description:'Знакомый вкус. Мягче, длиннее, в вашем ритме.'},
  {id:'cappuccino',name:'Капучино',category:'milk',price:280,sizes:[200,300],extra:[0,50],note:'Эспрессо и воздушная молочная пена',description:'Кофе, молоко и мягкая пена. Любимая классика.'},
  {id:'flatwhite',name:'Флэт уайт',category:'milk',price:310,sizes:[200,300],extra:[0,60],note:'Двойной эспрессо, шелковистое молоко',description:'Больше кофе. Тонкий слой пены. Все в равновесии.'},
  {id:'latte',name:'Латте',category:'milk',price:300,sizes:[300,400],extra:[0,60],note:'Много теплого молока, мягкий вкус',description:'Нежный, молочный. Когда хочется замедлиться.'},
  {id:'filter',name:'Фильтр-кофе',category:'black',price:240,sizes:[250,350],extra:[0,50],note:'Чистый вкус зерна, без молока',description:'Прозрачный, легкий. Раскрывается с каждым глотком.'}
];
const $ = s => document.querySelector(s);
let selected=drinks[0],sizeIndex=0;
const dialog=$('#order-dialog');
function preview(d){
  selected=d;
  $('#preview-name').textContent=d.name;
  $('#preview-description').textContent=d.description;
  $('#preview-volume').textContent=d.sizes[0]+' мл';
  $('#drink-number').textContent=String(drinks.indexOf(d)+1).padStart(2,'0')+' / '+(d.category==='milk'?'НЕЖНЫЙ ХАРАКТЕР':'ЧИСТЫЙ ВКУС');
  $('.drink-visual').dataset.drink=d.id;
}
function renderMenu(category='all'){
  $('#drinks').replaceChildren();
  drinks.filter(d=>category==='all'||d.category===category).forEach(d=>{
    const row=document.createElement('article');row.className='drink-row';
    row.innerHTML=`<button class="drink-info" aria-label="Посмотреть ${d.name}"><h3>${d.name}</h3><p>${d.sizes[0]} мл / ${d.note}</p></button><div class="drink-action"><span>${d.price} ₽</span><button class="add-drink" aria-label="Выбрать ${d.name}">+</button></div>`;
    row.querySelector('.drink-info').addEventListener('click',()=>preview(d));
    row.querySelector('.drink-info').addEventListener('mouseenter',()=>preview(d));
    row.querySelector('.drink-info').addEventListener('focus',()=>preview(d));
    row.querySelector('.add-drink').addEventListener('click',()=>openOrder(d));
    $('#drinks').append(row);
  });
}
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});
  renderMenu(b.dataset.filter);
}));
drinks.forEach(d=>{const o=document.createElement('option');o.value=d.id;o.textContent=d.name;$('#order-drink').append(o);});
function total(){return selected.price+selected.extra[sizeIndex]+(selected.category==='milk'?Number($('#order-milk').value):0);}
function updateTotal(){$('#total-price').textContent=total()+' ₽';}
function updateOrder(){
  selected=drinks.find(d=>d.id===$('#order-drink').value);sizeIndex=0;
  $('#milk-label').hidden=selected.category!=='milk';$('#order-milk').value='0';
  $('#size-options').replaceChildren();
  selected.sizes.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.className='size-choice'+(!i?' active':'');b.textContent=s+' мл';b.setAttribute('aria-pressed',String(!i));b.addEventListener('click',()=>{sizeIndex=i;document.querySelectorAll('.size-choice').forEach((x,n)=>{x.classList.toggle('active',n===i);x.setAttribute('aria-pressed',String(n===i));});updateTotal();});$('#size-options').append(b);});
  updateTotal();preview(selected);
}
function openOrder(d){$('#order-form').hidden=false;$('#order-result').hidden=true;$('#order-drink').value=d.id;updateOrder();dialog.showModal();}
$('#order-drink').addEventListener('change',updateOrder);$('#order-milk').addEventListener('change',updateTotal);
$('.close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
$('#order-form').addEventListener('submit',e=>{e.preventDefault();$('#result-text').textContent=selected.name+', '+selected.sizes[sizeIndex]+' мл'+(selected.category==='milk'?', '+$('#order-milk').selectedOptions[0].text.replace(', +60 ₽','').toLowerCase()+' молоко':'')+'. Итого '+total()+' ₽.';$('#order-form').hidden=true;$('#order-result').hidden=false;});
$('.result-back').addEventListener('click',()=>{$('#order-form').hidden=false;$('#order-result').hidden=true;});
renderMenu();

const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile=()=>innerWidth<=600;
const motion={progress:0,pointerX:0,pointerY:0};
function setCopy(p){
  const a=p<.26?1:p<.34?1-(p-.26)/.08:0;
  const b=p>.32&&p<.66?Math.min(1,(p-.32)/.08,(.66-p)/.08):0;
  const c=p>.65?Math.min(1,(p-.65)/.08):0;
  [['.copy-intro',a],['.copy-beans',b],['.copy-brew',c]].forEach(([s,v])=>{const el=$(s);el.style.opacity=v;el.style.visibility=v>.01?'visible':'hidden';el.style.transform=`translateY(${(1-v)*18}px)`;});
  $('.chapter b').textContent=p<.33?'01':p<.67?'02':'03';
}
if(window.gsap&&window.ScrollTrigger){
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.create({trigger:'.scroll-story',start:'top top',end:'bottom bottom',scrub:reduced?false:1,onUpdate:s=>{motion.progress=s.progress;setCopy(s.progress);}});
}else{
  addEventListener('scroll',()=>{motion.progress=Math.max(0,Math.min(1,scrollY/($('.scroll-story').offsetHeight-innerHeight)));setCopy(motion.progress);},{passive:true});
}
setCopy(0);
document.querySelectorAll('a[href="#story"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();window.scrollTo({top:($('.scroll-story').offsetHeight-innerHeight)*.47,behavior:reduced?'instant':'smooth'});}));

function coffeeTexture(milk=false){
  const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d');
  const img=ctx.createImageData(512,512);
  for(let y=0;y<512;y++)for(let x=0;x<512;x++){
    const dx=(x-256)/256,dy=(y-256)/256,r=Math.hypot(dx,dy),angle=Math.atan2(dy,dx);
    const swirl=Math.sin(r*35+angle*3+Math.sin(angle*5+r*16)*.7);
    const n=(Math.sin(x*127.1+y*311.7)*43758.5453)%1;
    const v=.42+swirl*.15+Math.sin(x*.09+Math.sin(y*.05)*2)*.07+n*.07;
    const i=(y*512+x)*4;
    img.data[i]=105+v*115;img.data[i+1]=45+v*100;img.data[i+2]=15+v*65;img.data[i+3]=255;
  }ctx.putImageData(img,0,0);
  if(milk){
    ctx.save();ctx.translate(256,265);ctx.rotate(-.2);ctx.fillStyle='#f3dfb6';
    ctx.beginPath();ctx.moveTo(0,110);ctx.bezierCurveTo(-185,-10,-130,-150,-45,-80);ctx.bezierCurveTo(-15,-60,-5,-40,0,-25);ctx.bezierCurveTo(10,-70,60,-135,115,-90);ctx.bezierCurveTo(185,-25,70,65,0,110);ctx.fill();
    ctx.strokeStyle='#b78a52';ctx.lineWidth=9;for(let i=0;i<6;i++){ctx.beginPath();ctx.ellipse(0,-5+i*13,67-i*8,30-i*3,0,.15,Math.PI-.15);ctx.stroke();}ctx.restore();
  }
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
function steamTexture(){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');const g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(232,215,188,.3)');g.addColorStop(.45,'rgba(232,215,188,.12)');g.addColorStop(1,'rgba(232,215,188,0)');x.fillStyle=g;x.fillRect(0,0,128,128);return new THREE.CanvasTexture(c);}
let renderer,scene,camera,cup,beans,stream,steam,foam,liquid;
let renderedFrames=0;
function makeScene(){
  renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.setSize(innerWidth,innerHeight);
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.85;renderer.outputColorSpace=THREE.SRGBColorSpace;
  $('#scene').append(renderer.domElement);
  scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(34,innerWidth/innerHeight,.1,60);
  camera.position.set(0,2.5,10.5);camera.lookAt(0,.25,0);
  const pmrem=new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment();scene.environment=pmrem.fromScene(room,.04).texture;room.dispose();pmrem.dispose();
  const key=new THREE.DirectionalLight(0xffe9ce,2.6);key.position.set(-4,6,7);scene.add(key);
  const rim=new THREE.DirectionalLight(0xe4e5dc,1.8);rim.position.set(5,3,-3);scene.add(rim);
  const warm=new THREE.PointLight(0xe6a05b,28,18);warm.position.set(-3,0,3);scene.add(warm);
  scene.add(new THREE.HemisphereLight(0xf7e1c2,0x332013,1.3));
  cup=new THREE.Group();scene.add(cup);
  const ceramic=new THREE.MeshPhysicalMaterial({color:0xd6bea0,roughness:.4,metalness:.02,clearcoat:.8,clearcoatRoughness:.17});
  const points=[new THREE.Vector2(0,-.67),new THREE.Vector2(.46,-.67),new THREE.Vector2(.58,-.62),new THREE.Vector2(.7,-.48),new THREE.Vector2(.84,-.2),new THREE.Vector2(.95,.18),new THREE.Vector2(1,.55),new THREE.Vector2(1.01,.77),new THREE.Vector2(1,.81),new THREE.Vector2(.97,.83),new THREE.Vector2(.93,.81),new THREE.Vector2(.92,.75),new THREE.Vector2(.88,.23),new THREE.Vector2(.75,-.19),new THREE.Vector2(.55,-.49),new THREE.Vector2(0,-.5)];
  const body=new THREE.Mesh(new THREE.LatheGeometry(points,128),ceramic);cup.add(body);
  const handle=new THREE.Mesh(new THREE.TorusGeometry(.48,.13,24,80),ceramic);handle.position.set(1.04,.13,0);handle.scale.set(.94,1.12,1);cup.add(handle);
  const saucerPoints=[[0,-.81],[.65,-.81],[1.15,-.8],[1.65,-.73],[1.8,-.62],[1.79,-.57],[1.7,-.57],[1.1,-.69],[.68,-.71],[0,-.71]].map(p=>new THREE.Vector2(...p));
  cup.add(new THREE.Mesh(new THREE.LatheGeometry(saucerPoints,128),ceramic));
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.61,.025,12,100),new THREE.MeshStandardMaterial({color:0xb9a084,roughness:.35}));ring.rotation.x=Math.PI/2;ring.position.y=-.69;cup.add(ring);
  foam=coffeeTexture();liquid=new THREE.Mesh(new THREE.CircleGeometry(.927,128),new THREE.MeshPhysicalMaterial({map:foam,roughness:.26,metalness:0,clearcoat:1,clearcoatRoughness:.12}));liquid.rotation.x=-Math.PI/2;liquid.position.y=.745;cup.add(liquid);
  const meniscus=new THREE.Mesh(new THREE.TorusGeometry(.915,.012,8,120),new THREE.MeshStandardMaterial({color:0xc89654,roughness:.25}));meniscus.rotation.x=Math.PI/2;meniscus.position.y=.75;cup.add(meniscus);
  const lc=document.createElement('canvas');lc.width=512;lc.height=220;const lctx=lc.getContext('2d');lctx.font='italic 125px Georgia';lctx.textAlign='center';lctx.fillStyle='#413326';lctx.fillText('тише.',256,147);const logoTex=new THREE.CanvasTexture(lc);logoTex.colorSpace=THREE.SRGBColorSpace;
  const logo=new THREE.Mesh(new THREE.PlaneGeometry(.83,.36),new THREE.MeshBasicMaterial({map:logoTex,transparent:true,depthWrite:false,side:THREE.DoubleSide}));logo.position.set(0,.04,.909);logo.rotation.x=-.24;cup.add(logo);
  stream=new THREE.Mesh(new THREE.CylinderGeometry(.025,.04,2.7,16,8),new THREE.MeshPhysicalMaterial({color:0xb77631,roughness:.2,metalness:.1,clearcoat:1}));stream.position.set(0,2.07,0);stream.visible=false;cup.add(stream);
  const steamMap=steamTexture();steam=new THREE.Group();for(let i=0;i<8;i++){const sm=new THREE.SpriteMaterial({map:steamMap,transparent:true,opacity:.2,depthWrite:false,blending:THREE.AdditiveBlending});const s=new THREE.Sprite(sm);s.position.set((i%3-1)*.22,1+i*.18,0);s.scale.set(.65,.8,1);steam.add(s);}cup.add(steam);
  beans=new THREE.Group();scene.add(beans);
  const bm=new THREE.MeshStandardMaterial({color:0x2c1409,roughness:.58,metalness:0});const crack=new THREE.MeshStandardMaterial({color:0x231208,roughness:.95});
  for(let i=0;i<12;i++){
    const b=new THREE.Group();const seed=new THREE.Mesh(new THREE.SphereGeometry(1,28,20),bm);seed.scale.set(.135,.205,.1);b.add(seed);
    const path=new THREE.CatmullRomCurve3([new THREE.Vector3(-.015,-.18,.046),new THREE.Vector3(.022,-.08,.097),new THREE.Vector3(-.015,.04,.101),new THREE.Vector3(.013,.15,.065)]);
    b.add(new THREE.Mesh(new THREE.TubeGeometry(path,20,.012,6,false),crack));b.userData={angle:i/12*Math.PI*2,radius:2.15+(i%3)*.22,phase:i*.71};b.rotation.set(i*.5,i*.8,i*.3);beans.add(b);
  }
  const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=256;const sh=shadowCanvas.getContext('2d');const g=sh.createRadialGradient(128,128,10,128,128,128);g.addColorStop(0,'rgba(0,0,0,.55)');g.addColorStop(1,'rgba(0,0,0,0)');sh.fillStyle=g;sh.fillRect(0,0,256,256);const shadow=new THREE.Mesh(new THREE.PlaneGeometry(5,3.4),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(shadowCanvas),transparent:true,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.set(1.6,-1.28,0);scene.add(shadow);
  addEventListener('pointermove',e=>{motion.pointerX=(e.clientX/innerWidth-.5)*2;motion.pointerY=(e.clientY/innerHeight-.5)*2;},{passive:true});
  addEventListener('resize',()=>{renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();});
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();$('#scene').hidden=true;$('.scene-fallback').hidden=false;});
  const clock=new THREE.Clock();let smoothP=0;
  function frame(){
    requestAnimationFrame(frame);
    if(document.hidden)return;
    const t=reduced?0:clock.getElapsedTime();smoothP+=(motion.progress-smoothP)*.06;const p=smoothP;
    const m=mobile();const beanPhase=Math.sin(Math.min(1,Math.max(0,(p-.25)/.5))*Math.PI);
    cup.position.set(m?.15:1.95,m?-1.32:-.13,0);
    cup.rotation.set(.12+(m?.03:0)+Math.sin(t*.45)*.018,-.43+p*Math.PI*1.7+(reduced?0:motion.pointerX*.08),-.13+Math.sin(p*Math.PI*2)*.1);
    const scale=(m?.91:1.33)*(1-beanPhase*.15);cup.scale.setScalar(scale);
    if(m)camera.position.set(0,3,12.8);else camera.position.set(0,2.6,10.5);
    camera.lookAt(0,m?.55:.25,0);
    beans.position.copy(cup.position);beans.position.y+=.2;beans.rotation.z=p*.5;
    beans.children.forEach((b,i)=>{const a=b.userData.angle+t*.035;const r=b.userData.radius*(1+beanPhase*.4);b.position.set(Math.cos(a)*r,Math.sin(a)*r*.65+Math.sin(t*.7+i)*.07,Math.sin(i*1.4)*1.1);b.rotation.x+=reduced?0:.001;b.rotation.z+=reduced?0:.0015;b.scale.setScalar((m?.7:1)*(1+beanPhase*.5));});
    stream.visible=p>.68&&p<.9;stream.scale.y=stream.visible?Math.min(1,(p-.68)/.07,(.9-p)/.04):.01;stream.position.y=.75+1.35*stream.scale.y;
    steam.children.forEach((s,i)=>{const q=(t*.13+i/8)%1;s.position.y=.9+q*1.6;s.position.x=Math.sin(q*4+i)*.15;s.material.opacity=(1-q)*.2;s.scale.set(.45+q*.6,.8+q*.65,1);});
    if(scrollY<$('.scroll-story').offsetHeight+innerHeight){renderer.render(scene,camera);renderedFrames++;}
  }frame();
  document.body.dataset.scene='ready';
}
try{makeScene();}catch(error){console.warn('3D preview unavailable:',error.message);$('#scene').hidden=true;$('.scene-fallback').hidden=false;document.body.dataset.scene='fallback';}

// Deterministic public tour uses the same interface and controls as a visitor.
if(new URLSearchParams(location.search).has('tour')&&!reduced){
  setTimeout(()=>{
    const start=performance.now();const endStory=$('.scroll-story').offsetHeight-innerHeight;
    function tour(now){const s=(now-start)/1000;
      if(s<4)window.scrollTo({top:0,behavior:"instant"});
      else if(s<11)window.scrollTo({top:(s-4)/7*endStory,behavior:"instant"});
      else if(s<14)window.scrollTo({top:endStory+(s-11)/3*(($('#menu').offsetTop-endStory)),behavior:'instant'});
      else if(s<17){window.scrollTo({top:$('#menu').offsetTop+60,behavior:'instant'});preview(drinks[3]);}
      else if(s<21){if(!dialog.open)openOrder(drinks[3]);}
      else if(s<24){if(!$('#order-form').hidden)$('#order-form').requestSubmit();}
      if(s<25)requestAnimationFrame(tour);
    }requestAnimationFrame(tour);
  },1400);
}
