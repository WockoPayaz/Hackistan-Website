/** Reconstructed from docs/reference/hackistan-original-logo.png.
 * 400-unit grid; original pillar widths, asymmetric peaks and cuts preserved.
 */
export const markGeometry = {
  left: "M0 0H105V199L32 272L105 255V400H0Z",
  bridge: "M32 272L189 129L238 193L254 176L286 208L366 272L271 232L260 255L184 178L105 255Z",
  right: "M295 0H400V400H295V250L366 272L295 199Z",
} as const;

// Same ridge, normalized for a viewport crop. Shared by every scene transition.
export const mountainCrop = "polygon(0% 100%, 0% 68%, 47.25% 32.25%, 59.5% 48.25%, 63.5% 44%, 100% 68%, 100% 100%)";
export const openCrop = "polygon(0% 100%, 0% 0%, 47.25% 0%, 59.5% 0%, 63.5% 0%, 100% 0%, 100% 100%)";
