import {Group, Vector3, MeshStandardMaterial, MeshBasicMaterial, SphereGeometry} from '../../engine.js';
import {part,box,cylinder,torus,plate,rod,wire,screw,label,shape,materials,makeCnc,makeElectronics} from './models.js';
import {catalog} from '../../catalog-models.js?v=details-28';
const PI=Math.PI;
const red=0xca4b46, amber=0xefa951, cyan=0x67b8ce;
const tint=c=>new MeshStandardMaterial({color:c,metalness:.29,roughness:.39});
const steel=materials.aluminium, dark=materials.frame, copper=materials.bronze, clear=materials.glass;
const cold=tint(cyan), hot=tint(red), accent=tint(amber);
const rubber=tint(0x282f39), skin=tint(0x91a4ad);
const ss=(p,a,b)=>{let t=Math.max(0,Math.min(1,(p-a)/(b-a)));return t*t*(3-2*t);};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const cam=(target,distance,eye=[.72,.44,1])=>({target,distance,eye});
const deck=(g,w,d)=>{plate(g,dark,0,.20,0,w,d,.28,.09,'y');for(const x of [-w*.44,w*.44])for(const z of [-d*.38,d*.38])cylinder(g,rubber,x,.07,z,.12,.15);};
function rectangle(g,m,x,y,z,w,h,r=.05,opening=true){
  if(!opening)return plate(g,m,x,y,z,w,h,r,.06);
  for(const sx of [-1,1]) box(g,m,x+sx*(w-r)/2,y,z,r,h,r);
  for(const sy of [-1,1]) box(g,m,x,y+sy*(h-r)/2,z,w,r,r);
}
function coverFrame(g,w,h,d,y=1.4){
  rectangle(g,dark,0,y,d/2,w,h,.085);
  for(const x of [-w/2,w/2]){box(g,steel,x,y,0,.075,h,d);box(g,dark,x,y,d/2,.09,h,.11);}
  plate(g,skin,0,y+h/2,0,w,d,.08,.09,'y');
  plate(g,clear,0,y,d/2-.015,w-.16,h-.16,.030,.05);
}
function feet(g,xs,zs,h,m=dark){
 for(const x of xs)for(const z of zs){box(g,m,x,h/2,z,.105,h,.10);plate(g,steel,x,.06,z,.23,.20,.05,.02,'y');}
}
function circuit(g,x,y,z,amp=1){
 const b=part(g,x,y,z);b.scale.setScalar(amp);
 plate(b,materials.green,0,0,0,.78,.55,.055,.04,'y');
 for(let k=0;k<9;k++)box(b,copper,-.29+k*.07,.031,.13,.015,.008,.23);
 plate(b,materials.black,0,.062,0,.24,.23,.060,.03,'y');
 for(let j=0;j<4;j++)for(const side of [-1,1])box(b,steel,(j-1.5)*.044,.043,side*.13,.019,.02,.07);
 for(const xx of [-.28,.28]) cylinder(b,cold,xx,.09,-.12,.045,.14);
 return b;
}
function packaging(kind){
 const root=new Group(), body=part(root), guard=part(root), tool=part(root), flow=part(root);
 const width=kind==='line'||kind==='bottle'?5.0:2.58, dep=1.9;
 deck(body,width,dep);
 if(kind==='line'||kind==='bottle'){
  const bottles=kind==='bottle';
  plate(body,steel,0,1.03,0,width-.3,1.20,.15,.08,'y');
  feet(body,[-2.10,0,2.10],[-.62,.62],1.02);
  box(body,rubber,0,1.15,0,width-.40,.12,.70);
  for(let i=0;i<22;i++) cylinder(body,steel,-2.14+i*.202,1.16,0,.056,.72,'z',14);
  for(const x of [-1.55,0,1.55]){
   const cover=part(guard,x,0,0);coverFrame(cover,1.46,1.10,1.41,1.79);
   cylinder(tool,cold,x,2.12,0,.14,.52);
   cylinder(tool,steel,x,1.80,0,.075,.33,'y',24,.13);
   plate(body,dark,x,2.38,-.69,.37,.22,.10,.04);
  }
  const trays=Array.from({length:8},(_,i)=>{
   const tray=part(flow,-2.05+i*.59,1.26,0);
   if(bottles){
    cylinder(tray,skin,0,.15,0,.12,.30,'y',20,.11);
    cylinder(tray,skin,0,.337,0,.083,.09,'y',20,.048);
    cylinder(tray,cold,0,.396,0,.049,.046,'y',18);
    cylinder(tray,cold,0,.17,0,.125,.11,'y',20);
   }else{
    plate(tray,copper,0,0,0,.41,.56,.06,.04,'y');
    for(const z of [-.15,.15]) cylinder(tray,cold,0,.057,z,.094,.062,'y',16,.121);
   }
   return tray;
  });
  const pose=(p,t=0)=>{
   guard.position.set(0,.78*p,-.47*p);
   tool.position.y=-.22*ss(p,.28,.60)*(1+.21*Math.sin(t*4));
   trays.forEach((tray,i)=>tray.position.x=-2.15+((i*.59+t*.42*ss(p,.36,.62))%4.55));
  };
  return {root,pose,views:[cam([0,1.35,0],10.6),cam([0,1.58,0],8.7,[.32,.43,1]),cam([.05,1.69,0],5.6,[.35,.55,1])]};
 }
 box(body,dark,0,1.66,-.70,1.99,2.58,.29);
 feet(body,[-.89,.89],[-.63,.64],2.7);
 plate(body,steel,0,2.91,0,2.19,1.70,.11,.06,'y');
 coverFrame(guard,2.12,2.49,1.48,1.68);
 const roll=part(tool,0,2.51,-.19);
 cylinder(roll,copper,0,0,0,.30,1.21,'x');
 for(const x of [-.68,.68]) cylinder(roll,dark,x,0,0,.20,.11,'x');
 for(const y of [2.19,1.88]) cylinder(tool,steel,0,y,.17,.067,1.16,'x',24);
 cylinder(tool,cold,0,1.63,.23,.23,.37,'y',28,.39);
 cylinder(tool,steel,0,1.33,.23,.17,.24,'y',28);
 const jawA=part(tool,0,1.08,.23),jawB=part(tool,0,1.08,.23);
 box(jawA,accent,0,0,.23,.91,.092,.13);box(jawB,accent,0,0,-.23,.91,.092,.13);
 const pouch=part(flow,0,1.05,.23);
 plate(pouch,cold,0,-.14,0,.54,.44,.095,.09);
 box(pouch,copper,0,.02,.05,.55,.042,.025);box(pouch,copper,0,-.32,.05,.55,.04,.025);
 const film=plate(flow,new MeshStandardMaterial({color:cyan,metalness:.13,roughness:.30,transparent:true,opacity:.42}),0,1.94,.28,.74,.52,.025,.04);
 const pose=(p,t=0)=>{
  guard.position.set(2.42*p,.23*p,-.50*p);
  roll.rotation.x=t*1.25*ss(p,.28,.58);
  const close=.12*(.5+.5*Math.sin(t*3.7))*ss(p,.30,.57);
  jawA.position.z=.23-close;jawB.position.z=.23+close;
  pouch.position.y=1.15-(t*.26% .52)*ss(p,.39,.65);
  film.rotation.x=-.36;
 };
 return {root,pose,views:[cam([0,1.47,0],8.6),cam([.07,1.62,0],7.2),cam([-.02,1.34,.20],4.5,[.14,.25,1])]};
}

function conveyor(spiral){
 const root=new Group(), base=part(root), rail=part(root), load=part(root);
 deck(base,spiral?3.47:5.15,spiral?2.85:1.67);
 const R=1.18, turns=spiral?2.28:1, step=spiral?90:25;
 const guide=q=>spiral?[R*Math.cos(q*2*PI*turns),.65+q*2.15,R*Math.sin(q*2*PI*turns)]:[-2.36+q*4.72,1.23,0];
 if(spiral){
  for(const x of [-.73,.73])for(const z of [-.73,.73]) box(base,dark,x,1.55,z,.10,2.93,.10);
  cylinder(base,steel,0,1.63,0,.13,2.88);
 }else feet(base,[-2.02,-.65,.65,2.02],[-.57,.57],1.16);
 let a=guide(0);
 for(let i=1;i<=step;i++){
  const b=guide(i/step), q=(i-.5)/step;
  const mid=guide(q),angle=spiral?q*PI*2*turns:PI/2;
  const out=[Math.cos(angle),0,Math.sin(angle)];
  const sleeper=box(rail,i%3===0?steel:rubber,mid[0],mid[1],mid[2],.68,.075,spiral?.245:.185);
  sleeper.rotation.y=-angle;
  for(const side of [-1,1]){
   const aa=spiral?[a[0]*(1+.29*side),a[1]+.08,a[2]*(1+.29*side)]:[a[0],a[1]+.08,side*.39];
   const bb=spiral?[b[0]*(1+.29*side),b[1]+.08,b[2]*(1+.29*side)]:[b[0],b[1]+.08,side*.39];
   rod(rail,steel,aa,bb,.028);
  }
  a=b;
 }
 const parcels=Array.from({length:5},(_,i)=>{
  const b=part(load);plate(b,i%2?accent:skin,0,0,0,.27,.23,.18,.02);
  box(b,copper,0,.116,0,.047,.008,.18);return b;
 });
 const pose=(p,t=0)=>{
  const d=ss(p,.24,.78);
  rail.position.y=.17*d;
  parcels.forEach((b,i)=>{
   const q=((i*.192+t*.075*d)% .98)+.01;
   const v=guide(q);b.position.set(v[0],v[1]+.17+.17*d,v[2]);
   b.rotation.y=spiral?-q*PI*2*turns:0;
  });
 };
 return {root,pose,views:[cam([0,spiral?1.54:.84,0],spiral?9.4:10.4),cam([0,spiral?1.62:1.10,0],7.4),cam([spiral?.54:1.0,spiral?1.53:1.29,.42],spiral?5.5:4.8,[.35,.52,1])]};
}

function robotCell(){
 const root=new Group(), station=part(root), casing=part(root), base=part(root,-1.25,.38,.25), arm=part(base);
 deck(station,5.05,2.64);
 plate(station,dark,1.03,1.03,-.36,1.92,1.55,.58,.08,'y');
 coverFrame(casing,1.78,1.81,1.52,1.89);
 casing.position.set(1.05,0,-.30);
 plate(station,steel,1.00,1.41,.10,1.49,1.12,.17,.08,'y');
 for(let i=0;i<7;i++)box(station,dark,1,1.504,-.30+i*.14,1.44,.022,.031);
 cylinder(base,dark,0,.23,0,.46,.44);cylinder(arm,accent,0,.49,0,.31,.22);
 const shoulder=part(arm,0,.69,0), elbow=part(shoulder,0,1.13,0);
 const wrist=part(elbow,0,.85,0);
 for(const [p,l] of [[shoulder,1.13],[elbow,.85]]){
  plate(p,accent,0,l*.48,0,.26,l,.26,.08);
  cylinder(p,dark,0,.08,0,.18,.33,'z',24);
  cylinder(p,steel,0,.08,.18,.115,.035,'z',24);
 }
 box(wrist,dark,0,.11,0,.34,.18,.28);
 const fingers=[-.16,.16].map(x=>box(wrist,steel,x,.30,0,.062,.26,.14));
 const blank=plate(wrist,copper,0,.45,0,.25,.21,.13,.035);
 const pose=(p,t=0)=>{
  casing.position.x=1.05+.90*p;
  const reach=ss(p,.24,.80)*(.57+.43*Math.sin(t*1.6));
  shoulder.rotation.z=-.38-.47*reach;elbow.rotation.z=-1.08-.37*reach;
  wrist.rotation.z=.82;fingers[0].position.x=-.16+.035*reach;fingers[1].position.x=.16-.035*reach;
  blank.visible=true;
 };
 return {root,pose,views:[cam([0,1.36,0],10.6),cam([-.02,1.46,.03],8.1),cam([.07,1.56,.29],5.6,[.26,.40,1])]};
}

function workMachine(kind){
 const root=new Group(), main=part(root), guard=part(root), beam=part(root), cutter=part(beam), focus=part(root);
 const wide=kind==='laser'||kind==='laseropen', edm=kind==='edm', width=wide?4.72:2.93, depth=wide?2.70:1.90;
 deck(main,width,depth);
 box(main,dark,0,.88,-depth*.37,width-.12,1.15,.33);
 feet(main,[-width*.43,width*.43],[-depth*.42,depth*.42],1.0);
 plate(main,steel,0,1.04,0,width-.22,depth-.2,.18,.07,'y');
 if(edm){
  for(const x of [-.88,.88]) box(main,steel,x,1.32,0,.08,.54,1.37);
  for(const z of [-.68,.68]) box(main,steel,0,1.32,z,1.83,.54,.075);
  plate(main,new MeshStandardMaterial({color:0x2c8294,transparent:true,opacity:.43,roughness:.25}),0,1.30,0,1.68,1.22,.027,.05,'y');
  plate(main,copper,0,1.39,0,.56,.42,.19,.04,'y');
 }else{
  for(let i=0;i<(wide?19:9);i++)box(main,dark,(-width*.44)+(wide?.22:.28)*i,1.16,0,.064,.10,depth-.27);
  plate(main,wide?steel:copper,0,1.25,0,width*(wide?.71:.48),depth*(wide?.63:.46),.068,.075,'y');
 }
 if(kind!=='laseropen')coverFrame(guard,width,wide?1.28:1.85,depth-.03,wide?1.81:2.04);
 box(beam,steel,0,wide?1.82:2.43,0,width-.26,.24,.21);
 box(beam,dark,0,wide?1.67:2.30,.06,width-.31,.07,.11);
 plate(cutter,dark,0,wide?1.67:2.17,.21,.51,.51,.37,.065);
 cylinder(cutter,copper,0,wide?1.40:1.83,.21,.109,.18,'y',18,edm?.105:.16);
 cylinder(cutter,edm?copper:steel,0,wide?1.31:1.64,.21,edm?.135:.048,edm?.28:.15,'y',16);
 const spot=cylinder(focus,new MeshBasicMaterial({color:0xffbc54}),0,1.29,.21,.045,.01);
 const pose=(p,t=0)=>{
  guard.position.x=(width*.94)*p;guard.position.z=-.73*p;
  const run=ss(p,.32,.62);
  cutter.position.x=(edm?0:Math.sin(t*1.34)*width*.24*run);
  beam.position.z=(edm?0:Math.sin(t*.80)*depth*.23*run);
  cutter.position.y=edm?-.18*run*(.5+.5*Math.sin(t*2.1)):0;
  spot.visible=!edm&&run>.40;spot.position.set(cutter.position.x,1.29,beam.position.z+.21);
 };
 return {root,pose,views:[cam([0,1.39,0],wide?10.8:8.9),cam([0,1.58,.02],7.0),cam([-.1,1.47,.22],4.55,[.42,.55,1])]};
}

function compressor(){
 const root=new Group(), base=part(root), drive=part(root), block=part(root), panels=part(root), pistons=part(block);
 deck(base,4.83,2.20);
 for(const x of [-1.76,1.70])for(const z of [-.72,.72])box(base,steel,x,.37,z,.50,.24,.27);
 cylinder(drive,dark,-1.42,1.0,0,.46,1.14,'x');
 for(let i=0;i<12;i++) torus(drive,steel,-1.93+i*.092,1,0,.46,.021,'x');
 cylinder(drive,steel,-.71,1.0,0,.13,.46,'x');
 cylinder(drive,copper,-.37,1,0,.30,.19,'x');
 box(block,dark,.87,.81,0,1.78,.74,1.28);
 for(const x of [.33,1.20]){
  cylinder(block,steel,x,1.28,0,.37,.48);
  for(let k=0;k<6;k++)torus(block,dark,x,1.14+k*.071,0,.365,.022);
  cylinder(block,steel,x,1.60,0,.28,.14);
 }
 for(const x of [.33,1.20]){
  const piston=part(pistons,x,.91,.52);
  cylinder(piston,copper,0,.26,0,.20,.18);
  rod(piston,steel,[0,.18,0],[.10,-.24,0],.047);
  cylinder(piston,steel,.10,-.23,0,.13,.10,'z');
 }
 plate(panels,skin,.83,1.03,.70,1.79,1.09,.14,.065);
 for(const x of [.08,1.58])for(const y of [.60,1.44])screw(panels,x,y,.785,'z',.049);
 wire(base,hot,[[.33,1.68,0],[.33,1.96,0],[1.94,1.96,0],[1.94,1.14,0],[2.12,1.14,.43]],.068);
 wire(base,cold,[[1.2,1.58,-.2],[1.2,1.77,-.62],[.05,1.77,-.62],[-.12,1.24,-.62]],.057);
 for(const x of [1.94,.33]){
  cylinder(base,steel,x,1.96,0,.115,.061,'x',16);
 }
 const pose=(p,t=0)=>{
  panels.position.set(1.84*p,.62*p,.34*p);
  drive.position.x=-.52*p;
  block.position.x=.16*p;
  pistons.position.z=.23*p;
  pistons.children.forEach((piston,i)=>piston.position.y=.91+Math.sin(t*5+i*PI)*.113*ss(p,.28,.65));
 };
 return {root,pose,views:[cam([0,1.02,0],10),cam([.34,1.02,.05],8.3),cam([.73,1.13,.35],5.05,[.22,.37,1])]};
}
function exchanger(){
 const root=new Group(), frame=part(root), stack=part(root), front=part(root), rear=part(root);
 deck(frame,3.12,2.50);
 for(const x of [-1.13,1.13])box(frame,dark,x,1.42,0,.16,2.56,.28);
 for(const y of [.66,2.35]) box(frame,steel,0,y,0,2.37,.12,.18);
 const sheets=[];
 for(let k=0;k<13;k++){
  const v=part(stack,0,1.48,-.38+k*.062);
  plate(v,k%2?steel:skin,0,0,0,1.64,1.65,.040,.11);
  for(let j=-3;j<=3;j++){
   const x=j*.19;
   rod(v,k%2?cold:hot,[x,-.55,.034],[x+.11,0,.034],.018);
   rod(v,k%2?cold:hot,[x+.11,0,.034],[x,.55,.034],.018);
  }
  for(const x of [-.60,.60])for(const y of [-.62,.62])torus(v,steel,x,y,.028,.077,.015,'z');
  sheets.push(v);
 }
 plate(front,dark,0,1.48,.49,1.90,1.87,.21,.11);
 plate(rear,dark,0,1.48,-.48,1.90,1.87,.21,.11);
 for(const x of [-.61,.61])for(const y of [.90,2.05]){
  cylinder(front,x<0?cold:hot,x,y,.67,.118,.25,'z',24);
  torus(front,steel,x,y,.80,.105,.026,'z');
 }
 for(const x of [-.96,.96])for(const y of [.90,1.48,2.08]){
  cylinder(frame,steel,x,y,0,.041,1.56,'z',12);
  cylinder(front,steel,x,y,.64,.072,.061,'z',6);
 }
 const pose=p=>{
  front.position.set(1.56*p,.35*p,.70*p);rear.position.z=-.55*p;
  sheets.forEach((v,k)=>{v.position.z=(-.38+k*.062)*(1+2.25*p);v.position.x=(k-6)*.078*p;});
 };
 return {root,pose,views:[cam([0,1.36,0],8.1),cam([0,1.44,0],7.2),cam([.02,1.49,.28],4.55,[.79,.41,1])]};
}
function platformLadder(){
 const root=new Group(), stair=part(root,0,2.06,.15), back=part(root,0,2.06,.15), top=part(root);
 for(const x of [-.34,.34]){
  box(stair,steel,x,-1.02,0,.072,2.13,.087);
  box(back,steel,x,-1.02,0,.075,2.14,.082);
  box(stair,dark,x,-2.08,0,.13,.08,.15);
  box(back,dark,x,-2.08,0,.13,.08,.15);
  cylinder(top,copper,x,2.07,.15,.10,.12,'x',18);
  for(const z of [-.20,.42])rod(top,steel,[x,2.07,z],[x,2.80,z],.029);
  rod(top,steel,[x,2.80,-.20],[x,2.80,.42],.029);
 }
 for(let j=0;j<7;j++){
  const y=-.26-j*.25;
  plate(stair,steel,0,y,.045,.66,.22,.061,.025,'y');
  for(const z of [-.05,0,.06])box(stair,dark,0,y+.034,z,.58,.009,.012);
 }
 for(const y of [-1.76,-.78])box(back,steel,0,y,0,.67,.07,.07);
 plate(top,dark,0,2.055,.13,.78,.70,.10,.06,'y');
 plate(top,steel,0,2.113,.13,.70,.61,.019,.04,'y');
 for(const x of [-.18,0,.18])box(top,dark,x,2.129,.13,.029,.01,.52);
 const pose=p=>{stair.rotation.x=-.27-.14*p;back.rotation.x=.13+.37*p;};
 return {root,pose,views:[cam([0,1.37,0],7.5),cam([0,1.43,0],7.0),cam([0,2.01,.16],4.0,[.62,.31,1])]};
}

function structure(kind,variant=0){
 const root=new Group(), columns=part(root), truss=part(root), roof=part(root), sides=part(root), bolts=part(root);
 const gazebo=kind==='gazebo',pergola=kind==='pergola',arch=kind==='arch',fabric=kind==='tent',garage=kind==='garage',clad=kind==='tile';
 const w=gazebo?3.20:4.50,d=gazebo?2.75:3.15,H=2.17;
 const W=w/2,D=d/2;
 const frame=tint(pergola?0x454c52:0x394858), finish=tint(clad?0x854745:arch?0x7b9da7:fabric?0xbba784:0x8296a3);
 const archH=x=>H+.59*(1-(x/W)**2);
 const gable=x=>H+.64*(1-Math.abs(x/W));
 const roofHeight=x=>pergola||garage?H+.15:arch||fabric?archH(x):gable(x);
 const n=gazebo?2:3;
 const zs=Array.from({length:n},(_,i)=>-D+i*d/(n-1));
 feet(columns,[-W,W],zs,H,frame);
 for(const z of zs){
  box(truss,frame,0,H,z,w,.10,.11);
  for(let i=0;i<7;i++){
   const x1=-W+i*w/7,x2=-W+(i+1)*w/7;
   rod(truss,steel,[x1,roofHeight(x1),z],[x2,roofHeight(x2),z],.055);
   if(!pergola&&i>0&&i<6)
    rod(truss,frame,[x1,H,z],[x2,roofHeight(x2),z],.030);
  }
 }
 for(const x of [-W,0,W])box(truss,frame,x,roofHeight(x)-.05,0,.10,.08,d+.07);
 if(pergola){
  for(let i=0;i<17;i++)plate(roof,finish,-W+.07+i*(w-.14)/16,H+.21,0,.081,d+.19,.062,.018,'y');
 }else{
  const panels=arch||fabric?18:14;
  for(let i=0;i<panels;i++){
   const x=-W+(i+.5)*w/panels, delta=roofHeight(x+.04)-roofHeight(x-.04);
   const tile=box(roof,finish,x,roofHeight(x)+.070,0,w/panels+.039,clad?.062:.037,d+.26);
   tile.rotation.z=Math.atan2(delta,.08);
   if(clad){
    for(let j=0;j<9;j++)box(roof,copper,x,roofHeight(x)+.094,-D+.02+j*.37,w/panels,.028,.075).rotation.z=tile.rotation.z;
   }else if(kind==='corrugated'){
    for(const dx of [-.08,.06])box(roof,steel,x+dx,roofHeight(x+dx)+.10,0,.020,.034,d+.26).rotation.z=tile.rotation.z;
   }
   if(fabric&&i%3===0)rod(truss,copper,[x,roofHeight(x)+.05,-D],[x*.89,H-.11,-D],.018);
  }
 }
 if(gazebo){
  for(const z of [-D,D]){
   box(sides,frame,0,.85,z,w,.065,.072);
   for(let i=0;i<15;i++){
    const x=-W+.15+i*(w-.30)/14;
    const b=box(sides,frame,x,.53,z,.04,.60,.045);b.rotation.z=(i%2?-.25:.25);
   }
  }
 }
 if(garage){
  for(const x of [-W,W]) for(let i=0;i<14;i++) box(sides,finish,x,H*.50,-D+.13+i*.218,.061,H-.14,.227);
  for(let i=0;i<18;i++) box(sides,finish,-W+.11+i*.246,H*.50,-D,.253,H-.14,.06);
  const doors=[-1,1].map(side=>{
   const p=part(sides,side*W,.09,D);
   plate(p,finish,-side*W/2,H*.46,0,W-.08,H-.24,.10,.025);
   for(let i=0;i<8;i++)box(p,steel,-side*(.14+i*.24),H*.46,.066,.023,H-.31,.05);
   return p;
  });
  root.userData.doors=doors;
 }
 for(const x of [-W,W])for(const z of zs)for(const dx of [-.077,.077])screw(bolts,x+dx,H+.05,z,'y',.026);
 const pose=(p,t=0)=>{
  const d=ss(p,.16,.84);
  roof.position.set((arch?.32:.09)*d,.60*d,-.62*d);
  roof.rotation.x=-(fabric?.27:.20)*d;
  truss.position.y=.12*d;
  bolts.position.y=.21*d;
  if(garage){
   root.userData.doors[0].rotation.y=-1.05*p;
   root.userData.doors[1].rotation.y=1.05*p;
   sides.position.z=.19*p;
  }
  if(gazebo)sides.position.z=.25*p;
 };
 return {root,pose,views:[cam([0,1.40,0],11.2),cam([0,1.70,0],9.4),cam([-.14,2.21,.32],5.95,[.66,.43,1])]};
}

function seeded(count=8){
 const root=new Group(), frame=part(root), toolbar=part(root), boxes=part(root), wheels=part(root);
 const W=5.10;
 box(frame,dark,0,.96,0,W,.19,.29);
 for(const x of [-1.47,1.47]){
  rod(frame,steel,[x,1.03,-.02],[0,1.10,1.31],.078);
  cylinder(wheels,rubber,x,.47,.68,.44,.21,'x',32);
  cylinder(wheels,steel,x,.47,.68,.235,.23,'x',28);
  for(let i=0;i<12;i++){
   const a=i*PI/6;
   cylinder(wheels,steel,x+.121,.47+.16*Math.cos(a),.68+.16*Math.sin(a),.023,.025,'x',8);
  }
 }
 for(let i=0;i<count;i++){
  const x=-2.24+i*4.48/(count-1);
  plate(boxes,accent,x,1.42,-.05,count===12?.34:.50,.51,.57,.055);
  box(boxes,dark,x,1.69,-.05,count===12?.31:.46,.05,.52);
  rod(toolbar,steel,[x,.92,-.05],[x,.52,-.40],.058);
  cylinder(toolbar,steel,x-.06,.36,-.41,.31,.071,'x',25);
  cylinder(toolbar,dark,x+.07,.32,-.66,.23,.095,'x',25);
  rod(toolbar,copper,[x,.93,-.04],[x,.51,-.48],.030);
 }
 const pose=(p,t=0)=>{boxes.position.y=.38*p;toolbar.position.z=-.31*p;wheels.rotation.x=.07*Math.sin(t*2)*p;};
 return {root,pose,views:[cam([0,.87,0],10.8),cam([0,.89,0],9.3),cam([-.94,.84,-.22],4.7,[.46,.65,1])]};
}
function trailer(){
 const root=new Group(), chassis=part(root), bucket=part(root,0,.94,-1.95), door=part(bucket,0,.22,-.04), lift=part(root);
 box(chassis,dark,0,.64,0,1.54,.23,4.22);
 for(const z of [-1.46,-.84,-.23])for(const x of [-.69,.69]){
  cylinder(chassis,rubber,x,.43,z,.405,.28,'x',36);
  cylinder(chassis,steel,x,.43,z,.212,.31,'x',30);
 }
 for(const x of [-.66,.66])box(chassis,steel,x,.57,1.33,.089,.86,.087);
 plate(bucket,steel,0,.066,2.02,1.61,3.94,.13,.045,'y');
 for(const x of [-.83,.83]){
  box(bucket,skin,x,.59,2.02,.086,1.11,4.05);
  for(let j=0;j<10;j++)box(bucket,dark,x,.59,.22+j*.40,.12,1.04,.061);
 }
 box(bucket,skin,0,.60,4.08,1.64,1.08,.09);
 box(door,skin,0,.42,0,1.60,.98,.12);
 for(const x of [-.59,0,.59])box(door,dark,x,.43,-.071,.074,.88,.052);
 let piston;
 const pose=(p,t=0)=>{
  bucket.rotation.x=-.40*p;
  door.rotation.x=-.89*ss(p,.28,.85);
  const a=[0,.65,.86],b=[0,.95+1.06*p,1.32-.22*p];
  const start=new Vector3(...a), end=new Vector3(...b), axis=end.clone().sub(start);
  if(!piston)piston=cylinder(lift,copper,0,0,0,.086,1);
  piston.position.copy(start).add(end).multiplyScalar(.5);
  piston.scale.y=axis.length();
  piston.quaternion.setFromUnitVectors(new Vector3(0,1,0),axis.normalize());
 };
 return {root,pose,views:[cam([0,1.05,0],10.8),cam([0,1.34,0],9.3),cam([0,1.30,-.99],6.4,[.76,.53,-1])]};
}
function screen(){
 const root=new Group(), base=part(root), mesh=part(root), shell=part(root), chips=part(root);
 deck(base,4.55,2.20);
 for(const x of [-1.50,1.49])for(const z of [-.67,.67]){
  box(base,dark,x,.60,z,.15,.78,.15);
  cylinder(base,copper,x,1.00,z,.116,.24);
  for(let i=0;i<5;i++)torus(base,steel,x,.89+i*.05,z,.115,.019);
 }
 const tilt=.17;mesh.rotation.z=-tilt;shell.rotation.z=-tilt;
 for(const z of [-.74,.74])box(shell,steel,0,1.25,z,4.00,.38,.09);
 for(let i=0;i<28;i++)box(mesh,steel,-1.91+i*.141,1.09,0,.022,.028,1.38);
 for(let i=0;i<14;i++)box(mesh,steel,0,1.115,-.64+i*.095,3.90,.023,.020);
 cylinder(base,dark,-.43,.87,.78,.18,.62,'x');
 const particles=Array.from({length:24},(_,i)=>shape(chips,new SphereGeometry(.047+(i%5)*.012,6,5),i%3?copper:skin,0,0,0));
 const pose=(p,t=0)=>{
  shell.position.y=.58*p;
  mesh.position.y=.034*Math.sin(t*27)*ss(p,.25,.68);
  for(let i=0;i<particles.length;i++){
   const x=-1.88+((i*.16+t*.54*ss(p,.31,.70))%3.8);
   particles[i].position.set(x,1.25-.16*x+Math.abs(Math.sin(t*13+i))*.072,((i*17)%19)/17-.52);
  }
 };
 return {root,pose,views:[cam([0,1.08,0],10.25),cam([0,1.29,0],8.5),cam([.04,1.20,.24],5.15,[.48,.70,1])]};
}

async function publicModel(id){
 const descriptor=catalog.find(r=>r.id===id);
 const model=await descriptor.create();
 const {root}=model;
 const bound={pump:[0,0,0],'butterfly-valve':[0,1,0],motor:[0,0,0],reducer:[0,0,0]};
 function pose(p,t=0){
  for(const {group,origin,offset,start=0} of model.sections){
   group.position.copy(origin).addScaledVector(offset,Math.max(0,(p-start)/(1-start)));
  }
  if(model.motion&&p>.45)model.motion(1/24,t);
 }
 return {root,pose,views:[cam(bound[id],8.1),cam(bound[id],7.8),cam(bound[id],6.5,[.55,.49,1])]};
}
function useStudio(create,id){
 const model=create();
 return {root:model.root,pose(p,t){model.pose(p);if(id==='cnc'&&p>.47){model.motion(.028,t);}},
 views:model.stages.slice(0,3).map(x=>x.view)};
}
const constructors={
 pack:()=>packaging('pack'),line:()=>packaging('line'),bottle:()=>packaging('bottle'),
 spiral:()=>conveyor(true),belt:()=>conveyor(false),robot:robotCell,
 edm:()=>workMachine('edm'),laser:()=>workMachine('laser'),laseropen:()=>workMachine('laseropen'),marker:()=>workMachine('marker'),
 compressor,heat:exchanger,ladder:platformLadder,carport:()=>structure('carport'),
 corrugated:()=>structure('corrugated'),arch:()=>structure('arch'),tile:()=>structure('tile'),
 tent:()=>structure('tent'),gazebo:()=>structure('gazebo'),pergola:()=>structure('pergola'),
 garage:()=>structure('garage'),frame:()=>structure('frame'),seeder:()=>seeded(),seed12:()=>seeded(12),trailer,screen,
 cnc:()=>useStudio(makeCnc,'cnc'),board:()=>useStudio(makeElectronics,'board'),
 pump:()=>publicModel('pump'),valve:()=>publicModel('butterfly-valve'),
 motor:()=>publicModel('motor'),reducer:()=>publicModel('reducer')
};
export async function createScene(id){const result=await constructors[id]();result.pose(0,0);return result;}
