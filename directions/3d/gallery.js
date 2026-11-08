import {
  ACESFilmicToneMapping, AmbientLight, CanvasTexture, DirectionalLight, GridHelper,
  Mesh, MeshBasicMaterial, OrbitControls, PerspectiveCamera, PlaneGeometry,
  PMREMGenerator, RoomEnvironment, Scene, SRGBColorSpace, Vector3, WebGLRenderer,
} from './engine.js';
import { createBuilding, createCar, createDetail } from './models.js';
import { makeFlange } from './flange.js';

const motion = matchMedia('(prefers-reduced-motion: reduce)');
const spin = document.querySelector('#gallery-spin');
const views = new Map();
const settings = {
  car: { eye: [-3.9, 2.45, 4.9], focus: [0, 0.56, 0], min: 2.7, max: 12, shadow: 5.7 },
  building: { eye: [12, 8.5, 13], focus: [0, 1.65, 0], min: 7, max: 32, shadow: 14.5 },
  detail: { eye: [2.05, 2.65, 3.0], focus: [0, 0, 0], min: 1.9, max: 9, shadow: 3.6 },
};
let spinning = !motion.matches;
let raf = null;
let previousTime = 0;
let available = 0;
let failed = 0;

function setSpin(value) {
  spinning = value;
  spin.textContent = value ? 'Пауза' : 'Вращать';
  spin.setAttribute('aria-label', value ? 'Остановить вращение моделей' : 'Запустить вращение моделей');
  wake();
}

function frame(time) {
  raf = null;
  const elapsed = Math.min((time - (previousTime || time)) / 1000, 0.05);
  previousTime = time;
  let more = false;
  for (const view of views.values()) {
    if (!view.visible) continue;
    const auto = spinning && !view.inside;
    view.controls.autoRotate = auto;
    const changed = view.controls.update(elapsed);
    if (changed || view.dirty || auto) {
      view.renderer.render(view.scene, view.camera);
      view.dirty = false;
      view.stage.dataset.ready = 'true';
    }
    more ||= auto || changed;
  }
  if (more) wake();
  else previousTime = 0;
}

function wake() {
  if (raf === null && !document.hidden) raf = requestAnimationFrame(frame);
}

function light(color, intensity, position) {
  const lamp = new DirectionalLight(color, intensity);
  lamp.position.set(...position);
  return lamp;
}

function studioFloor(scene, scale, y) {
  const image = document.createElement('canvas');
  image.width = image.height = 64;
  const ctx = image.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 1, 32, 32, 32);
  gradient.addColorStop(0, '#000c');
  gradient.addColorStop(0.55, '#0008');
  gradient.addColorStop(1, '#0000');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const shadow = new Mesh(new PlaneGeometry(scale * 1.14, scale * 0.80), new MeshBasicMaterial({
    map: new CanvasTexture(image), transparent: true, depthWrite: false,
  }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = y + 0.005;
  const grid = new GridHelper(scale * 1.25, 12, 0x636864, 0x434a48);
  grid.position.y = y;
  grid.material.transparent = true;
  grid.material.opacity = 0.17;
  scene.add(grid, shadow);
}

function setCamera(view, eye, focus, minimum) {
  view.controls.minDistance = minimum;
  view.camera.position.set(...eye);
  view.controls.target.set(...focus);
  view.controls.update(0);
  view.dirty = true;
  wake();
}

function attachControls(view, config) {
  const { canvas, controls, camera } = view;
  controls.addEventListener('start', () => setSpin(false));
  controls.addEventListener('change', () => {
    view.dirty = true;
    wake();
  });
  canvas.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    setSpin(false);
    const delta = camera.position.clone().sub(controls.target);
    const axis = event.key === 'ArrowLeft' || event.key === 'ArrowRight'
      ? new Vector3(0, 1, 0) : new Vector3().crossVectors(delta, camera.up).normalize();
    delta.applyAxisAngle(axis, event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? 0.13 : -0.13);
    camera.position.copy(controls.target).add(delta);
    controls.update(0);
    view.dirty = true;
    wake();
  });
  view.card.querySelector('[data-reset]').addEventListener('click', () => {
    if (view.inside) toggleInterior(view, config, false);
    else setCamera(view, config.eye, config.focus, config.min);
  });
}

function toggleInterior(view, config, inside) {
  view.inside = inside;
  view.cladding.visible = !inside;
  view.camera.fov = inside ? 48 : 35;
  view.camera.updateProjectionMatrix();
  const button = view.card.querySelector('[data-interior]');
  button.setAttribute('aria-pressed', String(inside));
  button.textContent = inside ? 'Выйти наружу' : 'Зайти внутрь';
  view.card.querySelector('[data-view-label]').textContent = inside ? 'Внутри каркаса' : 'Внешний вид';
  if (inside) setCamera(view, [1.64, 1.24, 3.96], [-0.66, 2.02, -2.2], 0.35);
  else setCamera(view, config.eye, config.focus, config.min);
}

function attachDimensions(view, detail) {
  const inputs = Array.from(view.card.querySelectorAll('input[type=range]'));
  let pending = false;
  const change = () => {
    for (const input of inputs) {
      const symbol = input.id === 'bolt-diameter' ? 'Ø' : '';
      input.setAttribute('aria-valuetext', input.value + ' мм');
      view.card.querySelector(`output[for="${input.id}"]`).value = symbol + input.value + ' мм';
    }
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      const old = detail.geometry;
      detail.geometry = makeFlange(...inputs.map(input => input.valueAsNumber));
      old.dispose();
      view.dirty = true;
      wake();
    });
  };
  for (const input of inputs) input.addEventListener('input', change);
  view.card.querySelector('[data-defaults]').addEventListener('click', () => {
    for (const input of inputs) input.value = input.defaultValue;
    change();
  });
}

function init(card) {
  const key = card.dataset.model;
  const config = settings[key];
  const stage = card.querySelector('.stage');
  const canvas = stage.querySelector('canvas');
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.23;
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  scene.environment = pmrem.fromScene(room, 0.04, 0.1, 100, { size: 128 }).texture;
  scene.environmentIntensity = 1.0;
  pmrem.dispose();
  room.dispose();
  scene.add(light(0xe2f2ff, 3.0, [-5, 7, 5]), light(0xffd3ab, 2.8, [5, 3, -5]),
    new AmbientLight(0xe3e4db, 0.45));

  const camera = new PerspectiveCamera(35, 1, 0.04, 90);
  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  if (matchMedia('(pointer: coarse)').matches) canvas.style.touchAction = 'pan-y';
  controls.maxDistance = config.max;
  controls.autoRotateSpeed = 1.42;
  // Wheel scrolling remains available for the page. Pinch and keyboard viewing work on the canvas.
  stage.addEventListener('wheel', event => {
    if (!event.ctrlKey) event.stopPropagation();
  }, { capture: true, passive: true });
  const view = { card, stage, canvas, renderer, scene, camera, controls, visible: true, dirty: true, inside: false };
  studioFloor(scene, config.shadow, key === 'detail' ? -0.31 : key === 'building' ? -0.30 : -0.015);

  if (key === 'car') scene.add(createCar());
  if (key === 'building') {
    const { model, cladding } = createBuilding();
    scene.add(model);
    view.cladding = cladding;
    card.querySelector('[data-interior]').addEventListener('click', () => toggleInterior(view, config, !view.inside));
  }
  if (key === 'detail') {
    const detail = createDetail(20, 18);
    scene.add(detail);
    attachDimensions(view, detail);
  }
  attachControls(view, config);
  setCamera(view, config.eye, config.focus, config.min);
  const resize = () => {
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    view.dirty = true;
    wake();
  };
  new ResizeObserver(resize).observe(stage);
  resize();
  card.querySelectorAll('button, input').forEach(element => { element.disabled = false; });
  return view;
}

spin.addEventListener('click', () => setSpin(!spinning));
motion.addEventListener('change', event => setSpin(!event.matches));
document.addEventListener('visibilitychange', () => {
  previousTime = 0;
  if (document.hidden && raf !== null) {
    cancelAnimationFrame(raf);
    raf = null;
  } else wake();
});

const observer = new IntersectionObserver(entries => {
  for (const { target, isIntersecting } of entries) {
    if (!views.has(target) && isIntersecting) {
      try {
        views.set(target, init(target));
        spin.disabled = false;
        available++;
      } catch (error) {
        console.warn('3D preview unavailable', error);
        target.dataset.fallback = 'true';
        observer.unobserve(target);
        failed++;
      }
    }
    const view = views.get(target);
    if (view) view.visible = isIntersecting;
  }
  if (!available && failed) spin.hidden = true;
  else if (available) spin.hidden = false;
  wake();
}, { rootMargin: '160px' });

document.querySelectorAll('[data-model]').forEach(card => observer.observe(card));
setSpin(spinning);
