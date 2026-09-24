"use client";

import { useRef } from "react";
import { HackistanMark } from "./HackistanMark";
import { usePointerParallax } from "@/hooks/usePointerParallax";

export function LogoScene() {
  const pointer = useRef<HTMLDivElement>(null);
  usePointerParallax(pointer);
  return <div ref={pointer} data-logo-pointer><HackistanMark dimensional data-hero-mark /></div>;
}
