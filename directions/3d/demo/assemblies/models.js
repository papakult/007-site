import {BoxGeometry,CanvasTexture,CylinderGeometry,ExtrudeGeometry,Group,Mesh,MeshBasicMaterial,MeshStandardMaterial,PlaneGeometry,Quaternion,Shape,SphereGeometry,SRGBColorSpace,TorusGeometry,Vector3} from '../../engine.js';
const PI = Math.PI;
const materials = {};
for (const [name,color,metalness,roughness] of [
  ['frame',0x263443,.65,.32],['ivory',0xcbd7df,.28,.36],['dark',0x141d28,.35,.44],
  ['aluminium',0xa3b5c5,.81,.29],['chrome',0xcbdce6,.93,.22],['bronze',0xc38b4b,.73,.31],
  ['orange',0xe69d4e,.35,.34],['black',0x141a22,.08,.53],['green',0x155e52,.29,.43],
  ['darkGreen',0x0c3d35,.25,.48],['copper',0xc58b46,.74,.36],['red',0x963e45,.16,.44],
  ['blue',0x3565a0,.3,.37],['ceramic',0xd5b691,.1,.63],['mark',0x526476,.18,.65],
]) materials[name] = new MeshStandardMaterial({color,metalness,roughness});
materials.glass = new MeshStandardMaterial({color:0x6fa6bd,metalness:.04,roughness:.14,transparent:true,opacity:.27,depthWrite:false});
materials.light = new MeshBasicMaterial({color:0x93eaff});
materials.signal = new MeshBasicMaterial({color:0x69ecce});
materials.warning = new MeshBasicMaterial({color:0xffab5a});

function part(parent,x=0,y=0,z=0) {
  const group = new Group();
  group.position.set(x,y,z);
  parent.add(group);
  return group;
}
function shape(parent,geometry,material,x,y,z) {
  const item = new Mesh(geometry,materials[material] || material);
  item.position.set(x,y,z);
  parent.add(item);
  return item;
}
const box = (g,m,x,y,z,w,h,d) => shape(g,new BoxGeometry(w,h,d),m,x,y,z);
function cylinder(g,m,x,y,z,r,h,axis='y',sides=30,top=r) {
  const item = shape(g,new CylinderGeometry(top,r,h,sides),m,x,y,z);
  if(axis==='z') item.rotation.x=PI/2;
  if(axis==='x') item.rotation.z=PI/2;
  return item;
}
function torus(g,m,x,y,z,r,thickness,axis='y') {
  const item = shape(g,new TorusGeometry(r,thickness,8,36),m,x,y,z);
  if(axis==='y') item.rotation.x=PI/2;
  if(axis==='x') item.rotation.y=PI/2;
  return item;
}
function plate(g,m,x,y,z,w,h,d,r=.06,axis='z') {
  const p=new Shape(), X=w/2, Y=h/2;
  p.moveTo(-X+r,-Y);
  p.lineTo(X-r,-Y);p.quadraticCurveTo(X,-Y,X,-Y+r);
  p.lineTo(X,Y-r);p.quadraticCurveTo(X,Y,X-r,Y);
  p.lineTo(-X+r,Y);p.quadraticCurveTo(-X,Y,-X,Y-r);
  p.lineTo(-X,-Y+r);p.quadraticCurveTo(-X,-Y,-X+r,-Y);
  const geo=new ExtrudeGeometry(p,{depth:d,curveSegments:7,bevelEnabled:true,bevelSegments:2,bevelSize:.009,bevelThickness:.009});
  geo.translate(0,0,-d/2);
  const item=shape(g,geo,m,x,y,z);
  if(axis==='y') item.rotation.x=-PI/2;
  if(axis==='x') item.rotation.y=PI/2;
  return item;
}
function rod(g,m,start,end,r) {
  const a=new Vector3(...start),b=new Vector3(...end),v=b.clone().sub(a);
  const item=cylinder(g,m,...a.add(b).multiplyScalar(.5).toArray(),r,v.length(),'y',12);
  item.quaternion.setFromUnitVectors(new Vector3(0,1,0),v.normalize());
  return item;
}
function wire(g,m,points,r) {
  points.slice(1).forEach((p,i)=>rod(g,m,points[i],p,r));
  points.slice(1,-1).forEach(p=>shape(g,new SphereGeometry(r,10,7),m,...p));
}
function screw(g,x,y,z,axis='y',r=.04) {
  const head=part(g,x,y,z);
  if(axis==='z') head.rotation.x=PI/2;
  if(axis==='x') head.rotation.z=-PI/2;
  cylinder(head,'chrome',0,0,0,r,.018,'y',12);
  box(head,'dark',0,.01,0,r*.8,.003,r*.17);
  box(head,'dark',0,.01,0,r*.17,.003,r*.8);
  return head;
}
function label(g,value,x,y,z,w,h,axis='z',color='#a0c2d4') {
  const surface=document.createElement('canvas');surface.width=512;surface.height=128;
  const ctx=surface.getContext('2d');ctx.fillStyle=color;
  ctx.font='600 72px Arial';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText(value,256,67,480);
  const texture=new CanvasTexture(surface);texture.colorSpace=SRGBColorSpace;
  const item=shape(g,new PlaneGeometry(w,h),new MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}),x,y,z);
  if(axis==='y') item.rotation.x=-PI/2;
  return item;
}
function linear(a,b,t){return a+(b-a)*t;}
function ease(t){return t*t*(3-2*t);}
function between(value,lo,hi){return ease(Math.max(0,Math.min(1,(value-lo)/(hi-lo))));}
function camera(target,distance,eye){return {target,distance,eye};}

function makeCnc() {
  const root=new Group();
  const casting=part(root), cabinet=part(root), leftDoor=part(root), rightDoor=part(root);
  const gantry=part(root), head=part(gantry), spindle=part(head), tray=part(root), tools=part(root);
  const control=part(root), sideModule=part(root);
  plate(casting,'frame',0,.24,0,5.35,3.38,.45,.13,'y');
  plate(casting,'ivory',0,.54,0,5.30,3.29,.13,.12,'y');
  plate(casting,'dark',-.06,.37,1.66,3.80,.38,.055,.08);
  for (const x of [-2.26,2.26]) for(const z of [-1.20,1.20]){
    cylinder(casting,'black',x,.08,z,.22,.16,'y',24);
    cylinder(casting,'aluminium',x,.21,z,.11,.19,'y',12);
  }
  box(cabinet,'frame',-.45,2.13,-1.53,4.15,3.08,.14);
  for(const x of [-2.40,1.49]){
    plate(cabinet,'ivory',x,2.13,-.12,2.80,3.07,.12,.09,'x');
    box(cabinet,'frame',x,2.14,1.33,.20,3.11,.17);
    box(cabinet,'dark',x,2.23,-.78,.15,1.65,.045);
  }
  plate(cabinet,'ivory',-.46,3.67,-.06,4.16,2.97,.14,.12,'y');
  plate(cabinet,'frame',-.46,3.42,1.36,4.00,.39,.16,.06);
  box(cabinet,'orange',-.48,3.31,1.466,3.82,.045,.033);
  label(cabinet,'VMC  ·  07',-.68,3.47,1.457,1.8,.28,'z','#d5e6ef');
  for(const z of [-1.1,-.5,.1,.7]){
    box(cabinet,'frame',-.35,3.755,z,2.78,.025,.026);
  }
  box(cabinet,'frame',-.46,.78,1.35,4.04,.34,.22);
  box(cabinet,'chrome',-.46,.96,1.45,4.02,.047,.095);
  for (const [d,x] of [[leftDoor,-1.47],[rightDoor,.54]]){
    d.position.x=x;
    for(const y of [1.00,3.20]) plate(d,'frame',0,y,1.44,1.99,.22,.10,.05);
    for(const dx of [-.925,.925]) box(d,'frame',dx,2.1,1.44,.145,2.14,.10);
    plate(d,'glass',0,2.11,1.44,1.74,1.98,.035,.12);
    plate(d,'ivory',0,1.22,1.505,1.91,.46,.055,.055);
    const edge=x<0?.72:-.72;
    for(const y of [1.64,2.02]) cylinder(d,'chrome',edge,y,1.59,.043,.18,'z',14);
    cylinder(d,'aluminium',edge,1.83,1.69,.056,.46,'y',18);
    for(const dx of [-.77,.77]) for(const y of [1.54,3.06]) screw(d,dx,y,1.506,'z',.031);
  }

  box(gantry,'frame',-.48,2.57,-1.13,3.59,.66,.52);
  for(const y of [2.34,2.77]){
    box(gantry,'chrome',-.48,y,-.82,3.58,.078,.105);
    for(let i=0;i<15;i++) screw(gantry,-2.11+i*.23,y,-.754,'z',.025);
  }
  box(head,'aluminium',-.48,2.49,-.51,.98,.75,.54);
  box(head,'frame',-.48,2.62,-.14,.73,.87,.55);
  for(const x of [-.81,-.15]) box(head,'chrome',x,2.47,.16,.048,.67,.052);
  plate(spindle,'aluminium',-.48,2.18,.25,.69,.88,.71,.10);
  plate(spindle,'frame',-.48,2.56,.28,.69,.20,.67,.06);
  cylinder(spindle,'chrome',-.48,1.65,.30,.205,.32,'y',32);
  cylinder(spindle,'bronze',-.48,1.43,.30,.146,.19,'y',24,.188);
  const cutter=part(spindle,-.48,0,.30);
  cylinder(cutter,'chrome',0,1.26,0,.068,.22,'y',20,.085);
  for(let i=0;i<14;i++){
    const a=i*.35,b=(i+1)*.35;
    rod(cutter,'dark',[Math.cos(a)*.068,1.17+i*.012,Math.sin(a)*.068],[Math.cos(b)*.068,1.182+i*.012,Math.sin(b)*.068],.011);
  }
  wire(head,'orange',[[-.09,2.79,.14],[.04,3.00,.09],[.04,3.00,-.63],[-.10,2.82,-.77]],.029);
  box(tray,'dark',-.47,.77,.03,3.78,.28,2.53);
  plate(tray,'aluminium',-.47,.99,.20,2.86,1.73,.28,.09,'y');
  for(let i=0;i<9;i++) box(tray,'dark',-.47,1.144,-.49+i*.17,2.74,.024,.047);
  for(const x of [-.88,-.11]){
    box(tray,'frame',x,1.22,.31,.28,.20,.52);
    box(tray,'chrome',x,1.34,.31,.26,.07,.55);
  }
  plate(tray,'bronze',-.49,1.29,.31,.65,.45,.21,.045,'y');
  for(const [x,z] of [[-.73,.20],[-.26,.20],[-.73,.42],[-.26,.42]]) torus(tray,'dark',x,1.409,z,.052,.012);
  for(const x of [-1.96,1.00]) box(tray,'chrome',x,.96,.05,.08,.076,2.24);

  const changer=part(tools,.90,2.47,-.56);
  cylinder(changer,'dark',0,0,0,.49,.16,'y',40);
  cylinder(changer,'aluminium',0,.10,0,.41,.12,'y',40);
  for(let i=0;i<8;i++){
    const a=i*PI/4,x=Math.cos(a)*.35,z=Math.sin(a)*.35;
    cylinder(changer,'frame',x,-.105,z,.078,.11);
    cylinder(changer,'bronze',x,-.19,z,.068,.08,'y',16,.082);
    cylinder(changer,'chrome',x,-.29,z,.027+(i%3)*.006,.14+(i%3)*.035,'y',14);
  }
  label(changer,'MAGAZINE',0,.168,0,.61,.15,'y','#283947');

  plate(sideModule,'frame',2.07,1.98,-.32,2.17,2.75,.93,.10,'x');
  for(let i=0;i<12;i++) box(sideModule,'dark',2.555,2.70-i*.115,-.31,.035,.039,1.28);
  plate(sideModule,'ivory',2.07,3.39,-.30,1.00,2.16,.095,.10,'y');
  for(const y of [1.08,3.06]) screw(sideModule,2.566,y,.52,'x',.045);
  plate(control,'frame',2.05,2.45,1.47,.89,1.28,.29,.08);
  plate(control,'dark',2.05,2.69,1.637,.68,.47,.024,.035);
  plate(control,'blue',2.05,2.69,1.661,.57,.36,.013,.025);
  for(let i=0;i<4;i++){
    box(control,'light',1.90,2.78-i*.058,1.68,.17,.012,.01);
    box(control,'dark',2.15,2.78-i*.058,1.68,.19,.012,.01);
  }
  for(let j=0;j<4;j++) for(let i=0;i<5;i++) box(control,i===0?'mark':'aluminium',1.77+i*.124,2.37-j*.078,1.642,.075,.04,.044);
  cylinder(control,'red',2.33,2.00,1.681,.105,.09,'z',20);
  torus(control,'orange',2.33,2.00,1.652,.113,.019,'z');
  cylinder(control,'signal',1.79,2.03,1.665,.036,.044,'z',16);
  for (const [y,m] of [[3.60,'signal'],[3.75,'warning'],[3.90,'red']]) cylinder(sideModule,m,2.14,y,-.75,.085,.14,'y',24);
  cylinder(sideModule,'dark',2.14,3.48,-.75,.09,.09);

  const stages=[
    {title:'Общий вид',short:'Как выглядит станок в сборе',text:'Закрытый корпус, прозрачные двери и панель оператора',view:camera([0,1.96,0],10.6,[.75,.44,1]),p:0},
    {title:'Открыть двери',short:'Что внутри рабочей зоны',text:'Двери раздвигаются. За ними видны стол, шпиндель и заготовка',view:camera([-.42,1.93,.25],7.0,[.19,.33,1]),p:.37},
    {title:'Запустить шпиндель',short:'Как инструмент подходит к детали',text:'Шпиндель перемещается над столом, фреза вращается. Ход показан условно',view:camera([-.48,1.83,.31],4.55,[.34,.48,1]),p:.53,motion:true},
    {title:'Разобрать узлы',short:'Из чего состоит станок',text:'Отдельно видны кожух, направляющие, магазин инструмента и блок управления',view:camera([-.08,1.92,.12],10.1,[.72,.52,1]),p:1},
  ];
  let progress=0, running=false, elapsed=0;
  function pose(p){
    progress=p;
    const doors=between(p,0,.40),split=between(p,.52,1);
    leftDoor.position.set(-1.47-doors*1.25,0,.17*split);
    rightDoor.position.set(.54+doors*1.25,0,.17*split);
    cabinet.position.set(0,.39*split,-.77*split);
    sideModule.position.x=.77*split;
    control.position.x=.85*split;
    control.position.z=.37*split;
    tools.position.set(.30*split,.35*split,-.39*split);
    tray.position.z=.40*split;
    gantry.position.y=.31*split;
    if(!running){head.position.x=0;spindle.position.y=.43;}
    spindle.position.z=.32*split;
  }
  function setRunning(value){running=value;elapsed=0;pose(progress);}
  function motion(dt){
    elapsed+=dt;head.position.x=Math.sin(elapsed*1.53)*.32;
    spindle.position.y=.43-(.5+.5*Math.sin(elapsed*1.35-PI/2))*.13;
    cutter.rotation.y+=dt*9;
  }
  return {root,eye:[.75,.44,1],stages,pose,setRunning,motion};
}

function makeElectronics(){
  const root=new Group(), caseBottom=part(root), pcb=part(root), cover=part(root), hardware=part(root);
  const connectors=part(pcb), logic=part(pcb), power=part(pcb), cooling=part(pcb);
  const signalGroup=part(pcb);
  const y=.39;
  plate(caseBottom,'frame',0,.16,0,4.68,3.08,.25,.13,'y');
  for(const x of [-2.22,2.22]){
    plate(caseBottom,'frame',x,.55,0,2.93,.78,.16,.085,'x');
    for(const z of [-1.41,1.41]){
      cylinder(caseBottom,'aluminium',x*.91,.30,z*.87,.10,.27,'y',18);
      plate(caseBottom,'frame',x,.11,z, .57,.27,.09,.065,'y');
    }
  }
  plate(caseBottom,'frame',0,.55,-1.43,4.38,.76,.12,.08);
  plate(caseBottom,'aluminium',0,.31,1.43,4.38,.26,.12,.06);
  plate(caseBottom,'aluminium',0,.80,1.43,4.38,.19,.12,.06);
  for(const x of [-2.02,-.83,.12,1.02,1.91]) box(caseBottom,'aluminium',x,.56,1.43,.14,.40,.13);
  for(let i=0;i<7;i++) box(caseBottom,'dark',.90+i*.13,.46,-1.502,.051,.21,.018);
  for(const x of [-2.12,2.12]) for(const z of [-1.34,1.34]) screw(hardware,x,1.035,z,'y',.052);

  cover.position.y=.20;
  plate(cover,'aluminium',0,.76,0,4.64,3.06,.126,.15,'y');
  plate(cover,'dark',.03,.841,-.55,3.38,1.35,.021,.10,'y');
  plate(cover,'frame',0,.845,.79,3.58,.54,.027,.08,'y');
  label(cover,'07-A   /   CONTROL',-.05,.867,.76,2.9,.30,'y','#dce8ee');
  label(cover,'ПРОМЫШЛЕННЫЙ МОДУЛЬ',0,.858,-.46,2.75,.30,'y','#aac7d3');
  for(const x of [-1.8,-1.56,-1.32]) cylinder(cover,x===-1.8?'signal':'mark',x,.866,1.18,.032,.020);
  for(let i=0;i<13;i++) box(cover,'dark',.09+i*.129,.836,-1.19,.056,.017,.17);

  plate(pcb,'darkGreen',0,y,0,4.14,2.57,.080,.085,'y');
  plate(pcb,'green',0,y+.043,0,4.10,2.53,.012,.085,'y');
  const top=y+.061;
  for(const x of [-1.9,1.9]) for(const z of [-1.09,1.09]){
    torus(pcb,'copper',x,top,z,.075,.014);
    screw(pcb,x,top+.012,z,'y',.045);
  }
  const tracks=[
    [[-1.64,.85],[-1.35,.85],[-1.02,.51],[-.64,.51]],
    [[-.70,.47],[-.62,.39],[-.25,.39],[.12,.02],[.45,.02]],
    [[.53,.23],[.90,.23],[1.22,.56],[1.72,.56]],
    [[.42,-.38],[.59,-.55],[1.02,-.55],[1.24,-.77],[1.68,-.77]],
    [[.10,-.35],[-.09,-.53],[-.35,-.53],[-.63,-.82],[-1.49,-.82]],
  ];
  function trace(group,m,coords,zShift=0,width=.014){
    coords.slice(1).forEach(([bx,bz],i)=>{
      const [ax,az]=coords[i],dx=bx-ax,dz=bz-az;
      const tile=box(group,m,(ax+bx)/2,top+.006,(az+bz)/2+zShift,Math.hypot(dx,dz)+.018,.007,width);
      tile.rotation.y=-Math.atan2(dz,dx);
    });
  }
  for(const coords of tracks) for(let k=-3;k<=3;k++) trace(pcb,'copper',coords,k*.037);
  for(const coords of tracks.slice(0,4)) trace(signalGroup,'signal',coords,0,.039);
  signalGroup.visible=false;
  for(let i=0;i<44;i++){
    const x=-1.82+(i%11)*.33,z=-1.08+Math.floor(i/11)*.72;
    cylinder(pcb,'copper',x,top+.007,z,.019,.009,'y',12);
    cylinder(pcb,'darkGreen',x,top+.013,z,.008,.008,'y',10);
  }
  function chip(g,x,z,w,d,count,name){
    const py=top+.08;
    plate(g,'black',x,py,z,w,d,.118,.035,'y');
    for(const side of [-1,1]) for(let i=0;i<count;i++){
      const k=(i-(count-1)/2)/(count+1);
      box(g,'chrome',x+k*w,top+.036,z+side*(d/2+.036),.028,.026,.090);
      box(g,'chrome',x+side*(w/2+.036),top+.036,z+k*d,.090,.026,.028);
    }
    label(g,name,x,py+.070,z,w*.91,d*.48,'y','#b7cbd1');
    cylinder(g,'mark',x-w*.34,py+.069,z-d*.35,.027,.009,'y',12);
  }
  chip(logic,.26,-.07,.82,.73,11,'MCU 07');
  chip(logic,1.32,-.18,.40,.33,6,'ETH');
  chip(logic,-.10,-.91,.41,.21,5,'MEM');
  chip(logic,.56,.76,.42,.30,6,'I/O');
  for(const [x,z] of [[-.40,-.25],[-.14,.35],[.25,-.68],[.81,-.58],[.89,.33],[1.29,.49],[-.44,-.67]]){
    for(let j=0;j<4;j++){
      box(logic,'chrome',x+j*.069,top+.028,z,.057,.043,.081);
      box(logic,j%2?'ceramic':'black',x+j*.069,top+.057,z,.032,.030,.081);
    }
  }
  for(const [x,z] of [[-1.43,-.62],[-1.09,-.62],[-1.40,-.25]]){
    cylinder(power,'blue',x,top+.21,z,.115,.40,'y',24);
    cylinder(power,'aluminium',x,top+.42,z,.105,.018,'y',24);
    box(power,'mark',x,top+.431,z,.097,.003,.011);
    box(power,'mark',x,top+.431,z,.011,.003,.097);
  }
  plate(power,'dark',-1.22,top+.12,.36,.46,.38,.22,.05,'y');
  torus(power,'copper',-1.22,top+.264,.36,.127,.048);
  for(let i=0;i<13;i++){
    const t=i*PI*2/13;
    rod(power,'bronze',[-1.22+.104*Math.cos(t),top+.27,.36+.104*Math.sin(t)],[-1.22+.17*Math.cos(t),top+.28,.36+.17*Math.sin(t)],.020);
  }
  for(const x of [-.83,-.66]){
    plate(power,'black',x,top+.102,.65,.115,.19,.19,.020,'y');
    box(power,'aluminium',x,top+.202,.63,.092,.020,.11);
  }

  plate(cooling,'aluminium',-.75,top+.18,-.94,.66,.34,.11,.028,'y');
  for(let i=0;i<10;i++) box(cooling,'aluminium',-1.05+i*.067,top+.29,-.94,.033,.24,.34);
  for(const [x,w,m] of [[-1.35,.84,'green'],[-.31,.59,'dark'],[.55,.63,'aluminium'],[1.45,.53,'frame']]){
    plate(connectors,m,x,top+.115,1.21,w,.33,.23,.035);
    box(connectors,'black',x,top+.115,1.342,w*.77,.16,.025);
    const pins=m==='green'?6:5;
    for(let j=0;j<pins;j++){
      const pos=x+(j-(pins-1)/2)*(w*.72/pins);
      box(connectors,'bronze',pos,top+.09,1.362,.032,.044,.028);
    }
  }
  for(let i=0;i<4;i++){
    const z=.55+i*.085;
    wire(connectors,i%2?'red':'orange',[[-1.53,top+.14,1.08],[-1.54-i*.09,top+.22,.93],[-1.60-i*.06,top+.15,z],[-1.32,top+.09,z]],.022);
  }
  for(const [text,x,z,w] of [['24V',-1.60,.94,.35],['INPUT',-.78,.92,.45],['I/O',.59,.98,.30],['ETH',1.52,.97,.34]]){
    label(pcb,text,x,top+.011,z,w,.17,'y','#d9e4ca');
  }
  const stages=[
    {title:'Общий вид',short:'Корпус и подключения',text:'Алюминиевый корпус и клеммы промышленного блока управления',view:camera([0,.38,0],9.6,[.68,.71,1]),p:0},
    {title:'Снять крышку',short:'Что находится внутри блока',text:'Крышка отводится в сторону. Видны плата, клеммы и питание',view:camera([.62,.57,-.02],9.0,[.40,1,1]),p:.44},
    {title:'Рассмотреть плату',short:'Чип, контакты и дорожки',text:'Крупный план процессора, памяти, разъёмов и дорожек на плате',view:camera([.16,.73,.02],4.45,[.27,1,.62]),p:.72},
    {title:'Показать сигнал',short:'Как связаны вход, чип и выход',text:'Подсветка условно показывает путь от входа к процессору и выходу',view:camera([.03,.75,.18],5.22,[.21,1,.64]),p:.88,signal:true},
  ];
  let progress=0, elapsed=0;
  function pose(p){
    progress=p;
    const open=between(p,0,.48),lift=between(p,.34,.82),split=between(p,.62,1);
    const away=between(p,.45,.69);
    cover.position.set(2.85*open+3.25*away,.20+.76*open,-.56*open-1.80*away);
    cover.rotation.z=-.23*open;
    hardware.position.y=.72*open;
    hardware.position.x=.42*open;
    pcb.position.y=.41*lift;
    cooling.position.set(-.30*split,.19*split,-.11*split);
  }
  function setRunning(value){signalGroup.visible=value;elapsed=0;pose(progress);}
  function motion(dt){
    elapsed+=dt;
    const count=signalGroup.children.length;
    signalGroup.children.forEach((piece,i)=>piece.visible=i/count <= ((elapsed*.45)%1));
  }
  return {root,eye:[.68,.71,1],stages,pose,setRunning,motion};
}

export {part,box,cylinder,torus,plate,rod,wire,screw,label,shape,materials,makeCnc,makeElectronics};
