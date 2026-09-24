/** Coordinates use the original 400-unit logo grid. */
export const hero3d = {
  viewBox: 420,
  cameraZ: 950,
  depth: 22,
  bevel: 1.6,
  rotationY: 6 * Math.PI / 180,
  rotationX: 4 * Math.PI / 180,
  pointerDamping: 0.17,
  scrollDamping: 0.085,
  pointerCutoff: 0.025,
  maxPixelRatio: 1.5,
} as const;
