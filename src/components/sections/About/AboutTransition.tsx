"use client";

import { useLayoutEffect } from "react";
import { gsap } from "@/lib/gsap";

/** About owns only its two rules, index, and statement; NOW stays in normal flow. */
export function AboutTransition() {
  useLayoutEffect(() => {
    const section = document.querySelector<HTMLElement>("#about");
    if (!section) return;
    const opening = section.querySelector<HTMLElement>("[data-about-opening]");
    const top = section.querySelector<HTMLElement>("[data-about-rule-top]");
    const bottom = section.querySelector<HTMLElement>("[data-about-rule-bottom]");
    const index = section.querySelector<HTMLElement>("[data-about-index]");
    const window = section.querySelector<HTMLElement>("[data-about-window]");
    const statement = section.querySelector<HTMLElement>("[data-about-statement]");
    if (!opening || !top || !bottom || !index || !window || !statement) return;

    const context = gsap.context(() => {
      gsap.timeline({ scrollTrigger: {
        trigger: section,
        start: "top 70%",
        end: () => `+=${Math.round(globalThis.window.innerHeight * 0.7)}`,
        scrub: true,
        invalidateOnRefresh: true,
      } })
        .fromTo([top, bottom, index], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.18 }, 0.02)
        .fromTo(top, { y: () => opening.offsetHeight / 2 }, { y: 0, duration: 0.67, ease: "power1.inOut" }, 0.18)
        .fromTo(bottom, { y: () => -opening.offsetHeight / 2 }, { y: 0, duration: 0.67, ease: "power1.inOut" }, 0.18)
        .fromTo(index, { y: () => opening.offsetHeight / 2 - index.offsetTop }, { y: 0, duration: 0.67, ease: "power1.inOut" }, 0.18)
        .fromTo(window, { clipPath: "inset(49% 0 49% 0)" }, { clipPath: "inset(0% 0 0% 0)", duration: 0.67, ease: "power1.inOut" }, 0.18)
        .fromTo(statement, { autoAlpha: 0, y: 24, scale: 1.06 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: "power1.out" }, 0.35);
    }, section);
    return () => context.revert();
  }, []);
  return null;
}
