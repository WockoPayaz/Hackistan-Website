"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { gsap } from "@/lib/gsap";
import { hero3d, touchDragIntent } from "@/lib/hero-3d";
import { createHeroSurface } from "@/lib/hero-surface";
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
    bevelSegments: 3,
    curveSegments: 2,
    steps: 1,
  });
  // SVG uses downward-positive Y. Keep the original logo centered in 3D.
  geometry.scale(1, -1, 1);
  geometry.translate(-200, 200, -hero3d.depth / 2);
  const positions = geometry.getAttribute("position");
  const uv = geometry.getAttribute("uv");
  const sideShade = new Float32Array(positions.count * 3);
  for (let i = 0; i < positions.count; i++) {
    uv.setXY(i, (positions.getX(i) + 200) / 400, (positions.getY(i) + 200) / 400);
    // A shallow self-shadow toward the back of the extrusion grounds each piece.
    const alongDepth = Math.max(0, Math.min(1, (positions.getZ(i) + hero3d.depth / 2 + hero3d.bevel) / (hero3d.depth + 2 * hero3d.bevel)));
    const shade = 0.73 + alongDepth * 0.27;
    sideShade[i * 3] = sideShade[i * 3 + 1] = sideShade[i * 3 + 2] = shade;
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(sideShade, 3));
  return geometry;
}

export function HeroLogo3D({ onReadyChange }: { onReadyChange: (ready: boolean) => void }) {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mount.current;
    const mark = container?.closest<HTMLElement>("[data-mark-stage]");
    const journey = container?.closest<HTMLElement>("[data-journey]");
    const hero = container?.closest<HTMLElement>("[data-hero]");
    const touchTarget = container?.parentElement?.querySelector<HTMLElement>("[data-hero-touch-target]");
    if (!container || !mark || !journey || !hero || !touchTarget) return;

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
    renderer.toneMappingExposure = 1.04;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 1, 4000);
    camera.position.z = hero3d.cameraZ;
    const pointerGroup = new THREE.Group();
    scene.add(pointerGroup);
    let surface: ReturnType<typeof createHeroSurface>;
    try {
      surface = createHeroSurface();
    } catch {
      renderer.dispose();
      canvas.remove();
      return;
    }
    const front = new THREE.MeshStandardMaterial({
      color: 0xffffff, map: surface.map, roughnessMap: surface.roughnessMap,
      bumpMap: surface.bumpMap, bumpScale: 1.9,
      roughness: 0.78, metalness: 0, side: THREE.DoubleSide,
    });
    const sides = new THREE.MeshStandardMaterial({ color: 0xaaa49a, roughness: 0.76, metalness: 0, side: THREE.DoubleSide, vertexColors: true });
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
      surface.map.dispose();
      surface.roughnessMap.dispose();
      surface.bumpMap.dispose();
      renderer.dispose();
      canvas.remove();
      return; // Keep the SVG if the source paths cannot be extruded.
    }
    scene.add(new THREE.AmbientLight(0xffffff, 0.36));
    const key = new THREE.DirectionalLight(0xfff8ed, 1.9);
    key.position.set(-420, 430, 500);
    scene.add(key);
    // Gentle falloff across the wide front plane; shadows remain disabled.
    const studio = new THREE.PointLight(0xfff6e9, 110000, 0, 2);
    studio.position.set(-270, 300, 460);
    scene.add(studio);
    const fill = new THREE.DirectionalLight(0xffffff, 0.35);
    fill.position.set(410, -120, 260);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, 0.85);
    rim.position.set(270, 180, -420);
    scene.add(rim);

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
    let drag: { id: number; startX: number; startY: number; intent: "pending" | "rotate" | "scroll" } | null = null;
    let touchX = 0;
    let touchY = 0;
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
      if (event.pointerType !== "mouse") return;
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
    const touchStart = (event: PointerEvent) => {
      if (event.pointerType !== "touch" || !event.isPrimary || reduced.matches || getProgress() >= hero3d.pointerCutoff) return;
      pointerInside = false;
      drag = { id: event.pointerId, startX: event.clientX, startY: event.clientY, intent: "pending" };
      touchTarget.setPointerCapture(event.pointerId);
    };
    const touchMove = (event: PointerEvent) => {
      if (!drag || drag.id !== event.pointerId) return;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (drag.intent === "pending") drag.intent = touchDragIntent(dx, dy);
      if (drag.intent !== "rotate" || getProgress() >= hero3d.pointerCutoff) return;
      touchX = Math.max(-1, Math.min(1, dx / (mark.clientWidth * 0.48))) * hero3d.rotationY;
      touchY = -Math.max(-1, Math.min(1, dy / (mark.clientHeight * 0.65))) * hero3d.rotationX * 0.85;
    };
    const touchEnd = (event: PointerEvent) => {
      if (drag?.id !== event.pointerId) return;
      drag = null;
      touchX = 0;
      touchY = 0;
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
    touchTarget.addEventListener("pointerdown", touchStart);
    touchTarget.addEventListener("pointermove", touchMove);
    touchTarget.addEventListener("pointerup", touchEnd);
    touchTarget.addEventListener("pointercancel", touchEnd);
    const update = (time: number) => {
      frame = requestAnimationFrame(update);
      if (!contextAvailable || !onScreen || document.hidden) { lastTime = time; return; }
      const elapsed = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;
      const atRest = getProgress() < hero3d.pointerCutoff;
      if (!atRest && drag) { drag = null; touchX = 0; touchY = 0; }
      const touchActive = atRest && drag?.intent === "rotate" && !reduced.matches;
      const mouseActive = atRest && pointerInside && hover.matches && !reduced.matches;
      const damping = touchActive || mouseActive ? hero3d.pointerDamping : atRest ? hero3d.touchReleaseDamping : hero3d.scrollDamping;
      const amount = 1 - Math.exp(-elapsed / damping);
      const previousX = pointerGroup.rotation.x;
      const previousY = pointerGroup.rotation.y;
      pointerGroup.rotation.y += ((touchActive ? touchX : mouseActive ? pointerX * hero3d.rotationY : 0) - pointerGroup.rotation.y) * amount;
      pointerGroup.rotation.x += ((touchActive ? touchY : mouseActive ? -pointerY * hero3d.rotationX : 0) - pointerGroup.rotation.x) * amount;
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
      touchTarget.removeEventListener("pointerdown", touchStart);
      touchTarget.removeEventListener("pointermove", touchMove);
      touchTarget.removeEventListener("pointerup", touchEnd);
      touchTarget.removeEventListener("pointercancel", touchEnd);
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
      for (const name of partNames) meshes[name].geometry.dispose();
      front.dispose();
      sides.dispose();
      surface.map.dispose();
      surface.roughnessMap.dispose();
      surface.bumpMap.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, [onReadyChange]);

  return <>
    <div ref={mount} className={styles.canvas} aria-hidden="true" />
    <div className={styles.touchTarget} data-hero-touch-target aria-hidden="true" />
  </>;
}
