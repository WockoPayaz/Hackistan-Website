import * as THREE from "three";
import { MeshTransmissionMaterial } from "@pmndrs/vanilla/materials/MeshTransmissionMaterial.js";

/** Shared studio reflection buffer; the real DOM wordmark remains underneath the canvas. */
export function createGlassBackdrop() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("No 2D canvas for the glass backdrop");
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
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.background = texture;
  return { scene, texture };
}

/** One material shared by the independent cap meshes; its buffer is set at resize. */
export function createGlassMaterial(mobile: boolean) {
  const material = new MeshTransmissionMaterial({
    samples: mobile ? 3 : 5,
    _transmission: 0.8,
    thickness: 30,
    roughness: mobile ? 0.2 : 0.18,
    anisotropicBlur: mobile ? 0.11 : 0.15,
    chromaticAberration: 0.0015,
    // A few broad, stationary lensing regions across the 400-unit mark.
    distortion: mobile ? 0.14 : 0.2,
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
  // The refraction buffer contains only the studio gradient. Alpha compositing
  // also lets the actual DOM wordmark behind the canvas show through the H.
  material.transparent = true;
  material.opacity = mobile ? 0.8 : 0.76;
  material.depthWrite = true;
  material.forceSinglePass = true;
  return material;
}
