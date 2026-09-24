/** Coordinates use the original 400-unit logo grid. */
export const hero3d = {
  viewBox: 420,
  cameraZ: 950,
  depth: 27,
  bevel: 2,
  rotationY: 11 * Math.PI / 180,
  rotationX: 7 * Math.PI / 180,
  pointerDamping: 0.17,
  touchReleaseDamping: 0.19,
  scrollDamping: 0.085,
  pointerCutoff: 0.025,
  touchIntentPixels: 9,
  touchIntentRatio: 1.25,
  maxPixelRatio: 1.5,
} as const;

/** Vertical or ambiguous gestures belong to native page scrolling. */
export function touchDragIntent(dx: number, dy: number): "pending" | "scroll" | "rotate" {
  if (Math.abs(dy) > hero3d.touchIntentPixels && Math.abs(dy) >= Math.abs(dx) / hero3d.touchIntentRatio) return "scroll";
  if (Math.abs(dx) > hero3d.touchIntentPixels && Math.abs(dx) > Math.abs(dy) * hero3d.touchIntentRatio) return "rotate";
  return "pending";
}
