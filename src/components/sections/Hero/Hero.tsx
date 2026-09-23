"use client";
import React, { useEffect, useRef } from "react";
import { HackistanMark } from "@/components/brand/HackistanMark";
import { HackistanWordmark } from "@/components/brand/HackistanWordmark";
import { usePointerParallax } from "@/hooks/usePointerParallax";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export const Hero = () => {
  const pointer = usePointerParallax(0.04);
  const heroRef = useRef<HTMLElement>(null);
  const leftRef = useRef<SVGGElement>(null);
  const bridgeRef = useRef<SVGGElement>(null);
  const rightRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "+=120%",
        scrub: 1,
        pin: true,
      },
    });

    tl.to(leftRef.current, { x: -80, duration: 1 }, 0)
      .to(rightRef.current, { x: 80, duration: 1 }, 0)
      .to(bridgeRef.current, { scale: 1.8, transformOrigin: "center center", duration: 1 }, 0);

    return () => { ScrollTrigger.getAll().forEach((st) => st.kill()); };
  }, []);

  return (
    <section ref={heroRef} id="top" className="relative min-h-[100svh] w-full flex flex-col justify-between px-[var(--page-x)] pt-28 pb-12 overflow-hidden bg-[#0B0C0D]">
      <div className="w-full flex justify-between items-start text-fg-muted">
        <div><p className="tracking-label text-[#F2F0EA]">HACKISTAN</p><p className="text-xs mt-1">QUETTA / PK</p></div>
        <div className="text-right"><p className="tracking-label">IDEAS FUEL PROGRESS</p></div>
      </div>

      <div className="relative w-full my-auto flex flex-col items-center justify-center">
        <div className="w-full max-w-[500px] md:max-w-[620px]" style={{
          transform: `perspective(1000px) rotateX(${-pointer.y}deg) rotateY(${pointer.x}deg)`,
        }}>
          <HackistanMark leftRef={leftRef} bridgeRef={bridgeRef} rightRef={rightRef} />
        </div>
        <div className="mt-8 text-center">
          <HackistanWordmark className="text-5xl md:text-8xl tracking-tight" />
        </div>
      </div>

      <div className="w-full flex justify-between items-end hairline-top pt-6 text-fg-muted">
        <div><p className="tracking-label text-fg">STUDENT-LED TECHNOLOGY COMMUNITY</p></div>
        <div className="text-right"><p className="tracking-label animate-pulse">SCROLL TO EXPLORE ↓</p></div>
      </div>
    </section>
  );
};
