"use client";

import { useRef, type ReactNode } from "react";
import { useLogoTransition } from "@/hooks/useLogoTransition";
import styles from "./BrandJourney.module.css";

export function BrandJourney({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useLogoTransition(root);
  return <div ref={root} className={styles.journey} data-journey><div className={styles.stage}>{children}</div></div>;
}
