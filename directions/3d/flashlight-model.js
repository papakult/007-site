import * as T from './engine.js';
import {CatmullRomCurve3, LatheGeometry, TubeGeometry, Vector2} from './flashlight-geometry.js';

const V=(x,y,z)=>new T.Vector3(x,y,z);
const X=V(1,0,0),Y=V(0,1,0),Z=V(0,0,1);
const metal=(color,roughness=.29)=>new T.MeshStandardMaterial({color,roughness,metalness:.85});
const matte=(color,roughness=.58)=>new T.MeshStandardMaterial({color,roughness,metalness:.05});
const material={
  body:metal(0x293a44,.34), edge:metal(0x516371,.30), notch:metal(0x14232c,.42),
  brass:metal(0xe1a660,.30), gold:metal(0xf6bb55,.32), silver:metal(0xe0e8ee,.28),
  reflector:metal(0xf4f8ff,.17), rubber:matte(0x151d22,.83), plastic:matte(0x323d4d,.72),
  green:matte(0x17624b,.50), greenEdge:matte(0x275348,.54), chip:matte(0x1b2125,.48),
  ceramic:matte(0xb29a74,.63), sand:matte(0xce9f65,.57), white:matte(0xe8eae4,.45),
  red:matte(0xf0584b,.48), black:matte(0x384b69,.44), amber:matte(0xf3ab52,.45),
  turquoise:matte(0x39c8ce,.44), cell:metal(0x40626a,.32), cellBand:metal(0xbc7855,.32),
  glass:new T.MeshPhysicalMaterial({color:0xc9e8ff,metalness:.2,roughness:.11,transparent:true,opacity:.16,depthWrite:false,clearcoat:1}),
  phosphor:new T.MeshStandardMaterial({color:0xfbe283,roughness:.37,emissive:0xffd47d,emissiveIntensity:.05})
};
const cache=new Map();
const geo=(key,create)=>{if(!cache.has(key))cache.set(key,create());return cache.get(key);};
function mesh(parent,geometry,mat,x=0,y=0,z=0){
  const m=new T.Mesh(geometry,mat);m.position.set(x,y,z);parent.add(m);return m;
}
function group(parent,id,title,x=0,y=0,z=0){
  const node=new T.Group();node.position.set(x,y,z);node.name=title;node.userData.id=id;parent.add(node);return node;
}
function box(g,w,h,d,m,x=0,y=0,z=0){
  return mesh(g,geo(['b',w,h,d].join(),()=>new T.BoxGeometry(w,h,d)),m,x,y,z);
}
function cylinder(g,r,h,m,x=0,y=0,z=0,axis=X,segments=64,r2=r){
  const m0=mesh(g,geo(['c',r,r2,h,segments].join(),()=>new T.CylinderGeometry(r,r2,h,segments)),m,x,y,z);
  m0.quaternion.setFromUnitVectors(Y,axis);return m0;
}
function profile(g,points,m,at=0,segments=96){
  const geometry=new LatheGeometry(points.map(([r,x])=>new Vector2(r,x)),segments);
  geometry.rotateZ(-Math.PI/2);
  return mesh(g,geometry,m,at,0,0);
}
function ring(g,r,thick,w,m,x){
  const R=r-thick;
  return profile(g,[[R,-w/2],[r-.012,-w/2],[r,-w/2+.013],[r,w/2-.013],[r-.012,w/2],[R,w/2],[R,-w/2]],m,x);
}
function torus(g,r,t,m,x,y=0,z=0,axis=X){
  const o=mesh(g,geo(['tor',r,t].join(),()=>new T.TorusGeometry(r,t,10,72)),m,x,y,z);
  o.quaternion.setFromUnitVectors(Z,axis);return o;
}
function screwThread(g,start,end,r,m,turns=6,thickness=.014){
  const points=[];
  for(let i=0;i<=turns*23;i++){
    const a=i/(turns*23)*turns*2*Math.PI;
    points.push(V(start+(end-start)*i/(turns*23),r*Math.sin(a),r*Math.cos(a)));
  }
  return mesh(g,new TubeGeometry(new CatmullRomCurve3(points),turns*23,thickness,7,false),m);
}
function line(g,points,r,m,tension=.43){
  const p=points.map(a=>V(...a));
  const path=new CatmullRomCurve3(p,false,'catmullrom',tension);
  return mesh(g,new TubeGeometry(path,Math.max(32,p.length*13),r,12,false),m);
}
function texture(width,height,paint){
  const c=document.createElement('canvas');c.width=width;c.height=height;
  paint(c.getContext('2d'),width,height);
  const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=4;return tex;
}
function label(g,value,w,h,x,y,z,{color='#dbe4de',size=110}={}){
  const map=texture(1024,256,(c,W,H)=>{
    c.fillStyle=color;c.textAlign='center';c.textBaseline='middle';
    c.font='700 '+size+'px system-ui';c.fillText(value,W/2,H/2+4);
  });
  return mesh(g,new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map,transparent:true,depthWrite:false}),x,y,z);
}
function grip(g,x0,x1,r,n,depth=.033){
  const w=x1-x0;
  for(let i=0;i<n;i++){
    const a=i/n*Math.PI*2;
    const o=box(g,w,.075,depth,material.edge,(x0+x1)/2,r*Math.sin(a),r*Math.cos(a));
    o.rotation.x=-a;
  }
}
function helicalSpring(g,x0,x1,r0,r1){
  const points=[];
  for(let i=0;i<=110;i++){
    const t=i/110,a=t*Math.PI*10,r=r0+(r1-r0)*t;
    points.push(V(x0+(x1-x0)*t,r*Math.sin(a),r*Math.cos(a)));
  }
  mesh(g,new TubeGeometry(new CatmullRomCurve3(points),110,.026,10,false),material.brass);
}
function contact(g,x,r=.22){
  cylinder(g,r,.044,material.brass,x);
  cylinder(g,r*.48,.048,material.gold,x+.03);
  torus(g,r*.74,.008,material.silver,x+.026);
}
function battery(parent,id,title,x){
  const g=group(parent,id,title,x);
  cylinder(g,.350,1.028,material.cell);
  cylinder(g,.354,.20,material.cellBand,.398);
  cylinder(g,.343,.038,material.silver,-.514);
  cylinder(g,.329,.027,material.silver,.516);
  cylinder(g,.145,.055,material.silver,.555);
  torus(g,.273,.011,material.rubber,-.536);
  const text=label(g,'AA   1.5 V',.73,.19,-.085,0,.354,{color:'#e4eee9',size:156});text.rotation.z=0;
  label(g,'+',.15,.18,.395,0,.358,{color:'#fff2de',size:192});
  return g;
}
function pin(g,x,y,z,w,h){
  box(g,w,h,.021,material.silver,x,y,z);
  box(g,w*.65,h,.016,material.brass,x,y,z-.026);
}
function pad(g,x,y,w=.089,h=.077){
  box(g,w,h,.012,material.gold,x,y,.050);
}
function trace(g,points,color=material.gold,z=.046,width=.014){
  for(let i=1;i<points.length;i++){
    const [ax,ay]=points[i-1],[bx,by]=points[i];
    const len=Math.hypot(bx-ax,by-ay);
    const o=box(g,len+width*.7,width,.006,color,(ax+bx)/2,(ay+by)/2,z);
    o.rotation.z=Math.atan2(by-ay,bx-ax);
  }
}
function pcbText(g,text,x,y,w=.15,h=.048){
  return label(g,text,w,h,x,y,.056,{color:'#e5eee6',size:175});
}
function terminal(g,name,x,y,mat=material.gold){
  const node=group(g,name,name,x,y,.058);
  cylinder(node,.044,.018,mat,0,0,0,Z,28);
  return node;
}
function driver(parent,x){
  const g=group(parent,'pcb','Плата драйвера',x);
  g.rotation.y=Math.PI/2;
  cylinder(g,.537,.075,material.greenEdge,0,0,0,Z,96);
  cylinder(g,.530,.009,material.green,0,0,.041,Z,96);
  torus(g,.508,.009,material.gold,0,0,.048,Z);
  const artwork=group(g,'traces','Дорожки и площадки');
  const traceMap=[
    [[-.395,-.24],[-.395,.17],[-.38,.30],[-.31,.30]],
    [[-.395,-.24],[-.31,-.27],[-.14,-.27],[-.14,-.066]],
    [[-.31,.30],[-.30,.21],[-.26,.18],[-.26,.080],[-.14,.068]],
    [[-.06,.30],[-.035,.25],[.14,.25],[.14,.070]],
    [[.14,.25],[.21,.24]],[[.39,.24],[.399,.10],[.399,-.19]],
    [[.399,.10],[.32,.10],[.275,.065]],[[.275,-.10],[.26,-.20],[.25,-.38]],
    [[-.14,0],[-.20,0],[-.20,-.18],[-.26,-.18]],
    [[.14,-.07],[.14,-.13],[.103,-.19],[.22,-.19],[.25,-.38]],
    [[-.07,-.31],[-.07,-.39],[.10,-.40],[.15,-.38]],
    [[.399,-.19],[.38,-.285],[.34,-.30]]
  ];
  traceMap.forEach((p,i)=>trace(artwork,p,i%3===0?material.brass:material.gold,.046,.012));
  trace(artwork,[[-.43,-.18],[-.42,-.35],[-.29,-.43],[.12,-.43],[.41,-.30],[.44,.13]],material.brass,-.040,.020);
  for(const [x0,y0] of [[-.43,-.18],[-.42,-.35],[-.29,-.43],[.12,-.43],[.41,-.30],[.44,.13],[.19,.37],[-.20,.40],[.09,.29],[-.32,.10]]){
    cylinder(g,.017,.010,material.gold,x0,y0,.050,Z,18);
    cylinder(g,.006,.011,material.greenEdge,x0,y0,.055,Z,14);
  }
  const U=group(g,'u1','U1 · TPS61040',0,0,.083);
  box(U,.233,.164,.091,material.chip,0,0,.020);
  for(const y of [-.067,0,.067])pin(U,-.140,y,-.008,.074,.031);
  for(const y of [-.069,.069])pin(U,.140,y,-.008,.074,.031);
  cylinder(U,.019,.004,material.white,-.076,.052,.068,Z,18);
  label(U,'61040',.173,.053,.021,0,.067,{color:'#aebec1',size:167});
  pcbText(g,'U1',-.002,-.140,.14,.063);
  const L=group(g,'l1','L1 · дроссель',-.182,.302,.057);
  box(L,.260,.170,.144,material.chip,0,0,.074);
  box(L,.238,.155,.011,material.plastic,0,0,.152);
  for(const s of [-1,1])box(L,.058,.130,.030,material.silver,s*.103,0,.025);
  label(L,'100',.164,.057,0,0,.160,{color:'#cbd5d2',size:180});
  pcbText(g,'L1',-.235,.183,.14,.053);
  const D=group(g,'d1','D1 · диод Шоттки',.300,.246,.058);
  box(D,.171,.108,.089,material.chip,0,0,.045);
  box(D,.027,.111,.003,material.silver,.047,0,.091);
  for(const s of [-1,1])box(D,.050,.087,.019,material.silver,s*.095,0,.020);
  pcbText(g,'D1',.286,.350,.14,.050);
  const smd=(id,title,x0,y0,w,h,m,mark)=>{
    const part=group(g,id,title,x0,y0,.056);
    pad(part,-w*.43,0,w*.36,h*.91);pad(part,w*.43,0,w*.36,h*.91);
    box(part,w,h,.062,m,0,0,.042);
    for(const s of [-1,1])box(part,w*.19,h*1.02,.065,material.silver,s*w*.415,0,.041);
    if(mark)label(part,mark,w*.75,h*.45,0,0,.074,{color:'#e1eae2',size:180});
    return part;
  };
  smd('c1','C1 · входной конденсатор',-.226,-.243,.137,.091,material.ceramic);
  pcbText(g,'C1',-.225,-.154,.14,.050);
  smd('c2','C2 · выходной конденсатор',.294,.080,.133,.085,material.sand);
  pcbText(g,'C2',.317,-.006,.14,.050);
  smd('rs','RS · резистор тока LED',.266,-.235,.142,.084,material.chip,'820');
  pcbText(g,'RS',.273,-.319,.135,.052);
  terminal(g,'VIN',-.394,-.24);terminal(g,'GND',.100,-.40);
  terminal(g,'LED+',.399,-.19);terminal(g,'LED−',.25,-.38);
  pcbText(g,'VIN',-.377,-.315,.133,.052);pcbText(g,'GND',.003,-.340,.133,.052);
  pcbText(g,'+',.408,-.12,.060,.050);pcbText(g,'−',.200,-.364,.06,.052);
  const back=label(g,'TORCH / REV A',.57,.125,0,.10,-.043,{color:'#8ebdad',size:112});back.rotation.y=Math.PI;
  return g;
}
function emitter(parent,x){
  const g=group(parent,'led','LED на алюминиевой плате',x);
  cylinder(g,.516,.067,material.silver);
  cylinder(g,.476,.016,material.white,.044);
  cylinder(g,.263,.022,material.brass,.054);
  box(g,.070,.285,.285,material.white,.086);
  box(g,.018,.185,.185,material.phosphor,.127);
  const lens=cylinder(g,.111,.044,material.glass,.151);
  lens.renderOrder=3;
  for(const y of [-.326,.326]){
    box(g,.011,.098,.170,material.gold,.056,y,0);
    box(g,.013,.048,.135,material.silver,.066,y,0);
  }
  return g;
}
function harness(parent){
  const g=group(parent,'harness','Жгут и выводы');
  const wire=(id,title,points,m)=>{
    const sub=group(g,id,title);
    const start=points[0],end=points.at(-1);
    const delta0=V(...points[1]).sub(V(...start)).normalize(),delta1=V(...end).sub(V(...points.at(-2))).normalize();
    line(sub,points,.023,m,.22);
    for(const [p,dir,s] of [[start,delta0,-1],[end,delta1,1]]){
      const at=V(...p).addScaledVector(dir,s*.028);
      cylinder(sub,.012,.059,material.brass,at.x,at.y,at.z,dir,16);
      cylinder(sub,.021,.026,material.silver,p[0],p[1],p[2],dir,18);
    }
    return sub;
  };
  wire('w1','W1 · красный, питание',[ [.20,-.25,.08],[.28,-.28,.23],[.39,-.31,.31],[.67,-.315,.345],[.87,-.266,.393],[1.043,-.24,.394] ],material.red);
  wire('w2','W2 · синий, возврат от кнопки',[ [-2.27,-.11,.17],[-2.09,-.31,.23],[-1.75,-.386,.162],[-.35,-.392,.157],[.51,-.400,.058],[.82,-.417,-.065],[1.043,-.40,-.10] ],material.black);
  wire('w3','W3 · янтарный, LED+',[ [1.043,-.19,-.399],[1.092,-.16,-.468],[1.137,.092,-.461],[1.172,.278,-.168],[1.235,.326,0] ],material.amber);
  wire('w4','W4 · бирюзовый, LED−',[ [1.043,-.38,-.25],[1.085,-.42,-.275],[1.14,-.410,-.227],[1.18,-.355,-.140],[1.235,-.326,0] ],material.turquoise);
  return g;
}
export function buildFlashlight(scene){
  const root=group(scene,'assembly','Фонарь');
  const nodes={};
  const place=(id,title,x,dx,dy,dz)=>{const g=group(root,id,title,x);nodes[id]=g;g.userData.home=g.position.clone();g.userData.offset=V(dx,dy,dz);return g;};
  const body=place('body','Алюминиевый корпус',-.81,-.56,-.55,-.14);
  profile(body,[[.420,-1.48],[.466,-1.48],[.497,-1.43],[.497,-1.31],[.475,-1.27],[.475,1.23],[.502,1.28],[.502,1.43],[.467,1.48],[.420,1.48],[.420,-1.48]],material.body);
  for(let i=0;i<4;i++){
    const x0=-1.08+i*.54;
    grip(body,x0,x0+.32,.466,36,.022);
  }
  for(const x0 of [-1.31,1.31])ring(body,.511,.030,.07,material.edge,x0);
  for(const x0 of [-1.14,-.60,-.06,.48,1.02])ring(body,.479,.015,.033,material.notch,x0);
  screwThread(body,1.22,1.45,.425,material.edge,5,.009);
  screwThread(body,-1.45,-1.23,.425,material.edge,5,.009);
  const badge=box(body,1.28,.30,.017,material.notch,.02,0,.480);badge.rotation.x=0;
  label(body,'FIELD  02',1.17,.23,.015,0,.492,{color:'#edf5e9',size:156});
  label(body,'2 × AA',.36,.094,.38,-.10,.495,{color:'#d4b28c',size:150});

  const shell=place('head','Корпус оптики',1.215,.98,.48,-.51);
  profile(shell,[[.419,-.55],[.479,-.55],[.515,-.48],[.515,-.36],[.568,-.27],[.624,-.16],[.663,-.12],[.681,.32],[.683,.52],[.650,.59],[.612,.59],[.603,.18],[.545,-.16],[.540,-.28],[.465,-.36],[.419,-.43],[.419,-.55]],material.body);
  for(let i=0;i<6;i++)ring(shell,.676+i*.002,.042,.036,material.notch,i*.087-.076);
  for(const x0 of [-.39,-.34,.484])ring(shell,x0<0?.538:.690,.034,.038,material.brass,x0);
  grip(shell,.39,.51,.662,44,.027);
  screwThread(shell,.35,.53,.620,material.edge,5,.009);

  const tail=place('tail','Задняя крышка',-2.391,-2.42,.03,.02);
  profile(tail,[[.422,-.30],[.491,-.30],[.536,-.23],[.537,.10],[.511,.20],[.471,.23],[.420,.23],[.420,-.19],[.357,-.19],[.357,-.30],[.422,-.30]],material.body);
  grip(tail,-.225,.082,.521,35,.029);
  ring(tail,.524,.040,.074,material.brass,.105);
  screwThread(tail,.017,.205,.421,material.edge,5,.009);
  cylinder(tail,.346,.079,material.rubber,-.247);
  for(let y=-.21;y<=.22;y+=.10)for(let z=-.21;z<=.22;z+=.10)if(y*y+z*z<.085)
    cylinder(tail,.028,.013,material.notch,-.291,y,z,X,12);
  torus(tail,.243,.013,material.edge,-.293);

  const bezel=place('bezel','Прижимное кольцо',1.878,2.64,.08,.0);
  ring(bezel,.702,.078,.183,material.body,0);
  ring(bezel,.709,.029,.065,material.brass,.060);
  for(let i=0;i<12;i++){
    const a=i/12*Math.PI*2;
    const o=box(bezel,.098,.115,.032,material.notch,.005,.691*Math.sin(a),.691*Math.cos(a));
    o.rotation.x=-a;
  }
  const gasket=place('gasket','Уплотнительное кольцо',1.810,2.15,-.31,.29);
  torus(gasket,.598,.029,material.rubber,0);
  const lens=place('lens','Защитное стекло',1.792,1.94,.61,.12);
  cylinder(lens,.602,.046,material.glass,0).renderOrder=4;
  torus(lens,.596,.009,material.silver,.024);
  const reflector=place('reflector','Рефлектор',1.43,1.58,.25,.02);
  profile(reflector,[[.154,-.239],[.208,-.215],[.265,-.167],[.348,-.089],[.431,.018],[.510,.154],[.576,.330],[.596,.345],[.602,.356],[.602,.333],[.586,.307],[.526,.137],[.446,-.002],[.367,-.110],[.285,-.188],[.208,-.244],[.154,-.249],[.154,-.239]],material.reflector);
  ring(reflector,.604,.023,.038,material.silver,.331);
  const light=emitter(root,1.148);nodes.led=light;light.userData.home=light.position.clone();light.userData.offset=V(1.25,-.55,.38);
  const pcb=driver(root,.965);nodes.pcb=pcb;pcb.userData.home=pcb.position.clone();pcb.userData.offset=V(.87,.95,.58);
  const contacts=place('contact','Плюсовой контакт батарей',.208,.24,-.06,.30);
  cylinder(contacts,.380,.095,material.plastic);
  contact(contacts,-.067,.222);
  const a=battery(root,'cellA','Батарейка AA № 1',-.359);
  const b=battery(root,'cellB','Батарейка AA № 2',-1.430);
  for(const [g,dx,dy,dz] of [[a,.29,-.05,.69],[b,-.37,.24,.68]]){
    nodes[g.userData.id]=g;g.userData.home=g.position.clone();g.userData.offset=V(dx,dy,dz);
  }
  const spring=place('spring','Пружинный контакт',-2.115,-1.31,-.37,.17);
  contact(spring,-.076,.27);helicalSpring(spring,-.053,.112,.197,.106);
  const sw=place('switch','S1 · кнопка питания',-2.254,-1.86,.63,.46);
  cylinder(sw,.352,.065,material.green,-.003);
  cylinder(sw,.341,.009,material.greenEdge,.036);
  box(sw,.159,.299,.299,material.plastic,-.101);
  cylinder(sw,.112,.143,material.rubber,-.223);
  cylinder(sw,.122,.037,material.amber,-.308);
  for(const y of [-.215,.215]){
    box(sw,.031,.094,.105,material.gold,.046,y,.13);
    box(sw,.071,.046,.068,material.silver,.097,y,.13);
  }
  const wires=harness(root);nodes.harness=wires;wires.userData.home=wires.position.clone();wires.userData.offset=V(0,-.96,.58);
  return {root,nodes,phosphor:material.phosphor};
}
