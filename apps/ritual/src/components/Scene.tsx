'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Component, useEffect, useMemo, useRef, type ReactNode } from 'react';
import * as THREE from 'three';
import type { SceneProps } from './sceneMotion';
import { isSoftwareRenderer } from './webglProbe';

const PETAL_ROWS = 30;
const PETAL_COLUMNS = 52;

function petalGeometry() {
  const positions: number[] = [], indices: number[] = [], uvs: number[] = [];
  for (let j = 0; j <= PETAL_ROWS; j++) {
    const v = j / PETAL_ROWS;
    for (let i = 0; i <= PETAL_COLUMNS; i++) {
      const u = i / PETAL_COLUMNS;
      const theta = u * Math.PI * 1.96 - Math.PI * .97;
      const spread = .035 + .49 * Math.pow(v, 1.4);
      const high = .5 + .5 * Math.cos(theta);
      const curl = .075 * Math.pow(v, 8);
      const x = Math.sin(theta) * (spread + curl);
      const y = v * (.5 + .67 * high) - .09 * Math.pow(v, 4) * (1 - high);
      const z = Math.cos(theta) * spread * .69 + .18 * v * v;
      positions.push(x, y, z);
      uvs.push(u, v);
      if (i < PETAL_COLUMNS && j < PETAL_ROWS) {
        const a = j * (PETAL_COLUMNS + 1) + i, b = a + PETAL_COLUMNS + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function leafGeometry() {
  const positions: number[] = [], indices: number[] = [];
  const steps = 18;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const w = Math.sin(Math.PI * t) * .22;
    const arch = Math.sin(t * Math.PI);
    const y = t * 1.6;
    positions.push(-w, y, arch * .18, 0, y, arch * .22, w, y, arch * .18);
    if (i < steps) {
      const a = i * 3;
      indices.push(a, a + 3, a + 1, a + 1, a + 3, a + 4, a + 1, a + 4, a + 2, a + 2, a + 4, a + 5);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function Calla({ petal, position, rotation, scale = 1, stemBase }: { petal: THREE.BufferGeometry; position: [number, number, number]; rotation: [number, number, number]; scale?: number; stemBase: [number, number, number] }) {
  const [x, y, z] = position;
  const [bx, by, bz] = stemBase;
  const stem = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
    new THREE.Vector3(bx, by, bz),
    new THREE.Vector3((x + bx) * .5 + .1, (y + by) * .5, z - .09),
    new THREE.Vector3(x, y, z),
  ]), 16, .023, 6, false), [x, y, z, bx, by, bz]);
  useEffect(() => () => { stem.dispose(); }, [stem]);
  return <group>
    <mesh geometry={stem}><meshStandardMaterial color="#52634c" roughness={.55} /></mesh>
    <group position={position} rotation={rotation} scale={scale}>
      <mesh geometry={petal} castShadow receiveShadow><meshStandardMaterial color="#f5efde" side={THREE.DoubleSide} roughness={.5} metalness={0} /></mesh>
      <mesh position={[0, .28, .025]} rotation={[.1, 0, -.08]}><capsuleGeometry args={[.038, .38, 4, 8]} /><meshStandardMaterial color="#d5b664" roughness={.82} /></mesh>
    </group>
  </group>;
}

function Leaf({ geometry, position, rotation, scale }: { geometry: THREE.BufferGeometry; position: [number, number, number]; rotation: [number, number, number]; scale: number }) {
  return <mesh position={position} rotation={rotation} scale={scale} geometry={geometry}><meshStandardMaterial color="#2b3c2c" roughness={.42} side={THREE.DoubleSide} /></mesh>;
}

function Candle({ motion }: { motion: SceneProps['motion'] }) {
  const flame = useRef<THREE.Mesh>(null), light = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (motion.current.reduced) return;
    const t = clock.elapsedTime;
    if (flame.current) { flame.current.scale.y = 1 + Math.sin(t * 2.8) * .045; flame.current.rotation.z = Math.sin(t * 2) * .025; }
    if (light.current) light.current.intensity = 3 + Math.sin(t * 2.8) * .12;
  });
  return <group position={[-.68, -.91, .58]}>
    <mesh position={[0, .035, 0]} receiveShadow><cylinderGeometry args={[.37, .39, .07, 28]} /><meshStandardMaterial color="#5b4933" metalness={.35} roughness={.4} /></mesh>
    <mesh position={[0, .075, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[.348, .018, 8, 28]} /><meshStandardMaterial color="#a88a56" metalness={.4} roughness={.35} /></mesh>
    <mesh position={[0, .54, 0]} castShadow receiveShadow><cylinderGeometry args={[.24, .255, .91, 32]} /><meshStandardMaterial color="#e4cfab" roughness={.66} /></mesh>
    <mesh position={[0, 1.002, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[.045, .237, 28]} /><meshStandardMaterial color="#f3e0b8" roughness={.47} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 1.004, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[.045, 16]} /><meshStandardMaterial color="#6e5132" /></mesh>
    <mesh position={[0, 1.03, 0]}><cylinderGeometry args={[.006, .009, .06, 8]} /><meshStandardMaterial color="#2b2017" /></mesh>
    <mesh ref={flame} position={[0, 1.14, 0]} scale={[.052, .145, .047]}><sphereGeometry args={[1, 12, 14]} /><meshBasicMaterial color="#fff0c8" toneMapped={false} /></mesh>
    <mesh position={[0, 1.10, .001]} scale={[.032, .065, .03]}><sphereGeometry args={[1, 8, 10]} /><meshBasicMaterial color="#ffffff" toneMapped={false} /></mesh>
    <pointLight ref={light} position={[0, 1.18, 0]} color="#ffb15e" intensity={3} distance={4} decay={2} />
  </group>;
}

function FrameProof({ onReady, onFailure }: { onReady: () => void; onFailure: () => void }) {
  const gl = useThree((state) => state.gl);
  const samples = useRef<number[]>([]);
  const last = useRef<number | null>(null);
  const settled = useRef(false);
  const software = useRef<boolean | null>(null);
  useFrame((state) => {
    if (settled.current) return;
    if (software.current == null) software.current = isSoftwareRenderer(gl.getContext());
    const halt = () => {
      settled.current = true;
      state.set({ frameloop: 'never' });
      onFailure();
    };
    if (software.current) { halt(); return; }
    const now = performance.now();
    if (last.current == null || document.hidden) { last.current = now; return; }
    const ms = now - last.current;
    last.current = now;
    if (ms > 1000) return;
    samples.current.push(ms);
    const recorded = samples.current;
    if (recorded.length >= 5 && recorded.slice(-5).every((sample) => sample > 100)) { halt(); return; }
    if (recorded.length < 10) return;
    settled.current = true;
    const fastest = [...recorded].sort((a, b) => a - b).slice(0, 6);
    const median = fastest[Math.floor(fastest.length / 2)] ?? 100;
    if (median > 46) halt();
    else onReady();
  });
  return null;
}

function Arrangement({ motion }: { motion: SceneProps['motion'] }) {
  const group = useRef<THREE.Group>(null);
  const petal = useMemo(() => petalGeometry(), []);
  const leaf = useMemo(() => leafGeometry(), []);
  useEffect(() => () => { petal.dispose(); leaf.dispose(); }, [petal, leaf]);
  useFrame(({ clock, camera, size }, delta) => {
    const p = motion.current.progress, reduced = motion.current.reduced;
    const idle = reduced ? 0 : Math.sin(clock.elapsedTime * .15) * .027;
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, -.13 + p * .44 + idle, 2, delta);
      group.current.position.y = -p * .2;
    }
    const narrow = size.width < 700;
    camera.position.z = THREE.MathUtils.damp(camera.position.z, (narrow ? 6.8 : 6.5) - p * .6, 2, delta);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, p * .22 + idle, 2, delta);
    camera.lookAt(0, .3 + p * .13, 0);
  });
  return <>
    <ambientLight intensity={.55} color="#b5c4cd" />
    <directionalLight position={[-3, 5, 4]} intensity={2.5} color="#f8f1e3" castShadow shadow-mapSize={[512, 512]} shadow-bias={-.001} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} />
    <spotLight position={[3, 4, -2]} intensity={28} color="#e6d5b4" angle={.7} penumbra={1} />
    <pointLight position={[-2, 1, 2]} intensity={2} color="#9bafc7" distance={8} />
    <group ref={group}>
      <mesh position={[0, -1.02, 0]} receiveShadow castShadow><cylinderGeometry args={[1.48, 1.52, .22, 64]} /><meshStandardMaterial color="#272a28" metalness={.15} roughness={.7} /></mesh>
      <mesh position={[0, -1.17, 0]}><cylinderGeometry args={[1.4, 1.4, .08, 48]} /><meshStandardMaterial color="#4d473b" metalness={.2} roughness={.65} /></mesh>
      <mesh position={[.54, -.45, -.18]} receiveShadow castShadow><cylinderGeometry args={[.28, .36, .9, 32]} /><meshStandardMaterial color="#282e2b" metalness={.25} roughness={.45} /></mesh>
      <Calla petal={petal} position={[.58, 1.06, -.15]} rotation={[.1, .15, -.11]} scale={1} stemBase={[.54, -.5, -.2]} />
      <Calla petal={petal} position={[-.05, .65, -.18]} rotation={[.14, -.38, .37]} scale={.88} stemBase={[.51, -.58, -.2]} />
      <Calla petal={petal} position={[1.09, .46, -.06]} rotation={[-.1, .5, -.32]} scale={.8} stemBase={[.6, -.58, -.18]} />
      <Leaf geometry={leaf} position={[.5, -.73, -.24]} rotation={[.1, -.6, .51]} scale={.93} />
      <Leaf geometry={leaf} position={[.6, -.72, -.25]} rotation={[-.2, .9, -.67]} scale={.86} />
      <Leaf geometry={leaf} position={[.53, -.7, -.22]} rotation={[.1, 1.5, -.15]} scale={1.02} />
      <Candle motion={motion} />
    </group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.22, 0]} receiveShadow><planeGeometry args={[200, 200]} /><shadowMaterial transparent opacity={.2} /></mesh>
  </>;
}

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function Scene({ motion, active, onReady, onFailure }: SceneProps) {
  const settled = useRef(false);
  function fail() {
    if (settled.current) return;
    settled.current = true;
    onFailure();
  }
  function ready() {
    if (settled.current) return;
    settled.current = true;
    onReady();
  }
  return <SceneBoundary onFailure={fail}>
    <Canvas aria-hidden="true" dpr={[1, 1.5]} shadows camera={{ position: [0, .7, 6.5], fov: 38 }} frameloop={active ? 'always' : 'never'} gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }} fallback={null} onCreated={({ gl, set }) => {
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 1.05;
      gl.domElement.addEventListener('webglcontextlost', (event) => { event.preventDefault(); set({ frameloop: 'never' }); fail(); });
      if (isSoftwareRenderer(gl.getContext())) { set({ frameloop: 'never' }); fail(); }
    }}>
      <FrameProof onReady={ready} onFailure={fail} />
      <Arrangement motion={motion} />
    </Canvas>
  </SceneBoundary>;
}
