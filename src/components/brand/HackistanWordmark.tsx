"use client";
import React from "react";

export const HackistanWordmark: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`font-sans tracking-tight text-fg font-medium ${className}`}>Hackistan</div>
);
