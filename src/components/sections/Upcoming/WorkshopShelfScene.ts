import * as THREE from "three";
import type { ShelfItem } from "@/data/shelfItems";
import { createBookRig, type BookRig } from "./BookRig";

export type ShelfController = {
  navigate: (direction: number) => void;
  open: (index: number) => void;
  close: () => void;
  requestFrame: () => void;
  dispose: () => void;
};

type Events = {
  onActive: (index: number) => void;
  onOpen: (index: number | null) => void;
  onFailure: () => void;
};

const clamp = THREE.MathUtils.clamp;
const damp = THREE.MathUtils.damp;
const smooth = (value: number) => value * value * (3 - 2 * value);
const spacing = 1.36;

/** One finite physical shelf. Rendering runs only while a value is changing. */
export async function createWorkshopShelfScene(canvas: HTMLCanvasElement, items: readonly ShelfItem[], events: Events): Promise<ShelfController | null> {
  let renderer: THREE.WebGLRenderer;
  try {
    // The Pass F renderer samples this canvas across WebGL contexts during
    // the handoff; retain the last on-demand frame for that transfer.
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, preserveDrawingBuffer: true, powerPreference: "default" });
  } catch { return null; }
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x0d1114, 1);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d1114);
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60);
  const stage = new THREE.Group();
  scene.add(stage);
  const shelfMaterial = new THREE.MeshStandardMaterial({ color: 0x34383a, roughness: 0.82, metalness: 0.04 });
  const shelfGeometry = new THREE.BoxGeometry(items.length * spacing + 1.15, 0.22, 1.08);
  const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
  shelf.position.set((items.length - 1) * spacing / 2, 0.2, 0);
  stage.add(shelf);
  scene.add(new THREE.HemisphereLight(0xf2f0ea, 0x172027, 1.55));
  const key = new THREE.DirectionalLight(0xfff9f1, 2.15);
  key.position.set(-3.5, 6, 5);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xe5eaf0, 0.62);
  fill.position.set(5, 3, 2);
  scene.add(fill);

  let rigs: BookRig[] = [];
  try {
    for (const [index, item] of items.entries()) rigs.push(await createBookRig(item, index));
  } catch {
    rigs.forEach((rig) => rig.dispose());
    shelfGeometry.dispose(); shelfMaterial.dispose();
    renderer.dispose(); renderer.forceContextLoss();
    return null;
  }
  rigs.forEach((rig, index) => {
    rig.root.position.set(index * spacing, 0.31 + rig.item.height / 2, rig.item.status === "current" ? 0.13 : 0.04);
    stage.add(rig.root);
  });
  const hitTargets = rigs.map((rig) => rig.hit);
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const target = new THREE.Vector3();
  let position = 0;
  let targetPosition = 0;
  let activeIndex = 0;
  let hoveredIndex = -1;
  let openIndex: number | null = null;
  let openProgress = 0;
  let openTarget = 0;
  let rafId = 0;
  let lastTime = performance.now();
  let disposed = false;
  let visible = true;
  let pointerStart: { id: number; x: number; y: number; index: number; dragging: boolean; scroll: boolean } | null = null;

  const requestFrame = () => {
    if (!rafId && !disposed && visible && !document.hidden) rafId = requestAnimationFrame(frame);
  };

  const resize = () => {
    const width = canvas.clientWidth, height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 768 ? 1.15 : 1.5));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    requestFrame();
  };

  function frame(time: number) {
    rafId = 0;
    const delta = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;
    position = damp(position, targetPosition, 9, delta);
    openProgress = damp(openProgress, openTarget, 6.8, delta);
    const eased = smooth(clamp(openProgress, 0, 1));
    rigs.forEach((rig, index) => {
      const isOpen = index === openIndex;
      const isCurrent = rig.item.status === "current";
      const baseZ = isCurrent ? 0.13 : 0.04;
      const emphasis = isCurrent ? 1.045 : 1;
      rig.root.position.z = damp(rig.root.position.z, baseZ + (isOpen ? eased * 1.35 : 0) + (hoveredIndex === index && openIndex === null ? 0.045 : 0), 12, delta);
      const scale = damp(rig.root.scale.x, emphasis + (isOpen ? eased * (canvas.clientWidth < 768 ? 0.055 : 0.14) : 0), 10, delta);
      rig.root.scale.setScalar(scale);
      rig.frontPivot.rotation.y = damp(rig.frontPivot.rotation.y, isOpen ? -Math.PI * 0.92 * smooth(clamp((openProgress - 0.22) / 0.78, 0, 1)) : (hoveredIndex === index && openIndex === null ? -0.09 : 0), 12, delta);
      for (const material of rig.fadeMaterials) {
        const value = material as THREE.Material & { opacity: number };
        value.opacity = damp(value.opacity, openIndex !== null && !isOpen ? 0.35 : 1, 9, delta);
      }
    });
    camera.position.set(position * spacing, 1.73 + eased * 0.12, (canvas.clientWidth < 768 ? 6.0 : 7.1) - eased * 0.66);
    target.set(position * spacing - eased * (canvas.clientWidth < 768 ? 0 : 0.45), 1.13, 0);
    camera.lookAt(target);
    renderer.render(scene, camera);
    const moving = Math.abs(position - targetPosition) > 0.001 || Math.abs(openProgress - openTarget) > 0.001 || rigs.some((rig, index) => {
      const desiredCover = index === openIndex ? -Math.PI * 0.92 * smooth(clamp((openProgress - 0.22) / 0.78, 0, 1)) : (hoveredIndex === index && openIndex === null ? -0.09 : 0);
      const desiredZ = (rig.item.status === "current" ? 0.13 : 0.04) + (index === openIndex ? eased * 1.35 : 0) + (hoveredIndex === index && openIndex === null ? 0.045 : 0);
      const desiredScale = (rig.item.status === "current" ? 1.045 : 1) + (index === openIndex ? eased * (canvas.clientWidth < 768 ? 0.055 : 0.14) : 0);
      return Math.abs(rig.frontPivot.rotation.y - desiredCover) > 0.002 || Math.abs(rig.root.position.z - desiredZ) > 0.002 || Math.abs(rig.root.scale.x - desiredScale) > 0.002;
    });
    if (moving) requestFrame();
    else {
      position = targetPosition;
      openProgress = openTarget;
      if (openTarget === 0 && openIndex !== null) {
        openIndex = null;
        events.onOpen(null);
      }
    }
  }

  const indexAt = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObjects(hitTargets, false)[0]?.object.userData.index as number | undefined;
  };
  const navigate = (direction: number) => {
    if (openIndex !== null) return;
    targetPosition = clamp(Math.round(targetPosition) + direction, 0, items.length - 1);
    activeIndex = targetPosition;
    events.onActive(activeIndex);
    requestFrame();
  };
  const open = (index: number) => {
    if (openIndex !== null || index < 0 || index >= rigs.length) return;
    openIndex = index;
    activeIndex = index;
    targetPosition = index;
    openTarget = 1;
    hoveredIndex = -1;
    events.onActive(index);
    events.onOpen(index);
    requestFrame();
  };
  const close = () => {
    if (openIndex === null) return;
    openTarget = 0;
    requestFrame();
  };
  const onPointerMove = (event: PointerEvent) => {
    if (openIndex !== null) return;
    if (pointerStart && event.pointerId === pointerStart.id) {
      const dx = event.clientX - pointerStart.x, dy = event.clientY - pointerStart.y;
      if (!pointerStart.dragging && !pointerStart.scroll) {
        if (Math.abs(dy) > 9 && Math.abs(dy) >= Math.abs(dx) / 1.25) pointerStart.scroll = true;
        else if (Math.abs(dx) > 9 && Math.abs(dx) > Math.abs(dy) * 1.25) pointerStart.dragging = true;
      }
      if (pointerStart.dragging) {
        targetPosition = clamp(pointerStart.index - dx / Math.max(125, canvas.clientWidth * 0.28), 0, items.length - 1);
        requestFrame();
      }
      return;
    }
    if (event.pointerType === "mouse" && openIndex === null) {
      const next = indexAt(event) ?? -1;
      if (next !== hoveredIndex) { hoveredIndex = next; requestFrame(); }
    }
  };
  const onPointerDown = (event: PointerEvent) => {
    pointerStart = { id: event.pointerId, x: event.clientX, y: event.clientY, index: targetPosition, dragging: false, scroll: false };
  };
  const onPointerUp = (event: PointerEvent) => {
    const gesture = pointerStart;
    pointerStart = null;
    if (!gesture || gesture.scroll) return;
    if (gesture.dragging) {
      targetPosition = clamp(Math.round(targetPosition), 0, items.length - 1);
      activeIndex = targetPosition;
      events.onActive(activeIndex);
      requestFrame();
      return;
    }
    if (openIndex !== null) {
      if (indexAt(event) !== openIndex) close();
    } else {
      const hit = indexAt(event);
      if (hit !== undefined) open(hit);
    }
  };
  const onPointerCancel = () => { pointerStart = null; };
  const onPointerLeave = () => { if (hoveredIndex !== -1) { hoveredIndex = -1; requestFrame(); } };
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); navigate(event.key === "ArrowLeft" ? -1 : 1); }
    else if (event.key === "Enter" && openIndex === null) { event.preventDefault(); open(activeIndex); }
    else if (event.key === "Escape") { close(); }
  };
  const onVisibility = () => { if (!document.hidden) { lastTime = performance.now(); requestFrame(); } };
  const onContextLost = (event: Event) => {
    event.preventDefault();
    if (!disposed) {
      visible = false;
      if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
      events.onFailure();
    }
  };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) { lastTime = performance.now(); requestFrame(); }
    else if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
  });
  observer.observe(canvas);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerCancel);
  canvas.addEventListener("pointerleave", onPointerLeave);
  canvas.addEventListener("keydown", onKeyDown);
  canvas.addEventListener("webglcontextlost", onContextLost);
  document.addEventListener("visibilitychange", onVisibility);
  resize();
  // Render once before the prism is allowed to sample this canvas.
  if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
  frame(performance.now());
  return {
    navigate, open, close, requestFrame,
    dispose() {
      disposed = true;
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect(); resizeObserver.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerCancel);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("keydown", onKeyDown);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      document.removeEventListener("visibilitychange", onVisibility);
      rigs.forEach((rig) => rig.dispose());
      shelfGeometry.dispose(); shelfMaterial.dispose();
      renderer.dispose(); renderer.forceContextLoss();
    },
  };
}
