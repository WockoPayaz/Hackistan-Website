import * as THREE from "three";

/** Two tiny, deterministic maps shared by all three meshes; no network asset. */
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

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const wash = Math.sin(x * 0.045 + y * 0.024) * 1.6 + Math.sin(y * 0.072 - x * 0.027) * 1.4;
      const grain = (random() - 0.5) * 8;
      const tone = Math.round(246 + wash + grain);
      color.data.set([tone, tone - 2, tone - 8, 255], i);
      const roughness = Math.round(225 + wash * 3 + (random() - 0.5) * 26);
      rough.data.set([roughness, roughness, roughness, 255], i);
    }
  }
  colorContext.putImageData(color, 0, 0);
  roughContext.putImageData(rough, 0, 0);
  const map = new THREE.CanvasTexture(colorCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  return { map, roughnessMap };
}
