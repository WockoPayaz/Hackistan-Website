import * as THREE from "three";

/** Small non-repeating maps, sampled in the logo's shared 400-unit UV space. */
export function createHeroSurface() {
  const size = 256;
  const colorCanvas = document.createElement("canvas");
  const roughCanvas = document.createElement("canvas");
  colorCanvas.width = roughCanvas.width = size;
  colorCanvas.height = roughCanvas.height = size;
  const colorContext = colorCanvas.getContext("2d")!;
  const roughContext = roughCanvas.getContext("2d")!;
  const color = colorContext.createImageData(size, size);
  const rough = roughContext.createImageData(size, size);
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
      const grain = noise(x / 5 + 13, y / 5 + 29) - 0.5;
      const tone = Math.round(239 + wash * 26 + grain * 7 + (random() - 0.5) * 3);
      color.data[i] = tone;
      color.data[i + 1] = tone - 2;
      color.data[i + 2] = tone - 7;
      color.data[i + 3] = 255;
      const roughness = Math.round(226 + (noise(x / 19 + 11, y / 19 + 7) - 0.5) * 46 + grain * 12);
      rough.data[i] = rough.data[i + 1] = rough.data[i + 2] = roughness;
      rough.data[i + 3] = 255;
    }
  }
  colorContext.putImageData(color, 0, 0);
  roughContext.putImageData(rough, 0, 0);

  // Smooth cast relief at two scales. Derive normals from one height field so
  // highlights change with rotation without granular random pixel speckles.
  const normalSize = 512;
  const normalCanvas = document.createElement("canvas");
  normalCanvas.width = normalCanvas.height = normalSize;
  const normalContext = normalCanvas.getContext("2d")!;
  const normal = normalContext.createImageData(normalSize, normalSize);
  const heights = new Float32Array(normalSize * normalSize);
  for (let y = 0; y < normalSize; y++) {
    for (let x = 0; x < normalSize; x++) {
      heights[y * normalSize + x] =
        (noise(x / 20 + 7, y / 20 + 13) - 0.5) * 1.1 +
        (noise(x / 4.5 + 41, y / 4.5 + 19) - 0.5) * 0.42;
    }
  }
  for (let y = 0; y < normalSize; y++) {
    for (let x = 0; x < normalSize; x++) {
      const i = (y * normalSize + x) * 4;
      const left = heights[y * normalSize + Math.max(0, x - 1)];
      const right = heights[y * normalSize + Math.min(normalSize - 1, x + 1)];
      const above = heights[Math.max(0, y - 1) * normalSize + x];
      const below = heights[Math.min(normalSize - 1, y + 1) * normalSize + x];
      // CanvasTexture flips Y on upload; the positive Y derivative compensates.
      const nx = (left - right) * 3;
      const ny = (below - above) * 3;
      const length = Math.hypot(nx, ny, 1);
      normal.data[i] = Math.round((nx / length * 0.5 + 0.5) * 255);
      normal.data[i + 1] = Math.round((ny / length * 0.5 + 0.5) * 255);
      normal.data[i + 2] = Math.round((1 / length * 0.5 + 0.5) * 255);
      normal.data[i + 3] = 255;
    }
  }
  normalContext.putImageData(normal, 0, 0);
  const map = new THREE.CanvasTexture(colorCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  const normalMap = new THREE.CanvasTexture(normalCanvas);
  return { map, roughnessMap, normalMap };
}

export function createHeroFrontMaterial(surface: ReturnType<typeof createHeroSurface>) {
  return new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    map: surface.map,
    roughnessMap: surface.roughnessMap,
    normalMap: surface.normalMap,
    normalScale: new THREE.Vector2(0.65, 0.65),
    roughness: 0.74,
    metalness: 0,
    clearcoat: 0.13,
    clearcoatRoughness: 0.68,
    side: THREE.DoubleSide,
  });
}
