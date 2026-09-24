import * as THREE from "three";
import { MeshTransmissionMaterial } from "@pmndrs/vanilla/materials/MeshTransmissionMaterial.js";

/** Small transmission buffer; only its typography copy is refracted by WebGL. */
export function createGlassBackdrop() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("No 2D canvas for the glass backdrop");
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.background = texture;
  const paint = (width: number, height: number, container: HTMLElement, wordmark: HTMLElement | null) => {
    canvas.width = width;
    canvas.height = height;
    context.setTransform(width / 256, 0, 0, height / 256, 0, 0);
    context.fillStyle = "#1d1d1b";
    context.fillRect(0, 0, 256, 256);
    const left = context.createLinearGradient(18, 0, 184, 256);
    left.addColorStop(0, "rgba(238,234,222,.52)");
    left.addColorStop(0.2, "rgba(136,135,127,.25)");
    left.addColorStop(0.49, "rgba(36,36,34,0)");
    left.addColorStop(0.83, "rgba(206,204,195,.28)");
    left.addColorStop(1, "rgba(26,26,24,0)");
    context.fillStyle = left;
    context.fillRect(0, 0, 256, 256);
    const glow = context.createRadialGradient(216, 32, 2, 216, 32, 192);
    glow.addColorStop(0, "rgba(232,229,219,.26)");
    glow.addColorStop(1, "rgba(18,18,17,0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, 256, 256);

    // The real DOM text remains in place; this aligned buffer-only copy gives
    // the glass something high-contrast to bend at different viewing angles.
    if (wordmark) {
      const bounds = container.getBoundingClientRect();
      const textBounds = wordmark.getBoundingClientRect();
      const style = getComputedStyle(wordmark);
      context.setTransform(width / bounds.width, 0, 0, height / bounds.height,
        -bounds.left * width / bounds.width, -bounds.top * height / bounds.height);
      context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      context.letterSpacing = style.letterSpacing;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillStyle = "rgba(248,247,243,.78)";
      context.fillText(wordmark.textContent ?? "Hackistan", textBounds.left + textBounds.width / 2,
        textBounds.top + textBounds.height / 2);
    }
    texture.needsUpdate = true;
  };
  return { scene, texture, paint };
}

/** One material shared by the independent cap meshes; its buffer is set at resize. */
export function createGlassMaterial(mobile: boolean) {
  const material = new MeshTransmissionMaterial({
    samples: mobile ? 3 : 5,
    _transmission: 0.82,
    thickness: 30,
    roughness: mobile ? 0.11 : 0.09,
    anisotropicBlur: mobile ? 0.025 : 0.02,
    chromaticAberration: 0.0015,
    // A few broad, stationary lensing regions across the 400-unit mark.
    distortion: mobile ? 0.32 : 0.42,
    distortionScale: 0.006,
    temporalDistortion: 0,
    attenuationDistance: 125,
    attenuationColor: new THREE.Color(0xd5d1c9),
  });
  material.color.set(0xe5e4dc);
  material.ior = 1.45;
  material.metalness = 0;
  material.envMapIntensity = 1.35;
  material.side = THREE.DoubleSide;
  // Only the aligned buffer copy is refracted. The real DOM wordmark and
  // ribbons remain visible behind the canvas through alpha compositing.
  material.transparent = true;
  material.opacity = mobile ? 0.8 : 0.76;
  material.depthWrite = true;
  material.forceSinglePass = true;
  return material;
}
