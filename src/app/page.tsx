"use client";
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
