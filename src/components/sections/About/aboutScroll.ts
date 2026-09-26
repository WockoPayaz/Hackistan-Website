const stageHeight = () => document.querySelector<HTMLElement>("[data-about-scene]")?.clientHeight || window.innerHeight;

/** The old 300/270svh runway ended when its bottom reached the viewport bottom. */
export function aboutHoldEnd() {
  const oldRunway = stageHeight() * (window.matchMedia("(max-width: 767px)").matches ? 2.7 : 3);
  return oldRunway - window.innerHeight;
}

export const prismScrollDistance = () => stageHeight() * 1.85;
