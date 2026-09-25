"use client";

import { useLayoutEffect } from "react";
import { gsap } from "@/lib/gsap";
import { aboutHoldEnd, prismScrollDistance } from "./aboutScroll";
import type { PrismFrame, PrismSurface } from "./PrismSurface";

const smooth = (start: number, end: number, value: number) => {
  const t = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return t * t * (3 - 2 * t);
};

/** The Pass E H stays in the DOM. Its outer right pillar becomes the prism spine. */
export function PrismTransition() {
  useLayoutEffect(() => {
    const section = document.querySelector<HTMLElement>("[data-about]");
    const scene = section?.querySelector<HTMLElement>("[data-about-scene]");
    const outline = section?.querySelector<SVGSVGElement>("[data-about-outline]");
    const grid = section?.querySelector<HTMLElement>("[data-about-grid-plane]");
    const pluses = section?.querySelector<HTMLElement>("[data-about-plus-plane]");
    const index = section?.querySelector<HTMLElement>("[data-about-index]");
    const lines = section?.querySelectorAll<HTMLElement>("[data-about-heading-line]");
    const descriptions = section?.querySelectorAll<HTMLElement>("[data-about-description]");
    const canvas = section?.querySelector<HTMLCanvasElement>("[data-prism-canvas]");
    const fallback = section?.querySelector<HTMLElement>("[data-prism-fallback]");
    const destination = section?.querySelector<HTMLElement>("[data-prism-destination]");
    if (!section || !scene || !outline || !grid || !pluses || !index || !canvas || !fallback || !destination || !lines || !descriptions) return;

    let surface: PrismSurface | null = null;
    let attempted = false;
    let contextLost = false;
    let disposed = false;
    let progress = 0;
    const position = { value: 0 };

    const update = () => {
      progress = position.value;
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      const angle = (mobile ? 34 : 44) * Math.PI / 180 * smooth(0.2, 0.38, progress);
      outline.style.setProperty("--prism-rotation", `${angle * 180 / Math.PI}deg`);
      const width = scene.clientWidth;
      const height = scene.clientHeight;
      if (!width || !height) return;
      const markSize = parseFloat(getComputedStyle(outline).width);
      // SVG viewBox -8 -8 420 420: the right pillar's x=400 outer edge
      // sits 198 units to the right of the 202-unit viewBox center.
      const edgeX = markSize * 198 / 420;
      const edgeY = -markSize * 2 / 420;
      const spineX = width / 2 + edgeX * Math.cos(angle) - edgeY * Math.sin(angle);
      const spineY = height / 2 + edgeX * Math.sin(angle) + edgeY * Math.cos(angle);
      const maximum = Math.hypot(width, height) * 1.6;
      let halfWidth = 0;
      if (progress >= 0.42 && progress < 0.62) halfWidth = width * 0.09 * smooth(0.42, 0.62, progress);
      else if (progress >= 0.62 && progress < 0.8) halfWidth = width * (0.09 + 0.25 * smooth(0.62, 0.8, progress));
      else if (progress >= 0.8) halfWidth = width * 0.34 + (maximum - width * 0.34) * smooth(0.8, 0.94, progress);
      const halfLength = markSize * 200 / 420 + (maximum - markSize * 200 / 420) * smooth(0.4, 0.72, progress);
      const peak = smooth(0.45, 0.7, progress) * (1 - smooth(0.82, 1, progress));
      const frame: PrismFrame = {
        spineX, spineY, angle, halfWidth, halfLength,
        rail: smooth(0.32, 0.45, progress) * (1 - smooth(0.88, 1, progress)),
        panel: smooth(0.42, 0.54, progress),
        warp: peak * (mobile ? 0.83 : 1),
        chromatic: peak * (mobile ? 0.008 : 0.012),
        rainbow: smooth(0.35, 0.57, progress) * (1 - smooth(0.83, 1, progress)),
      };

      // Fetch the optional renderer as the H starts turning, before the rail
      // becomes visible. The rest of the site does not load this WebGL bundle.
      if (!attempted && progress > 0.2 && !document.hidden) {
        attempted = true;
        void import("./PrismSurface").then(({ createPrismSurface }) => {
          if (disposed) return;
          surface = createPrismSurface(canvas);
          update();
        }).catch(() => { if (!disposed) update(); });
      }
      if (progress <= 0.31) {
        canvas.style.visibility = "hidden";
        fallback.style.visibility = "hidden";
        return;
      }
      if (surface && !contextLost) {
        fallback.style.visibility = "hidden";
        canvas.style.visibility = "visible";
        if (!document.hidden) {
          try { surface.render(frame); }
          catch { contextLost = true; canvas.style.visibility = "hidden"; }
        }
      }
      if (!surface || contextLost) {
        // The same rail geometry gives a navigable, reversible fallback.
        const normalX = Math.cos(angle), normalY = Math.sin(angle);
        const tangentX = -normalY, tangentY = normalX;
        const points = [
          [-1, -1], [1, -1], [1, 1], [-1, 1],
        ].map(([side, along]) => `${spineX + side * halfWidth * normalX + along * halfLength * tangentX}px ${spineY + side * halfWidth * normalY + along * halfLength * tangentY}px`);
        fallback.style.clipPath = `polygon(${points.join(", ")})`;
        fallback.style.visibility = "visible";
      }
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      update();
    };
    const onVisibility = () => { if (!document.hidden) update(); };
    const onResize = () => update();
    canvas.addEventListener("webglcontextlost", onContextLost);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);

    const context = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: () => "top top-=" + aboutHoldEnd(),
          end: () => "+=" + prismScrollDistance(),
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
        onUpdate: update,
      })
        .to(position, { value: 1, duration: 1 }, 0)
        .fromTo(descriptions, { opacity: 1, y: 0 }, { opacity: 0, y: -12, duration: 0.12, stagger: 0.005, immediateRender: false }, 0)
        .fromTo(lines, { clipPath: "inset(0 0% 0 0)" }, { clipPath: "inset(0 100% 0 0)", duration: 0.08, stagger: 0.005, immediateRender: false }, 0.08)
        .fromTo(index, { opacity: 1 }, { opacity: 0, duration: 0.06, immediateRender: false }, 0.12)
        .fromTo([grid, pluses], { opacity: 1 }, { opacity: 0.28, duration: 0.14, immediateRender: false }, 0.14)
        .to([grid, pluses], { opacity: 0, duration: 0.12 }, 0.76)
        .to(outline, { opacity: 0, duration: 0.12 }, 0.78)
        .to(destination, { opacity: 1, duration: 0.1 }, 0.9);
    }, section);

    update();
    return () => {
      disposed = true;
      context.revert();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      outline.style.removeProperty("--prism-rotation");
      canvas.style.removeProperty("visibility");
      fallback.style.removeProperty("visibility");
      fallback.style.removeProperty("clip-path");
      surface?.dispose();
    };
  }, []);
  return null;
}
