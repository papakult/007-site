import * as THREE from 'three';
import FOG from 'vanta/dist/vanta.fog.min.js';
import NET from 'vanta/dist/vanta.net.min.js';
import WAVES from 'vanta/dist/vanta.waves.min.js';

const themes = {
  fog: [FOG, { highlightColor:0xe6a361, midtoneColor:0x954046, lowlightColor:0x5f2635, baseColor:0x9b6559, speed:1.05, zoom:.95, blurFactor:.55 }],
  net: [NET, { backgroundColor:0x30202b, color:0xd08b77, points:8, maxDistance:22, spacing:17, showDots:true }],
  waves: [WAVES, { color:0x75323d, shininess:38, waveHeight:16, waveSpeed:.73, zoom:.82 }]
};

export function lightSurface(el) {
  const [create, settings] = themes[el.dataset.light];
  const lighting = create({el, THREE, mouseControls:true, touchControls:false, gyroControls:false,
    minWidth:40, minHeight:40, scale:1.45, scaleMobile:2.5, ...settings});
  if (!lighting.renderer?.domElement?.isConnected) return;
  el.dataset.rendered = el.dataset.light;
  return () => {
    const renderer = lighting.renderer;
    lighting.destroy();
    renderer?.dispose();
    renderer?.forceContextLoss();
    delete el.dataset.rendered;
  };
}
