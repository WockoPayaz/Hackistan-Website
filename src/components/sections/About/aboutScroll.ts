const stageHeight = () => document.querySelector<HTMLElement>("[data-about-scene]")?.clientHeight || window.innerHeight;

/** The old 300/270svh runway ended when its bottom reached the viewport bottom. */
export function aboutHoldEnd() {
  const oldRunway = stageHeight() * (window.matchMedia("(max-width: 767px)").matches ? 2.7 : 3);
  return oldRunway - window.innerHeight;
}

export const prismScrollDistance = () => stageHeight() * 1.85;

// Pass G starts after the approved prism and a substantial settled shelf hold.
export const shelfBrowseDistance = () => stageHeight() * 1.2;
export const joinExitDistance = () => stageHeight() * 1.05;
export const joinHoldDistance = () => stageHeight() * 1.1;
export const joinExitStart = () => aboutHoldEnd() + prismScrollDistance() + shelfBrowseDistance();
export const joinSettledOffset = () => joinExitStart() + joinExitDistance();
