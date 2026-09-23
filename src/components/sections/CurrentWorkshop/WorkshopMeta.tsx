"use client";
import React from "react";

export const WorkshopMeta: React.FC<{ tags: string[]; dates: string; location?: string }> = ({ tags, dates, location }) => (
  <div className="flex flex-col gap-4 text-xs tracking-widest uppercase text-fg-muted hairline-top pt-6">
    <div className="flex justify-between items-center"><span>TAGS</span><span className="text-fg">{tags.join(" / ")}</span></div>
    <div className="flex justify-between items-center hairline-top pt-3"><span>TIMELINE</span><span className="text-fg">{dates}</span></div>
    {location && <div className="flex justify-between items-center hairline-top pt-3"><span>LOCATION</span><span className="text-fg">{location}</span></div>}
  </div>
);
