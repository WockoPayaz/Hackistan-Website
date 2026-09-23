"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export const TextReveal: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!innerRef.current) return;
    gsap.fromTo(innerRef.current, { y: "100%" }, {
      y: "0%", duration: 1.2, delay, ease: "power3.out",
      scrollTrigger: { trigger: containerRef.current, start: "top 85%" },
    });
  }, [delay]);

  return (
    <div ref={containerRef} className="overflow-hidden">
      <div ref={innerRef}>{children}</div>
    </div>
  );
};
