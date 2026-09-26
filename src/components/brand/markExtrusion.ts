import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";

/** Extrude a path from the original 400-unit mark grid, centered on the origin. */
export function extrudeMarkPath(path: string, depth: number, bevel: number) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg"><path d="${path}"/></svg>`;
  const shapes = SVGLoader.createShapes(new SVGLoader().parse(svg).paths[0]);
  const geometry = new THREE.ExtrudeGeometry(shapes, {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 2,
    steps: 1,
  });
  geometry.scale(1, -1, 1);
  geometry.translate(-200, 200, -depth / 2);
  return geometry;
}
