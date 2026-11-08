import { ExtrudeGeometry, Path, Shape } from './engine.js';

export const outerDiameter = 160;
export const centerDiameter = 60;
export const boltCircleDiameter = 120;

const centers = [[0, 0], [60, 0], [0, 60], [-60, 0], [0, -60]];

function circle(path, x, y, radius, clockwise) {
  path.absarc(x, y, radius, 0, Math.PI * 2, clockwise);
  return path;
}

export function makeFlange(thickness, holeDiameter) {
  const outerRadius = outerDiameter / 2;
  const outline = circle(new Shape(), 0, 0, outerRadius, false);
  const holes = centers.map(([x, y], index) => ({
    x, y, radius: (index === 0 ? centerDiameter : holeDiameter) / 2,
  }));
  outline.holes = holes.map(({ x, y, radius }) => circle(new Path(), x, y, radius, true));

  const geometry = new ExtrudeGeometry(outline, {
    depth: thickness, steps: 1, curveSegments: 48, bevelEnabled: false,
  });
  const side = geometry.groups[1];
  const positions = geometry.attributes.position;
  const normals = geometry.attributes.normal;
  // Cap normals stay flat. Each cylindrical wall gets a radial normal for smooth lighting.
  for (let i = side.start; i < side.start + side.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const hole = holes.find(({ x: cx, y: cy, radius }) =>
      Math.abs(Math.hypot(x - cx, y - cy) - radius) < 0.001);
    const nx = hole ? (hole.x - x) / hole.radius : x / outerRadius;
    const ny = hole ? (hole.y - y) / hole.radius : y / outerRadius;
    normals.setXYZ(i, nx, ny, 0);
  }

  geometry.translate(0, 0, -thickness / 2);
  geometry.rotateX(-Math.PI / 2);
  geometry.scale(1 / outerRadius, 1 / outerRadius, 1 / outerRadius);
  geometry.computeBoundingBox();
  return geometry;
}
