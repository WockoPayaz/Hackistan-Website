"use client";
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

      <div className={`fixed inset-0 z-[90] bg-[#0B0C0D] flex flex-col justify-between px-[var(--page-x)] py-24 transition-all duration-700 ease-out ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
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
