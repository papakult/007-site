import {
  BoxGeometry, CylinderGeometry, DoubleSide, ExtrudeGeometry, Group, Mesh,
  MeshBasicMaterial, MeshStandardMaterial, Path, Quaternion, Shape,
  SphereGeometry, TorusGeometry, Vector3,
} from './engine.js';
import { createCar, createBuilding, createDetail } from './models.js?v=assemblies';
import { makeFlange } from './flange.js';

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
    layer(direction, position = [0, 0, 0], name = '', start = 0) {
      const group = part(root, ...position);
      group.name = name;
      sections.push({ group, origin: group.position.clone(), offset: new Vector3(...direction), start });
      return group;
    },
  };
}
function view(label, group, target, distance, eye, reveal = []) {
  return {label, group, target:new Vector3(...target), distance, eye, reveal};
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
    cylinder(g, m, Math.cos(a) * radius, Math.sin(a) * radius, z, head, .09, 'z', 6).name = 'Головка крепёжного болта';
  }
}
function gear(g, m, x, y, z, r, count = 20, thickness = .25) {
  const item = part(g, x, y, z);
  annulus(item, m, 0, 0, 0, r, r * .28, thickness).name = 'Венец шестерни';
  for (let i = 0; i < count; i++) {
    const a = i * 2 * PI / count;
    const tooth = box(item, m, Math.cos(a) * r, Math.sin(a) * r, 0, r * .25, r * .16, thickness);
    tooth.rotation.z = a;
    tooth.name = 'Зуб шестерни';
  }
  return item;
}
function rotor(g, m, hub, blades, radius, z = 0) {
  const p = part(g, 0, 0, z);
  cylinder(p, hub, 0, 0, 0, radius * .24, .31, 'z').name = 'Ступица';
  for (let i = 0; i < blades; i++) {
    const holder = part(p);
    holder.rotation.z = i * 2 * PI / blades;
    const blade = box(holder, m, radius * .61, 0, 0, radius * .72, radius * .13, .09);
    blade.name = 'Лопатка ротора';
    blade.rotation.y = .34;
    blade.rotation.z = .22;
  }
  return p;
}

function turbine() {
  const a = assembly();
  const steel = mat('steel'), dark = mat('gunmetal'), gold = mat('gold');
  const back = a.layer([0,0,-1.3],[0,0,-.61],'Задний корпус и статор');
  annulus(back, dark, 0, 0, 0, 1.50, 1.21, .50).name='Корпус';
  torus(back, steel, 0, 0, -.27, 1.44, .09);
  for (let i = 0; i < 12; i++) {
    const k = i * PI / 6;
    beam(back, steel, [0, 0, 0], [1.25 * Math.cos(k), 1.25 * Math.sin(k), -.18], .071).name='Направляющая статора';
  }
  const hub = a.layer([0,0,0],undefined,'Ротор и вал');
  cylinder(hub, dark, 0, 0, -.28, .23, 1.2, 'z');
  const spinning = rotor(hub, gold, steel, 19, 1.16, .06);
  ball(spinning, steel, 0, 0, .20, .28, .28, .37);
  const front = a.layer([0,0,1.5],[0,0,.54],'Передний фланец');
  annulus(front, steel, 0, 0, 0, 1.49, 1.24, .23).name='Фланец';

  a.motion = dt => { spinning.rotation.z -= dt * 3; };

  const seal=a.layer([0,0,.74],[0,0,.36],'Уплотнения и опора вала',.18);
  const fix=a.layer([0,0,2.35],[0,0,.68],'Болты фланца',.30);
  for (let i=0;i<14;i++) {
    const t=i*2*PI/14;
    joint(fix,steel,1.37*Math.cos(t),1.37*Math.sin(t),0,'z',.059,.25);
  }
  torus(seal,gold,0,0,.04,1.258,.022).name='Уплотнение корпуса';
  annulus(seal,dark,0,0,-.10,.386,.233,.092).name='Сепаратор опоры';
  for (let i=0;i<12;i++){
    const t=i*2*PI/12;
    ball(seal,steel,.309*Math.cos(t),.309*Math.sin(t),-.055,.032).name='Шарик подшипника';
  }
  a.fasteners=[fix];
  a.views=[view('Лопатки ротора',hub,[0,0,.12],3.4),
    view('Опора вала',seal,[0,0,-.05],1.8,[.6,.2,1])];

  return a;
}
function pump() {
  const a = assembly(), blue = mat('blue'), steel = mat('steel'), bronze = mat('gold');
  const casing = a.layer([0,0,-1.26],undefined,'Корпус и патрубок');
  annulus(casing, blue, 0, 0, 0, 1.36, .98, .69).name='Улитка насоса';
  cylinder(casing, blue, 0, 0, -.39, 1.35, .16, 'z');
  cylinder(casing, blue, .60, 1.17, -.04, .39, .94).name='Напорный патрубок';
  cylinder(casing, steel, .60, 1.63, -.04, .58, .18);
  box(casing, steel, 0, -1.35, -.10, 2.45, .22, 1.18);
  const hub = a.layer([0,0,.12],undefined,'Крыльчатка и вал');
  const impeller = rotor(hub, bronze, steel, 8, .97, .33);
  const cap = a.layer([0,0,1.55],[0,0,.62],'Крышка и впуск');
  annulus(cap, blue, 0, 0, 0, 1.37, .70, .19);
  torus(cap, steel, 0, 0, .13, .73, .065);

  a.motion = dt => { impeller.rotation.z += dt * 2.4; };

  const seal=a.layer([0,0,.82],[0,0,.49],'Прокладка и торцевое уплотнение',.14);
  const fasteners=a.layer([0,0,2.41],[0,0,.76],'Стяжные болты',.28);
  torus(seal,mat('black'),0,0,0,1.206,.026).name='Прокладка крышки';
  annulus(seal,bronze,0,0,-.22,.315,.15,.11).name='Торцевое уплотнение';
  cylinder(hub,steel,0,0,-.27,.13,1.05,'z',24).name='Вал крыльчатки';
  for(let i=0;i<9;i++){
    const t=i*2*PI/9;
    joint(fasteners,steel,1.15*Math.cos(t),1.15*Math.sin(t),0,'z',.067,.25);
  }
  a.fasteners=[fasteners];
  a.shell={group:cap,label:'Снять крышку',restoreLabel:'Вернуть крышку'};
  a.views=[view('Рабочее колесо',hub,[0,0,.31],3.0,[.37,.22,1],[cap]),
    view('Торцевое уплотнение',seal,[0,0,-.22],1.4,[.38,.22,1],[cap])];

  return a;
}
function reducer() {
  const a = assembly(), steel = mat('steel'), gold = mat('gold'), dark = mat('gunmetal');
  const shell = a.layer([0,0,-1.4],[0,0,-.42],'Корпус и зубчатый венец');
  annulus(shell, dark, 0, 0, 0, 1.50, 1.17, .57).name='Корпус редуктора';
  bolts(shell, steel, 1.37, .32, 12, .056);
  const train = a.layer([0,0,.08],undefined,'Солнечная шестерня и сателлиты');
  const sun = gear(train, gold, 0, 0, 0, .43, 16);
  const carrier = part(train);
  const planets = [0, 1, 2].map(i => {
    const theta = i * 2 * PI / 3;
    return gear(carrier, steel, Math.sin(theta) * .79, Math.cos(theta) * .79, 0, .36, 14);
  });
  const lid = a.layer([0,0,1.45],[0,0,.47],'Передняя крышка');
  annulus(lid, steel, 0, 0, 0, 1.47, 1.13, .15).name='Крышка';

  a.motion = dt => {
    sun.rotation.z += dt * 1.25;
    carrier.rotation.z += dt * .36;
    for (const planet of planets) planet.rotation.z -= dt * 1.14;
  };

  const output=a.layer([0,0,.66],[0,0,.19],'Водило и выходной вал',.12);
  const fix=a.layer([0,0,2.16],[0,0,.59],'Крепёж крышки',.28);
  for(let i=0;i<42;i++){
    const t=i*2*PI/42;
    box(shell,steel,1.17*Math.cos(t),1.17*Math.sin(t),.09,.12,.082,.32).rotation.z=t;
    shell.children.at(-1).name='Внутренний зуб венца';
  }
  annulus(output,gold,0,0,0,1.065,.41,.068).name='Диск водила';
  cylinder(output,steel,0,0,.25,.21,.55,'z',24).name='Выходной вал';
  for(let i=0;i<3;i++){
    const t=i*2*PI/3;
    cylinder(carrier,gold,.79*Math.sin(t),.79*Math.cos(t),.15,.083,.39,'z',20).name='Палец сателлита';
  }
  for(let i=0;i<10;i++){
    const t=i*2*PI/10;
    joint(fix,gold,1.32*Math.cos(t),1.32*Math.sin(t),0,'z',.048,.24);
  }
  a.fasteners=[fix];
  a.shells=[{groups:[output,lid],label:'Открыть передачу',restoreLabel:'Закрыть передачу'}];
  a.views=[view('Планетарная передача',train,[0,0,0],3.05,[.30,.22,1],[lid,output])];

  return a;
}
function arm() {
  const a = assembly(), orange = mat('orange'), metal = mat('gunmetal'), steel = mat('steel');
  const base=a.layer([0,-.28,0],undefined,'Станина и поворотное основание');
  const mechanical=a.layer([0,0,0],undefined,'Звенья и захват');
  cylinder(base, metal, 0, .14, 0, .77, .27);
  cylinder(base, steel, 0, .34, 0, .57, .14);
  const axis = part(mechanical, 0, .43, 0);
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

  const wristCover=a.layer([.73,.40,.64],[0,0,0],'Съёмный кожух привода',.18);
  const fasteners=a.layer([0,-.18,.72],undefined,'Анкерные болты',.24);
  for(let i=0;i<8;i++){
    const t=i*2*PI/8;
    joint(fasteners,steel,.655*Math.cos(t),.24,.655*Math.sin(t),'y',.038,.16);
  }
  cylinder(axis,steel,0,.06,0,.32,.13,'y',28).name='Опорный подшипник';
  for(const [group,r] of [[elbow,.255],[wrist,.203]]){
    const gearbox=part(group,0,0,.29);
    gear(gearbox,steel,0,0,0,r,18,.046);
    cylinder(gearbox,metal,0,0,.044,.11,.12,'z',24).name='Ось шарнира';
    bolts(gearbox,steel,r*.82,.058,6,.021);
  }
  box(wristCover,orange,0,1.02,-.255,.48,.49,.10).name='Сервисная крышка';
  beam(elbow,metal,[-.19,.17,.17],[-.20,1.13,.17],.044).name='Кабельный рукав';
  a.fasteners=[fasteners];
  a.views=[view('Плечевой редуктор',elbow,[0,.04,.27],1.35,[.7,.36,1]),
    view('Губки захвата',wrist,[0,1.18,0],1.47,[1,.3,1])];

  return a;
}
function motor() {
  const a = assembly(), dark = mat('gunmetal'), copper = mat('copper'), steel = mat('steel'), blue = mat('blue');
  const body = a.layer([0,0,-.44],undefined,'Ребристый корпус');
  annulus(body, blue, 0, 0, 0, 1.08, .82, 1.48);
  for (let i = 0; i < 26; i++) {
    const angle = i * 2 * PI / 26;
    const fin = box(body, blue, Math.cos(angle) * 1.07, Math.sin(angle) * 1.07, 0, .24, .055, 1.38);
    fin.rotation.z = angle;
    fin.name='Ребро охлаждения';
  }
  box(body, dark, 0, -1.11, 0, 1.86, .19, 1.54);
  box(body, dark, 0, 1.16, -.1, .69, .32, .54);
  const coil = a.layer([0,0,1.25],undefined,'Статор и обмотка');
  annulus(coil, steel, 0, 0, .29, .80, .60, .62);
  for (let i = 0; i < 18; i++) {
    const t = i * 2 * PI / 18;
    box(coil,copper,Math.cos(t)*.72,Math.sin(t)*.72,.32,.105,.105,.82).name='Пазовая обмотка';
  }
  const shaft = a.layer([0,0,2.04],undefined,'Ротор и приводной вал');
  cylinder(shaft, dark, 0, 0, .48, .52, .59, 'z');
  cylinder(shaft, steel, 0, 0, .94, .17, 1.62, 'z');
  const cap = a.layer([0,0,3.05],[0,0,.81],'Передняя крышка и опора');
  annulus(cap, blue, 0, 0, 0, 1.08, .34, .18);

  a.motion = dt => { shaft.rotation.z += dt * 3; };

  const fan=a.layer([0,0,-1.30],[0,0,-.77],'Вентилятор и задняя крышка');
  const terminals=a.layer([0,.68,0],[0,1.35,-.12],'Клеммная колодка',.14);
  const fix=a.layer([0,0,3.52],[0,0,.93],'Стяжные винты',.32);
  const blades=rotor(fan,steel,dark,9,.74);
  annulus(fan,blue,0,0,-.13,1.06,.82,.22).name='Кольцо кожуха вентилятора';
  annulus(cap,steel,0,0,.06,.34,.177,.074).name='Передний подшипник';
  box(terminals,dark,0,0,0,.56,.11,.42).name='Клеммная колодка';
  for(const x of [-.17,0,.17]){
    cylinder(terminals,copper,x,.075,0,.044,.1,'y',12).name='Контактная шпилька';
    box(terminals,steel,x,.15,.07,.095,.037,.24).name='Контактная перемычка';
  }
  for(let i=0;i<8;i++){
    const t=i*PI/4;
    joint(fix,steel,.91*Math.cos(t),.91*Math.sin(t),0,'z',.051,.29);
  }
  const rotate=a.motion;
  a.motion=dt=>{rotate(dt);blades.rotation.z+=dt*3;};
  a.fasteners=[fix];
  a.views=[view('Медная обмотка',coil,[0,0,.30],2.72),view('Клеммная колодка',terminals,[0,.07,0],1.20)];

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
  floor(a,3.75,4.12,dark).name='Фундамент';
  const interior=a.layer([0,0,0],undefined,'Интерьер и настил');
  const frame=a.layer([0,.32,0],undefined,'Фронтоны и стропила');
  const facade=a.layer([0,0,1.14],undefined,'Остекление фронтона',.15);
  const rafters=a.layer([0,.82,0],undefined,'Обрешётка',.18);
  for (let i = -4; i <= 4; i++) box(interior, wood, i * .35, .15, 0, .33, .045, 3.88);
  furniture(interior, dark, white, -.46, -.68);
  box(interior, wood, .73, .39, .79, .74, .43, .45);
  for (const z of [-1.76, 1.76]) {
    beam(frame, dark, [-1.48, .15, z], [0, 2.82, z], .10);
    beam(frame, dark, [1.48, .15, z], [0, 2.82, z], .10);
    beam(frame, wood, [-1.48, .16, z], [1.48, .16, z], .10);
  }
  const shell=a.layer([0,1.72,0],undefined,'Кровельные скаты');
  for (const sign of [-1, 1]) {
    const roof = box(shell, mat('gunmetal'), sign * .77, 1.51, 0, 3.19, .14, 3.90);
    roof.rotation.z = -sign * 1.056;
    roof.name='Кровельный лист';
    for (let z = -1.72; z <= 1.77; z += .32) {
      beam(rafters,dark,[0,2.80,z],[sign*1.48,.15,z],.064).name='Стропило';
    }
  }
  const triangle = new Shape();
  triangle.moveTo(-1.38,.18);triangle.lineTo(1.38,.18);triangle.lineTo(0,2.70);triangle.closePath();
  mesh(facade,new ExtrudeGeometry(triangle,{depth:.04,bevelEnabled:false}),glass,0,0,1.73).name='Треугольный стеклопакет';
  box(facade,dark,0,1.30,1.78,.075,2.3,.085).name='Импост фронтона';
  a.shell = { group: shell, label: 'Снять крышу' };

  const loft=a.layer([0,.62,-.48],undefined,'Антресоль и лестница',.24);
  const joints=a.layer([.40,.98,.65],undefined,'Накладки и винты стропил',.30);
  box(loft,wood,0,1.33,-1.04,1.61,.095,1.34).name='Настил антресоли';
  for(let i=0;i<9;i++) {
    const y=.19+i*.137,z=.52-i*.109;
    box(loft,wood,.62,y,z,.42,.061,.135).name='Ступень лестницы';
  }
  for(const x of [.42,.82]) beam(loft,dark,[x,.14,.60],[x,1.35,-.46],.055).name='Тетива лестницы';
  const steel=mat('steel');
  for(const z of [-1.76,1.76]){
    box(joints,steel,0,2.71,z+.073,.26,.16,.028).name='Коньковая накладка';
    for(const x of [-.08,.08]) joint(joints,steel,x,2.72,z+.083,'z',.018,.085);
  }
  a.fasteners=[joints];
  a.views=[view('Узел конька',joints,[0,2.71,1.80],1.36,[.54,.5,1]),
    view('Антресоль и интерьер',loft,[.3,1.01,0],4.8,[.43,.45,1],[shell,facade])];
  a.shells=[{groups:[facade],label:'Снять остекление',restoreLabel:'Вернуть остекление'}];

  return a;
}
function greenhouse() {
  const a = assembly(), frame = mat('steel'), dirt = mat('darkWood'), grass = mat('green'), glass = mat('glass', { transparent:true,opacity:.22,side:DoubleSide,depthWrite:false });
  floor(a,4.24,3.25).name='Подиум';
  const beds=a.layer([0,.20,.53],undefined,'Грядки и растения');
  const structure=a.layer([0,0,0],undefined,'Профили и стропила');
  for (const x of [-1.22,1.22]) {
    box(beds,dirt,x,.26,0,.64,.24,2.57);
    for(let j=0;j<6;j++) {
      const z=(j-2.5)*.39;
      ball(beds,grass,x,.47,z,.15,.24,.14);
      ball(beds,grass,x+.14,.42,z,.12,.16,.1);
    }
  }
  const cover=a.layer([0,1.24,0],undefined,'Секции остекления');
  for(const x of [-1.88,-.62,.62,1.88]) {
    for(const z of [-1.41,1.41]) beam(structure,frame,[x,.14,z],[x,1.38,z],.058);
    beam(structure,frame,[x,1.38,-1.41],[x,2.11,0],.060);
    beam(structure,frame,[x,1.38,1.41],[x,2.11,0],.060);
  }
  for(const z of [-1.41,0,1.41]){
    const y=z===0?2.11:1.38;
    beam(structure,frame,[-1.89,y,z],[1.89,y,z],.056);
  }
  for(const z of [-1.40,1.40]) {
    for(const x of [-1.24,0,1.24]) {
      box(cover,glass,x,.79,z,1.20,1.20,.030).name='Боковая панель';
      const slope=box(cover,glass,x,1.75,z/2,1.20,.035,1.58);
      slope.rotation.x=Math.sign(z)*.48; slope.name='Кровельная панель';
    }
  }
  for(const x of [-1.88,1.88]) box(cover,glass,x,.79,0,.035,1.20,2.76);
  a.shell={group:cover,label:'Скрыть стекло'};

  const water=a.layer([0,.43,.94],undefined,'Капельный полив',.20);
  const hardware=a.layer([.34,.72,-.58],undefined,'Петли и соединения',.27);
  const ventLayer=a.layer([0,.96,.29],undefined,'Верхняя форточка',.16);
  const vent=part(ventLayer,0,2.14,.02);
  box(vent,frame,0,-.11,.21,.91,.040,.51).name='Рама форточки';
  box(vent,glass,0,-.072,.21,.80,.018,.44).name='Стекло форточки';
  for(const x of [-.35,.35]) cylinder(hardware,frame,x,2.13,.025,.041,.135,'x',16).name='Шарнир форточки';
  const tube=mat('black'), tap=mat('gold');
  beam(water,tube,[-1.62,.38,-1.16],[1.62,.38,-1.16],.055).name='Магистраль полива';
  for(const x of [-1.22,1.22]){
    beam(water,tube,[x,.36,-1.16],[x,.36,1.12],.034).name='Капельная линия';
    for(let j=0;j<6;j++) cylinder(water,tap,x,.38,(j-2.5)*.39,.024,.039,'y',12).name='Капельница';
    joint(hardware,frame,x,1.37,1.40,'z',.026,.10);
  }
  a.adjust={label:'Открытие форточки',initial:0,apply(value){vent.rotation.x=-value*.012;}};
  a.fasteners=[hardware];
  a.views=[view('Капельный полив',water,[1.22,.38,0],2.4,[.43,.56,1],[cover]),
    view('Петли форточки',ventLayer,[0,2.13,.20],2.15,[.3,.8,1],[cover])];

  return a;
}
function cafe() {
  const a=assembly(), wood=mat('wood'), trim=mat('gunmetal'), sand=mat('ivory'), amber=glow(0xffcc7b);
  floor(a,4.75,3.5,mat('concrete')).name='Основание';
  const walls=a.layer([-.35,0,-.59],undefined,'Стеновые панели');
  const counter=a.layer([0,0,.63],undefined,'Бар и мебель');
  box(walls,sand,0,.98,-1.2,3.73,1.66,.16);
  box(walls,trim,-1.8,.96,0,.15,1.64,2.52);
  for(let i=0;i<18;i++) box(walls,wood,-1.65+i*.19,1.08,-1.085,.12,1.45,.055);
  box(counter,wood,-.11,.60,.57,2.66,.86,.58);
  box(counter,trim,-.11,1.04,.57,2.80,.11,.72);
  for(const x of [-1.16,-.48,.2,.88]){
    cylinder(counter,trim,x,.27,1.33,.046,.37);
    cylinder(counter,sand,x,.49,1.33,.17,.11);
  }
  for(const x of [-1.7,1.7]) beam(walls,trim,[x,.12,1.1],[x,2,1.1],.08);
  const roof=a.layer([0,1.24,0],undefined,'Кровля и вывеска');
  box(roof,trim,0,2.04,0,3.96,.21,2.91);
  box(roof,wood,0,1.92,1.45,3.89,.29,.13);

  a.shell={group:roof,label:'Показать интерьер'};

  const lights=a.layer([0,.57,.13],undefined,'Освещение и проводка',.18);
  const equipment=a.layer([.72,.36,.30],undefined,'Оборудование стойки',.25);
  for(const x of [-1.10,0,1.10]){
    beam(lights,trim,[x,1.98,.67],[x,1.82,.67],.025).name='Подвес светильника';
    cylinder(lights,wood,x,1.81,.67,.109,.085,'y',24,.076).name='Плафон';
    ball(lights,amber,x,1.76,.67,.074,.034,.074).name='Рассеиватель';
  }
  beam(lights,trim,[-1.5,1.98,.67],[1.5,1.98,.67],.030).name='Кабельный канал';
  box(equipment,trim,-.55,1.27,.49,.62,.35,.35).name='Корпус кофемашины';
  box(equipment,sand,-.55,1.26,.68,.54,.23,.031).name='Панель управления';
  cylinder(equipment,wood,-.49,1.11,.70,.085,.08).name='Группа подачи';
  box(equipment,trim,.55,1.25,.48,.32,.31,.31).name='Корпус кофемолки';
  cylinder(equipment,sand,.55,1.44,.48,.131,.13,'y',24,.104).name='Бункер кофемолки';
  for(const x of [-.9,-.6,-.3,0,.3,.6]){
    box(counter,trim,x,.70,.23,.26,.31,.031).name='Фасад шкафа';
    box(counter,wood,x,.78,.204,.115,.029,.026).name='Ручка шкафа';
  }
  a.views=[view('Рабочая зона',equipment,[-.10,1.29,.54],2.65,[.38,.48,1],[roof]),
    view('Подвесы освещения',lights,[0,1.85,.67],2.35,[.40,-.2,1],[roof])];

  return a;
}
function pavilion() {
  const a=assembly(), wood=mat('wood'), steel=mat('gunmetal'), seat=mat('teal');
  floor(a,4.2,4.2).name='Основание';
  const posts=a.layer([0,0,0],undefined,'Деревянные стойки и обвязка');
  const furniture=a.layer([0,.21,.46],undefined,'Скамья');
  for(const x of [-1.68,1.68]) for(const z of [-1.68,1.68]){
    cylinder(posts,steel,x,.19,z,.19,.22);
    beam(posts,wood,[x,.20,z],[x,2.24,z],.16);
  }
  for(const z of [-1.73,1.73]) beam(posts,wood,[-1.76,2.19,z],[1.76,2.19,z],.15);
  for(const x of [-1.73,1.73]) beam(posts,wood,[x,2.19,-1.76],[x,2.19,1.76],.15);
  box(furniture,seat,0,.47,-1.27,2.68,.13,.40);
  for(const x of [-1.13,1.13]) box(furniture,steel,x,.25,-1.27,.16,.27,.32);
  const canopy=a.layer([0,1.31,0],undefined,'Рейки навеса');
  for(let i=0;i<14;i++){
    const x=-1.80+i*.277;
    beam(canopy,wood,[x,2.22,-1.88],[x,2.43,.29],.145,.095).name='Клеёная ламель';
    beam(canopy,wood,[x,2.43,.29],[x,2.29,1.88],.145,.095).name='Клеёная ламель';
  }
  a.shell={group:canopy,label:'Снять навес'};

  const brackets=a.layer([.36,.57,.47],undefined,'Кронштейны и анкеры',.19);
  const gutter=a.layer([0,.83,-.69],undefined,'Водосток',.15);
  const bronze=mat('gold');
  for(const x of [-1.68,1.68])for(const z of [-1.68,1.68]){
    box(brackets,steel,x,.125,z,.41,.06,.41).name='Монтажная плита';
    for(const dx of [-.145,.145])for(const dz of [-.145,.145])
      joint(brackets,bronze,x+dx,.146,z+dz,'y',.034,.15);
    box(brackets,steel,x,2.16,z+.115,.26,.22,.035).name='Угловая накладка';
    for(const dx of [-.081,.081])joint(brackets,steel,x+dx,2.15,z+.13,'z',.027,.13);
  }
  for(const z of [-1.91,-1.77]) beam(gutter,steel,[-1.95,2.25,z],[1.95,2.25,z],.046).name='Борт желоба';
  beam(gutter,steel,[-1.94,2.22,-1.84],[1.94,2.22,-1.84],.09,.048).name='Дно желоба';
  cylinder(gutter,steel,-1.68,1.19,-1.84,.042,2.08,'y',24).name='Водосточная труба';
  a.fasteners=[brackets];
  a.views=[view('Накладка обвязки',brackets,[1.68,2.14,1.80],1.72,[.6,.24,1]),
    view('Анкер стойки',brackets,[1.68,.13,1.68],1.45,[.51,.72,1])];

  return a;
}
function villa() {
  const a=assembly(), white=mat('ivory'), glass=mat('glass',{transparent:true,opacity:.52}), wood=mat('wood'), dark=mat('gunmetal');
  floor(a,5,4.6).name='Основание участка';
  const terrace=a.layer([0,0,.66],undefined,'Терраса и бассейн');
  box(terrace,mat('teal'),1.41,.16,1.04,1.43,.062,1.87);
  for(let i=0;i<8;i++)box(terrace,wood,-1.49+i*.31,.17,1.38,.29,.055,1.02);
  const ground=a.layer([0,0,0],undefined,'Первый этаж и мебель');
  box(ground,white,-.71,.65,-1.21,2.62,1.03,.13);
  box(ground,white,-1.93,.65,-.27,.14,1.03,1.90);

  for(let x=-1.9;x<.6;x+=.47)box(ground,dark,x,.64,.69,.045,1.04,.10);
  furniture(ground,wood,white,-1.11,-.48);
  const upper=a.layer([0,1.35,0],[.27,1.20,-.38],'Второй этаж',.08);
  box(upper,white,0,.04,0,3.54,.16,1.87);
  box(upper,white,0,.61,-.88,3.54,1.03,.12);

  for(let x=-1.75;x<1.77;x+=.44)box(upper,dark,x,.61,.90,.043,1.03,.10);
  const roof=a.layer([0,2.58,0],[.27,2.37,-.38],'Кровельный пирог');
  box(roof,white,0,0,0,3.64,.18,1.99);
  box(roof,wood,0,-.11,0,3.39,.065,1.83);

  const glazing=a.layer([0,.21,1.15],undefined,'Фасадное остекление',.16);
  const services=a.layer([.59,.42,.46],undefined,'Лестница и инженерные сети',.24);
  for(let i=0;i<6;i++) {
    box(glazing,glass,-1.77+i*.425,.65,.66,.402,.99,.032).name='Стеклопакет первого этажа';
    box(glazing,glass,-1.19+i*.583,1.81,.49,.562,.99,.034).name='Стеклопакет второго этажа';
  }
  for(let i=0;i<10;i++) box(services,wood,.61,.17+i*.110,.47-i*.135,.60,.061,.151).name='Ступень лестницы';
  beam(services,dark,[.94,.29,.48],[.94,1.28,-.77],.064).name='Косоур лестницы';
  for(const y of [.22,.33]) beam(services,mat('copper'),[-1.50,y,-.90],[.70,y,-.90],.036).name='Инженерный трубопровод';
  box(ground,wood,.05,.39,-.85,1.15,.50,.48).name='Кухонный шкаф';
  box(ground,dark,.05,.66,-.85,1.19,.058,.51).name='Столешница';
  box(upper,white,.94,.34,-.16,.98,.48,.61).name='Мягкий модуль';
  for(const x of [-1.22,-.61,0,.61,1.22]) box(roof,mat('gunmetal'),x,.107,0,.58,.03,1.73).name='Панель кровельной мембраны';
  a.shell={group:glazing,label:'Снять остекление',restoreLabel:'Вернуть остекление'};
  a.views=[view('Первый этаж',ground,[-.59,.60,-.2],4.12,[.4,.48,1],[glazing]),
    view('Лестница и трубы',services,[.65,.55,-.2],2.55,[.46,.4,1],[glazing])];

  return a;
}

function headphones() {
  const a=assembly(), finish=mat('blue'), steel=mat('steel'), pad=mat('black'), dark=mat('gunmetal');
  const headband=a.layer([0,.62,0],undefined,'Оголовье и накладка');
  torus(headband,finish,0,.50,0,1.15,.13,'z',PI).name='Дуга оголовья';
  torus(headband,pad,0,.49,0,1.02,.088,'z',PI).name='Мягкая накладка';
  const drivers=[];
  const shells=[];
  for(const sign of [-1,1]){
    beam(headband,steel,[sign*1.14,.54,0],[sign*1.27,-.11,0],.08);
    const side=sign<0?'Левый':'Правый';
    const cups=a.layer([sign*1.18,-.12,0],[sign*1.15,-.41,0],side+' корпус');
    shells.push(cups);
    cylinder(cups,finish,0,0,0,.47,.35,'x').name='Чашка';
    cylinder(cups,steel,sign*.18,0,0,.38,.08,'x');
    const cushions=a.layer([-sign*.59,-.54,0],[sign*.91,-.41,0],side+' амбушюр',.16);
    torus(cushions,pad,0,0,0,.33,.145,'x').name='Подушка амбушюра';
    cylinder(cushions,dark,sign*.11,0,0,.30,.045,'x').name='Акустическая сетка';
    const driver=a.layer([sign*.42,0,.48],[sign*1.10,-.41,0],side+' динамик',.22);
    drivers.push(driver);
    cylinder(driver,dark,0,0,0,.375,.097,'x').name='Корзина динамика';
    cylinder(driver,steel,sign*.086,0,0,.193,.09,'x').name='Магнит';
    cylinder(driver,mat('copper'),sign*.029,0,0,.104,.10,'x').name='Звуковая катушка';
    torus(driver,steel,-sign*.069,0,0,.324,.018,'x').name='Гибкий подвес';
    ball(driver,finish,-sign*.084,0,0,.055,.314,.314).name='Мембрана';
    for(let i=0;i<6;i++){
      const t=i*PI/3;
      joint(driver,steel,sign*.056,Math.cos(t)*.356,Math.sin(t)*.356,'x',.019,.12);
    }
  }
  a.finish=finish;

  a.views=[view('Мембрана и магнит',drivers[1],[0,0,0],1.72,[1,.37,.54],shells)];
  a.shells=[{groups:shells,label:'Снять чашки',restoreLabel:'Вернуть чашки'}];

  return a;
}
function camera() {
  const a=assembly(), dark=mat('black'), body=mat('gunmetal'), silver=mat('steel');
  const lens=mat('glass',{transparent:true,opacity:.56,depthWrite:false});
  const board=mat('green'), gold=mat('gold'), sensorMat=mat('teal',{metalness:.72});
  const chassis=a.layer([0,0,0],[0,0,0],'Магниевое шасси');
  const rear=a.layer([0,0,-1.55],[0,0,0],'Дисплей и задняя крышка',.08);
  const face=a.layer([.41,0,.49],undefined,'Лицевая панель',.13);
  const circuit=a.layer([0,.42,-.80],[0,0,0],'Матрица и плата',.22);
  const shutter=a.layer([0,.51,.54],[-.27,0,-.08],'Шторки и привод',.18);
  const barrel=a.layer([0,0,1.05],[-.27,0,.46],'Корпус объектива и кольцо');
  const optics=a.layer([0,0,1.88],[-.27,0,.47],'Линзы и направляющие',.16);
  const iris=a.layer([0,-.56,2.56],[-.27,0,.54],'Лепестки диафрагмы',.30);
  const filter=a.layer([0,.09,3.02],[-.27,0,.91],'Светофильтр и передний обод');
  const battery=a.layer([.98,-.53,-.24],[.82,-.17,-.22],'Аккумулятор и контакты',.27);
  const hardware=a.layer([-.46,.48,1.0],[-.27,0,.06],'Винты байонета',.35);
  for (const x of [-.97,.57]) box(chassis,body,x,0,-.29,.24,1.23,.65).name='Стойка шасси';
  for (const y of [-.61,.61]) box(chassis,body,-.17,y,-.29,1.85,.13,.66).name='Перемычка корпуса';
  box(chassis,dark,.82,-.04,.02,.43,1.17,.49).name='Рукоятка';
  box(chassis,silver,0,.68,-.31,2.05,.11,.73).name='Верхняя панель';
  cylinder(chassis,silver,.67,.78,-.28,.24,.12,'y',36).name='Диск режимов';
  cylinder(chassis,dark,-.72,.79,-.35,.15,.14).name='Кнопка спуска';
  annulus(chassis,silver,-.27,0,.095,.525,.425,.066).name='Байонет';
  const panel=new Shape();
  panel.moveTo(-1.10,-.66); panel.lineTo(1.10,-.66); panel.lineTo(1.10,.66);
  panel.lineTo(-1.10,.66); panel.closePath();
  const opening=new Path();
  opening.absarc(-.27,0,.43,0,2*PI,true);
  panel.holes.push(opening);
  mesh(face,new ExtrudeGeometry(panel,{depth:.052,curveSegments:24,bevelEnabled:false}),body,0,0,.014).name='Панель байонета';
  for(let i=0;i<8;i++){
    const angle=i*PI/4;
    joint(hardware,gold,Math.cos(angle)*.473,Math.sin(angle)*.473,.08,'z',.024,.092);
  }
  box(rear,body,0,0,-.67,2.19,1.33,.12).name='Задняя крышка';
  box(rear,dark,-.36,.08,-.754,1.40,.91,.043).name='Рамка дисплея';
  box(rear,mat('glass'),-.36,.08,-.781,1.23,.75,.019).name='ЖК-экран';
  for(const y of [-.38,-.18,.03,.25]) cylinder(rear,silver,.68,y,-.75,.047,.046,'z',16).name='Кнопка меню';
  box(circuit,board,-.03,0,-.47,1.69,1.02,.051).name='Основная плата';
  box(circuit,silver,-.27,0,-.36,.77,.57,.068).name='Рамка матрицы';
  box(circuit,sensorMat,-.27,0,-.313,.63,.43,.026).name='Светочувствительная матрица';
  box(circuit,dark,.44,.14,-.423,.23,.22,.039).name='Процессор';
  for(let i=0;i<12;i++){
    const y=-.43+i*.065;
    box(circuit,gold,.63,y,-.427,.16,.021,.028).name='Контакт платы';
    box(circuit,dark,-.77,y,-.430,.10,.024,.033).name='Компонент платы';
  }
  const curtains=[];
  for(let i=0;i<4;i++) {
    curtains.push(box(shutter,dark,0,(i-1.5)*.116,0,.69,.105,.017));
    curtains.at(-1).name='Ламель затвора';
  }
  cylinder(shutter,silver,.41,0,0,.047,.51,'y',16).name='Ось привода затвора';
  annulus(barrel,dark,0,0,0,.60,.49,.69).name='Тубус объектива';
  for(let i=0;i<40;i++){
    const angle=i*2*PI/40;
    const rib=box(barrel,body,Math.cos(angle)*.598,Math.sin(angle)*.598,0,.033,.040,.45);
    rib.rotation.z=angle;
    rib.name='Насечка кольца фокусировки';
  }
  torus(barrel,silver,0,0,.33,.53,.037).name='Посадочное кольцо';
  for(const [z,r] of [[-.25,.32],[-.075,.385],[.21,.445]]){
    annulus(optics,silver,0,0,z,r+.046,r-.022,.032).name='Оправа линзы';
    ball(optics,lens,0,0,z,r,r,.056).name='Оптическая линза';
  }
  for(let i=0;i<3;i++){
    const angle=i*2*PI/3;
    cylinder(optics,gold,.457*Math.cos(angle),.457*Math.sin(angle),0,.015,.57,'z',12).name='Направляющая линзоблока';
  }
  annulus(iris,dark,0,0,0,.474,.351,.032).name='Кольцо диафрагмы';
  const blades=[];
  for(let i=0;i<9;i++){
    const angle=i*2*PI/9, pivot=part(iris,.356*Math.cos(angle),.356*Math.sin(angle),i*.002);
    const outline=new Shape();
    outline.moveTo(0,-.04); outline.quadraticCurveTo(-.19,-.19,-.34,-.052);
    outline.quadraticCurveTo(-.20,.112,.015,.082); outline.closePath();
    mesh(pivot,new ExtrudeGeometry(outline,{depth:.006,bevelEnabled:false,curveSegments:9}),i%2?dark:body,0,0,0).name='Лепесток диафрагмы';
    cylinder(iris,silver,pivot.position.x,pivot.position.y,.027,.019,.014,'z',12).name='Ось лепестка';
    blades.push({pivot,angle});
  }
  annulus(filter,dark,0,0,0,.61,.47,.082).name='Резьбовая оправа';
  cylinder(filter,lens,0,0,.023,.466,.023,'z',56).name='Защитное стекло';
  box(battery,body,0,0,0,.31,.62,.34).name='Батарейный блок';
  for(const z of [-.105,0,.105]) box(battery,gold,.04,.32,z,.118,.021,.041).name='Контакт аккумулятора';
  a.adjust={label:'Открытие диафрагмы',initial:50,apply(v){
    for(const {pivot,angle} of blades) pivot.rotation.z=angle+.25+v*.012;
  }};
  a.motion=(dt,t)=>{
    const travel=.35*(.5+.5*Math.sin(t*2.8));
    curtains.forEach((blade,i)=>{blade.position.y=(i-1.5)*.116+travel;});
  };
  a.motionLabel='Показать ход шторок';
  a.finish=body;
  a.fasteners=[hardware];
  a.shell={group:rear,label:'Снять заднюю крышку'};
  a.views=[
    view('Линзы объектива',optics,[0,0,0],2.35,[1,.45,1.4]),
    view('Диафрагма',iris,[0,0,0],2.05,[.18,.16,1],[barrel,optics,filter]),
    view('Матрица и плата',circuit,[-.20,0,-.40],2.7,[.5,.26,-1],[rear]),
  ];
  a.shells=[
    {groups:[barrel,optics,filter],label:'Скрыть оптику',restoreLabel:'Вернуть оптику'},
    {groups:[face],label:'Снять лицевую панель',restoreLabel:'Вернуть лицевую панель'},
  ];
  return a;
}
function coffee() {
  const a=assembly(), body=mat('teal'), steel=mat('steel'), black=mat('black'), copper=mat('copper');
  const frame=a.layer([0,0,-.84],undefined,'Внешний корпус и панель');
  box(frame,body,0,1.34,-.61,1.75,2.60,.59);
  box(frame,body,0,2.36,.22,1.75,.55,1.36);
  box(frame,steel,0,2.43,.92,1.66,.31,.05);
  for(const x of [-.47,-.15,.17]) cylinder(frame,black,x,2.44,.97,.075,.11,'z');
  cylinder(frame,copper,.58,2.44,.98,.16,.11,'z');
  const base=a.layer([0,-.65,0],undefined,'Поддон и решётка');
  box(base,body,0,.16,.08,1.75,.31,1.68);
  box(base,steel,0,.33,.26,1.57,.07,1.21);
  for(let i=0;i<13;i++)box(base,black,-.70+i*.116,.374,.27,.039,.009,1.09).name='Планка поддона';
  const brew=a.layer([0,.32,1.19],undefined,'Группа заваривания и рожок');
  cylinder(brew,steel,0,1.98,.43,.43,.24).name='Корпус группы';
  beam(brew,black,[.31,1.90,.43],[.87,1.93,.91],.13);
  const cup=a.layer([0,-.12,.58],[0,.41,.51],'Чашка');
  cylinder(cup,mat('ivory'),0,.26,0,.28,.43,'y',36,.34);
  torus(cup,mat('ivory'),.30,.29,0,.15,.044,'z');
  cylinder(cup,mat('darkWood'),0,.49,0,.29,.035);
  a.finish=body;

  const internals=a.layer([.49,.12,.46],undefined,'Бойлер, насос и трубки',.15);
  const shower=a.layer([0,-.40,1.65],undefined,'Рассекатель и корзина фильтра',.24);
  const hardware=a.layer([0,.32,2.06],undefined,'Крепление группы',.32);
  cylinder(internals,copper,0,1.98,-.38,.365,.68,'x',36).name='Бойлер';
  for(const x of [-.36,.36]) torus(internals,steel,x,1.98,-.38,.347,.035,'x').name='Крышка бойлера';
  cylinder(internals,steel,.29,.82,-.43,.118,.34,'y',24).name='Насос';
  beam(internals,copper,[.29,1.0,-.43],[.34,1.79,-.43],.043).name='Трубка от насоса';
  beam(internals,copper,[.03,1.94,-.21],[.03,2.05,.43],.043).name='Трубка к группе';
  annulus(shower,steel,0,0,0,.30,.15,.039).name='Опорное кольцо';
  shower.children.at(-1).rotation.x=PI/2;
  shower.children.at(-1).position.set(0,1.82,.43);
  cylinder(shower,black,0,1.78,.43,.248,.029,'y',32).name='Уплотнитель группы';
  for(let i=0;i<12;i++){
    const t=i*PI/6;
    cylinder(shower,steel,.183*Math.cos(t),1.755,.43+.183*Math.sin(t),.022,.023,'y',10).name='Отверстие рассекателя';
  }
  for(const x of [-.31,.31])joint(hardware,steel,x,2.01,.43,'y',.037,.16);
  a.fasteners=[hardware];
  a.shell={group:frame,label:'Снять корпус',restoreLabel:'Вернуть корпус'};
  a.views=[view('Бойлер и насос',internals,[0,1.50,-.40],3.2,[1,.35,1],[frame]),
    view('Рассекатель группы',shower,[0,1.79,.43],1.49,[.5,-.4,1])];

  return a;
}
function lamp() {
  const a=assembly(), white=mat('ivory'), bronze=mat('gold'), body=mat('teal'), warm=glow(0xffda92);
  const base=a.layer([0,-.38,0],undefined,'Основание и утяжелитель');
  const arm=a.layer([0,0,0],undefined,'Рычаги и шарниры');
  cylinder(base,body,0,.115,0,.63,.23);
  cylinder(base,bronze,0,.25,0,.24,.11);
  const pivot=part(arm,0,.29,0);
  for(const z of [-.10,.10]){
    beam(pivot,bronze,[0,0,z],[-.53,.96,z],.051);
    beam(pivot,bronze,[-.53,.96,z],[.34,1.58,z],.051);
  }
  for(const [x,y] of [[0,0],[-.53,.96],[.34,1.58]])cylinder(pivot,body,x,y,0,.13,.33,'z');
  const shade=part(pivot,.44,1.59,0);
  shade.rotation.z=.55;
  const reflector=cylinder(shade,body,.16,-.12,0,.37,.40,'y',40,.17);
  reflector.name='Корпус плафона';
  torus(shade,white,.16,-.33,0,.34,.025,'y');
  ball(shade,warm,.16,-.30,0,.19,.09,.19);
  a.adjust={label:'Наклон плафона',initial:51,apply(v){shade.rotation.z=(v-30)*.026;}};
  a.finish=body;

  const led=a.layer([.68,.30,.64],undefined,'Светодиоды и драйвер',.20);
  const fix=a.layer([0,.19,.72],undefined,'Крепление основания',.28);
  cylinder(led,bronze,0,.218,0,.40,.061,'y',32).name='Плата драйвера';
  box(led,mat('black'),0,.265,0,.24,.073,.18).name='Блок питания';
  for(const x of [-.16,.16]) cylinder(led,white,x,.27,0,.041,.082,'y',12).name='Конденсатор';
  for(const z of [-.10,.10]){
    torus(pivot,body,-.53,.96,z,.079,.019).name='Пружина шарнира';
    beam(pivot,white,[-.13,.22,z],[-.58,.88,z],.025).name='Кабель в стойке';
  }
  for(let i=0;i<8;i++){
    const t=i*PI/4;
    cylinder(shade,warm,.16+.12*Math.cos(t),-.346,.12*Math.sin(t),.031,.016,'y',12).name='Светодиод';
  }
  for(let i=0;i<4;i++){
    const t=(i+.5)*PI/2;
    joint(fix,bronze,.48*Math.cos(t),.11,.48*Math.sin(t),'y',.033,.20);
  }
  a.fasteners=[fix];
  a.views=[view('Светодиоды в плафоне',shade,[.16,-.34,0],1.42,[.52,-.8,1]),
    view('Шарнир рычага',pivot,[-.53,.96,0],1.48,[.54,.3,1])];

  return a;
}

function drone() {
  const a=assembly(), skin=mat('ivory'), dark=mat('gunmetal'), trim=mat('orange'), rubber=mat('black');
  const frame=a.layer([0,0,0],undefined,'Шасси и лучи');
  const lid=a.layer([0,.98,0],undefined,'Верхний обтекатель');
  const gimbal=a.layer([0,-.46,1.05],undefined,'Камера и подвес');
  const rotors=a.layer([0,.72,0],undefined,'Винты и колокол двигателя',.12);
  const hardware=a.layer([.54,.47,-.36],undefined,'Крепёж моторов',.28);
  box(frame,skin,0,.67,0,.88,.21,1.17).name='Поддон корпуса';
  box(lid,skin,0,.84,0,.89,.13,1.16).name='Крышка электроники';
  box(lid,trim,0,.91,0,.59,.064,.84).name='Верхняя накладка';
  ball(gimbal,dark,0,.57,.60,.22,.15,.20);
  cylinder(gimbal,mat('glass'),0,.57,.76,.11,.075,'z');
  const props=[];
  for(const x of [-1.24,1.24])for(const z of [-1.08,1.08]){
    beam(frame,dark,[0,.71,0],[x,.70,z],.112);
    cylinder(frame,trim,x,.72,z,.18,.19).name='Мотор';
    beam(frame,rubber,[x,.63,z],[x*.95,.25,z*.94],.09);
    const prop=part(rotors,x,.89,z);
    cylinder(prop,skin,0,0,0,.10,.12);
    box(prop,dark,0,0,0,1.11,.035,.10);
    box(prop,dark,0,0,0,.09,.035,1.07);
    props.push(prop);
    for (const dx of [-.104,.104])for(const dz of [-.09,.09])
      joint(hardware,dark,x+dx,.752,z+dz,'y',.025,.15);
    for(let i=0;i<9;i++){
      const t=i*2*PI/9;
      cylinder(frame,mat('copper'),x+.116*Math.cos(t),.72,z+.116*Math.sin(t),.018,.112,'y',10).name='Обмотка мотора';
    }
  }
  a.motion=dt=>props.forEach((p,i)=>{p.rotation.y+=dt*(i%2?13:-13);});
  a.finish=skin;

  const electronics=a.layer([0,.44,-.49],undefined,'Контроллер и аккумулятор',.20);
  box(electronics,mat('green'),0,.738,-.05,.66,.043,.68).name='Плата полётного контроллера';
  box(electronics,dark,.095,.781,-.08,.19,.035,.18).name='Контроллер';
  box(electronics,trim,-.23,.779,-.15,.17,.063,.42).name='Аккумулятор';
  for(let i=0;i<8;i++)box(electronics,mat('gold'),.28,.773,-.32+i*.086,.066,.023,.035).name='Контакт платы';
  for(const x of [-.19,.19]) cylinder(gimbal,trim,x,.57,.59,.068,.11,'x',18).name='Ось подвеса';
  a.shell={group:lid,label:'Открыть корпус',restoreLabel:'Закрыть корпус'};
  a.fasteners=[hardware];
  a.views=[view('Контроллер и батарея',electronics,[0,.77,-.09],1.86,[.45,.90,1],[lid]),
    view('Подвес камеры',gimbal,[0,.57,.68],1.48,[.68,.30,1])];

  return a;
}
function satellite() {
  const a=assembly(), steel=mat('steel'), bronze=mat('gold'), blue=mat('blue'), dark=mat('gunmetal');
  const bus=a.layer([0,-.26,0],undefined,'Несущий корпус');
  const skin=a.layer([0,0,1.13],undefined,'Теплозащита и панель доступа');
  const antenna=a.layer([0,.89,0],undefined,'Антенна и облучатель');
  const power=a.layer([0,.35,.48],undefined,'Питание и маховики',.19);
  const panels=a.layer([0,0,-.70],undefined,'Солнечные крылья и шарниры');
  box(bus,bronze,0,-.50,0,1.06,.10,.95).name='Нижняя плита';
  box(bus,bronze,0,.50,0,1.06,.10,.95).name='Верхняя плита';
  box(skin,bronze,0,0,.48,1.05,1.00,.055).name='Передняя панель теплозащиты';
  for(const x of [-.54,.54])box(bus,steel,x,0,0,.09,1.21,1.02);
  cylinder(antenna,steel,0,.77,0,.26,.49);
  const dish=cylinder(antenna,steel,0,1.04,0,.20,.23,'y',48,.59);
  dish.rotation.z=-.24;
  beam(antenna,dark,[0,1.14,0],[.18,1.58,0],.05);
  ball(antenna,bronze,.18,1.58,0,.075);
  const wings=[];
  for(const side of [-1,1]){
    const pivot=part(panels,side*.57,0,0);
    beam(pivot,steel,[0,0,0],[side*.39,0,0],.082);
    for(let x=0;x<5;x++)for(let z=0;z<3;z++)
      box(pivot,blue,side*(.51+x*.26),0,(z-1)*.26,.244,.050,.241).name='Фотоэлектрическая ячейка';
    box(pivot,steel,side*1.02,-.038,0,1.33,.037,.80);
    wings.push(pivot);
    cylinder(panels,bronze,side*.565,0,0,.091,.57,'z',20).name='Шарнир крыла';
  }
  a.adjust={label:'Раскрытие панелей',initial:100,apply(v){wings.forEach((p,i)=>{p.rotation.z=(i?1:-1)*(1-v/100)*1.47;});}};

  box(power,dark,0,-.07,0,.86,.09,.74).name='Монтажная полка';
  box(power,mat('green'),0,.23,0,.78,.057,.70).name='Бортовая плата';
  for(const x of [-.24,.24]) {
    cylinder(power,steel,x,.08,0,.161,.24,'y',28).name='Маховик ориентации';
    for(const z of [-.22,.22])box(power,dark,x,-.25,z,.29,.25,.24).name='Ячейка аккумулятора';
  }
  for(let i=0;i<9;i++)box(power,bronze,-.32+i*.079,.28,.295,.045,.036,.059).name='Разъём питания';
  a.shell={group:skin,label:'Снять панель доступа',restoreLabel:'Вернуть панель доступа'};
  a.views=[view('Маховики и питание',power,[0,.02,0],2.02,[.43,.38,1],[skin]),
    view('Шарнир солнечного крыла',panels,[.57,0,0],1.43,[.65,.64,1])];

  return a;
}
function rover() {
  const a=assembly(), gold=mat('gold'), dark=mat('gunmetal'), steel=mat('steel'), tread=mat('black');
  const chassis=a.layer([0,0,0],undefined,'Шасси и подвеска');
  const deck=a.layer([0,.94,0],undefined,'Приборная палуба');
  const mast=a.layer([0,1.39,.22],undefined,'Мачта и стереокамеры',.20);
  const electronics=a.layer([0,.40,.61],undefined,'Приборы и аккумуляторы',.18);
  box(chassis,gold,0,.71,0,2.18,.08,1.21).name='Днище';
  for (const side of [-1,1]) box(chassis,gold,0,.91,side*.57,2.15,.39,.055).name='Борт отсека';
  box(deck,steel,0,1.15,0,1.82,.10,1.13).name='Верхняя палуба';
  box(deck,dark,-.66,1.25,.05,.83,.14,.78);
  beam(mast,steel,[.52,1.13,.14],[.52,1.91,.14],.078);
  box(mast,steel,.56,1.97,.14,.39,.22,.27);
  ball(mast,glow(0x8bcde8),.65,1.96,.285,.063);
  const wheels=[];
  for(const side of [-1,1])for(const x of [-1.02,0,1.02]){
    const z=side*.91;
    beam(chassis,steel,[x*.82,.85,side*.52],[x,.40,z],.070).name='Рычаг подвески';
    const wheelLayer=a.layer([0,-.09,side*(.74+.14*Math.abs(x))],[x,.38,z],`Колесо ${x<-.5?'переднее':x>.5?'заднее':'среднее'} ${side>0?'правое':'левое'}`,.12);
    const wheel=part(wheelLayer);
    cylinder(wheel,tread,0,0,0,.34,.29,'z').name='Шина';
    cylinder(wheel,steel,0,0,side*.154,.21,.065,'z',12);
    for(let i=0;i<14;i++){
      const angle=i*PI/7;
      const lug=box(wheel,dark,Math.cos(angle)*.335,Math.sin(angle)*.335,0,.075,.10,.315);
      lug.rotation.z=angle; lug.name='Грунтозацеп';
    }
    wheels.push(wheel);
    cylinder(chassis,dark,x,.38,side*.69,.117,.22,'z',22).name='Ось колеса';
    for(let i=0;i<6;i++){
      const t=i*PI/3;
      joint(wheel,mat('gold'),.122*Math.cos(t),.122*Math.sin(t),side*.191,'z',.021,.097);
    }
  }
  a.motion=dt=>wheels.forEach(p=>{p.rotation.z+=dt*1.75;});

  box(electronics,mat('green'),0,.82,0,1.53,.043,.78).name='Монтажная плата';
  for(let i=0;i<4;i++)box(electronics,dark,-.57+i*.34,.95,-.19,.28,.20,.34).name='Аккумуляторный модуль';
  box(electronics,steel,.39,.91,.24,.40,.18,.24).name='Радиомодуль';
  ball(mast,glow(0x8bcde8),.48,1.96,.285,.063).name='Камера стереопары';
  a.shell={group:deck,label:'Снять палубу',restoreLabel:'Вернуть палубу'};
  a.views=[view('Ступица колеса',wheels[3],[0,0,.17],1.39,[.6,.28,1]),
    view('Бортовые приборы',electronics,[0,.88,0],2.42,[.42,.8,1],[deck])];

  return a;
}
function telescope() {
  const a=assembly(), steel=mat('steel'), body=mat('blue'), dark=mat('black'), brass=mat('gold');
  const tripod=a.layer([0,-.48,0],undefined,'Ноги штатива и упоры');
  const support=a.layer([0,0,0],undefined,'Монтировка');
  for(let i=0;i<3;i++){
    const angle=i*2*PI/3;
    const x=Math.cos(angle),z=Math.sin(angle);
    beam(tripod,steel,[x*.09,1.02,z*.09],[x*.93,.07,z*.93],.09);
    beam(tripod,dark,[x*.07,.70,z*.07],[x*.47,.53,z*.47],.052);
    box(tripod,dark,x*.93,.045,z*.93,.18,.09,.17);
  }
  cylinder(support,brass,0,1.07,0,.24,.18);
  const mount=part(support,0,1.28,0);
  const tubeLayer=a.layer([0,.78,0],undefined,'Оптическая труба');
  const front=a.layer([-1.04,1.0,0],undefined,'Объектив и бленда',.13);
  const eyepiece=a.layer([1.04,.51,.22],undefined,'Окуляр и фокусёр',.22);
  annulus(tubeLayer,body,0,1.28,0,.29,.248,2.08).rotation.y=PI/2;
  tubeLayer.children.at(-1).name='Труба';
  cylinder(front,dark,-1.02,1.28,0,.34,.23,'x').name='Бленда';
  torus(front,steel,-1.16,1.28,0,.275,.055,'x').name='Кольцо объектива';
  cylinder(front,mat('glass'),-1.14,1.28,0,.23,.035,'x').name='Передняя линза';
  cylinder(eyepiece,brass,1.10,1.28,0,.17,.24,'x').name='Фокусёр';
  cylinder(eyepiece,dark,1.31,1.28,0,.125,.29,'x').name='Наглазник';
  cylinder(tubeLayer,steel,-.32,1.59,0,.076,.49,'x').name='Искатель';

  a.finish=body;

  const adjustGroups=[tubeLayer,front,eyepiece];
  const inner=a.layer([0,.40,-.46],undefined,'Диафрагмы и линзы',.25);
  adjustGroups.push(inner);
  for(const x of [-.59,-.17,.24,.66]){
    const baffle=annulus(inner,dark,x,1.28,0,.247,.157,.025);
    baffle.rotation.y=PI/2; baffle.name='Светозащитная диафрагма';
  }
  for(const x of [-.91,-.80,1.19]){
    ball(inner,mat('glass'),x,1.28,0,.038,x>1?.105:.213,x>1?.105:.213).name='Линза';
  }
  cylinder(mount,brass,0,0,0,.126,.31,'z',20).name='Ось наклона';
  const pivot=new Vector3(0,1.28,0), vertical=new Vector3(0,0,1);
  const placements=adjustGroups.map(layer=>layer.children.map(mesh=>[mesh,mesh.position.clone(),mesh.quaternion.clone()]));
  a.adjust={label:'Угол наведения',initial:25,apply(v){
    const q=new Quaternion().setFromAxisAngle(vertical,(v-25)*PI/177);
    for(const group of placements)for(const [mesh,origin,orientation] of group){
      mesh.position.copy(origin).sub(pivot).applyQuaternion(q).add(pivot);
      mesh.quaternion.copy(q).multiply(orientation);
    }
  }};
  a.shell={group:tubeLayer,label:'Снять оптическую трубу',restoreLabel:'Вернуть оптическую трубу'};
  a.views=[view('Линзы и диафрагмы',inner,[-.18,1.28,0],2.6,[.50,.44,1],[tubeLayer]),
    view('Крепление трубы',support,[0,1.22,.14],1.5,[.63,.35,1])];

  return a;
}
function charger() {
  const a=assembly(), white=mat('ivory'), dark=mat('gunmetal'), teal=mat('teal'), black=mat('black');
  const back=a.layer([0,0,-.63],undefined,'Стойка и задний корпус');
  const core=a.layer([0,0,0],undefined,'Силовые модули и шины');
  const cableGroup=a.layer([.61,.12,.47],undefined,'Кабель и разъём',.14);
  box(back,dark,0,.12,0,1.22,.24,1.03).name='Опорная плита';
  box(back,white,0,1.45,-.26,1.12,2.57,.30);
  box(core,dark,0,1.45,.02,.95,2.46,.20);
  for(let j=0;j<6;j++)box(core,teal,0,.63+j*.18,.17,.77,.135,.17).name='Силовой модуль';
  for(const z of [-.13,.12]){
    beam(core,mat('copper'),[-.33,1.72,z],[.34,2.08,z],.042);
  }
  const shell=a.layer([0,0,1.34],undefined,'Панель и экран');
  box(shell,white,0,1.45,.30,1.08,2.51,.19);
  box(shell,black,0,1.96,.41,.69,.55,.045);
  box(shell,glow(0x7be8d5),0,2.00,.438,.43,.30,.012);
  box(shell,dark,0,1.48,.43,.25,.063,.043);
  const cable=torus(cableGroup,black,.73,1.1,.12,.51,.035,'z',PI*1.57);
  cable.scale.set(.62,1.38,1);
  box(cableGroup,dark,.82,1.74,.17,.24,.28,.17);
  a.shell={group:shell,label:'Снять панель'};
  a.finish=white;

  const cooling=a.layer([-.55,0,.59],undefined,'Охлаждение и клеммы',.25);
  const fixing=a.layer([0,0,1.97],undefined,'Монтажные винты',.31);
  for(const y of [.57,.97,1.37]){
    annulus(cooling,dark,-.18,y,.27,.158,.129,.055).name='Кольцо вентилятора';
    for(let i=0;i<6;i++){
      const t=i*PI/3;
      beam(cooling,teal,[-.18,y,.30],[-.18+.121*Math.cos(t),y+.121*Math.sin(t),.30],.027).name='Лопасть вентилятора';
    }
  }
  for(const x of [-.35,0,.35]){
    box(core,dark,x,2.06,.22,.20,.23,.12).name='Контактор';
    cylinder(core,mat('copper'),x,2.19,.26,.046,.082,'y',16).name='Клеммная шпилька';
  }
  for(const x of [-.44,.44])for(const y of [.34,2.56]) joint(fixing,dark,x,y,.42,'z',.025,.16);
  for(const y of [1.69,1.76,1.83])cylinder(cableGroup,mat('gold'),.82,y,.267,.019,.062,'z',12).name='Контакт разъёма';
  a.fasteners=[fixing];
  a.views=[view('Силовые клеммы',core,[0,2.10,.26],1.74,[.4,.26,1],[shell]),
    view('Вентиляторы',cooling,[-.18,.98,.28],2.20,[.43,.2,1],[shell])];

  return a;
}

function joint(g, m, x, y, z, axis = 'y', radius = .07, length = .26) {
  const bolt = part(g,x,y,z);
  if (axis === 'z') bolt.rotation.x = PI/2;
  if (axis === 'x') bolt.rotation.z = -PI/2;
  cylinder(bolt,m,0,0,0,radius*.56,length,'y',12).name = 'Стержень болта';
  cylinder(bolt,m,0,length/2,0,radius*1.25,.023,'y',20).name = 'Шайба';
  cylinder(bolt,m,0,length/2+.042,0,radius,.067,'y',6).name = 'Головка болта';
  cylinder(bolt,m,0,-length/2,0,radius,.068,'y',6).name = 'Гайка';
  return bolt;
}

function glassPanel(g,m,x,y,z,width,height,depth) {
  const panel = box(g,m,x,y,z,width,height,depth);
  panel.name = 'Панель остекления';
  return panel;
}

function staircase() {
  const a=assembly(), zinc=mat('steel'), dark=mat('gunmetal'), brass=mat('gold');
  const frame=a.layer([0,-.35,-.6]), treads=a.layer([0,.9,0]);
  const rails=a.layer([0,.48,.78]), fix=a.layer([.24,.54,1.10]);
  frame.name='Косоуры и опоры'; treads.name='Решётчатые ступени';
  rails.name='Перила и стойки'; fix.name='Болтовые соединения';
  const step=.34, rise=.223, n=14;
  for (const z of [-.71,.71]) {
    beam(frame,dark,[-2.75,.12,z],[2.20,3.34,z],.24,.18).name='Косоур';
    beam(frame,dark,[2.15,3.25,z],[3.30,3.25,z],.21,.16).name='Балка площадки';
    for (const x of [-2.6,2.4,3.24]) {
      if (x>0) box(frame,dark,x,1.59,z,.14,3.18,.14).name='Опорная стойка';
      box(frame,zinc,x,.048,z,.34,.096,.32).name='Опорная плита';
      for (const dx of [-.11,.11]) for (const dz of [-.105,.105]) joint(fix,brass,x+dx,.065,z+dz,'y',.043,.12);
    }
    for (let i=0;i<n;i+=3) {
      const x=-2.55+i*step, y=.22+i*rise;
      box(rails,zinc,x,y+.52,z,.066,1.04,.066).name='Стойка поручня';
    }
    for (const height of [.43,.77,1.04]) {
      beam(rails,zinc,[-2.55,.22+height,z],[1.87,.22+13*rise+height,z],.052).name='Линия перил';
      beam(rails,zinc,[1.87,.22+13*rise+height,z],[3.28,.22+13*rise+height,z],.052).name='Перила площадки';
    }
    box(rails,zinc,3.28,.74+13*rise,z,.065,1.04,.065).name='Стойка площадки';
  }
  for (let i=0;i<=n;i++) {
    const landing=i===n;
    const x=landing?2.67:-2.55+i*step, y=landing?.22+13*rise:.22+i*rise;
    const depth=landing?1.20:.32, stepGroup=part(treads,x,y,0);
    for (const end of [-1,1]) {
      box(stepGroup,dark,end*(depth/2-.022),0,0,.044,.075,1.51).name='Торец решётки';
      box(stepGroup,dark,0,0,end*.737,depth,.075,.044).name='Боковина решётки';
      joint(fix,brass,x,y-.035,end*.77,'z',.047,.17);
    }
    const bars=landing?22:6;
    for (let j=0;j<bars;j++)
      box(stepGroup,zinc,-depth/2+(j+1)*depth/(bars+1),0,0,.024,.055,1.43).name='Несущая полоса настила';
    for (const z of [-.45,0,.45])
      box(stepGroup,zinc,0,.017,z,depth-.085,.027,.018).name='Поперечная полоса настила';
  }
  a.fasteners=[fix];
  a.shell={group:rails,label:'Скрыть перила',restoreLabel:'Показать перила'};
  a.views=[
    {label:'Ступень и косоур',target:new Vector3(-.85,1.33,.7),group:treads,distance:2.45},
    {label:'Анкерная опора',target:new Vector3(2.43,.12,.72),group:fix,distance:1.48},
  ];
  return a;
}

function glassRail() {
  const a=assembly(), steel=mat('steel'), dark=mat('gunmetal'), bronze=mat('gold');
  const glass=mat('glass',{transparent:true,opacity:.36,depthWrite:false,side:DoubleSide});
  const edge=mat('teal',{transparent:true,opacity:.73,depthWrite:false});
  const base=a.layer([0,-.34,0]), uprights=a.layer([0,0,-.28]);
  const glazing=a.layer([0,.42,.94]), fixing=a.layer([0,.28,1.55]);
  base.name='Основание'; uprights.name='Стойки и поручень';
  glazing.name='Стеклянные секции'; fixing.name='Анкеры и держатели';
  box(base,mat('concrete'),0,-.19,0,5.05,.38,1.15).name='Основание ограждения';
  for (const x of [-2.30,-.77,.77,2.30]) {
    box(uprights,steel,x,.57,0,.078,1.10,.078).name='Стойка';
    box(uprights,dark,x,.044,0,.24,.088,.29).name='Фланец стойки';
    for (const dx of [-.082,.082]) for (const z of [-.098,.098])
      joint(fixing,bronze,x+dx,.075,z,'y',.034,.19);
  }
  box(uprights,steel,0,1.13,0,4.86,.068,.10).name='Поручень';
  for (const x of [-1.535,0,1.535]) {
    glassPanel(glazing,glass,x,.59,0,1.32,.89,.033);
    for (const side of [-1,1]) {
      box(glazing,edge,x+side*.656,.59,0,.008,.89,.036).name='Торец стекла';
      for (const y of [.30,.85]) {
        const clampX=x+side*.69;
        box(fixing,dark,clampX,y,0,.125,.13,.094).name='Зажим стекла';
        box(fixing,steel,clampX-side*.035,y,.058,.105,.13,.031).name='Прижимная пластина';
        joint(fixing,bronze,clampX+side*.018,y,.072,'z',.029,.13);
      }
    }
  }
  a.fasteners=[fixing];
  a.shell={group:glazing,label:'Скрыть стекло',restoreLabel:'Показать стекло'};
  a.views=[
    {label:'Зажим стекла',target:new Vector3(.69,.85,.045),group:fixing,distance:.85},
    {label:'Анкер и фланец',target:new Vector3(.77,.08,0),group:fixing,distance:1.02},
  ];
  return a;
}

function steelCanopy() {
  const a=assembly(), steel=mat('steel'), dark=mat('gunmetal'), bronze=mat('gold');
  const translucent=mat('blue',{transparent:true,opacity:.53,depthWrite:false,side:DoubleSide});
  const legs=a.layer([0,-.26,0]), trusses=a.layer([0,.64,0]);
  const roof=a.layer([0,1.30,-.2]), hardware=a.layer([0,.72,1.25]);
  legs.name='Стойки и основания'; trusses.name='Фермы и прогоны';
  roof.name='Кровельные панели'; hardware.name='Пластины и болты';
  const roofY=z=>2.66+.21*(z+1.30);
  for (const x of [-2.55,0,2.55]) {
    for (const z of [-1.24,1.24]) {
      box(legs,dark,x,(roofY(z)-.19)/2,z,.20,roofY(z)-.19,.20).name='Колонна';
      box(legs,steel,x,.06,z,.44,.12,.40).name='Опорная плита';
      for (const dx of [-.14,.14]) for (const dz of [-.13,.13])
        joint(hardware,bronze,x+dx,.10,z+dz,'y',.052,.21);
      box(hardware,steel,x,roofY(z)-.19,z,.32,.31,.12).name='Соединительная пластина';
      for (const dx of [-.09,.09]) for (const dy of [-.08,.08])
        joint(hardware,bronze,x+dx,roofY(z)-.19+dy,z+.09,'z',.04,.20);
    }
    for (const dy of [0,-.42])
      beam(trusses,steel,[x,roofY(-1.67)+dy,-1.67],[x,roofY(1.67)+dy,1.67],.122).name='Пояс фермы';
    for (let i=0;i<8;i++) {
      const start=-1.62+i*.40, end=start+.40;
      beam(trusses,steel,[x,roofY(start)+(i%2?-.42:0),start],
        [x,roofY(end)+(i%2?0:-.42),end],.065).name='Диагональ фермы';
    }
  }
  for (const z of [-1.55,-.76,0,.76,1.55])
    beam(trusses,dark,[-2.92,roofY(z)+.07,z],[2.92,roofY(z)+.07,z],.12).name='Кровельный прогон';
  const cladding=part(roof,0,roofY(0)+.17,0);
  cladding.rotation.x=-Math.atan(.21);
  for (let i=0;i<8;i++) {
    const x=-2.60+i*.743;
    box(cladding,translucent,x,0,0,.72,.051,3.56).name='Лист кровли';
    box(cladding,steel,x+.37,0,0,.024,.057,3.58).name='Стыковой профиль';
  }
  a.fasteners=[hardware];
  a.shell={group:roof,label:'Скрыть кровлю',restoreLabel:'Показать кровлю'};
  a.views=[
    {label:'Узел фермы',target:new Vector3(0,roofY(1.24)-.2,1.29),group:hardware,distance:1.9},
    {label:'Каркас снизу',target:new Vector3(0,2.45,0),distance:5.6,eye:[.9,-.37,1]},
  ];
  return a;
}

function butterflyValve() {
  const a=assembly(), blue=mat('blue'), steel=mat('steel'), dark=mat('gunmetal'), brass=mat('gold');
  const body=a.layer([0,0,-.92]), seat=a.layer([0,0,0]), cover=a.layer([0,0,1.20]);
  const fixing=a.layer([0,0,1.95]), actuator=a.layer([0,1.04,0]);
  body.name='Корпус и задний фланец'; seat.name='Диск, вал и уплотнение';
  cover.name='Передний фланец'; fixing.name='Комплект крепежа'; actuator.name='Редуктор и маховик';
  annulus(body,blue,0,0,-.35,1.42,1.12,.67).name='Корпус затвора';
  annulus(body,steel,0,0,-.68,1.65,1.12,.24).name='Задний фланец';
  annulus(cover,blue,0,0,.44,1.65,1.12,.26).name='Передний фланец';
  annulus(seat,dark,0,0,.08,1.154,1.042,.25).name='Сменное уплотнение';
  const disc=part(seat,0,0,.085);
  cylinder(disc,steel,0,0,0,1.039,.14,'z',64).name='Поворотный диск';
  cylinder(disc,brass,0,.10,0,.105,2.50,'y',24).name='Вал';
  box(disc,steel,0,0,.077,.26,1.97,.12).name='Ребро диска';
  for (const y of [-.56,.56]) joint(disc,dark,0,y,.075,'z',.069,.19);
  for (let i=0;i<12;i++) {
    const angle=2*PI*i/12;
    joint(fixing,brass,1.49*Math.cos(angle),1.49*Math.sin(angle),.14,'z',.079,1.44);
  }
  cylinder(actuator,dark,0,1.47,.075,.28,.39).name='Втулка вала';
  box(actuator,blue,0,1.87,.10,.73,.43,.71).name='Корпус редуктора';
  for (const x of [-.28,.28]) for (const z of [-.15,.35])
    joint(actuator,steel,x,2.10,z,'y',.043,.20);
  cylinder(actuator,steel,0,2.03,.10,.069,.96,'z').name='Шпиндель маховика';
  const wheel=part(actuator,0,2.03,.61);
  torus(wheel,dark,0,0,0,.48,.05).name='Маховик';
  for (let i=0;i<5;i++) {
    const angle=i*2*PI/5;
    beam(wheel,steel,[0,0,0],[.46*Math.cos(angle),.46*Math.sin(angle),0],.062).name='Спица';
  }
  cylinder(wheel,brass,0,0,0,.13,.18,'z').name='Ступица маховика';
  a.adjust={label:'Открытие затвора',initial:38,apply(value) {
    disc.rotation.y=PI*value/200;
    wheel.rotation.z=PI*value/18;
  }};
  a.fasteners=[fixing];
  a.shell={group:cover,label:'Скрыть передний фланец',restoreLabel:'Показать передний фланец'};
  a.views=[
    {label:'Диск и уплотнение',target:new Vector3(0,0,.16),distance:3.75,eye:[.5,.27,1]},
    {label:'Редуктор',target:new Vector3(0,1.93,.31),group:actuator,distance:2.55},
  ];
  return a;
}

function drilledPlate(group, material, name, length, width, thickness, holes, x, y, z) {
  const shape=new Shape();
  shape.moveTo(-length/2,-width/2); shape.lineTo(length/2,-width/2);
  shape.lineTo(length/2,width/2); shape.lineTo(-length/2,width/2); shape.closePath();
  for(const [cx,cz,r] of holes){
    const hole=new Path(); hole.absarc(cx,cz,r,0,PI*2,true); shape.holes.push(hole);
  }
  const geom=new ExtrudeGeometry(shape,{depth:thickness,curveSegments:14,bevelEnabled:false});
  geom.translate(0,0,-thickness/2);
  const plate=mesh(group,geom,material,x,y,z);
  plate.rotation.x=-PI/2; plate.name=name;
  return plate;
}

function installLayer(a, group, vector, start=0) {
  a.root.add(group);
  a.sections.push({group,origin:group.position.clone(),offset:new Vector3(...vector),start});
}

function upholstered(g,m,name,x,y,z,w,h,d,r=.038) {
  const shape=new Shape(), lx=w/2, ly=h/2;
  r=Math.min(r,lx*.64,ly*.64);
  shape.moveTo(-lx+r,-ly); shape.lineTo(lx-r,-ly);
  shape.quadraticCurveTo(lx,-ly,lx,-ly+r); shape.lineTo(lx,ly-r);
  shape.quadraticCurveTo(lx,ly,lx-r,ly); shape.lineTo(-lx+r,ly);
  shape.quadraticCurveTo(-lx,ly,-lx,ly-r); shape.lineTo(-lx,-ly+r);
  shape.quadraticCurveTo(-lx,-ly,-lx+r,-ly); shape.closePath();
  const bevel=Math.min(.012,d*.24);
  const geometry=new ExtrudeGeometry(shape,{depth:d-2*bevel,bevelEnabled:true,
    bevelSize:bevel,bevelThickness:bevel,bevelSegments:3,curveSegments:6});
  geometry.translate(0,0,-d/2+bevel);
  const cushion=mesh(g,geometry,m,x,y,z);
  cushion.name=name;
  return cushion;
}

function carAssembly() {
  const a=assembly();
  const {bodywork,hood,roof,wheels,paint}=createCar(true);
  const steel=mat('steel'), dark=mat('gunmetal'), rubber=mat('black'), copper=mat('copper'), brass=mat('gold');
  const leather=mat('black',{color:0x6d4b3e,roughness:.62}), seam=mat('ivory',{color:0xc09776}), lights=glow(0xaee6f5);
  installLayer(a,bodywork,[.40,.36,-.86],.14);
  installLayer(a,hood,[-.73,1.19,0]);
  installLayer(a,roof,[0,1.63,0]);
  bodywork.children[0].name='Задняя панель кузова';
  hood.children[0].name='Наружная панель капота';
  roof.children[0].name='Ветровое и боковое остекление';
  roof.children[1].name='Панель крыши';

  const chassis=a.layer([0,-.42,0],undefined,'Шасси и рулевое управление',.20);
  const interior=a.layer([.82,.70,.40],undefined,'Салон, приборы и сиденья',.22);
  const transmission=a.layer([.16,-.63,-.57],undefined,'Трансмиссия и выхлоп',.24);
  const brakes=a.layer([0,-.30,.43],undefined,'Подвеска и тормозные механизмы',.27);
  const cooling=a.layer([-1.02,.43,.49],undefined,'Радиатор, вентилятор и впуск',.27);
  const engineOffset=[-1.22,.77,0], enginePosition=[-1.37,.37,0];
  const block=a.layer(engineOffset,enginePosition,'Блок и гильзы цилиндров',.15);
  const head=a.layer(engineOffset,enginePosition,'Головка, клапаны и распредвалы',.15);
  const moving=a.layer(engineOffset,enginePosition,'Поршни, шатуны и коленвал',.15);
  const sump=a.layer(engineOffset,enginePosition,'Масляный поддон и насос',.15);
  const engineHardware=a.layer(engineOffset,enginePosition,'Болты двигателя и прокладка',.15);
  const engineAssembly=[[head,[0,.88,0]],[block,[0,.37,-.37]],[moving,[0,.13,.39]],
    [sump,[0,-.25,0]],[engineHardware,[.25,.67,.62]]];
  const innerGroups=engineAssembly.map(([group,direction])=>[part(group),new Vector3(...direction)]);
  const [headParts,blockParts,movingParts,sumpParts,engineFix]=innerGroups.map(([group])=>group);

  box(chassis,dark,0,.365,0,3.92,.10,1.42).name='Панель пола';
  for(const z of [-.62,.62]){
    beam(chassis,steel,[-1.96,.37,z],[1.92,.37,z],.101).name='Продольный лонжерон';
    beam(chassis,dark,[-1.13,.49,z],[1.0,.49,z],.104).name='Порог';
  }
  for(const x of [-1.55,-.91,.95,1.57]) beam(chassis,steel,[x,.35,-.66],[x,.35,.66],.087).name='Поперечина шасси';
  cylinder(chassis,steel,-1.37,.393,0,.044,1.47,'z',18).name='Рулевая рейка';
  cylinder(chassis,copper,-1.37,.393,.46,.061,.39,'z',20).name='Корпус рейки';
  for(const z of [-.68,.68]) ball(chassis,dark,-1.37,.393,z,.080,.052,.048).name='Рулевой наконечник';

  box(interior,rubber,.08,.492,0,1.66,.042,1.31).name='Ковёр салона';
  box(interior,dark,-.78,.772,0,.27,.24,1.32).name='Панель приборов';
  upholstered(interior,leather,'Кожаная облицовка панели',-.69,.884,0,.34,1.28,.061,.07).rotation.x=-PI/2;
  box(interior,dark,-.07,.585,0,.94,.18,.23).name='Центральный тоннель';
  upholstered(interior,leather,'Подлокотник',.49,.74,0,.29,.23,.081).rotation.x=-PI/2;
  for(const z of [-.315,.315]){
    const seat=part(interior,.03,.535,z);
    for(const side of [-1,1]){
      box(seat,steel,.01,.017,side*.182,.52,.040,.037).name='Направляющая кресла';
      const bolster=upholstered(seat,leather,'Боковой валик',.022,.131,side*.176,.43,.099,.072,.038);
      bolster.rotation.z=.08;
      beam(seat,seam,[-.17,.166,side*.153],[.205,.169,side*.153],.006).name='Контрастная строчка';
    }
    upholstered(seat,leather,'Подушка сиденья',.025,.092,0,.493,.382,.093,.071).rotation.x=-PI/2;
    const back=upholstered(seat,leather,'Спинка кресла',.244,.306,0,.391,.416,.102,.083);
    back.rotation.set(0,PI/2,-.16);
    for(const side of [-1,1]){
      upholstered(seat,leather,'Плечевой валик',.208,.326,side*.166,.071,.325,.078).rotation.z=-.16;
      beam(seat,seam,[.164,.165,side*.144],[.219,.467,side*.144],.006).name='Шов спинки';
      cylinder(seat,steel,.275,.507,side*.065,.010,.091,'y',10).name='Стойка подголовника';
    }
    upholstered(seat,leather,'Подголовник',.28,.56,0,.24,.125,.107,.045).rotation.y=PI/2;
    upholstered(interior,leather,'Заднее сиденье',.63,.56,z,.36,.39,.12,.054).rotation.x=-PI/2;
    upholstered(interior,leather,'Спинка заднего сиденья',.86,.71,z,.40,.30,.098,.055).rotation.y=PI/2;
    beam(interior,steel,[-.55,.79,z*.72],[-.38,.56,z*.72],.025).name='Опора педального узла';
  }
  torus(interior,rubber,-.495,.843,.33,.136,.023,'x').name='Рулевое колесо';
  cylinder(interior,steel,-.518,.842,.33,.059,.081,'x',20).name='Ступица руля';
  for(let i=0;i<3;i++){
    const t=i*2*PI/3;
    beam(interior,steel,[-.495,.843,.33],[-.495,.843+.115*Math.cos(t),.33+.115*Math.sin(t)],.025).name='Спица руля';
    const z=.20+i*.104;
    cylinder(interior,dark,-.613,.834,z,.042,.025,'x',24).name='Циферблат приборов';
    torus(interior,steel,-.597,.834,z,.040,.004,'x').name='Обод прибора';
    beam(interior,lights,[-.594,.836,z],[-.594,.861,z+.013],.004).name='Стрелка прибора';
  }
  upholstered(interior,dark,'Экран центральной консоли',-.589,.802,-.01,.21,.112,.021).rotation.y=PI/2;
  for(const z of [-.43,-.35,-.27]) beam(interior,steel,[-.587,.824,z],[-.587,.824,z+.053],.009).name='Ламель дефлектора';
  for(const side of [-1,1]){
    upholstered(interior,leather,'Внутренняя панель двери',.04,.646,side*.69,1.30,.25,.042,.042);
    beam(interior,steel,[-.23,.72,side*.666],[.02,.73,side*.666],.021).name='Внутренняя ручка двери';
  }
  beam(interior,steel,[-.13,.652,0],[-.08,.78,0],.025).name='Рычаг коробки';
  ball(interior,leather,-.08,.794,0,.040).name='Рукоятка коробки';

  const bores=[-.339,-.113,.113,.339];
  const boresWithRadius=bores.map(x=>[x,0,.097]);
  drilledPlate(blockParts,dark,'Блок с четырьмя цилиндрами',.93,.42,.205,boresWithRadius,0,.221,0);
  for(const x of bores){
    const liner=annulus(blockParts,steel,x,.221,0,.106,.095,.222);
    liner.rotation.x=PI/2; liner.name='Гильза цилиндра';
  }
  drilledPlate(engineFix,copper,'Прокладка ГБЦ',.965,.456,.016,boresWithRadius,0,.339,0);
  drilledPlate(headParts,steel,'Головка блока',.958,.43,.105,
    bores.flatMap(x=>[[x,-.046,.029],[x,.046,.029]]),0,.405,0);
  for(const z of [-.119,.119]){
    cylinder(headParts,dark,0,.472,z,.029,.93,'x',20).name='Распределительный вал';
    for(const x of bores){
      ball(headParts,steel,x,.473,z,.043,.042,.029).name='Кулачок распредвала';
      const valve=cylinder(headParts,brass,x,.384,z*.47,.019,.090,'y',14);
      valve.name='Стержень клапана';
      cylinder(headParts,steel,x,.337,z*.47,.029,.014,'y',16).name='Тарелка клапана';
      torus(headParts,steel,x,.42,z*.47,.030,.006,'y').name='Пружина клапана';
    }
  }
  const timing=gear(headParts,brass,-.507,.372,0,.080,18,.030);
  timing.rotation.y=PI/2;
  for(const x of bores){
    beam(headParts,copper,[x,.387,.213],[x-.045,.278,.300],.037).name='Выпускной канал';
    beam(headParts,steel,[x,.389,-.215],[x+.038,.424,-.303],.033).name='Впускной канал';
  }
  beam(headParts,steel,[-.431,.423,-.30],[.401,.423,-.30],.066).name='Впускной коллектор';
  beam(headParts,copper,[-.421,.275,.298],[.426,.275,.298],.065).name='Выпускной коллектор';
  cylinder(sumpParts,steel,.23,.095,-.245,.075,.172,'y',24).name='Масляный фильтр';
  for(const x of [-.437,-.222,0,.222,.437])for(const z of [-.163,.163])
    joint(engineFix,steel,x,.369,z,'y',.025,.135);
  box(sumpParts,dark,0,-.056,0,.93,.111,.39).name='Масляный поддон';
  box(sumpParts,steel,0,.008,0,.96,.018,.42).name='Фланец поддона';
  cylinder(sumpParts,brass,.32,.035,-.09,.061,.067,'y',18).name='Маслозаборник';
  cylinder(sumpParts,steel,-.31,-.119,0,.037,.021,'y',6).name='Сливная пробка';

  const crank=part(movingParts,0,.083,0);
  cylinder(crank,steel,0,0,0,.034,.99,'x',24).name='Коленвал';
  const pistons=[];
  for(const [i,x] of bores.entries()){
    const phase=i===1||i===2?PI:0;
    const web=part(crank,x,0,0); web.rotation.x=phase;
    for(const dx of [-.065,.065]){
      cylinder(web,dark,dx,.013,0,.070,.032,'x',24).name='Щека коленвала';
      cylinder(web,steel,dx,0,0,.040,.037,'x',20).name='Коренная шейка';
    }
    cylinder(web,steel,0,.046,0,.023,.125,'x',18).name='Шатунная шейка';
    const piston=part(movingParts,x,.287,0);
    cylinder(piston,steel,0,0,0,.090,.071,'y',28).name='Поршень';
    for(const y of [-.021,-.004,.013])torus(piston,dark,0,y,0,.089,.004,'y').name='Поршневое кольцо';
    cylinder(piston,brass,0,-.029,0,.019,.141,'x',18).name='Поршневой палец';
    const rod=box(movingParts,steel,x,.178,0,.038,.149,.027);rod.name='Шатун';
    pistons.push({piston,rod,phase,x});
  }
  let turn=0;
  const up=new Vector3(0,1,0), axis=new Vector3();
  const rodLength=.135;
  function moveEngine(angle) {
    crank.rotation.x=angle;
    timing.rotation.z=angle*.5;
    for(const {piston,rod,phase,x} of pistons){
      const pinY=.083+.046*Math.cos(angle+phase), pinZ=.046*Math.sin(angle+phase);
      const pinHeight=pinY+Math.sqrt(rodLength**2-pinZ**2);
      piston.position.y=pinHeight+.029;
      rod.position.set(x,(pinY+pinHeight)/2,pinZ/2);
      axis.set(0,pinHeight-pinY,-pinZ).normalize();
      rod.quaternion.setFromUnitVectors(up,axis);
    }
  }
  moveEngine(turn);
  a.motion=dt=>{turn=(turn+dt*3.7)%(2*PI);moveEngine(turn);};
  a.motionLabel='Запустить двигатель';

  cylinder(transmission,dark,-.71,.438,0,.179,.37,'x',30,.107).name='Картер сцепления';
  cylinder(transmission,steel,-.38,.412,0,.115,.40,'x',24,.144).name='Коробка передач';
  cylinder(transmission,steel,.44,.34,0,.042,1.44,'x',20).name='Карданный вал';
  ball(transmission,dark,1.41,.34,0,.151,.125,.13).name='Картер дифференциала';
  cylinder(transmission,steel,1.41,.34,0,.055,1.55,'z',18).name='Полуоси заднего моста';
  for(const z of [-.25,.25]){
    beam(transmission,copper,[-1.22,.323,z],[1.91,.313,z],.045).name='Труба выхлопа';
    cylinder(transmission,dark,1.65,.32,z,.087,.41,'x',24).name='Глушитель';
  }
  box(cooling,dark,-1.96,.605,0,.095,.385,.95).name='Рамка радиатора';
  for(let i=0;i<16;i++)box(cooling,steel,-1.902,.435+i*.024,0,.037,.012,.844).name='Ламель радиатора';
  cylinder(cooling,brass,-1.83,.623,0,.074,.066,'x',18).name='Ступица вентилятора';
  for(let i=0;i<6;i++){
    const t=i*PI/3;
    const fan=box(cooling,dark,-1.835,.623+.145*Math.cos(t),.145*Math.sin(t),.024,.146,.061);
    fan.rotation.x=t;fan.name='Лопасть вентилятора';
  }
  beam(cooling,rubber,[-1.88,.777,.285],[-1.56,.812,.26],.049).name='Шланг охлаждения';
  beam(cooling,rubber,[-1.88,.435,-.277],[-1.47,.523,-.251],.049).name='Обратный шланг';

  for(const {group,x,z,side} of wheels){
    installLayer(a,group,[x*.13,-.12,side*1.0],.16);
    const rotorZ=z-side*.095;
    cylinder(brakes,steel,x,.35,rotorZ,.194,.043,'z',40).name='Тормозной диск';
    box(brakes,copper,x+.143,.416,rotorZ,.111,.148,.093).name='Тормозной суппорт';
    for(let i=0;i<8;i++){
      const t=i*PI/4;
      cylinder(brakes,dark,x+.162*Math.cos(t),.35+.162*Math.sin(t),rotorZ+side*.025,.013,.010,'z',10).name='Паз диска';
    }
    beam(brakes,steel,[x,.32,z-side*.09],[x+.12,.345,side*.46],.051).name='Рычаг подвески';
    beam(brakes,dark,[x,.35,z-side*.135],[x,.81,side*.61],.055).name='Шток амортизатора';
    for(let i=0;i<6;i++)torus(brakes,brass,x,.444+i*.041,side*(.72-i*.018),.070,.011,'y').name='Виток пружины';
    for(let i=0;i<5;i++){
      const t=i*2*PI/5;
      joint(group,steel,x+.091*Math.cos(t),.35+.091*Math.sin(t),z+side*.16,'z',.019,.088);
    }
  }

  a.adjustments=[{label:'Разборка двигателя',initial:0,apply(v){
    if(v>0 && !block.visible) a.visibilityControls?.get(block)?.reset();
    for(const [group,offset] of innerGroups)group.position.copy(offset).multiplyScalar(v/100);
  }}];
  a.fasteners=[engineHardware];
  a.shells=[
    {groups:[bodywork,hood,roof],label:'Снять кузов',restoreLabel:'Вернуть кузов'},
    {groups:[block,head],label:'Открыть поршневую группу',restoreLabel:'Вернуть блок и головку'},
  ];
  a.views=[
    view('Двигатель',block,[0,.21,0],2.92,[-1,.91,1],[hood]),
    view('Поршни и коленвал',movingParts,[0,.16,0],2.18,[.25,.62,1],[hood,block,head]),
    view('Салон',interior,[-.04,.77,0],2.82,[.73,1,.79],[roof,bodywork]),
    view('Тормоза и подвеска',brakes,[-1.40,.45,.78],2.04,[-.40,.42,1]),
  ];
  a.finish=paint;
  a.eye=[-.82,.47,1];
  return a;
}

function buildingAssembly() {
  const a=assembly();
  const {model,cladding}=createBuilding();
  const slab=a.layer([0,-.41,0],undefined,'Фундамент');
  const columns=a.layer([0,0,0],undefined,'Колонны и вертикальные связи');
  const trusses=a.layer([0,1.72,0],undefined,'Фермы, прогоны и освещение',.12);
  const roofs=a.layer([0,3.10,0],undefined,'Листы кровли');
  const siding=a.layer([1.51,.40,1.08],undefined,'Фасадные панели');
  const windows=a.layer([0,.41,1.65],undefined,'Ленточное остекление',.16);
  const joints=a.layer([0,1.11,-.85],undefined,'Анкеры и пластины',.26);
  for(const object of [...model.children]){
    if(object===cladding)continue;
    const under=object.position.y<0;
    const upper=object.position.y>=2.71;
    object.name=under?'Плита фундамента':upper?'Элемент фермы или прогона':'Стойка, связь или опора';
    (under?slab:upper?trusses:columns).add(object);
  }
  for(const object of [...cladding.children]){
    const roof=object.position.y>3.3;
    const glass=object.material.color.getHex()===0x72939f;
    object.name=roof?'Кровельная панель':glass?'Оконная секция':'Фасадная обшивка';
    (roof?roofs:glass?windows:siding).add(object);
  }
  const steel=mat('steel'), copper=mat('gold');
  for(const x of [-3.4,3.4])for(const z of [-4.5,-2.25,0,2.25,4.5]){
    for(const dx of [-.14,.14])for(const dz of [-.143,.143])joint(joints,steel,x+dx,.087,z+dz,'y',.034,.17);
    box(joints,copper,x,2.92,z+.13,.32,.30,.035).name='Фасонка фермы';
    for(const dx of [-.08,.08])joint(joints,steel,x+dx,2.93,z+.16,'z',.032,.16);
  }
  a.fasteners=[joints];
  a.shells=[{groups:[roofs,siding,windows],label:'Снять обшивку',restoreLabel:'Вернуть обшивку'}];
  a.views=[view('Узел фермы',joints,[3.4,2.94,2.4],3.2,[.56,.3,1],[roofs,siding,windows]),
    view('Анкеры колонны',joints,[3.4,.095,4.50],1.95,[.9,.66,1],[roofs,siding,windows])];
  return a;
}

function flangeAssembly() {
  const a=assembly(), bronze=mat('gold'), dark=mat('gunmetal');
  const bottom=a.layer([0,-.42,0],[0,-.14375,0],'Ответный фланец');
  const seal=a.layer([0,.21,.39],[0,0,0],'Прокладка и патрубок',.15);
  const top=a.layer([0,.58,0],[0,.14375,0],'Регулируемый фланец');
  const fixing=a.layer([0,1.17,0],[0,.13,0],'Шпильки, шайбы и гайки',.22);
  const main=createDetail(20,18);
  main.name='Фланец с четырьмя отверстиями';
  top.add(main);
  const mating=createDetail(20,18);
  mating.name='Ответный фланец';
  bottom.add(mating);
  const gasket=createDetail(3,18);
  gasket.material.color.setHex(0x876352);
  gasket.name='Прокладка';
  seal.add(gasket);
  const pipe=annulus(bottom,dark,0,-.237,0,.404,.375,.32);
  pipe.rotation.x=PI/2;pipe.name='Патрубок';
  const hardware=[];
  for(const [x,z] of [[.75,0],[0,.75],[-.75,0],[0,-.75]])
    hardware.push(joint(fixing,bronze,x,0,z,'y',.148,.67));
  let thickness=20, hole=18;
  function replace(part,t,d){
    const next=makeFlange(t,d);
    part.geometry.dispose();
    part.geometry=next;
  }
  function updateGeometry(){
    replace(main,thickness,hole);
    replace(mating,20,hole);
    replace(gasket,3,hole);
    // The flange face stays seated on the gasket as thickness changes.
    main.position.y=(thickness-20)/160;
    for(const bolt of hardware){
      bolt.scale.x=bolt.scale.z=Math.min(1.29,hole/18);
      bolt.children[1].position.y=.335+(thickness-20)/80;
      bolt.children[2].position.y=.377+(thickness-20)/80;
    }
  }
  a.adjustments=[
    {label:'Толщина фланца',initial:20,min:8,max:40,unit:' мм',apply(value){thickness=value;updateGeometry();}},
    {label:'Диаметр крепёжных отверстий',initial:18,min:10,max:30,unit:' мм',apply(value){hole=value;updateGeometry();}},
  ];
  a.fasteners=[fixing];
  a.views=[view('Посадка болта',fixing,[.75,.06,0],1.38,[.6,.74,1]),
    view('Прокладка и патрубок',seal,[0,0,0],2.46,[.47,.62,1])];
  return a;
}

export const catalog = [
  ['watch','Часы 007','products','Ручной завод, анкерный спуск, отдельные стрелки и разборка каждого узла',()=>import('./calibre-007.js?v=2').then(({createCalibre007})=>createCalibre007())],
  ['tolmachevo','Толмачёво','industry','Входная группа по фотографиям объекта СибСТК. Фермы, остекление и крепёж в разборе',()=>import('./tolmachevo.js').then(({createTolmachevo})=>createTolmachevo())],
  ['staircase','Стальная лестница','industry','Косоуры, решётчатые ступени, перила и анкерные опоры',staircase],
  ['glass-rail','Стеклянное ограждение','industry','Остекление, стойки, зажимы и крепление к основанию',glassRail],
  ['steel-canopy','Навес на фермах','industry','Стальные фермы, прогоны, панели кровли и болтовые соединения',steelCanopy],
  ['butterfly-valve','Дисковый затвор','industry','Диск в движении, редуктор, фланцы и уплотнение',butterflyValve],
  ['car','Автомобиль','tech','Кузов, салон, тормоза и отдельная разборка рядного двигателя',carAssembly],
  ['building','Стальное здание','industry','Обшивка, прогоны и болтовые узлы исходного каркаса',buildingAssembly],
  ['flange','Фланцевое соединение','industry','Два фланца, прокладка, шпильки и изменяемые размеры',flangeAssembly],
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
  ['telescope','Телескоп','tech','Настройте наклон оптической трубы',telescope],
  ['motor','Электродвигатель','industry','Статор, обмотка, вал и крышка',motor],
  ['villa','Вилла с террасой','architecture','Разнесите уровни и рассмотрите этажи',villa],
  ['lamp','Настольная лампа','products','Угол плафона и варианты цвета',lamp],
  ['charger','Зарядная станция','tech','Снимите панель и посмотрите компоновку',charger],
].map(([id,title,category,description,create])=>({id,title,category,description,create}));
