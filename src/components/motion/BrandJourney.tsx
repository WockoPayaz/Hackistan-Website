"use client";

import { useRef, type ReactNode } from "react";
import { useLogoTransition } from "@/hooks/useLogoTransition";
import styles from "./BrandJourney.module.css";

export function BrandJourney({ hero, now }: { hero: ReactNode; now: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useLogoTransition(root);
  return <div ref={root} className={styles.journey} data-journey>
    <div className={styles.stage} data-hero-stage>{hero}</div>
    <div className={styles.travel} aria-hidden="true" />
    <div className={styles.now}>{now}</div>
  </div>;
}
