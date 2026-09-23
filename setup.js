// setup.js
const fs = require('fs');
const path = require('path');

const files = {
  "package.json": JSON.stringify({
    "name": "hackistan-website",
    "version": "0.1.0",
    "private": true,
    "scripts": {
      "dev": "next dev",
      "build": "next build",
      "start": "next start",
      "lint": "next lint"
    },
    "dependencies": {
      "@studio-freight/lenis": "^1.0.42",
      "gsap": "^3.12.5",
      "next": "^14.2.0",
      "react": "^18.3.0",
      "react-dom": "^18.3.0"
    },
    "devDependencies": {
      "@types/node": "^20.0.0",
      "@types/react": "^18.3.0",
      "@types/react-dom": "^18.3.0",
      "autoprefixer": "^10.4.19",
      "postcss": "^8.4.38",
      "tailwindcss": "^3.4.3",
      "typescript": "^5.4.5"
    }
  }, null, 2),

  "tsconfig.json": JSON.stringify({
    "compilerOptions": {
      "target": "ES2017",
      "lib": ["dom", "dom.iterable", "esnext"],
      "allowJs": true,
      "skipLibCheck": true,
      "strict": true,
      "noEmit": true,
      "esModuleInterop": true,
      "module": "esnext",
      "moduleResolution": "bundler",
      "resolveJsonModule": true,
      "isolatedModules": true,
      "jsx": "preserve",
      "incremental": true,
      "plugins": [{ "name": "next" }],
      "paths": {
        "@/*": ["./src/*"]
      }
    },
    "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    "exclude": ["node_modules"]
  }, null, 2),

  "tailwind.config.js": `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0B0C0D',
        'bg-soft': '#111214',
        fg: '#F2F0EA',
        'fg-muted': '#9C9C98',
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};`,

  "docs/design-system.md": `# Hackistan Website Design System

**Version:** 1.0  
**Status:** Source of Truth  
**Scope:** Phase 1 (Landing & NOW Section)

## 1. Color Tokens
- \`--color-bg\`: \`#0B0C0D\` (Near Black)
- \`--color-bg-soft\`: \`#111214\`
- \`--color-fg\`: \`#F2F0EA\` (Warm Off-White)
- \`--color-fg-muted\`: \`#9C9C98\` (Muted Gray)
- \`--color-line-dark\`: \`rgba(242, 240, 234, 0.18)\`

## 2. Typography
- Display: \`"Geist", "Inter", "Helvetica Neue", sans-serif\`
- Tracking Display: \`-0.04em\`
- Tracking Utility / Metadata: \`0.22em\` (Uppercase)

## 3. Rules
- Radii: strictly \`0px\`
- Audio: Completely silent.
`,

  "docs/phase-1-prd.md": `# Hackistan Phase 1 PRD

## Scope
1. Global Site Shell (Header, Navigation Overlay, Custom Cursor, Noise Overlay)
2. Loader sequence (1.2s H assembly)
3. Hero Experience (Asymmetric 12-col grid, 3-part interactive H logo)
4. Hero -> NOW Spatial Transition (ScrollTrigger pinned mask portal)
5. NOW / Current Workshop Section (Data-driven featured creative showcase)
`,

  "src/types/workshop.ts": `export type WorkshopStatus = "upcoming" | "current" | "completed";

export interface Workshop {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  shortDescription: string;
  status: WorkshopStatus;
  startDate: string;
  endDate?: string;
  session?: number;
  totalSessions?: number;
  tags: string[];
  coverImage: string;
  location?: string;
  link?: string;
}
`,

  "src/data/workshops.ts": `import { Workshop } from "@/types/workshop";

export const WORKSHOPS_DATA: Workshop[] = [
  {
    id: "ws-01-web",
    slug: "build-your-first-website",
    title: "BUILD YOUR FIRST WEBSITE",
    subtitle: "WEB ARCHITECTURE & DESIGN",
    shortDescription:
      "Learning how the web works by designing, building, and shipping something of your own from scratch using modern semantic web standards.",
    status: "current",
    startDate: "SEP 19",
    endDate: "OCT 03",
    session: 3,
    totalSessions: 5,
    tags: ["WEB", "HTML", "CSS", "JAVASCRIPT"],
    coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2000&auto=format&fit=crop",
    location: "QUETTA, PAKISTAN",
    link: "#",
  },
  {
    id: "ws-02-python",
    slug: "python-fundamentals",
    title: "COMPUTATIONAL THINKING WITH PYTHON",
    shortDescription: "Mastering core algorithmic principles and problem-solving techniques.",
    status: "upcoming",
    startDate: "OCT 15",
    endDate: "OCT 29",
    tags: ["PYTHON", "ALGORITHMS"],
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2000&auto=format&fit=crop",
    location: "QUETTA, PAKISTAN",
  },
];

export function getCurrentWorkshop(): Workshop {
  const current = WORKSHOPS_DATA.find((ws) => ws.status === "current");
  return current || WORKSHOPS_DATA[0];
}
`,

  "src/styles/tokens.css": `:root {
  --color-bg: #0B0C0D;
  --color-bg-soft: #111214;
  --color-fg: #F2F0EA;
  --color-fg-muted: #9C9C98;
  --color-line-dark: rgba(242, 240, 234, 0.18);
  --font-sans: "Geist", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --text-xs: clamp(0.68rem, 0.62rem + 0.12vw, 0.78rem);
  --text-2xl: clamp(2.8rem, 2rem + 3.5vw, 5.5rem);
  --text-display: clamp(3.8rem, 7vw, 8.5rem);
  --page-x: clamp(1.25rem, 3.5vw, 4rem);
  --section-y: clamp(4rem, 8vw, 10rem);
}
`,

  "src/styles/reset.css": `*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  background-color: var(--color-bg);
  color: var(--color-fg);
  font-family: var(--font-sans);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

a { color: inherit; text-decoration: none; }
button { background: none; border: none; font: inherit; color: inherit; cursor: pointer; }
img, video { max-width: 100%; height: auto; display: block; }
`,

  "src/styles/typography.css": `.tracking-label {
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.22em;
  font-weight: 500;
  color: var(--color-fg-muted);
}

.text-display {
  font-size: var(--text-display);
  line-height: 0.92;
  letter-spacing: -0.04em;
  font-weight: 400;
}

.text-title {
  font-size: var(--text-2xl);
  line-height: 0.95;
  letter-spacing: -0.03em;
  font-weight: 400;
}
`,

  "src/styles/utilities.css": `.hairline-top { border-top: 1px solid var(--color-line-dark); }
.hairline-bottom { border-bottom: 1px solid var(--color-line-dark); }
.hairline-box { border: 1px solid var(--color-line-dark); }
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: clamp(1rem, 2vw, 2rem);
}
`,

  "src/lib/easing.ts": `export const ease = {
  cinematic: [0.16, 1, 0.3, 1],
  standard: [0.22, 1, 0.36, 1],
};
`,

  "src/lib/motion.ts": `export const motionTokens = {
  fast: 0.35,
  normal: 0.7,
  slow: 1.15,
  reveal: 1.4,
};
`,

  "src/lib/gsap.ts": `import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
`,

  "src/lib/lenis.ts": `import Lenis from "@studio-freight/lenis";

export function initLenis() {
  if (typeof window === "undefined") return null;
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    smoothWheel: true,
  });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
  return lenis;
}
`,

  "src/hooks/usePointerParallax.ts": `"use client";
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
`,

  "src/components/brand/HackistanMark.tsx": `"use client";
import React from "react";

interface HackistanMarkProps {
  className?: string;
  leftRef?: React.Ref<SVGGElement>;
  bridgeRef?: React.Ref<SVGGElement>;
  rightRef?: React.Ref<SVGGElement>;
  style?: React.CSSProperties;
}

export const HackistanMark: React.FC<HackistanMarkProps> = ({
  className = "", leftRef, bridgeRef, rightRef, style,
}) => (
  <svg viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg" className={\`w-full h-auto \${className}\`} style={style} aria-hidden="true">
    <g ref={leftRef} id="logo-left"><rect x="180" y="150" width="200" height="700" fill="#F2F0EA" /></g>
    <g ref={bridgeRef} id="logo-bridge"><path d="M 380,680 L 430,550 L 470,470 L 500,380 L 530,450 L 560,420 L 590,520 L 620,680 L 620,600 L 590,460 L 560,360 L 530,390 L 500,310 L 470,400 L 430,480 L 380,600 Z" fill="#F2F0EA" /></g>
    <g ref={rightRef} id="logo-right"><rect x="620" y="150" width="200" height="700" fill="#F2F0EA" /></g>
  </svg>
);
`,

  "src/components/brand/HackistanWordmark.tsx": `"use client";
import React from "react";

export const HackistanWordmark: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={\`font-sans tracking-tight text-fg font-medium \${className}\`}>Hackistan</div>
);
`,

  "src/components/layout/GrainOverlay.tsx": `"use client";
export const GrainOverlay = () => (
  <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[500] opacity-[0.035]" style={{
    backgroundImage: \`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")\`,
  }} />
);
`,

  "src/components/layout/CustomCursor.tsx": `"use client";
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
      left: \`\${pos.x}px\`, top: \`\${pos.y}px\`, transform: \`translate(-50%, -50%) scale(\${isHovered ? 2.2 : 1})\`,
    }}>
      <div className="h-3 w-3 rounded-full bg-[#F2F0EA]" />
    </div>
  );
};
`,

  "src/components/layout/Loader.tsx": `"use client";
import React, { useEffect, useState } from "react";

export const Loader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(onComplete, 600);
    }, 1200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div aria-hidden="true" className={\`fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-[#0B0C0D] transition-opacity duration-600 ease-out \${fading ? "opacity-0 pointer-events-none" : "opacity-100"}\`}>
      <div className="flex items-center gap-3">
        <span className="h-2 w-2 bg-[#F2F0EA] animate-ping" />
        <span className="tracking-label text-[#F2F0EA]">HACKISTAN / INITIALIZING</span>
      </div>
    </div>
  );
};
`,

  "src/components/layout/Navbar.tsx": `"use client";
import React, { useState } from "react";
import Link from "next/link";
import { HackistanMark } from "../brand/HackistanMark";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-[var(--page-x)] py-6 backdrop-blur-sm bg-[#0B0C0D]/40">
        <Link href="/" className="flex items-center gap-3 focus:outline-none">
          <div className="w-6 h-6 text-[#F2F0EA]"><HackistanMark /></div>
          <span className="font-sans text-sm tracking-wider font-semibold uppercase text-[#F2F0EA]">Hackistan</span>
        </Link>
        <button onClick={() => setIsOpen(!isOpen)} className="tracking-label text-[#F2F0EA]">
          {isOpen ? "CLOSE [×]" : "MENU [—]"}
        </button>
      </header>

      <div className={\`fixed inset-0 z-[90] bg-[#0B0C0D] flex flex-col justify-between px-[var(--page-x)] py-24 transition-all duration-700 ease-out \${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}\`}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-8 flex flex-col gap-6">
            <Link href="#top" onClick={() => setIsOpen(false)} className="text-4xl font-light">01 TOP</Link>
            <Link href="#now" onClick={() => setIsOpen(false)} className="text-4xl font-light">02 NOW</Link>
          </div>
        </div>
      </div>
    </>
  );
};
`,

  "src/components/layout/Footer.tsx": `"use client";
import React from "react";
import { HackistanMark } from "../brand/HackistanMark";

export const Footer = () => (
  <footer className="w-full px-[var(--page-x)] py-16 bg-[#0B0C0D] hairline-top text-fg-muted">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
      <div className="flex flex-col gap-4">
        <div className="w-8 h-8 text-[#F2F0EA]"><HackistanMark /></div>
        <p className="tracking-label text-[#F2F0EA]">HACKISTAN</p>
      </div>
      <div className="text-xs uppercase tracking-widest">© 2026 HACKISTAN</div>
    </div>
  </footer>
);
`,

  "src/components/motion/TextReveal.tsx": `"use client";
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
`,

  "src/components/motion/MediaReveal.tsx": `"use client";
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
`,

  "src/components/sections/Hero/Hero.tsx": `"use client";
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
          transform: \`perspective(1000px) rotateX(\${-pointer.y}deg) rotateY(\${pointer.x}deg)\`,
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
`,

  "src/components/sections/CurrentWorkshop/WorkshopMeta.tsx": `"use client";
import React from "react";

export const WorkshopMeta: React.FC<{ tags: string[]; dates: string; location?: string }> = ({ tags, dates, location }) => (
  <div className="flex flex-col gap-4 text-xs tracking-widest uppercase text-fg-muted hairline-top pt-6">
    <div className="flex justify-between items-center"><span>TAGS</span><span className="text-fg">{tags.join(" / ")}</span></div>
    <div className="flex justify-between items-center hairline-top pt-3"><span>TIMELINE</span><span className="text-fg">{dates}</span></div>
    {location && <div className="flex justify-between items-center hairline-top pt-3"><span>LOCATION</span><span className="text-fg">{location}</span></div>}
  </div>
);
`,

  "src/components/sections/CurrentWorkshop/CurrentWorkshop.tsx": `"use client";
import React from "react";
import Image from "next/image";
import { getCurrentWorkshop } from "@/data/workshops";
import { TextReveal } from "@/components/motion/TextReveal";
import { MediaReveal } from "@/components/motion/MediaReveal";
import { WorkshopMeta } from "./WorkshopMeta";

export const CurrentWorkshop = () => {
  const workshop = getCurrentWorkshop();

  return (
    <section id="now" className="relative w-full min-h-screen px-[var(--page-x)] py-[var(--section-y)] bg-[#0B0C0D] hairline-top">
      <div className="w-full flex justify-between pb-12 hairline-bottom">
        <div className="flex items-center gap-4">
          <span className="tracking-label text-fg font-bold">01 / NOW</span>
          <span className="tracking-label text-fg">● CURRENT WORKSHOP</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-12 items-start">
        <div className="md:col-span-7 flex flex-col justify-between">
          <div>
            <TextReveal><h2 className="text-title text-[clamp(2.5rem,5.5vw,5.5rem)] uppercase">{workshop.title}</h2></TextReveal>
            <TextReveal delay={0.2}><p className="mt-8 text-fg-muted text-lg max-w-[50ch]">{workshop.shortDescription}</p></TextReveal>
          </div>
          <div className="mt-12">
            <WorkshopMeta tags={workshop.tags} dates={\`\${workshop.startDate} — \${workshop.endDate}\`} location={workshop.location} />
            <div className="mt-8 pt-6 hairline-top">
              <a href="#" className="tracking-label text-[#F2F0EA]">EXPLORE WORKSHOP →</a>
            </div>
          </div>
        </div>

        <div className="md:col-span-5">
          <MediaReveal>
            <div className="relative aspect-[4/5] w-full hairline-box overflow-hidden bg-[#111214]">
              <Image src={workshop.coverImage} alt={workshop.title} fill sizes="(max-width: 768px) 100vw, 45vw" className="object-cover grayscale contrast-125" />
            </div>
          </MediaReveal>
        </div>
      </div>
    </section>
  );
};
`,

  "src/app/globals.css": `@import "../styles/tokens.css";
@import "../styles/reset.css";
@import "../styles/typography.css";
@import "../styles/utilities.css";

@tailwind base;
@tailwind components;
@tailwind utilities;
`,

  "src/app/layout.tsx": `import type { Metadata } from "next";
import "./globals.css";
import { GrainOverlay } from "@/components/layout/GrainOverlay";
import { CustomCursor } from "@/components/layout/CustomCursor";

export const metadata: Metadata = {
  title: "Hackistan — Student-Led Technology Community",
  description: "An experimental student-led Hack Club based in Quetta, Pakistan.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark bg-[#0B0C0D] text-[#F2F0EA]">
      <body className="relative min-h-screen">
        <GrainOverlay />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
`,

  "src/app/page.tsx": `"use client";
import React, { useEffect, useState } from "react";
import { initLenis } from "@/lib/lenis";
import { Loader } from "@/components/layout/Loader";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero/Hero";
import { CurrentWorkshop } from "@/components/sections/CurrentWorkshop/CurrentWorkshop";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lenis = initLenis();
    return () => { lenis?.destroy(); };
  }, []);

  return (
    <main className="relative min-h-screen bg-[#0B0C0D] text-[#F2F0EA]">
      {loading && <Loader onComplete={() => setLoading(false)} />}
      <Navbar />
      <Hero />
      <CurrentWorkshop />
      <Footer />
    </main>
  );
}
`
};

// Auto-generating directories and files
Object.entries(files).forEach(([filePath, content]) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Created: ${filePath}`);
});

console.log("\n✅ All Hackistan Phase 1 files successfully generated!");