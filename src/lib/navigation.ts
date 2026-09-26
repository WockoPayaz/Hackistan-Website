import { aboutEntranceDistance, aboutHoldEnd, joinSettledOffset, prismScrollDistance } from "@/components/sections/About/aboutScroll";

export function sectionScrollTop(id: string): number | undefined {
  const section = document.getElementById(id);
  if (!section) return;
  if (id === "about") return section.getBoundingClientRect().top + window.scrollY + aboutEntranceDistance();
  if (id === "upcoming" || id === "join") {
    const about = section.closest<HTMLElement>("[data-about]");
    if (about) {
      // Both destinations live in the pinned scene, so their DOM rectangles
      // cannot express the end of their respective scroll transitions.
      return about.getBoundingClientRect().top + window.scrollY +
        (id === "join" ? joinSettledOffset() : aboutHoldEnd() + prismScrollDistance());
    }
  }
  const journey = section.closest<HTMLElement>("[data-journey]");
  // The hero is inside a sticky scene; its viewport position is not its
  // document anchor once the scene has started moving.
  if (id === "top" && journey) {
    return journey.getBoundingClientRect().top + window.scrollY;
  }
  if (id === "now" && journey?.dataset.enhanced === "true") {
    return journey.getBoundingClientRect().top + window.scrollY + Number(journey.dataset.scrollDistance ?? 0);
  }
  return section.getBoundingClientRect().top + window.scrollY;
}

let cancelPendingFocus: (() => void) | undefined;

export function scrollToSection(id: string, immediate = false) {
  const top = sectionScrollTop(id);
  if (top === undefined) return;
  cancelPendingFocus?.();
  window.scrollTo({ top, behavior: immediate ? "instant" : "smooth" });
  if (!immediate) {
    if (location.hash !== `#${id}`) history.pushState(null, "", `#${id}`);
    const section = document.getElementById(id);
    const deadline = performance.now() + 8000;
    let timer = 0;
    const focus = () => {
      if (Math.abs(window.scrollY - top) < 4 && !section?.inert) {
        cancelPendingFocus?.();
        section?.focus({ preventScroll: true });
      } else if (performance.now() < deadline) {
        timer = window.setTimeout(focus, 100);
      } else cancelPendingFocus?.();
    };
    // A long smooth scroll and the prism's 0.6s scrub can finish at different
    // times. Focus after both the target is reached and the shelf is interactive.
    cancelPendingFocus = () => { window.clearTimeout(timer); cancelPendingFocus = undefined; };
    focus();
  }
}
