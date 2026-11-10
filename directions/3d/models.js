import {
  BoxGeometry, BufferAttribute, BufferGeometry, CylinderGeometry, DoubleSide, Group, Mesh, MeshBasicMaterial,
  MeshPhysicalMaterial, MeshStandardMaterial, Quaternion, SphereGeometry, TorusGeometry, Vector3,
} from './engine.js';
import { makeFlange } from './flange.js';

const metal = (color, metalness = 0.5, roughness = 0.32) =>
  new MeshStandardMaterial({ color, metalness, roughness });

function part(parent, geometry, material, x = 0, y = 0, z = 0) {
  const object = new Mesh(geometry, material);
  object.position.set(x, y, z);
  parent.add(object);
  return object;
}

function box(parent, material, x, y, z, width, height, depth) {
  return part(parent, new BoxGeometry(width, height, depth), material, x, y, z);
}

function oval(parent, material, x, y, z, width, height, depth) {
  const object = part(parent, new SphereGeometry(1, 24, 12), material, x, y, z);
  object.scale.set(width, height, depth);
  return object;
}

function beam(parent, material, start, end, width, depth = width) {
  const a = new Vector3(...start);
  const b = new Vector3(...end);
  const vector = b.clone().sub(a);
  const middle = a.add(b).multiplyScalar(0.5);
  const object = box(parent, material, ...middle.toArray(), width, vector.length(), depth);
  object.quaternion.copy(new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), vector.normalize()));
  return object;
}

// Each station contains the front-to-rear position and the contour of one side.
function shell(parent, stations, material, closed = false) {
  const vertices = [];
  const indices = [];
  const ring = stations[0].length - 1;
  for (const [x, ...profile] of stations) {
    for (const [y, z] of profile) vertices.push(x, y, z);
  }
  for (let row = 0; row < stations.length - 1; row++) {
    const stride = closed ? ring : ring - 1;
    for (let i = 0; i < stride; i++) {
      const a = row * ring + i;
      const b = row * ring + (i + 1) % ring;
      indices.push(a, a + ring, b, b, a + ring, b + ring);
    }
  }
  if (closed) {
    for (let i = 1; i < ring - 1; i++) {
      const last = (stations.length - 1) * ring;
      indices.push(0, i, i + 1, last, last + i + 1, last + i);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return part(parent, geometry, material);
}

export function createCar(separate = false) {
  const car = new Group();
  const group = name => {
    if (!separate) return car;
    const item = new Group();
    item.name = name;
    car.add(item);
    return item;
  };
  const bodywork = group('Боковины, пороги и бамперы');
  const hood = group('Капот и передняя оптика');
  const roof = group('Крыша и остекление');
  const wheels = [];
  const paint = new MeshPhysicalMaterial({
    color: 0x617683, metalness: 0.67, roughness: 0.26, clearcoat: 0.66,
    clearcoatRoughness: 0.24, side: DoubleSide,
  });
  const rubber = metal(0x181b1d, 0.08, 0.85);
  const trim = metal(0x23282d, 0.45, 0.34);
  const alloy = metal(0xa9b4bb, 0.82, 0.27);
  const glass = new MeshPhysicalMaterial({
    color: 0x1b3442, metalness: 0.48, roughness: 0.22, clearcoat: 0.9, side: DoubleSide,
  });
  const leds = new MeshBasicMaterial({ color: 0xe1f8ff });
  const rear = new MeshBasicMaterial({ color: 0xe4694e });

  const body = [
    [-2.19, 0.58, 0.66, 0.70], [-2.08, 0.72, 0.83, 0.83], [-1.76, 0.87, 0.92, 0.87],
    [-1.40, 0.90, 0.94, 0.87], [-0.95, 0.91, 0.88, 0.80], [-0.35, 0.91, 0.84, 0.78],
    [0.40, 0.94, 0.86, 0.79], [0.97, 0.98, 0.94, 0.87], [1.44, 0.95, 0.98, 0.91],
    [1.91, 0.83, 0.91, 0.87], [2.12, 0.65, 0.77, 0.73], [2.18, 0.57, 0.64, 0.64],
  ];
  const bodyProfile = body.map(([x, y, width, shoulder]) => [x,
    [0.38, -width * 0.82], [y - 0.17, -width], [y - 0.04, -shoulder],
    [y + 0.04, -shoulder * 0.58], [y + 0.06, 0], [y + 0.04, shoulder * 0.58],
    [y - 0.04, shoulder], [y - 0.17, width], [0.38, width * 0.82],
  ]);
  if (separate) {
    shell(bodywork, bodyProfile.slice(4), paint, true).name = 'Задняя часть кузова';
    shell(bodywork, bodyProfile.slice(0, 5).map(([x, ...profile]) =>
      [x, ...profile.slice(0, 3), ...profile.slice(6)]), paint, false).name = 'Передние боковины';
    shell(hood, bodyProfile.slice(0, 5).map(([x, ...profile]) =>
      [x, ...profile.slice(2, 7)]), paint).name = 'Панель капота';
  } else shell(bodywork, bodyProfile, paint, true);

  const cabin = [
    [-1.17, 0.95, 0.66], [-0.83, 1.16, 0.59], [-0.49, 1.39, 0.49], [-0.20, 1.45, 0.47],
    [0.41, 1.43, 0.48], [0.71, 1.31, 0.53], [1.03, 1.13, 0.62], [1.29, 0.98, 0.69],
  ];
  shell(roof, cabin.map(([x, y, width]) => [x, [0.92, -width * 1.14], [y, -width],
    [y + 0.03, 0], [y, width], [0.92, width * 1.14]]), glass);
  shell(roof, cabin.slice(2, 6).map(([x, y, width]) =>
    [x, [y + 0.006, -width * 0.91], [y + 0.036, 0], [y + 0.006, width * 0.91]]), paint);

  for (const side of [-1, 1]) {
    beam(roof, paint, [-0.84, 0.94, 0.68 * side], [-0.49, 1.38, 0.49 * side], 0.034);
    beam(roof, paint, [0.42, 0.95, 0.68 * side], [0.42, 1.43, 0.48 * side], 0.034);
    beam(roof, paint, [1.27, 0.96, 0.73 * side], [0.70, 1.30, 0.54 * side], 0.034);
    beam(bodywork, trim, [-0.94, 0.42, 0.80 * side], [0.96, 0.43, 0.87 * side], 0.025);
    beam(bodywork, trim, [0.63, 0.83, 0.83 * side], [0.79, 0.84, 0.86 * side], 0.016);
    oval(bodywork, paint, -0.69, 0.96, 0.88 * side, 0.13, 0.055, 0.092);
    beam(hood, leds, [-2.11, 0.63, 0.70 * side], [-1.82, 0.79, 0.87 * side], 0.042, 0.045);
    beam(bodywork, rear, [1.85, 0.77, 0.86 * side], [2.13, 0.60, 0.67 * side], 0.035);
    beam(hood, leds, [-2.205, 0.61, 0.37 * side], [-2.205, 0.59, 0.62 * side], 0.022);
    box(bodywork, trim, -2.194, 0.476, 0.31 * side, 0.028, 0.055, 0.48);

    for (const x of [-1.40, 1.43]) {
      const z = side * 0.89;
      const wheelSet = group(`Колесо ${x<0?'переднее':'заднее'} ${side>0?'правое':'левое'}`);
      wheels.push({group:wheelSet,x,z,side});
      const arch = part(wheelSet, new CylinderGeometry(0.41, 0.41, 0.055, 48), trim, x, 0.40, z + side * 0.025);
      arch.rotation.x = Math.PI / 2;
      const tire = part(wheelSet, new CylinderGeometry(0.348, 0.348, 0.24, 48), rubber, x, 0.35, z);
      tire.rotation.x = Math.PI / 2;
      const rimZ = z + side * 0.125;
      const wheel = part(wheelSet, new CylinderGeometry(0.245, 0.245, 0.033, 48), trim, x, 0.35, rimZ);
      wheel.rotation.x = Math.PI / 2;
      part(wheelSet, new TorusGeometry(0.242, 0.018, 9, 48), alloy, x, 0.35, rimZ + side * 0.019);
      oval(wheelSet, alloy, x, 0.35, rimZ + side * 0.038, 0.070, 0.070, 0.022);
      for (let i = 0; i < 8; i++) {
        const angle = i * Math.PI / 4;
        const spokeZ = rimZ + side * 0.025;
        beam(wheelSet, alloy, [x, 0.35, spokeZ],
          [x + Math.cos(angle) * 0.23, 0.35 + Math.sin(angle) * 0.23, spokeZ], 0.032, 0.021);
      }
    }
  }
  box(bodywork, trim, -2.10, 0.42, 0, 0.16, 0.15, 1.10);
  box(bodywork, trim, 2.08, 0.40, 0, 0.16, 0.15, 1.18);
  return separate ? {bodywork,hood,roof,wheels,paint} : car;
}

export function createBuilding() {
  const building = new Group();
  const cladding = new Group();
  building.add(cladding);
  const steel = metal(0x78919b, 0.6, 0.33);
  const brace = metal(0xc8a072, 0.38, 0.35);
  const concrete = metal(0x666966, 0.15, 0.72);
  const roof = metal(0x43565b, 0.55, 0.38);
  const window = metal(0x72939f, 0.44, 0.27);
  const light = new MeshBasicMaterial({ color: 0xf4dbc4 });

  box(building, concrete, 0, -0.14, 0, 7.55, 0.26, 9.8);
  const stations = [-4.5, -2.25, 0, 2.25, 4.5];
  const columns = [-3.4, 3.4];
  for (const z of stations) {
    for (const x of columns) {
      box(building, steel, x, 1.57, z, 0.17, 3.14, 0.20);
      box(building, brace, x, 0.04, z, 0.40, 0.08, 0.42);
      beam(building, steel, [x, 3.13, z], [0, 4.2, z], 0.15);
      beam(building, steel, [x, 2.89, z], [0, 2.89, z], 0.11);
      beam(building, brace, [x * 0.55, 2.89, z], [x * 0.26, 4.0, z], 0.075);
    }
    beam(building, brace, [0, 2.89, z], [0, 4.2, z], 0.095);
  }

  for (const x of columns) {
    for (const y of [1.16, 2.15, 3.13]) {
      beam(building, steel, [x, y, -4.56], [x, y, 4.56], 0.10);
    }
    for (const z of [-4.5, 2.25]) {
      beam(building, brace, [x, 0.22, z], [x, 3.0, z + 2.25], 0.06);
      beam(building, brace, [x, 3.0, z], [x, 0.22, z + 2.25], 0.06);
    }
    for (const z of [-3.375, -1.125, 1.125, 3.375]) {
      box(cladding, roof, x, 0.55, z, 0.085, 1.02, 2.20);
      box(cladding, window, x, 2.37, z, 0.09, 0.34, 2.20);
      for (let i = 1; i < 8; i++) {
        box(cladding, steel, x * 1.013, 0.55, z - 1.10 + i * 0.27, 0.035, 0.99, 0.025);
      }
    }
  }

  for (const x of [-2.55, -1.7, -0.85, 0, 0.85, 1.7, 2.55]) {
    const y = 4.2 - Math.abs(x) * 0.315;
    beam(building, steel, [x, y, -4.67], [x, y, 4.67], 0.083);
  }
  for (const side of [-1, 1]) {
    const panel = box(cladding, roof, side * 2.48, 3.48, 0, 2.02, 0.09, 9.27);
    panel.rotation.z = -side * 0.305;
    for (const z of stations) {
      box(cladding, steel, side * 2.46, 3.53, z, 1.93, 0.028, 0.045).rotation.z = -side * 0.305;
    }
  }

  for (const z of [-4.48, 4.48]) {
    for (const x of [-1.18, 1.18]) {
      box(building, steel, x, 1.11, z, 0.14, 2.22, 0.16);
      box(cladding, roof, Math.sign(x) * 2.40, 1.43, z, 1.88, 2.73, 0.11);
    }
    box(building, steel, 0, 2.23, z, 2.51, 0.15, 0.16);
    box(cladding, window, 0, 2.60, z, 2.28, 0.48, 0.09);
  }
  for (const z of [-3.40, -1.15, 1.15, 3.40]) {
    box(building, light, 0, 2.75, z, 0.09, 0.043, 0.84);
  }
  for (const x of [-2.25, 2.25]) {
    box(building, brace, x, 0.004, 0, 0.035, 0.01, 7.85);
  }
  return { model: building, cladding };
}

export function createDetail(thickness, diameter) {
  const material = metal(0xc2ab87, 0.64, 0.30);
  return new Mesh(makeFlange(thickness, diameter), material);
}
