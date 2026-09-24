"use client";

import { useEffect, useRef } from "react";
import styles from "./Hero.module.css";

const phrase = "BUILD · FIX · SHIP · REPEAT · ";
const repeated = phrase.repeat(10);

const desktop = [
  { path: "M -850 245 C -230 -145 640 -75 1450 260 S 2780 600 3470 110", offset: 660, duration: 32, reverse: false, depth: styles.ribbonFar },
  { path: "M -820 545 C -140 160 500 165 1200 430 S 2530 600 3440 155", offset: 660, duration: 25, reverse: true, depth: styles.ribbonNear },
  { path: "M -900 900 C -150 500 570 465 1240 710 S 2440 1100 3510 605", offset: 660, duration: 29, reverse: false, depth: styles.ribbonMid },
  { path: "M -740 1170 C -100 820 560 820 1080 980 S 2340 1170 3330 805", offset: 660, duration: 37, reverse: true, depth: styles.ribbonFar },
];

const mobile = [
  { path: "M -390 345 C 30 -70 640 15 1080 440 S 1800 850 2260 265", offset: 520, duration: 30, reverse: false, depth: styles.ribbonFar },
  { path: "M -390 755 C 100 320 600 375 1080 765 S 1770 960 2240 580", offset: 520, duration: 26, reverse: true, depth: styles.ribbonNear },
  { path: "M -340 1370 C 180 900 660 955 1100 1135 S 1770 1240 2240 940", offset: 520, duration: 35, reverse: false, depth: styles.ribbonMid },
];

function Curves({ bands, prefix, viewBox, svgRef, className }: {
  bands: typeof desktop;
  prefix: string;
  viewBox: string;
  svgRef: React.RefObject<SVGSVGElement | null>;
  className: string;
}) {
  return <svg ref={svgRef} className={className} viewBox={viewBox} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    <defs>{bands.map((band, index) => <path key={index} id={`${prefix}-${index}`} d={band.path} />)}</defs>
    {bands.map((band, index) => <text key={index} className={band.depth} textLength={band.offset * 10} lengthAdjust="spacing">
      <textPath href={`#${prefix}-${index}`} startOffset="0">
        {repeated}
        <animate attributeName="startOffset" from={band.reverse ? -band.offset : 0} to={band.reverse ? 0 : -band.offset} dur={`${band.duration}s`} repeatCount="indefinite" begin="indefinite" />
      </textPath>
    </text>)}
  </svg>;
}

export function HeroRibbons() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const desktopRef = useRef<SVGSVGElement>(null);
  const mobileRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const small = window.matchMedia("(max-width: 767px)");
    let started = false;
    let onScreen = true;
    const sync = () => {
      if (!reduce.matches && !started) {
        for (const svg of [desktopRef.current, mobileRef.current]) {
          svg?.querySelectorAll<SVGAnimationElement>("animate").forEach((animation) => animation.beginElement());
        }
        started = true;
      }
      for (const [svg, visible] of [[desktopRef.current, !small.matches], [mobileRef.current, small.matches]] as const) {
        if (!svg) continue;
        if (reduce.matches || !visible || !onScreen) svg.pauseAnimations();
        else svg.unpauseAnimations();
      }
    };
    sync();
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    if (fieldRef.current) observer.observe(fieldRef.current);
    reduce.addEventListener("change", sync);
    small.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      reduce.removeEventListener("change", sync);
      small.removeEventListener("change", sync);
    };
  }, []);

  return <div ref={fieldRef} className={styles.ribbonField} aria-hidden="true">
    <Curves bands={desktop} prefix="hackistan-desktop-curve" viewBox="0 0 1600 900" svgRef={desktopRef} className={styles.desktopRibbons} />
    <Curves bands={mobile} prefix="hackistan-mobile-curve" viewBox="0 0 720 1280" svgRef={mobileRef} className={styles.mobileRibbons} />
  </div>;
}
