"use client";
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
