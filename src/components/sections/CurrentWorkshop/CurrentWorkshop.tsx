"use client";
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
            <WorkshopMeta tags={workshop.tags} dates={`${workshop.startDate} — ${workshop.endDate}`} location={workshop.location} />
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
