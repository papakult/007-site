import {
  BufferAttribute, BufferGeometry, Color, DoubleSide, Group, Mesh,
  MeshBasicMaterial, MeshPhysicalMaterial, Vector3,
} from './engine.js';

const offsets = {
  'Каркас фасада': [0, 0, 2.7],
  'Круглые колонны': [0, 0, -2],
  'Фермы покрытия': [0, 2.9, -1.1],
  'Остекление': [0, 0, 5.1],
  'Входная группа': [0, -.25, 2.6],
};

function readModel(buffer) {
  // The exported GLB has one JSON chunk, one binary chunk and packed float
  // vertices with 16-bit triangle indices. Preserve the source transforms.
  const view = new DataView(buffer);
  if (view.getUint32(0, true) !== 0x46546c67 || view.getUint32(4, true) !== 2)
    throw new Error('Expected the original GLB 2 assembly');
  const length = view.getUint32(12, true);
  const model = JSON.parse(new TextDecoder().decode(new Uint8Array(buffer, 20, length)));
  const dataStart = 28 + length;
  function attribute(index, size, TypedArray) {
    const accessor = model.accessors[index];
    const offset = dataStart + model.bufferViews[accessor.bufferView].byteOffset + (accessor.byteOffset || 0);
    return new BufferAttribute(new TypedArray(buffer, offset, accessor.count * size), size);
  }

  const materials = model.materials.map(source => {
    const { baseColorFactor: [r, g, b, opacity], metallicFactor, roughnessFactor } = source.pbrMetallicRoughness;
    const glass = source.alphaMode === 'BLEND';
    const options = {
      color: new Color().setRGB(r, g, b), opacity, transparent: glass,
      depthWrite: !glass, side: source.doubleSided ? DoubleSide : undefined,
    };
    if (!source.doubleSided) delete options.side;
    if (source.extensions?.KHR_materials_unlit) return new MeshBasicMaterial(options);
    return new MeshPhysicalMaterial({
      ...options, metalness: metallicFactor, roughness: roughnessFactor,
      clearcoat: source.extensions?.KHR_materials_clearcoat?.clearcoatFactor || 0,
    });
  });
  const geometryByIndex = new Map();
  const meshes = model.meshes.map(({primitives: [p]}) => {
    const key = p.attributes.POSITION;
    if (!geometryByIndex.has(key)) {
      const geometry = new BufferGeometry();
      geometry.setAttribute('position', attribute(key, 3, Float32Array));
      geometry.setAttribute('normal', attribute(p.attributes.NORMAL, 3, Float32Array));
      geometry.setIndex(attribute(p.indices, 1, Uint16Array));
      geometryByIndex.set(key, geometry);
    }
    return [geometryByIndex.get(key), materials[p.material]];
  });
  return { model, meshes };
}

export async function createTolmachevo() {
  const response = await fetch(new URL('./tolmachevo.glb', import.meta.url));
  if (!response.ok) throw new Error('The Tolmachevo model could not be loaded');
  const { model, meshes } = readModel(await response.arrayBuffer());
  const root = new Group();
  const sections = [];
  const fasteners = [];
  let glass;
  let columnFasteners;
  const sourceRoot = model.nodes[model.scenes[model.scene].nodes[0]];
  for (const index of sourceRoot.children) {
    const source = model.nodes[index];
    const layer = new Group();
    const hardware = new Group();
    layer.name = source.name;
    hardware.name = `Крепёж · ${source.name.toLowerCase()}`;
    root.add(layer);
    const direction = offsets[source.name];
    sections.push({group: layer, origin: layer.position.clone(), offset: new Vector3(...direction),
      start: source.name === 'Остекление' ? 0 : .15});
    if (source.name === 'Остекление') glass = layer;
    if (source.name === 'Круглые колонны') columnFasteners = hardware;
    for (const child of source.children) {
      const item = model.nodes[child];
      const mesh = new Mesh(...meshes[item.mesh]);
      mesh.matrix.fromArray(item.matrix);
      mesh.matrixAutoUpdate = false;
      const fastener = item.mesh === 2 || item.mesh === 5;
      mesh.name = item.mesh === 5 ? 'Болт' : item.mesh === 2 ? 'Соединительная пластина' :
        source.name === 'Остекление' ? (item.mesh === 8 ? 'Световой блик' : 'Стеклянная панель') :
        source.name === 'Круглые колонны' && [3,4].includes(item.mesh) ? 'Круглая опора' : 'Профиль';
      (fastener ? hardware : layer).add(mesh);
    }
    if (hardware.children.length) {
      root.add(hardware);
      fasteners.push(hardware);
      sections.push({
        group: hardware, origin: hardware.position.clone(),
        offset: new Vector3(direction[0], direction[1] + .44, direction[2] + 1.35), start: .38,
      });
    }
  }

  const bolts = columnFasteners.children.map(mesh => new Vector3().setFromMatrixPosition(mesh.matrix));
  const anchor = bolts.filter(p => p.y < 1).sort((a, b) => b.x - a.x || b.z - a.z)[0];
  return {
    root, sections, fasteners,
    shell: {group: glass, label: 'Скрыть остекление', restoreLabel: 'Показать остекление'},
    views: [
      {label: 'Опора и болты', target: anchor, group: columnFasteners, distance: 3.1, eye: [1,.72,1.1]},
      {label: 'Фермы изнутри', target: new Vector3(2.6,7.2,1.9), distance: 12, eye: [.65,-.32,.75]},
    ],
  };
}
