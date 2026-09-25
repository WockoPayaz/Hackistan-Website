export function sectionScrollTop(id: string): number | undefined {
  const section = document.getElementById(id);
  if (!section) return;
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
    const focus = () => {
      cancelPendingFocus?.();
      if (Math.abs(window.scrollY - top) < 4) section?.focus({ preventScroll: true });
    };
    if (Math.abs(window.scrollY - top) < 4) focus();
    else {
      // Move focus only after the destination is visibly resolved.
      const timer = window.setTimeout(focus, 1200);
      window.addEventListener("scrollend", focus, { once: true });
      cancelPendingFocus = () => {
        window.clearTimeout(timer);
        window.removeEventListener("scrollend", focus);
        cancelPendingFocus = undefined;
      };
    }
  }
}
