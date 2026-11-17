'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Component, useEffect, useMemo, useRef, type ReactNode, type RefObject } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export type SceneMotion = { progress: number; reduced: boolean };

function petalGeometry() {
  const positions: number[] = [], indices: number[] = [], uvs: number[] = [];
  const rows = 42, columns = 84;
  for (let j = 0; j <= rows; j++) {
    const v = j / rows;
    for (let i = 0; i <= columns; i++) {
      const u = i / columns;
      const theta = u * Math.PI * 1.96 - Math.PI * .97;
      const spread = .035 + .49 * Math.pow(v, 1.4);
      const high = .5 + .5 * Math.cos(theta);
      const curl = .075 * Math.pow(v, 8);
      const x = Math.sin(theta) * (spread + curl);
      const y = v * (.5 + .67 * high) - .09 * Math.pow(v, 4) * (1 - high);
      const z = Math.cos(theta) * spread * .69 + .18 * v * v;
      positions.push(x, y, z);
      uvs.push(u, v);
      if (i < columns && j < rows) {
        const a = j * (columns + 1) + i, b = a + columns + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices); geometry.computeVertexNormals();
  return geometry;
}

function Calla({ position, rotation, scale = 1, stemBase }: { position: [number, number, number]; rotation: [number, number, number]; scale?: number; stemBase: [number, number, number] }) {
  const petal = useMemo(() => petalGeometry(), []);
  const stem = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
    new THREE.Vector3(...stemBase),
    new THREE.Vector3((position[0] + stemBase[0]) * .5 + .1, (position[1] + stemBase[1]) * .5, position[2] - .09),
    new THREE.Vector3(...position),
  ]), 32, .023, 8, false), [position, stemBase]);
  useEffect(() => () => { petal.dispose(); stem.dispose(); }, [petal, stem]);
  return <group>
    <mesh geometry={stem} castShadow><meshStandardMaterial color="#52634c" roughness={.49} /></mesh>
    <group position={position} rotation={rotation} scale={scale}>
      <mesh geometry={petal} castShadow receiveShadow><meshPhysicalMaterial color="#f5efde" side={THREE.DoubleSide} roughness={.46} metalness={0} sheen={.7} sheenColor="#ffffff" sheenRoughness={.4} /></mesh>
      <mesh position={[0, .28, .025]} rotation={[.1, 0, -.08]} castShadow><capsuleGeometry args={[.038, .38, 6, 16]} /><meshStandardMaterial color="#d5b664" roughness={.82} /></mesh>
    </group>
  </group>;
}

function Leaf({ position, rotation, scale }: { position: [number, number, number]; rotation: [number, number, number]; scale: number }) {
  const geo = useMemo(() => {
    const p: number[] = [], ids: number[] = [];
    for (let i = 0; i <= 32; i++) {
      const t = i / 32, w = Math.sin(Math.PI * t) * .22;
      p.push(-w, t * 1.6, Math.sin(t * Math.PI) * .18, 0, t * 1.6, Math.sin(t * Math.PI) * .22, w, t * 1.6, Math.sin(t * Math.PI) * .18);
      if (i < 32) { const a = i * 3; ids.push(a, a+3, a+1, a+1, a+3, a+4, a+1, a+4, a+2, a+2, a+4, a+5); }
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p,3)); g.setIndex(ids); g.computeVertexNormals(); return g;
  }, []);
  useEffect(() => () => geo.dispose(), [geo]);
  return <mesh position={position} rotation={rotation} scale={scale} geometry={geo} castShadow><meshPhysicalMaterial color="#2b3c2c" roughness={.38} side={THREE.DoubleSide} /></mesh>;
}

function Candle({ motion }: { motion: RefObject<SceneMotion> }) {
  const flame = useRef<THREE.Mesh>(null), light = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (motion.current.reduced) return;
    const t = clock.elapsedTime;
    if (flame.current) { flame.current.scale.y = 1 + Math.sin(t * 2.8) * .045; flame.current.rotation.z = Math.sin(t * 2) * .025; }
    if (light.current) light.current.intensity = 3 + Math.sin(t * 2.8) * .12;
  });
  return <group position={[-.68, -.91, .58]}>
    <mesh position={[0, .035, 0]} receiveShadow><cylinderGeometry args={[.37,.39,.07,64]}/><meshStandardMaterial color="#5b4933" metalness={.78} roughness={.29}/></mesh>
    <mesh position={[0, .075, 0]} rotation={[-Math.PI/2,0,0]}><torusGeometry args={[.348,.018,10,64]}/><meshStandardMaterial color="#a88a56" metalness={.8} roughness={.28}/></mesh>
    <mesh position={[0,.54,0]} castShadow receiveShadow><cylinderGeometry args={[.24,.255,.91,64]}/><meshPhysicalMaterial color="#e4cfab" roughness={.66} transmission={.06}/></mesh>
    <mesh position={[0,1.002,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.045,.237,64]}/><meshStandardMaterial color="#f3e0b8" roughness={.47} side={THREE.DoubleSide}/></mesh>
    <mesh position={[0,1.004,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.045,32]}/><meshStandardMaterial color="#6e5132"/></mesh>
    <mesh position={[0,1.03,0]}><cylinderGeometry args={[.006,.009,.06,8]}/><meshStandardMaterial color="#2b2017"/></mesh>
    <mesh ref={flame} position={[0,1.14,0]} scale={[.052,.145,.047]}><sphereGeometry args={[1,20,24]}/><meshBasicMaterial color="#fff0c8" toneMapped={false}/></mesh>
    <mesh position={[0,1.10,.001]} scale={[.032,.065,.03]}><sphereGeometry args={[1,16,16]}/><meshBasicMaterial color="#ffffff" toneMapped={false}/></mesh>
    <pointLight ref={light} position={[0,1.18,0]} color="#ffb15e" intensity={3} distance={4} decay={2}/>
  </group>;
}

function Arrangement({ motion }: { motion: RefObject<SceneMotion> }) {
  const group = useRef<THREE.Group>(null);
  const get = useThree(state => state.get);
  useEffect(() => {
    const { gl, scene } = get();
    const generator = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment(); const env = generator.fromScene(room, .04, .1, 20);
    scene.environment = env.texture; scene.environmentIntensity = .18;
    room.dispose(); generator.dispose();
    return () => { scene.environment = null; env.dispose(); };
  }, [get]);
  useFrame(({ clock, camera, size }, delta) => {
    const p = motion.current.progress, reduced = motion.current.reduced;
    const idle = reduced ? 0 : Math.sin(clock.elapsedTime * .15) * .027;
    if (group.current) { group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, -.13 + p * .44 + idle, 2, delta); group.current.position.y = -p * .2; }
    const narrow = size.width < 700;
    camera.position.z = THREE.MathUtils.damp(camera.position.z, (narrow ? 6.8 : 6.5) - p * .6, 2, delta);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, p * .22 + idle, 2, delta);
    camera.lookAt(0, .3 + p * .13, 0);
  });
  return <>
    <ambientLight intensity={.48} color="#b5c4cd"/>
    <directionalLight position={[-3,5,4]} intensity={2.5} color="#f8f1e3" castShadow shadow-mapSize={[1024,1024]} shadow-bias={-.001} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4}/>
    <spotLight position={[3,4,-2]} intensity={28} color="#e6d5b4" angle={.7} penumbra={1}/>
    <pointLight position={[-2,1,2]} intensity={2} color="#9bafc7" distance={8}/>
    <group ref={group}>
      <mesh position={[0,-1.02,0]} receiveShadow castShadow><cylinderGeometry args={[1.48,1.52,.22,96]}/><meshStandardMaterial color="#272a28" metalness={.1} roughness={.65}/></mesh>
      <mesh position={[0,-1.17,0]}><cylinderGeometry args={[1.4,1.4,.08,96]}/><meshStandardMaterial color="#4d473b" metalness={.35} roughness={.6}/></mesh>
      <mesh position={[.54,-.45,-.18]} receiveShadow castShadow><cylinderGeometry args={[.28,.36,.9,64]}/><meshStandardMaterial color="#282e2b" metalness={.65} roughness={.32}/></mesh>
      <Calla position={[.58,1.06,-.15]} rotation={[.1,.15,-.11]} scale={1.0} stemBase={[.54,-.5,-.2]}/>
      <Calla position={[-.05,.65,-.18]} rotation={[.14,-.38,.37]} scale={.88} stemBase={[.51,-.58,-.2]}/>
      <Calla position={[1.09,.46,-.06]} rotation={[-.1,.5,-.32]} scale={.8} stemBase={[.6,-.58,-.18]}/>
      <Leaf position={[.5,-.73,-.24]} rotation={[.1,-.6,.51]} scale={.93}/>
      <Leaf position={[.6,-.72,-.25]} rotation={[-.2,.9,-.67]} scale={.86}/>
      <Leaf position={[.53,-.7,-.22]} rotation={[.1,1.5,-.15]} scale={1.02}/>
      <Candle motion={motion}/>
    </group>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-1.22,0]} receiveShadow><planeGeometry args={[200,200]}/><shadowMaterial transparent opacity={.2}/></mesh>
  </>;
}

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function Scene({ motion, active, onReady, onFailure }: { motion: RefObject<SceneMotion>; active: boolean; onReady: () => void; onFailure: () => void }) {
  return <SceneBoundary onFailure={onFailure}><Canvas aria-hidden="true" dpr={[1,1.5]} shadows camera={{ position:[0,.7,6.5], fov:38 }} frameloop={active ? 'always' : 'never'} gl={{ antialias:true, alpha:true, powerPreference:'low-power' }} fallback={null} onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.05; gl.domElement.addEventListener('webglcontextlost', onFailure); gl.domElement.addEventListener('webglcontextrestored', onReady); onReady(); }}><Arrangement motion={motion}/></Canvas></SceneBoundary>;
}
