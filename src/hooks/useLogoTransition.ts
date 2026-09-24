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

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const hero = root.querySelector<HTMLElement>("[data-hero]");
      const mark = root.querySelector<HTMLElement>("[data-mark-stage]");
      if (!hero || !mark) return;
      const distance = () => Math.round(window.innerHeight * (window.matchMedia("(min-width: 1024px)").matches ? movement.desktopScroll : movement.mobileScroll));
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
      timeline
        .to(mark, { scale: 1.09, duration: 0.35 }, 0.2)
        .to("[data-hero-edge]", { y: -16, autoAlpha: 0, duration: 0.22 }, 0.67)
        .to("[data-hero-wordmark]", { y: -26, autoAlpha: 0, duration: 0.27 }, 0.68)
        .to(mark, { y: -35, autoAlpha: 0, duration: 0.29, ease: ease.standard }, 0.71)
        .to(hero, { autoAlpha: 0, duration: 0.12 }, 0.88);

      return () => {
        timeline.kill();
        gsap.set([hero, mark, ...root.querySelectorAll("[data-hero-edge], [data-hero-wordmark]")], { clearProps: "all" });
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
    void document.fonts.ready.then(() => { if (!disposed) { ScrollTrigger.refresh(); hashJump(); } });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      media.revert();
      document.removeEventListener("click", anchorClick);
      window.removeEventListener("hashchange", hashJump);
    };
  }, [ref]);
}
