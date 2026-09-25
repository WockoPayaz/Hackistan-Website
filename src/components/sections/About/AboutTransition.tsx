"use client";

import { useLayoutEffect } from "react";
import { gsap } from "@/lib/gsap";

/** A scroll-scrubbed light reveal, then two independent vertical field layers. */
export function AboutTransition() {
  useLayoutEffect(() => {
    const section = document.querySelector<HTMLElement>("[data-about]");
    const world = section?.querySelector<HTMLElement>("[data-about-world]");
    const grid = section?.querySelector<HTMLElement>("[data-about-grid-plane]");
    const pluses = section?.querySelector<HTMLElement>("[data-about-plus-plane]");
    const headings = section?.querySelectorAll<HTMLElement>("[data-about-heading]");
    const descriptions = section?.querySelectorAll<HTMLElement>("[data-about-description]");
    if (!section || !world || !grid || !pluses || headings?.length !== 2 || descriptions?.length !== 5) return;

    const hackistanLines = headings[0].querySelectorAll<HTMLElement>("[data-about-heading-line]");
    const clubLines = headings[1].querySelectorAll<HTMLElement>("[data-about-heading-line]");
    const entranceDistance = () => window.innerHeight * 0.85;
    const entranceTrigger = { trigger: section, start: "top top", end: () => "+=" + entranceDistance(), scrub: true, invalidateOnRefresh: true };

    const context = gsap.context(() => {
      // The section overlaps NOW's final viewport. Its sticky stage never changes
      // positioning; clipping this entire world exposes NOW above the rising edge.
      gsap.fromTo(world,
        { clipPath: "inset(100% 0 0 0)" },
        { clipPath: "inset(0% 0 0 0)", ease: "none", scrollTrigger: entranceTrigger },
      );

      gsap.timeline({ scrollTrigger: { ...entranceTrigger }, defaults: { ease: "none" } })
        .to({}, { duration: 1 }, 0)
        .fromTo(hackistanLines, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.13, stagger: 0.06 }, 0.53)
        .fromTo(Array.from(descriptions).slice(0, 2), { opacity: 0, y: 11 }, { opacity: 1, y: 0, duration: 0.13, stagger: 0.025 }, 0.67)
        .fromTo(clubLines, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.13, stagger: 0.06 }, 0.68)
        .fromTo(Array.from(descriptions).slice(2), { opacity: 0, y: 11 }, { opacity: 1, y: 0, duration: 0.11, stagger: 0.02 }, 0.84);

      const holdTrigger = {
        trigger: section,
        start: () => "top top-=" + entranceDistance(),
        end: "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true,
      };
      gsap.fromTo(grid, { y: 0 }, { y: () => -window.innerHeight * 0.75, ease: "none", scrollTrigger: { ...holdTrigger } });
      gsap.fromTo(pluses, { y: 0 }, { y: () => -window.innerHeight * 1.55, ease: "none", scrollTrigger: { ...holdTrigger } });
    }, section);

    return () => context.revert();
  }, []);
  return null;
}
