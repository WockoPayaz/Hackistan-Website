"use client";

import { useLayoutEffect } from "react";
import { gsap } from "@/lib/gsap";
import { joinExitDistance, joinExitStart } from "@/components/sections/About/aboutScroll";

/** Slide the complete settled shelf right to reveal the light Join world. */
export function JoinTransition() {
  useLayoutEffect(() => {
    const about = document.querySelector<HTMLElement>("[data-about]");
    const shelf = about?.querySelector<HTMLElement>("[data-upcoming]");
    const join = about?.querySelector<HTMLElement>("[data-join]");
    const cta = join?.querySelector<HTMLAnchorElement>("[data-join-cta]");
    if (!about || !shelf || !join || !cta) return;
    const shelfTravel = 102;
    let exiting = false;
    const update = () => {
      // The fully opaque shelf masks Join as it begins sliding. Keep Join
      // hidden throughout About, the prism, and the settled browsing hold.
      // ScrollTrigger may restore a transform on refresh without firing a tween update.
      const slide = Number(gsap.getProperty(shelf, "xPercent")) / shelfTravel;
      const visible = slide > 0;
      const leaving = slide > 0.015;
      // Use the same moving edge for painting and hit testing. The inert
      // shelf cannot block clicks on the covered portion of a link underneath.
      const exposed = Math.min(100, slide * shelfTravel);
      const ctaExposed = exposed > 0 && cta.offsetLeft < join.clientWidth * exposed / 100;
      join.style.visibility = visible ? "visible" : "hidden";
      join.style.opacity = visible ? "1" : "0";
      join.style.clipPath = exposed < 100 ? `inset(0 ${100 - exposed}% 0 0)` : "none";
      about.dataset.joinExit = leaving ? "true" : "false";
      if (leaving && !exiting) window.dispatchEvent(new Event("hackistan:shelf-exit"));
      exiting = leaving;
      const shelfInteractive = !leaving && about.dataset.prismSettled === "true";
      shelf.inert = !shelfInteractive;
      shelf.style.pointerEvents = shelfInteractive ? "auto" : "none";
      join.inert = !ctaExposed;
      join.style.pointerEvents = ctaExposed ? "auto" : "none";
      // Let wheel/touch scrolling finish the reveal before the mobile panel scrolls internally.
      join.style.overflowY = exposed < 100 ? "hidden" : "auto";
    };
    const context = gsap.context(() => {
      gsap.fromTo(shelf, { xPercent: 0 }, {
        xPercent: shelfTravel,
        duration: 1,
        ease: "none",
        onUpdate: update,
        scrollTrigger: {
          trigger: about,
          start: () => "top top-=" + joinExitStart(),
          end: () => "+=" + joinExitDistance(),
          scrub: 0.6,
          invalidateOnRefresh: true,
          onRefresh: update,
        },
      });
    }, about);
    update();
    return () => {
      context.revert();
      delete about.dataset.joinExit;
      shelf.style.removeProperty("pointer-events");
      join.style.removeProperty("pointer-events");
      join.style.removeProperty("clip-path");
      join.style.removeProperty("overflow-y");
      join.style.removeProperty("opacity");
      join.style.removeProperty("visibility");
      shelf.inert = true;
      join.inert = true;
    };
  }, []);
  return null;
}
