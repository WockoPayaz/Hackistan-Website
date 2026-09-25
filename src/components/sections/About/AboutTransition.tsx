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
    const entranceDistance = () => window.innerHeight;
    const entranceTrigger = { trigger: section, start: "top top", end: () => "+=" + entranceDistance(), scrub: true, invalidateOnRefresh: true };

    const context = gsap.context(() => {
      // The section overlaps NOW's final viewport. The complete light world
      // physically rises from below while the stage itself remains sticky.
      gsap.fromTo(world,
        { yPercent: 100 },
        { yPercent: 0, ease: "none", scrollTrigger: entranceTrigger },
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
        scrub: 0.6,
        invalidateOnRefresh: true,
      };
      gsap.fromTo(grid, { y: 0 }, { y: () => -window.innerHeight * 0.45, ease: "none", scrollTrigger: { ...holdTrigger } });
      gsap.fromTo(pluses, { y: 0 }, { y: () => -window.innerHeight * 1.35, ease: "none", scrollTrigger: { ...holdTrigger } });
    }, section);

    return () => context.revert();
  }, []);
  return null;
}
