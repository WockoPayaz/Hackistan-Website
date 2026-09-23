"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export const MediaReveal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(containerRef.current,
      { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" },
      {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        duration: 1.4, ease: "power3.inOut",
        scrollTrigger: { trigger: containerRef.current, start: "top 80%" },
      }
    );
  }, []);

  return <div ref={containerRef} className="overflow-hidden">{children}</div>;
};
