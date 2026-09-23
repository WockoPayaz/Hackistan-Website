"use client";
import { useEffect, useState } from "react";

export function usePointerParallax(sensitivity = 0.05) {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      setPointer({
        x: (e.clientX / innerWidth - 0.5) * sensitivity * 100,
        y: (e.clientY / innerHeight - 0.5) * sensitivity * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [sensitivity]);

  return pointer;
}
