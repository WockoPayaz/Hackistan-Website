"use client";

import { useLayoutEffect, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ease } from "@/lib/easing";
import { movement } from "@/lib/motion";
import { scrollToSection } from "@/lib/navigation";

/** Native document scrolling drives a viewport-sized sticky hero. NOW stays in flow. */
export function useLogoTransition(ref: RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const media = gsap.matchMedia();
    let disposed = false;

    media.add({
      full: "(prefers-reduced-motion: no-preference)",
      reduced: "(prefers-reduced-motion: reduce)",
    }, (context) => {
      const reduced = Boolean(context.conditions?.reduced);
      const hero = root.querySelector<HTMLElement>("[data-hero]");
      const mark = root.querySelector<HTMLElement>("[data-mark-stage]");
      if (!hero || !mark) return;
      const parts = ["left", "bridge", "right"].map((part) => mark.querySelector<SVGElement>(`[data-logo-part="${part}"]`));
      if (parts.some((part) => !part)) return;
      const [left, bridge, right] = parts as SVGElement[];
      const distance = () => Math.round(window.innerHeight * (reduced ? movement.reducedScroll : window.matchMedia("(min-width: 1024px)").matches ? movement.desktopScroll : movement.mobileScroll));
      const measure = () => {
        root.style.setProperty("--scroll-distance", `${distance()}px`);
        root.dataset.scrollDistance = String(distance());
      };
      measure();
      root.dataset.enhanced = "true";

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: true,
          invalidateOnRefresh: true,
          onRefreshInit: measure,
        },
      });
      if (reduced) {
        timeline
          .to(left, { x: () => -mark.offsetWidth * 0.12, duration: 0.18 }, 0.08)
          .to(right, { x: () => mark.offsetWidth * 0.12, duration: 0.18 }, 0.08)
          .to(bridge, { y: () => -mark.offsetHeight * 0.08, duration: 0.18 }, 0.08)
          .to(mark, { autoAlpha: 0, duration: 0.18 }, 0.6)
          .to("[data-hero-wordmark], [data-hero-edge]", { autoAlpha: 0, duration: 0.16 }, 0.72)
          .to(hero, { autoAlpha: 0, duration: 0.08 }, 0.9);
      } else {
        timeline
          .to(mark, { scale: 1.06, duration: 0.4 }, 0.1)
          .to(left, { x: () => -mark.offsetWidth * 0.28, duration: 0.4 }, 0.1)
          .to(right, { x: () => mark.offsetWidth * 0.28, duration: 0.4 }, 0.1)
          .to(bridge, { y: () => -mark.offsetHeight * 0.22, duration: 0.4 }, 0.1)
          // Keep the separated mark readable before the quicker outward exit.
          .to(left, { x: () => -(window.innerWidth + mark.offsetWidth), duration: 0.13, ease: ease.exit }, 0.65)
          .to(right, { x: () => window.innerWidth + mark.offsetWidth, duration: 0.13, ease: ease.exit }, 0.65)
          .to(bridge, { y: () => -(window.innerHeight + mark.offsetHeight), duration: 0.13, ease: ease.exit }, 0.65)
          .to("[data-hero-wordmark]", { y: -26, autoAlpha: 0, duration: 0.16 }, 0.79)
          .to("[data-hero-edge]", { y: -16, autoAlpha: 0, duration: 0.16 }, 0.79)
          .to(hero, { autoAlpha: 0, duration: 0.05 }, 0.95);
      }

      return () => {
        timeline.kill();
        gsap.set([hero, mark, left, bridge, right, ...root.querySelectorAll("[data-hero-edge], [data-hero-wordmark]")], { clearProps: "all" });
        delete root.dataset.enhanced;
        delete root.dataset.scrollDistance;
        root.style.removeProperty("--scroll-distance");
      };
    }, root);

    const hashJump = () => {
      if (location.hash === "#now" || location.hash === "#top") scrollToSection(location.hash.slice(1), true);
    };
    const anchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>('a[href="#now"], a[href="#top"]');
      if (!anchor) return;
      event.preventDefault();
      scrollToSection(anchor.hash.slice(1));
    };
    document.addEventListener("click", anchorClick);
    window.addEventListener("hashchange", hashJump);
    const frame = requestAnimationFrame(() => { ScrollTrigger.refresh(); hashJump(); });
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const preferenceChanged = () => requestAnimationFrame(() => { ScrollTrigger.refresh(); hashJump(); });
    preference.addEventListener("change", preferenceChanged);
    void document.fonts.ready.then(() => { if (!disposed) { ScrollTrigger.refresh(); hashJump(); } });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      media.revert();
      preference.removeEventListener("change", preferenceChanged);
      document.removeEventListener("click", anchorClick);
      window.removeEventListener("hashchange", hashJump);
    };
  }, [ref]);
}
