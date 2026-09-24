import * as THREE from "three";
import { MeshTransmissionMaterial } from "@pmndrs/vanilla/materials/MeshTransmissionMaterial.js";

/** Shared, fixed buffer: the DOM wordmark stays behind the canvas, outside refraction. */
export function createGlassBackdrop() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("No 2D canvas for the glass backdrop");
  context.fillStyle = "#20201e";
  context.fillRect(0, 0, 256, 256);
  const left = context.createLinearGradient(18, 0, 184, 256);
  left.addColorStop(0, "rgba(238,234,222,.78)");
  left.addColorStop(0.2, "rgba(136,135,127,.3)");
  left.addColorStop(0.49, "rgba(36,36,34,0)");
  left.addColorStop(0.83, "rgba(206,204,195,.37)");
  left.addColorStop(1, "rgba(26,26,24,0)");
  context.fillStyle = left;
  context.fillRect(0, 0, 256, 256);
  const glow = context.createRadialGradient(216, 32, 2, 216, 32, 192);
  glow.addColorStop(0, "rgba(232,229,219,.36)");
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
    _transmission: 0.68,
    thickness: 24,
    roughness: mobile ? 0.2 : 0.16,
    anisotropicBlur: mobile ? 0.08 : 0.12,
    chromaticAberration: 0.001,
    distortion: 0,
    temporalDistortion: 0,
    attenuationDistance: 90,
    attenuationColor: new THREE.Color(0xc9c6bd),
  });
  material.color.set(0xf1eee6);
  material.ior = 1.42;
  material.metalness = 0;
  material.envMapIntensity = 1.2;
  material.side = THREE.DoubleSide;
  material.transparent = false;
  return material;
}
