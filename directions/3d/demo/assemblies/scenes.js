import {refinedGas,refinedPumps,refinedCheckpoint} from './refined.js?v=refined-20261111';
import {Group, Vector3, MeshStandardMaterial, MeshBasicMaterial, SphereGeometry, Shape, Path, ExtrudeGeometry} from '../../engine.js';
import {part,box,cylinder,torus,plate,rod,wire,screw,label,shape,materials,makeCnc,makeElectronics} from './models.js?v=refined-20261111';
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

function benchMarker(){
 const root=new Group(), base=part(root), optics=part(root), path=part(root);
 deck(base,2.70,1.85);
 plate(base,steel,0,.44,0,2.52,1.67,.16,.085,'y');
 for(let i=0;i<10;i++)for(let j=0;j<6;j++)cylinder(base,dark,-1.02+i*.227,.527,-.53+j*.21,.018,.014,'y',9);
 plate(base,skin,0,.562,.29,1.14,.71,.064,.075,'y');
 const neck=part(base,0,0,-.64);
 box(neck,dark,0,1.46,0,.21,2.02,.22);
 for(let i=0;i<10;i++)box(neck,steel,0,.67+i*.156,.123,.115,.035,.024);
 const head=part(optics,0,1.97,-.18);
 plate(head,dark,0,0,.12,.53,.45,1.13,.08);
 box(head,skin,0,.04,.39,.43,.26,.35);
 cylinder(head,steel,0,-.25,.52,.158,.13,'y',24);
 torus(head,copper,0,-.324,.52,.106,.025);
 const ink=new MeshBasicMaterial({color:0x78e9da});
 const dots=[];
 for(let i=0;i<20;i++){
  const x=-.43+.045*i,z=.26+.12*Math.sin(i*.45);
  dots.push(cylinder(path,ink,x,.602,z,.024,.009,'y',12));
 }
 const pose=(p,t=0)=>{
  head.position.y=1.97-.30*p;
  const n=Math.floor((t*6)%dots.length);
  dots.forEach((dot,i)=>dot.visible=p>.38&&i<=n);
 };
 return {root,pose,views:[cam([0,1.13,0],7.9),cam([0,1.24,.04],6.1),cam([0,.88,.22],4.4,[.39,.56,1])]};
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
  front.position.set(2.65*p,.35*p,.38*p);rear.position.z=-.55*p;
  sheets.forEach((v,k)=>{v.position.z=(-.38+k*.062)*(1+2.25*p);v.position.x=(k-6)*.078*p;});
 };
 return {root,pose,focusRoot:stack,views:[cam([0,1.36,0],8.1),cam([0,1.44,0],7.2),cam([.02,1.49,.28],4.55,[.79,.41,1])]};
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
 const ornate=variant===2;
 const w=ornate?3.12:gazebo?3.20:4.50,d=variant===1?10.85:ornate?5.12:gazebo?2.75:3.15,H=2.17;
 const W=w/2,D=d/2;
 const frame=tint(pergola?0x454c52:0x394858), finish=tint(clad?0x854745:arch?0x7b9da7:fabric?0xbba784:0x8296a3);
 const archH=x=>H+.59*(1-(x/W)**2);
 const gable=x=>H+.64*(1-Math.abs(x/W));
 const roofHeight=x=>pergola||garage?H+.15:arch||fabric||ornate?archH(x):gable(x);
 const n=variant===1?5:ornate?3:gazebo?2:3;
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
 if(ornate){
  for(const x of [-W,W])for(const z of [-D*.5,D*.5]){
   box(sides,frame,x,.91,z,.065,.070,d*.49);
   box(sides,frame,x,.15,z,.065,.070,d*.49);
   for(let i=0;i<6;i++){
    const t=z-.98+i*.39;
    rod(sides,frame,[x,.17,t],[x,.87,t],.023);
    torus(sides,copper,x,.54,t+.12,.117,.016,'x');
    torus(sides,frame,x,.38,t-.10,.086,.015,'x');
   }
  }
 }else if(gazebo){
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
 return {root,pose,views:[cam([0,1.40,0],variant===1?20:11.2),cam([0,1.70,0],variant===1?16:9.4),cam([-.14,2.21,variant===1?2.65:.32],5.95,[.66,.43,1])]};
}

function scissorLift(){
 const root=new Group(),base=part(root),deckTop=part(root);
 const liftBlue=tint(0x3d7190);
 plate(base,liftBlue,0,.43,0,2.58,1.36,.54,.10,'y');
 for(const x of [-.90,.90])for(const z of [-.69,.69]){
  cylinder(base,rubber,x,.24,z,.238,.16,'z',32);
  cylinder(base,steel,x,.24,z*1.11,.119,.045,'z',22);
 }
 plate(deckTop,steel,0,.05,0,2.57,1.25,.15,.04,'y');
 for(const z of [-.57,.57]){
  for(const x of [-1.16,0,1.16])box(deckTop,accent,x,.56,z,.055,1.00,.055);
  for(const y of [.55,1.03])box(deckTop,accent,0,y,z,2.36,.055,.055);
 }
 for(const x of [-1.16,1.16])for(const y of [.55,1.03])box(deckTop,accent,x,y,0,.055,.055,1.17);
 const pivots=[];
 for(let level=0;level<4;level++){
  for(const z of [-.43,.43])for(const dir of [-1,1]){
   const g=part(root,0,0,z+dir*.025);
   box(g,liftBlue,0,0,0,1.85,.094,.09);
   for(const x of [-.90,0,.90])cylinder(g,steel,x,0,0,.056,.105,'z',18);
   pivots.push({g,level,dir});
  }
 }
 for(const xx of [-.90,.90])for(const zz of [-.78,.78])for(let k=0;k<5;k++){
  const a=k*PI*2/5;cylinder(base,steel,xx+.072*Math.cos(a),.24+.072*Math.sin(a),zz,.014,.025,'z',6);
 }
 for(const xx of [-1.15,1.15])for(const zz of [-.56,.56])screw(deckTop,xx,.15,zz,'y',.023);
 box(base,dark,1.19,.57,.25,.065,.20,.32);
 cylinder(base,hot,1.23,.59,.25,.027,.032,'x',20);
 const ram=part(root,-.72,.68,0),shaft=part(ram);
 cylinder(ram,steel,0,.28,0,.073,.56,'y',28);torus(ram,dark,0,.54,0,.074,.015,'y');
 cylinder(shaft,steel,0,0,0,.038,.60,'y',24);
 const pose=p=>{
  const lift=ss(p,.08,.87), angle=.09+.48*lift;
  const delta=1.81*Math.sin(angle);
  for(const {g,level,dir} of pivots){
   g.position.y=.71+(level+.50)*delta;
   g.rotation.z=dir*angle;
  }
  deckTop.position.y=.73+4*delta;
  const v=new Vector3(.72,.03+delta*1.5,0),length=v.length();
  ram.quaternion.setFromUnitVectors(new Vector3(0,1,0),v.normalize());
  shaft.scale.y=Math.max(.02,(length-.55)/.60);shaft.position.y=(length+.55)/2;

 };
 return {root,pose,views:[cam([0,1.22,0],7.9),cam([0,2.25,0],9.4),cam([0,2.36,.12],6.1,[.73,.42,1])]};
}

function liftgate(){
 const root=new Group(),trailer=part(root),gate=part(root),hydraulics=part(root);
 const side=tint(0x627a90);
 box(trailer,dark,0,.71,0,2.12,.24,2.76);
 plate(trailer,side,0,1.17,-.46,2.13,2.15,.18,.035,'y');
 for(const x of [-1.00,1.00]){
  box(trailer,skin,x,1.91,-.46,.12,1.51,2.14);
  cylinder(trailer,rubber,x*.84,.39,-.70,.38,.24,'x',32);
  cylinder(trailer,steel,x*.93,.39,-.70,.17,.12,'x',24);
 }
 for(const x of [-.79,.79]){
  box(trailer,dark,x,.63,1.04,.13,.31,.28);
  cylinder(trailer,steel,x,.63,1.12,.085,.18,'x',18);
 }
 plate(gate,steel,0,.020,.66,2.17,1.35,.12,.05,'y');
 for(let x=-.98;x<=.98;x+=.14)box(gate,dark,x,.087,.68,.020,.016,1.25);
 const struts=[-.76,.76].map(x=>({
  x,arm:cylinder(hydraulics,dark,0,0,0,.068,1),cyl:cylinder(hydraulics,copper,0,0,0,.047,1)
 }));
 function connect(obj,start,end){
  const v=end.clone().sub(start);
  obj.position.copy(start).addScaledVector(v,.5);
  obj.scale.y=v.length();
  obj.quaternion.setFromUnitVectors(new Vector3(0,1,0),v.normalize());
 }
 const pose=p=>{
  const unfold=ss(p,.02,.44),lower=ss(p,.45,.88);
  gate.rotation.x=-PI*.49*(1-unfold);
  gate.position.set(0,1.10-.97*lower,1.23+.42*lower);
  for(const {x,arm,cyl} of struts){
   const tip=new Vector3(x,gate.position.y-.065,gate.position.z);
   connect(arm,new Vector3(x,.63,.92),tip);
   connect(cyl,new Vector3(x,.78,.74),tip);
  }
 };
 return {root,pose,views:[cam([0,1.38,0],8.7),cam([0,1.23,.60],8),cam([.48,.71,1.32],4.6,[.92,.43,1])]};
}

function openMill(variant=false){
 const root=new Group(),frame=part(root),knee=part(root),table=part(knee),tool=part(root);
 const blue=tint(variant?0x65785c:0x3f637b);
 deck(frame,3.12,2.74);
 plate(frame,blue,0,1.62,-.74,1.18,2.73,.79,.13);
 plate(frame,blue,0,2.72,-.24,1.01,.82,1.48,.10);
 plate(knee,blue,0,.94,.35,1.17,1.17,1.52,.08,'y');
 plate(table,steel,0,1.34,.42,2.34,1.23,.23,.055,'y');
 for(const z of [-.01,.24,.49,.74])box(table,dark,0,1.458,z,2.23,.014,.045);
 for(const x of [-1.13,1.13])cylinder(table,dark,x,1.21,.49,.13,.21,'x',24);
 const work=part(table,-.10,1.49,.39);
 plate(work,copper,0,.13,0,.64,.42,.23,.03);
 for(const x of [-.46,.46])box(work,dark,x,.12,.01,.12,.19,.58);
 cylinder(tool,steel,0,2.32,.41,.19,.63,'y',32,.22);
 cylinder(tool,copper,0,1.94,.41,.095,.29);
 for(let k=0;k<4;k++){
  const t=k*PI/2;
  box(tool,steel,Math.cos(t)*.072,1.84,.41+Math.sin(t)*.072,.038,.20,.035).rotation.y=-t;
 }
 const plateGuard=plate(frame,blue,.56,2.28,-.05,.29,.53,.095,.035);
 plateGuard.rotation.y=.22;
 for(const p of [[.58,2.38,-.01],[.58,2.20,-.01]])cylinder(frame,accent,...p,.043,.04,'z');
 const pose=(p,t=0)=>{
  const k=ss(p,.25,.80);
  table.position.x=k*(.30*Math.sin(t*1.38));
  tool.position.y=-.15*k;
  tool.rotation.y=.05*k*Math.sin(t*3);
 };
 return {root,pose,views:[cam([0,1.49,0],9.3),cam([0,1.71,.21],7.25),cam([-.08,1.63,.42],4.70,[.64,.53,1])]};
}

function inclinedBelt(){
 const root=new Group(),base=part(root),beam=part(root,0,1.39,0),belt=part(beam),goods=part(beam),covers=part(beam);
 beam.rotation.z=.25;
 deck(base,5.39,1.65);
 for(const x of [-1.77,.08,1.79])for(const z of [-.47,.47]){
  const h=1.36+x*Math.tan(.25);
  box(base,steel,x,h/2+.08,z,.08,h-.18,.09);
 }
 for(const z of [-.49,.49])box(beam,dark,0,-.09,z,4.68,.19,.10);
 for(const x of [-2.13,2.13])cylinder(beam,steel,x,0,0,.19,1.0,'z',26);
 cylinder(beam,accent,2.12,-.12,.62,.17,.34,'z',26);
 for(const y of [-.174,.174])box(belt,rubber,0,y,0,4.35,.03,.88);
 for(let k=0;k<18;k++)box(belt,steel,-2.07+k*.244,.197,0,.033,.061,.86);
 for(const z of [-.48,.48])box(covers,skin,0,.27,z,4.46,.13,.08);
 const grain=Array.from({length:36},(_,i)=>shape(goods,new SphereGeometry(.044+(i%4)*.009,6,4),i%3===0?accent:copper,0,0,0));
 const pose=(p,t=0)=>{
  covers.position.y=.34*p;
  covers.position.z=-.13*p;
  const move=.49*t*ss(p,.28,.67);
  grain.forEach((g,i)=>{
   const x=-2.10+((i*.132+move)%4.20);
   g.position.set(x,.275,((i*17)%13)*.052-.30);
  });
 };
 return {root,pose,views:[cam([0,1.20,0],10.5),cam([0,1.56,0],8.4),cam([1.01,1.66,.11],5.75,[.65,.52,1])]};
}

function cylinderReducer(){
 const root=new Group(),lower=part(root),cover=part(root),train=part(root);
 const blue=tint(0x38536b), tooth=tint(0xcb8d4d);
 plate(lower,blue,0,.40,0,4.13,2.43,.26,.11,'y');
 for(const x of [-1.96,1.96])box(lower,blue,x,.63,0,.16,.44,2.38);
 for(const z of [-1.14,1.14])box(lower,blue,0,.63,z,3.89,.44,.16);
 for(const x of [-1.53,1.53])for(const z of [-1,1])box(lower,steel,x,.26,z,.78,.17,.44);
 plate(cover,blue,0,1.91,0,4.19,2.48,.21,.13,'y');
 for(const x of [-1.87,1.87])box(cover,blue,x,1.38,0,.19,.91,2.22);
 for(const z of [-1.07,1.07])box(cover,blue,0,1.39,z,3.73,.89,.19);
 for(const x of [-1.63,-.82,0,.82,1.63])for(const z of [-1.11,1.11])screw(cover,x,2.06,z,'y',.052);
 function gear(g,r,n,z,phase=0,m=tooth){
  const w=part(g,0,0,z);w.rotation.z=phase;
  cylinder(w,m,0,0,0,r,.24,'z',48);
  torus(w,steel,0,0,.138,r*.57,.038,'z');
  for(let i=0;i<n;i++){
   const t=i*2*PI/n;
   box(w,m,(r+.031)*Math.cos(t),(r+.031)*Math.sin(t),0,.097,.089,.244).rotation.z=t;
  }
  return w;
 }
 const xs=[-1.17,-.075,1.22];
 const shafts=xs.map((x,i)=>{
  const g=part(train,x,1.10,0);
  cylinder(g,steel,0,0,(i===0?-.22:i===2?.23:0),.11+i*.025,i===1?2.18:2.73,'z',32);
  for(const z of [-.96,.96])cylinder(g,dark,0,0,z,.26,.21,'z',32);
  return g;
 });
 const gears=[gear(shafts[0],.35,20,-.39),gear(shafts[1],.65,37,-.39,PI/37,steel),
  gear(shafts[1],.39,22,.42),gear(shafts[2],.81,46,.42,PI/46,steel)];
 const speed=[2.5,-2.5*20/37,-2.5*20/37,2.5*20/37*22/46];
 const phases=[0,PI/37,0,PI/46];
 const pose=(p,t=0)=>{
  const a=ss(p,.05,.82);
  cover.position.set(.18*a,1.0*a,-1.19*a);
  cover.rotation.x=-.15*a;
  train.position.y=.45*a;
  gears.forEach((g,i)=>{g.rotation.z=phases[i]+speed[i]*t*ss(p,.33,.62);});
 };
 return {root,pose,views:[cam([0,1.05,0],9.3),cam([0,1.55,0],7.5),cam([-.02,1.52,.16],5.35,[.56,.77,1])]};
}

function moduleBlock(mobile=false, spec={}){
 const root=new Group(),unit=part(root),frame=part(unit), walls=part(unit), cap=part(unit);
 const w=5.05,d=2.16,h=2.12;
 const metal=tint(0x34475d), panel=tint(spec.finish==='profile'?0xa5b4bb:0xb9c5cd);
 for(const x of [-w/2,w/2])for(const z of [-d/2,d/2])box(frame,metal,x,h/2,z,.13,h,.13);
 for(const z of [-d/2,d/2])for(const y of [.11,h])box(frame,metal,0,y,z,w,.16,.12);
 for(const x of [-w/2,w/2])for(const y of [.11,h])box(frame,metal,x,y,0,.12,.16,d);
 for(let i=0;i<7;i++)box(frame,steel,-2.31+i*.77,.13,0,.075,.13,d);
 plate(frame,dark,0,.26,0,w,d,.14,.025,'y');
 for(let i=0;i<11;i++)box(frame,panel,-2.25+i*.45,1.15,-d/2,.43,1.88,.085);
 for(let i=0;i<5;i++)for(const x of [-w/2,w/2])box(frame,panel,x,1.15,-.85+i*.425,.085,1.88,.407);
 if(spec.partition){
  const x=.76;
  for(const z of [-.78,.78])box(frame,panel,x,1.14,z,.087,1.75,.59);
  box(frame,metal,x,1.99,0,.092,.16,d);
 }
 const front=part(walls,0,0,d/2);
 const [winW,winH]=(spec.window||[1070,870]).map(n=>n*.000865);
 const windowX=-1.02, windowY=1.42;
 const doorX=1.42,doorW=spec.door==='double'?1.35:.73;
 const windows=[[-2.42,windowX-winW/2],[windowX+winW/2,doorX-doorW/2],[doorX+doorW/2,2.42]];
 for(const [left,right] of windows){
  box(front,panel,(left+right)/2,1.15,0,right-left,1.88,.087);
  if(spec.finish==='profile')for(let x=left+.042;x<right-.023;x+=.12)box(front,steel,x,1.15,.050,.023,1.88,.023);
 }
 function solidAround(x,w,bottom,top){
  if(bottom>.21)box(front,panel,x,(bottom+.21)/2,0,w,bottom-.21,.087);
  if(top<2.09)box(front,panel,x,(top+2.09)/2,0,w,2.09-top,.087);
 }
 solidAround(windowX,winW,windowY-winH/2,windowY+winH/2);
 solidAround(doorX,doorW,.23,2.00);
 if(mobile){
  box(front,panel,windowX,windowY,0,winW,winH,.087);
  const chassis=part(root);
  unit.position.y=.70;
  box(chassis,dark,0,.57,0,w+.12,.20,d-.15);
  for(const x of [-.53,.48]){
   cylinder(chassis,dark,x,.34,0,.067,d,'z',20);
   for(const z of [-1.05,1.05]){
    cylinder(chassis,rubber,x,.34,z,.338,.22,'z',28);
    cylinder(chassis,steel,x,.34,z*1.105,.154,.04,'z',20);
   }
  }
  for(const z of [-.52,.52])rod(chassis,steel,[2.49,.58,z],[3.40,.51,0],.047);
  torus(chassis,steel,3.46,.51,0,.077,.021,'y');
 }else{
  rectangle(front,metal,windowX,windowY,0,winW,winH,.045);
  plate(front,clear,windowX,windowY,.021,winW-.08,winH-.08,.025,.025);
 }
 const doorPaint=spec.door==='wood'?tint(0x84715e):steel;
 plate(front,doorPaint,doorX,1.115,.035,doorW,1.77,.10,.035);
 if(spec.door==='double')box(front,metal,doorX,1.115,.093,.024,1.77,.024);
 cylinder(front,accent,spec.door==='double'?doorX-.09:doorX+doorW*.34,1.10,.111,.037,.051,'z',12);
 const roof=part(cap,0,h+.11,0);
 if(spec.roof==='lean')roof.rotation.x=.10;
 for(let i=0;i<9;i++)box(roof,i%2?panel:steel,-2.26+i*.565,0,0,.56,.12,d+.16);
 for(const xx of [-w/2,w/2])for(const zz of [-d/2,d/2])for(const yy of [.16,h-.04]){
  box(frame,steel,xx,yy,zz+.073,.23,.21,.024);
  for(const dx of [-.067,.067]){cylinder(frame,steel,xx+dx,yy,zz+.101,.024,.032,'z',6);torus(frame,steel,xx+dx,yy,zz+.083,.029,.005,'z');}
 }
 for(const yy of [.49,1.74]){
  cylinder(front,steel,doorX-doorW*.48,yy,.11,.025,.13,'y',20);
  screw(front,doorX-doorW*.48+.04,yy,.115,'z',.014);
 }
 for(let k=0;k<9;k++)for(const zz of [-d*.42,d*.42])screw(roof,-2.26+k*.565,.079,zz,'y',.020);
 const pose=p=>{
  const t=ss(p,.10,.84);
  front.position.set(-1.15*t,0,d/2+.94*t);
  cap.position.set(.31*t,.85*t,-.48*t);
  cap.rotation.x=-.13*t;
 };
 return {root,pose,views:[cam([0,1.12,0],10.7),cam([0,1.45,0],9.0),cam([1.42,1.49,.75],5.45,[.45,.43,1])]};
}

function seeded(count=8,shoe=false){
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
  if(shoe){
   const runner=box(toolbar,steel,x,.30,-.51,.080,.16,.43);
   runner.rotation.x=-.21;
   plate(toolbar,copper,x,.24,-.34,.080,.17,.14,.02);
   cylinder(toolbar,dark,x,.38,-.77,.17,.105,'x',25);
   if(i%2===0)plate(boxes,steel,x+.27,1.37,.33,.31,.52,.43,.04);
  }else{
   cylinder(toolbar,steel,x-.06,.36,-.41,.31,.071,'x',25);
   cylinder(toolbar,dark,x+.07,.32,-.66,.23,.095,'x',25);
  }
  rod(toolbar,copper,[x,.93,-.04],[x,.51,-.48],.030);
 }
 const pose=(p,t=0)=>{boxes.position.y=.38*p;toolbar.position.z=-.31*p;wheels.rotation.x=.07*Math.sin(t*2)*p;};
 return {root,pose,views:[cam([0,.87,0],10.8),cam([0,.89,0],9.3),cam([-.94,.84,-.22],4.7,[.46,.65,1])]};
}
function wideSeeder(){
 const root=new Group(), chassis=part(root), bunkers=part(root), rows=part(root);
 const W=5.15;
 box(chassis,dark,0,.91,0,W,.17,.14);
 for(const z of [-.62,-.20,.22,.64])box(chassis,steel,0,.87,z,W,.087,.091);
 for(const x of [-1.83,1.83]){
  rod(chassis,steel,[x,.95,-.64],[0,.95,-1.72],.06);
  cylinder(chassis,rubber,x,.46,.32,.42,.20,'x',28);
  cylinder(chassis,steel,x,.46,.32,.19,.21,'x',24);
 }
 for(const x of [-.78,.78]){
  plate(bunkers,accent,x,1.39,-.12,1.43,.80,1.09,.095);
  plate(bunkers,dark,x,1.83,-.12,1.22,.96,.061,.055,'y');
  wire(chassis,copper,[[x,1.04,-.32],[x,1.22,-.59],[x,1.17,-.90],[x*.52,.88,-1.17]],.038);
 }
 for(let k=0;k<4;k++)for(let j=0;j<20;j++){
  const x=-W/2+.11+j*.254+(k%2)*.085,z=-.61+k*.42;
  rod(rows,dark,[x,.85,z],[x,.44,z+.078],.027);
  cylinder(rows,steel,x,.39,z+.12,.14,.043,'x',16);
 }
 const pose=(p,t=0)=>{bunkers.position.y=.47*p;rows.position.z=.37*p;};
 return {root,pose,views:[cam([0,1.02,0],11.25),cam([0,1.06,0],9.12),cam([-.52,.66,.52],5.1,[.65,.51,1])]};
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
function screen(deckCount=1){
 const root=new Group(), base=part(root), mesh=part(root), shell=part(root), chips=part(root);
 deck(base,4.55,2.20);
 for(const x of [-1.50,1.49])for(const z of [-.67,.67]){
  box(base,dark,x,.60,z,.15,.78,.15);
  cylinder(base,copper,x,1.00,z,.116,.24);
  for(let i=0;i<5;i++)torus(base,steel,x,.89+i*.05,z,.115,.019);
 }
 const tilt=.17;mesh.rotation.z=-tilt;shell.rotation.z=-tilt;
 for(const z of [-.74,.74])box(shell,steel,0,1.25,z,4.00,.38,.09);
 for(let deckIndex=0;deckIndex<deckCount;deckIndex++){
  const h=1.09-deckIndex*.21;
  for(let i=0;i<28;i++)box(mesh,steel,-1.91+i*.141,h,0,.022,.028,1.38);
  for(let i=0;i<14;i++)box(mesh,steel,0,h+.025,-.64+i*.095,3.90,.023,.020);
 }
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
 const bound={pump:[0,0,0],'butterfly-valve':[0,1,0],motor:[0,0,0],reducer:[0,0,0],staircase:[0,1.45,0],'glass-rail':[0,.70,0],cafe:[0,.88,0]};
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
function screwConveyor(tube=false,hopper=false,spec={}){
 const root=new Group(),frame=part(root),cover=part(root),rotor=part(root,0,1.06,0);
 const metal=tint(0x48667e);
 deck(frame,5.34,1.71);
 for(const x of [-1.82,1.82])for(const z of [-.45,.45])box(frame,metal,x,.53,z,.10,.58,.14);
 const radius=spec.radius||.43,len=4.35;
 for(let i=0;i<18;i++){
  const a=PI+i*PI/17;
  const side=box(frame,metal,0,1.06+radius*Math.sin(a),radius*Math.cos(a),len,.09,.067);
  side.rotation.x=-a;
 }
 if(tube){
  for(let i=0;i<18;i++){
   const a=i*PI/17;
   box(cover,steel,0,1.06+radius*Math.sin(a),radius*Math.cos(a),len,.09,.07).rotation.x=-a;
  }
 }else plate(cover,steel,0,1.53,0,len,.95,.105,.04,'y');
 for(const x of [-2.14,2.14]){
  torus(frame,steel,x,1.06,0,radius,.062,'x');
  cylinder(frame,dark,x,1.06,0,.144,.26,'x',28);
 }
 if(hopper){
  for(let j=0;j<9;j++){
   const r=.27+j*.050;
   for(const x of [-1.68-r,-1.68+r])box(frame,steel,x,1.50+j*.085,0,.054,.102,r*2);
   for(const z of [-r,r])box(frame,steel,-1.68,1.50+j*.085,z,r*2,.102,.054);
  }
 }
 cylinder(frame,dark,2.33,1.06,0,.27,.47,'x',30);
 cylinder(rotor,steel,0,0,0,.08,len,'x',26);
 for(let i=0;i<150;i++){
  const t=i/149;
  const phi=t*(spec.turns||7)*2*PI;
  const vane=box(rotor,copper,-2.03+4.06*t,.224*Math.sin(phi),.224*Math.cos(phi),.042,.29,.060);
  vane.rotation.x=-phi+PI/2;
 }
 if(spec.angle)root.rotation.z=spec.angle;
 const pose=(p,t=0)=>{
  cover.position.set(.25*p,.66*p,-.65*p);
  cover.rotation.x=-.37*p;
  rotor.rotation.x=-2.4*t*ss(p,.23,.78);
 };
 return {root,pose,views:[cam([0,1.04,0],10.3),cam([0,1.25,0],8.0),cam([.68,1.21,.23],5.4,[.46,.61,1])]};
}

function mixingTank(spec={}){
 const root=new Group(),body=part(root),lid=part(root),agitator=part(root,0,1.72,0),shell=part(root);
 const metal=tint(spec.poly?0xd3d8d8:0x62849a);
 if(!spec.poly)for(let i=0;i<3;i++){
  const a=i*2*PI/3+PI/6;
  cylinder(body,steel,Math.cos(a)*.80,.43,Math.sin(a)*.80,.07,.86);
 }
 cylinder(body,metal,0,.91,0,.89,.24);
 for(let i=0;i<48;i++){
  const a=i*2*PI/48;
  const g=(a>.25&&a<2.35)?shell:body;
  box(g,spec.poly?metal:steel,.89*Math.cos(a),1.63,.89*Math.sin(a),.058,1.43,.13).rotation.y=-a;
 }
 torus(body,steel,0,.91,0,.87,.055,'y');
 cylinder(lid,steel,0,2.41,0,.94,.12,'y',56,.88);
 for(let i=0;i<12;i++){
  const a=i*PI/6;screw(lid,.82*Math.cos(a),2.49,.82*Math.sin(a),'y',.04);
 }
 cylinder(lid,metal,0,2.71,0,.25,.51,'y',28);
 cylinder(lid,dark,0,2.99,0,.21,.12);
 cylinder(agitator,steel,0,.06,0,.058,1.25);
 for(const h of (spec.poly?[-.25]:[-.34,.08]))for(let i=0;i<3;i++){
  const a=i*2*PI/3;const v=part(agitator,0,h,0);v.rotation.y=a;
  const p=box(v,copper,.29,0,0,.57,.076,.22);p.rotation.x=.19;
 }
 cylinder(body,steel,0,.76,.97,.086,.25,'z',28);
 torus(body,steel,0,.76,1.10,.12,.024,'z');
 for(let k=0;k<6;k++){const a=k*PI/3;screw(body,.112*Math.cos(a),.76+.112*Math.sin(a),1.13,'z',.018);}
 cylinder(body,copper,0,.93,.99,.035,.23,'y',20);
 torus(body,hot,0,1.06,.99,.082,.013,'y');
 for(let k=0;k<14;k++){const a=k*PI/7;box(lid,metal,.256*Math.cos(a),2.72,.256*Math.sin(a),.019,.34,.019);}
 const pose=(p,t=0)=>{
  lid.position.set(0,.54*p,-.13*p);
  shell.position.set(1.85*p,0,-.26*p);shell.visible=p<.78;lid.visible=p<.82;
  agitator.rotation.y=2.5*t*ss(p,.24,.68);
 };
 return {root,pose,focusRoot:agitator,views:[cam([0,1.48,0],8.9),cam([0,1.61,0],7.6),cam([0,1.55,.19],5.0,[.64,.45,1])]};
}

function hookContainer(spec={}){
 const root=new Group(),frame=part(root),left=part(root,-1,0,2.28),right=part(root,1,0,2.28);
 const coat=tint(0x436a80);
 plate(frame,steel,0,.38,0,2.05,4.55,.16,.07,'y');
 for(const x of [-1,1]){
  box(frame,coat,x,1.22,0,.085,1.69,4.56);
  box(frame,steel,x,2.09,0,.11,.10,4.61);
  if(spec.horizontal)for(const y of [.69,1.08,1.49,1.90])box(frame,steel,x*1.054,y,0,.108,.104,4.55);
  else for(let k=0;k<10;k++)box(frame,dark,x*1.036,1.25,-2.10+k*.46,.065,1.67,.073);
 }
 box(frame,coat,0,1.25,-2.27,2,1.72,.087);
 for(const x of [-.67,.67])box(frame,dark,x,.24,0,.22,.18,4.76);
 rod(frame,steel,[0,.42,-2.32],[0,2.24,-2.53],.083);
 cylinder(frame,copper,0,2.23,-2.54,.10,.47,'x');
 for(const [hinge,side] of [[left,-1],[right,1]]){
  plate(hinge,coat,-side*.50,1.21,0,.97,1.71,.10,.04);
  for(const h of [.55,1.91])cylinder(hinge,steel,0,h,0,.071,.22,'y',20);
  for(const h of [.52,1.90])box(hinge,steel,-side*.50,h,.064,.88,.07,.065);
 }
 const pose=p=>{left.rotation.y=-1.45*p;right.rotation.y=1.45*p;};
 return {root,pose,views:[cam([0,1.05,0],10.8),cam([0,1.17,1.05],8.25),cam([.36,1.27,2.15],5.5,[.70,.44,1])]};
}

function dryingCabinet(count=4, narrow=false){
 const root=new Group(),body=part(root),door=part(root,-1.03,0,.71),shelves=part(root);
 const coat=tint(0x698598);
 plate(body,coat,0,.23,0,2.20,1.51,.20,.06,'y');
 plate(body,coat,0,2.79,0,2.20,1.51,.21,.06,'y');
 for(const x of [-1.02,1.02])box(body,coat,x,1.50,0,.15,2.49,1.52);
 box(body,coat,0,1.50,-.68,2.04,2.48,.15);
 for(const x of [-.89,.89])for(const z of [-.61,.61])box(body,dark,x,.09,z,.18,.16,.19);
 for(let k=0;k<count;k++){
  const y=count===1?1.40:.58+k*1.73/(count-1);
  for(let z=-.50;z<=.53;z+=.075)box(shelves,steel,0,y,z,1.79,.022,.024);
  for(const x of [-.83,.83])box(shelves,steel,x,y,.02,.046,.048,1.14);
 }
 plate(door,coat,1.02,1.50,0,1.99,2.40,.15,.07);
 rod(door,steel,[1.86,1.14,.11],[1.86,1.57,.11],.035);
 plate(body,dark,.57,2.79,.795,.73,.115,.04,.025);
 for(let i=0;i<3;i++)cylinder(body,i===0?accent:steel,.42+i*.14,2.79,.827,.027,.033,'z');
 if(narrow)root.scale.x=.48;
 const pose=p=>{door.rotation.y=-1.48*p;shelves.position.z=.23*ss(p,.48,.89);};
 return {root,pose,views:[cam([0,1.48,0],8.9),cam([0,1.48,.25],7.4),cam([.29,1.55,.45],4.7,[.47,.32,1])]};
}

function waferValve(){
 const root=new Group(),caseGroup=part(root),seal=part(root),disc=part(root),handle=part(disc);
 const coat=tint(0x425d79);
 torus(caseGroup,coat,0,0,0,1.04,.18,'z');
 for(const x of [-.92,.92])for(const y of [-.82,.82]){
  box(caseGroup,coat,x,y,0,.29,.23,.18);
  cylinder(caseGroup,steel,x*1.08,y,.036,.069,.083,'z',24);
 }
 box(caseGroup,coat,0,1.14,0,.39,.35,.27);
 box(caseGroup,coat,0,-1.13,0,.33,.25,.25);
 torus(seal,dark,0,0,.081,.897,.092,'z');
 cylinder(disc,steel,0,0,.014,.82,.094,'z',56);
 cylinder(disc,copper,0,0,0,.074,2.63,'y',24);
 box(disc,steel,0,0,.067,.16,1.53,.09);
 plate(handle,coat,.44,1.34,0,.95,.16,.15,.045,'y');
 plate(handle,dark,.79,1.34,0,.46,.19,.20,.05,'y');
 const pose=(p,t=0)=>{
  caseGroup.position.z=-.68*p;
  seal.position.z=-.19*p;
  disc.position.z=.18*p;
  disc.rotation.y=1.27*ss(p,.22,.82);
 };
 return {root,pose,views:[cam([0,.14,0],6.7),cam([0,.19,0],5.9),cam([0,.11,.02],4.25,[.72,.38,1])]};
}

function swingGate(){
 const root=new Group(),frame=part(root);
 const metal=tint(0x607989);
 const leaves=[];
 for(const side of [-1,1]){
  const x=side*1.89;
  box(frame,metal,x,1.25,0,.14,2.53,.18);
  const leaf=part(root,x,0,.03);
  const face=part(leaf);
  const skeleton=part(leaf);
  const center=-side*.91;
  plate(face,metal,center,1.23,.025,1.80,2.39,.09,.035);
  for(const dx of [-.87,.87])box(skeleton,dark,center+dx,1.23,0,.060,2.41,.071);
  for(const y of [.065,1.25,2.39])box(skeleton,dark,center,y,0,1.80,.066,.075);
  for(const y of [.51,1.94])cylinder(leaf,copper,0,y,.072,.058,.20,'y',24);
  cylinder(leaf,steel,-side*1.72,1.21,.10,.048,.08,'z',24);
  leaves.push({leaf,face,side});
 }
 box(frame,metal,0,2.52,0,3.93,.14,.16);
 box(frame,dark,0,.085,0,3.96,.08,.20);
 const pose=p=>{
  for(const {leaf,face,side} of leaves){
   leaf.rotation.y=side*1.11*ss(p,.06,.79);
   face.position.z=.21*ss(p,.59,.96);
  }
 };
 return {root,pose,views:[cam([0,1.26,0],8.9),cam([0,1.21,.13],8.1),cam([1.63,1.29,.21],4.76,[.84,.33,1])]};
}

function pairedModules(){
 const root=new Group(),first=moduleBlock(),second=moduleBlock();
 root.add(first.root,second.root);
 function pose(p,t){
  first.root.position.z=-1.08-.65*p;
  second.root.position.z=1.08+.77*p;
  first.pose(p*.14,t);second.pose(p*.76,t);
 }
 return {root,pose,views:[cam([0,1.31,0],13),cam([0,1.56,0],11),cam([.48,1.60,.34],6.9,[.69,.50,1])]};
}

function gantryRouter(spec={}){
 const root=new Group(),frame=part(root),gantry=part(root),head=part(gantry),tool=part(head);
 const steelBlue=tint(spec.paint||0x486780);
 const long=spec.long||4.34,wide=spec.wide||3.16;
 const zMax=long/2,wMax=wide/2;
 deck(frame,wide+.43,long+.26);
 for(const x of [-wMax,wMax])box(frame,steelBlue,x,.62,0,.15,.58,long);
 for(const z of [-zMax,zMax])box(frame,steelBlue,0,.62,z,wide,.58,.15);
 for(let i=0;i<10;i++)box(frame,dark,-wMax+.16+i*(wide-.32)/9,.89,0,.24,.10,long-.20);
 plate(frame,tint(0xba916b),.10,.96,-.35,wide*.65,long*.51,.051,.04,'y');
 for(const x of [-wMax,wMax]){
  box(gantry,steelBlue,x,1.31,0,.17,1.0,.36);
  box(frame,steel,x,.955,0,.09,.028,long-.06);
 }
 box(gantry,steelBlue,0,1.82,0,wide+.23,.29,.30);
 for(const y of [1.73,1.94])box(gantry,steel,0,y,.17,wide-.14,.037,.036);
 plate(head,dark,0,1.64,.265,.45,.55,.16,.045);
 cylinder(head,steel,0,1.53,.42,.138,.49,'y',32,.16);
 cylinder(tool,copper,0,1.205,.42,.065,.22,'y',18);
 const pose=(p,t=0)=>{
  const move=ss(p,.19,.71);
  gantry.position.z=move*(-.58+.54*Math.sin(t*.68));
  head.position.x=move*.93*Math.sin(t*.88);
  tool.position.y=-.11*move;
 };
 return {root,pose,views:[cam([0,1.00,0],12.0),cam([0,1.23,.15],9.75),cam([.12,1.52,.22],6.35,[.48,.55,1])]};
}

function hydraulicPress(spec={}){
 const root=new Group(),frame=part(root),ram=part(root),guard=part(root);
 const coat=tint(spec.paint||0x436a86);
 const cols=spec.cols||2;
 deck(frame,3.49,2.10);
 if(cols===1){
  plate(frame,coat,-.84,1.41,-.49,.44,2.49,.76,.08);
  box(frame,coat,0,2.48,-.32,2.12,.41,1.00);
 }else{
  for(const x of [-1.12,1.12])box(frame,coat,x,1.43,-.02,.24,2.51,.54);
  box(frame,coat,0,2.61,-.02,2.60,.32,.68);
 }
 for(const x of [-.50,.50])box(frame,steel,x,.89,.11,.67,.27,.79);
 cylinder(frame,steel,0,2.41,.02,.25,.48,'y',36);
 cylinder(ram,copper,0,2.15,.02,.119,.48,'y',32);
 plate(ram,steel,0,1.92,.02,.60,.59,.18,.055,'y');
 for(const x of [-1.07,1.07])for(let k=0;k<4;k++)cylinder(frame,dark,x,.77+k*.20,.266,.058,.038,'z',20);
 box(frame,dark,1.45,.75,-.27,.49,.65,.48);
 cylinder(frame,steel,1.42,1.23,-.24,.16,.28,'y',24);
 const sample=part(frame,0,1.02,.15);
 cylinder(sample,accent,0,.073,0,.32,.125,'y',28);
 const pose=(p,t=0)=>{ram.position.y=-.66*ss(p,.18,.83);guard.position.x=.12*p;};
 return {root,pose,views:[cam([0,1.33,0],8.85),cam([0,1.44,.12],7.20),cam([.15,1.63,.34],5.25,[.72,.42,1])]};
}

function hydroCylinder(){
 const root=new Group(),body=part(root),cap=part(root),shaft=part(root),gland=part(root);
 const paint=tint(0x466681);
 const eye=(g,x)=>{
  torus(g,steel,x,0,0,.255,.080,'z');
  for(const z of [-.092,.092])torus(g,dark,x,0,z,.219,.037,'z');
 };
 eye(body,-2.07);
 cylinder(body,paint,-1.72,0,0,.19,.62,'x',24);
 for(let k=0;k<34;k++){
  const a=k*2*PI/34;
  const pane=box(a>.17&&a<2.15?cap:body,paint,-.65,.405*Math.sin(a),.405*Math.cos(a),2.23,.08,.075);
  pane.rotation.x=-a;
 }
 for(const x of [-1.79,.49])torus(body,dark,x,0,0,.392,.058,'x');
 for(const x of [-1.43,.24]){
  cylinder(body,steel,x,.43,0,.093,.18,'y',18);
  torus(body,copper,x,.545,0,.074,.024,'y');
 }
 cylinder(shaft,steel,.39,0,0,.130,2.42,'x',40);
 cylinder(shaft,copper,-.69,0,0,.313,.128,'x',36);
 for(const x of [-.78,-.61])torus(shaft,dark,x,0,0,.315,.032,'x');
 eye(shaft,1.72);
 torus(gland,steel,.51,0,0,.326,.080,'x');
 torus(gland,dark,.56,0,0,.161,.030,'x');
 const pose=(p,t=0)=>{
  cap.position.set(-.11*p,.57*p,.46*p);
  gland.position.x=.25*p;
  shaft.position.x=.57*ss(p,.13,.80);
 };
 return {root,pose,views:[cam([0,0,0],8.75),cam([0,.16,0],7.75),cam([-.19,.13,.02],5.0,[.44,.57,1])]};
}

function hopperDoser(spec={}){
 const root=new Group(),frame=part(root),shell=part(root),lid=part(root),rotor=part(root,0,1.65,0);
 const coat=tint(0x5a8097);
 deck(frame,2.52,2.17);
 for(const x of [-.87,.87])for(const z of [-.68,.68])box(frame,coat,x,1.02,z,.10,1.61,.10);
 for(const y of [.67,1.41])box(frame,dark,0,y,-.66,1.79,.085,.09);
 for(let i=0;i<44;i++){
  const a=i*2*PI/44;
  const g=a>.15&&a<2.1?shell:frame;
  for(let k=0;k<12;k++){
   const u=k/11,r=.22+.55*u;
   const panel=box(g,steel,r*Math.cos(a),1.53+k*.106,r*Math.sin(a),.09,.112,.063);
   panel.rotation.y=-a;
  }
 }
 torus(frame,steel,0,2.72,0,.77,.036,'y');
 cylinder(lid,steel,0,2.77,0,.82,.089,'y',45,.70);
 cylinder(lid,coat,0,2.99,0,.18,.39,'y',25);
 cylinder(rotor,steel,0,.48,0,.060,1.32,'y',24);
 for(let i=0;i<90;i++){
  const f=i/89,a=f*10*PI;
  box(rotor,copper,.113*Math.cos(a),-.16+f*1.36,.113*Math.sin(a),.145,.038,.058).rotation.y=-a;
 }
 cylinder(frame,steel,0,1.32,0,.225,.36,'y',24,.16);
 if(spec.bag){
  plate(frame,steel,0,.43,0,.90,.82,.076,.038,'y');
  const pouch=tint(0xc3a679);
  for(const x of [-.267,.267])box(frame,pouch,x,.79,0,.039,.62,.43);
  for(const z of [-.202,.202])box(frame,pouch,0,.79,z,.53,.62,.033);
 }
 const pose=(p,t=0)=>{
  shell.position.set(1.82*p,.10*p,-.21*p);
  lid.position.set(0,.64*p,-.20*p);
  rotor.rotation.y=2.2*t*ss(p,.22,.75);
 };
 return {root,pose,views:[cam([0,1.51,0],8.45),cam([0,1.69,0],7.45),cam([0,1.83,.07],4.85,[.36,.49,1])]};
}

function greenhouse(spec={}){
 const root=new Group(),base=part(root),ribs=part(root),skin=part(root);
 const width=3.3,length=spec.length||4.84,n=spec.ribs||7;
 const r=width/2,H=2.23;
 const xy=a=>[r*Math.cos(a),.17+(H-.17)*Math.sin(a)];
 const glass=new MeshStandardMaterial({color:0x99cede,metalness:.10,roughness:.28,transparent:true,opacity:.38});
 for(const x of [-r,r])box(base,steel,x,.15,0,.095,.11,length+.14);
 for(const z of [-length/2,length/2])box(base,steel,0,.15,z,width,.11,.09);
 for(let k=0;k<n;k++){
  const z=-length/2+k*length/(n-1);
  for(let i=0;i<32;i++){
   const a=xy(i*PI/32),b=xy((i+1)*PI/32);
   rod(ribs,steel,[...a,z],[...b,z],.026);
  }
 }
 for(const a of [.37,.88,PI/2,2.26,2.75]){
  const [x,y]=xy(a);
  box(ribs,steel,x,y,0,.052,.057,length+.06);
 }
 for(let i=0;i<26;i++){
  const a=(i+.5)*PI/26,[x,y]=xy(a);
  box(skin,glass,x,y+.027,0,.22,.035,length+.17).rotation.z=Math.atan2((H-.17)*Math.cos(a),-r*Math.sin(a));
 }
 const front=part(ribs,0,0,length/2);
 for(const x of [-.40,.40])box(front,steel,x,.99,0,.064,1.70,.064);
 box(front,steel,0,1.88,0,.85,.07,.065);
 const door=part(front,-.36,.19,.024);
 plate(door,glass,.35,.81,0,.67,1.57,.043,.025);
 for(const x of [.012,.685])box(door,steel,x,.83,.013,.043,1.67,.047);
 for(const y of [.042,1.62])box(door,steel,.35,y,.013,.70,.047,.047);
 const pose=p=>{const t=ss(p,.11,.86);skin.position.set(.50*t,.64*t,-.62*t);door.rotation.y=-1.16*t;};
 return {root,pose,views:[cam([0,1.05,0],11.40),cam([0,1.43,0],9.43),cam([-.15,1.57,length*.28],5.80,[.60,.48,1])]};
}

function flangePair(spec={}){
 const root=new Group(),rear=part(root),front=part(root),gasket=part(root),bolts=part(root);
 const count=spec.bolts||8,D=spec.d||285,K=spec.k||240, bore=spec.bore||161;
 const radius=1.19, boltCircle=radius*K/D, throat=radius*bore/D, boltRadius=radius*(spec.hole||22)/D;
 function ring(group,material,outer,inner,thickness,holeCount){
  const out=new Shape();
  out.absarc(0,0,outer,0,2*PI,false);
  const innerPath=new Path();innerPath.absarc(0,0,inner,0,2*PI,true);
  out.holes.push(innerPath);
  for(let i=0;i<holeCount;i++){
   const angle=(i+.5)*2*PI/holeCount;
   const h=new Path();h.absarc(boltCircle*Math.cos(angle),boltCircle*Math.sin(angle),boltRadius,0,2*PI,true);
   out.holes.push(h);
  }
  const geom=new ExtrudeGeometry(out,{depth:thickness,steps:1,curveSegments:40,bevelEnabled:false});
  geom.translate(0,0,-thickness/2);
  return shape(group,geom,material,0,0,0);
 }
 ring(rear,steel,radius,throat,.19,count);
 ring(front,steel,radius,throat,.19,count);
 ring(gasket,copper,boltCircle-boltRadius-.037,throat,.045,0);
 for(let i=0;i<count;i++){
  const a=(i+.5)*2*PI/count,x=boltCircle*Math.cos(a),y=boltCircle*Math.sin(a);
  cylinder(bolts,dark,x,y,0,boltRadius*.58,.65,'z',18);
  cylinder(bolts,steel,x,y,.30,boltRadius*1.27,.078,'z',6);
 }
 const pose=p=>{
  rear.position.z=-.14-.75*p;
  front.position.z=.14+.65*p;
  gasket.position.x=.15*p;
  bolts.position.z=.04+1.15*p;
 };
 return {root,pose,views:[cam([0,0,0],6.50),cam([0,.14,.14],6.05),cam([.20,.09,.27],4.35,[.66,.45,1])]};
}

function manualBender(spec={}){
 const root=new Group(),frame=part(root),jaw=part(root),sheet=part(root,0,1.40,.38);
 const coating=tint(spec.paint||0x3c6981);
 deck(frame,4.45,1.45);
 for(const x of [-1.72,1.72]){
  box(frame,coating,x,.85,-.03,.14,1.30,.19);
  box(frame,steel,x,.37,0,.08,.12,1.02);
 }
 box(frame,dark,0,1.29,-.09,4.20,.24,.73);
 box(frame,steel,0,1.51,-.05,4.17,.12,.57);
 for(const x of [-1.89,1.89])cylinder(frame,copper,x,1.41,.38,.105,.19,'x',20);
 const bending=part(jaw,0,1.41,.38);
 box(bending,coating,0,-.10,.23,4.14,.16,.49);
 for(const x of [-1.53,1.53]){
  rod(bending,steel,[x,-.08,.39],[x,-.08,.96],.032);
  cylinder(bending,dark,x,-.08,1.03,.058,.16,'z',18);
 }
 const rear=part(frame,0,1.43,.375);
 plate(rear,copper,0,.015,-.28,2.66,.57,.021,.025,'y');
 plate(sheet,copper,0,.045,.245,2.66,.48,.021,.025,'y');
 const pose=(p,t=0)=>{const a=1.24*ss(p,.17,.85);bending.rotation.x=-a;sheet.rotation.x=-a;};
 return {root,pose,views:[cam([0,1.02,0],9.15),cam([0,1.43,.25],7.6),cam([.49,1.45,.36],5.15,[.62,.49,1])]};
}

function airDamper(spec={}){
 const root=new Group(),frame=part(root),drive=part(root);
 const w=3.18,h=spec.height||2.04,d=.39;
 const coat=tint(0x627d90);
 for(const x of [-w/2,w/2])box(frame,coat,x,0,0,.12,h+.16,d);
 for(const y of [-h/2,h/2])box(frame,coat,0,y,0,w,.12,d);
 for(const x of [-w/2,w/2])for(const y of [-h/2,h/2])screw(frame,x,y,.25,'z',.045);
 const count=spec.blades||4;
 const leaves=[];
 for(let i=0;i<count;i++){
  const y=-h/2+(i+.5)*h/count;
  const leaf=part(root,0,y,0);
  box(leaf,steel,0,0,0,w-.12,h/count-.033,.053);
  cylinder(leaf,dark,0,0,0,.040,w+.17,'x',22);
  leaves.push(leaf);
 }
 plate(drive,dark,w/2+.31,.42,0,.43,.56,.39,.06);
 rod(drive,copper,[w/2+.11,.73,.11],[w/2+.11,-.71,.11],.032);
 const pose=p=>{
  for(const leaf of leaves)leaf.rotation.x=-1.36*ss(p,.1,.81);
  drive.position.x=.38*ss(p,.53,.88);
 };
 return {root,pose,views:[cam([0,.06,0],7.35),cam([0,.16,0],6.23),cam([.78,.24,.10],4.62,[.64,.38,1])]};
}

function airReceiver(spec={}){
 const root=new Group(),base=part(root),shell=part(root),cut=part(root);
 const R=.69,H=spec.height||1.64,mid=1.62,coat=tint(0x486a86);
 for(let i=0;i<4;i++){
  const a=i*PI/2;
  box(base,steel,.55*Math.cos(a),.29,.55*Math.sin(a),.12,.56,.12);
  cylinder(base,dark,.55*Math.cos(a),.10,.55*Math.sin(a),.13,.095);
 }
 for(let k=0;k<56;k++){
  const a=k*2*PI/56;
  const g=a>.24&&a<2.07?cut:shell;
  box(g,coat,R*Math.cos(a),mid,R*Math.sin(a),.055,H,.078).rotation.y=-a;
 }
 for(const sign of [-1,1]){
  const geom=new SphereGeometry(R,42,20,0,2*PI,0,PI/2);
  const cap=shape(shell,geom,coat,0,mid+sign*H/2,0);cap.scale.y=.54;
  if(sign===-1)cap.rotation.z=PI;
 }
 cylinder(shell,steel,0,mid+H/2+.40,0,.094,.21,'y',24);
 cylinder(shell,copper,.72,mid+.38,0,.11,.27,'x',22);
 cylinder(shell,steel,.72,mid-.36,0,.11,.27,'x',22);
 cylinder(base,steel,0,mid-H/2-.45,0,.047,.19,'y',18);
 const pose=p=>{const t=ss(p,.16,.86);cut.position.set(.49*t,.18*t,.62*t);};
 return {root,pose,views:[cam([0,1.45,0],8.35),cam([0,1.64,0],7.2),cam([.34,1.72,.22],5.0,[.72,.48,1])]};
}

function ribbonMixer(spec={}){
 const root=new Group(),base=part(root),lid=part(root),rotor=part(root,0,1.25,0);
 const length=spec.length||3.42,coat=tint(0x648398);
 deck(base,length+.89,2.07);
 for(const x of [-length*.39,length*.39])for(const z of [-.56,.56])box(base,dark,x,.63,z,.11,.68,.11);
 const rad=.61;
 for(let i=0;i<22;i++){
  const a=PI+i*PI/21;
  box(base,coat,0,1.25+rad*Math.sin(a),rad*Math.cos(a),length,.069,.097).rotation.x=-a;
 }
 for(const x of [-length/2,length/2]){
  box(base,steel,x,1.27,0,.10,.99,1.23);
  cylinder(base,dark,x,1.27,0,.19,.18,'x',26);
 }
 cylinder(base,coat,length/2+.28,1.27,0,.24,.46,'x',26);
 plate(lid,steel,0,1.80,0,length+.06,1.29,.079,.06,'y');
 for(const x of [-length*.32,length*.32])box(lid,dark,x,1.89,.17,.28,.07,.08);
 cylinder(rotor,steel,0,0,0,.068,length+.22,'x',24);
 for(const [radius,turns] of [[.43,2.25],[.23,-2.25]]){
  for(let i=0;i<132;i++){
   const u=i/131,a=u*2*PI*turns;
   const v=box(rotor,copper,(u-.50)*(length-.15),radius*Math.sin(a),radius*Math.cos(a),.052,.10,.029);
   v.rotation.x=-a;
  }
 }
 for(const x of [-length*.37,0,length*.37])for(const a of [0,PI/2,PI,1.5*PI])
  rod(rotor,steel,[x,0,0],[x,.44*Math.sin(a),.44*Math.cos(a)],.025);
 const pose=(p,t=0)=>{lid.position.set(0,.71*p,-.48*p);lid.rotation.x=-.51*p;rotor.rotation.x=t*2.15*ss(p,.20,.75);};
 return {root,pose,views:[cam([0,1.12,0],9.8),cam([0,1.41,.1],8.4),cam([.38,1.43,.16],5.3,[.62,.48,1])]};
}

function brakePress(){
 const root=new Group(),base=part(root),ram=part(root),panel=part(root),sheet=part(root,0,1.19,.12);
 const coat=tint(0x405f81);
 deck(base,4.88,2.12);
 for(const x of [-2.05,2.05]){
  box(base,coat,x,1.38,-.40,.24,2.33,1.18);
  cylinder(base,steel,x*.87,2.09,.15,.14,.48,'y',24);
 }
 box(base,coat,0,2.52,-.08,4.39,.37,.81);
 box(base,coat,0,.78,0,4.33,.68,.65);
 box(base,steel,0,1.095,.04,4.17,.102,.32);
 for(const z of [-.045,.14])box(base,dark,0,1.166,z,4.13,.052,.052).rotation.x=z>0?-.43:.43;
 box(ram,coat,0,1.89,.09,4.16,.39,.38);
 box(ram,steel,0,1.64,.09,4.04,.12,.16).rotation.x=PI/4;
 box(panel,dark,2.16,1.75,.64,.32,.49,.15);
 box(panel,cold,2.16,1.81,.725,.247,.18,.028);
 plate(sheet,copper,0,.012,.29,2.15,.57,.022,.024,'y');
 plate(base,copper,0,1.206,-.166,2.15,.58,.022,.024,'y');
 const pose=p=>{
  ram.position.y=-.43*ss(p,.12,.83);
  sheet.rotation.x=-.85*ss(p,.45,.91);
 };
 return {root,pose,views:[cam([0,1.23,0],10.1),cam([0,1.43,.20],8.15),cam([.34,1.29,.29],5.65,[.65,.44,1])]};
}

function toolStorage(spec={},mode='cabinet'){
 const root=new Group(),body=part(root),face=part(root);
 const outer=tint(spec.paint||0x516d85),trim=tint(0x344c66);
 const rolling=mode==='cart',bench=mode==='bench',gas=mode==='gas';
 const w=bench?4.08:rolling?1.75:gas?2.1:2.02,h=bench?1.64:rolling?1.61:2.78,d=bench?1.48:1.17;
 const sideW=w/2,back=-d/2,top=h;
 for(const x of [-sideW,sideW])box(body,outer,x,h/2,0,.095,h,d);
 box(body,outer,0,h/2,back,w,h,.095);
 for(const y of [.10,top])plate(body,bench?steel:outer,0,y,0,w+.08,d+.1,.14,.038,'y');
 if(rolling)for(const x of [-sideW+.13,sideW-.13])for(const z of [-.42,.42]){
  cylinder(body,rubber,x,.08,z,.135,.12,'x',24);
  cylinder(body,steel,x,.08,z,.063,.14,'x',18);
 }
 const boxes=[];
 const drawers=spec.drawers||4;
 const comp=bench?1.16:w-.26;
 const count=gas?0:drawers;
 function drawerBank(n,x){
  const dh=(bench?.96:rolling?1.29:1.18)/Math.max(1,n);
  for(let i=0;i<n;i++){
   const y=.19+(i+.5)*dh;
   const drawer=part(body,x,y,0);
   box(drawer,trim,0,-dh*.28,0,comp,.060,d*.75);
   for(const xx of [-comp/2,comp/2])box(drawer,steel,xx,0,0,.039,dh*.70,d*.79);
   box(drawer,outer,0,0,d*.43,comp+.055,dh*.86,.083);
   rod(drawer,steel,[-.24,.02,d*.43+.075],[.24,.02,d*.43+.075],.029);
   boxes.push(drawer);
  }
 }
 drawerBank(count,bench?1.36:0);
 if(bench){
  if(spec.leftDrawers)drawerBank(spec.leftDrawers,-1.36);
  else{
   box(body,trim,-1.39,.72,0,1.11,1.18,1.22);
   cylinder(body,steel,-1.68,.77,.67,.052,.091,'z');
  }
 }else if(!rolling&&!gas)for(const y of [1.45,2.12])plate(body,steel,0,y,.012,w-.21,d-.15,.073,.025,'y');
 if(spec.peg){
  const mesh=tint(0x3d555e);
  box(body,mesh,0,1.86,-d*.43,w-.23,1.63,.036);
  for(let xi=0;xi<17;xi++)for(let yi=0;yi<16;yi++)box(body,dark,-.77+xi*.096,1.11+yi*.097,-d*.40,.028,.029,.008);
 }

 if(gas)for(const x of [-.51,.51]){
  cylinder(body,hot,x,.91,0,.292,1.49,'y',48);
  for(const y of [.165,1.65]){const cap=shape(body,new SphereGeometry(.292,32,20),hot,x,y,0);cap.scale.y=.45;}
  cylinder(body,hot,x,.15,0,.267,.18,'y',40);
  cylinder(body,steel,x,1.76,0,.095,.19,'y',28);
  torus(body,steel,x,1.74,0,.131,.027,'y');
 }
 const doors=[];
 if(spec.singleGas){
  const hinge=part(face,sideW,.10,d*.52);
  const enamel=tint(0x766356);
  plate(hinge,enamel,-w*.50,(h-.12)/2,0,w-.045,h-.13,.088,.031);
  box(hinge,steel,-w+.15,h*.49,.076,.085,.11,.057);
  box(hinge,enamel,-w*.50,h*.49,-.058,.087,h*.73,.073);
  doors.push({door:hinge,side:1});
 }else if(!bench&&!rolling)for(const side of [-1,1]){
  const door=part(face,side*sideW,.11,d*.52);
  plate(door,outer,-side*(w*.25-.03),(h-.14)/2,0,w*.50-.045,h-.14,.088,.029);
  cylinder(door,steel,-side*(w*.44),(h-.14)*.53,.082,.047,.084,'z',22);
  if(gas)for(let i=0;i<7;i++){
   box(door,dark,-side*(w*.25-.03),.32+i*.053,.051,.45,.017,.010);
   box(door,dark,-side*(w*.25-.03),h-.47+i*.053,.051,.45,.017,.010);
  }
  doors.push({door,side});
 }
 const pose=(p,t=0)=>{
  for(const {door,side} of doors)door.rotation.y=side*2.43*ss(p,.03,.67);
  boxes.forEach((g,i)=>{g.position.z=(i%3===0?.74:i%3===1?.32:.49)*ss(p,.37,.91);});
 };
 return {root,pose,focusRoot:body,views:[cam([0,h*.49,0],bench?9.7:8.5),cam([0,h*.50,.16],7.3),cam([.12,h*.46,.47],4.8,[.66,.43,1])]};
}

function warehouseRack(spec={},kind='pallet'){
 const root=new Group(),frames=part(root),rails=part(root),decking=part(root);
 const count=spec.levels||4,d=kind==='cantilever'?1.72:1.53,w=3.70,h=3.30;
 const blue=tint(0x405e87),beam=tint(0xc97945);
 const xs=spec.single?[-w/2,w/2]:[-w/2,0,w/2],levels=Array.from({length:count},(_,i)=>.46+i*(h-.78)/(count-1));
 const zs=kind==='cantilever'?[-d/2]:[-d/2,d/2];
 for(const x of xs)for(const z of zs){
  box(frames,blue,x,h/2,z,.106,h,.102);
  plate(frames,steel,x,.075,z,.26,.27,.072,.027,'y');
  for(let y=.45;y<h-.08;y+=.14)box(frames,dark,x,y,z+.056,.039,.056,.009);
 }
 if(kind==='cantilever'){
  for(const x of xs)for(const y of levels)box(rails,beam,x,y,0,.10,.10,d);
 }else{
  for(const x of xs)for(const y of [1.0,2.22]){
   rod(frames,blue,[x,y-.36,-d/2],[x,y+.40,d/2],.032);
   box(frames,steel,x,y+.12,0,.070,.068,d);
  }
  for(const y of levels){
   for(const z of zs)box(rails,beam,0,y,z,w,.116,.086);
   if(kind==='shelf')for(const x of [-w/4,w/4])plate(decking,steel,x,y+.061,0,w/2-.11,d,.046,.028,'y');
   else for(const x of [-w/4,w/4])for(let i=0;i<8;i++)box(decking,steel,x-.69+i*.19,y+.056,0,.092,.041,d);
  }
 }
 const pose=p=>{rails.position.z=.38*p;decking.position.y=.43*p;};
 return {root,pose,views:[cam([0,1.51,0],11.2),cam([0,1.62,0],9.4),cam([.54,1.76,.52],5.95,[.61,.46,1])]};
}

function scissorTable(spec={}){
 const root=new Group(),base=part(root),top=part(root),links=[];
 const blue=tint(0x466f8a);
 const count=spec.stages||1;
 plate(base,dark,0,.13,0,3.06,1.72,.15,.07,'y');
 plate(top,steel,0,0,0,3.15,1.82,.17,.07,'y');
 if(spec.wheels)for(const x of [-1.22,1.22])for(const z of [-.70,.70]){
  cylinder(base,rubber,x,.091,z,.122,.112,'x',24);
  cylinder(base,steel,x,.091,z,.067,.14,'x',18);
 }
 for(let stage=0;stage<count;stage++)for(const z of [-.58,.58])for(const dir of [-1,1]){
  const g=part(root,0,0,z+.027*dir);
  box(g,blue,0,0,0,2.58,.132,.12);
  for(const x of [-1.25,0,1.25])cylinder(g,steel,x,0,0,.074,.157,'z',24);
  links.push({g,dir,stage});
 }
 const pose=p=>{
  const angle=.095+.58*ss(p,.12,.86),delta=2.5*Math.sin(angle);
  for(const {g,dir,stage} of links){g.rotation.z=angle*dir;g.position.y=.23+(stage+.50)*delta;}
  top.position.y=.24+count*delta;
 };
 return {root,pose,views:[cam([0,1.0,0],9.05),cam([0,1.27,0],7.6),cam([.49,1.12,.32],5.1,[.66,.41,1])]};
}

function cableLadder(spec={}){
 const root=new Group(),left=part(root),right=part(root),rungs=part(root);
 const length=spec.length||4.43,half=(spec.width||1.54)/2,high=spec.high||.26;
 const material=tint(0x638498);
 for(const [side,rail] of [[-1,left],[1,right]]){
  box(rail,material,side*half,high/2,0,.070,high,length);
  for(const h of [.025,high-.015])box(rail,material,side*(half-.10),h,0,.21,.035,length);
  for(let z=-length*.46;z<length*.46;z+=.23)box(rail,dark,side*(half+.039),high*.53,z,.008,.064,.090);
 }
 const n=spec.rungs||9;
 for(let i=0;i<n;i++){
  const z=-length*.44+i*length*.88/(n-1);
  box(rungs,steel,0,.088,z,half*2-.13,.085,.13);
  for(const x of [-half+.17,half-.17])screw(rungs,x,.144,z,'y',.040);
 }
 const pose=p=>{left.position.x=-.30*p;right.position.x=.30*p;rungs.position.y=.13*p;};
 return {root,pose,views:[cam([0,0,0],9.3),cam([0,.24,0],8.15),cam([.57,.21,.66],4.85,[.68,.55,1])]};
}

function wheelBin(spec={}){
 const root=new Group(),body=part(root),lid=part(root,0,1.88,-.81);
 const blue=tint(spec.paint||0x587482);
 const w=2.27,dep=1.69,h=1.56;
 plate(body,steel,0,.35,0,w-.16,dep-.14,.17,.075,'y');
 for(const x of [-w/2,w/2]){
  box(body,blue,x,1.11,0,.105,h,dep);
  rod(body,steel,[x,1.72,-.68],[x,1.72,.68],.039);
  for(const z of [-.76,.76]){
   cylinder(body,rubber,x*.91,.21,z,.202,.15,'x',36);
   box(body,steel,x*.91,.37,z,.18,.15,.11);
   cylinder(body,steel,x*.91,.45,z,.045,.14,'y',20);
   for(let k=0;k<6;k++){const a=k*PI/3;cylinder(body,steel,x*1.04,.21+.065*Math.sin(a),z+.065*Math.cos(a),.014,.022,'x',6);}
   cylinder(body,steel,x*.99,.21,z,.096,.045,'x',24);
  }
 }
 for(const z of [-dep/2,dep/2]){
  plate(body,blue,0,1.11,z,w,h,.105,.075);
  for(const x of [-.71,-.30,.30,.71])box(body,steel,x,1.11,z*1.074,.068,h-.12,.062);
 }
 for(const x of [-.84,.84])cylinder(body,steel,x,1.88,-.81,.066,.26,'x',22);
 plate(lid,blue,0,.015,.815,w+.08,dep+.10,.096,.065,'y');
 for(const x of [-.71,0,.71])box(lid,steel,x,.071,.81,.046,.059,dep-.14);
 rod(lid,steel,[-.32,.131,1.48],[.32,.131,1.48],.025);
 const pose=p=>{lid.rotation.x=-1.32*ss(p,.09,.83);};
 return {root,pose,views:[cam([0,1.02,0],8.45),cam([0,1.22,.10],7.22),cam([.36,1.68,.25],5.0,[.68,.46,1])]};
}

function cookingBox(spec={},grill=false){
 const root=new Group(),frame=part(root),lid=part(root),rack=part(root),drip=part(root);
 const w=spec.width||3.28,d=spec.depth||1.72,base=grill?1.29:.35,H=grill?.74:1.20;
 const stainless=tint(grill?0x435466:0x8da1ad);
 if(grill){
  for(const x of [-w*.40,w*.40])for(const z of [-d*.36,d*.36])box(frame,dark,x,.67,z,.092,1.25,.09);
  plate(frame,steel,0,.45,0,w-.18,d-.13,.070,.04,'y');
 }else deck(frame,w+.25,d+.22);
 for(const x of [-w/2,w/2])box(frame,stainless,x,base+H/2,0,.094,H,d);
 for(const z of [-d/2,d/2])box(frame,stainless,0,base+H/2,z,w,H,.090);
 plate(frame,steel,0,base,0,w+.09,d+.08,.13,.035,'y');
 for(const x of [-w/2,w/2])box(frame,steel,x,base+H+.011,0,.16,.071,d+.095);
 for(const z of [-d/2,d/2])box(frame,steel,0,base+H+.011,z,w,.071,.15);
 const levels=grill?1:spec.grates||2;
 for(let j=0;j<levels;j++){
  const y=base+H-.17-j*.30;
  for(const z of [-d*.39,d*.39])box(rack,dark,0,y,z,w-.18,.049,.048);
  for(let i=0;i<22;i++)box(rack,steel,-w*.44+i*w*.88/21,y,0,.030,.039,d*.83);
 }
 plate(drip,steel,0,base+.26,0,w-.22,d-.23,.060,.040,'y');
 const h=base+H+.069;
 lid.position.set(0,h,-d/2);
 const y=grill?.24:0;
 plate(lid,stainless,0,y,d/2,w+.14,d+.17,.089,.055,'y');
 if(grill){
  for(const x of [-w/2,w/2])box(lid,stainless,x,.13,d/2,.083,.24,d+.17);
  for(const z of [0,d])box(lid,stainless,0,.13,z,w,.24,.086);
  cylinder(lid,steel,0,.12,d+.059,.082,.032,'z',26);
  for(const x of [-.35,.35])rod(lid,steel,[x,.12,d],[x,.12,d+.18],.030);
  rod(lid,dark,[-.43,.12,d+.18],[.43,.12,d+.18],.056);
 }else{
  for(const x of [-.41,.41])rod(lid,steel,[x,.035,d/2],[x,.16,d/2],.029);
  rod(lid,dark,[-.47,.16,d/2],[.47,.16,d/2],.046);
  cylinder(lid,steel,w*.39,.12,d*.24,.055,.18,'y',22);
 }
 const pose=p=>{
  const t=ss(p,.12,.83);
  if(grill)lid.rotation.x=-1.47*t;
  else lid.position.set(.23*t,h+.68*t,-d/2-.69*t);
  rack.position.y=.28*ss(p,.44,.93);
  if(!grill)drip.position.y=.20*ss(p,.54,.93);
 };
 return {root,pose,views:[cam([0,grill?1.28:.92,0],9.0),cam([0,grill?1.64:1.28,0],7.5),cam([.38,grill?1.78:1.43,.14],5.0,[.67,.55,1])]};
}

function spiralStair(spec={}){
 const root=new Group(),column=part(root),treads=part(root),rails=part(root);
 const steps=spec.steps||13,r=1.37,turn=2*PI*.92;
 cylinder(column,steel,0,1.54,0,.101,3.06,'y',24);
 cylinder(column,dark,0,.11,0,.36,.17,'y',32);
 for(let i=0;i<steps;i++){
  const u=i/(steps-1),a=turn*u-.38,y=.27+u*2.51;
  const step=part(treads,0,y,0);
  step.rotation.y=-a;
  const outline=new Shape();
  outline.moveTo(.12,0);outline.lineTo(r,-.275);outline.lineTo(r,.275);outline.closePath();
  const g=new ExtrudeGeometry(outline,{depth:.074,bevelEnabled:false});
  g.rotateX(-PI/2);
  shape(step,g,steel,0,0,0);
  const x=r*.96*Math.cos(a),z=r*.96*Math.sin(a);
  rod(rails,dark,[x,y,z],[x,y+.67,z],.025);
  if(i>0){
   const a0=a-turn/(steps-1),y0=y-2.51/(steps-1);
   rod(rails,dark,[r*.96*Math.cos(a0),y0+.67,r*.96*Math.sin(a0)],[x,y+.67,z],.029);
  }
 }
 const pose=p=>{treads.position.x=.23*p;rails.position.set(.57*p,.12*p,-.39*p);};
 return {root,pose,views:[cam([0,1.60,0],9.50),cam([0,1.75,0],8.10),cam([.24,1.63,.19],5.25,[.72,.36,1])]};
}

function utilities(spec={},kind='transformer'){
 const root=new Group(),base=part(root),roof=part(root),panels=part(root),gear=part(root);
 const L=spec.length||4.85,D=spec.depth||2.13,H=2.34,ends=L/2,ds=D/2;
 const metal=tint(0x48687e),finish=tint(spec.paint||0x94aab6);
 plate(base,dark,0,spec.sled?.27:.16,0,L+.16,D+.11,.25,.055,'y');
 if(spec.sled)for(const z of [-ds*.68,ds*.68]){
  box(base,steel,0,.11,z,L+.53,.12,.16);
  for(const x of [-ends-.25,ends+.25])box(base,steel,x,.15,z,.28,.11,.16).rotation.z=x>0?.24:-.24;
 }
 for(const x of [-ends,ends])for(const z of [-ds,ds])box(base,metal,x,H/2,z,.12,H,.12);
 for(const z of [-ds,ds])for(const y of [.30,H])box(base,metal,0,y,z,L,.102,.112);
 for(const x of [-ends,ends])box(base,finish,x,1.31,0,.091,1.97,D-.04);
 for(let k=0;k<12;k++)box(base,finish,-ends+.21+k*(L-.42)/11,1.30,-ds,.38,1.97,.080);
 plate(roof,finish,0,H+.09,0,L+.18,D+.15,.13,.045,'y');
 const openWidth=kind==='transformer'?L*.71:1.40;
 for(const x of [-1,1]){
  const length=(L-openWidth)/2-.04;
  box(panels,finish,x*(openWidth/2+length/2),1.30,ds,length,1.97,.09);
 }
 const doors=[-1,1].map(side=>{
  const hinge=part(panels,side*openWidth/2,0,ds+.058);
  const center=-side*openWidth*.25;
  plate(hinge,finish,center,1.29,0,openWidth*.49,1.94,.098,.035);
  for(let k=0;k<9;k++)box(hinge,dark,center,.53+k*.061,.061,openWidth*.31,.014,.012);
  cylinder(hinge,steel,-side*openWidth*.41,1.21,.097,.038,.061,'z',18);
  return hinge;
 });
 if(kind==='transformer'){
  const centers=spec.units===2?[-1.27,1.27]:[0];
  for(const c of centers){
   plate(gear,metal,c,1.05,-.30,1.85,.99,1.30,.09,'y');
   plate(gear,steel,c,1.73,-.30,1.90,1.05,.14,.045,'y');
   for(const xx of [-.76,-.38,0,.38,.76])for(const zz of [-.67,.07])screw(gear,c+xx,1.82,zz,'y',.025);
   cylinder(gear,copper,c+.73,1.59,.35,.036,.16,'z',20);
   label(gear,'ТМ',c,1.25,.228,.24,.11,'z','#d8e1e8');

   for(const side of [-1,1]){
    for(let k=0;k<9;k++)box(gear,steel,c+side*(.24+k*.077),1.05,.27,.042,1.11,.125);
   }
   for(const x of [-.58,0,.58]){
    cylinder(gear,dark,c+x,1.94,-.29,.089,.31,'y',22);
    for(let k=0;k<4;k++)torus(gear,steel,c+x,1.82+k*.061,-.29,.105,.015,'y');
   }
  }
  if(spec.units===2)box(gear,finish,0,1.28,-.14,.08,2.04,D*.67);
 }else if(kind==='boiler'){
  const count=spec.boilers||2;
  for(let i=0;i<count;i++){
   const x=count===1?0:(i-.5)*1.48;
   plate(gear,metal,x,1.04,-.21,1.10,1.19,1.27,.077);
   cylinder(gear,copper,x,1.08,.44,.16,.34,'z',28);
   rectangle(gear,steel,x,1.04,.435,.93,1.05,.018);
   for(const xx of [-.43,.43])for(const yy of [.56,1.52])screw(gear,x+xx,yy,.455,'z',.018);
   cylinder(gear,metal,x,1.08,.65,.124,.15,'z',40);
   torus(gear,steel,x,1.08,.72,.128,.014,'z');
   for(let k=0;k<8;k++){const a=k*PI/4;cylinder(gear,steel,x+.178*Math.cos(a),1.08+.178*Math.sin(a),.57,.019,.035,'z',6);}
   for(let k=0;k<6;k++)box(gear,dark,x-.075+k*.03,1.08,.733,.011,.13,.009);
   cylinder(gear,steel,x+.27,1.40,.474,.077,.038,'z',36);
   cylinder(gear,materials.ivory,x+.27,1.40,.496,.065,.008,'z',36);
   rod(gear,dark,[x+.27,1.40,.503],[x+.302,1.437,.503],.004);
   plate(gear,dark,x-.23,1.40,.46,.23,.14,.027,.02);
   plate(gear,cold,x-.23,1.40,.48,.185,.093,.009,.012);
   for(const xx of [-.29,-.23,-.17])cylinder(gear,xx===-.17?hot:steel,x+xx,1.26,.47,.021,.03,'z',16);
   rod(gear,copper,[x-.40,.43,.54],[x-.40,.99,.54],.026);
   rod(gear,copper,[x-.40,.99,.54],[x-.10,.99,.54],.026);
   torus(gear,hot,x-.40,.66,.54,.067,.010,'y');

   rod(gear,steel,[x,1.58,-.35],[x,2.16,-.35],.077);
   cylinder(base,steel,x,H+.63,-.55,.113,1.34,'y',32);
   torus(base,metal,x,H+1.16,-.55,.132,.021,'y');
  }
 }else if(kind==='pump'){
  for(const x of [-.91,.91]){
   cylinder(gear,metal,x,.77,.01,.235,.66,'z',36);
   cylinder(gear,steel,x,.77,.44,.18,.21,'z',30);
   cylinder(gear,copper,x,.77,.60,.10,.22,'z',24);
   rod(gear,steel,[x,.80,-.44],[x,1.57,-.44],.066);
   rod(gear,steel,[x,1.57,-.44],[-1.34,1.57,-.44],.062);
  }
 }else{
  plate(gear,metal,0,.65,0,L*.64,D*.62,.31,.08,'y');
  box(gear,dark,-.56,1.09,-.02,L*.30,.82,D*.53);
  for(let k=0;k<7;k++)box(gear,steel,-.23+k*.14,1.11,.65,.039,.65,.055);
  cylinder(gear,steel,1.00,1.09,0,.32,.82,'x',30);
  plate(gear,metal,-.58,1.56,-.02,1.55,.50,.11,.04,'y');
  for(let k=0;k<6;k++){
   const xx=-1.20+k*.24;
   cylinder(gear,steel,xx,1.66,-.15,.066,.22,'y',20);
   rod(gear,copper,[xx,1.55,.22],[xx,1.32,.52],.039);
   screw(gear,xx,1.63,.03,'y',.025);
  }
  cylinder(gear,dark,-.65,1.89,-.19,.14,1.28,'x',32);
  torus(gear,steel,-1.25,1.89,-.19,.14,.017,'x');
  cylinder(gear,copper,-1.10,.87,.59,.08,.21,'y',24);
  for(let k=0;k<16;k++){
   const a=k*PI/8;box(gear,metal,1,1.09+.324*Math.cos(a),.324*Math.sin(a),.75,.018,.018);
  }
  plate(gear,finish,-1.68,1.10,.03,.12,.91,.96,.02,'x');
  for(let k=0;k<11;k++)box(gear,dark,-1.755,.73+k*.073,.03,.014,.017,.77);

 }
 const endDoor=spec.endDoor?part(base,ends,0,-ds):null;
 if(endDoor){
  const wall=base.children.find(node=>Math.abs(node.position.x-ends)<.04&&Math.abs(node.position.y-1.31)<.04);
  if(wall)wall.visible=false;
  plate(endDoor,finish,0,1.31,ds,.10,1.97,D-.05,.03);
  cylinder(endDoor,steel,.071,1.20,D-.19,.045,.065,'x',18);
 }
 const pose=p=>{
  if(endDoor)endDoor.rotation.y=1.22*p;
  doors[0].rotation.y=-2.42*ss(p,.10,.75);
  doors[1].rotation.y=2.42*ss(p,.10,.75);
  roof.position.set(.25*p,1.17*p,-.42*p);
  roof.visible=p<.82;panels.visible=p<.78;
  for(const child of base.children)if(child.isMesh&&Math.abs(child.position.z-ds)<.02&&Math.abs(child.position.y-H)<.02)child.visible=p<.82;

 };
 return {root,pose,focusRoot:gear,views:[cam([0,kind==='boiler'?1.76:1.34,0],11.1),cam([0,1.47,.38],8.95),cam([.07,1.37,.45],6.03,[.10,.48,1])]};
}

function fumeHood(spec={}){
 const root=new Group(),body=part(root),sash=part(root);
 const blue=tint(0x55768f);
 const W=spec.width||2.1,H=3.00,D=spec.depth||1.48;
 box(body,blue,0,.50,0,W,1.00,D);
 plate(body,steel,0,1.04,0,W+.12,D+.16,.13,.043,'y');
 for(const x of [-W/2,W/2])box(body,blue,x,2.00,0,.12,1.79,D);
 box(body,blue,0,2.00,-D*.49,W,1.79,.09);
 plate(body,blue,0,2.89,0,W,D,.17,.052,'y');
 cylinder(body,steel,0,3.06,-.19,.24,.23,'y',26);
 const panel=new MeshStandardMaterial({color:0xa5c8dc,transparent:true,opacity:.37,roughness:.28});
 rectangle(sash,steel,0,1.96,D/2+.05,W-.18,1.46,.058);
 plate(sash,panel,0,1.96,D/2+.067,W-.27,1.36,.023,.025);
 rod(sash,steel,[-.48,1.29,D/2+.10],[.48,1.29,D/2+.10],.026);
 const pose=p=>{sash.position.y=(spec.rise||.62)*ss(p,.1,.82);};
 return {root,pose,views:[cam([0,1.54,0],8.80),cam([0,1.68,.25],7.55),cam([.17,1.60,.47],5.04,[.60,.39,1])]};
}

function dryingDouble(spec={}){
 const root=new Group(),body=part(root),doors=part(root),racks=part(root);
 const coat=tint(spec.paint||0x768c99),h=2.83,w=spec.width||1.22,d=.87;
 for(const x of [-w/2,w/2])box(body,coat,x,h/2,0,.080,h,d);
 box(body,coat,0,h/2,-d/2,w,h,.085);
 for(const y of [.09,h-.076])plate(body,coat,0,y,0,w+.10,d+.13,.15,.045,'y');
 cylinder(body,steel,0,h+.08,-.14,.132,.21,'y',30);
 const leaves=[];
 for(const side of [-1,1]){
  const door=part(doors,side*w/2,.10,d/2+.025);
  const x=-side*w*.25;
  plate(door,coat,x,(h-.20)/2,0,w*.50-.023,h-.20,.075,.032);
  for(let k=0;k<6;k++)box(door,dark,x,.19+k*.039,.042,w*.34,.012,.012);
  cylinder(door,steel,-side*w*.40,h*.52,.065,.043,.057,'z',20);
  leaves.push({door,side});
 }
 const count=spec.shelves||3;
 for(let j=0;j<count;j++){
  const y=.55+j*1.63/Math.max(1,count-1);
  for(let i=0;i<14;i++)box(racks,steel,0,y,-.32+i*.047,w-.13,.018,.020);
  for(const x of [-w*.41,w*.41])box(racks,steel,x,y,0,.044,.044,d-.16);
 }
 if(spec.hanging)rod(body,steel,[-w*.44,2.52,0],[w*.44,2.52,0],.026);
 const pose=p=>{for(const {door,side} of leaves)door.rotation.y=side*1.45*ss(p,.07,.79);racks.position.z=.25*ss(p,.56,.94);};
 return {root,pose,views:[cam([0,1.44,0],7.6),cam([0,1.48,.19],6.3),cam([.01,1.59,.29],4.52,[.18,.34,1])]};
}

function blastCabinet(spec={}){
 const root=new Group(),frame=part(root),hatch=part(root,-1.25,0,.65),filter=part(root);
 const coat=tint(spec.paint||0x486a83),w=2.52,d=1.32;
 for(const x of [-w/2+.08,w/2-.08])for(const z of [-.56,.56])box(frame,coat,x,.67,z,.11,1.28,.11);
 for(const x of [-w/2,w/2])box(frame,coat,x,1.78,0,.12,1.22,d);
 for(const y of [1.18,2.40])plate(frame,coat,0,y,0,w+.07,d+.08,.13,.045,'y');
 box(frame,coat,0,1.80,-.65,w,1.22,.095);
 for(const x of [-.87,.87]){
  rod(frame,steel,[x,1.14,.49],[x,.63,.20],.045);
  rod(frame,steel,[x,1.14,-.49],[x,.63,-.20],.045);
 }
 plate(frame,dark,0,1.21,0,w-.16,d-.22,.074,.035,'y');
 for(let i=0;i<18;i++)box(frame,steel,-1.12+i*.132,1.255,0,.027,.027,1.10);
 plate(hatch,coat,w/2,1.78,0,w-.022,1.22,.10,.053);
 plate(hatch,clear,w/2,2.11,.071,1.57,.31,.05,.027);
 for(const x of [w*.34,w*.66])torus(hatch,steel,x,1.61,.074,.145,.031,'z');
 for(const x of [w*.34,w*.66])cylinder(hatch,dark,x,1.61,.070,.111,.065,'z',26);
 box(filter,coat,1.61,1.35,-.49,.48,1.45,.61);
 for(let j=0;j<7;j++)box(filter,dark,1.61,1.58+j*.06,-.17,.34,.018,.015);
 rod(filter,steel,[1.62,2.02,-.49],[1.26,2.19,-.54],.068);
 const pose=p=>{hatch.rotation.y=-1.45*ss(p,.10,.83);};
 return {root,pose,views:[cam([0,1.41,0],8.5),cam([0,1.75,.11],7.25),cam([.05,1.78,.27],4.95,[.16,.44,1])]};
}

function powderOven(spec={}){
 const root=new Group(),frame=part(root),doors=part(root),carrier=part(root);
 const W=2.88,D=spec.depth||3.65,H=2.86,coat=tint(0x628097);
 const half=W/2,face=D/2;
 plate(frame,dark,0,.13,0,W+.17,D+.10,.15,.045,'y');
 for(const x of [-half,half])box(frame,coat,x,H/2,0,.14,H,D);
 const topCover=plate(frame,coat,0,H,0,W+.11,D,.18,.05,'y');
 for(const x of [-half,half])for(const z of [-face,face])box(frame,steel,x,H/2,z,.13,H,.12);
 const leaves=[-1,1].map(side=>{
  const door=part(doors,side*half,0,face);
  plate(door,coat,-side*half/2,H/2,.035,half-.05,H-.13,.105,.05);
  rod(door,steel,[-side*half*.81,1.27,.115],[-side*half*.81,1.57,.115],.032);
  return door;
 });
 if(spec.pass){
  for(const x of [-.20,.20])box(frame,steel,x,H-.19,0,.052,.076,D+.41);
  box(carrier,dark,0,H-.23,0,.47,.11,.38);
  rod(carrier,steel,[0,H-.26,0],[0,1.88,0],.027);
  plate(carrier,copper,0,1.56,0,.66,.61,.053,.034);
 }else{
  box(frame,coat,0,H/2,-face,W,H,.12);
  for(const x of [-.66,.66])box(carrier,steel,x,.40,0,.058,.10,2.14);
  plate(carrier,steel,0,.48,0,1.56,2.11,.068,.041,'y');
 }
 const pose=(p,t=0)=>{
  if(spec.sliding){
   leaves[0].position.x=-half-1.28*ss(p,.12,.78);
   leaves[1].position.x=half+1.28*ss(p,.12,.78);
  }else{
   leaves[0].rotation.y=-2.40*ss(p,.12,.78);
   leaves[1].rotation.y=2.40*ss(p,.12,.78);
  }
  topCover.position.y=H+.86*p;topCover.visible=p<.82;
  doors.visible=p<.82;
  carrier.position.z=ss(p,.44,.92)*(spec.pass?1.05:.52);
 };
 return {root,pose,views:[cam([0,1.40,0],10.3),cam([0,1.55,.44],8.45),cam([.12,1.51,1.07],5.50,[.19,.39,1])]};
}

function guardPost(spec={}){
 const root=new Group(),frame=part(root),roof=part(root),windowParts=part(root),inner=part(root);
 const w=spec.w||2.55,d=spec.d||2.44,h=spec.h||2.66,top=h-.14;
 const enamel=tint(spec.paint||0x879a9e),trim=tint(0x324952);
 plate(frame,trim,0,.14,0,w+.08,d+.09,.23,.039,'y');
 for(const x of [-w/2,w/2])for(const z of [-d/2,d/2])box(frame,trim,x,h/2,z,.075,h,.075);
 const lengths=[w,d,w,d];
 for(let face=0;face<4;face++){
  const side=part(face===0?windowParts:frame),l=lengths[face],n=face===0&&spec.doorfront?2:1;
  side.rotation.y=face*PI/2;
  const z=(face%2?w:d)/2;
  for(let i=0;i<n;i++){
   const span=l/n,c=-l/2+(i+.5)*span;
   const glazed=face!==2||spec.wrap;
   if(!glazed){box(side,enamel,c,h/2,z,span-.07,h-.17,.068);continue;}
   if(face===0&&i===n-1&&spec.doorfront){
    plate(side,trim,c,h/2,z,span-.10,h-.24,.090,.03);
    plate(side,clear,c,h*.70,z+.052,span-.24,h*.34,.034,.028);
    cylinder(side,steel,c-span*.27,h*.46,z+.073,.039,.033,'z',12);
    continue;
   }
   const y=h*.65,vh=Math.min(.98,h*.44),vw=Math.min(span-.23,spec.wide?span-.23:1.10);
   box(side,enamel,c,(y-vh/2+.13)/2,z,span-.07,y-vh/2-.13,.070);
   box(side,enamel,c,(top+y+vh/2)/2,z,span-.07,top-y-vh/2,.070);
   for(const x of [c-span/2+(span-vw)/4,c+span/2-(span-vw)/4])box(side,enamel,x,y,z,(span-vw)/2,vh,.070);
   rectangle(side,trim,c,y,z+.018,vw,vh,.040);
   plate(side,clear,c,y,z+.025,vw-.061,vh-.059,.022,.018);
   if(face===0&&spec.hatch){
    rectangle(side,trim,c+vw*.23,y-vh*.28,z+.05,vw*.42,vh*.38,.026);
    box(side,steel,c+vw*.23,y-vh*.45,z+.15,vw*.47,.052,.24);
   }
  }
 }
 if(spec.partition)box(inner,enamel,.65,h*.44,-.25,.065,h*.74,d*.66);
 plate(roof,enamel,0,top+.052,0,w+.22,d+.22,.125,.034,'y');
 if(spec.wide)box(inner,steel,-w*.17,1.02,0,w*.43,.075,d*.38);
 const pose=p=>{roof.position.set(.25*p,.70*p,-.30*p);windowParts.position.set(-.28*p,0,.68*p);};
 return {root,pose,views:[cam([0,1.35,0],Math.max(7.8,w*2.15)),cam([0,1.38,.23],7.0),cam([0,1.47,.62],4.85,[.44,.41,1])]};
}

function checkpoint(){
 const root=new Group(),base=part(root),roof=part(root),front=part(root),details=part(root);
 const l=5.36,d=3.76,h=2.18,col=tint(0x9aaeb2),rim=tint(0x435965);
 plate(base,rim,0,.15,0,l+.12,d+.13,.20,.06,'y');
 for(const x of [-l/2,0,l/2])for(const z of [-d/2,0,d/2])box(base,rim,x,h/2,z,.078,h,.079);
 for(const [x,z] of [[-l/4,-d/4],[l/4,-d/4],[-l/4,d/4],[l/4,d/4]])plate(roof,col,x,h+.12,z,l*.488,d*.486,.13,.033,'y');
 for(const x of [-l/2,l/2])box(base,col,x,h/2,0,.075,h,d);
 box(base,col,0,h/2,-d/2,l,h,.075);
 for(const x of [-1.92,1.65]){
  box(front,col,x,.53,d/2,1.47,.98,.075);
  box(front,col,x,1.99,d/2,1.47,.43,.075);
  rectangle(front,rim,x,1.30,d/2,1.42,.69,.05);
  plate(front,clear,x,1.30,d/2+.014,1.34,.61,.029,.026);
 }
 for(const x of [-.66,.67])box(front,col,x,h/2,d/2,.55,h,.074);
 plate(front,rim,.01,1.18,d/2,.69,1.82,.074,.032);
 box(details,col,0,h*.46,-d*.31,l*.72,h*.73,.076);
 box(details,col,l*.23,h*.46,-d*.13,.076,h*.74,d*.42);
 cylinder(details,steel,-.29,.65,.60,.079,1.10,'y',24);
 const turnstile=part(details,-.29,1.16,.60);
 for(let i=0;i<3;i++){
  const a=i*PI*2/3;
  rod(turnstile,steel,[0,0,0],[.46*Math.cos(a),0,.46*Math.sin(a)],.032);
 }
 return {root,pose:(p,t=0)=>{roof.position.set(.28*p,.95*p,-.31*p);front.position.z=.91*p;turnstile.rotation.y=t*.80*p;},views:[cam([0,1.13,0],11.3),cam([0,1.36,.15],9.15),cam([-.20,1.08,.70],5.61,[.37,.44,1])]};
}

function profileRoll(){
 const root=new Group(),body=part(root),top=part(root),rollers=part(root),stock=part(root);
 const coat=tint(0x4c7385),rolled=tint(0xa56e4f);
 deck(body,3.15,1.86);
 plate(body,coat,0,1.05,-.23,1.62,1.22,1.57,.12);
 plate(body,steel,0,1.92,-.15,1.63,.54,.29,.075);
 plate(body,dark,.89,1.30,-.21,.30,.56,.58,.04);
 for(const [x,y] of [[-.54,1.40],[.54,1.40],[0,2.03]]){
  const g=part(y>1.8?top:rollers,x,y,.70);
  cylinder(g,steel,0,0,0,.198,.87,'z',34);
  for(const z of [-.29,-.095,.095,.29])cylinder(g,dark,0,0,z,.241,.086,'z',34);
  cylinder(g,steel,0,0,.45,.090,.073,'z',22);
  root.userData.shafts??=[];
  root.userData.shafts.push(g);
 }
 rod(body,steel,[0,2.18,.50],[0,2.69,.50],.043);
 torus(body,steel,0,2.70,.50,.19,.026,'y');
 for(let i=0;i<24;i++){
  const x=-1.56+i*.125, y=1.62+.15*x*x;
  const b=box(stock,rolled,x,y,.78,.14,.096,.14);b.rotation.z=Math.atan(.30*x);
 }
 const pose=(p,t=0)=>{
  top.position.y=.22*ss(p,.17,.72);
  stock.position.set(.44*p,0,.12*p);
  for(const [i,g] of root.userData.shafts.entries())g.rotation.z=(i===2?-1:1)*t*.63*p;
 };
 return {root,pose,views:[cam([0,1.37,0],8.8),cam([0,1.63,.21],7.30),cam([0,1.73,.63],5.1,[.44,.43,1])]};
}

function workwearDryer(){
 const root=new Group(),cab=part(root),contents=part(root),panels=part(root);
 const gray=tint(0x94a2a8),edge=tint(0x485b62);
 const w=2.78,d=.86,h=2.71;
 plate(cab,gray,0,.16,0,w,d,.22,.042,'y');
 plate(cab,gray,0,h,0,w+.06,d+.06,.13,.041,'y');
 for(const x of [-w/2,w/2])box(cab,gray,x,1.43,0,.075,2.51,d);
 box(cab,gray,0,1.44,-d/2,w,2.53,.074);
 for(const y of [.37,.64])box(contents,steel,0,y,0,w-.14,.043,d-.14);
 rod(contents,steel,[-1.28,2.36,0],[1.28,2.36,0],.027);
 for(let i=0;i<8;i++){
  const x=-1.08+i*.31, y=2.29;
  rod(contents,steel,[x,y+.03,0],[x-.11,y-.12,.03],.013);
  rod(contents,steel,[x,y+.03,0],[x+.11,y-.12,.03],.013);
  plate(contents,i%2?copper:edge,x,1.70,.019,.24,.98,.16,.05);
 }
 for(let i=0;i<9;i++)for(const x of [-.054,.054])plate(contents,edge,-1.12+i*.28+x,.47,.16,.091,.16,.23,.039);
 const doors=[-1,1].map(side=>{
  const hinge=part(panels,side*w/2,0,d/2);
  plate(hinge,gray,-side*w*.25,1.44,0,w*.495,2.49,.076,.034);
  box(hinge,edge,-side*w*.35,1.44,.069,.048,.28,.039);
  if(side===1)plate(hinge,dark,-side*w*.25,2.22,.046,.27,.17,.038,.025);
  return hinge;
 });
 return {root,pose:p=>{doors[0].rotation.y=-1.38*p;doors[1].rotation.y=1.38*p;},views:[cam([0,1.44,0],8.65),cam([0,1.51,.31],7.55),cam([.12,1.47,.53],5.07,[.43,.41,1])]};
}

function canopyExample(spec={}){
 const root=new Group(), columns=part(root), beams=part(root), roof=part(root);
 const w=spec.w||4.80,d=spec.d||4.00,h=spec.h||1.75,W=w/2,D=d/2;
 const finish=tint(spec.paint||0x445969);
 const shell=spec.steel?tint(0x596e7e):new MeshStandardMaterial({color:spec.tint||0x82b3bd,transparent:true,opacity:.50,roughness:.37,side:2});
 const top=x=>h+(spec.form==='arch'?.55*(1-(x/W)**2):spec.form==='lean'?.30+.48*(x/W):.70*(1-Math.abs(x/W)));
 const spacing=(count,edge)=>Array.from({length:count},(_,i)=>-edge+i*edge*2/(count-1));
 const xs=spec.mid?[-W,0,W]:[-W,W];
 const zs=spacing(spec.posts||3,D);
 const ribs=spacing(spec.ribs||spec.posts||3,D);
 feet(columns,xs,zs,h,finish);
 for(const x of xs)box(beams,finish,x,h,0,.12,.14,d+.15);
 for(const z of ribs){
  rod(beams,finish,[-W,h,z],[W,h,z],.042);
  for(let i=0;i<12;i++){
   const x=-W+i*w/12, x2=x+w/12;
   rod(beams,steel,[x,top(x),z],[x2,top(x2),z],.032);
   if(i%2&&i<11)rod(beams,finish,[x,h,z],[x2,top(x2),z],.018);
  }
 }
 for(const x of spacing(spec.purlins||10,W))box(beams,steel,x,top(x)+.030,0,.046,.048,d+.12);
 const cols=spec.form==='arch'?20:16;
 for(let i=0;i<cols;i++){
  const x=-W+(i+.5)*w/cols;
  const slope=Math.atan2(top(x+.03)-top(x-.03),.06);
  box(roof,shell,x,top(x)+.065,0,w/cols+.023,.032,d+.21).rotation.z=slope;
  if(spec.steel)for(const offset of [-.06,.06])box(roof,shell,x+offset,top(x+offset)+.088,0,.019,.038,d+.21).rotation.z=slope;
 }
 for(const x of xs)for(const z of zs){
  for(const ox of [-.074,.074])screw(columns,x+ox,.086,z,'y',.022);
 }
 const extent=Math.max(w,d);
 return {root,pose:p=>{roof.position.set(.18*p,.72*p,-.60*p);roof.rotation.x=-.13*p;},
 views:[cam([0,1.06,0],extent*2.21),cam([0,1.45,0],extent*1.83),cam([.18,1.63,.33],extent*1.21,[.58,.35,1])]};
}

function embeddedPc(){
 const root=new Group(), caseBody=part(root), cover=part(root), electronics=part(root);
 const w=3.43,d=2.45,h=1.02, silver=tint(0x889ba6);
 plate(caseBody,silver,0,.12,0,w,d,.15,.046,'y');
 for(const x of [-w/2,w/2])box(caseBody,silver,x,h*.44,0,.095,h*.68,d);
 box(caseBody,silver,0,h*.44,-d/2,w,.70,.095);
 for(const z of [-d/2-.11,d/2+.11])for(const x of [-w*.40,w*.40])plate(caseBody,steel,x,.12,z,.24,.38,.080,.029,'y');
 plate(cover,steel,0,h*.85,0,w,d,.10,.033,'y');
 for(let i=0;i<20;i++)box(cover,silver,-w*.46+i*w*.048,h*.97,0,.064,.15,d*.92);
 plate(electronics,tint(0x276957),0,.28,0,w*.88,d*.84,.055,.029,'y');
 plate(electronics,steel,.31,.39,-.15,.81,.78,.13,.035,'y');
 for(let i=0;i<7;i++)box(electronics,steel,.01+i*.10,.51,-.15,.034,.21,.71);
 for(let i=0;i<5;i++){
  const x=-1.34+i*.55;
  plate(caseBody,dark,x,.45,d*.49,.43,.23,.13,.03);
  box(caseBody,steel,x,.46,d*.54,.33,.16,.042);
  box(caseBody,dark,x,.46,d*.564,.24,.091,.018);
 }
 for(const x of [-1.18,1.18])for(const z of [-.77,.77])screw(electronics,x,.31,z,'y',.032);
 return {root,pose:p=>{cover.position.set(.36*p,.81*p,-.23*p); electronics.position.z=.32*p;},
 views:[cam([0,.52,0],7.9),cam([0,.66,.1],6.0),cam([.27,.52,.70],4.0,[.52,.52,1])]};
}

function enclosedMill(spec={}){
 const root=new Group(), base=part(root), tool=part(root), slide=part(root);
 const w=spec.w||3.1,d=spec.d||2.40,h=spec.h||3.16;
 const enamel=tint(spec.paint||0xc3d0d2), rim=tint(0x354753);
 deck(base,w,d);
 plate(base,enamel,0,.60,0,w,d,1.03,.055,'y');
 const wallHeight=h-1.15;
 const wallY=1.05+wallHeight/2;
 box(base,enamel,0,wallY,-d*.48,w,wallHeight,.12);
 for(const x of [-w/2,w/2])box(base,enamel,x,wallY,0,.12,wallHeight,d);
 const header=h-2.86;
 if(header>.1)box(base,enamel,0,2.77+header/2,d*.48,w,header,.11);
 plate(base,enamel,0,h-.09,0,w,d,.19,.052,'y');
 box(base,rim,0,2.33,-.77,1.74,.62,.27);
 const panel=part(base,w*.48,1.97,d*.52);
 plate(panel,rim,0,0,0,.42,.58,.10,.044);
 box(panel,tint(0x729aa2),0,.08,.061,.29,.23,.014);
 for(let i=0;i<4;i++)cylinder(panel,i===3?hot:steel,-.12+i*.078,-.16,.064,.020,.025,'z',16);
 for(const xx of [-w*.38,w*.38])for(const zz of [-d*.35,d*.35])screw(base,xx,1.15,zz,'y',.033);
 const door=part(root,spec.swing?w*.47:0,0,d*.50);
 const dx=spec.swing?-w*.43:0,dw=w*.84;
 rectangle(door,rim,dx,2.03,0,dw,1.71,.19);
 plate(door,clear,dx,2.10,.038,dw-.23,1.42,.026,.041);
 box(door,steel,dx-(spec.swing?dw*.40:.09),1.81,.092,.071,.31,.058);
 for(let i=0;i<5;i++)box(slide,steel,0,1.20,-.39+i*.17,w*.64,.094,.125);
 box(slide,copper,-.18,1.38,.00,.54,.25,.43);
 if(spec.rotary){
  cylinder(slide,steel,.60,1.46,0,.28,.30,'x',30);
  cylinder(slide,rim,.77,1.46,0,.20,.11,'x',24);
 }
 plate(tool,rim,0,2.54,-.29,.65,.68,.66,.067);
 cylinder(tool,steel,0,2.14,-.16,.22,.34,'y',26);
 cylinder(tool,copper,0,1.91,-.16,.054,.18,'y',18);
 torus(tool,steel,0,2.02,-.16,.21,.018,'y');
 for(let k=0;k<8;k++){const a=k*PI/4;screw(tool,.19*Math.cos(a),2.04,-.16+.19*Math.sin(a),'y',.017);}

 return {root,pose:(p,t=0)=>{
  if(spec.swing)door.rotation.y=2.35*ss(p,.08,.73);
  else door.position.x=-w*.76*ss(p,.08,.73);
  door.visible=p<.83;
  tool.position.y=-.25*ss(p,.48,.88);
  slide.position.x=.31*Math.sin(t*1.0)*ss(p,.42,.83);
 },views:[cam([0,1.58,0],9.1),cam([0,1.72,.31],7.2),cam([0,1.77,.44],5.15,[.40,.39,1])]};
}

const constructors={
 canopyExample,embeddedPc,enclosedMill,
 profileRoll,workwearDryer,
 guardPost,checkpoint:refinedCheckpoint,
 blast:blastCabinet,oven:powderOven,augerFeed:()=>screwConveyor(true,true),
 dryDouble:dryingDouble,
 substation:spec=>utilities(spec),boiler:spec=>utilities(spec,'boiler'),pumpHouse:refinedPumps,generatorCab:spec=>utilities(spec,'generator'),fume:fumeHood,
 smoker:spec=>cookingBox(spec),grill:spec=>cookingBox(spec,true),spiralStair,
 cableLadder,wheelBin,
 toolCabinet:spec=>toolStorage(spec),toolCart:spec=>toolStorage(spec,'cart'),workbench:spec=>toolStorage(spec,'bench'),gasCabinet:spec=>spec?.singleGas?refinedGas(spec):toolStorage(spec,'gas'),rack:spec=>warehouseRack(spec),shelfRack:spec=>warehouseRack(spec,'shelf'),cantilever:spec=>warehouseRack(spec,'cantilever'),scissorTable,
 ribbon:ribbonMixer,pressBrake:brakePress,
 flange:flangePair,manualBender,damper:airDamper,receiver:airReceiver,stairs:()=>publicModel('staircase'),glassRail:()=>publicModel('glass-rail'),kiosk:()=>publicModel('cafe'),
 router:gantryRouter,pressFrame:hydraulicPress,hydrocyl:hydroCylinder,augerDose:hopperDoser,greenhouse,
 paired:pairedModules,
 wafer:waferValve,swinggate:swingGate,
 auger:spec=>screwConveyor(false,false,spec),tubeAuger:spec=>screwConveyor(true,false,spec),tankmix:mixingTank,hookbin:hookContainer,drycab:()=>dryingCabinet(),drycab1:()=>dryingCabinet(1),drycabTall:()=>dryingCabinet(4,true),drycab6:()=>dryingCabinet(6,true),
 pack:()=>packaging('pack'),line:()=>packaging('line'),bottle:()=>packaging('bottle'),
 spiral:()=>conveyor(true),belt:()=>conveyor(false),robot:robotCell,
 edm:()=>workMachine('edm'),laser:()=>workMachine('laser'),laseropen:()=>workMachine('laseropen'),marker:()=>workMachine('marker'),benchmarker:benchMarker,
 compressor,heat:exchanger,ladder:platformLadder,carport:()=>structure('carport'),
 corrugated:()=>structure('corrugated'),arch:()=>structure('arch'),longArch:()=>structure('arch',1),tile:()=>structure('tile'),
 tent:()=>structure('tent'),gazebo:spec=>structure('gazebo',spec?.ornate?2:0),pergola:()=>structure('pergola'),
 garage:()=>structure('garage'),frame:()=>structure('frame'),module:spec=>moduleBlock(false,spec),mobileModule:()=>moduleBlock(true),seeder:()=>seeded(),shoeSeeder:()=>seeded(8,true),seed80:wideSeeder,trailer,screen:()=>screen(),screen2:()=>screen(2),
 cnc:()=>useStudio(makeCnc,'cnc'),openmill:()=>openMill(),universalMill:()=>openMill(true),incline:inclinedBelt,scissor:scissorLift,liftgate,board:()=>useStudio(makeElectronics,'board'),
 pump:()=>publicModel('pump'),valve:()=>publicModel('butterfly-valve'),
 motor:()=>publicModel('motor'),cylindreducer:cylinderReducer,reducer:()=>publicModel('reducer')
};
export async function createScene(id,config){const result=await constructors[id](config||undefined);result.pose(0,0);return result;}
