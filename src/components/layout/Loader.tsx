"use client";
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
    <div aria-hidden="true" className={`fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-[#0B0C0D] transition-opacity duration-600 ease-out ${fading ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
      <div className="flex items-center gap-3">
        <span className="h-2 w-2 bg-[#F2F0EA] animate-ping" />
        <span className="tracking-label text-[#F2F0EA]">HACKISTAN / INITIALIZING</span>
      </div>
    </div>
  );
};
