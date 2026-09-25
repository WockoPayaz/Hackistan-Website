"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { HackistanMark } from "./HackistanMark";
import styles from "./LogoScene.module.css";

// Preserve the SVG for first paint, WebGL fallback, and the existing scroll timeline.
const HeroLogo3D = dynamic(() => import("./HeroLogo3D").then((module) => module.HeroLogo3D), { ssr: false });

export function LogoScene() {
  const [ready, setReady] = useState(false);
  const handleReady = useCallback((next: boolean) => {
    setReady(next);
    window.dispatchEvent(new Event(next ? "hackistan:webgl-ready" : "hackistan:webgl-failed"));
  }, []);
  return <div className={styles.scene} data-scene-ready={ready}>
    <div className={styles.fallback} data-hero-mark><HackistanMark dimensional /></div>
    <HeroLogo3D onReadyChange={handleReady} />
  </div>;
}
