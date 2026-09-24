"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { gsap } from "@/lib/gsap";
import { hero3d } from "@/lib/hero-3d";
import { markGeometry } from "./geometry";
import styles from "./LogoScene.module.css";

type Part = keyof typeof markGeometry;
const partNames = Object.keys(markGeometry) as Part[];

function makeGeometry(path: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg"><path d="${path}"/></svg>`;
  const shapes = SVGLoader.createShapes(new SVGLoader().parse(svg).paths[0]);
  const geometry = new THREE.ExtrudeGeometry(shapes, {
    depth: hero3d.depth,
    bevelEnabled: true,
    bevelThickness: hero3d.bevel,
    bevelSize: hero3d.bevel,
    bevelSegments: 2,
    curveSegments: 2,
    steps: 1,
  });
  // SVG uses downward-positive Y. Keep the original logo centered in 3D.
  geometry.scale(1, -1, 1);
  geometry.translate(-200, 200, -hero3d.depth / 2);
  return geometry;
}

export function HeroLogo3D({ onReadyChange }: { onReadyChange: (ready: boolean) => void }) {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mount.current;
    const mark = container?.closest<HTMLElement>("[data-mark-stage]");
    const journey = container?.closest<HTMLElement>("[data-journey]");
    const hero = container?.closest<HTMLElement>("[data-hero]");
    if (!container || !mark || !journey || !hero) return;

    const svgParts = Object.fromEntries(partNames.map((name) => [name, mark.querySelector(`[data-logo-part="${name}"]`)])) as Record<Part, Element | null>;
    if (partNames.some((name) => !svgParts[name])) return;

    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    const context = canvas.getContext("webgl2", { alpha: true, antialias: true, powerPreference: "default" });
    if (!context) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true });
    } catch {
      return; // The dimensional SVG stays visible on unsupported devices.
    }
    container.appendChild(canvas);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, hero3d.maxPixelRatio));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 1, 4000);
    camera.position.z = hero3d.cameraZ;
    const pointerGroup = new THREE.Group();
    scene.add(pointerGroup);
    const front = new THREE.MeshStandardMaterial({ color: 0xf2f0ea, roughness: 0.68, metalness: 0, side: THREE.DoubleSide });
    const sides = new THREE.MeshStandardMaterial({ color: 0xa9a7a1, roughness: 0.78, metalness: 0, side: THREE.DoubleSide });
    const meshes = {} as Record<Part, THREE.Mesh<THREE.ExtrudeGeometry>>;
    try {
      for (const name of partNames) {
        const mesh = new THREE.Mesh(makeGeometry(markGeometry[name]), [front, sides]);
        mesh.name = `logo-${name}`;
        pointerGroup.add(mesh);
        meshes[name] = mesh;
      }
    } catch {
      for (const name of partNames) meshes[name]?.geometry.dispose();
      front.dispose();
      sides.dispose();
      renderer.dispose();
      canvas.remove();
      return; // Keep the SVG if the source paths cannot be extruded.
    }
    scene.add(new THREE.AmbientLight(0xffffff, 1.8));
    const key = new THREE.DirectionalLight(0xffffff, 3);
    key.position.set(-240, 330, 420);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xcbd1dc, 1.4);
    fill.position.set(320, -130, 250);
    scene.add(fill);

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height || !mark.clientWidth) return;
      renderer.setSize(width, height, false);
      // Each SVG user unit maps to the same CSS size as the fallback.
      const worldHeight = height * hero3d.viewBox / mark.clientHeight;
      camera.fov = 2 * Math.atan(worldHeight / (2 * hero3d.cameraZ)) * 180 / Math.PI;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resizeObserver.observe(mark);
    resize();

    const hover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let pointerX = 0;
    let pointerY = 0;
    let pointerInside = false;
    let contextAvailable = true;
    let onScreen = true;
    let frame = 0;
    let lastTime = performance.now();
    let firstFrame = true;
    const getProgress = () => {
      const distance = Number(journey.dataset.scrollDistance);
      return distance ? Math.min(1, Math.max(0, -journey.getBoundingClientRect().top / distance)) : 0;
    };
    const move = (event: PointerEvent) => {
      const bounds = hero.getBoundingClientRect();
      pointerInside = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
      if (pointerInside) {
        pointerX = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
        pointerY = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
      }
    };
    const leave = (event: PointerEvent) => {
      if (!event.relatedTarget) pointerInside = false;
    };
    const lost = (event: Event) => {
      event.preventDefault();
      contextAvailable = false;
      onReadyChange(false);
    };
    const restored = () => {
      contextAvailable = true;
      resize();
      onReadyChange(true);
    };
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    visibilityObserver.observe(hero);
    canvas.addEventListener("webglcontextlost", lost);
    canvas.addEventListener("webglcontextrestored", restored);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerout", leave);
    const update = (time: number) => {
      frame = requestAnimationFrame(update);
      if (!contextAvailable || !onScreen || document.hidden) { lastTime = time; return; }
      const elapsed = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;
      const atRest = getProgress() < hero3d.pointerCutoff;
      const active = atRest && pointerInside && hover.matches && !reduced.matches;
      const damping = active ? hero3d.pointerDamping : hero3d.scrollDamping;
      const amount = 1 - Math.exp(-elapsed / damping);
      const previousX = pointerGroup.rotation.x;
      const previousY = pointerGroup.rotation.y;
      pointerGroup.rotation.y += ((active ? pointerX * hero3d.rotationY : 0) - pointerGroup.rotation.y) * amount;
      pointerGroup.rotation.x += ((active ? -pointerY * hero3d.rotationX : 0) - pointerGroup.rotation.x) * amount;
      let changed = firstFrame || Math.abs(pointerGroup.rotation.x - previousX) > 0.00005 || Math.abs(pointerGroup.rotation.y - previousY) > 0.00005;
      for (const name of partNames) {
        const element = svgParts[name]!;
        const x = Number(gsap.getProperty(element, "x")) || 0;
        const y = Number(gsap.getProperty(element, "y")) || 0;
        if (x !== meshes[name].position.x || -y !== meshes[name].position.y) changed = true;
        meshes[name].position.set(x, -y, 0);
      }
      if (changed) renderer.render(scene, camera);
      if (firstFrame) { firstFrame = false; onReadyChange(true); }
    };
    frame = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerout", leave);
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
      for (const name of partNames) meshes[name].geometry.dispose();
      front.dispose();
      sides.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, [onReadyChange]);

  return <div ref={mount} className={styles.canvas} aria-hidden="true" />;
}
