import {
  BoxGeometry, CanvasTexture, CylinderGeometry, DoubleSide, ExtrudeGeometry, Group, Mesh,
  MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial, Path, PlaneGeometry,
  Shape, SphereGeometry, SRGBColorSpace, TorusGeometry, Vector3,
} from './engine.js';

const tau = Math.PI * 2;
const point = (radius, angle) => [radius * Math.cos(angle), radius * Math.sin(angle)];
const metal = (color, roughness = .26) =>
  new MeshStandardMaterial({color, roughness, metalness:.82});

function piece(group, name, geometry, material, x=0, y=0, z=0) {
  const mesh = new Mesh(geometry, material);
  mesh.name = name;
  mesh.position.set(x,y,z);
  group.add(mesh);
  return mesh;
}

function subassembly(group, x=0, y=0, z=0) {
  const child = new Group();
  child.position.set(x,y,z);
  group.add(child);
  return child;
}

function extruded(shape, depth, bevel=0, segments=24) {
  const geometry = new ExtrudeGeometry(shape, {
    depth:depth-2*bevel, bevelEnabled:bevel>0, bevelSegments:2, bevelSize:bevel,
    bevelThickness:bevel, curveSegments:segments,
  });
  return geometry.translate(0,0,-depth/2+bevel);
}

function circleHole(shape,x,y,r) {
  const hole = new Path();
  hole.absarc(x,y,r,0,tau,true);
  shape.holes.push(hole);
}

function ring(group, name, material, outer, inner, depth, x=0, y=0, z=0, bevel=0) {
  const shape = new Shape();
  shape.absarc(0,0,outer,0,tau,false);
  circleHole(shape,0,0,inner);
  return piece(group,name,extruded(shape,depth,bevel,48),material,x,y,z);
}

function rod(group,name,material,radius,depth,x,y,z,sides=32,top=radius) {
  const mesh = piece(group,name,new CylinderGeometry(top,radius,depth,sides),material,x,y,z);
  mesh.rotation.x = Math.PI/2;
  return mesh;
}

function polygon(points) {
  const shape = new Shape();
  shape.moveTo(...points[0]);
  for (const coordinate of points.slice(1)) shape.lineTo(...coordinate);
  shape.closePath();
  return shape;
}

function profile(group,name,material,points,depth,x=0,y=0,z=0,bevel=0) {
  return piece(group,name,extruded(polygon(points),depth,bevel),material,x,y,z);
}

function torus(group,name,material,radius,tube,x,y,z) {
  return piece(group,name,new TorusGeometry(radius,tube,8,64),material,x,y,z);
}

function sectorHole(shape,r0,r1,a0,a1) {
  const hole = new Path();
  hole.moveTo(...point(r1,a0));
  hole.absarc(0,0,r1,a0,a1,false);
  hole.lineTo(...point(r0,a1));
  hole.absarc(0,0,r0,a1,a0,true);
  hole.closePath();
  shape.holes.push(hole);
}

function toothedWheel(group,name,material,pitch,teeth,depth,z,{spokes=0,bore=.024,escape=false}={}) {
  const module = 2*pitch/teeth;
  const root = pitch-module*.99;
  const crown = pitch+module*.79;
  const outline = [];
  const flanks = escape
    ? [[-.50,root],[-.29,root],[-.04,pitch],[.28,crown],[.39,crown],[.42,root],[.50,root]]
    : [[-.50,root],[-.36,root],[-.27,pitch],[-.16,crown],[.16,crown],[.27,pitch],[.36,root],[.50,root]];
  for (let tooth=0;tooth<teeth;tooth++) {
    for (const [offset,r] of flanks.slice(0,-1)) outline.push(point(r,(tooth+offset)*tau/teeth));
  }
  const shape=polygon(outline);
  circleHole(shape,0,0,bore);
  for (let i=0;i<spokes;i++) {
    const turn=i*tau/spokes;
    sectorHole(shape,pitch*.29,root*.79,turn+.12,turn+tau/spokes-.12);
  }
  return piece(group,name,extruded(shape,depth,Math.min(.0021,depth*.12),10),material,0,0,z);
}

function screw(group, name, material, x,y,z,r=.032,length=.075) {
  const head=polygon(Array.from({length:32},(_,i)=>point(r,i*tau/32)));
  const slot=new Path();
  slot.moveTo(-r*.78,-r*.123); slot.lineTo(-r*.78,r*.123);
  slot.lineTo(r*.78,r*.123); slot.lineTo(r*.78,-r*.123); slot.closePath();
  head.holes.push(slot);
  const shaft = new CylinderGeometry(r*.48,r*.48,length,14).rotateX(Math.PI/2).translate(0,0,length/2);
  const crown = extruded(head,r*.41,r*.05,8);
  // The screw is one physical part. Its head and shaft share a single geometry.
  const crownPos=crown.getAttribute('position'), crownNormal=crown.getAttribute('normal');
  const threaded=shaft.toNonIndexed();
  const shankPos=threaded.getAttribute('position'), shankNormal=threaded.getAttribute('normal');
  const positions=new Float32Array(crownPos.array.length+shankPos.array.length);
  const normals=new Float32Array(crownNormal.array.length+shankNormal.array.length);
  positions.set(crownPos.array); positions.set(shankPos.array,crownPos.array.length);
  normals.set(crownNormal.array); normals.set(shankNormal.array,crownNormal.array.length);
  crown.setAttribute('position',new crownPos.constructor(positions,3));
  crown.setAttribute('normal',new crownNormal.constructor(normals,3));
  crown.deleteAttribute('uv');
  crown.clearGroups();
  shaft.dispose();
  threaded.dispose();
  return piece(group,name,crown,material,x,y,z);
}

function spiral(group,name,material,x,y,z,inner,outer,turns,width,depth) {
  const path=[];
  const samples=144;
  for (const side of [-1,1]) {
    for (let i=0;i<=samples;i++) {
      const t=(side<0?i:samples-i)/samples;
      path.push(point(inner+(outer-inner)*t+side*width/2,t*tau*turns));
    }
  }
  return profile(group,name,material,path,depth,x,y,z);
}

function textPlate(group,text,z,y,width,height,color='\u0023dec498') {
  const stamp=document.createElement('canvas');
  stamp.width=640;
  stamp.height=160;
  const ctx=stamp.getContext('2d');
  ctx.clearRect(0,0,640,160);
  ctx.fillStyle=color;
  ctx.textAlign='center';
  ctx.textBaseline='middle';
  ctx.font=text==='007'?'italic 600 124px Georgia':'500 49px sans-serif';
  ctx.fillText(text,320,83,610);
  const map=new CanvasTexture(stamp);
  map.colorSpace=SRGBColorSpace;
  return piece(group,'Маркировка '+text,new PlaneGeometry(width,height),
    new MeshBasicMaterial({map,transparent:true,depthWrite:false,side:DoubleSide}),0,y,z);
}

function hand(group,name,material,length,width,tail,z,lume) {
  const outline=[[-width*.52,-tail],[width*.52,-tail],[width*.62,length*.72],
    [0,length],[-width*.62,length*.72]];
  profile(group,name,material,outline,.021,0,0,z,.003);
  if (lume) profile(group,'Светящаяся вставка '+name.toLowerCase(),lume,
    [[-width*.19,length*.17],[width*.19,length*.17],[width*.17,length*.68],[0,length*.83],[-width*.17,length*.68]],.004,0,0,z+.013);
}

export function createCalibre007() {
  const root=new Group(), sections=[];
  const layer=(name,offset,start=0)=>{
    const group=subassembly(root);
    group.name=name;
    sections.push({group,origin:group.position.clone(),offset:new Vector3(...offset),start});
    return group;
  };
  const rose=metal(0xc68758,.23), polished=metal(0xe2ac78,.16), brass=metal(0xcba467,.26);
  const steel=metal(0xb3bdcb,.24), rim=metal(0x879ba6,.22), blue=metal(0x304a77,.18);
  const slate=metal(0x283242,.38);
  const dialMat=new MeshPhysicalMaterial({color:0x152f46,metalness:.36,roughness:.32,clearcoat:.83,clearcoatRoughness:.20});
  const dark=new MeshStandardMaterial({color:0x1d2026,roughness:.75});
  const leather=new MeshStandardMaterial({color:0x27363f,roughness:.67});
  const stitching=new MeshStandardMaterial({color:0x68717a,roughness:.76});
  const crystal=new MeshPhysicalMaterial({color:0xb4ddf2,transparent:true,opacity:.12,roughness:.10,
    metalness:.15,clearcoat:1,depthWrite:false,side:DoubleSide});
  const ruby=new MeshPhysicalMaterial({color:0xd52751,metalness:.22,roughness:.16,clearcoat:.92});
  const lume=new MeshBasicMaterial({color:0xe8e2c5});

  const body=layer('Корпус и ушки',[0,0,0]);
  const rimFront=layer('Безель и прокладка',[.81,.13,1.74],.06);
  const crystalFront=layer('Переднее сапфировое стекло',[1.31,.47,2.42]);
  const crystalBack=layer('Прозрачная задняя крышка',[-1.40,-.39,-1.85]);
  const dial=layer('Циферблат 007 и часовые индексы',[.39,0,1.18],.12);
  const hour=layer('Часовая стрелка и втулка',[1.23,-.55,2.34],.08);
  const minute=layer('Минутная стрелка и втулка',[1.57,-.38,2.77],.04);
  const second=layer('Секундная стрелка и противовес',[1.83,-.14,3.28]);
  const motionWorks=layer('Стрелочный механизм и минутный триб',[0,.20,.68],.18);
  const plate=layer('Платина и опорные втулки',[0,-.06,-.30],.28);
  const barrel=layer('Заводной барабан и пружина',[-.94,1.06,-.72],.25);
  const lid=layer('Крышка барабана и храповик',[-1.30,1.18,-1.25],.24);
  const bridges=layer('Мосты передачи и опоры',[-.78,-.34,-1.35],.23);
  const jewels=layer('Рубиновые опоры и накладные камни',[.15,-.71,-1.40],.33);
  const fasteners=layer('Винты мостов и корпуса',[.46,-.74,-1.78],.32);
  const crown=layer('Заводная головка и вал',[1.07,.17,.20],.17);
  const keyless=layer('Муфта завода и переводной рычаг',[.96,-.43,.22],.30);
  const balanceLayer=layer('Баланс, спираль и импульсный камень',[-.78,-.54,-.43],.30);
  const palletLayer=layer('Анкерная вилка и палеты',[.20,-.88,-.44],.30);
  const balanceCock=layer('Мост баланса, градусник и амортизатор',[-.94,-.69,-1.02],.29);
  const strapTop=layer('Верхняя половина ремешка',[0,.65,-.27],.19);
  const strapBottom=layer('Нижняя половина ремешка',[0,-.71,-.26],.19);
  const buckle=layer('Пряжка, язычок и шпильки',[.20,-.95,-.32],.25);

  ring(body,'Средняя часть корпуса',rose,1.283,1.091,.36,0,0,-.021,.017);
  torus(body,'Полированная фаска корпуса',polished,1.263,.024,0,0,.123);
  torus(body,'Нижняя кромка корпуса',polished,1.256,.019,0,0,-.184);
  for (const side of [-1,1]) for (const end of [-1,1]) {
    profile(body,'Ушко корпуса',rose,[[side*.51,end*1.04],[side*.87,end*1.01],
      [side*.77,end*1.48],[side*.56,end*1.51]],.164,0,0,-.06,.017);
    rod(buckle,'Пружинная шпилька ремешка',steel,.032,.105,side*.595,end*1.426,-.074,16).rotation.set(0,0,-Math.PI/2);
  }
  ring(rimFront,'Полированный безель',polished,1.263,1.117,.091,0,0,.221,.012);
  ring(rimFront,'Прокладка переднего стекла',dark,1.132,1.104,.026,0,0,.226,.004);
  rod(crystalFront,'Переднее сапфировое стекло',crystal,1.113,.046,0,0,.262,96);
  torus(crystalFront,'Фаска сапфира',crystal,1.106,.015,0,0,.284);
  ring(crystalBack,'Резьбовое кольцо задней крышки',polished,1.193,.961,.076,0,0,-.260,.009);
  rod(crystalBack,'Смотровое стекло задней крышки',crystal,.970,.033,0,0,-.282,96);
  torus(crystalBack,'Прокладка задней крышки',dark,1.126,.013,0,0,-.219);
  for(let i=0;i<6;i++){
    const angle=i*tau/6;
    const [x,y]=point(1.116,angle);
    const notch=piece(crystalBack,'Шлиц задней крышки',new BoxGeometry(.065,.024,.013),slate,x,y,-.305);
    notch.rotation.z=angle;
  }

  rod(dial,'Синий циферблат',dialMat,1.103,.041,0,0,.124,96);
  ring(dial,'Кольцо минутной шкалы',blue,1.100,1.017,.021,0,0,.151,.004);
  for(let i=0;i<60;i++){
    const angle=i*tau/60;
    const major=i%5===0;
    if(i===15) continue;
    const [x,y]=point(major?.925:1.037,angle);
    const marker=piece(dial,major?'Накладной часовой индекс':'Риска минутной шкалы',
      new BoxGeometry(major?.132:.032,major?.033:.009,major?.030:.008),
      major?polished:brass,x,y,.151+(major?.014:.008));
    marker.rotation.z=angle;
  }
  for(const x of [-.044,.044]){
    piece(dial,'Двойной индекс 12 часов',new BoxGeometry(.028,.148,.033),polished,x,.917,.172);
  }
  torus(dial,'Тонкий рант внутренней шкалы',blue,.848,.003,0,0,.148);
  textPlate(dial,'007',.150,.483,.93,.218);
  textPlate(dial,'MECHANICAL',.151,-.462,.62,.126);

  const h=subassembly(hour), m=subassembly(minute), s=subassembly(second);
  hand(h,'Часовая стрелка',polished,.615,.116,.105,.168,lume);
  hand(m,'Минутная стрелка',polished,.865,.081,.104,.199,lume);
  hand(s,'Секундная стрелка',ruby,.985,.023,.207,.222);
  rod(s,'Противовес секундной стрелки',polished,.036,.013,0,-.181,.222,24);
  ring(h,'Втулка часовой стрелки',steel,.057,.027,.037,0,0,.163,.004);
  ring(m,'Втулка минутной стрелки',polished,.043,.019,.028,0,0,.202,.003);
  rod(s,'Центральная головка оси',polished,.027,.022,0,0,.239,24);

  ring(plate,'Несущая платина',slate,1.070,.134,.061,0,0,.033,.009);
  ring(plate,'Посадочная втулка оси стрелок',steel,.157,.043,.061,0,0,.043,.005);
  for(let i=0;i<9;i++){
    const angle=i*tau/9+.17;
    const [x,y]=point(.984,angle);
    ring(plate,'Распорная втулка платины',steel,.044,.016,.057,x,y,.006,.004);
  }

  const barrelCenter=[-.403,.374], thirdCenter=[.460,.324], fourthCenter=[.732,-.132], escapeCenter=[.550,-.430];
  const b=subassembly(barrel,...barrelCenter,-.071);
  const cap=subassembly(lid,...barrelCenter,-.165);
  toothedWheel(b,'Зубчатый венец барабана',brass,.475,76,.050,.009,{bore:.388});
  ring(b,'Стенка заводного барабана',rose,.407,.366,.114,0,0,-.034,.007);
  rod(b,'Вал заводного барабана',steel,.062,.201,0,0,-.024,24);
  const mainSpring=spiral(b,'Плоская заводная пружина',steel,0,0,-.037,.080,.350,3.8,.016,.061);
  rod(cap,'Крышка барабана',rose,.398,.023,0,0,0,68);
  const ratchet=toothedWheel(cap,'Храповое колесо завода',steel,.260,32,.032,-.030,{spokes:5,bore:.045,escape:true});
  screw(cap,'Центральный винт храповика',blue,0,0,-.067,.041,.053);

  const train=[];
  const wheelData=[
    ['Центральное колесо и триб',[0,0],.500,80,12,-.106,[.07,.47,-.62]],
    ['Промежуточное колесо и триб',thirdCenter,.46875,75,10,-.160,[.58,.57,-.74]],
    ['Секундное колесо и триб',fourthCenter,.30625,49,10,-.099,[.95,-.02,-.64]],
    ['Спусковое колесо и триб',escapeCenter,.143,15,7,-.157,[.72,-.68,-.65]],
  ];
  for(const [i,[name,[x,y],radius,count,pinion,z,offset]] of wheelData.entries()){
    const group=layer(name,offset,.30);
    const wheel=subassembly(group,x,y,z);
    const gear=toothedWheel(wheel,name.replace(' и триб',''),i===3?rose:brass,radius,count,.038,0,
      {spokes:i===3?3:5,bore:i===3?.012:.021,escape:i===3});
    const pin=toothedWheel(wheel,'Триб '+(i+1),steel,pinion*.00625,pinion,.056,i===0?.046:i%2?.068:-.046,{bore:.011});
    const arbor=rod(wheel,'Ось '+name.toLowerCase().replace(' и триб',''),steel,.014,.172,0,0,.008,18);
    train.push({group,wheel,gear,pin,arbor,pinZ:pin.position.z});
    ring(jewels,'Рубиновая опора '+(i+1),ruby,.042,.012,.026,x,y,-.226,.004);
    ring(jewels,'Золотой шатон '+(i+1),polished,.060,.041,.022,x,y,-.226,.003);
  }
  const motionCenter=subassembly(motionWorks,0,0,.069);
  const hourWheel=toothedWheel(motionCenter,'Часовое колесо',brass,.231,36,.025,.009,{spokes:4,bore:.042});
  const cannon=toothedWheel(motionCenter,'Минутный триб',steel,.082,12,.040,.023,{bore:.019});
  const motionIntermediate=subassembly(motionWorks,.288,0,.073);
  const minuteWheel=toothedWheel(motionIntermediate,'Вексельное колесо',brass,.192,32,.027,0,{spokes:4,bore:.019});
  rod(motionCenter,'Трубка оси секундной стрелки',steel,.019,.153,0,0,.053,20);
  rod(motionIntermediate,'Вексельный триб',steel,.060,.038,0,0,.033,20);

  profile(bridges,'Мост заводного барабана',steel,[[-.945,.386],[-.721,.785],[-.360,.918],
    [-.129,.806],[-.129,.498],[-.261,.187],[-.612,.041],[-.833,.156]],.049,0,0,-.218,.008);
  profile(bridges,'Мост центральной передачи',steel,[[-.167,.079],[.162,.237],[.509,.569],[.763,.576],
    [.933,.319],[1.002,.011],[.835,-.301],[.594,-.407],[.338,-.255],[.072,-.109]],.043,0,0,-.238,.008);
  profile(bridges,'Мост спускового колеса',steel,[[.275,-.356],[.482,-.348],[.743,-.406],
    [.747,-.577],[.472,-.694],[.229,-.559]],.038,0,0,-.223,.007);
  const stripes=new MeshStandardMaterial({color:0x7b929d,roughness:.36,metalness:.66});
  for(let i=0;i<8;i++){
    const x=-.64+i*.058;
    const y=.428+(i%3)*.011;
    const line=piece(bridges,'Полоса отделки моста',new BoxGeometry(.018,.37,.0015),stripes,x,y,-.245);
    line.rotation.z=-.33;
  }
  for(const [x,y] of [[-.808,.417],[-.430,.811],[-.278,.262],[.815,.373],[.814,-.197],[.394,-.566],[-.785,-.378],[-.343,-.686],[.905,-.539]])
    screw(fasteners,'Воронёный винт моста',blue,x,y,-.267,.037,.074);

  const balancePoint=[-.363,-.508];
  const balance=subassembly(balanceLayer,...balancePoint,-.150);
  const hairspring=spiral(balance,'Волосок баланса',blue,0,0,-.053,.034,.184,4.3,.007,.020);
  ring(balance,'Обод баланса',rose,.279,.232,.042,0,0,0,.005);
  for(let i=0;i<3;i++){
    const angle=i*tau/3+.31;
    const [x,y]=point(.132,angle);
    const arm=piece(balance,'Спица баланса',new BoxGeometry(.245,.037,.027),brass,x,y,.002);
    arm.rotation.z=angle;
  }
  for(let i=0;i<12;i++){
    const [x,y]=point(.260,i*tau/12);
    rod(balance,'Регулировочный груз баланса',steel,.015,.024,x,y,.026,12);
  }
  rod(balance,'Ось баланса',steel,.020,.133,0,0,-.004,20);
  rod(balance,'Импульсный рубин',ruby,.017,.040,.088,.019,.052,18);
  profile(balanceCock,'Мост баланса',steel,[[-.891,-.274],[-.724,-.236],[-.542,-.388],[-.328,-.455],
    [-.278,-.536],[-.410,-.623],[-.643,-.558],[-.840,-.479]],.040,0,0,-.231,.007);
  ring(balanceCock,'Пружинная оправа амортизатора',polished,.068,.036,.034,...balancePoint,-.266,.005);
  rod(balanceCock,'Накладной рубин баланса',ruby,.035,.026,...balancePoint,-.273,24);
  const regulator=profile(balanceCock,'Градусник баланса',blue,[[-.415,-.529],[-.382,-.569],
    [-.295,-.523],[-.204,-.489],[-.212,-.457],[-.337,-.491]],.025,0,0,-.279,.002);
  regulator.rotation.z=.018;
  screw(balanceCock,'Винт моста баланса',blue,-.771,-.394,-.278,.046,.082);

  const fork=subassembly(palletLayer,.190,-.461,-.169);
  profile(fork,'Анкерная вилка',blue,[[-.294,-.027],[-.284,.046],[-.220,.029],[-.200,.010],
    [.003,.017],[.171,.111],[.195,.094],[.139,.032],[.061,.002],[.169,-.064],
    [.185,-.103],[.144,-.118],[-.020,-.037],[-.235,-.014]],.028,0,0,0,.0025);
  rod(fork,'Ось анкерной вилки',steel,.020,.096,0,0,0,18);
  for(const y of [-.094,.092])piece(fork,y<0?'Выходная рубиновая палета':'Входная рубиновая палета',
    new BoxGeometry(.062,.036,.034),ruby,.179,y,0);
  ring(jewels,'Рубиновая опора анкера',ruby,.037,.012,.026,.190,-.461,-.225,.003);

  const stem=subassembly(crown,.966,0,-.030);
  const stemAxle=rod(stem,'Заводной вал',steel,.031,.634,.029,0,0,20);
  stemAxle.rotation.set(0,0,-Math.PI/2);
  const knob=rod(stem,'Коронка головки',rose,.139,.189,.412,0,0,52);
  knob.rotation.set(0,0,-Math.PI/2);
  const crownTop=rod(stem,'Полированный торец головки',polished,.113,.023,.519,0,0,48);
  crownTop.rotation.set(0,0,-Math.PI/2);
  for(let i=0;i<26;i++){
    const angle=i*tau/26;
    const [y,z]=point(.135,angle);
    const flute=piece(stem,'Насечка заводной головки',new BoxGeometry(.152,.022,.025),polished,.422,y,z);
    flute.rotation.x=angle;
  }
  const sliding=toothedWheel(keyless,'Скользящая муфта завода',steel,.106,16,.087,0,{bore:.027});
  sliding.position.set(.884,0,-.035);
  sliding.rotation.y=Math.PI/2;
  const setting=toothedWheel(keyless,'Переводное колесо',brass,.119,21,.033,.043,{bore:.022});
  setting.position.x=.632; setting.position.y=.090;
  profile(keyless,'Переводной рычаг',blue,[[.644,-.087],[.792,-.233],[.961,-.183],[1.012,-.110],
    [.876,-.129],[.779,-.135]],.028,0,0,.048,.005);
  profile(keyless,'Пружина фиксатора перевода',steel,[[.482,-.110],[.583,-.228],[.743,-.262],
    [.789,-.243],[.610,-.199],[.538,-.073]],.021,0,0,.054,.003);
  screw(keyless,'Винт переводного рычага',blue,.687,-.178,.026,.031,.059);

  for(const [side,strap] of [[1,strapTop],[-1,strapBottom]]) {
    const outline=polygon([[-.55,side*1.337],[.55,side*1.337],[.485,side*2.312],
      [.382,side*2.456],[-.385,side*2.456],[-.485,side*2.312]]);
    if(side>0) for(let i=0;i<5;i++)circleHole(outline,0,1.69+i*.137,.035);
    piece(strap,'Кожаная часть ремешка',extruded(outline,.134,.014,14),leather,0,0,-.073);
    for(const x of [-.436,.436])for(let i=0;i<13;i++){
      const y=side*(1.44+i*.062), taper=(1.44-Math.abs(y))*.071;
      piece(strap,'Стежок ремешка',new BoxGeometry(.010,.032,.005),stitching,x+Math.sign(x)*taper,y,-.003);
    }
  }
  profile(buckle,'Рамка пряжки',polished,[[-.51,-2.184],[-.45,-2.477],[-.31,-2.578],[.31,-2.578],
    [.45,-2.477],[.51,-2.184],[.444,-2.180],[.384,-2.433],[.280,-2.499],[-.280,-2.499],
    [-.384,-2.433],[-.444,-2.180]],.085,0,0,-.055,.010);
  profile(buckle,'Язычок пряжки',steel,[[-.026,-2.232],[.026,-2.232],[.023,-2.548],
    [0,-2.581],[-.023,-2.548]],.047,0,0,.012,.007);

  let clock=0, speed=.70, winding=0;
  function move(dt) {
    clock+=dt*speed;
    const phase=clock*5.6;
    const tick=Math.floor(phase);
    const advance=Math.min((phase-tick)*4.5,1);
    const escapeAngle=(tick+advance)*tau/15;
    const fourthAngle=-escapeAngle/7;
    const thirdAngle=-fourthAngle/7.5;
    const centerAngle=-thirdAngle/8;
    const barrelAngle=-centerAngle*(12/76);
    const windingAngle=winding*tau;
    train[3].wheel.rotation.z=escapeAngle;
    train[2].wheel.rotation.z=fourthAngle;
    train[1].wheel.rotation.z=thirdAngle;
    train[0].wheel.rotation.z=centerAngle;
    b.rotation.z=barrelAngle;
    ratchet.rotation.z=barrelAngle+windingAngle*.32;
    stem.rotation.x=windingAngle;
    sliding.rotation.z=windingAngle;
    setting.rotation.z=-windingAngle*16/21;
    mainSpring.rotation.z=windingAngle*.16;
    const springTension=1-winding*.07;
    mainSpring.scale.set(springTension,springTension,1);
    balance.rotation.z=.74*Math.sin(phase*Math.PI);
    hairspring.scale.setScalar(1+.047*Math.sin(phase*Math.PI));
    fork.rotation.z=.21*Math.tanh(3*Math.sin(phase*Math.PI));
    h.rotation.z=-(10+8/60)*tau/12+centerAngle/12;
    m.rotation.z=-8*tau/60+centerAngle;
    s.rotation.z=-36*tau/60+fourthAngle;
    hourWheel.rotation.z=h.rotation.z;
    cannon.rotation.z=m.rotation.z;
    minuteWheel.rotation.z=-centerAngle*.6;
  }
  move(0);

  const trainGroups=train.map(({group})=>group);
  const frontGroups=[crystalFront,rimFront,dial,hour,minute,second,motionWorks];
  return {
    root,sections,eye:[.30,.32,1],motion:move,motionLabel:'Запустить часы',
    adjustments:[
      {label:'Разборка колёс и осей',initial:0,apply(v){
        for(const {gear,pin,arbor,pinZ} of train){
          gear.position.z=.195*v/100;
          pin.position.z=pinZ-.138*v/100;
          arbor.position.z=.008-.305*v/100;
        }
      }},
      {label:'Поворот заводной головки',initial:0,apply(v){winding=v/100;move(0);}},
      {label:'Темп показа',initial:70,min:20,max:100,apply(v){speed=v/100;}},
    ],
    presets:[
      {label:'Часы в сборе',amount:0,eye:[.30,.32,1]},
      {label:'Вид сзади',amount:0,eye:[.22,.28,-1]},
      {label:'Все слои',amount:92,eye:[-.91,.29,1]},
      {label:'Стрелки и циферблат',amount:67,groups:frontGroups,eye:[-.72,.19,1]},
      {label:'Колёсная передача',amount:0,groups:[barrel,...trainGroups,palletLayer,balanceLayer],eye:[.15,.22,-1]},
      {label:'Анкер и баланс',amount:0,groups:[trainGroups.at(-1),palletLayer,balanceLayer],eye:[.17,.23,-1]},
      {label:'Барабан и пружина',amount:20,groups:[barrel,lid],eye:[.84,.24,-1]},
      {label:'Завод и перевод',amount:24,groups:[crown,keyless,lid],eye:[.32,.32,1]},
      {label:'Мосты и рубины',amount:58,groups:[bridges,balanceCock,jewels,fasteners],eye:[.77,.29,-1]},
    ],
  };
}
