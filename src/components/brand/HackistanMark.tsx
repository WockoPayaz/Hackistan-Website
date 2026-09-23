"use client";
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
  <svg viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-full h-auto ${className}`} style={style} aria-hidden="true">
    <g ref={leftRef} id="logo-left"><rect x="180" y="150" width="200" height="700" fill="#F2F0EA" /></g>
    <g ref={bridgeRef} id="logo-bridge"><path d="M 380,680 L 430,550 L 470,470 L 500,380 L 530,450 L 560,420 L 590,520 L 620,680 L 620,600 L 590,460 L 560,360 L 530,390 L 500,310 L 470,400 L 430,480 L 380,600 Z" fill="#F2F0EA" /></g>
    <g ref={rightRef} id="logo-right"><rect x="620" y="150" width="200" height="700" fill="#F2F0EA" /></g>
  </svg>
);
