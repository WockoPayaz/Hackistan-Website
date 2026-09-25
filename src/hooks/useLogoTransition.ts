"use client";

import { useLayoutEffect, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
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
      const stage = root.querySelector<HTMLElement>("[data-hero-stage]");
      const composition = root.querySelector<HTMLElement>("[data-now-composition]");
      const workshopMedia = root.querySelector<HTMLElement>("[data-workshop-media]");
      const nowIndex = root.querySelector<HTMLElement>("[data-now] [data-now-reveal]");
      const nowTitle = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-now-title]"));
      const nowDetails = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-now-reveal]:not(:first-child)"));
      const ribbons = hero?.querySelector<HTMLElement>("[data-hero-ribbons]");
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
          onUpdate: (self) => {
            // NOW is beneath the transparent sticky stage; release hit testing as it enters.
            if (stage) stage.style.pointerEvents = self.progress > (reduced ? 0.5 : 0.6) ? "none" : "";
          },
        },
      });
      if (reduced) {
        timeline
          .to(left, { x: () => -mark.offsetWidth * 0.12, duration: 0.18 }, 0.08)
          .to(right, { x: () => mark.offsetWidth * 0.12, duration: 0.18 }, 0.08)
          .to(bridge, { y: () => -mark.offsetHeight * 0.08, duration: 0.18 }, 0.08)
          .to(mark, { autoAlpha: 0, duration: 0.18 }, 0.6)
          .to("[data-hero-wordmark], [data-hero-ribbons], [data-hero-edge]", { autoAlpha: 0, duration: 0.16 }, 0.72)
          .to(hero, { autoAlpha: 0, duration: 0.08 }, 0.9);
        if (workshopMedia) timeline.fromTo(workshopMedia, { autoAlpha: 0.6 }, { autoAlpha: 1, duration: 0.18 }, 0.56);
        if (nowIndex) timeline.fromTo(nowIndex, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, 0.65);
        if (nowTitle.length) timeline.fromTo(nowTitle, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.14 }, 0.73);
        if (nowDetails.length) timeline.fromTo(nowDetails, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12 }, 0.8);
      } else {
        timeline
          // A single accelerating scroll curve per piece: no pause or second launch.
          .to(left, { x: () => -(window.innerWidth / 2 + mark.offsetWidth * 1.2), duration: 0.82, ease: "power2.in" }, 0.1)
          .to(right, { x: () => window.innerWidth / 2 + mark.offsetWidth * 1.2, duration: 0.82, ease: "power2.in" }, 0.1)
          .to(bridge, { y: () => -(window.innerHeight / 2 + mark.offsetHeight * 1.2), duration: 0.82, ease: "power2.in" }, 0.1)
          .to(mark, { scale: 1.035, duration: 0.65, ease: "power1.out" }, 0.1)
          .to("[data-hero-edge]", { y: -12, autoAlpha: 0, duration: 0.28 }, 0.22)
          .to("[data-hero-ribbons]", { y: -14, autoAlpha: 0, duration: 0.38 }, 0.39)
          .to("[data-hero-wordmark]", { y: -30, autoAlpha: 0, duration: 0.43 }, 0.39)
          .to(hero, { autoAlpha: 0, duration: 0.04 }, 0.96);
        // The media rises with its own section while the H still frames the opening.
        if (composition) timeline.fromTo(composition, { y: () => -window.innerHeight * 0.16 }, { y: 0, duration: 0.42, ease: "power1.out" }, 0.58);
        if (workshopMedia) timeline.fromTo(workshopMedia,
          { autoAlpha: 0.25, clipPath: "inset(12% 0 12% 0)", scale: 1.045 },
          { autoAlpha: 1, clipPath: "inset(0% 0 0% 0)", scale: 1, duration: 0.23, ease: "power1.out" }, 0.62);
        if (nowIndex) timeline.fromTo(nowIndex, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.16 }, 0.7);
        if (nowTitle.length) timeline.fromTo(nowTitle, { autoAlpha: 0, yPercent: 18 }, { autoAlpha: 1, yPercent: 0, duration: 0.17 }, 0.76);
        if (nowDetails.length) timeline.fromTo(nowDetails, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.16 }, 0.83);
      }

      // At #now there are no residual inline transforms or clipping on the normal section.
      const nowAnimated = [composition, workshopMedia, nowIndex, ...nowTitle, ...nowDetails].filter((element): element is HTMLElement => Boolean(element));
      timeline.set(nowAnimated, { clearProps: "transform,opacity,visibility,clipPath" }, 1);

      return () => {
        timeline.kill();
        gsap.set([hero, mark, left, bridge, right, ribbons, ...root.querySelectorAll("[data-hero-edge], [data-hero-wordmark]"), ...nowAnimated].filter(Boolean), { clearProps: "all" });
        if (stage) stage.style.pointerEvents = "";
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
