"use client";

import { useLayoutEffect } from "react";
import { gsap } from "@/lib/gsap";
import { aboutHoldEnd, prismScrollDistance } from "./aboutScroll";
import type { PrismFrame, PrismQuad, PrismSurface } from "./PrismSurface";

const smooth = (start: number, end: number, value: number) => {
  const t = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return t * t * (3 - 2 * t);
};

/** A real extruded mark hands its left outside wall to the prism pane. */
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
    const shelf = section?.querySelector<HTMLElement>("[data-upcoming]");
    const shelfCanvas = shelf?.querySelector<HTMLCanvasElement>("[data-shelf-canvas]");
    if (!section || !scene || !outline || !grid || !pluses || !index || !canvas || !fallback || !shelf || !shelfCanvas || !lines || !descriptions) return;

    let surface: PrismSurface | null = null;
    let contextLost = false;
    let disposed = false;
    let progress = 0;
    let shelfInteractive = false;
    const position = { value: 0 };

    const update = () => {
      progress = position.value;
      const shelfReady = shelf.dataset.shelfReady === "true";
      if (surface && shelfReady) surface.setShelfSource(shelfCanvas);
      shelf.style.opacity = String(smooth(0.84, 0.94, progress));
      const interactive = progress >= 0.98 && section.dataset.joinExit !== "true";
      section.dataset.prismSettled = progress >= 0.98 ? "true" : "false";
      shelf.style.pointerEvents = interactive ? "auto" : "none";
      shelf.inert = !interactive;
      if (shelfInteractive && !interactive) window.dispatchEvent(new Event("hackistan:shelf-exit"));
      shelfInteractive = interactive;
      // The live shelf is already behind this canvas. At the end, dissolve
      // its aligned distorted capture into the actual interactive scene.
      const prismOpacity = 1 - smooth(0.95, 1, progress);
      canvas.style.opacity = String(prismOpacity);
      fallback.style.opacity = String(prismOpacity);
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      const yaw = (mobile ? 65 : 70) * Math.PI / 180 * smooth(0.2, 0.44, progress);
      const scale = 1 + (mobile ? 1.2 : 1.6) * smooth(0.38, 0.68, progress);
      const width = scene.clientWidth;
      const height = scene.clientHeight;
      if (!width || !height) return;
      const markSize = outline.clientWidth;
      const sceneRect = scene.getBoundingClientRect();
      const rect = outline.getBoundingClientRect();
      const fallbackX = rect.left - sceneRect.left + markSize * 8 / 420;
      const fallbackTop = rect.top - sceneRect.top + markSize * 8 / 420;
      const fallbackBottom = rect.top - sceneRect.top + markSize * 408 / 420;
      // The pane stays on the projected, scaled extrusion wall until the
      // mark has finished growing; projection and rendering share one group.
      const wall: PrismQuad = surface?.projectLeftWall(markSize, yaw, scale) ?? [
        [fallbackX - 3, fallbackTop], [fallbackX + 3, fallbackTop],
        [fallbackX + 3, fallbackBottom], [fallbackX - 3, fallbackBottom],
      ];
      const spineX = wall.reduce((sum, point) => sum + point[0], 0) / 4;
      const spineY = wall.reduce((sum, point) => sum + point[1], 0) / 4;
      const wallHalfWidth = Math.abs(wall[1][0] - wall[0][0]) / 2;
      const wallHalfLength = (wall[3][1] + wall[2][1] - wall[0][1] - wall[1][1]) / 4;
      const corners = [[0, 0], [width, 0], [0, height], [width, height]];
      const coverWidth = Math.max(...corners.map(([x]) => Math.abs(x - spineX))) + width * 0.05;
      const coverLength = Math.max(wallHalfLength, Math.max(...corners.map(([, y]) => Math.abs(y - spineY))) + height * 0.05);
      const halfWidth = wallHalfWidth + width * 0.34 * smooth(0.68, 0.82, progress) +
        (coverWidth - wallHalfWidth - width * 0.34) * smooth(0.82, 0.88, progress);
      const halfLength = wallHalfLength + (coverLength - wallHalfLength) * smooth(0.68, 0.88, progress);
      const rectangle: PrismQuad = [
        [spineX - halfWidth, spineY - halfLength], [spineX + halfWidth, spineY - halfLength],
        [spineX + halfWidth, spineY + halfLength], [spineX - halfWidth, spineY + halfLength],
      ];
      const straighten = smooth(0.68, 0.76, progress);
      const quad = wall.map(([x, y], i) => [
        x + (rectangle[i][0] - x) * straighten,
        y + (rectangle[i][1] - y) * straighten,
      ]) as PrismQuad;
      const leftRail = Math.min(quad[0][0], quad[3][0]);
      const rightRail = Math.max(quad[1][0], quad[2][0]);
      // Both walls must have passed the viewport plus 4vw before any
      // fullscreen blend can escape the projected slab.
      const beyondSides = Math.min(-leftRail, rightRail - width) - width * 0.04;
      const takeover = smooth(0, width * 0.01, beyondSides) * smooth(0.86, 0.95, progress);
      const peak = smooth(0.45, 0.7, progress) * (1 - smooth(0.82, 1, progress));
      const handoff = surface && !contextLost ? smooth(0.18, 0.26, progress) : 0;
      outline.style.opacity = String((1 - handoff) * (1 - smooth(0.76, 0.86, progress)));
      const frame: PrismFrame = {
        quad, yaw, scale, markSize,
        markOpacity: handoff * (1 - smooth(0.76, 0.86, progress)),
        takeover,
        rail: smooth(0.3, 0.4, progress) * (1 - smooth(0.88, 1, progress)),
        panel: smooth(0.3, 0.39, progress),
        warp: peak * (mobile ? 0.83 : 1),
        chromatic: peak * (mobile ? 0.008 : 0.012),
        rainbow: smooth(0.3, 0.42, progress) * (1 - smooth(0.83, 1, progress)),
        shelfMix: shelfReady ? smooth(0.8, 0.96, progress) : 0,
      };

      if (progress <= 0.17) {
        canvas.style.visibility = "hidden";
        fallback.style.visibility = "hidden";
        return;
      }
      if (surface && !contextLost) {
        fallback.style.visibility = "hidden";
        canvas.style.visibility = "visible";
        if (!document.hidden) {
          try { surface.render(frame); }
          catch {
            contextLost = true;
            canvas.style.visibility = "hidden";
            outline.style.opacity = String(1 - smooth(0.76, 0.86, progress));
          }
        }
      }
      if (!surface || contextLost) {
        // The same rail geometry gives a navigable, reversible fallback.
        fallback.style.clipPath = takeover >= 1 ? "inset(0)" : `polygon(${quad.map(([x, y]) => `${x}px ${y}px`).join(", ")})`;
        fallback.style.visibility = progress > 0.3 ? "visible" : "hidden";
      }
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      update();
    };
    const onVisibility = () => { if (!document.hidden) update(); };
    const onResize = () => update();
    const onShelfReady = () => update();
    canvas.addEventListener("webglcontextlost", onContextLost);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);
    window.addEventListener("hackistan:shelf-ready", onShelfReady);

    // Prepare the optional GPU scene as About approaches, well before its
    // pinned hold ends. Keep the rest of the homepage free of this context.
    let requested = false;
    const load = () => {
      if (requested) return;
      requested = true;
      observer?.disconnect();
      void import("./PrismSurface").then(({ createPrismSurface }) => {
        if (disposed) return;
        surface = createPrismSurface(canvas);
        update();
      }).catch(() => { if (!disposed) update(); });
    };
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) load();
    }, { rootMargin: "150% 0px" });
    if (observer) observer.observe(section);
    else load();

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
        .to([grid, pluses], { opacity: 0, duration: 0.12 }, 0.76);
    }, section);

    update();
    return () => {
      disposed = true;
      observer?.disconnect();
      context.revert();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("hackistan:shelf-ready", onShelfReady);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      outline.style.removeProperty("opacity");
      canvas.style.removeProperty("visibility");
      canvas.style.removeProperty("opacity");
      fallback.style.removeProperty("visibility");
      fallback.style.removeProperty("opacity");
      fallback.style.removeProperty("clip-path");
      shelf.style.removeProperty("opacity");
      shelf.style.removeProperty("pointer-events");
      shelf.inert = true;
      delete section.dataset.prismSettled;
      surface?.dispose();
    };
  }, []);
  return null;
}
