"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { markGeometry } from "@/components/brand/geometry";
import styles from "./Hero.module.css";

/** The drafting marks use the same 400-unit coordinates as the actual mark. */
export function ConstructionDrawing() {
  return <svg className={styles.construction} data-intro-drawing viewBox="-8 -8 420 420" aria-hidden="true" focusable="false">
    <g data-intro-guides>
      <path d="M-7 0H112M288 0H407M-7 400H112M288 400H407M0 -7V105M400 -7V105M0 295V407M400 295V407" />
      <path data-intro-desktop d="M105 92V309M295 92V309M-7 272H407M189 112V195M238 165V218" />
      <circle cx="189" cy="129" r="2" /><circle cx="238" cy="193" r="2" />
    </g>
    <path data-intro-bridge d={markGeometry.bridge} />
  </svg>;
}

/** Four paired extensions: only the outer H bar boundaries reach the viewport. */
export function ViewportGuides() {
  return <svg className={styles.viewportGuides} data-intro-viewport-guides aria-hidden="true" focusable="false">
    {Array.from({ length: 8 }, (_, index) =>
      <path key={index} data-intro-ray={index} pathLength="100" strokeDasharray="100" strokeDashoffset="100" />)}
  </svg>;
}

/** A document-load entrance: the existing scroll timeline never owns these opacity values. */
export function HeroEntrance() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    if (!hero) return;
    if (hero.dataset.intro === "done") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mark = hero.querySelector<HTMLElement>("[data-mark-stage]");
    const ribbons = hero.querySelector<HTMLElement>("[class*='ribbonField']");
    const wordmark = hero.querySelector<HTMLElement>("[data-hero-wordmark]");
    const edges = gsap.utils.toArray<HTMLElement>(hero.querySelectorAll("[data-hero-edge]"));
    const drawing = hero.querySelector<SVGSVGElement>("[data-intro-drawing]");
    const viewportGuides = hero.querySelector<SVGSVGElement>("[data-intro-viewport-guides]");
    const rays = viewportGuides ? gsap.utils.toArray<SVGPathElement>(viewportGuides.querySelectorAll("[data-intro-ray]")) : [];
    const guides = drawing?.querySelector<SVGGElement>("[data-intro-guides]");
    const bridge = drawing?.querySelector<SVGPathElement>("[data-intro-bridge]");
    if (!mark || !ribbons || !wordmark || !drawing || !guides || !bridge || !viewportGuides || rays.length !== 8) {
      hero.dataset.intro = "done";
      return;
    }
    const targets = [ribbons, wordmark, ...edges];
    let timeline: gsap.core.Timeline | undefined;
    let finished = false;
    let timer = 0;
    let observer: ResizeObserver | undefined;
    const measure = () => {
      const bounds = viewportGuides.getBoundingClientRect();
      const box = mark.getBoundingClientRect();
      if (!bounds.width || !bounds.height || !box.width || !box.height) return;
      viewportGuides.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
      // The mark viewBox is -8 -8 420 420; its true outer geometry is 0..400.
      const left = box.left - bounds.left + box.width * 8 / 420;
      const right = box.left - bounds.left + box.width * 408 / 420;
      const top = box.top - bounds.top + box.height * 8 / 420;
      const bottom = box.top - bounds.top + box.height * 408 / 420;
      const paths = [
        `M${left} ${top}H0`, `M${right} ${top}H${bounds.width}`,
        `M${left} ${bottom}H0`, `M${right} ${bottom}H${bounds.width}`,
        `M${left} ${top}V0`, `M${right} ${top}V0`,
        `M${left} ${bottom}V${bounds.height}`, `M${right} ${bottom}V${bounds.height}`,
      ];
      rays.forEach((ray, index) => ray.setAttribute("d", paths[index]));
    };
    const progress = (value: number) => window.dispatchEvent(new CustomEvent("hackistan:intro-progress", { detail: value }));
    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(timer);
      observer?.disconnect();
      window.removeEventListener("resize", measure);
      timeline?.kill();
      hero.dataset.intro = "done";
      gsap.set([...targets, drawing, guides, bridge, viewportGuides], { clearProps: "opacity,strokeDashoffset" });
      progress(1);
      window.dispatchEvent(new Event("hackistan:intro-finished"));
      ScrollTrigger.update();
    };
    const shouldSkip = () => reduced.matches || (location.hash && location.hash !== "#top") ||
      window.scrollY > 24 || hero.getBoundingClientRect().top < -24;
    if (shouldSkip()) {
      finish();
      return;
    }
    observer = new ResizeObserver(measure);
    observer.observe(mark);
    observer.observe(viewportGuides);
    window.addEventListener("resize", measure);
    measure();

    const begin = () => {
      if (finished || timeline) return;
      if (window.scrollY > 24) { finish(); return; }
      window.clearTimeout(timer);
      const duration = window.matchMedia("(max-width: 767px)").matches ? 2.9 : 3.6;
      hero.dataset.intro = "running";
      gsap.set(targets, { opacity: 0 });
      gsap.set(drawing, { opacity: 1 });
      gsap.set(guides, { opacity: 0 });
      measure();
      gsap.set(viewportGuides, { opacity: 1 });
      gsap.set(rays, { opacity: 0, strokeDashoffset: 100 });
      const length = bridge.getTotalLength();
      gsap.set(bridge, { opacity: 0.8, strokeDasharray: length, strokeDashoffset: length });
      timeline = gsap.timeline({ onUpdate: () => progress(timeline!.progress()), onComplete: finish });
      // Normalized phases leave the same final DOM and Three.js values as Pass B.
      timeline.to(guides, { opacity: 0.65, duration: duration * .14 }, duration * .05)
        .to(bridge, { strokeDashoffset: 0, duration: duration * .24, ease: "power1.inOut" }, duration * .18)
        .to(rays, { opacity: 0.72, strokeDashoffset: 0, duration: duration * .18, stagger: duration * .012, ease: "power2.out" }, duration * .32)
        .to(guides, { opacity: 0, duration: duration * .19 }, duration * .61)
        .to(bridge, { opacity: 0, duration: duration * .2 }, duration * .65)
        .to(rays, { opacity: 0, duration: duration * .18 }, duration * .65)
        .to(ribbons, { opacity: 1, duration: duration * .16 }, duration * .78)
        .to(wordmark, { opacity: 1, duration: duration * .16 }, duration * .8)
        .to(edges, { opacity: 1, duration: duration * .085, stagger: duration * .007 }, duration * .88)
        .to({}, { duration: duration * .02 }, duration * .98);
      // Keep the complete sequence at its intended duration despite short tweens.
      timeline.duration(duration);
    };
    const onScroll = () => { if (window.scrollY > 24 || hero.getBoundingClientRect().top < -24) finish(); };
    const onMotion = () => { if (reduced.matches) finish(); };
    window.addEventListener("hackistan:webgl-ready", begin);
    window.addEventListener("scroll", onScroll, { passive: true });
    reduced.addEventListener("change", onMotion);
    timer = window.setTimeout(finish, 1700); // WebGL failure keeps the usable SVG hero.
    if (hero.querySelector('[data-scene-ready="true"]')) begin();
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hackistan:webgl-ready", begin);
      window.removeEventListener("scroll", onScroll);
      reduced.removeEventListener("change", onMotion);
      finish();
    };
  }, []);
  return null;
}
