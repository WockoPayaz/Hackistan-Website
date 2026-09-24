/** Coordinates use the original 400-unit logo grid. */
export const hero3d = {
  viewBox: 420,
  cameraZ: 950,
  cameraX: 85,
  cameraY: 45,
  depth: 30,
  bevel: 2.4,
  rotationY: 29 * Math.PI / 180,
  rotationX: 18 * Math.PI / 180,
  pointerDamping: 0.09,
  touchReleaseDamping: 0.19,
  scrollDamping: 0.04,
  pointerCutoff: 0.025,
  touchIntentPixels: 9,
  touchIntentRatio: 1.25,
  maxPixelRatio: 1.5,
} as const;

/** More travel near the center, with a smooth flattening toward the limits. */
export function pointerResponse(value: number): number {
  const clamped = Math.max(-1, Math.min(1, value));
  const square = clamped * clamped;
  return clamped * (1.75 - 1.05 * square + 0.3 * square * square);
}

/** Vertical or ambiguous gestures belong to native page scrolling. */
export function touchDragIntent(dx: number, dy: number): "pending" | "scroll" | "rotate" {
  if (Math.abs(dy) > hero3d.touchIntentPixels && Math.abs(dy) >= Math.abs(dx) / hero3d.touchIntentRatio) return "scroll";
  if (Math.abs(dx) > hero3d.touchIntentPixels && Math.abs(dx) > Math.abs(dy) * hero3d.touchIntentRatio) return "rotate";
  return "pending";
}
