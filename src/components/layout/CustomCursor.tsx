"use client";
import React, { useEffect, useState } from "react";

export const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) { setIsTouch(true); return; }
    const handleMouseMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovered(!!target.closest("a, button, [data-cursor]"));
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  if (isTouch) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed z-[600] mix-blend-difference transition-transform duration-100 ease-out" style={{
      left: `${pos.x}px`, top: `${pos.y}px`, transform: `translate(-50%, -50%) scale(${isHovered ? 2.2 : 1})`,
    }}>
      <div className="h-3 w-3 rounded-full bg-[#F2F0EA]" />
    </div>
  );
};
