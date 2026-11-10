import {
  ACESFilmicToneMapping, AmbientLight, CanvasTexture, DirectionalLight,
  Mesh, MeshBasicMaterial, OrbitControls, PerspectiveCamera, PlaneGeometry,
  PMREMGenerator, RoomEnvironment, Scene, SRGBColorSpace, Vector3, WebGLRenderer,
} from './engine.js';

function limits(model) {
  const min = new Vector3(Infinity, Infinity, Infinity);
  const max = new Vector3(-Infinity, -Infinity, -Infinity);
  const corner = new Vector3();
  model.updateWorldMatrix(true,true);
  model.traverse(item => {
    if (!item.isMesh) return;
    item.geometry.computeBoundingBox();
    const b = item.geometry.boundingBox;
    for (const x of [b.min.x,b.max.x]) for (const y of [b.min.y,b.max.y]) for (const z of [b.min.z,b.max.z]) {
      corner.set(x,y,z).applyMatrix4(item.matrixWorld);
      min.min(corner);
      max.max(corner);
    }
  });
  const size = max.clone().sub(min);
  return { min, max, size, center: min.clone().add(max).multiplyScalar(.5) };
}

function lamp(color, intensity, x, y, z) {
  const light = new DirectionalLight(color, intensity);
  light.position.set(x,y,z);
  return light;
}

function shadowTexture() {
  const image = document.createElement('canvas');
  image.width = image.height = 128;
  const ctx = image.getContext('2d');
  const gradient = ctx.createRadialGradient(64,64,2,64,64,64);
  gradient.addColorStop(0,'rgba(0,0,0,.75)');
  gradient.addColorStop(.46,'rgba(0,0,0,.44)');
  gradient.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0,0,128,128);
  return new CanvasTexture(image);
}

function disposeModel(model) {
  const geometries = new Set();
  const materials = new Set();
  model.traverse(item => {
    if (!item.isMesh) return;
    geometries.add(item.geometry);
    for (const material of [item.material].flat()) materials.add(material);
  });
  geometries.forEach(g => g.dispose());
  materials.forEach(m => m.dispose());
}

export function createStage(canvas) {
  const renderer = new WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.6));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.outputColorSpace = SRGBColorSpace;
  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const env = pmrem.fromScene(room,.045,.1,100,{size:128});
  scene.environment = env.texture;
  scene.environmentIntensity = .85;
  pmrem.dispose();
  room.dispose();
  scene.add(lamp(0xe4f2ff,3.45,-4,6,5),lamp(0xffbb87,2.35,5,3,-4),
    new AmbientLight(0xb9c4db,.48));
  const floor = new Mesh(new PlaneGeometry(1,1),new MeshBasicMaterial({
    map:shadowTexture(),transparent:true,depthWrite:false,
  }));
  floor.rotation.x = -Math.PI/2;
  scene.add(floor);
  const camera = new PerspectiveCamera(32,1,.012,180);
  const controls = new OrbitControls(camera,canvas);
  controls.enableDamping = true;
  controls.dampingFactor = .11;
  controls.enablePan = true;
  controls.autoRotateSpeed = 1.3;

  let model = null;
  let bounds = null;
  let frame = null;
  let moving = false;
  let active = false;
  let time = 0;
  let dirty = false;

  const draw = () => {
    if (!active) return;
    renderer.render(scene,camera);
    dirty = false;
  };

  function run(stamp) {
    const elapsed = Math.min((stamp-(time||stamp))/1000,.05);
    time = stamp;
    frame = null;
    if (!active || document.hidden) return;
    if (moving && model.motion) model.motion(elapsed,stamp/1000);
    const changed = controls.update(elapsed);
    if (changed || dirty || moving) draw();
    if (changed || moving || controls.autoRotate) schedule();
    else time = 0;
  }

  function schedule() {
    dirty = true;
    if (active && frame === null && !document.hidden) frame = requestAnimationFrame(run);
  }

  function reset() {
    if (!bounds) return;
    bounds = limits(model.root);
    const extent = bounds.size.length();
    const eye = new Vector3(.61,.43,1).normalize();
    const right = new Vector3().crossVectors(camera.up,eye).normalize();
    const up = new Vector3().crossVectors(eye,right);
    const tan = Math.tan(camera.fov * Math.PI / 360);
    const corner = new Vector3();
    let distance = 0;
    for (const x of [-.5,.5]) for (const y of [-.5,.5]) for (const z of [-.5,.5]) {
      corner.set(x*bounds.size.x,y*bounds.size.y,z*bounds.size.z);
      distance = Math.max(distance,corner.dot(eye) + Math.max(
        Math.abs(corner.dot(up))/tan,Math.abs(corner.dot(right))/(tan*camera.aspect),
      ));
    }
    controls.target.copy(bounds.center);
    camera.position.copy(bounds.center).addScaledVector(eye,distance*1.12);
    controls.minDistance = extent * .32;
    controls.maxDistance = extent * 5.0;
    controls.update(0);
    schedule();
  }

  function resize() {
    if (!active || !canvas.clientWidth || !canvas.clientHeight) return;
    renderer.setSize(canvas.clientWidth,canvas.clientHeight,false);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    schedule();
  }

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  controls.addEventListener('change',schedule);
  document.addEventListener('visibilitychange',schedule);
  return {
    controls, camera, reset, resize, draw, schedule,
    focus(target, distance, eye = [.61,.43,1]) {
      controls.target.copy(target);
      camera.position.copy(target).addScaledVector(new Vector3(...eye).normalize(),distance);
      controls.minDistance = Math.max(camera.near * 3, distance * .17);
      controls.update(0);
      schedule();
    },
    focusPart(item) {
      const {center,size} = limits(item);
      const width = Math.min(1,camera.aspect);
      this.focus(center,Math.max(.24,size.length()*2.3/width));
    },
    dispose: disposeModel,
    show(item) {
      this.clear();
      model = item;
      active = true;
      bounds = limits(item.root);
      scene.add(item.root);
      floor.position.set(bounds.center.x,bounds.min.y-.045,bounds.center.z);
      const extent = Math.max(bounds.size.x,bounds.size.z,bounds.size.y*.70);
      floor.scale.set(extent*1.55,extent*1.50,1);
      resize();
      reset();
      draw();
      canvas.dataset.ready='true';
    },
    clear() {
      active = false;
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      moving = false;
      time = 0;
      controls.autoRotate = false;
      if (model) {
        scene.remove(model.root);
        disposeModel(model.root);
      }
      model = bounds = null;
      delete canvas.dataset.ready;
      delete canvas.dataset.model;
    },
    zoom(factor) {
      const direction = camera.position.clone().sub(controls.target);
      const length = Math.min(controls.maxDistance,Math.max(controls.minDistance,direction.length()*factor));
      camera.position.copy(controls.target).add(direction.setLength(length));
      controls.update(0);
      schedule();
    },
    animate(value) {
      moving = value;
      schedule();
    },
  };
}
