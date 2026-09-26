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
    if (!about || !shelf || !join) return;
    let exiting = false;
    const position = { value: 0 };
    const update = () => {
      // The fully opaque shelf masks Join as it begins sliding. Keep Join
      // hidden throughout About, the prism, and the settled browsing hold.
      const visible = position.value > 0;
      join.style.visibility = visible ? "visible" : "hidden";
      join.style.opacity = visible ? "1" : "0";
      const leaving = position.value > 0.015;
      const arrived = position.value >= 0.98;
      about.dataset.joinExit = leaving ? "true" : "false";
      if (leaving && !exiting) window.dispatchEvent(new Event("hackistan:shelf-exit"));
      exiting = leaving;
      const shelfInteractive = !leaving && about.dataset.prismSettled === "true";
      shelf.inert = !shelfInteractive;
      shelf.style.pointerEvents = shelfInteractive ? "auto" : "none";
      join.inert = !arrived;
      join.style.pointerEvents = arrived ? "auto" : "none";
    };
    const context = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: about,
          start: () => "top top-=" + joinExitStart(),
          end: () => "+=" + joinExitDistance(),
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
        onUpdate: update,
      }).to(position, { value: 1, duration: 1 }, 0)
        .to(shelf, { xPercent: 102, duration: 1 }, 0);
    }, about);
    update();
    return () => {
      context.revert();
      delete about.dataset.joinExit;
      shelf.style.removeProperty("pointer-events");
      join.style.removeProperty("pointer-events");
      join.style.removeProperty("opacity");
      join.style.removeProperty("visibility");
      shelf.inert = true;
      join.inert = true;
    };
  }, []);
  return null;
}
