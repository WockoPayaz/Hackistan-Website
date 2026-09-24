"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { ease } from "@/lib/easing";
import { motion, movement } from "@/lib/motion";

export function usePointerParallax(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const media = gsap.matchMedia();
    media.add("(hover: hover) and (pointer: fine) and (min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const device = navigator as Navigator & { deviceMemory?: number };
      if ((device.deviceMemory ?? 8) <= 4 || (navigator.hardwareConcurrency ?? 8) <= 2) return;
      let inView = true;
      const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; });
      observer.observe(element);
      const settings = { duration: motion.normal, ease: ease.standard };
      const x = gsap.quickTo(element, "x", settings);
      const y = gsap.quickTo(element, "y", settings);
      const rx = gsap.quickTo(element, "rotationX", settings);
      const ry = gsap.quickTo(element, "rotationY", settings);
      const move = (event: PointerEvent) => {
        if (!inView || document.hidden || window.scrollY > window.innerHeight * 0.2) return;
        const px = (event.clientX / window.innerWidth - 0.5) * 2;
        const py = (event.clientY / window.innerHeight - 0.5) * 2;
        x(px * movement.pointer.x);
        y(py * movement.pointer.y);
        rx(-py * movement.pointer.rotation);
        ry(px * movement.pointer.rotation);
      };
      const reset = () => { x(0); y(0); rx(0); ry(0); };
      window.addEventListener("pointermove", move, { passive: true });
      document.addEventListener("pointerleave", reset);
      document.addEventListener("visibilitychange", reset);
      return () => {
        observer.disconnect();
        window.removeEventListener("pointermove", move);
        document.removeEventListener("pointerleave", reset);
        document.removeEventListener("visibilitychange", reset);
        [x, y, rx, ry].forEach((tween) => tween.tween.kill());
        gsap.set(element, { clearProps: "transform" });
      };
    });
    return () => media.revert();
  }, [ref]);
}
