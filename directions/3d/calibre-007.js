import {
  BoxGeometry, BufferAttribute, BufferGeometry, CanvasTexture, CylinderGeometry, DoubleSide, ExtrudeGeometry, Group, Mesh,
  MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial, Path, PlaneGeometry,
  Shape, SRGBColorSpace, TorusGeometry, Vector3,
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
  return planarFinish(piece(group,name,extruded(shape,depth,Math.min(.0027,depth*.14),10),material,0,0,z),pitch);
}

function helicalThread(radius,length) {
  const positions=[], triangles=[];
  const turns=5, steps=100, pitch=length/(turns+1);
  for(let i=0;i<=steps;i++){
    const phase=i/steps;
    const angle=phase*tau*turns;
    const z=pitch*.16+phase*length*.83;
    for(const [r,dz] of [[radius*.96,-pitch*.22],[radius*1.22,0],[radius*.97,pitch*.22]])
      positions.push(...point(r,angle),z+dz);
    if(i===steps)continue;
    const a=i*3;
    triangles.push(a,a+3,a+1,a+1,a+3,a+4,a+1,a+4,a+2,a+2,a+4,a+5);
  }
  const geom=new BufferGeometry();
  geom.setAttribute('position',new BufferAttribute(new Float32Array(positions),3));
  geom.setIndex(triangles);
  geom.computeVertexNormals();
  const thread=geom.toNonIndexed();
  geom.dispose();
  return thread;
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
  const thread=helicalThread(r*.48,length);
  const threadPos=thread.getAttribute('position'), threadNormal=thread.getAttribute('normal');
  const positions=new Float32Array(crownPos.array.length+shankPos.array.length+threadPos.array.length);
  const normals=new Float32Array(positions.length);
  positions.set(crownPos.array); positions.set(shankPos.array,crownPos.array.length);
  positions.set(threadPos.array,crownPos.array.length+shankPos.array.length);
  normals.set(crownNormal.array); normals.set(shankNormal.array,crownNormal.array.length);
  normals.set(threadNormal.array,crownNormal.array.length+shankNormal.array.length);
  crown.setAttribute('position',new crownPos.constructor(positions,3));
  crown.setAttribute('normal',new crownNormal.constructor(normals,3));
  crown.deleteAttribute('uv');
  crown.clearGroups();
  shaft.dispose();
  threaded.dispose();
  thread.dispose();
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

function finishMap(kind) {
  const image=document.createElement('canvas');
  image.width=image.height=768;
  const ctx=image.getContext('2d');
  ctx.fillStyle=kind==='dial'?'#bbc5d3':'#acacac';
  ctx.fillRect(0,0,768,768);
  if(kind==='dial'){
    const center=384;
    for(let i=0;i<540;i++){
      const angle=i*tau/540;
      const [x,y]=point(383,angle);
      const [u,v]=point(60,angle+.25);
      ctx.strokeStyle=i%9===0?'#ffffff32':i%3===0?'#07172726':'#ffffff0c';
      ctx.lineWidth=i%9===0?1.6:.9;
      ctx.beginPath();ctx.moveTo(center+u,center+v);
      ctx.quadraticCurveTo(center+x*.48,center+y*.38,center+x,center+y);ctx.stroke();
    }
    for(let r=272;r<365;r+=4) {
      ctx.strokeStyle=r%8===0?'#111b2e4a':'#eef5ff30';
      ctx.beginPath();ctx.arc(center,center,r,0,tau);ctx.stroke();
    }
  } else if(kind==='perlage'){
    for(let y=0;y<768;y+=40)for(let x=-22;x<790;x+=43){
      const cx=x+(y%80?21:0),cy=y;
      for(let r=2;r<24;r+=2){
        ctx.strokeStyle=r%4===0?'#e7e7e7a0':'#4343435c';
        ctx.beginPath();ctx.ellipse(cx,cy,r,r,0,0,tau);ctx.stroke();
      }
    }
  } else {
    for(let y=0;y<768;y++){
      const tone=(47*y*y+83*y+19)%119;
      ctx.fillStyle='rgb('+[115+tone,115+tone,115+tone].join(',')+')';
      ctx.fillRect(0,y,768,1);
    }
  }
  const texture=new CanvasTexture(image);
  if(kind==='dial')texture.colorSpace=SRGBColorSpace;
  texture.anisotropy=4;
  return texture;
}

function planarFinish(mesh,radius) {
  const geometry=mesh.geometry;
  const points=geometry.getAttribute('position');
  const uv=new Float32Array(points.count*2);
  for(let i=0;i<points.count;i++){
    uv[2*i]=.5+points.getX(i)/(radius*2);
    uv[2*i+1]=.5+points.getY(i)/(radius*2);
  }
  geometry.setAttribute('uv',new BufferAttribute(uv,2));
  return mesh;
}

function turned(group,name,material,profile,x=0,y=0,z=0) {
  const positions=[],normals=[],uv=[],indices=[];
  const segments=128;
  for(let j=0;j<profile.length;j++){
    const [radius,height]=profile[j];
    const before=profile[(j+profile.length-1)%profile.length], after=profile[(j+1)%profile.length];
    const dr=after[0]-before[0], dz=after[1]-before[1];
    const span=Math.hypot(dr,dz)||1;
    for(let i=0;i<=segments;i++){
      const angle=i*tau/segments, c=Math.cos(angle), s=Math.sin(angle);
      positions.push(radius*c,radius*s,height);
      normals.push(c*dz/span,s*dz/span,-dr/span);
      uv.push(i/segments,j/(profile.length-1));
    }
  }
  const stride=segments+1;
  for(let j=0;j<profile.length;j++)for(let i=0;i<segments;i++){
    const a=j*stride+i,b=((j+1)%profile.length)*stride+i;
    indices.push(a,a+1,b,a+1,b+1,b);
  }
  const geometry=new BufferGeometry();
  geometry.setAttribute('position',new BufferAttribute(new Float32Array(positions),3));
  geometry.setAttribute('normal',new BufferAttribute(new Float32Array(normals),3));
  geometry.setAttribute('uv',new BufferAttribute(new Float32Array(uv),2));
  geometry.setIndex(indices);
  return piece(group,name,geometry,material,x,y,z);
}

function roundedPlate(group,name,material,width,height,depth,radius,x,y,z,bevel=.012) {
  const shape=new Shape(),w=width/2,h=height/2;
  const r=Math.min(radius,w*.94,h*.94);
  shape.moveTo(-w+r,-h);shape.lineTo(w-r,-h);shape.quadraticCurveTo(w,-h,w,-h+r);
  shape.lineTo(w,h-r);shape.quadraticCurveTo(w,h,w-r,h);shape.lineTo(-w+r,h);
  shape.quadraticCurveTo(-w,h,-w,h-r);shape.lineTo(-w,-h+r);
  shape.quadraticCurveTo(-w,-h,-w+r,-h);shape.closePath();
  return planarFinish(piece(group,name,extruded(shape,depth,bevel,8),material,x,y,z),Math.max(w,h));
}

function raised007(group,material,z,y) {
  for(const x of [-.163,-.015]){
    const zero=new Shape();
    zero.absellipse(0,0,.062,.078,0,tau,false,.19);
    const hole=new Path();
    hole.absellipse(0,0,.041,.055,0,tau,true,.19);
    zero.holes.push(hole);
    piece(group,'Накладной знак 0',extruded(zero,.012,.0015,20),material,x,y,z);
  }
  profile(group,'Накладной знак 7',material,[[.073,.074],[.209,.074],[.206,.060],
    [.121,-.079],[.094,-.079],[.175,.055],[.085,.055],[.073,.038]],.012,0,y,z,.0015);
}

function braceletSide(links,pins,steel,polish,inlay,side) {
  for(let row=0;row<9;row++){
    const y=side*(1.322+row*.160);
    const z=-.102-row*row*.0041;
    const scale=1-row*.026;
    const bend=-side*row*.048;
    const hinge=subassembly(links,0,y,z);
    hinge.rotation.x=bend;
    for(const end of [-1,1]){
      roundedPlate(hinge,'Наружное звено',steel,.158*scale,.127,.133,.028,end*.386*scale,0,0);
      roundedPlate(hinge,'Полированное промежуточное звено',polish,.111*scale,.126,.129,.024,end*.240*scale,.021,0);
    }
    roundedPlate(hinge,'Центральное звено',inlay,.343*scale,.131,.143,.025,0,.021,.012);
    const axle=rod(pins,'Штифт звена '+(row+1),polish,.020,.884*scale,0,y-.045*side,z-.025,18);
    axle.rotation.set(0,0,-Math.PI/2);
    for(const end of [-1,1]){
      const tip=rod(pins,'Торцевая втулка штифта',steel,.026,.023,end*.452*scale,y-.045*side,z-.025,20);
      tip.rotation.set(0,0,-Math.PI/2);
    }
  }
}

export function createCalibre007() {
  const root=new Group(), sections=[];
  const layer=(name,offset,start=0)=>{
    const group=subassembly(root);
    group.name=name;
    sections.push({group,origin:group.position.clone(),offset:new Vector3(...offset),start});
    return group;
  };
  const brushed=finishMap('brushed'), perlage=finishMap('perlage'), dialMap=finishMap('dial');
  const rose=metal(0xa66343,.27), polished=metal(0xdb9d60,.14), brass=metal(0xb08b50,.29);
  const steel=metal(0x9fa7b3,.20), blue=metal(0x233668,.22);
  brass.roughnessMap=brushed;
  brass.bumpMap=brushed;
  brass.bumpScale=.0024;
  const dark=new MeshStandardMaterial({color:0x0d1118,roughness:.60});
  const slate=metal(0x232b37,.30);
  const nickel=new MeshPhysicalMaterial({color:0x606e7c,roughness:.45,metalness:.88,
    anisotropy:.60,roughnessMap:brushed,bumpMap:brushed,bumpScale:.004});
  const perlageColor=new CanvasTexture(perlage.image);
  perlageColor.colorSpace=SRGBColorSpace;
  const milled=new MeshPhysicalMaterial({color:0xbdc7cd,roughness:.49,metalness:.83,
    map:perlageColor,roughnessMap:perlage,bumpMap:perlage,bumpScale:.006,clearcoat:.31});
  const enamel=new MeshPhysicalMaterial({color:0x132c49,metalness:.44,roughness:.29,clearcoat:.85,clearcoatRoughness:.17});
  const dialMat=enamel.clone();
  dialMat.map=dialMap;
  const crystal=new MeshPhysicalMaterial({color:0x779bc8,transparent:true,opacity:.055,roughness:.095,
    metalness:.17,clearcoat:.9,depthWrite:false,side:DoubleSide});
  const ruby=new MeshPhysicalMaterial({color:0xa60a36,metalness:.35,roughness:.15,clearcoat:1});
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
  const jewelClips=layer('Пружины и обоймы рубиновых опор',[.34,-.87,-1.78],.37);
  const fasteners=layer('Винты мостов и корпуса',[.46,-.74,-1.78],.32);
  const crown=layer('Заводная головка и вал',[1.07,.17,.20],.17);
  const keyless=layer('Муфта завода и переводной рычаг',[.96,-.43,.22],.30);
  const balanceLayer=layer('Баланс, спираль и импульсный камень',[-.78,-.54,-.43],.30);
  const palletLayer=layer('Анкерная вилка и палеты',[.20,-.88,-.44],.30);
  const balanceCock=layer('Мост баланса, градусник и амортизатор',[-.94,-.69,-1.02],.29);
  const strapTop=layer('Верхние звенья браслета',[0,.75,-.32],.19);
  const strapBottom=layer('Нижние звенья браслета',[0,-.76,-.34],.19);
  const pinTop=layer('Штифты верхних звеньев',[-.68,.73,-.39],.30);
  const pinBottom=layer('Штифты нижних звеньев',[.72,-.83,-.42],.30);
  const buckle=layer('Раскладная застёжка и кнопки',[.20,-1.05,-.55],.25);
  const claspInner=layer('Шарниры и пружина застёжки',[.68,-1.33,-.61],.31);
  const subdial=layer('Малая секундная шкала',[.68,-.34,1.62],.16);
  const secondsDrive=layer('Передача малой секунды',[.77,-.28,.58],.27);
  const windingSprings=layer('Фиксатор, пружины и шайбы завода',[1.13,-.59,.43],.33);

  turned(body,'Точёная середина корпуса',nickel,[[1.093,-.184],[1.193,-.187],[1.241,-.176],
    [1.278,-.150],[1.298,-.107],[1.302,.071],[1.284,.119],[1.244,.158],
    [1.195,.172],[1.095,.171],[1.083,.141],[1.083,-.141]]);
  turned(body,'Нижняя полированная фаска',steel,[[1.199,-.185],[1.239,-.185],[1.272,-.161],
    [1.276,-.145],[1.248,-.152],[1.221,-.168]]);
  torus(body,'Контрастный кант корпуса',polished,1.269,.008,0,0,.105);
  for (const side of [-1,1]) for (const end of [-1,1]) {
    const lug=profile(body,'Ушко корпуса с фаской',steel,[[side*.423,end*1.079],[side*.648,end*1.020],
      [side*.701,end*1.114],[side*.636,end*1.274],[side*.534,end*1.407],[side*.456,end*1.394],
      [side*.448,end*1.257]],.162,0,0,-.088,.013);
    planarFinish(lug,1.50);
    const bar=rod(end>0?pinTop:pinBottom,'Пружинная шпилька браслета',steel,.029,.122,side*.493,end*1.352,-.080,20);
    bar.rotation.set(0,0,-Math.PI/2);
  }
  for(const side of [-1,1])
    roundedPlate(side>0?strapTop:strapBottom,'Интегрированное концевое звено',steel,
      .886,.082,.124,.020,0,side*1.238,-.105,.010);
  turned(rimFront,'Полированный ступенчатый безель',polished,[[1.107,.154],[1.226,.155],[1.264,.174],
    [1.271,.198],[1.254,.222],[1.211,.246],[1.151,.254],[1.114,.238],[1.104,.214]]);
  ring(rimFront,'Прокладка переднего стекла',dark,1.132,1.104,.026,0,0,.225,.004);
  torus(rimFront,'Тонкий обод сапфира',steel,1.123,.006,0,0,.242);
  turned(crystalFront,'Слегка выпуклое сапфировое стекло',crystal,[[0,.254],[1.086,.248],[1.108,.246],
    [1.114,.258],[1.099,.279],[1.055,.286],[.83,.298],[.51,.307],[0,.313]]);
  turned(crystalBack,'Резьбовое кольцо задней крышки',steel,[[.962,-.287],[1.100,-.290],
    [1.177,-.278],[1.211,-.251],[1.213,-.225],[1.194,-.215],[.966,-.223]]);
  ring(crystalBack,'Золотой кант смотрового окна',polished,.996,.960,.018,0,0,-.290,.003);
  rod(crystalBack,'Смотровое стекло задней крышки',crystal,.964,.027,0,0,-.281,96);
  torus(crystalBack,'Прокладка задней крышки',dark,1.126,.013,0,0,-.219);
  for(let i=0;i<6;i++){
    const angle=i*tau/6;
    const [x,y]=point(1.116,angle);
    const notch=piece(crystalBack,'Шлиц задней крышки',new BoxGeometry(.065,.024,.013),slate,x,y,-.305);
    notch.rotation.z=angle;
  }

  const dialBase=ring(dial,'Циферблат с гильошированным полем',dialMat,1.103,.035,.036,0,0,.128,.003);
  planarFinish(dialBase,1.103);
  ring(dial,'Поднятая минутная дорожка',enamel,1.106,.976,.026,0,0,.146,.003);
  torus(dial,'Золочёный внешний рант',polished,1.069,.006,0,0,.163);
  torus(dial,'Тонкий рант внутренней шкалы',steel,.973,.0038,0,0,.161);
  for(let i=0;i<60;i++){
    const angle=i*tau/60;
    const major=i%5===0;
    const [x,y]=point(1.024,angle);
    const marker=piece(dial,'Риска минутной дорожки',new BoxGeometry(major?.069:.039,major?.012:.007,.006),
      major?polished:steel,x,y,.163);
    marker.rotation.z=angle;
    if(!major || i===15 || i===45)continue;
    const [mx,my]=point(.876,angle);
    const index=subassembly(dial,mx,my,.163);
    index.rotation.z=angle;
    roundedPlate(index,'Фасонный часовой индекс',polished,.125,.044,.029,.010,0,0,.010,.004);
    roundedPlate(index,'Светящаяся вставка индекса',lume,.079,.016,.007,.004,.005,0,.027,.001);
  }
  for(const x of [-.040,.040])
    roundedPlate(dial,'Двойной индекс 12 часов',polished,.031,.132,.034,.010,x,.877,.178,.005);
  raised007(dial,polished,.162,.506);
  textPlate(dial,'CALIBRE 01',.151,.332,.72,.145,'#d9b88f');
  const secondsY=-.546;
  rod(subdial,'Утопленный диск малой секунды',enamel,.278,.031,0,secondsY,.153,80);
  torus(subdial,'Накладной рант малой секунды',polished,.279,.010,0,secondsY,.172);
  for(let i=0;i<8;i++)
    torus(subdial,'Концентрическая риска малой секунды',blue,.068+i*.021,.0016,0,secondsY,.172);
  for(let i=0;i<30;i++){
    const angle=i*tau/30, [x,y]=point(.245,angle);
    const line=piece(subdial,'Риска малой секунды',new BoxGeometry(i%5===0?.035:.020,.005,.003),
      i%5===0?polished:steel,x,secondsY+y,.176);
    line.rotation.z=angle;
  }
  textPlate(dial,'HAND WOUND',.151,-.888,.61,.115,'#b7a58c');

  const h=subassembly(hour), m=subassembly(minute), s=subassembly(second,0,secondsY,0);
  hand(h,'Часовая стрелка',polished,.615,.116,.105,.168,lume);
  hand(m,'Минутная стрелка',polished,.865,.081,.104,.199,lume);
  hand(s,'Секундная стрелка',rose,.224,.021,.078,.198);
  rod(s,'Противовес секундной стрелки',polished,.021,.013,0,-.066,.203,24);
  ring(h,'Втулка часовой стрелки',steel,.057,.027,.037,0,0,.163,.004);
  ring(m,'Втулка минутной стрелки',polished,.043,.019,.028,0,0,.202,.003);
  rod(s,'Головка оси малой секунды',polished,.018,.017,0,0,.210,24);

  planarFinish(ring(plate,'Несущая платина с перлажем',milled,1.070,.134,.061,0,0,.033,.009),1.07);
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
    const collar=ring(wheel,'Напрессованная втулка колеса',polished,i===3?.029:.054,i===3?.012:.019,.024,0,0,-.025,.003);
    const washer=ring(wheel,'Упорная шайба оси',steel,i===3?.030:.039,.013,.012,0,0,.053,.002);
    train.push({group,wheel,gear,pin,arbor,collar,washer,pinZ:pin.position.z});
    ring(jewels,'Рубиновая опора '+(i+1),ruby,.042,.012,.026,x,y,-.226,.004);
    ring(jewels,'Золотой шатон '+(i+1),polished,.060,.041,.022,x,y,-.226,.003);
    ring(jewels,'Посадочное кольцо опоры',steel,.074,.060,.015,x,y,-.222,.002);
    rod(jewels,'Накладной рубин опоры',ruby,.028,.013,x,y,-.246,28);
    const snap=piece(jewelClips,'Разрезная пружина опоры',
      new TorusGeometry(.047,.007,8,48,tau*.82),steel,x,y,-.254);
    snap.rotation.z=.17+i*.87;
    for(const angle of [0,tau/3,2*tau/3]){
      const [dx,dy]=point(.063,angle);
      rod(jewelClips,'Штифт обоймы',steel,.010,.041,x+dx,y+dy,-.233,12);
    }
  }
  const motionCenter=subassembly(motionWorks,0,0,.069);
  const hourWheel=toothedWheel(motionCenter,'Часовое колесо',brass,.231,36,.025,.009,{spokes:4,bore:.042});
  const cannon=toothedWheel(motionCenter,'Минутный триб',steel,.082,12,.040,.023,{bore:.019});
  const motionIntermediate=subassembly(motionWorks,.288,0,.073);
  const minuteWheel=toothedWheel(motionIntermediate,'Вексельное колесо',brass,.192,32,.027,0,{spokes:4,bore:.019});
  rod(motionCenter,'Трубка минутного триба',steel,.019,.153,0,0,.053,20);
  rod(motionIntermediate,'Вексельный триб',steel,.060,.038,0,0,.033,20);
  const relay=[];
  for(const [i,[x,y]] of [[.732,-.132],[.568,-.263],[.378,-.370],[.188,-.471],[0,secondsY]].entries()){
    const transfer=subassembly(secondsDrive,x,y,.075);
    relay.push(toothedWheel(transfer,i===4?'Колесо малой секунды':'Промежуточное колесо малой секунды',
      brass,.108,21,.024,.012,{spokes:3,bore:.012}));
    rod(transfer,'Ось передачи малой секунды',steel,.014,i===4?.204:.083,0,0,.014,18);
  }

  function bridge(name,outline,holes,depth,z){
    const shape=polygon(outline);
    for(const [x,y,r] of holes)circleHole(shape,x,y,r);
    return planarFinish(piece(bridges,name,extruded(shape,depth,.006,16),milled,0,0,z),1.08);
  }
  bridge('Мост заводного барабана с перлажем',[[-.945,.386],[-.721,.785],[-.360,.918],
    [-.129,.806],[-.129,.498],[-.261,.187],[-.612,.041],[-.833,.156]],
    [[...barrelCenter,.122],[-.808,.417,.028],[-.430,.811,.027],[-.278,.262,.027]],.055,-.218);
  bridge('Мост колёсной передачи с фасками',[[-.167,.079],[.162,.237],[.509,.569],[.763,.576],
    [.933,.319],[1.002,.011],[.835,-.301],[.594,-.407],[.338,-.255],[.072,-.109]],
    [[0,0,.052],[...thirdCenter,.053],[...fourthCenter,.057],[.815,.373,.028],[.814,-.197,.025]],.047,-.238);
  bridge('Мост спускового колеса',[ [.275,-.356],[.482,-.348],[.743,-.406],
    [.747,-.577],[.472,-.694],[.229,-.559]],
    [[...escapeCenter,.044],[.394,-.566,.024]],.042,-.223);
  for(const [x,y] of [[-.808,.417],[-.430,.811],[-.278,.262],[.815,.373],[.814,-.197],[.394,-.566]])
    ring(bridges,'Фаска посадочного отверстия',steel,.042,.029,.012,x,y,-.257,.002);
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
  ring(balance,'Ролик баланса',steel,.110,.019,.018,0,0,.044,.003);
  ring(balance,'Предохранительный ролик',blue,.070,.020,.015,0,0,.073,.002);
  ring(balance,'Цанга крепления волоска',polished,.041,.020,.017,0,0,-.058,.002);
  screw(balance,'Винт крепления колодки волоска',blue,-.174,.063,-.065,.018,.038);
  profile(balanceCock,'Мост баланса',steel,[[-.891,-.274],[-.724,-.236],[-.542,-.388],[-.328,-.455],
    [-.278,-.536],[-.410,-.623],[-.643,-.558],[-.840,-.479]],.040,0,0,-.231,.007);
  ring(balanceCock,'Пружинная оправа амортизатора',polished,.068,.036,.034,...balancePoint,-.266,.005);
  for(const angle of [0,tau/3,2*tau/3]){
    const [dx,dy]=point(.058,angle);
    const clip=piece(balanceCock,'Лепесток пружины амортизатора',new BoxGeometry(.044,.015,.009),steel,
      balancePoint[0]+dx,balancePoint[1]+dy,-.290);
    clip.rotation.z=angle;
  }
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
  rod(fork,'Предохранительное копьё вилки',steel,.010,.074,-.245,.010,.026,14);
  for(const [x,y] of [[.119,.139],[.133,-.130]])
    rod(palletLayer,'Ограничительный штифт вилки',polished,.024,.092,.190+x,-.461+y,-.181,18);
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

  ring(windingSprings,'Опорная шайба муфты',steel,.087,.030,.017,.883,-.001,-.101,.003);
  ring(windingSprings,'Противопыльная манжета',dark,.075,.031,.023,1.056,0,-.034,.004);
  profile(windingSprings,'Стопор храповика',blue,[[-.685,.626],[-.581,.598],[-.519,.655],
    [-.549,.700],[-.619,.686],[-.692,.670]],.027,0,0,-.164,.005);
  spiral(windingSprings,'Спираль фиксатора',steel,-.665,.653,-.190,.011,.049,2.5,.006,.019);
  for(const y of [-.040,.040])
    rod(windingSprings,'Штифт вилки перевода',steel,.017,.055,.844,y,.060,16);
  braceletSide(strapTop,pinTop,nickel,steel,polished,1);
  braceletSide(strapBottom,pinBottom,nickel,steel,polished,-1);
  roundedPlate(buckle,'Внешняя крышка застёжки',nickel,.748,.317,.128,.042,0,-2.693,-.446);
  roundedPlate(buckle,'Внутренний язычок застёжки',steel,.587,.224,.063,.028,0,-2.638,-.522);
  for(const side of [-1,1]){
    roundedPlate(buckle,'Кнопка раскрытия застёжки',steel,.113,.112,.071,.023,side*.372,-2.650,-.478);
    roundedPlate(claspInner,'Шарнирная пластина застёжки',steel,.128,.287,.048,.024,side*.219,-2.733,-.561,.007);
    const pin=rod(claspInner,'Ось кнопки застёжки',steel,.021,.173,side*.217,-2.655,-.51,16);
    pin.rotation.set(0,0,-Math.PI/2);
  }
  roundedPlate(claspInner,'Мостик складной застёжки',nickel,.466,.162,.042,.025,0,-2.841,-.571,.006);
  const claspSpring=rod(claspInner,'Поперечная пружина замка',steel,.027,.344,0,-2.664,-.541,20);
  claspSpring.rotation.set(0,0,-Math.PI/2);

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
    relay.forEach((wheel,index)=>{wheel.rotation.z=(index%2?-1:1)*fourthAngle;});
    hourWheel.rotation.z=h.rotation.z;
    cannon.rotation.z=m.rotation.z;
    minuteWheel.rotation.z=-centerAngle*.6;
  }
  move(0);

  const trainGroups=train.map(({group})=>group);
  const frontGroups=[crystalFront,rimFront,dial,hour,minute,second,subdial,motionWorks,secondsDrive];
  return {
    root,sections,eye:[.24,.18,1],motion:move,motionLabel:'Запустить часы',
    lighting:{exposure:.88,key:2.87,rim:1.76,backlight:1.55,ambient:.28,environment:.78},
    adjustments:[
      {label:'Разборка колёс и осей',initial:0,apply(v){
        for(const {gear,pin,arbor,collar,washer,pinZ} of train){
          gear.position.z=.195*v/100;
          pin.position.z=pinZ-.138*v/100;
          arbor.position.z=.008-.305*v/100;
          collar.position.z=-.025+.087*v/100;
          washer.position.z=.053+.272*v/100;
        }
      }},
      {label:'Поворот заводной головки',initial:0,apply(v){winding=v/100;move(0);}},
      {label:'Темп показа',initial:70,min:20,max:100,apply(v){speed=v/100;}},
    ],
    presets:[
      {label:'Часы в сборе',amount:0,eye:[.24,.18,1]},
      {label:'Циферблат крупно',amount:0,groups:[body,crystalFront,rimFront,dial,hour,minute,second,subdial],eye:[.22,.14,1]},
      {label:'Вид сзади',amount:0,eye:[.22,.28,-1]},
      {label:'Все слои',amount:92,eye:[-.91,.29,1]},
      {label:'Стрелки и циферблат',amount:67,groups:frontGroups,eye:[-.72,.19,1]},
      {label:'Колёсная передача',amount:0,groups:[barrel,...trainGroups,palletLayer,balanceLayer],eye:[.15,.22,-1]},
      {label:'Анкер и баланс',amount:0,groups:[trainGroups.at(-1),palletLayer,balanceLayer],eye:[.17,.23,-1]},
      {label:'Барабан и пружина',amount:20,groups:[barrel,lid],eye:[.84,.24,-1]},
      {label:'Завод и перевод',amount:24,groups:[crown,keyless,windingSprings,lid],eye:[.32,.32,1]},
      {label:'Винты и опоры',amount:32,groups:[jewels,jewelClips,fasteners],eye:[.45,.18,-1]},
      {label:'Браслет и застёжка',amount:52,groups:[strapBottom,pinBottom,buckle,claspInner],eye:[.60,.31,1]},
      {label:'Малая секунда',amount:48,groups:[second,subdial,secondsDrive],eye:[-.54,.26,1]},
      {label:'Мосты и рубины',amount:58,groups:[bridges,balanceCock,jewels,jewelClips,fasteners],eye:[.77,.29,-1]},
    ],
  };
}
