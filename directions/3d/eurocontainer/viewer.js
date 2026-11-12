import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
const $=id=>document.getElementById(id),host=$('stage');
let renderer,root,lid,view='all',angle=0,targetAngle=0,fitGoal=null;
const camera=new THREE.PerspectiveCamera(34,1,.01,70);
const scene=new THREE.Scene();
try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});}catch(error){$('loader').textContent='3D недоступно в этом браузере. Ниже можно посмотреть ролик';throw error;}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.82;renderer.outputColorSpace=THREE.SRGBColorSpace;
host.append(renderer.domElement);renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('aria-label','3D-контейнер. Перетаскивайте, чтобы повернуть, используйте колесико для масштаба');
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=.18;controls.maxDistance=12;controls.maxPolarAngle=Math.PI*.54;controls.autoRotateSpeed=.8;controls.listenToKeyEvents(renderer.domElement);
camera.position.set(2.5,1.8,3.4);controls.target.set(0,.65,0);
const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();scene.environment=pmrem.fromScene(room,.04).texture;room.dispose();pmrem.dispose();
scene.add(new THREE.HemisphereLight(0xf2f5f8,0x58616c,.8));
for(const [color,power,pos] of [[0xfff3dc,2,[-3,5,4]],[0xd7e7ff,1,[3,3,-3]]]){const l=new THREE.DirectionalLight(color,power);l.position.set(...pos);scene.add(l);}
const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=256;const sc=shadowCanvas.getContext('2d'),gradient=sc.createRadialGradient(128,128,12,128,128,128);gradient.addColorStop(0,'rgba(0,0,0,.36)');gradient.addColorStop(.5,'rgba(0,0,0,.20)');gradient.addColorStop(1,'rgba(0,0,0,0)');sc.fillStyle=gradient;sc.fillRect(0,0,256,256);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(2.0,1.7),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(shadowCanvas),transparent:true,depthWrite:false}));floor.rotation.x=-Math.PI/2;floor.position.y=-.001;scene.add(floor);
function chosen(){const meshes=[];root.updateMatrixWorld(true);root.traverse(o=>{if(!o.isMesh)return;if(view==='all')meshes.push(o);else if(view==='wheels'&&o.userData.label?.startsWith('Колесо 10'))meshes.push(o);else if(view==='grips'&&o.userData.category==='grips'&&new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3()).x>0)meshes.push(o);});return meshes;}
function fit(){if(!root)return;const box=new THREE.Box3();for(const o of chosen())box.expandByObject(o);if(box.isEmpty())box.setFromObject(root);const center=box.getCenter(new THREE.Vector3());const direction=new THREE.Vector3(...(view==='all'?[1,.65,1.4]:view==='grips'?[1,.3,.75]:[.9,.35,1.05])).normalize();const right=new THREE.Vector3().crossVectors(camera.up,direction).normalize(),up=new THREE.Vector3().crossVectors(direction,right);const tan=Math.tan(THREE.MathUtils.degToRad(camera.fov*.5));let d=.2;for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]){const p=new THREE.Vector3(x,y,z).sub(center);d=Math.max(d,p.dot(direction)+Math.abs(p.dot(right))/(tan*camera.aspect*.86),p.dot(direction)+Math.abs(p.dot(up))/(tan*.86));}fitGoal={target:center,position:center.clone().addScaledVector(direction,d)};}
function setView(next){view=next;document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));$('shot').textContent=({all:'Контейнер в сборе',grips:'Ручки и захваты',wheels:'Колесная опора'})[view];fit();}
function setLid(p){targetAngle=p*THREE.MathUtils.degToRad(105);$('lid').value=Math.round(p*100);$('lid-out').textContent=Math.round(p*100)+'%';$('toggle-lid').textContent=p>.5?'Закрыть крышку':'Открыть крышку';if(view!=='all')setView('all');}
$('lid').addEventListener('input',e=>setLid(Number(e.target.value)/100));$('toggle-lid').onclick=()=>setLid(targetAngle>1?0:1);
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>setView(b.dataset.view));
$('fit').onclick=fit;$('plus').onclick=()=>{fitGoal=null;camera.position.sub(controls.target).multiplyScalar(.8).add(controls.target);};$('minus').onclick=()=>{fitGoal=null;camera.position.sub(controls.target).multiplyScalar(1.25).add(controls.target);};
$('spin').onclick=()=>{controls.autoRotate=!controls.autoRotate;$('spin').setAttribute('aria-pressed',String(controls.autoRotate));};
$('reset').onclick=()=>{controls.autoRotate=false;$('spin').setAttribute('aria-pressed','false');setLid(0);setView('all');};
renderer.domElement.addEventListener('pointerdown',()=>{fitGoal=null;});renderer.domElement.addEventListener('wheel',()=>{fitGoal=null;},{passive:true});
function resize(){renderer.setSize(host.clientWidth,host.clientHeight);camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();fit();}new ResizeObserver(resize).observe(host);resize();
new GLTFLoader().load('./container.glb',gltf=>{root=gltf.scene;root.traverse(o=>{if(o.userData.lid_pivot)lid=o;});if(!lid)throw Error('Missing lid pivot');scene.add(root);$('loader').hidden=true;document.documentElement.dataset.ready='true';fit();},undefined,error=>{$('loader').textContent='Не удалось загрузить модель. Ниже можно посмотреть ролик';console.error(error);});
let last=performance.now(),lastFitAngle=0;function draw(now){requestAnimationFrame(draw);const dt=Math.min((now-last)/1000,.05);last=now;if(lid){angle=THREE.MathUtils.damp(angle,targetAngle,6,dt);lid.rotation.x=-angle;if(view==='all'&&Math.abs(angle-lastFitAngle)>.04){lastFitAngle=angle;fit();}}if(fitGoal){camera.position.lerp(fitGoal.position,.10);controls.target.lerp(fitGoal.target,.10);if(camera.position.distanceTo(fitGoal.position)<.005)fitGoal=null;}controls.update();renderer.render(scene,camera);}requestAnimationFrame(draw);
