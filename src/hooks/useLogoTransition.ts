"use client";

import { useLayoutEffect, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ease } from "@/lib/easing";
import { motion, movement } from "@/lib/motion";
import { mountainCrop, openCrop } from "@/components/brand/geometry";
import { scrollToSection } from "@/lib/navigation";

// Measure layout, not transformed bounds: refresh can happen halfway through
// the scene, after a resize or a font load.
function layoutBox(element: HTMLElement, stage: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = element;
  while (node && node !== stage) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y, width: element.offsetWidth, height: element.offsetHeight };
}

/** One native-scroll scene. The real workshop media is the transition surface:
 * no cloned content, scroll interception, animation loop, or WebGL context.
 */
export function useLogoTransition(ref: RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mediaQueries = gsap.matchMedia();
    let intro: gsap.Context | undefined;
    let disposed = false;

    const setupIntro = () => {
      if (disposed || reduced.matches || window.scrollY > 10 || location.hash === "#now") return;
      let returning = false;
      try { returning = sessionStorage.getItem("hackistan:entered:v1") === "1"; sessionStorage.setItem("hackistan:entered:v1", "1"); } catch { /* Privacy mode: visual entry still works. */ }
      intro = gsap.context(() => {
        const duration = returning ? motion.instant : motion.slow;
        const timeline = gsap.timeline({ defaults: { ease: ease.cinematic, duration } });
        timeline.from("[data-hero-mark] [data-assembly-part='left']", { x: -movement.fragment, y: 20 }, 0)
          .from("[data-hero-mark] [data-assembly-part='right']", { x: movement.fragment, y: -20 }, 0)
          .from("[data-hero-mark] [data-assembly-part='bridge']", { y: 18, scale: 0.93, transformOrigin: "50% 50%" }, 0)
          .from("[data-hero-entry]", { clipPath: "inset(100% 0 0 0)", y: 24 }, returning ? 0 : motion.fast);
      }, root);
    };

    mediaQueries.add({
      desktop: "(min-width: 1024px)",
      mobile: "(max-width: 1023px)",
      reduced: "(prefers-reduced-motion: reduce)",
    }, (context) => {
      const { desktop, reduced: reduce } = context.conditions!;
      const now = root.querySelector<HTMLElement>("[data-now]");
      const hero = root.querySelector<HTMLElement>("[data-hero]");
      const mark = root.querySelector<HTMLElement>("[data-mark-stage]");
      const media = root.querySelector<HTMLElement>("[data-workshop-media]");
      const stage = root.firstElementChild as HTMLElement;
      if (reduce || !now || !hero || !mark || !media || !stage) return;

      const distance = () => Math.round(window.innerHeight * (desktop ? movement.desktopScroll : movement.mobileScroll));
      root.dataset.enhanced = "true";
      let placement = { x: 0, y: 0, scale: 1 };
      const measure = () => {
        root.style.setProperty("--scene-height", `${Math.max(window.innerHeight, now.offsetHeight, hero.offsetHeight)}px`);
        root.style.setProperty("--scroll-distance", `${distance()}px`);
        root.dataset.scrollDistance = String(distance());
        const markBox = layoutBox(mark, stage);
        const mediaBox = layoutBox(media, stage);
        placement = {
          x: markBox.x + markBox.width / 2 - (mediaBox.x + mediaBox.width / 2),
          y: markBox.y + markBox.height * 0.53 - (mediaBox.y + mediaBox.height / 2),
          scale: markBox.width / mediaBox.width * 0.97,
        };
      };
      measure();

      gsap.set(now, { pointerEvents: "none" });
      gsap.set(media, { autoAlpha: 0 });
      gsap.set(root.querySelectorAll("[data-now-reveal]"), { autoAlpha: 0, y: 22 });
      gsap.set(root.querySelectorAll("[data-now-title]"), { yPercent: 110 });
      const timeline = gsap.timeline({
        defaults: { ease: ease.linear },
        scrollTrigger: {
          trigger: root, start: "top top", end: () => `+=${distance()}`,
          scrub: true, invalidateOnRefresh: true,
          onRefreshInit: measure,
          onUpdate: (self) => {
            const incoming = self.progress > 0.65;
            now.style.pointerEvents = incoming ? "auto" : "none";
            hero.style.pointerEvents = incoming ? "none" : "auto";
          },
        },
      });
      timeline.to("[data-hero-edge]", { y: -24, autoAlpha: 0, duration: 0.22 }, 0)
        .to("[data-hero-wordmark]", { y: 60, clipPath: "inset(0 0 100% 0)", duration: 0.3 }, 0)
        .to(mark, { scale: desktop ? 1.45 : 1.15, duration: 0.44 }, 0)
        .to("[data-hero-mark] [data-logo-part='left']", { x: () => -window.innerWidth * 0.75, duration: 0.48, ease: ease.exit }, 0.14)
        .to("[data-hero-mark] [data-logo-part='right']", { x: () => window.innerWidth * 0.75, duration: 0.48, ease: ease.exit }, 0.14)
        .to("[data-hero-mark] [data-logo-part='bridge']", { y: () => -window.innerHeight, scale: 1.6, duration: 0.49, ease: ease.exit }, 0.19)
        .to(media, { autoAlpha: 1, duration: 0.08 }, 0.18)
        .fromTo(media,
          { x: () => placement.x, y: () => placement.y, scale: () => placement.scale, clipPath: mountainCrop },
          { x: 0, y: 0, scale: 1, clipPath: openCrop, duration: 0.61, ease: ease.standard }, 0.27)
        .to("[data-now-title]", { yPercent: 0, stagger: 0.035, duration: 0.22, ease: ease.standard }, 0.69)
        .to("[data-now-reveal]", { autoAlpha: 1, y: 0, stagger: 0.018, duration: 0.2, ease: ease.standard }, 0.74)
        .set(hero, { visibility: "hidden" }, 1);

      const image = root.querySelector("[data-workshop-image]");
      if (image && desktop) gsap.fromTo(image, { scale: movement.mediaScale }, { scale: 1, ease: ease.linear, scrollTrigger: { trigger: root, start: () => `top+=${distance() * 0.5} top`, end: "bottom top", scrub: true } });
      const resizeObserver = new ResizeObserver(() => ScrollTrigger.refresh());
      // Observe content, never the height we write, to avoid a resize feedback loop.
      const composition = now.firstElementChild;
      if (composition) resizeObserver.observe(composition);
      return () => {
        resizeObserver.disconnect();
        timeline.kill();
        delete root.dataset.enhanced;
        delete root.dataset.scrollDistance;
        root.style.removeProperty("--scene-height");
        root.style.removeProperty("--scroll-distance");
        hero.style.removeProperty("pointer-events");
        now.style.removeProperty("pointer-events");
      };
    }, root);

    void document.fonts.ready.then(() => { if (!disposed) { ScrollTrigger.refresh(); setupIntro(); } });
    const motionChanged = () => { if (reduced.matches) intro?.revert(); };
    reduced.addEventListener("change", motionChanged);
    const hashJump = () => { if (location.hash === "#now" || location.hash === "#top") scrollToSection(location.hash.slice(1), true); };
    const anchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href="#now"], a[href="#top"]');
      if (!anchor) return;
      event.preventDefault();
      intro?.revert();
      scrollToSection(anchor.hash.slice(1));
    };
    document.addEventListener("click", anchorClick);
    window.addEventListener("hashchange", hashJump);
    const frame = requestAnimationFrame(() => { ScrollTrigger.refresh(); hashJump(); });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      intro?.revert();
      mediaQueries.revert();
      document.removeEventListener("click", anchorClick);
      window.removeEventListener("hashchange", hashJump);
      reduced.removeEventListener("change", motionChanged);
    };
  }, [ref]);
}
