"use client";

import { useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const depthOpacity = [0.34, 0.21, 0.115];
const depthTravel = [0.72, 0.5, 0.3];

/** A quick palette switch followed by a separate, reversible identity reveal. */
export function AboutTransition() {
  useLayoutEffect(() => {
    const section = document.querySelector<HTMLElement>("[data-about]");
    if (!section) return;
    const scene = section.querySelector<HTMLElement>("[data-about-scene]");
    const sheet = section.querySelector<HTMLElement>("[data-about-sheet]");
    const grid = section.querySelector<HTMLElement>("[data-about-grid]");
    const outline = section.querySelector<SVGSVGElement>("[data-about-outline]");
    const index = section.querySelector<HTMLElement>("[data-about-index]");
    const registrations = gsap.utils.toArray<HTMLElement>(section.querySelectorAll("[data-about-registration]"));
    const headings = gsap.utils.toArray<HTMLElement>(section.querySelectorAll("[data-about-heading]"));
    const descriptions = gsap.utils.toArray<HTMLElement>(section.querySelectorAll("[data-about-description]"));
    if (!scene || !sheet || !grid || !outline || !index || headings.length !== 2 || descriptions.length !== 5) return;

    let wipe: gsap.core.Tween | undefined;
    const context = gsap.context(() => {
      const showSheet = () => {
        wipe = gsap.to(sheet, { clipPath: "inset(0% 0 0% 0)", duration: 0.22, ease: "power2.inOut", overwrite: true });
        scene.dataset.aboutLight = "true";
      };
      const hideSheet = () => {
        wipe = gsap.to(sheet, { clipPath: "inset(100% 0 0% 0)", duration: 0.22, ease: "power2.inOut", overwrite: true });
        delete scene.dataset.aboutLight;
      };
      // The SSR sheet is warm white; initialize the offscreen scene to black only
      // after hydration, and resolve restored scroll positions without a flash.
      const isAtAbout = section.getBoundingClientRect().top <= window.innerHeight * 0.88;
      gsap.set(sheet, { clipPath: isAtAbout ? "inset(0% 0 0% 0)" : "inset(100% 0 0% 0)" });
      if (isAtAbout) scene.dataset.aboutLight = "true";
      ScrollTrigger.create({ trigger: section, start: "top 88%", end: "bottom top", onEnter: showSheet, onEnterBack: showSheet, onLeaveBack: hideSheet });

      gsap.timeline({ scrollTrigger: {
        trigger: section,
        start: "top 72%",
        end: "top top",
        scrub: true,
        invalidateOnRefresh: true,
      } })
        .fromTo(grid, { opacity: 0 }, { opacity: 1, duration: 0.22 }, 0.12)
        .fromTo(registrations, { opacity: 0 }, { opacity: (i) => depthOpacity[Number(registrations[i].dataset.depth)], duration: 0.22, stagger: 0.002 }, 0.14)
        .fromTo(outline, { opacity: 0, scale: 1.025, y: 10 }, { opacity: 1, scale: 1, y: 0, duration: 0.24, ease: "power1.out" }, 0.19)
        .fromTo(index, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.16 }, 0.28)
        .fromTo(headings[0], { opacity: 0, yPercent: 75 }, { opacity: 1, yPercent: 0, duration: 0.18 }, 0.32)
        .fromTo(descriptions.slice(0, 2), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.18, stagger: 0.025 }, 0.4)
        .fromTo(headings[1], { opacity: 0, yPercent: 75 }, { opacity: 1, yPercent: 0, duration: 0.18 }, 0.46)
        .fromTo(descriptions.slice(2), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.18, stagger: 0.022 }, 0.53)
        .to({}, { duration: 0.21 }, 0.79);

      // The identity holds while the registration field rises through one pinned viewport.
      gsap.fromTo(registrations, { y: 0 }, {
        y: (i) => -window.innerHeight * depthTravel[Number(registrations[i].dataset.depth)],
        duration: 1, ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: true, invalidateOnRefresh: true },
      });
    }, section);
    return () => {
      wipe?.kill();
      context.revert();
      delete scene.dataset.aboutLight;
    };
  }, []);
  return null;
}
