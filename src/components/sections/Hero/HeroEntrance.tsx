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
    const guides = drawing?.querySelector<SVGGElement>("[data-intro-guides]");
    const bridge = drawing?.querySelector<SVGPathElement>("[data-intro-bridge]");
    if (!mark || !ribbons || !wordmark || !drawing || !guides || !bridge) {
      hero.dataset.intro = "done";
      return;
    }
    const targets = [ribbons, wordmark, ...edges];
    let timeline: gsap.core.Timeline | undefined;
    let finished = false;
    let timer = 0;
    const progress = (value: number) => window.dispatchEvent(new CustomEvent("hackistan:intro-progress", { detail: value }));
    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(timer);
      timeline?.kill();
      hero.dataset.intro = "done";
      gsap.set([...targets, drawing, guides, bridge], { clearProps: "opacity,strokeDashoffset" });
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

    const begin = () => {
      if (finished || timeline) return;
      if (window.scrollY > 24) { finish(); return; }
      window.clearTimeout(timer);
      const duration = window.matchMedia("(max-width: 767px)").matches ? 1.8 : 2.3;
      hero.dataset.intro = "running";
      gsap.set(targets, { opacity: 0 });
      gsap.set(drawing, { opacity: 1 });
      gsap.set(guides, { opacity: 0 });
      const length = bridge.getTotalLength();
      gsap.set(bridge, { opacity: 0.8, strokeDasharray: length, strokeDashoffset: length });
      timeline = gsap.timeline({ onUpdate: () => progress(timeline!.progress()), onComplete: finish });
      // Normalized phases leave the same final DOM and Three.js values as Pass B.
      timeline.to(guides, { opacity: 0.65, duration: duration * .13 }, duration * .07)
        .to(bridge, { strokeDashoffset: 0, duration: duration * .22, ease: "power1.inOut" }, duration * .18)
        .to(guides, { opacity: 0, duration: duration * .2 }, duration * .46)
        .to(bridge, { opacity: 0, duration: duration * .2 }, duration * .52)
        .to(ribbons, { opacity: 1, duration: duration * .2 }, duration * .64)
        .to(wordmark, { opacity: 1, duration: duration * .2 }, duration * .69)
        .to(edges, { opacity: 1, duration: duration * .16, stagger: duration * .016 }, duration * .8)
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
