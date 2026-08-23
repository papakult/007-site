/* ============ WEBGL FLOATING CLOUD ============ */
const TILE_FILES=[
'assets/cloud/tile-001.jpg',
'assets/cloud/tile-002.jpg',
'assets/cloud/tile-003.jpg',
'assets/cloud/tile-004.jpg',
'assets/cloud/tile-005.jpg',
'assets/cloud/tile-006.jpg',
'assets/cloud/tile-007.jpg',
'assets/cloud/tile-008.jpg',
'assets/cloud/tile-009.jpg',
'assets/cloud/tile-010.jpg',
'assets/cloud/tile-011.jpg',
'assets/cloud/tile-012.jpg',
'assets/cloud/tile-013.jpg',
'assets/cloud/tile-014.jpg',
'assets/cloud/tile-015.jpg',
'assets/cloud/tile-016.jpg',
'assets/cloud/tile-017.jpg',
'assets/cloud/tile-018.jpg',
'assets/cloud/tile-019.jpg',
'assets/cloud/tile-020.jpg',
'assets/cloud/tile-021.jpg',
'assets/cloud/tile-022.jpg',
'assets/cloud/tile-023.jpg',
'assets/cloud/tile-024.jpg',
'assets/cloud/tile-025.jpg',
'assets/cloud/tile-026.jpg',
'assets/cloud/tile-027.jpg',
'assets/cloud/tile-028.jpg',
'assets/cloud/tile-029.jpg',
'assets/cloud/tile-030.jpg',
'assets/cloud/tile-031.jpg',
'assets/cloud/tile-032.jpg',
'assets/cloud/tile-033.jpg',
'assets/cloud/tile-034.jpg',
'assets/cloud/tile-035.jpg',
'assets/cloud/tile-036.jpg',
'assets/cloud/tile-037.jpg',
'assets/cloud/tile-038.jpg',
'assets/cloud/tile-039.jpg',
'assets/cloud/tile-040.jpg',
'assets/cloud/tile-041.jpg',
'assets/cloud/tile-042.jpg',
'assets/cloud/tile-043.jpg',
'assets/cloud/tile-044.jpg',
'assets/cloud/tile-045.jpg',
'assets/cloud/tile-046.jpg',
'assets/cloud/tile-047.jpg',
'assets/cloud/tile-048.jpg',
'assets/cloud/tile-049.jpg',
'assets/cloud/tile-050.jpg',
'assets/cloud/tile-051.jpg',
'assets/cloud/tile-052.jpg',
'assets/cloud/tile-053.jpg',
'assets/cloud/tile-054.jpg',
'assets/cloud/tile-055.jpg',
'assets/cloud/tile-056.jpg',
'assets/cloud/tile-057.jpg',
'assets/cloud/tile-058.jpg',
'assets/cloud/tile-059.jpg',
'assets/cloud/tile-060.jpg',
'assets/cloud/tile-061.jpg',
'assets/cloud/tile-062.jpg',
'assets/cloud/tile-063.jpg',
'assets/cloud/tile-064.jpg',
'assets/cloud/tile-065.jpg',
'assets/cloud/tile-066.jpg',
'assets/cloud/tile-067.jpg',
'assets/cloud/tile-068.jpg',
'assets/cloud/tile-069.jpg',
'assets/cloud/tile-070.jpg',
'assets/cloud/tile-071.jpg',
'assets/cloud/tile-072.jpg',
'assets/cloud/tile-073.jpg',
'assets/cloud/tile-074.jpg',
'assets/cloud/tile-075.jpg',
'assets/cloud/tile-076.jpg',
'assets/cloud/tile-077.jpg',
'assets/cloud/tile-078.jpg',
'assets/cloud/tile-079.jpg',
'assets/cloud/tile-080.jpg',
'assets/cloud/tile-081.jpg',
'assets/cloud/tile-082.jpg',
'assets/cloud/tile-083.jpg',
'assets/cloud/tile-084.jpg',
'assets/cloud/tile-085.jpg',
'assets/cloud/tile-086.jpg',
'assets/cloud/tile-087.jpg',
'assets/cloud/tile-088.jpg',
'assets/cloud/tile-089.jpg',
'assets/cloud/tile-090.jpg',
'assets/cloud/tile-091.jpg',
'assets/cloud/tile-092.jpg',
'assets/cloud/tile-093.jpg',
'assets/cloud/tile-094.jpg',
'assets/cloud/tile-095.jpg',
'assets/cloud/tile-096.jpg',
'assets/cloud/tile-097.jpg',
'assets/cloud/tile-098.jpg',
'assets/cloud/tile-099.jpg',
'assets/cloud/tile-100.jpg',
'assets/cloud/tile-101.jpg',
'assets/cloud/tile-102.jpg',
'assets/cloud/tile-103.jpg',
'assets/cloud/tile-104.jpg',
'assets/cloud/tile-105.jpg',
'assets/cloud/tile-106.jpg',
'assets/cloud/tile-107.jpg',
'assets/cloud/tile-108.jpg',
'assets/cloud/tile-109.jpg',
'assets/cloud/tile-110.jpg',
'assets/cloud/tile-111.jpg',
'assets/cloud/tile-112.jpg',
'assets/cloud/tile-113.jpg',
'assets/cloud/tile-114.jpg',
'assets/cloud/tile-115.jpg',
'assets/cloud/tile-116.jpg',
'assets/cloud/tile-117.jpg',
'assets/cloud/tile-118.jpg',
'assets/cloud/tile-119.jpg',
'assets/cloud/tile-120.jpg',
'assets/cloud/tile-121.jpg',
'assets/cloud/tile-122.jpg',
'assets/cloud/tile-123.jpg',
'assets/cloud/tile-124.jpg',
'assets/cloud/tile-125.jpg',
'assets/cloud/tile-126.jpg',
'assets/cloud/tile-127.jpg',
'assets/cloud/tile-128.jpg'
];
const MY_SITES=[
'assets/cloud/tile-129.jpg',
'assets/cloud/tile-130.jpg',
'assets/cloud/tile-131.jpg',
'assets/cloud/tile-132.jpg',
'assets/cloud/tile-133.jpg',
'assets/cloud/tile-134.jpg',
'assets/cloud/tile-135.jpg'
];
const CAT_SITES=[
'assets/cloud/tile-136.jpg',
'assets/cloud/tile-137.jpg',
'assets/cloud/tile-138.jpg',
'assets/cloud/tile-139.jpg',
'assets/cloud/tile-140.jpg',
'assets/cloud/tile-141.jpg',
'assets/cloud/tile-142.jpg',
'assets/cloud/tile-143.jpg',
'assets/cloud/tile-144.jpg',
'assets/cloud/tile-145.jpg'
];
const AUTOS=[
'assets/cloud/tile-146.jpg',
'assets/cloud/tile-147.jpg',
'assets/cloud/tile-148.jpg',
'assets/cloud/tile-149.jpg',
'assets/cloud/tile-150.jpg',
'assets/cloud/tile-151.jpg',
'assets/cloud/tile-152.jpg',
'assets/cloud/tile-153.jpg',
'assets/cloud/tile-154.jpg',
'assets/cloud/tile-155.jpg'
];
const RESTOS=[
'assets/cloud/tile-156.jpg',
'assets/cloud/tile-157.jpg',
'assets/cloud/tile-158.jpg',
'assets/cloud/tile-159.jpg',
'assets/cloud/tile-160.jpg',
'assets/cloud/tile-161.jpg',
'assets/cloud/tile-162.jpg',
'assets/cloud/tile-163.jpg',
'assets/cloud/tile-164.jpg',
'assets/cloud/tile-165.jpg'
];
const REALTY=[
'assets/cloud/tile-166.jpg',
'assets/cloud/tile-167.jpg',
'assets/cloud/tile-168.jpg',
'assets/cloud/tile-169.jpg',
'assets/cloud/tile-170.jpg',
'assets/cloud/tile-171.jpg',
'assets/cloud/tile-172.jpg',
'assets/cloud/tile-173.jpg',
'assets/cloud/tile-174.jpg',
'assets/cloud/tile-175.jpg'
];
const prefersReducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobileViewport=window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
if(!CSS.supports('height','100dvh')){
  const setStableScreenHeight=()=>{
    const height=Math.round(window.visualViewport?.height||window.innerHeight);
    document.documentElement.style.setProperty('--screen-h',`${height}px`);
  };
  setStableScreenHeight();
  addEventListener('orientationchange',()=>setTimeout(setStableScreenHeight,300),{passive:true});
}
let scene,camera,renderer,cloudGroup,planes=[],mouseX=0,mouseY=0,tMouseX=0,tMouseY=0,rafId;
let threePromise;
function loadThree(){
  if(window.THREE)return Promise.resolve();
  if(!threePromise)threePromise=new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src='assets/js/three.min.js';script.onload=resolve;script.onerror=reject;
    document.head.appendChild(script);
  });
  return threePromise;
}
function initCloud(){
  const canvas=document.getElementById('cloud-canvas');
  if(isMobileViewport||prefersReducedMotion){buildCSSFallback();return;}
  // WebGL support check + fallback
  let gl=null;
  try{gl=canvas.getContext('webgl',{failIfMajorPerformanceCaveat:false})||canvas.getContext('experimental-webgl',{failIfMajorPerformanceCaveat:false});}catch(e){}
  if(!gl||typeof THREE==='undefined'){buildCSSFallback();return;}
  scene=new THREE.Scene();
  scene.fog=new THREE.FogExp2(0x000000,0.032);
  camera=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,0.1,100);
  camera.position.z=17;
  renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
  renderer.setSize(innerWidth,innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  cloudGroup=new THREE.Group();scene.add(cloudGroup);

  const loader=new THREE.TextureLoader();
  function addTile(src,opt){
    const tex=loader.load(src);tex.minFilter=THREE.LinearFilter;
    const w=opt.w,h=w*10/16;
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex,transparent:true,opacity:0}));
    mesh.position.set(opt.px,opt.py,opt.pz);
    mesh.rotation.x=opt.rx;mesh.rotation.y=opt.ry;mesh.rotation.z=opt.rz;
    mesh.userData={baseOpacity:opt.op,floatSpeed:0.12+Math.random()*0.26,floatPhase:Math.random()*Math.PI*2,
      baseRX:opt.rx,baseRY:opt.ry,baseRZ:opt.rz,
      swayAmp:opt.sway,swaySpeed:0.25+Math.random()*0.4,
      spin:opt.spin||0,spinPhase:Math.random()*Math.PI*2,spinSpeed:0.22+Math.random()*0.32,
      orbit:opt.orbit||0,basePX:opt.px,basePY:opt.py,
      depth:opt.pz,parallax:opt.par,hero:opt.hero||false};
    cloudGroup.add(mesh);planes.push(mesh);
  }
  // place a group of tiles on a ring "line" at a given depth band
  function placeLine(list,{zBase,zSpread,ringR,ringV,w,op,sway,spin,orbit,par,hero,angOff,squashY}){
    list.forEach((src,k)=>{
      const ang=(k/list.length)*Math.PI*2 + (angOff||0) + (Math.random()-0.5)*0.15;
      const r=ringR + (Math.random()-0.5)*ringV;
      let px=Math.cos(ang)*r;
      let py=Math.sin(ang)*r*(squashY||0.5) + (Math.random()-0.5)*3;
      let pz=zBase + Math.random()*zSpread;
      // keep clear-ish center for nearest lines
      addTile(src,{px,py,pz,w,op,
        rx:(Math.random()-0.5)*0.3,
        ry:(px>0?-1:1)*(0.1+Math.random()*0.22),
        rz:(Math.random()-0.5)*0.1,
        sway,spin,orbit,par,hero});
    });
  }

  // ===== 5 DEPTH LINES (near -> far) =====
  // LINE 1 (nearest): premium AUTO dealerships — biggest, most active
  placeLine(AUTOS,{zBase:6,zSpread:2.5,ringR:14,ringV:3,w:6.6,op:0.99,sway:0.11,spin:0.14,orbit:0.8,par:2.2,hero:true,angOff:0.2,squashY:0.55});
  // LINE 2: RESTAURANTS
  placeLine(RESTOS,{zBase:0,zSpread:3,ringR:17,ringV:3,w:6.0,op:0.96,sway:0.10,spin:0.12,orbit:0.7,par:1.9,hero:true,angOff:0.9,squashY:0.55});
  // LINE 3: REAL ESTATE
  placeLine(REALTY,{zBase:-7,zSpread:3.5,ringR:20,ringV:3.5,w:5.6,op:0.9,sway:0.09,spin:0.10,orbit:0.6,par:1.5,hero:true,angOff:1.6,squashY:0.55});
  // LINE 4: user's REAL works (pushed back) — macesta included here now, deepest of the "real" band
  const myWorks=[5,4,6,3,1,2,0].map(si=>MY_SITES[si]); // priority order, macesta last
  placeLine(myWorks,{zBase:-15,zSpread:4,ringR:24,ringV:4,w:5.0,op:0.82,sway:0.08,spin:0.07,orbit:0.5,par:1.1,hero:true,angOff:2.4,squashY:0.5});
  // LINE 5 (farthest): generated background mockups — many, small, dim
  const N=96;
  for(let i=0;i<N;i++){
    let px,py,dist2d;
    do{px=(Math.random()-0.5)*56;py=(Math.random()-0.5)*34;dist2d=Math.sqrt(px*px+py*py);}while(dist2d<7);
    const pz=-24-Math.random()*40;
    addTile(TILE_FILES[i%TILE_FILES.length],{px,py,pz,w:4.0,op:0.42+Math.random()*0.22,
      rx:(Math.random()-0.5)*0.7,ry:(Math.random()-0.5)*0.9,rz:(Math.random()-0.5)*0.25,
      sway:0.05+Math.random()*0.10,spin:0,orbit:0,par:0.4});
  }
  // fade tiles in
  planes.forEach((p,i)=>{
    gsap.to(p.material,{opacity:p.userData.baseOpacity,duration:1.6,delay:0.4+i*0.02,ease:'power2.out'});
  });
  addEventListener('mousemove',e=>{tMouseX=(e.clientX/innerWidth-0.5);tMouseY=(e.clientY/innerHeight-0.5);});addEventListener('touchmove',e=>{if(e.touches&&e.touches[0]){tMouseX=(e.touches[0].clientX/innerWidth-0.5);tMouseY=(e.touches[0].clientY/innerHeight-0.5);}},{passive:true});addEventListener('touchstart',e=>{if(e.touches&&e.touches[0]){tMouseX=(e.touches[0].clientX/innerWidth-0.5);tMouseY=(e.touches[0].clientY/innerHeight-0.5);}},{passive:true});
  addEventListener('resize',onResize);
  animate();
}
function onResize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);}
const clk={t:0};
function animate(){
  rafId=requestAnimationFrame(animate);
  clk.t+=0.01;
  mouseX+=(tMouseX-mouseX)*0.09;
  mouseY+=(tMouseY-mouseY)*0.09;
  // cloud gently follows cursor (parallax rotation)
  cloudGroup.rotation.y+=0.0006 + mouseX*0.010;
  cloudGroup.rotation.x+=(-mouseY*0.45 - cloudGroup.rotation.x)*0.04;
  // camera drifts toward cursor
  camera.position.x+=(mouseX*5.5 - camera.position.x)*0.05;
  camera.position.y+=(-mouseY*3.5 - camera.position.y)*0.05;
  camera.lookAt(0,0,-2);
  // each tile floats AND tilts under its own angle; near tiles parallax more
  planes.forEach(p=>{
    const u=p.userData;
    const s=Math.sin(clk.t*u.swaySpeed+u.floatPhase);
    const s2=Math.cos(clk.t*u.swaySpeed*0.7+u.floatPhase);
    // gentle vertical bob
    p.position.y+=Math.sin(clk.t*u.floatSpeed+u.floatPhase)*0.0022;
    // angular sway around base tilt
    let ry=u.baseRY + s2*u.swayAmp + (mouseX*0.16*u.parallax);
    // HERO tiles: partial rotation around own Y axis + positional orbit (more 3D-active)
    if(u.hero){
      ry += (u.spin||0)*Math.sin(clk.t*(u.spinSpeed||0.3)+ (u.spinPhase||0)); // partial spin around own axis
      if(u.basePX!==undefined){
        p.position.x = u.basePX + Math.sin(clk.t*0.25+u.floatPhase)*(u.orbit||0.5);
        p.position.y = u.basePY + Math.cos(clk.t*0.2+u.floatPhase)*(u.orbit||0.5)*0.7;
      }
    }
    p.rotation.x=u.baseRX + s*u.swayAmp + (-mouseY*0.12*u.parallax);
    p.rotation.y=ry;
    p.rotation.z=u.baseRZ + s*u.swayAmp*0.4;
  });
  renderer.render(scene,camera);
}

function buildCSSFallback(){
  if(document.getElementById('css-cloud'))return;
  const host=document.createElement('div');host.id='css-cloud';host.className='on';
  const hero=document.getElementById('hero-cloud');hero.insertBefore(host,hero.firstChild);
  const fallbackTiles=TILE_FILES.slice(0,prefersReducedMotion?6:(isMobileViewport?12:24));
  fallbackTiles.forEach((src,i)=>{
    for(let k=0;k<1;k++){
      const img=document.createElement('img');img.className='ct';img.src=src;
      img.loading='lazy';img.decoding='async';
      img.style.left=(Math.random()*88)+'%';img.style.top=(Math.random()*80)+'%';
      img.style.transform='scale('+(0.7+Math.random()*0.8)+') rotate('+((Math.random()-0.5)*8)+'deg)';
      img.style.animationDelay=(0.3+Math.random()*1.2)+'s';
      host.appendChild(img);
    }
  });
  if(isMobileViewport||prefersReducedMotion)return;
  // subtle cursor parallax
  function moveHost(cx,cy){const x=(cx/innerWidth-0.5),y=(cy/innerHeight-0.5);host.style.transform='translate('+(-x*20)+'px,'+(-y*20)+'px)';}
  addEventListener('mousemove',e=>{moveHost(e.clientX,e.clientY);});
}
/* ============ LENIS + GSAP ============ */
const isTouchDevice=('ontouchstart' in window)||navigator.maxTouchPoints>0;
const lenis=!isTouchDevice?new Lenis({smoothWheel:false,syncTouch:false,duration:0.55,easing:t=>t<0.5?2*t*t:1-Math.pow(-2*t+2,2)/2}):null;
function raf(t){lenis&&lenis.raf(t);requestAnimationFrame(raf)}requestAnimationFrame(raf);
gsap.ticker.add(t=>{if(lenis)lenis.raf(t*1000)});gsap.ticker.lagSmoothing(0);
gsap.registerPlugin(ScrollTrigger);
if(lenis)lenis.stop();

const amb=document.getElementById('amb');
const gate=document.getElementById('gate');
let entered=false,soundOn=false;
function enterSite(withSound){
  if(entered)return;entered=true;
  setTimeout(()=>{if(gate.style.display!=='none')gate.style.display='none';},3000);
  if(withSound){amb.volume=0;amb.play().then(()=>{gsap.to(amb,{volume:.5,duration:2});document.getElementById('sound').classList.add('playing');document.getElementById('sound-label').textContent='Звук вкл';soundOn=true;}).catch(()=>{});}
  gate.classList.add('closing');setTimeout(()=>{gate.style.display='none'},1000);
  const ir=document.getElementById('iris');ir.style.display='block';
  gsap.fromTo(ir,{clipPath:'circle(0% at 50% 50%)'},{clipPath:'circle(150% at 50% 50%)',duration:1.2,ease:'power3.inOut',onComplete(){ir.style.display='none';document.documentElement.classList.add('snapping')}});
  if(lenis)lenis.start();
  if(isMobileViewport||prefersReducedMotion){initCloud();}
  else loadThree().then(initCloud).catch(()=>buildCSSFallback());
  gsap.to('.hero-name',{opacity:1,duration:1.6,delay:1,ease:'power2.out'});
  gsap.to('.hero-role',{opacity:1,duration:1.2,delay:1.5,ease:'power2.out'});
  gsap.to('.hero-tag',{opacity:1,duration:1.2,delay:1.9,ease:'power2.out'});
}
gate.addEventListener('click',e=>{if(e.target.id!=='without')enterSite(true)});
gate.addEventListener('touchend',e=>{e.preventDefault();if(e.target.id!=='without')enterSite(true)},{passive:false});
document.getElementById('without').addEventListener('click',e=>{e.stopPropagation();enterSite(false)});
document.getElementById('without').addEventListener('touchend',e=>{e.preventDefault();e.stopPropagation();enterSite(false)},{passive:false});

const c=document.querySelector('.cur'),cr=document.querySelector('.cur-r');
if(window.matchMedia('(pointer:fine)').matches){
  let mx=0,my=0,rx=0,ry=0;
  addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;c.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`});
  (function r(){rx+=(mx-rx)*.13;ry+=(my-ry)*.13;cr.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;requestAnimationFrame(r)})();
  document.querySelectorAll('a,.cap-item,.final-btn,#sound,#gate').forEach(el=>{
    el.addEventListener('mouseenter',()=>cr.classList.add('on'));
    el.addEventListener('mouseleave',()=>cr.classList.remove('on'));
  });
}else document.body.style.cursor='auto';

document.querySelectorAll('[data-split]').forEach(h=>{
  const words=h.textContent.trim().split(' ');
  h.innerHTML=words.map(w=>`<span class="w">${w}</span>`).join(' ');
});
document.querySelectorAll('.statement h2 .w').forEach(w=>{const t=w.textContent;if(t==='работа.'||t==='ограничение.'){w.innerHTML=`<em>${t}</em>`}});
document.querySelectorAll('.statement').forEach(sec=>{
  gsap.to(sec.querySelector('.eyebrow'),{opacity:1,duration:.8,scrollTrigger:{trigger:sec,start:'top 60%'}});
  gsap.to(sec.querySelectorAll('.w'),{opacity:1,y:0,duration:.7,stagger:.05,ease:'power2.out',scrollTrigger:{trigger:sec,start:'top 55%'}});
});
gsap.from('.cap-item',{opacity:0,y:30,duration:.9,stagger:.12,ease:'power3.out',scrollTrigger:{trigger:'.cap-list',start:'top 70%'}});

// STATS counters
function countUp(el){
  if(!el.dataset.to)return;
  const to=+el.dataset.to, suf=el.dataset.suf||'', dur=1700, t0=performance.now();
  function step(t){const p=Math.min(1,(t-t0)/dur);const e=1-Math.pow(1-p,3);
    el.innerHTML=Math.round(to*e)+(p>=1&&suf?`<span class="s">${suf}</span>`:'');
    if(p<1)requestAnimationFrame(step);}
  requestAnimationFrame(step);
}
gsap.to('#s-stats .eyebrow',{opacity:1,duration:.8,scrollTrigger:{trigger:'#s-stats',start:'top 60%'}});
gsap.to('#s-stats .stat',{opacity:1,y:0,duration:.8,stagger:.15,ease:'power3.out',scrollTrigger:{trigger:'#s-stats',start:'top 58%'}});
gsap.to('#s-stats .stats-line',{opacity:1,duration:1,delay:.3,scrollTrigger:{trigger:'#s-stats',start:'top 55%'}});
ScrollTrigger.create({trigger:'#s-stats',start:'top 58%',once:true,onEnter(){document.querySelectorAll('#s-stats .stat-num').forEach((el,i)=>setTimeout(()=>countUp(el),i*150));}});
gsap.from('.cap-eyebrow',{opacity:0,y:20,duration:.8,scrollTrigger:{trigger:'.cap-list',start:'top 75%'}});
gsap.to('.final-eyebrow',{opacity:1,duration:.8,scrollTrigger:{trigger:'#final',start:'top 55%'}});
gsap.from('.final-big',{opacity:0,y:30,duration:1,scrollTrigger:{trigger:'#final',start:'top 55%'}});
gsap.from('.final-sub, .final-btn, .final-meta',{opacity:0,y:20,duration:.8,stagger:.1,scrollTrigger:{trigger:'#final',start:'top 50%'}});
if(window.matchMedia('(pointer:fine)').matches){
  document.querySelectorAll('.scene video').forEach(v=>{gsap.to(v,{yPercent:12,ease:'none',scrollTrigger:{trigger:v.parentElement,start:'top bottom',end:'bottom top',scrub:true}})});
}

const scenes=[...document.querySelectorAll('.snap')];

/* ============ FULLPAGE PAGER ============ */
// Index of current visible section
let currentIdx=0;
let pageScrollLocked=false;
const PAGE_LOCK_MS=600; // lock duration after each page jump

// Determine which section is most in view
function getVisibleIdx(){
  let best=0,bestRatio=0;
  scenes.forEach((s,i)=>{
    const r=s.getBoundingClientRect();
    const vis=Math.max(0,Math.min(r.bottom,window.innerHeight)-Math.max(r.top,0));
    const ratio=vis/window.innerHeight;
    if(ratio>bestRatio){bestRatio=ratio;best=i;}
  });
  return best;
}

function goToPage(idx){
  if(pageScrollLocked)return;
  if(idx<0)idx=0;
  if(idx>=scenes.length)idx=scenes.length-1;
  if(idx===currentIdx&&Math.abs(scenes[idx].getBoundingClientRect().top)<5)return;
  pageScrollLocked=true;
  currentIdx=idx;
  // On touch devices use instant snap; on desktop use lenis if available
  if(lenis){
    lenis.scrollTo(scenes[idx],{duration:0.55,easing:t=>t<0.5?2*t*t:1-Math.pow(-2*t+2,2)/2,lock:false,offset:0});
  } else {
    scenes[idx].scrollIntoView({behavior:'smooth',block:'start'});
  }
  setTimeout(()=>{pageScrollLocked=false;},PAGE_LOCK_MS);
}

// Wheel: one event = one page
let wheelAcc=0,wheelTimer=null;
window.addEventListener('wheel',e=>{
  e.preventDefault();
  if(pageScrollLocked)return;
  wheelAcc+=e.deltaY;
  clearTimeout(wheelTimer);
  wheelTimer=setTimeout(()=>{
    const dir=wheelAcc>0?1:-1;
    wheelAcc=0;
    currentIdx=getVisibleIdx();
    goToPage(currentIdx+dir);
  },40);
},{passive:false});

// Touch devices use the browser's native scroll-snap. Avoid competing scripted
// page jumps when mobile browser chrome changes the visual viewport height.

/* ============ VIDEO LAZY LOAD + PLAY/PAUSE ============ */
// Preload video source one screen-height early, before its section is actually visible,
// so it has time to buffer on mobile before the user scrolls/snaps into it.
const vidPreloadObs=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    const vid=entry.target;
    if(entry.isIntersecting&&vid.dataset.src&&!vid.src){
      if(vid.dataset.poster)vid.poster=vid.dataset.poster;
      vid.src=isMobileViewport&&vid.dataset.mobileSrc?vid.dataset.mobileSrc:vid.dataset.src;
      vid.load();
    }
  });
},{rootMargin:isMobileViewport?'0px':'75% 0px',threshold:0.01});

// Only play/pause video when its section actually enters viewport
const vidObs=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    const vid=entry.target;
    if(entry.isIntersecting){
      if(vid.dataset.src&&!vid.src){
        if(vid.dataset.poster)vid.poster=vid.dataset.poster;
        vid.src=isMobileViewport&&vid.dataset.mobileSrc?vid.dataset.mobileSrc:vid.dataset.src;
        vid.load();
      }
      if(!prefersReducedMotion)vid.play().catch(()=>{});
    } else {
      vid.pause();
    }
  });
},{threshold:0.3});

document.querySelectorAll('video[data-src]').forEach(v=>{vidPreloadObs.observe(v);vidObs.observe(v);});

document.addEventListener('visibilitychange',()=>{
  if(document.hidden){
    document.querySelectorAll('video').forEach(video=>video.pause());
    if(rafId)cancelAnimationFrame(rafId);
    rafId=0;
  }else if(renderer&&!rafId){
    animate();
  }
});

// smooth, gentle reveal for each scene as it enters
scenes.forEach((s)=>{
  if(s.id==='hero-cloud')return; // hero handled separately
  const inner=s.querySelector('.inner')||s.querySelector('.cap-wrap');
  gsap.set(s,{opacity:0});
  gsap.to(s,{opacity:1,duration:0.6,ease:'power2.out',
    scrollTrigger:{trigger:s,start:'top 82%',end:'top 45%',scrub:0.3}});
  if(inner){
    gsap.fromTo(inner,{opacity:0,y:isMobileViewport?0:18},{opacity:1,y:0,duration:0.7,ease:'power2.out',
      scrollTrigger:{trigger:s,start:'top 72%'}});
  }
});
function flashIris(){/* disabled — replaced by smooth fades */}

const sBtn=document.getElementById('sound'),sLabel=document.getElementById('sound-label');
sBtn.addEventListener('click',()=>{if(!soundOn){amb.play().then(()=>{soundOn=true;sBtn.classList.add('playing');sLabel.textContent='Звук вкл';gsap.to(amb,{volume:.5,duration:1.5})}).catch(()=>{});}else{gsap.to(amb,{volume:0,duration:1,onComplete(){amb.pause()}});soundOn=false;sBtn.classList.remove('playing');sLabel.textContent='Звук выкл';}});

function tick(){document.getElementById('clock').textContent='MSK '+new Date().toLocaleTimeString('ru-RU',{timeZone:'Europe/Moscow',hour:'2-digit',minute:'2-digit'})}
tick();setInterval(tick,30000);

/* Yandex Metrika loads only after an explicit analytics choice. */
const cookieNote=document.getElementById('cookie-note');
function loadMetrika(){
  if(window.__metrikaLoaded)return;
  window.__metrikaLoaded=true;
  (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(let j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r)return;}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a);})(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=111869181','ym');
  ym(111869181,'init',{ssr:true,webvisor:true,clickmap:true,ecommerce:'dataLayer',referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});
}
const analyticsChoice=localStorage.getItem('007a_analytics_consent');
if(analyticsChoice==='accepted')loadMetrika();
else if(!analyticsChoice)cookieNote.classList.add('show');
document.getElementById('cookie-accept').addEventListener('click',()=>{localStorage.setItem('007a_analytics_consent','accepted');cookieNote.classList.remove('show');loadMetrika();});
document.getElementById('cookie-reject').addEventListener('click',()=>{localStorage.setItem('007a_analytics_consent','rejected');cookieNote.classList.remove('show');});

/* Explicit contact goals. Goal names are mirrored in the counter. */
document.addEventListener('click',event=>{
  const link=event.target.closest('a');
  if(!link||typeof window.ym!=='function')return;
  let goal='';
  if(link.href.includes('t.me/'))goal='contact_telegram';
  else if(link.href.includes('wa.me/'))goal='contact_whatsapp';
  else if(link.protocol==='mailto:')goal='contact_email';
  if(goal)ym(111869181,'reachGoal',goal,{placement:'final'});
});
