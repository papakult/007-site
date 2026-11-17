'use client';

import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MathUtils, type Group, type OrthographicCamera } from 'three';

type Vector = [number, number, number];

const stone = '#d3c8b6';
const paleStone = '#e7dfd1';
const bronze = '#635443';
const darkGlass = '#293e3d';

function Block({ position, size, color = stone, roughness = 0.8, metalness = 0, glass = false }: {
  position: Vector; size: Vector; color?: string; roughness?: number; metalness?: number; glass?: boolean;
}) {
  return <mesh position={position} castShadow={!glass} receiveShadow>
    <boxGeometry args={size}/>
    {glass ? <meshPhysicalMaterial color={color} roughness={0.12} metalness={0.15} transparent opacity={0.65} depthWrite={false} clearcoat={0.8}/>
      : <meshStandardMaterial color={color} roughness={roughness} metalness={metalness}/>}
  </mesh>;
}

function Tree({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
  return <group position={[x, 0.25, z]} scale={scale}>
    <mesh position={[0, 0.38, 0]} castShadow><cylinderGeometry args={[0.035, 0.05, 0.76, 7]}/><meshStandardMaterial color="#70614c"/></mesh>
    <mesh position={[0, 1.0, 0]} castShadow><icosahedronGeometry args={[0.43, 1]}/><meshStandardMaterial color="#68735b" roughness={1}/></mesh>
    <mesh position={[0.16, 0.86, 0.1]} castShadow><icosahedronGeometry args={[0.3, 1]}/><meshStandardMaterial color="#7a8067" roughness={1}/></mesh>
  </group>;
}

function Plot() {
  return <group>
    <Block position={[0, -0.14, 0]} size={[8.8, 0.28, 6.8]} color="#b5ac9a"/>
    <Block position={[0, 0.025, 0]} size={[8.65, 0.05, 6.65]} color="#c4bda9"/>
    <Block position={[-2.5, 0.08, 2.8]} size={[2.6, 0.1, 0.65]} color="#8a9481"/>
    <Block position={[1.1, 0.065, 2.73]} size={[3.6, 0.07, 1.0]} color="#486965" roughness={0.15} metalness={0.2}/>
    <Block position={[1.1, 0.08, 3.28]} size={[3.8, 0.11, 0.12]} color={paleStone}/>
    <Block position={[1.1, 0.08, 2.18]} size={[3.8, 0.11, 0.12]} color={paleStone}/>
    <Block position={[-0.75, 0.08, 2.73]} size={[0.12, 0.11, 1.0]} color={paleStone}/>
    <Block position={[2.95, 0.08, 2.73]} size={[0.12, 0.11, 1.0]} color={paleStone}/>
    <Block position={[-3.9, 0.06, 0]} size={[0.45, 0.08, 5.8]} color="#7e896f"/>
    <Block position={[3.9, 0.06, -0.5]} size={[0.45, 0.08, 4.8]} color="#7e896f"/>
    <Tree x={-3.9} z={-2.5} scale={0.9}/><Tree x={-3.9} z={-0.7} scale={0.75}/>
    <Tree x={-3.9} z={1.25} scale={0.8}/><Tree x={3.9} z={-2.5} scale={1.05}/>
    <Tree x={3.9} z={-0.6} scale={0.7}/>
    {[0, 1, 2, 3].map(i => <Block key={i} position={[3.48, 0.1, 1.2 + i * 0.48]} size={[0.42, 0.08, 0.32]} color={paleStone}/>)}
  </group>;
}

function GroundFloor() {
  return <group>
    <Block position={[0, 0.25, -0.2]} size={[6.8, 0.3, 4.6]} color={paleStone}/>
    <Block position={[-2.85, 1.35, -0.2]} size={[0.28, 1.9, 4.0]} color={stone}/>
    <Block position={[-0.7, 1.35, -2.08]} size={[4.3, 1.9, 0.24]} color={stone}/>
    <Block position={[2.5, 1.35, -1.75]} size={[0.34, 1.9, 0.34]} color={stone}/>
    <Block position={[2.5, 1.35, 1.55]} size={[0.34, 1.9, 0.34]} color={stone}/>
    <Block position={[-2.65, 1.35, 1.55]} size={[0.28, 1.9, 0.28]} color={stone}/>
    <Block position={[0, 1.35, 1.63]} size={[4.85, 1.87, 0.07]} color={darkGlass} glass/>
    <Block position={[2.56, 1.35, -0.15]} size={[0.07, 1.87, 3.1]} color={darkGlass} glass/>
    {[-2.45, -1.22, 0, 1.22, 2.44].map(x => <Block key={x} position={[x, 1.35, 1.68]} size={[0.045, 1.9, 0.055]} color={bronze} metalness={0.45}/>)}
    {[-1.62, -0.6, 0.45, 1.5].map(z => <Block key={z} position={[2.6, 1.35, z]} size={[0.055, 1.9, 0.045]} color={bronze} metalness={0.45}/>)}
    <Block position={[0, 0.43, 1.65]} size={[5.0, 0.06, 0.09]} color={bronze}/>
    <Block position={[0, 2.27, 1.65]} size={[5.0, 0.06, 0.09]} color={bronze}/>
    <Block position={[-1.4, 0.71, -0.25]} size={[1.8, 0.45, 0.68]} color="#b8a48c"/>
    <Block position={[-0.55, 0.55, 0.65]} size={[1.1, 0.23, 0.55]} color="#8f7860"/>
    <Block position={[1.45, 0.85, -1.0]} size={[1.35, 0.09, 0.8]} color="#9c8469"/>
    <Block position={[1.45, 0.62, -1.0]} size={[0.1, 0.45, 0.1]} color={bronze}/>
  </group>;
}

function UpperFloor() {
  return <group>
    <Block position={[0.12, 2.42, -0.2]} size={[7.0, 0.28, 4.7]} color={paleStone}/>
    <Block position={[0.55, 3.36, -1.75]} size={[4.9, 1.6, 0.23]} color={stone}/>
    <Block position={[-1.8, 3.36, -0.35]} size={[0.28, 1.6, 2.6]} color={stone}/>
    <Block position={[2.85, 3.36, -0.35]} size={[0.25, 1.6, 2.6]} color={stone}/>
    <Block position={[0.55, 3.36, 0.93]} size={[4.4, 1.57, 0.07]} color={darkGlass} glass/>
    {[-1.6, -0.5, 0.6, 1.7, 2.72].map(x => <Block key={x} position={[x, 3.36, 0.98]} size={[0.045, 1.6, 0.06]} color={bronze} metalness={0.45}/>)}
    <Block position={[0.55, 2.6, 0.98]} size={[4.45, 0.06, 0.09]} color={bronze}/>
    <Block position={[0.55, 4.12, 0.98]} size={[4.45, 0.06, 0.09]} color={bronze}/>
    <Block position={[0.15, 2.95, 1.95]} size={[6.65, 0.7, 0.04]} color="#65716b" glass/>
    <Block position={[0.15, 3.31, 1.95]} size={[6.7, 0.035, 0.04]} color={bronze}/>
    <Block position={[-3.18, 2.95, -0.15]} size={[0.04, 0.7, 4.2]} color="#65716b" glass/>
    <Block position={[-3.18, 3.31, -0.15]} size={[0.04, 0.035, 4.2]} color={bronze}/>
    <Block position={[-2.48, 2.7, -1.15]} size={[0.68, 0.25, 1.15]} color="#9c8e77"/>
    {Array.from({ length: 7 }, (_, i) => <Block key={i} position={[2.98, 3.39, -1.5 + i * 0.4]} size={[0.08, 1.65, 0.08]} color={bronze}/>)}
  </group>;
}

function Roof() {
  return <group>
    <Block position={[0.52, 4.28, -0.34]} size={[5.35, 0.24, 3.4]} color={paleStone}/>
    <Block position={[0.5, 4.415, -0.35]} size={[4.95, 0.03, 3.0]} color="#8d897d"/>
    <Block position={[0.55, 4.29, 1.38]} size={[5.45, 0.1, 0.04]} color={bronze} metalness={0.3}/>
    {Array.from({ length: 8 }, (_, i) => <Block key={i} position={[-2.83 + i * 0.16, 4.27, -0.35]} size={[0.07, 0.12, 3.35]} color={bronze}/>)}
  </group>;
}

function Villa() {
  const floor = useRef<Group>(null);
  const upper = useRef<Group>(null);
  const roof = useRef<Group>(null);
  const progress = useRef(0);
  const target = useRef(0);
  const reduced = useRef(false);

  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => { reduced.current = query.matches; };
    updateMotion();
    const updateScroll = () => {
      const section = document.getElementById('assembly');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      target.current = MathUtils.clamp(-rect.top / Math.max(rect.height - innerHeight, 300), 0, 1);
    };
    updateScroll();
    addEventListener('scroll', updateScroll, { passive: true });
    addEventListener('resize', updateScroll);
    query.addEventListener('change', updateMotion);
    return () => {
      removeEventListener('scroll', updateScroll);
      removeEventListener('resize', updateScroll);
      query.removeEventListener('change', updateMotion);
    };
  }, []);

  useFrame((state, delta) => {
    const orthographic = state.camera as OrthographicCamera;
    const zoom = Math.min(state.size.width / 11.1, state.size.height / 8.3);
    if (orthographic.zoom !== zoom) {
      orthographic.zoom = zoom;
      orthographic.updateProjectionMatrix();
    }
    progress.current = reduced.current ? 1 : MathUtils.damp(progress.current, target.current, 4.5, delta);
    const p = progress.current;
    const phase = (start: number, end: number) => MathUtils.smoothstep(p, start, end);
    if (floor.current) floor.current.position.y = (1 - phase(0, 0.36)) * 0.65;
    if (upper.current) upper.current.position.y = (1 - phase(0.22, 0.72)) * 1.5;
    if (roof.current) roof.current.position.y = (1 - phase(0.58, 1)) * 2.0;
    const angle = reduced.current ? 0.72 : 0.72 + Math.sin(state.clock.elapsedTime * 0.1) * 0.035;
    state.camera.position.set(Math.sin(angle) * 14, 9.4, Math.cos(angle) * 14);
    state.camera.lookAt(0, 2.45, 0);
  });

  return <>
    <ambientLight intensity={1.1}/>
    <hemisphereLight args={['#f5ead7', '#6c756c', 1.1]}/>
    <directionalLight position={[-5, 10, 6]} intensity={3} color="#fff2dc" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={10} shadow-camera-bottom={-8} shadow-normalBias={0.035} shadow-bias={-0.0002}/>
    <directionalLight position={[6, 5, -4]} intensity={1.2} color="#d5e4e1"/>
    <group position={[0, -0.2, 0]}>
      <Plot/>
      <group ref={floor}><GroundFloor/></group>
      <group ref={upper}><UpperFloor/></group>
      <group ref={roof}><Roof/></group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]} receiveShadow><planeGeometry args={[50, 50]}/><shadowMaterial opacity={0.15}/></mesh>
    </group>
  </>;
}

function StaticVilla() {
  return <svg viewBox="0 0 680 520" role="img" aria-label="Архитектурная схема современного двухэтажного дома" style={{ width: '100%', height: '100%' }}>
    <g stroke="#877a68" strokeWidth="1.2" strokeLinejoin="round">
      <path d="M70 365 350 230 625 355 345 495Z" fill="#c5bdad"/>
      <path d="M125 340 355 230 560 323 330 433Z" fill="#e1d8c9"/>
      <path d="M140 242 330 330 330 416 140 330Z" fill="#cec3b0"/>
      <path d="M330 330 545 228 545 313 330 416Z" fill="#4e625d"/>
      <path d="M118 230 348 120 566 219 336 329Z" fill="#e8e1d3"/>
      <path d="M118 230 336 329 336 342 118 243Z" fill="#b9ad99"/>
      <path d="M336 329 566 219 566 232 336 342Z" fill="#d1c5b1"/>
      <path d="M225 158 360 220 360 299 225 237Z" fill="#c9bca6"/>
      <path d="M360 220 535 137 535 215 360 299Z" fill="#4e625d"/>
      <path d="M208 148 386 63 552 138 374 223Z" fill="#e7dfcf"/>
      <path d="M208 148 374 223 374 235 208 160Z" fill="#b8aa94"/>
      <path d="M374 223 552 138 552 150 374 235Z" fill="#c8baa3"/>
      <path d="M395 204V282M435 185V263M476 166V244M371 310V396M414 289V374M457 269V354M501 248V334" fill="none" stroke="#b4a188"/>
      <path d="M401 406 515 351 569 375 455 431Z" fill="#7c9990"/>
    </g>
  </svg>;
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <StaticVilla/> : this.props.children; }
}

export default function HouseScene() {
  const host = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => setActive(entries.some(entry => entry.isIntersecting)));
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={host} role="img" aria-label="Трёхмерная модель: фундамент, этажи и крыша дома собираются при прокрутке" style={{ width: '100%', height: '100%' }}>
    <SceneBoundary>
      <Canvas frameloop={active ? 'always' : 'never'} orthographic camera={{ position: [9, 6, 10], zoom: 52, near: 0.1, far: 100 }} dpr={[1, 1.5]} shadows gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }} fallback={<StaticVilla/>} style={{ pointerEvents: 'none' }}>
        <Villa/>
      </Canvas>
    </SceneBoundary>
  </div>;
}
