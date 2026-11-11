import {Group,MeshStandardMaterial,Shape,Path,ExtrudeGeometry,SphereGeometry} from '../../engine.js';
import {part,box,cylinder,torus,plate,rod,screw,label,shape,materials} from './models.js?v=refined-20261111';
const pi=Math.PI, steel=materials.aluminium, dark=materials.frame;
const paint=c=>new MeshStandardMaterial({color:c,metalness:.35,roughness:.38});
const grey=paint(0x9cabb4), blue=paint(0x356c91), red=paint(0x943b38), brass=materials.bronze;
const ease=(p,a,b)=>{let t=Math.max(0,Math.min(1,(p-a)/(b-a)));return t*t*(3-2*t)};
const cam=(target,distance,eye)=>({target,distance,eye});
function flange(g,x,y,z,r=.15,axis='z'){
 const a=part(g,x,y,z);if(axis==='y')a.rotation.x=-pi/2;if(axis==='x')a.rotation.y=pi/2;
 cylinder(a,steel,0,0,0,r,.055,'z',48);torus(a,dark,0,0,.032,r*.68,.012,'z');
 for(let k=0;k<8;k++){let t=k*pi/4;screw(a,Math.cos(t)*r*.81,Math.sin(t)*r*.81,.039,'z',.016)}
}
function slottedPanel(g,m,x,y,z,w,h){
 const s=new Shape();s.moveTo(-w/2,-h/2);s.lineTo(w/2,-h/2);s.lineTo(w/2,h/2);s.lineTo(-w/2,h/2);s.closePath();
 for(const yy of [-h*.34,h*.34])for(let k=0;k<7;k++){
  const t=new Path(),cy=yy+k*.034; t.moveTo(-w*.32,cy);t.lineTo(-w*.32,cy+.012);t.lineTo(w*.32,cy+.012);t.lineTo(w*.32,cy);t.closePath();s.holes.push(t);
 }
 const geo=new ExtrudeGeometry(s,{depth:.018,bevelEnabled:false});return shape(g,geo,m,x,y,z);
}
export function refinedGas(){
 const root=new Group(),body=part(root),door=part(root,.731,.075,.418),tanks=part(root);
 const W=1.48,H=2.8,D=.8;
 for(const x of [-.731,.731])box(body,grey,x,H/2,0,.018,H,D);
 box(body,grey,0,H/2,-.391,W,H,.018);
 for(const y of [.065,H-.018])plate(body,grey,0,y,0,W+.04,D+.035,.036,.016,'y');
 for(const x of [-.69,.69])box(body,dark,x,H/2,.376,.024,H-.08,.026);
 for(const y of [.12,H-.10])box(body,dark,0,y,.378,W-.09,.025,.025);
 slottedPanel(door,grey,-.725,(H-.15)/2,-.015,W-.045,H-.15);
 for(const y of [.13,H-.27])box(door,steel,-.725,y,-.045,W-.12,.028,.034);
 for(const y of [.34,H-.49]){cylinder(body,steel,.755,y,.415,.033,.14);torus(body,dark,.755,y,.415,.034,.004,'y');}
 cylinder(door,steel,-1.34,1.32,.033,.034,.042,'z');box(door,dark,-1.34,1.25,.057,.029,.13,.035);
 label(door,'ТМ-5',-.73,1.94,.023,.36,.08,'z','#34485a');
 for(const x of [-.355,.355]){
  const tank=part(tanks,x,.15,-.002);
  cylinder(tank,red,0,.94,0,.274,1.40,'y',64);
  for(const [y,sy] of [[.24,1],[1.64,1]]){let cap=shape(tank,new SphereGeometry(.274,48,24),red,0,y,0);cap.scale.y=.61;}
  cylinder(tank,red,0,.092,0,.247,.18,'y',48);torus(tank,dark,0,.025,0,.244,.015,'y');
  cylinder(tank,brass,0,1.86,0,.054,.15,'y',24);
  cylinder(tank,brass,.065,1.87,0,.034,.14,'x',20);torus(tank,dark,0,1.98,0,.072,.013,'y');
  for(let k=0;k<4;k++){let a=k*pi/2;rod(tank,dark,[0,1.98,0],[.063*Math.cos(a),1.98,.063*Math.sin(a)],.008)}
  label(tank,'50 л',0,1.06,.278,.27,.09,'z','#e7d2b8');
  torus(body,steel,x,.44,0,.287,.014,'y');
 }
 for(const x of [-.60,.60])for(const z of [-.27,.27])screw(body,x,.09,z,'y',.022);
 return {root,pose:p=>{door.rotation.y=2.46*ease(p,.03,.63)},views:[cam([.10,1.40,.03],6.9,[-.60,.35,1]),cam([.22,1.38,.12],6.7,[-.55,.32,1]),cam([.25,1.44,.06],6.5,[-.46,.22,1])],labels:['Шкаф в сборе','Открыть широкую створку','Два баллона и доступ к вентилям'],detail:'Демонстрационная комплектация, не монтажная инструкция'};
}
function pump(g,x,z){
 const a=part(g,x,0,z),v=paint(0x3c6b85);
 plate(a,dark,0,.20,0,.76,1.49,.10,.04,'y');
 for(const xx of [-.27,.27])for(const zz of [-.54,.54])screw(a,xx,.26,zz,'y',.024);
 cylinder(a,v,0,.61,-.25,.235,.59,'z',48);
 for(let i=0;i<18;i++){let t=i*pi/9;box(a,v,.242*Math.cos(t),.61+.242*Math.sin(t),-.25,.025,.025,.55)}
 cylinder(a,dark,0,.61,-.59,.25,.08,'z',40);
 for(let i=0;i<14;i++){let t=i*pi/7;rod(a,steel,[.07*Math.cos(t),.61+.07*Math.sin(t),-.637],[.20*Math.cos(t),.61+.20*Math.sin(t),-.637],.007)}
 box(a,blue,0,.95,-.30,.24,.16,.23);for(const xx of [-.084,.084])for(const zz of [-.38,-.22])screw(a,xx,1.04,zz,'y',.015);
 cylinder(a,steel,0,.61,.12,.085,.19,'z',32);
 cylinder(a,v,0,.61,.34,.31,.22,'z',56);
 flange(a,0,.61,.48,.28);
 cylinder(a,v,0,.95,.31,.087,.42,'y',32);flange(a,0,1.15,.31,.15,'y');
 flange(a,0,.61,.56,.14);
 for(const xx of [-.20,.20])box(a,v,xx,.34,-.25,.10,.15,.33);
}
export function refinedPumps(){
 const root=new Group(),base=part(root),shell=part(root),roof=part(root),front=part(root),equipment=part(root);
 const L=4.8,D=2.7,H=2.8;
 plate(base,dark,0,.13,0,L+.12,D+.12,.23,.04,'y');
 plate(base,steel,0,.27,0,L,D,.045,.018,'y');
 for(const x of [-L/2,L/2])for(const z of [-D/2,D/2])box(base,blue,x,1.55,z,.09,H-.15,.09);
 for(const z of [-D/2,D/2])for(const y of [.32,H])box(base,blue,0,y,z,L,.09,.09);
 for(const x of [-L/2,L/2])box(shell,grey,x,1.57,0,.06,H-.35,D);
 box(shell,grey,0,1.57,-D/2,L,H-.35,.06);
 for(let i=0;i<16;i++)box(shell,steel,-2.25+i*.3,1.57,-D/2-.035,.012,H-.40,.012);
 for(const x of [-1.64,1.64])box(front,grey,x,1.57,D/2,1.44,H-.35,.06);
 for(const x of [-.43,.43]){
  plate(front,grey,x,1.52,D/2+.012,.835,2.30,.06,.022);
  cylinder(front,steel,x+(x<0?.32:-.32),1.42,D/2+.07,.027,.04,'z',16);
  for(let k=0;k<7;k++)box(front,dark,x,.73+k*.035,D/2+.049,.53,.012,.012);
 }
 plate(roof,grey,0,H+.04,0,L+.18,D+.18,.10,.025,'y');
 for(let k=0;k<18;k++)box(roof,steel,-2.29+k*.27,H+.10,0,.025,.025,D+.10);
 for(const x of [-1.0,.4])pump(equipment,x,-.05);
 for(const z of [-.9,.93]){
  const y=z<0?1.51:.61;
  cylinder(equipment,blue,-.20,y,z,.09,3.6,'x',40);
  for(const x of [-1,.4]){
   if(z<0){rod(equipment,blue,[x,1.15,.31],[x,1.51,.31],.078);rod(equipment,blue,[x,1.51,.31],[x,1.51,z],.078);flange(equipment,x,1.51,-.45,.145);}
   else{rod(equipment,blue,[x,.61,.56],[x,.61,.93],.078);flange(equipment,x,.61,.74,.14);}
  }
 }
 for(const x of [-1,.4]){
  cylinder(equipment,brass,x,1.70,-.9,.033,.25,'y',24);
  cylinder(equipment,steel,x,1.88,-.9,.092,.045,'z',36);
  cylinder(equipment,materials.ivory,x,1.88,-.871,.078,.008,'z',36);
  rod(equipment,dark,[x,1.88,-.864],[x+.034,1.927,-.864],.005);
  torus(equipment,red,x,1.68,-.9,.12,.014,'y');
 }
 plate(equipment,grey,1.64,1.43,-.88,.78,1.47,.35,.035);
 label(equipment,'АНУ',1.64,1.74,-.694,.32,.09,'z','#263443');
 for(const xx of [1.48,1.63,1.78])cylinder(equipment,xx===1.78?red:materials.green,xx,1.43,-.689,.035,.018,'z',20);
 const pose=p=>{const e=ease(p,.10,.68);roof.position.set(0,e*1.65,-e*.4);front.position.set(0,0,e*1.9);front.visible=p<.76;roof.visible=p<.82;};
 return {root,pose,views:[cam([0,1.43,0],12.9,[.73,.48,1]),cam([0,1.25,0],11.3,[.70,.68,1]),cam([-.38,1.06,.18],6.9,[.42,.69,1])],labels:['Станция в сборе','Обзор под съемными панелями','Насосы, коллекторы и арматура'],detail:'Внутренняя компоновка условная, по согласованным чертежам уточняется'};
}
export function refinedCheckpoint(){
 const root=new Group(),base=part(root),roofs=[],front=part(root),inner=part(root);
 const L=7.2,D=4.7,H=2.9;
 for(const x of [-L/4,L/4])for(const z of [-D/4,D/4]){
  const section=part(base,x,0,z);plate(section,dark,0,.13,0,L/2-.03,D/2-.03,.22,.024,'y');
  for(const xx of [-L/4,L/4])for(const zz of [-D/4,D/4])box(section,blue,xx,H/2,zz,.09,H,.09);
  const r=part(root,x,H+.04,z);plate(r,grey,0,0,0,L/2-.018,D/2-.018,.12,.023,'y');
  roofs.push({g:r,x,z});
 }
 for(const x of [-L/2,L/2])box(base,grey,x,H/2,0,.065,H,D);
 box(base,grey,0,H/2,-D/2,L,H,.065);
 for(const x of [-2.5,2.5]){
  box(front,grey,x,.55,D/2,2.15,1.10,.065);box(front,grey,x,2.65,D/2,2.15,.50,.065);
  for(const xx of [x-.99,x+.99])box(front,grey,xx,1.72,D/2,.15,1.22,.065);
  for(const xx of [x-.89,x+.89,x])box(front,steel,xx,1.72,D/2,.035,1.22,.05);
  for(const y of [1.12,2.32])box(front,steel,x,y,D/2,1.82,.035,.05);
  plate(front,materials.glass,x,1.72,D/2,1.79,1.16,.020,.01);
 }
 for(const x of [-1.1,1.1])box(front,grey,x,H/2,D/2,.55,H,.065);
 plate(front,blue,0,1.36,D/2,.99,2.50,.07,.025);cylinder(front,steel,.36,1.25,D/2+.055,.033,.04,'z',20);
 for(const x of [-.80,.80])box(inner,grey,x,1.05,-.8,.055,2.1,2.9);
 plate(inner,grey,-2.20,.91,.08,1.70,.80,.07,.028,'y');
 for(const x of [-2.8,-1.6])box(inner,steel,x,.54,.08,.05,.7,.05);
 box(inner,dark,-2.2,1.18,-.02,.43,.28,.05);plate(inner,materials.light,-2.2,1.18,.009,.37,.22,.008,.01);
 for(const x of [-.58,.58])for(const z of [-1.8,.28]){cylinder(inner,steel,x,.64,z,.034,1.07,'y',24);}
 for(const x of [-.58,.58])rod(inner,steel,[x,1.14,-1.8],[x,1.14,.28],.030);
 const turn=part(inner,0,1.05,.65);box(inner,steel,0,.66,.65,.23,.92,.30);
 cylinder(turn,dark,0,0,0,.13,.15,'z',32);
 const arms=part(turn,0,0,.12);
 for(let i=0;i<3;i++){let a=pi/6+i*pi*2/3;rod(arms,steel,[0,0,0],[.56*Math.cos(a),.56*Math.sin(a),.28],.026);}
 for(let x=-3.2;x<3.6;x+=.40)box(base,steel,x,.252,0,.004,.002,D-.1);
 return {root,pose:(p,t=0)=>{const e=ease(p,.10,.72);roofs.forEach(({g,x,z})=>{g.position.y=H+.04+e*1.9;g.position.x=x+Math.sign(x)*e*.15;});front.position.z=e*1.8;front.visible=p<.76;roofs.forEach(({g})=>g.visible=p<.82);arms.rotation.z=-t*.52*ease(p,.6,.85)},views:[cam([0,1.32,0],18.5,[.85,.60,1]),cam([0,.95,0],16.6,[.7,1,1]),cam([0,.96,.25],8.9,[-.25,.75,1])],labels:['Четыре блок-контейнера','Открыть обзор внутренней компоновки','Турникет и проход посетителей'],detail:'Демонстрационная планировка, не рабочий проект здания'};
}
