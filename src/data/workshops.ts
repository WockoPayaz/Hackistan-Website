import type { Workshop } from "@/types/workshop";

export const workshops: readonly Workshop[] = [
  {
    id: "boba-drops",
    slug: "boba-drops",
    title: "Boba Drops",
    titleLines: ["Boba", "Drops"],
    shortDescription: "Learn the basics of HTML from scratch by building and publishing your own website, then submit it through Boba Drops to get free Boba Tea!",
    status: "current",
    startDate: "2026-10-05",
    endDate: "2026-10-09",
    difficulty: "Beginner",
    tags: ["HTML", "Web Basics"],
    coverImage: "/images/boba-drops.webp",
    coverAlt: "Boba Drops workshop banner",
    location: "Quetta, Pakistan",
    sessions: [],
    resources: [],
    linkedProjectIds: [],
  },
];

export function getCurrentWorkshop(source: readonly Workshop[] = workshops): Workshop | undefined {
  return source.find((workshop) => workshop.status === "current");
}
