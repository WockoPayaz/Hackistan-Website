import type { SVGProps } from "react";
import { markGeometry } from "./geometry";
import styles from "./brand.module.css";

interface MarkProps extends SVGProps<SVGSVGElement> {
  dimensional?: boolean;
}

export function HackistanMark({ dimensional = false, className = "", ...props }: MarkProps) {
  return (
    <svg viewBox="-8 -8 420 420" fill="none" aria-hidden="true" focusable="false" className={`${styles.mark} ${className}`} {...props}>
      {Object.entries(markGeometry).map(([part, path]) => (
        <g key={part} data-logo-part={part} className={styles.part}>
          <g data-assembly-part={part} className={styles.part}>
          {dimensional && <path d={path} transform="translate(5 6)" className={styles.depth} />}
          <path d={path} fill="currentColor" />
          </g>
        </g>
      ))}
    </svg>
  );
}
