import {
  BoxGeometry, CylinderGeometry, DoubleSide, ExtrudeGeometry, Group, Mesh,
  MeshBasicMaterial, MeshStandardMaterial, Path, Quaternion, Shape,
  SphereGeometry, TorusGeometry, Vector3,
} from './engine.js';

const PI = Math.PI;
const palette = {
  steel: [0xbac9d2, .72, .28], gunmetal: [0x354754, .64, .31], gold: [0xd49b5d, .67, .30],
  black: [0x1b2028, .12, .68], copper: [0xcd704d, .65, .29], orange: [0xe7793e, .32, .33],
  ivory: [0xede6d7, .10, .43], wood: [0xb9895d, .05, .64], darkWood: [0x6e4b37, .06, .63],
  blue: [0x567baf, .48, .32], teal: [0x467e79, .25, .36], green: [0x668555, .08, .78],
  glass: [0x83bfd1, .35, .24], concrete: [0x9b9e9e, .05, .85],
};
const mat = (name, extra = {}) => {
  const [color, metalness, roughness] = palette[name];
  return new MeshStandardMaterial({ color, metalness, roughness, ...extra });
};
const glow = color => new MeshBasicMaterial({ color });

function mesh(group, geometry, material, x, y, z) {
  const item = new Mesh(geometry, material);
  item.position.set(x, y, z);
  group.add(item);
  return item;
}
const box = (g, m, x, y, z, a, b, c) => mesh(g, new BoxGeometry(a, b, c), m, x, y, z);
const ball = (g, m, x, y, z, a, b = a, c = a) => {
  const item = mesh(g, new SphereGeometry(1, 24, 12), m, x, y, z);
  item.scale.set(a, b, c);
  return item;
};
function cylinder(g, m, x, y, z, r, h, axis = 'y', sides = 48, top = r) {
  const item = mesh(g, new CylinderGeometry(top, r, h, sides), m, x, y, z);
  if (axis === 'x') item.rotation.z = -PI / 2;
  if (axis === 'z') item.rotation.x = PI / 2;
  return item;
}
function torus(g, m, x, y, z, r, thickness, axis = 'z', arc = 2 * PI) {
  const item = mesh(g, new TorusGeometry(r, thickness, 10, 64, arc), m, x, y, z);
  if (axis === 'y') item.rotation.x = PI / 2;
  if (axis === 'x') item.rotation.y = PI / 2;
  return item;
}
function beam(g, m, a, b, width, depth = width) {
  const start = new Vector3(...a);
  const end = new Vector3(...b);
  const axis = end.clone().sub(start);
  const item = box(g, m, ...start.add(end).multiplyScalar(.5).toArray(), width, axis.length(), depth);
  item.quaternion.copy(new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), axis.normalize()));
  return item;
}
function part(g, x = 0, y = 0, z = 0) {
  const item = new Group();
  item.position.set(x, y, z);
  g.add(item);
  return item;
}
function assembly() {
  const root = new Group();
  const sections = [];
  return {
    root, sections,
    layer(direction, position = [0, 0, 0]) {
      const group = part(root, ...position);
      sections.push({ group, origin: group.position.clone(), offset: new Vector3(...direction) });
      return group;
    },
  };
}
function annulus(g, m, x, y, z, outer, inner, depth) {
  const profile = new Shape();
  profile.absarc(0, 0, outer, 0, 2 * PI, false);
  const hole = new Path();
  hole.absarc(0, 0, inner, 0, 2 * PI, true);
  profile.holes.push(hole);
  const geometry = new ExtrudeGeometry(profile, { depth, bevelEnabled: false, curveSegments: 32 });
  geometry.translate(0, 0, -depth / 2);
  return mesh(g, geometry, m, x, y, z);
}
function bolts(g, m, radius, z, count = 10, head = .09) {
  for (let i = 0; i < count; i++) {
    const a = i * 2 * PI / count;
    cylinder(g, m, Math.cos(a) * radius, Math.sin(a) * radius, z, head, .09, 'z', 6);
  }
}
function gear(g, m, x, y, z, r, count = 20, thickness = .25) {
  const item = part(g, x, y, z);
  annulus(item, m, 0, 0, 0, r, r * .28, thickness);
  for (let i = 0; i < count; i++) {
    const a = i * 2 * PI / count;
    const tooth = box(item, m, Math.cos(a) * r, Math.sin(a) * r, 0, r * .25, r * .16, thickness);
    tooth.rotation.z = a;
  }
  return item;
}
function rotor(g, m, hub, blades, radius, z = 0) {
  const p = part(g, 0, 0, z);
  cylinder(p, hub, 0, 0, 0, radius * .24, .31, 'z');
  for (let i = 0; i < blades; i++) {
    const holder = part(p);
    holder.rotation.z = i * 2 * PI / blades;
    const blade = box(holder, m, radius * .61, 0, 0, radius * .72, radius * .13, .09);
    blade.rotation.y = .34;
    blade.rotation.z = .22;
  }
  return p;
}

function turbine() {
  const a = assembly();
  const steel = mat('steel'), dark = mat('gunmetal'), gold = mat('gold');
  const back = a.layer([0, 0, -1.3], [0, 0, -.61]);
  annulus(back, dark, 0, 0, 0, 1.50, 1.21, .50);
  torus(back, steel, 0, 0, -.27, 1.44, .09);
  for (let i = 0; i < 12; i++) {
    const k = i * PI / 6;
    beam(back, steel, [0, 0, 0], [1.25 * Math.cos(k), 1.25 * Math.sin(k), -.18], .071);
  }
  const hub = a.layer([0, 0, 0]);
  cylinder(hub, dark, 0, 0, -.28, .23, 1.2, 'z');
  const spinning = rotor(hub, gold, steel, 19, 1.16, .06);
  ball(spinning, steel, 0, 0, .20, .28, .28, .37);
  const front = a.layer([0, 0, 1.5], [0, 0, .54]);
  annulus(front, steel, 0, 0, 0, 1.49, 1.24, .23);
  bolts(front, dark, 1.37, .15, 14, .059);
  a.motion = dt => { spinning.rotation.z -= dt * 3; };
  return a;
}
function pump() {
  const a = assembly(), blue = mat('blue'), steel = mat('steel'), bronze = mat('gold');
  const casing = a.layer([0, 0, -1.1]);
  annulus(casing, blue, 0, 0, 0, 1.36, .98, .69);
  cylinder(casing, blue, 0, 0, -.39, 1.35, .16, 'z');
  cylinder(casing, blue, .60, 1.17, -.04, .39, .94);
  cylinder(casing, steel, .60, 1.63, -.04, .58, .18);
  box(casing, steel, 0, -1.35, -.10, 2.45, .22, 1.18);
  const hub = a.layer([0, 0, .12]);
  const impeller = rotor(hub, bronze, steel, 8, .97, .33);
  const cap = a.layer([0, 0, 1.27], [0, 0, .62]);
  annulus(cap, blue, 0, 0, 0, 1.37, .70, .19);
  torus(cap, steel, 0, 0, .13, .73, .065);
  bolts(cap, steel, 1.15, .14, 9, .08);
  a.motion = dt => { impeller.rotation.z += dt * 2.4; };
  return a;
}
function reducer() {
  const a = assembly(), steel = mat('steel'), gold = mat('gold'), dark = mat('gunmetal');
  const shell = a.layer([0, 0, -1.40], [0, 0, -.42]);
  annulus(shell, dark, 0, 0, 0, 1.50, 1.17, .57);
  bolts(shell, steel, 1.37, .32, 12, .056);
  const train = a.layer([0, 0, .08]);
  const sun = gear(train, gold, 0, 0, 0, .43, 16);
  const planets = [0, 1, 2].map(i => {
    const theta = i * 2 * PI / 3;
    return gear(train, steel, Math.sin(theta) * .79, Math.cos(theta) * .79, 0, .36, 14);
  });
  const lid = a.layer([0, 0, 1.25], [0, 0, .47]);
  annulus(lid, steel, 0, 0, 0, 1.47, 1.13, .15);
  bolts(lid, gold, 1.32, .12, 10, .056);
  a.motion = dt => { sun.rotation.z += dt * 1.25; for (const planet of planets) planet.rotation.z -= dt * 1.48; };
  return a;
}
function arm() {
  const a = assembly(), orange = mat('orange'), metal = mat('gunmetal'), steel = mat('steel');
  cylinder(a.root, metal, 0, .14, 0, .77, .27);
  cylinder(a.root, steel, 0, .34, 0, .57, .14);
  const axis = part(a.root, 0, .43, 0);
  cylinder(axis, orange, 0, .20, 0, .49, .40);
  const elbow = part(axis, 0, .42, 0);
  cylinder(elbow, metal, 0, 0, 0, .29, .58, 'z');
  box(elbow, orange, 0, .61, 0, .37, 1.26, .38);
  box(elbow, metal, .23, .55, 0, .07, .92, .15);
  const wrist = part(elbow, 0, 1.24, 0);
  wrist.rotation.z = -1.22;
  cylinder(wrist, steel, 0, 0, 0, .25, .46, 'z');
  box(wrist, orange, 0, .42, 0, .32, .87, .30);
  cylinder(wrist, metal, 0, .93, 0, .23, .25);
  for (const x of [-.15, .15]) {
    beam(wrist, steel, [x, 1, 0], [x * 1.6, 1.26, 0], .095);
    beam(wrist, metal, [x * 1.6, 1.26, 0], [x * .9, 1.34, 0], .075);
  }
  a.adjust = { label: 'Поворот плеча', initial: 48, apply(value) { elbow.rotation.z = (value - 65) * .019; } };
  a.motion = (dt, t) => { axis.rotation.y += dt * .41; wrist.rotation.z = -1.15 + Math.sin(t * 1.5) * .32; };
  return a;
}
function motor() {
  const a = assembly(), dark = mat('gunmetal'), copper = mat('copper'), steel = mat('steel'), blue = mat('blue');
  const body = a.layer([0, 0, -.35]);
  annulus(body, blue, 0, 0, 0, 1.08, .82, 1.48);
  for (let i = 0; i < 26; i++) {
    const angle = i * 2 * PI / 26;
    const fin = box(body, blue, Math.cos(angle) * 1.07, Math.sin(angle) * 1.07, 0, .24, .055, 1.38);
    fin.rotation.z = angle;
  }
  box(body, dark, 0, -1.11, 0, 1.86, .19, 1.54);
  box(body, dark, 0, 1.16, -.1, .69, .32, .54);
  const coil = a.layer([0, 0, 1.25]);
  annulus(coil, steel, 0, 0, .29, .80, .60, .62);
  for (let i = 0; i < 18; i++) {
    const t = i * 2 * PI / 18;
    box(coil, copper, Math.cos(t) * .72, Math.sin(t) * .72, .32, .105, .105, .82);
  }
  const shaft = a.layer([0, 0, 2.04]);
  cylinder(shaft, dark, 0, 0, .48, .52, .59, 'z');
  cylinder(shaft, steel, 0, 0, .94, .17, 1.62, 'z');
  const cap = a.layer([0, 0, 3.05], [0, 0, .81]);
  annulus(cap, blue, 0, 0, 0, 1.08, .34, .18);
  bolts(cap, steel, .91, .12, 8, .062);
  a.motion = dt => { shaft.rotation.z += dt * 3; };
  return a;
}

function floor(a, w, d, material = mat('concrete')) {
  return box(a.root, material, 0, .07, 0, w, .14, d);
}
function furniture(g, wood, textile, x, z) {
  box(g, wood, x, .23, z, .98, .18, 1.55);
  box(g, textile, x, .40, z, .93, .18, 1.42);
  box(g, wood, x, .57, z - .78, 1.00, .58, .14);
  for (const dx of [-.21,.21]) box(g, mat('ivory'), x + dx, .53, z - .48, .36, .11, .31);
}
function cabin() {
  const a = assembly(), wood = mat('wood'), dark = mat('darkWood'), glass = mat('glass', { transparent: true, opacity: .34 }), white = mat('ivory');
  floor(a, 3.75, 4.12, dark);
  for (let i = -4; i <= 4; i++) box(a.root, wood, i * .35, .15, 0, .33, .045, 3.88);
  furniture(a.root, dark, white, -.46, -.68);
  box(a.root, wood, .73, .39, .79, .74, .43, .45);
  for (const z of [-1.76, 1.76]) {
    beam(a.root, dark, [-1.48, .15, z], [0, 2.82, z], .10);
    beam(a.root, dark, [1.48, .15, z], [0, 2.82, z], .10);
    beam(a.root, wood, [-1.48, .16, z], [1.48, .16, z], .10);
  }
  const shell = part(a.root);
  for (const sign of [-1, 1]) {
    const roof = box(shell, mat('gunmetal'), sign * .77, 1.51, 0, 3.19, .14, 3.90);
    roof.rotation.z = -sign * 1.056;
    for (let z = -1.72; z <= 1.77; z += .32) {
      beam(shell, dark, [0, 2.91, z], [sign * 1.60, .13, z], .037);
    }
  }
  const triangle = new Shape();
  triangle.moveTo(-1.38,.18);triangle.lineTo(1.38,.18);triangle.lineTo(0,2.70);triangle.closePath();
  mesh(a.root,new ExtrudeGeometry(triangle,{depth:.04,bevelEnabled:false}),glass,0,0,1.73);
  box(a.root,dark,0,1.30,1.78,.075,2.3,.085);
  a.shell = { group: shell, label: 'Снять крышу' };
  return a;
}
function greenhouse() {
  const a = assembly(), frame = mat('steel'), dirt = mat('darkWood'), grass = mat('green'), glass = mat('glass', { transparent:true,opacity:.22,side:DoubleSide,depthWrite:false });
  floor(a,4.24,3.25);
  for (const x of [-1.22,1.22]) {
    box(a.root,dirt,x,.26,0,.64,.24,2.57);
    for(let j=0;j<6;j++) {
      const z=(j-2.5)*.39;
      ball(a.root,grass,x,.47,z,.15,.24,.14);
      ball(a.root,grass,x+.14,.42,z,.12,.16,.1);
    }
  }
  const cover=part(a.root);
  for(const x of [-1.88,-.62,.62,1.88]) {
    for(const z of [-1.41,1.41]) beam(a.root,frame,[x,.14,z],[x,1.38,z],.058);
    beam(a.root,frame,[x,1.38,-1.41],[x,2.11,0],.060);
    beam(a.root,frame,[x,1.38,1.41],[x,2.11,0],.060);
  }
  for(const z of [-1.41,0,1.41]){
    const y=z===0?2.11:1.38;
    beam(a.root,frame,[-1.89,y,z],[1.89,y,z],.056);
  }
  for(const z of [-1.40,1.40]) {
    box(cover,glass,0,.79,z,3.70,1.20,.030);
    const slope=box(cover,glass,0,1.75,z/2,3.70,.035,1.58);
    slope.rotation.x=Math.sign(z)*.48;
  }
  for(const x of [-1.88,1.88]) box(cover,glass,x,.79,0,.035,1.20,2.76);
  a.shell={group:cover,label:'Скрыть стекло'};
  return a;
}
function cafe() {
  const a=assembly(), wood=mat('wood'), trim=mat('gunmetal'), sand=mat('ivory'), amber=glow(0xffcc7b);
  floor(a,4.75,3.5,mat('concrete'));
  box(a.root,sand,0,.98,-1.2,3.73,1.66,.16);
  box(a.root,trim,-1.8,.96,0,.15,1.64,2.52);
  for(let i=0;i<18;i++) box(a.root,wood,-1.65+i*.19,1.08,-1.085,.12,1.45,.055);
  box(a.root,wood,-.11,.60,.57,2.66,.86,.58);
  box(a.root,trim,-.11,1.04,.57,2.80,.11,.72);
  for(const x of [-1.16,-.48,.2,.88]){
    cylinder(a.root,trim,x,.27,1.33,.046,.37);
    cylinder(a.root,sand,x,.49,1.33,.17,.11);
  }
  for(const x of [-1.7,1.7]) beam(a.root,trim,[x,.12,1.1],[x,2,1.1],.08);
  const roof=part(a.root);
  box(roof,trim,0,2.04,0,3.96,.21,2.91);
  box(roof,wood,0,1.92,1.45,3.89,.29,.13);
  for(const x of [-1.10,0,1.10]) ball(roof,amber,x,1.79,.67,.085,.069,.085);
  a.shell={group:roof,label:'Показать интерьер'};
  return a;
}
function pavilion() {
  const a=assembly(), wood=mat('wood'), steel=mat('gunmetal'), seat=mat('teal');
  floor(a,4.2,4.2);
  for(const x of [-1.68,1.68]) for(const z of [-1.68,1.68]){
    cylinder(a.root,steel,x,.19,z,.19,.22);
    beam(a.root,wood,[x,.20,z],[x,2.24,z],.16);
  }
  for(const z of [-1.73,1.73]) beam(a.root,wood,[-1.76,2.19,z],[1.76,2.19,z],.15);
  for(const x of [-1.73,1.73]) beam(a.root,wood,[x,2.19,-1.76],[x,2.19,1.76],.15);
  box(a.root,seat,0,.47,-1.27,2.68,.13,.40);
  for(const x of [-1.13,1.13]) box(a.root,steel,x,.25,-1.27,.16,.27,.32);
  const canopy=part(a.root);
  for(let i=0;i<14;i++){
    const x=-1.80+i*.277;
    beam(canopy,wood,[x,2.22,-1.88],[x,2.43,.29],.145,.095);
    beam(canopy,wood,[x,2.43,.29],[x,2.29,1.88],.145,.095);
  }
  a.shell={group:canopy,label:'Снять навес'};
  return a;
}
function villa() {
  const a=assembly(), white=mat('ivory'), glass=mat('glass',{transparent:true,opacity:.52}), wood=mat('wood'), dark=mat('gunmetal');
  floor(a,5,4.6);
  box(a.root,mat('teal'),1.41,.16,1.04,1.43,.062,1.87);
  for(let i=0;i<8;i++)box(a.root,wood,-1.49+i*.31,.17,1.38,.29,.055,1.02);
  const ground=a.layer([0,0,0]);
  box(ground,white,-.71,.65,-1.21,2.62,1.03,.13);
  box(ground,white,-1.93,.65,-.27,.14,1.03,1.90);
  box(ground,glass,-.71,.65,.66,2.59,.99,.09);
  for(let x=-1.9;x<.6;x+=.47)box(ground,dark,x,.64,.69,.045,1.04,.10);
  furniture(ground,wood,white,-1.11,-.48);
  const upper=a.layer([0,1.14,0],[.27,1.20,-.38]);
  box(upper,white,0,.04,0,3.54,.16,1.87);
  box(upper,white,0,.61,-.88,3.54,1.03,.12);
  box(upper,glass,0,.61,.87,3.54,.99,.095);
  for(let x=-1.75;x<1.77;x+=.44)box(upper,dark,x,.61,.90,.043,1.03,.10);
  const roof=a.layer([0,2.1,0],[.27,2.37,-.38]);
  box(roof,white,0,0,0,3.64,.18,1.99);
  box(roof,wood,0,-.11,0,3.39,.065,1.83);
  return a;
}

function headphones() {
  const a=assembly(), finish=mat('blue'), steel=mat('steel'), pad=mat('black'), dark=mat('gunmetal');
  const arch=torus(a.root,finish,0,.50,0,1.15,.13,'z',PI);
  torus(a.root,pad,0,.49,0,1.02,.088,'z',PI);
  for(const sign of [-1,1]){
    beam(a.root,steel,[sign*1.14,.54,0],[sign*1.27,-.11,0],.08);
    const cups=a.layer([sign*.58,-.12,0],[sign*1.15,-.41,0]);
    cylinder(cups,finish,0,0,0,.47,.35,'x');
    cylinder(cups,steel,sign*.18,0,0,.38,.08,'x');
    const cushions=a.layer([sign*1.17,-.20,0],[sign*.91,-.41,0]);
    torus(cushions,pad,0,0,0,.33,.145,'x');
    cylinder(cushions,dark,sign*.11,0,0,.30,.045,'x');
  }
  a.finish=finish;
  return a;
}
function camera() {
  const a=assembly(), dark=mat('black'), body=mat('gunmetal'), silver=mat('steel'), lens=mat('glass');
  const frame=a.layer([0,0,-.44]);
  box(frame,body,0,0,-.30,2.20,1.35,.76);
  box(frame,dark,.82,-.04,.15,.43,1.17,.36);
  box(frame,silver,0,.68,-.31,2.05,.11,.73);
  cylinder(frame,silver,.67,.78,-.28,.24,.12);
  cylinder(frame,dark,-.72,.79,-.35,.15,.14);
  box(frame,dark,-.37,.10,-.707,1.22,.82,.04);
  const tube=a.layer([0,0,1.01],[-.27,0,.44]);
  cylinder(tube,dark,0,0,0,.60,.77,'z');
  for(let i=0;i<48;i++){
    const angle=i*2*PI/48;
    const rib=box(tube,body,Math.cos(angle)*.599,Math.sin(angle)*.599,0,.035,.035,.49);
    rib.rotation.z=angle;
  }
  torus(tube,silver,0,0,.35,.52,.038);
  ball(tube,lens,0,0,.42,.42,.42,.11);
  const filter=a.layer([0,0,1.92],[-.27,0,.91]);
  annulus(filter,dark,0,0,0,.61,.48,.13);
  a.finish=body;
  return a;
}
function coffee() {
  const a=assembly(), body=mat('teal'), steel=mat('steel'), black=mat('black'), copper=mat('copper');
  const frame=a.layer([0,0,-.43]);
  box(frame,body,0,1.34,-.61,1.75,2.60,.59);
  box(frame,body,0,2.36,.22,1.75,.55,1.36);
  box(frame,steel,0,2.43,.92,1.66,.31,.05);
  for(const x of [-.47,-.15,.17]) cylinder(frame,black,x,2.44,.97,.075,.11,'z');
  cylinder(frame,copper,.58,2.44,.98,.16,.11,'z');
  const base=a.layer([0,-.65,0]);
  box(base,body,0,.16,.08,1.75,.31,1.68);
  box(base,steel,0,.33,.26,1.57,.07,1.21);
  for(let i=0;i<13;i++)box(base,black,-.70+i*.116,.374,.27,.039,.009,1.09);
  const brew=a.layer([0,.32,1.19]);
  cylinder(brew,steel,0,1.98,.43,.43,.24);
  beam(brew,black,[.31,1.90,.43],[.87,1.93,.91],.13);
  const cup=part(a.root,0,.41,.51);
  cylinder(cup,mat('ivory'),0,.26,0,.28,.43,'y',36,.34);
  torus(cup,mat('ivory'),.30,.29,0,.15,.044,'z');
  cylinder(cup,mat('darkWood'),0,.49,0,.29,.035);
  a.finish=body;
  return a;
}
function watch() {
  const a=assembly(), steel=mat('steel'), gold=mat('gold'), strap=mat('darkWood'), face=mat('gunmetal'), white=mat('ivory');
  for(const sign of [-1,1]){
    for(let i=0;i<7;i++){
      const y=sign*(.81+i*.19);
      box(a.root,strap,0,y,-.05-i*.012,.68-i*.016,.17,.15);
      if(i%2===0) for(const x of [-.27,.27])ball(a.root,gold,x,y,.034,.018);
    }
  }
  const shell=a.layer([0,0,-.55]);
  annulus(shell,steel,0,0,0,.81,.61,.32);
  cylinder(shell,steel,.82,0,0,.12,.24,'x',16);
  const dial=a.layer([0,0,.28]);
  cylinder(dial,face,0,0,.08,.65,.105,'z');
  for(let i=0;i<12;i++){
    const t=i*2*PI/12;
    const marker=box(dial,white,Math.sin(t)*.54,Math.cos(t)*.54,.145,.039,.113,.020);
    marker.rotation.z=-t;
  }
  const hands=part(dial,0,0,.16);
  beam(hands,gold,[0,0,0],[-.25,.17,0],.041);
  beam(hands,white,[0,0,.01],[.23,.38,.01],.028);
  const second=part(hands);
  beam(second,glow(0xf58a54),[0,-.07,.024],[0,.50,.024],.013);
  ball(hands,gold,0,0,.037,.052);
  const front=a.layer([0,0,1.10],[0,0,.22]);
  torus(front,gold,0,0,0,.74,.068);
  a.motion=dt=>{second.rotation.z-=dt*.55;};
  a.finish=strap;
  return a;
}
function lamp() {
  const a=assembly(), white=mat('ivory'), bronze=mat('gold'), body=mat('teal'), warm=glow(0xffda92);
  cylinder(a.root,body,0,.115,0,.63,.23);
  cylinder(a.root,bronze,0,.25,0,.24,.11);
  const pivot=part(a.root,0,.29,0);
  for(const z of [-.10,.10]){
    beam(pivot,bronze,[0,0,z],[-.53,.96,z],.051);
    beam(pivot,bronze,[-.53,.96,z],[.34,1.58,z],.051);
  }
  for(const [x,y] of [[0,0],[-.53,.96],[.34,1.58]])cylinder(pivot,body,x,y,0,.13,.33,'z');
  const shade=part(pivot,.44,1.59,0);
  shade.rotation.z=.55;
  cylinder(shade,body,.16,-.12,0,.37,.40,'y',40,.17);
  torus(shade,white,.16,-.33,0,.34,.025,'y');
  ball(shade,warm,.16,-.30,0,.19,.09,.19);
  a.adjust={label:'Наклон плафона',initial:51,apply(v){shade.rotation.z=(v-30)*.026;}};
  a.finish=body;
  return a;
}

function drone() {
  const a=assembly(), skin=mat('ivory'), dark=mat('gunmetal'), trim=mat('orange'), rubber=mat('black');
  box(a.root,skin,0,.72,0,.88,.32,1.17);
  box(a.root,trim,0,.91,0,.59,.064,.84);
  ball(a.root,dark,0,.57,.60,.22,.15,.20);
  cylinder(a.root,mat('glass'),0,.57,.76,.11,.075,'z');
  const props=[];
  for(const x of [-1.24,1.24])for(const z of [-1.08,1.08]){
    beam(a.root,dark,[0,.71,0],[x,.70,z],.112);
    cylinder(a.root,trim,x,.72,z,.18,.19);
    beam(a.root,rubber,[x,.63,z],[x*.95,.25,z*.94],.09);
    const prop=part(a.root,x,.89,z);
    cylinder(prop,skin,0,0,0,.10,.12);
    box(prop,dark,0,0,0,1.11,.035,.10);
    box(prop,dark,0,0,0,.09,.035,1.07);
    props.push(prop);
  }
  a.motion=dt=>props.forEach((p,i)=>{p.rotation.y+=dt*(i%2?13:-13);});
  a.finish=skin;
  return a;
}
function satellite() {
  const a=assembly(), steel=mat('steel'), bronze=mat('gold'), blue=mat('blue'), dark=mat('gunmetal');
  box(a.root,bronze,0,0,0,1.06,1.10,.95);
  for(const x of [-.54,.54])box(a.root,steel,x,0,0,.09,1.21,1.02);
  cylinder(a.root,steel,0,.77,0,.26,.49);
  const dish=cylinder(a.root,steel,0,1.04,0,.20,.23,'y',48,.59);
  dish.rotation.z=-.24;
  beam(a.root,dark,[0,1.14,0],[.18,1.58,0],.05);
  ball(a.root,bronze,.18,1.58,0,.075);
  const wings=[];
  for(const side of [-1,1]){
    const pivot=part(a.root,side*.57,0,0);
    beam(pivot,steel,[0,0,0],[side*.39,0,0],.082);
    for(let x=0;x<5;x++)for(let z=0;z<3;z++)
      box(pivot,blue,side*(.51+x*.26),0,(z-1)*.26,.244,.050,.241);
    box(pivot,steel,side*1.02,-.038,0,1.33,.037,.80);
    wings.push(pivot);
  }
  a.adjust={label:'Раскрытие панелей',initial:100,apply(v){wings.forEach((p,i)=>{p.rotation.z=(i?1:-1)*(1-v/100)*1.47;});}};
  return a;
}
function rover() {
  const a=assembly(), gold=mat('gold'), dark=mat('gunmetal'), steel=mat('steel'), tread=mat('black');
  box(a.root,gold,0,.91,0,2.18,.43,1.21);
  box(a.root,steel,0,1.15,0,1.82,.10,1.13);
  box(a.root,dark,-.66,1.25,.05,.83,.14,.78);
  beam(a.root,steel,[.52,1.13,.14],[.52,1.91,.14],.078);
  box(a.root,steel,.56,1.97,.14,.39,.22,.27);
  ball(a.root,glow(0x8bcde8),.65,1.96,.285,.063);
  const wheels=[];
  for(const side of [-1,1])for(const x of [-1.02,0,1.02]){
    const z=side*.91;
    beam(a.root,steel,[x*.82,.85,side*.52],[x,.40,z],.070);
    const wheel=part(a.root,x,.38,z);
    cylinder(wheel,tread,0,0,0,.34,.29,'z');
    cylinder(wheel,steel,0,0,side*.154,.21,.065,'z',12);
    for(let i=0;i<14;i++){
      const angle=i*PI/7;
      const lug=box(wheel,dark,Math.cos(angle)*.335,Math.sin(angle)*.335,0,.075,.10,.315);
      lug.rotation.z=angle;
    }
    wheels.push(wheel);
  }
  a.motion=dt=>wheels.forEach(p=>{p.rotation.z+=dt*1.75;});
  return a;
}
function telescope() {
  const a=assembly(), steel=mat('steel'), body=mat('blue'), dark=mat('black'), brass=mat('gold');
  for(let i=0;i<3;i++){
    const angle=i*2*PI/3;
    const x=Math.cos(angle),z=Math.sin(angle);
    beam(a.root,steel,[x*.09,1.02,z*.09],[x*.93,.07,z*.93],.09);
    beam(a.root,dark,[x*.07,.70,z*.07],[x*.47,.53,z*.47],.052);
    box(a.root,dark,x*.93,.045,z*.93,.18,.09,.17);
  }
  cylinder(a.root,brass,0,1.07,0,.24,.18);
  const mount=part(a.root,0,1.28,0);
  const tube=part(mount);
  cylinder(tube,body,0,0,0,.29,2.08,'x');
  cylinder(tube,dark,-1.02,0,0,.34,.23,'x');
  torus(tube,steel,-1.16,0,0,.275,.055,'x');
  cylinder(tube,mat('glass'),-1.14,0,0,.23,.035,'x');
  cylinder(tube,brass,1.10,0,0,.17,.24,'x');
  cylinder(tube,dark,1.31,0,0,.125,.29,'x');
  cylinder(tube,steel,-.32,.31,0,.076,.49,'x');
  a.adjust={label:'Угол наведения',initial:48,apply(v){tube.rotation.z=(v-25)*PI/177;}};
  a.motion=dt=>{mount.rotation.y+=dt*.45;};
  a.finish=body;
  return a;
}
function charger() {
  const a=assembly(), white=mat('ivory'), dark=mat('gunmetal'), teal=mat('teal'), black=mat('black');
  box(a.root,dark,0,.12,0,1.22,.24,1.03);
  box(a.root,white,0,1.45,-.26,1.12,2.57,.30);
  box(a.root,dark,0,1.45,.02,.95,2.46,.20);
  for(let j=0;j<6;j++)box(a.root,teal,0,.63+j*.18,.17,.77,.135,.17);
  for(const z of [-.13,.12]){
    beam(a.root,mat('copper'),[-.33,1.72,z],[.34,2.08,z],.042);
  }
  const shell=part(a.root);
  box(shell,white,0,1.45,.30,1.08,2.51,.19);
  box(shell,black,0,1.96,.41,.69,.55,.045);
  box(shell,glow(0x7be8d5),0,2.00,.438,.43,.30,.012);
  box(shell,dark,0,1.48,.43,.25,.063,.043);
  const cable=torus(a.root,black,.73,1.1,.12,.51,.035,'z',PI*1.57);
  cable.scale.set(.62,1.38,1);
  box(a.root,dark,.82,1.74,.17,.24,.28,.17);
  a.shell={group:shell,label:'Снять панель'};
  a.finish=white;
  return a;
}

export const catalog = [
  ['turbine','Турбина','industry','Ротор, лопатки и корпус в разборе',turbine],
  ['cabin','Дом A-frame','architecture','Поднимите крышу и рассмотрите планировку',cabin],
  ['headphones','Наушники','products','Амбушюры, чашки и варианты отделки',headphones],
  ['drone','Квадрокоптер','tech','Камера, подвес и вращение винтов',drone],
  ['pump','Центробежный насос','industry','Рабочее колесо и посадка крышки',pump],
  ['greenhouse','Теплица','architecture','Стеклянная оболочка и схема каркаса',greenhouse],
  ['camera','Фотокамера','products','Корпус, объектив и защитный фильтр',camera],
  ['satellite','Спутник','tech','Раскройте солнечные панели ползунком',satellite],
  ['reducer','Редуктор','industry','Солнце и сателлиты планетарной передачи',reducer],
  ['cafe','Модульное кафе','architecture','Стойка, посадочные места и свет',cafe],
  ['coffee','Кофемашина','products','Группа, поддон и панель управления',coffee],
  ['rover','Марсоход','tech','Шестиколёсная ходовая часть в движении',rover],
  ['arm','Рука робота','industry','Поворот основания и угол плеча',arm],
  ['pavilion','Садовый павильон','architecture','Стойки, стропила и реечный навес',pavilion],
  ['watch','Наручные часы','products','Корпус, циферблат и ход секундной стрелки',watch],
  ['telescope','Телескоп','tech','Настройте наклон оптической трубы',telescope],
  ['motor','Электродвигатель','industry','Статор, обмотка, вал и крышка',motor],
  ['villa','Вилла с террасой','architecture','Разнесите уровни и рассмотрите этажи',villa],
  ['lamp','Настольная лампа','products','Угол плафона и варианты цвета',lamp],
  ['charger','Зарядная станция','tech','Снимите панель и посмотрите компоновку',charger],
].map(([id,title,category,description,create])=>({id,title,category,description,create}));
