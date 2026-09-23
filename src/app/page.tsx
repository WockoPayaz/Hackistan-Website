"use client";
import React, { useEffect, useState } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Loader } from "@/components/layout/Loader";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero/Hero";
import { CurrentWorkshop } from "@/components/sections/CurrentWorkshop/CurrentWorkshop";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0, 0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return (
    <main className="relative min-h-screen bg-[#0B0C0D] text-[#F2F0EA] overflow-x-hidden">
      {loading && <Loader onComplete={() => setLoading(false)} />}
      <Navbar />
      <Hero />
      <CurrentWorkshop />
      <Footer />
    </main>
  );
}