"use client";

import { useLayoutEffect } from "react";
import { gsap } from "@/lib/gsap";

/** Scroll owns the scene entrance and upward registration drift; HERO/NOW are untouched. */
export function AboutTransition() {
  useLayoutEffect(() => {
    const section = document.querySelector<HTMLElement>("[data-about]");
    if (!section) return;
    const grid = section.querySelector<HTMLElement>("[data-about-grid]");
    const outline = section.querySelector<SVGSVGElement>("[data-about-outline]");
    const registrations = gsap.utils.toArray<HTMLElement>(section.querySelectorAll("[data-about-registration]"));
    const copy = gsap.utils.toArray<HTMLElement>(section.querySelectorAll("[data-about-copy]"));
    if (!grid || !outline || registrations.length === 0) return;

    const context = gsap.context(() => {
      gsap.timeline({ scrollTrigger: {
        trigger: section,
        start: "top 78%",
        end: "top top",
        scrub: true,
        invalidateOnRefresh: true,
      } })
        .fromTo(grid, { opacity: 0 }, { opacity: 1, duration: 0.55 }, 0)
        .fromTo(registrations, { opacity: 0 }, { opacity: (index) => [0.3, 0.18, 0.11][Number(registrations[index].dataset.depth)], duration: 0.56, stagger: 0.008 }, 0.08)
        .fromTo(outline, { opacity: 0, scale: 1.04, y: 12 }, { opacity: 1, scale: 1, y: 0, duration: 0.64, ease: "power1.out" }, 0.19)
        .fromTo(copy, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.33, stagger: 0.04 }, 0.58);

      gsap.fromTo(registrations,
        { y: () => window.innerHeight * 0.09 },
        { y: (index) => -window.innerHeight * (0.34 + Number(registrations[index].dataset.depth) * 0.065), duration: 1, ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true } });
    }, section);
    return () => context.revert();
  }, []);
  return null;
}
