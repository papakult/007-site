import * as T from '../engine.js';
import {LatheGeometry,TubeGeometry,CatmullRomCurve3,Vector2,Box3} from '../flashlight-geometry.js';
import {InstancedMesh,Matrix4} from './instancing.js';

const PI=Math.PI;
const Y=new T.Vector3(0,1,0), Z=new T.Vector3(0,0,1);
const center=8.11;
const V=p=>new T.Vector3(...p);
const mat=(color,metalness=.55,roughness=.33)=>new T.MeshStandardMaterial({color,metalness,roughness});
const paint=mat(0xe45122,.48,.30),paintDark=mat(0x9d321d,.43,.38),frameMat=mat(0x263139,.64,.36);
const zinc=mat(0xb4bbc0,.82,.25),metal=mat(0x79858d,.76,.33),black=mat(0x15191c,.10,.64);
const brass=mat(0xaf9463,.73,.28),blue=mat(0x3879a0,.42,.40),red=mat(0xb63829,.25,.43);
const lampRed=new T.MeshStandardMaterial({color:0xa81e13,emissive:0x681305,emissiveIntensity:.43,roughness:.23});
const amber=new T.MeshStandardMaterial({color:0xf8a31c,emissive:0x9c4b00,emissiveIntensity:.30,roughness:.22});
const whiteLamp=mat(0xc9dce0,.15,.20);
const geometryCache=new Map();
const geom=(key,fn)=>{if(!geometryCache.has(key))geometryCache.set(key,fn());return geometryCache.get(key);};

export function createRockson(){
 const root=new T.Group(),assemblies=[],parts=[],banks=[],layers=[];
 let inspection=null;
 let partsCount=0,boltCount=0;
 root.name='ROCKSON 989150-УГ-45';
 function assembly(id,name,offset){
  const group=new T.Group();
  group.name=name;group.userData.assembly=id;
  root.add(group);
  const entry={id,name,group,offset:V(offset),origin:group.position.clone(),children:[]};
  assemblies.push(entry);
  return entry;
 }
 function sub(owner,name,offset=[0,0,0]){
  const group=new T.Group();owner.group.add(group);
  group.name=name;
  const entry={group,origin:group.position.clone(),offset:V(offset)};
  owner.children.push(entry);layers.push(entry);
  return group;
 }
 function record(mesh,name,owner){
  mesh.name=name;mesh.userData.partId=parts.length;mesh.userData.assembly=owner.id;
  parts.push({id:parts.length,name,object:mesh,assembly:owner.id});
  partsCount++;
  return mesh;
 }
 function mesh(parent,geometry,material,name,owner){
  const m=new T.Mesh(geometry,material);parent.add(m);return record(m,name,owner);
 }
 function box(parent,material,p,size,name,owner){
  const m=mesh(parent,geom('b'+size.join(),()=>new T.BoxGeometry(...size)),material,name,owner);
  m.position.copy(V(p));return m;
 }
 function cyl(parent,material,p,r,len,axis,name,owner,segments=32,r2=r){
  const m=mesh(parent,geom('c'+[r,len,segments,r2].join(),()=>new T.CylinderGeometry(r,r2,len,segments)),material,name,owner);
  m.position.copy(V(p));
  if(axis==='z')m.rotation.x=PI/2;
  if(axis==='x')m.rotation.z=PI/2;
  return m;
 }
 function ring(parent,material,p,r,t,axis,name,owner){
  const m=mesh(parent,geom('r'+r+','+t,()=>new T.TorusGeometry(r,t,8,28)),material,name,owner);
  m.position.copy(V(p));
  if(axis==='y')m.rotation.x=PI/2;
  if(axis==='x')m.rotation.y=PI/2;
  return m;
 }
 function rod(parent,material,a,b,r,name,owner){
  const av=V(a),bv=V(b),m=mesh(parent,new T.CylinderGeometry(r,r,av.distanceTo(bv),12),material,name,owner);
  m.position.copy(av).add(bv).multiplyScalar(.5);m.quaternion.setFromUnitVectors(Y,bv.sub(av).normalize());return m;
 }
 function tube(parent,material,points,r,name,owner){
  const curve=new CatmullRomCurve3(points.map(V));
  return mesh(parent,new TubeGeometry(curve,Math.max(12,points.length*6),r,7,false),material,name,owner);
 }
 function profile(parent,material,xy,depth,z,name,owner,holes=[]){
  const shape=new T.Shape();shape.moveTo(...xy[0]);xy.slice(1).forEach(p=>shape.lineTo(...p));shape.closePath();
  for(const rect of holes){const h=new T.Path();const [x,y,w,d]=rect;h.moveTo(x,y);h.lineTo(x,y+d);h.lineTo(x+w,y+d);h.lineTo(x+w,y);h.closePath();shape.holes.push(h);}
  const m=mesh(parent,new T.ExtrudeGeometry(shape,{depth,bevelEnabled:false}),material,name,owner);m.position.z=z-depth/2;return m;
 }
 function bolts(owner){
  const batch={owner,entries:[],meshes:[]};banks.push(batch);
  return (parent,p,dir,diam=.016,name='Болт с шайбой и гайкой')=>{
   batch.entries.push({parent,p:V(p),dir:V(dir),diam,name,id:boltCount++});partsCount+=4;
  };
 }
 function instance(parent,geometry,material,transforms){
  const m=new InstancedMesh(geometry,material,transforms.length);
  transforms.forEach((t,i)=>m.setMatrixAt(i,t));m.instanceMatrix.needsUpdate=true;parent.add(m);
  return m;
 }
 function checker(parent,w,d,p,owner){
  box(parent,paint,p,[w,.022,d],'Стальной лист настила',owner);
  const transforms=[],dummy=new T.Group();
  for(let x=-w/2+.07;x<w/2-.04;x+=.125)for(let z=-d/2+.055;z<d/2-.04;z+=.135){
   dummy.position.set(p[0]+x,p[1]+.014,p[2]+z);dummy.rotation.set(0,(Math.round(x/.125)+Math.round(z/.135))%2?-.70:.70,0);dummy.updateMatrix();transforms.push(dummy.matrix.clone());
  }
  const m=instance(parent,geom('tread',()=>new T.BoxGeometry(.071,.004,.013)),paint,transforms);
  record(m,'Рифление настила',owner);
 }
 const chassis=assembly('frame','Сварная рама и поперечины',[0,0,0]),boltFrame=bolts(chassis);
 const deck=assembly('deck','Секционный настил и уширители',[0,1.05,0]),boltDeck=bolts(deck);
 const neck=assembly('neck','Передняя площадка и шкворень',[-.72,.35,0]),boltNeck=bolts(neck);
 const legs=assembly('legs','Опорные стойки и ручной привод',[-.30,-.65,1.05]),boltLeg=bolts(legs);
 const air=assembly('air','Пневмосистема и тормозные магистрали',[0,-.55,-1.22]),boltAir=bolts(air);
 const guards=assembly('guards','Боковая защита и инструментальный ящик',[0,.12,1.10]),boltGuard=bolts(guards);
 const stakes=assembly('stakes','Съемные коники и увязочные кольца',[0,.87,0]),boltStake=bolts(stakes);
 const lamps=assembly('electric','Светотехника и кабельная трасса',[.52,0,-.77]),boltLamp=bolts(lamps);
 const ramps=assembly('ramps','Уголковые аппарели и шарниры',[1.15,.32,0]),boltRamp=bolts(ramps);
 const axles=[0,1,2].map(i=>assembly('axle'+i,'Ось '+(i+1)+'. Колеса, ступицы и подвеска',[0,-.69,(i-1)*1.03]));
 const orangeWeb=[[.02,1.59],[2.94,1.59],[3.88,1.29],[14.80,1.29],[14.82,.97],[3.83,.97],[2.86,1.28],[.02,1.28]];
 for(const z of [-.83,.83]){
  profile(chassis.group,paint,orangeWeb,.021,z,'Стенка силового лонжерона',chassis);
  for(const [a,b,y] of [[.02,2.92,1.60],[3.88,14.79,1.30],[.02,2.86,1.27],[3.83,14.79,.96]]){
   box(chassis.group,paint,[(a+b)/2-center,y,z],[b-a,.027,.22],'Полка двутаврового лонжерона',chassis);
  }
 }
 // The side profile is authored in drawing coordinates, then centered.
 for(const mesh of chassis.group.children)if(mesh.geometry?.type==='ExtrudeGeometry')mesh.position.x=-center;
 for(let i=0;i<26;i++){
  const x=3.96+i*(10.75/25)-center;
  box(chassis.group,frameMat,[x,1.15,0],[.086,.19,2.48],'Поперечина рамы '+(i+1),chassis);
  for(const z of [-.83,.83])for(const sign of [-1,1]){
   boltFrame(chassis.group,[x+sign*.055,1.235,z],[0,1,0],.014,'Крепление поперечины '+(i+1));
  }
 }
 for(const side of [-1,1]){
  const z=side*1.265;
  const xy=[[3.94-center,1.33],[14.77-center,1.33],[14.77-center,1.13],[3.94-center,1.13]];
  const holes=Array.from({length:21},(_,i)=>[4.11-center+i*.497,1.188,.19,.087]);
  profile(chassis.group,paint,xy,.036,z,'Боковой профиль с такелажными карманами',chassis,holes);
  box(chassis.group,paint,[9.36-center,1.344,z],[10.81,.035,.11],'Бортовой верхний пояс',chassis);
 }
 for(let j=0;j<9;j++){
  const panel=sub(deck,'Панель настила '+(j+1),[0,.12+(j%3)*.13,(j%2?1:-1)*.18]);
  const x=4.55+j*1.192-center;
  checker(panel,1.174,2.42,[x,1.35,0],deck);
  for(const dx of [-.47,.47])for(const z of [-1.08,1.08])boltDeck(panel,[x+dx,1.367,z],[0,1,0],.012,'Крепление панели настила '+(j+1));
 }
 for(const side of [-1,1])for(let i=0;i<8;i++){
  const x=4.38+i*1.33-center,z=side*1.27;
  const arm=sub(deck,'Уширитель '+(side>0?'правый ':'левый ')+(i+1),[0,.1,side*.34]);
  box(arm,frameMat,[x,1.16,z+side*.08],[.21,.11,.30],'Телескопический кронштейн уширителя',deck);
  checker(arm,1.25,.22,[x,1.34,z+side*.19],deck);
  cyl(arm,zinc,[x,1.18,z+side*.20],.017,.24,'x','Стопорный палец уширителя',deck,20);
  ring(arm,zinc,[x+.13,1.18,z+side*.20],.034,.005,'x','Чека стопорного пальца',deck);
 }
 // Raised forward deck, spare wheel cradle and the kingpin.
 checker(neck.group,2.86,2.43,[1.48-center,1.64,0],neck);
 for(const side of [-1,1]){
  box(neck.group,paint,[1.48-center,1.39,side*1.23],[2.86,.40,.070],'Борт передней площадки',neck);
  for(let i=0;i<7;i++)boltNeck(neck.group,[.27+i*.40-center,1.48,side*1.273],[0,0,side],.016,'Крепеж переднего борта');
  for(const x of [.17,2.78])box(neck.group,frameMat,[x-center,1.85,side*1.22],[.055,.43,.055],'Стойка переднего ограждения',neck);
  box(neck.group,frameMat,[1.47-center,2.06,side*1.22],[2.65,.045,.045],'Поручень передней площадки',neck);
 }
 cyl(neck.group,zinc,[1.12-center,1.22,0],.047,.22,'y','Шкворень сцепного устройства',neck,40);
 cyl(neck.group,metal,[1.12-center,1.30,0],.11,.055,'y','Опорный фланец шкворня',neck,40);
 for(let j=0;j<8;j++){const a=j*PI/4;boltNeck(neck.group,[1.12-center+.155*Math.cos(a),1.323,.155*Math.sin(a)],[0,1,0],.018,'Болт опорной плиты шкворня');}
 for(const x of [.36,2.57])box(neck.group,frameMat,[x-center,1.54,0],[.16,.20,2.30],'Усилитель передней площадки',neck);
 // JOST-type telescopic landing legs.
 for(const side of [-1,1]){
  const x=4.33-center,z=side*.91;
  box(legs.group,paint,[x,1.04,z],[.25,.58,.23],'Кронштейн опоры',legs);
  box(legs.group,frameMat,[x,.74,z],[.155,.86,.155],'Корпус выдвижной опоры',legs);
  box(legs.group,zinc,[x,.35,z],[.109,.70,.109],'Внутренний шток опоры',legs);
  cyl(legs.group,zinc,[x,.085,z],.052,.25,'z','Ось башмака опоры',legs,24);
  box(legs.group,frameMat,[x,.044,z],[.36,.063,.32],'Опорный башмак',legs);
  for(const dx of [-.082,.082])for(const y of [.91,1.07,1.23])boltLeg(legs.group,[x+dx,y,z+side*.13],[0,0,side],.018,'Монтажный болт опорной стойки');
 }
 rod(legs.group,zinc,[4.33-center,.93,-.95],[4.33-center,.93,.95],.022,'Поперечный привод опор',legs);
 tube(legs.group,zinc,[[4.33-center,.93,1.02],[4.33-center,.93,1.46],[4.49-center,.93,1.46],[4.49-center,.71,1.46]],.017,'Складная рукоятка опор',legs);
 cyl(legs.group,black,[4.49-center,.66,1.46],.026,.18,'y','Рукоятка вращения',legs,20);
 for(const side of [-1,1])rod(legs.group,frameMat,[4.33-center,.52,side*.91],[5.12-center,1.14,side*.72],.025,'Диагональный подкос опоры',legs);
 // Underrun side rails and a removable toolbox.
 for(const side of [-1,1]){
  for(const x of [5.23,7.03,8.83]){
   box(guards.group,paint,[x-center,.87,side*1.08],[.078,.62,.075],'Подвес боковой защиты',guards);
   for(const y of [1.06,1.18])boltGuard(guards.group,[x-center,y,side*1.13],[0,0,side],.016,'Болт подвеса боковой защиты');
  }
  for(const y of [.47,.72])box(guards.group,frameMat,[7.07-center,y,side*1.18],[4.25,.095,.067],'Продольная балка боковой защиты',guards);
 }
 const toolbox=sub(guards,'Инструментальный ящик',[0,0,.33]);
 box(toolbox,frameMat,[6.30-center,.95,-.80],[1.08,.43,.61],'Корпус инструментального ящика',guards);
 box(toolbox,black,[6.30-center,.95,-1.12],[1.02,.37,.038],'Крышка инструментального ящика',guards);
 for(const x of [5.93,6.67]){
  box(toolbox,zinc,[x-center,.98,-1.147],[.067,.13,.025],'Замок крышки ящика',guards);
  boltGuard(toolbox,[x-center,1.15,-1.15],[0,0,-1],.010,'Винт крышки инструментального ящика');
 }
 // Removable side stakes and lashing rings.
 for(const side of [-1,1]){
  for(const x of [5.34,8.11,10.89,13.70]){
   const g=sub(stakes,'Съемный коник',[0,.16,side*.25]);
   box(g,frameMat,[x-center,2.10,side*1.19],[.085,1.54,.085],'Коник из профильной трубы',stakes);
   box(g,paint,[x-center,1.40,side*1.19],[.128,.23,.127],'Гнездо коника',stakes);
   cyl(g,zinc,[x-center,1.41,side*1.19],.013,.18,'z','Стопор коника',stakes,16);
   boltStake(g,[x-center,1.32,side*1.24],[0,0,side],.014,'Фиксатор гнезда коника');
  }
  for(let i=0;i<13;i++){
   const x=4.16+i*.865-center,z=side*1.16;
   const r=ring(stakes.group,metal,[x,1.40,z],.046,.011,'x','Петля увязки груза',stakes);r.rotation.z=.22*side;
   box(stakes.group,paint,[x,1.37,z],[.14,.026,.09],'Основание такелажной петли',stakes);
   for(const dx of [-.049,.049])boltStake(stakes.group,[x+dx,1.392,z],[0,1,0],.012,'Крепление такелажной петли');
  }
 }
 // Pneumatic tanks, manifold, supply lines and cable clips.
 for(const [x,z] of [[7.83,-.48],[8.77,.48]]){
  cyl(air.group,frameMat,[x-center,.91,z],.15,.76,'x','Ресивер пневмосистемы',air,40);
  for(const dx of [-.23,.23]){
   ring(air.group,zinc,[x+dx-center,.91,z],.158,.014,'x','Хомут ресивера',air);
   boltAir(air.group,[x+dx-center,1.05,z+.12],[0,1,0],.012,'Крепление хомута ресивера');
  }
  cyl(air.group,brass,[x-center,.735,z],.024,.06,'y','Сливной клапан ресивера',air,16);
 }
 box(air.group,metal,[9.35-center,.98,0],[.30,.18,.23],'Демонстрационный клапанный блок EBS',air);
 for(let i=0;i<4;i++)cyl(air.group,brass,[9.25+i*.07-center,.98,.15],.019,.10,'z','Штуцер пневмоблока',air,12);
 for(const [material,z] of [[red,-.16],[amber,.16]]){
  tube(air.group,material,[[.70-center,1.55,z],[3.50-center,1.10,z],[7.7-center,1.00,z],[9.35-center,.98,z]],.015,'Питающая магистраль пневмосистемы',air);
  for(let i=0;i<11;i++)box(air.group,zinc,[3.8+i*.50-center,1.01,z],[.033,.043,.050],'Клипса магистрали',air);
 }
 // Axles with hubs, brake discs, trailing arms, airbags and tire tread.
 function wheel(parent,x,side,owner,addBolt,spare=false){
  const g=new T.Group();parent.add(g);g.position.set(x,.54,side*1.055);
  const profilePoints=[[.296,-.185],[.34,-.208],[.48,-.20],[.525,-.15],[.537,-.10],[.537,.10],[.525,.15],[.48,.20],[.34,.208],[.296,.185]].map(([r,h])=>new Vector2(r,h));
  const tireParts=sub(owner,'Шина с протектором',[0,0,side*.86]);g.add(tireParts);
  const rimParts=sub(owner,'Колесный диск',[0,0,side*.42]);g.add(rimParts);
  const capParts=sub(owner,'Крышка ступицы и крепёж',[0,0,side*1.27]);g.add(capParts);
  const bearingParts=sub(owner,'Подшипники ступицы',[0,0,-side*.32]);g.add(bearingParts);
  const tire=mesh(tireParts,new LatheGeometry(profilePoints,60),black,'Шина 385/65 R22.5',owner);tire.rotation.x=PI/2;
  const treadMatrices=[],dummy=new T.Group();
  for(let n=0;n<66;n++)for(let r=0;r<3;r++){
   const a=n*2*PI/66+(r%2)*.028;
   dummy.position.set(.539*Math.cos(a),.539*Math.sin(a),(r-1)*.090);
   dummy.rotation.set(0,0,a-PI/2);dummy.updateMatrix();treadMatrices.push(dummy.matrix.clone());
  }
  const tread=instance(tireParts,geom('rubberTread',()=>new T.BoxGeometry(.047,.012,.070)),black,treadMatrices);record(tread,'Блоки протектора шины',owner);
  const rimProfile=[[.14,-.18],[.26,-.18],[.295,-.167],[.306,-.13],[.295,.12],[.29,.18],[.24,.18],[.17,.10],[.14,.04]].map(([r,h])=>new Vector2(r,h));
  const rim=mesh(rimParts,new LatheGeometry(rimProfile,48),metal,'Стальной колесный диск R22.5',owner);rim.rotation.x=PI/2;
  const discShape=new T.Shape();discShape.absarc(0,0,.25,0,2*PI,false);
  for(let n=0;n<10;n++){
   const a=n*PI/5,hole=new T.Path();hole.absarc(.195*Math.cos(a),.195*Math.sin(a),.032,0,2*PI,true);discShape.holes.push(hole);
  }
  const disc=mesh(rimParts,new T.ExtrudeGeometry(discShape,{depth:.033,bevelEnabled:false}),metal,'Диск с вентиляционными отверстиями',owner);disc.position.z=side*.12;
  cyl(g,zinc,[0,0,side*.14],.119,.16,'z','Ступица колеса',owner,40);
  cyl(capParts,frameMat,[0,0,side*.229],.078,.048,'z','Крышка ступицы',owner,32);
  for(let n=0;n<10;n++){
   const a=n*PI/5;addBolt(g,[.146*Math.cos(a),.146*Math.sin(a),side*.17],[0,0,side],.022,'Колесная шпилька M22 и гайка');
  }
  for(let n=0;n<6;n++){
   const a=n*PI/3;addBolt(capParts,[.058*Math.cos(a),.058*Math.sin(a),side*.26],[0,0,side],.008,'Винт крышки ступицы');
  }
  const canvas=document.createElement('canvas');canvas.width=canvas.height=512;
  const context=canvas.getContext('2d');
  context.translate(256,256);
  context.fillStyle='#596166';context.font='500 18px sans-serif';context.textAlign='center';
  const text='385/65 R22.5  •  TUBELESS';
  for(let i=0;i<text.length;i++){
   const a=-1.24+i*.085;
   context.save();context.rotate(a);context.fillText(text[i],0,-211);context.restore();
  }
  const markingMaterial=new T.MeshBasicMaterial({map:new T.CanvasTexture(canvas),transparent:true,depthWrite:false,side:T.DoubleSide});
  const marking=mesh(tireParts,new T.PlaneGeometry(1.07,1.07),markingMaterial,'Маркировка боковины шины',owner);
  marking.position.z=side*.214;marking.rotation.y=side>0?0:PI;
  for(const axial of [-.075,.055]){
   ring(bearingParts,zinc,[0,0,axial],.102,.012,'z','Наружное кольцо подшипника',owner);
   ring(bearingParts,zinc,[0,0,axial],.055,.010,'z','Внутреннее кольцо подшипника',owner);
   for(let i=0;i<14;i++){
    const a=i*PI/7;
    const ball=mesh(bearingParts,geom('bearing-ball',()=>new T.SphereGeometry(.015,10,8)),zinc,'Тело качения подшипника',owner);
    ball.position.set(.078*Math.cos(a),.078*Math.sin(a),axial);
   }
  }
  tube(g,brass,[[.265,.06,side*.14],[.285,.07,side*.19],[.265,.095,side*.22]],.007,'Вентиль шины',owner);
  if(!spare){
   const brake=sub(owner,'Тормозной диск '+(side>0?'справа':'слева'),[0,0,side*.38]);
   const rotorShape=new T.Shape();rotorShape.absarc(0,0,.232,0,2*PI,false);
   const centerHole=new T.Path();centerHole.absarc(0,0,.080,0,2*PI,true);rotorShape.holes.push(centerHole);
   for(let n=0;n<12;n++){
    const a=n*PI/6,hole=new T.Path();hole.absarc(.182*Math.cos(a),.182*Math.sin(a),.012,0,2*PI,true);rotorShape.holes.push(hole);
   }
   const rotor=mesh(brake,new T.ExtrudeGeometry(rotorShape,{depth:.038,bevelEnabled:false}),metal,'Тормозной диск с отверстиями',owner);
   rotor.position.set(x,.54,side*.76-.019);
   box(brake,frameMat,[x+.20,.59,side*.73],[.20,.28,.17],'Демонстрационный тормозной суппорт',owner);
   for(const y of [.52,.68])addBolt(brake,[x+.26,y,side*.84],[0,0,side],.016,'Крепление тормозного суппорта');
  }
  return g;
 }
 for(const [i,owner] of axles.entries()){
  const addBolt=bolts(owner),x=10.83+i*1.36-center;
  const beam=sub(owner,'Балка и пневмоподвеска',[0,-.13,0]);
  cyl(beam,frameMat,[x,.54,0],.075,2.03,'z','Балка оси '+(i+1),owner,28);
  for(const side of [-1,1]){
   const wgroup=sub(owner,'Колесо '+(side>0?'правое':'левое'),[0,.03,side*.73]);
   wheel(wgroup,x,side,owner,addBolt);
   box(beam,frameMat,[x-.26,.67,side*.75],[.79,.12,.125],'Продольный рычаг подвески',owner);
   cyl(beam,metal,[x-.62,.76,side*.75],.083,.23,'z','Втулка шарнира подвески',owner,28);
   for(const z of [side*.62,side*.88])box(beam,paint,[x-.62,.96,z],[.24,.38,.037],'Серьга подвески',owner);
   addBolt(beam,[x-.62,.76,side*.90],[0,0,side],.026,'Ось рычага подвески');
   const ax=x+.30,az=side*.74;
   cyl(beam,black,[ax,.85,az],.141,.30,'y','Пневморессора',owner,36);
   for(const y of [.72,.79,.89,.97])ring(beam,black,[ax,y,az],.145,.016,'y','Гофр пневмобаллона',owner);
   for(const y of [.69,1.02])cyl(beam,metal,[ax,y,az],.149,.035,'y','Плита пневморессоры',owner,32);
   rod(beam,zinc,[x-.15,.59,side*.60],[x+.15,1.08,side*.61],.032,'Амортизатор подвески',owner);
   for(const yy of [.70,.98])addBolt(beam,[ax,yy,az+side*.13],[0,0,side],.016,'Болт крепления пневморессоры');
   cyl(beam,frameMat,[x+.20,.61,side*.43],.10,.20,'x','Пружинный тормозной энергоаккумулятор',owner,32);
   rod(beam,zinc,[x+.08,.61,side*.43],[x-.12,.61,side*.43],.016,'Шток тормозного привода',owner);
   tube(beam,red,[[x+.20,.71,side*.43],[x+.42,.87,side*.48],[x+.28,1.10,side*.66]],.012,'Пневмошланг тормоза',owner);
   // Open-wheel mudguard follows the photographed wheel scallops.
   for(let k=0;k<18;k++){
    const a=.08+k*(PI-.16)/17;
    const xx=x+.565*Math.cos(a),yy=.54+.565*Math.sin(a);
    const f=box(owner.group,frameMat,[xx,yy,side*1.065],[.102,.025,.41],'Секция крыла над колесом',owner);f.rotation.z=a-PI/2;
   }
   box(owner.group,black,[x+.54,.51,side*1.065],[.032,.46,.43],'Брызговик',owner);
   for(const z of [side*.94,side*1.18])addBolt(owner.group,[x+.566,.73,z],[1,0,0],.010,'Крепление брызговика');
  }
 }
 // The spare wheel stands on the forward platform in the drawing.
 const spare=sub(neck,'Запасное колесо и держатель',[0,.36,-.32]);
 const spareGroup=wheel(spare,.36-center,1,neck,boltNeck,true);
 spareGroup.position.set(.36-center,2.15,0);
 spareGroup.rotation.y=PI/2;
 box(spare,frameMat,[.36-center,1.80,0],[.16,.56,.56],'Кронштейн запасного колеса',neck);
 // Rear approach ramps. Each hinge and locking pin is separately inspectable.
 const rampLeaves=[];
 for(const side of [-1,1]){
  const leaf=sub(ramps,'Аппарель '+(side>0?'правая':'левая'),[.20,.16,side*.36]);
  leaf.position.set(14.77-center,1.28,side*.79);
  ownerOrigin(leaf);
  const length=1.45,w=.73;
  for(const z of [-w/2,w/2])box(leaf,frameMat,[length/2,-.09,z],[length,.20,.075],'Продольный уголок аппарели',ramps);
  for(let i=0;i<11;i++){
   const x=.07+i*.129;
   box(leaf,metal,[x,-.012,0],[.058,.057,w-.08],'Ступень аппарели '+(i+1),ramps);
   for(const z of [-.31,.31])boltRamp(leaf,[x,.020,z],[0,1,0],.012,'Болт ступени аппарели');
  }
  box(leaf,paint,[length-.05,-.03,0],[.10,.16,w],'Носок аппарели',ramps);
  cyl(leaf,zinc,[0,-.08,0],.037,w+.14,'z','Шарнирный палец аппарели',ramps,32);
  for(const z of [-w/2,w/2])ring(leaf,paint,[0,-.08,z],.066,.022,'z','Петля шарнира аппарели',ramps);
  ring(leaf,zinc,[0,-.08,side*(w/2+.10)],.038,.006,'x','Пружинная чека шарнирного пальца',ramps);
  for(let i=0;i<8;i++)ring(leaf,metal,[.06,-.18,-.13+i*.036],.052,.009,'z','Виток возвратной пружины',ramps);
  rampLeaves.push(leaf);
 }
 function ownerOrigin(group){const entry=layers.find(item=>item.group===group);entry.origin.copy(group.position);}
 // Tailboard, road lighting, harness, reflectors and structural bolts.
 box(lamps.group,paint,[14.72-center,1.02,0],[.14,.27,2.52],'Задняя поперечина',lamps);
 for(const side of [-1,1]){
  box(lamps.group,black,[14.81-center,1.04,side*.92],[.068,.21,.43],'Корпус заднего фонаря',lamps);
  for(let i=0;i<4;i++)box(lamps.group,i===3?amber:lampRed,[14.85-center,1.05,side*.92+(-.15+i*.10)],[.017,.14,.076],'Секция заднего фонаря',lamps);
  for(const yy of [.965,1.125])for(const z of [side*.76,side*1.08])boltLamp(lamps.group,[14.86-center,yy,z],[1,0,0],.006,'Винт рассеивателя фонаря');
  for(let i=0;i<8;i++)box(lamps.group,amber,[4.30+i*1.38-center,1.245,side*1.30],[.12,.045,.018],'Боковой световозвращатель',lamps);
  tube(lamps.group,black,[[1.4-center,1.29,side*.55],[4.0-center,1.10,side*.58],[10.0-center,1.12,side*.58],[14.72-center,1.05,side*.92]],.009,'Кабельная трасса светотехники',lamps);
 }
 box(lamps.group,black,[14.82-center,1.055,0],[.025,.135,.48],'Рамка номерного знака',lamps);
 for(const z of [-.27,.27])box(lamps.group,whiteLamp,[14.84-center,1.16,z],[.024,.042,.074],'Подсветка номерной площадки',lamps);

 // Compile fasteners to lightweight selectable instances.
 for(const batch of banks){
  const byParent=new Map();
  for(const entry of batch.entries){
   const list=byParent.get(entry.parent)||[];list.push(entry);byParent.set(entry.parent,list);
  }
  for(const [parent,entries] of byParent){
   const material=zinc.clone(),group=new T.Group();parent.add(group);
   const shapes=[
    geom('bolt-head',()=>new T.CylinderGeometry(.88,.88,.64,6)),
    geom('bolt-shaft',()=>new T.CylinderGeometry(.48,.48,3.20,14)),
    geom('washer',()=>{const s=new T.Shape();s.absarc(0,0,1.02,0,2*PI,false);const h=new T.Path();h.absarc(0,0,.54,0,2*PI,true);s.holes.push(h);const g=new T.ExtrudeGeometry(s,{depth:.16,bevelEnabled:false});g.rotateX(-PI/2);return g;}),
    geom('nut',()=>{const s=new T.Shape();for(let k=0;k<6;k++){const a=k*PI/3;const x=.86*Math.cos(a),y=.86*Math.sin(a);if(k===0)s.moveTo(x,y);else s.lineTo(x,y);}s.closePath();const h=new T.Path();h.absarc(0,0,.48,0,2*PI,true);s.holes.push(h);const g=new T.ExtrudeGeometry(s,{depth:.65,bevelEnabled:false});g.rotateX(-PI/2);return g;}),
   ];
   const meshes=shapes.map(g=>new InstancedMesh(g,material,entries.length));
   meshes.forEach((m,component)=>{m.userData.boltBatch={entries,component,owner:batch.owner};m.frustumCulled=false;group.add(m);});
   const bank={owner:batch.owner,entries,meshes,material,group};
   batch.meshes.push(bank);bankUpdate(bank,0);
  }
 }
 function bankUpdate(bank,amount){
  const dummy=new T.Group();
  bank.entries.forEach((e,i)=>{
   const p=e.p,d=e.diam;
   const offsets=[-.48,1.14,-.08,2.64];
   bank.meshes.forEach((mesh,n)=>{
    dummy.position.copy(p).addScaledVector(e.dir,(offsets[n]+[0,0,.8,2.5][n]*amount)*d);
    dummy.quaternion.setFromUnitVectors(Y,e.dir);dummy.scale.setScalar(d);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);
   });
  });
  for(const mesh of bank.meshes)mesh.instanceMatrix.needsUpdate=true;
 }
 const fastenerParts=[];
 for(const batch of banks)for(const bank of batch.meshes)for(const entry of bank.entries)
  fastenerParts.push({id:'bolt-'+entry.id,name:entry.name+' · №'+(entry.id+1),assembly:batch.owner.id,entry,bank});
 function fastenerInfo(item){
  root.updateMatrixWorld(true);
  const point=item.entry.p.clone().applyMatrix4(item.entry.parent.matrixWorld);
  return {name:item.name,assembly:item.assembly,point,radius:item.entry.diam*5,fastener:true,diameter:item.entry.diam,id:item.id};
 }
 function inspectFastener(item){
  if(inspection){root.remove(inspection.group);inspection=null;}
  const group=new T.Group();root.add(group);
  const d=item.diameter,opaque=zinc.clone(),thread=metal.clone();
  const head=new T.Mesh(new T.CylinderGeometry(.88*d,.88*d,.64*d,6),opaque);
  head.position.y=-.48*d;group.add(head);
  const shaft=new T.Mesh(new T.CylinderGeometry(.44*d,.44*d,3.50*d,40),opaque);
  shaft.position.y=1.22*d;group.add(shaft);
  const points=[];
  for(let i=0;i<=540;i++){
   const u=i/540,a=u*12*PI*2;
   points.push(new T.Vector3(.49*d*Math.cos(a),(.31+u*2.66)*d,.49*d*Math.sin(a)));
  }
  const ridge=new T.Mesh(new TubeGeometry(new CatmullRomCurve3(points),540,.047*d,5,false),thread);
  group.add(ridge);
  function aperture(hex){
   const shape=new T.Shape();
   if(hex)for(let i=0;i<6;i++){const a=i*PI/3;if(i===0)shape.moveTo(.86*d*Math.cos(a),.86*d*Math.sin(a));else shape.lineTo(.86*d*Math.cos(a),.86*d*Math.sin(a));}
   else shape.absarc(0,0,1.02*d,0,PI*2,false);
   shape.closePath();
   const hole=new T.Path();hole.absarc(0,0,.53*d,0,2*PI,true);shape.holes.push(hole);
   const geometry=new T.ExtrudeGeometry(shape,{depth:(hex?.65:.16)*d,bevelEnabled:true,bevelSize:.022*d,bevelThickness:.022*d,bevelSegments:2});
   geometry.rotateX(-PI/2);
   return new T.Mesh(geometry,opaque);
  }
  const washer=aperture(false),nut=aperture(true);
  group.add(washer,nut);
  for(const x of [-.19,.19]){
   const stroke=new T.Mesh(new T.BoxGeometry(.08*d,.013*d,.22*d),thread);
   stroke.position.set(x*d,-.808*d,0);stroke.rotation.y=x>0?.45:-.45;group.add(stroke);
  }
  for(const owner of assemblies)owner.group.visible=false;
  inspection={group,washer,nut,diameter:d};
  setInspectExplode(.6);
  return group;
 }
 function setInspectExplode(p){
  if(!inspection)return;
  const d=inspection.diameter;
  inspection.washer.position.y=(-.08+p*1.3)*d;
  inspection.nut.position.y=(2.64+p*2.7)*d;
 }
 let scope='all',explosion=0,fastenerExplode=0,rampAngle=.20;
 function update(){
  for(const owner of assemblies){
   owner.group.position.copy(owner.origin);
   for(const child of owner.children)child.group.position.copy(child.origin);
  }
  const p=explosion;
  if(scope==='all'){
   for(const owner of assemblies){owner.group.position.addScaledVector(owner.offset,p);}
   for(const owner of assemblies)for(const child of owner.children)child.group.position.addScaledVector(child.offset,p*.45);
  }else{
   const owner=assemblies.find(a=>a.id===scope);
   if(owner)for(const child of owner.children)child.group.position.addScaledVector(child.offset,p);
  }
  for(const leaf of rampLeaves)leaf.rotation.z=-rampAngle;
  for(const batch of banks)for(const bank of batch.meshes)bankUpdate(bank,(scope==='all'||scope===bank.owner.id)?fastenerExplode:0);
  root.updateMatrixWorld(true);
 }
 update();
 return {
  root,eye:[.93,.65,1],lighting:{exposure:1.02,key:2.9,rim:1.85,ambient:.55,environment:1.0,shadowOpacity:.24},
  assemblies,parts,fastenerParts,stats:{parts:partsCount,fasteners:boltCount,assemblies:assemblies.length},
  setExplode(value,selected='all'){scope=selected;explosion=value;update();},
  setFasteners(value){fastenerExplode=value;if(inspection)setInspectExplode(value);else update();},
  setRamps(value){rampAngle=.20+value*.68;update();},
  highlightBolts(enabled,selected='all'){
   for(const batch of banks)for(const bank of batch.meshes){
    const active=enabled&&(selected==='all'||bank.owner.id===selected),m=bank.material;
    m.color.setHex(active?0x00caff:0xb4bbc0);m.emissive.setHex(active?0x0088ff:0);m.emissiveIntensity=active?1.6:1;
    if(m.depthTest===active){m.depthTest=!active;m.depthWrite=!active;m.needsUpdate=true;}
    for(const mesh of bank.meshes)mesh.renderOrder=active?30:0;
   }
   if(inspection)inspection.group.traverse(mesh=>{
    if(!mesh.isMesh)return;
    mesh.material.emissive.setHex(enabled?0x0077dd:0);mesh.material.emissiveIntensity=enabled?1.1:1;
   });
  },
  setDeckVisible(value){deck.group.visible=value;},
  setStakesVisible(value){stakes.group.visible=value;},
  setIsolation(id){for(const a of assemblies)a.group.visible=!id||a.id===id;},
  pick(hit){
   const data=hit.object.userData.boltBatch;
   if(data){
    const e=data.entries[hit.instanceId];
    const point=e.p.clone().applyMatrix4(hit.object.parent.parent.matrixWorld);
    return {id:'bolt-'+e.id,name:e.name+' · №'+(e.id+1),assembly:data.owner.id,point,radius:e.diam*7,fastener:true,diameter:e.diam};
   }
   const part=parts[hit.object.userData.partId];
   if(!part)return null;
   const b=new Box3().setFromObject(part.object);
   return {id:part.id,name:part.name,assembly:part.assembly,point:b.getCenter(new T.Vector3()),radius:Math.max(.09,b.getSize(new T.Vector3()).length()*.95),object:part.object};
  },
  resolvePart(id){
   if(String(id).startsWith('bolt-'))return fastenerInfo(fastenerParts.find(p=>p.id===id));
   const part=parts[Number(id)];if(!part)return null;
   const b=new Box3().setFromObject(part.object);
   return {id:part.id,name:part.name,assembly:part.assembly,point:b.getCenter(new T.Vector3()),radius:Math.max(.04,b.getSize(new T.Vector3()).length()*.9),object:part.object};
  },
  inspectFastener,
  closeInspection(){if(inspection){root.remove(inspection.group);inspection=null;}for(const owner of assemblies)owner.group.visible=true;},
  getScope(id){return assemblies.find(a=>a.id===id)?.group||root;},
  reset(){this.closeInspection();scope='all';explosion=0;fastenerExplode=0;rampAngle=.20;for(const a of assemblies)a.group.visible=true;update();}
 };
}
