import * as THREE from "three";

/** Three small, deterministic maps shared by all three meshes; no network asset. */
export function createHeroSurface() {
  const size = 256;
  const colorCanvas = document.createElement("canvas");
  const roughCanvas = document.createElement("canvas");
  const bumpCanvas = document.createElement("canvas");
  colorCanvas.width = roughCanvas.width = bumpCanvas.width = size;
  colorCanvas.height = roughCanvas.height = bumpCanvas.height = size;
  const colorContext = colorCanvas.getContext("2d")!;
  const roughContext = roughCanvas.getContext("2d")!;
  const bumpContext = bumpCanvas.getContext("2d")!;
  const color = colorContext.createImageData(size, size);
  const rough = roughContext.createImageData(size, size);
  const bump = bumpContext.createImageData(size, size);
  let seed = 8273;
  const random = () => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const hash = (x: number, y: number) => {
    let value = Math.imul(x, 374761393) + Math.imul(y, 668265263);
    value = Math.imul(value ^ (value >>> 13), 1274126177);
    return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
  };
  const noise = (x: number, y: number) => {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;
    const sx = fx * fx * (3 - 2 * fx);
    const sy = fy * fy * (3 - 2 * fy);
    const top = hash(ix, iy) * (1 - sx) + hash(ix + 1, iy) * sx;
    const bottom = hash(ix, iy + 1) * (1 - sx) + hash(ix + 1, iy + 1) * sx;
    return top * (1 - sy) + bottom * sy;
  };

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const wash = noise(x / 31, y / 31) - 0.5;
      const tone = Math.round(244 + wash * 14 + (random() - 0.5) * 9);
      color.data[i] = tone;
      color.data[i + 1] = tone - 2;
      color.data[i + 2] = tone - 7;
      color.data[i + 3] = 255;
      const roughness = Math.round(227 + (noise(x / 19 + 11, y / 19 + 7) - 0.5) * 30 + (random() - 0.5) * 16);
      rough.data[i] = rough.data[i + 1] = rough.data[i + 2] = roughness;
      rough.data[i + 3] = 255;
      const height = Math.round(128 + (noise(x / 7 + 23, y / 7 + 17) - 0.5) * 48 + (random() - 0.5) * 10);
      bump.data[i] = bump.data[i + 1] = bump.data[i + 2] = height;
      bump.data[i + 3] = 255;
    }
  }
  colorContext.putImageData(color, 0, 0);
  roughContext.putImageData(rough, 0, 0);
  bumpContext.putImageData(bump, 0, 0);
  const map = new THREE.CanvasTexture(colorCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  return { map, roughnessMap, bumpMap };
}
