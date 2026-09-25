"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { gsap } from "@/lib/gsap";
import { hero3d, pointerResponse, touchDragIntent } from "@/lib/hero-3d";
import { createGlassBackdrop, createGlassMaterial } from "@/lib/hero-glass";
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
    const wordmark = hero?.querySelector<HTMLElement>("[data-hero-wordmark] h1 span") ?? null;
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
    renderer.toneMappingExposure = 1.06;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 1, 4000);
    // A nearly frontal view still exposes a sliver of the real extrusion at rest.
    camera.position.set(hero3d.cameraX, hero3d.cameraY, hero3d.cameraZ);
    camera.lookAt(0, 0, 0);
    // Entrance transforms live outside the approved pointer/scroll hierarchy.
    const introGroup = new THREE.Group();
    const pointerGroup = new THREE.Group();
    scene.add(introGroup);
    introGroup.add(pointerGroup);
    let environment: THREE.WebGLRenderTarget;
    let backdrop: ReturnType<typeof createGlassBackdrop>;
    let front: ReturnType<typeof createGlassMaterial>;
    const mobile = window.matchMedia("(pointer: coarse)").matches;
    try {
      const room = new RoomEnvironment();
      const pmrem = new THREE.PMREMGenerator(renderer);
      try { environment = pmrem.fromScene(room, 0.04); }
      finally { pmrem.dispose(); room.dispose(); }
      scene.environment = environment.texture;
      backdrop = createGlassBackdrop();
      front = createGlassMaterial(mobile);
    } catch {
      renderer.dispose();
      canvas.remove();
      return;
    }
    const sides = new THREE.MeshPhysicalMaterial({ color: 0xd3cec4, roughness: 0.24, metalness: 0, clearcoat: 0.22, clearcoatRoughness: 0.32, envMapIntensity: 1.1, side: THREE.DoubleSide, vertexColors: true });
    // The explicit transmission buffer includes an aligned copy of the DOM
    // wordmark. Paint on resize/font load, not on each animation frame.
    const bufferTarget = new THREE.WebGLRenderTarget(1, 1, { depthBuffer: false, stencilBuffer: false });
    bufferTarget.texture.minFilter = THREE.LinearFilter;
    bufferTarget.texture.magFilter = THREE.LinearFilter;
    front.uniforms.buffer.value = bufferTarget.texture;
    let shaderFailed = false;
    renderer.debug.onShaderError = (gl, program) => {
      shaderFailed = true;
      console.error("Hackistan glass shader failed:", gl.getProgramInfoLog(program));
    };
    const meshes = {} as Record<Part, THREE.Mesh<THREE.ExtrudeGeometry>>;
    const introReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const introEnabled = hero.dataset.intro === "pending" &&
      (!location.hash || location.hash === "#top") && window.scrollY < 24;
    const wires: THREE.LineSegments[] = [];
    let introActive = introEnabled;
    const finalOpacity = front.opacity;
    try {
      for (const name of partNames) {
        const mesh = new THREE.Mesh(makeGeometry(markGeometry[name]), [front, sides]);
        mesh.name = `logo-${name}`;
        pointerGroup.add(mesh);
        meshes[name] = mesh;
        if (introEnabled) {
          mesh.visible = false;
          const line = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, 24),
            new THREE.LineBasicMaterial({ color: 0xecebe6, transparent: true, opacity: 0, depthWrite: false }));
          line.name = name;
          introGroup.add(line);
          wires.push(line);
        }
      }
    } catch {
      for (const name of partNames) meshes[name]?.geometry.dispose();
      for (const line of wires) { line.geometry.dispose(); (line.material as THREE.Material).dispose(); }
      front.dispose();
      sides.dispose();
      bufferTarget.dispose();
      backdrop.texture.dispose();
      environment.dispose();
      renderer.dispose();
      canvas.remove();
      return; // Keep the SVG if the source paths cannot be extruded.
    }
    scene.add(new THREE.AmbientLight(0xffffff, 0.16));
    const key = new THREE.DirectionalLight(0xfff8ee, 1.25);
    key.position.set(-520, 420, 500);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.17);
    fill.position.set(410, -120, 260);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, 0.32);
    rim.position.set(270, 180, -420);
    scene.add(rim);

    const clamp = (value: number) => Math.max(0, Math.min(1, value));
    const introProgress = (value: number) => {
      if (!introActive) return;
      const depth = clamp((value - 0.53) / 0.23);
      introGroup.position.z = (introReduced ? -10 : -24) * (1 - depth);
      introGroup.scale.setScalar((introReduced ? 0.985 : 0.96) + (introReduced ? 0.015 : 0.04) * depth);
      for (const line of wires) {
        const bridge = line.name === "bridge";
        const reveal = clamp((value - (bridge ? 0.24 : 0.42)) / (bridge ? 0.18 : 0.19));
        const fade = 1 - clamp((value - 0.69) / 0.17);
        line.visible = reveal * fade > 0;
        (line.material as THREE.LineBasicMaterial).opacity = reveal * fade * 0.6;
        const settle = 1 - clamp((value - 0.55) / 0.19);
        const wireTravel = introReduced ? 0.45 : 1;
        line.position.set(bridge ? 0 : line.name === "left" ? -14 * settle * wireTravel : 14 * settle * wireTravel,
          bridge ? 12 * settle * wireTravel : 0, bridge ? -12 * settle * wireTravel : 0);
      }
      const glass = clamp((value - 0.68) / 0.18);
      front.opacity = finalOpacity * glass;
      sides.transparent = true;
      sides.opacity = glass;
      for (const mesh of Object.values(meshes)) mesh.visible = glass > 0;
      renderer.render(scene, camera);
    };
    const onIntroProgress = (event: Event) => introProgress((event as CustomEvent<number>).detail);
    const finishIntro = () => {
      if (!introActive) return;
      introActive = false;
      introGroup.position.set(0, 0, 0);
      introGroup.scale.setScalar(1);
      front.opacity = finalOpacity;
      sides.opacity = 1;
      sides.transparent = false;
      for (const mesh of Object.values(meshes)) mesh.visible = true;
      for (const line of wires) {
        introGroup.remove(line);
        line.geometry.dispose();
        (line.material as THREE.Material).dispose();
      }
      wires.length = 0;
      renderer.render(scene, camera);
    };
    window.addEventListener("hackistan:intro-progress", onIntroProgress);
    window.addEventListener("hackistan:intro-finished", finishIntro);

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
      const scale = Math.min(mobile ? 512 : 768, Math.max(width, height));
      const bufferWidth = Math.max(1, Math.round(scale * width / Math.max(width, height)));
      const bufferHeight = Math.max(1, Math.round(scale * height / Math.max(width, height)));
      bufferTarget.setSize(bufferWidth, bufferHeight);
      backdrop.paint(bufferWidth, bufferHeight, container, wordmark);
      renderer.setRenderTarget(bufferTarget);
      renderer.render(backdrop.scene, camera);
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resizeObserver.observe(mark);
    resize();
    document.fonts.ready.then(() => { if (canvas.isConnected) resize(); });

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
      if (introActive || event.pointerType !== "touch" || !event.isPrimary || getProgress() >= hero3d.pointerCutoff) return;
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
      touchX = pointerResponse(dx / (mark.clientWidth * 0.23)) * (reduced.matches ? hero3d.reducedRotationY : hero3d.rotationY);
      touchY = -pointerResponse(dy / (mark.clientHeight * 0.36)) * (reduced.matches ? hero3d.reducedRotationX : hero3d.rotationX) * 0.85;
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
      canvas.style.display = "none";
      onReadyChange(false);
    };
    const restored = () => {
      contextAvailable = true;
      canvas.style.display = "";
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
      const progress = getProgress();
      const atRest = progress < hero3d.pointerCutoff;
      if (!atRest && drag) { drag = null; touchX = 0; touchY = 0; }
      const touchActive = !introActive && atRest && drag?.intent === "rotate";
      const mouseActive = !introActive && atRest && pointerInside && hover.matches;
      const damping = touchActive || mouseActive ? hero3d.pointerDamping : atRest ? hero3d.touchReleaseDamping : hero3d.scrollDamping;
      const amount = 1 - Math.exp(-elapsed / damping);
      const previousX = pointerGroup.rotation.x;
      const previousY = pointerGroup.rotation.y;
      pointerGroup.rotation.y += ((touchActive ? touchX : mouseActive ? pointerResponse(pointerX) * (reduced.matches ? hero3d.reducedRotationY : hero3d.rotationY) : 0) - pointerGroup.rotation.y) * amount;
      pointerGroup.rotation.x += ((touchActive ? touchY : mouseActive ? -pointerResponse(pointerY) * (reduced.matches ? hero3d.reducedRotationX : hero3d.rotationX) : 0) - pointerGroup.rotation.x) * amount;
      let changed = firstFrame || Math.abs(pointerGroup.rotation.x - previousX) > 0.00005 || Math.abs(pointerGroup.rotation.y - previousY) > 0.00005;
      // GSAP owns the SVG x/y positions. WebGL owns only this small scroll-driven Z offset.
      const release = reduced.matches ? 0 : Math.max(0, Math.min(1, (progress - 0.1) / 0.82));
      const depth = release * release * release * (hover.matches ? 1 : 0.6);
      for (const name of partNames) {
        const element = svgParts[name]!;
        const x = Number(gsap.getProperty(element, "x")) || 0;
        const y = Number(gsap.getProperty(element, "y")) || 0;
        const z = name === "bridge" ? -14 * depth : 12 * depth;
        if (x !== meshes[name].position.x || -y !== meshes[name].position.y || z !== meshes[name].position.z) changed = true;
        meshes[name].position.set(x, -y, z);
      }
      if (changed) renderer.render(scene, camera);
      if (firstFrame && !shaderFailed) { firstFrame = false; onReadyChange(true); }
      if (shaderFailed) { contextAvailable = false; canvas.style.display = "none"; onReadyChange(false); }
    };
    frame = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hackistan:intro-progress", onIntroProgress);
      window.removeEventListener("hackistan:intro-finished", finishIntro);
      for (const line of wires) { line.geometry.dispose(); (line.material as THREE.Material).dispose(); }
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
      bufferTarget.dispose();
      backdrop.texture.dispose();
      environment.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, [onReadyChange]);

  return <>
    <div ref={mount} className={styles.canvas} aria-hidden="true" />
    <div className={styles.touchTarget} data-hero-touch-target aria-hidden="true" />
  </>;
}
