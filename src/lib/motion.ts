export const motion = {
  instant: 0.18,
  fast: 0.35,
  normal: 0.7,
  slow: 1.15,
  reveal: 1.4,
  scene: 1.8,
} as const;

export const movement = {
  pointer: { x: 8, y: 6, rotation: 3 },
  desktopScroll: 2.4,
  mobileScroll: 2.2,
  reducedScroll: 1.5,
} as const;
