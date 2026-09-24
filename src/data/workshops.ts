import type { Workshop } from "@/types/workshop";

/** Phase 1 fixture. Replace this adapter with a CMS when real content is ready. */
export const workshops: readonly Workshop[] = [
  {
    id: "web-001",
    slug: "build-your-first-website",
    title: "Build your first website",
    titleLines: ["Build your", "first website"],
    shortDescription: "Learning how the web works by designing, building and shipping something of your own.",
    status: "current",
    startDate: "2026-09-19",
    endDate: "2026-10-03",
    session: 3,
    totalSessions: 5,
    tags: ["Web", "HTML", "CSS", "JavaScript"],
    coverImage: "/images/web-workshop.webp",
    coverAlt: "Hack Club participants working together at a laptop during Outernet, 2023. Community reference photograph.",
    coverCredit: { label: "Community photograph — Hack Club / Outernet", url: "https://hackclub.com/press/" },
    location: "Quetta, Pakistan",
    sessions: [],
    resources: [],
    linkedProjectIds: [],
  },
];

export function getCurrentWorkshop(source: readonly Workshop[] = workshops): Workshop | undefined {
  return source.find((workshop) => workshop.status === "current");
}
