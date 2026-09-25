"use client";

import { useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/** The light world wipes in over the final 35vh of NOW; its lattice moves as one. */
export function AboutTransition() {
  useLayoutEffect(() => {
    const section = document.querySelector<HTMLElement>("[data-about]");
    const scene = section?.querySelector<HTMLElement>("[data-about-scene]");
    const world = section?.querySelector<HTMLElement>("[data-about-world]");
    const field = section?.querySelector<HTMLElement>("[data-about-technical-field]");
    if (!section || !scene || !world || !field) return;

    const context = gsap.context(() => {
      gsap.fromTo(world,
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 35%",
            end: "top top",
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // A fixed scene can expose NOW underneath throughout the short wipe.
              // The same scene becomes sticky at top: 0, with no visual jump.
              if (self.progress > 0 && self.progress < 1) {
                scene.dataset.aboutWiping = "true";
              } else {
                delete scene.dataset.aboutWiping;
              }
            },
          },
        },
      );

      gsap.fromTo(field, { y: 0 }, {
        y: () => 20 * parseFloat(getComputedStyle(field).left),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => {
      context.revert();
      delete scene.dataset.aboutWiping;
    };
  }, []);
  return null;
}
