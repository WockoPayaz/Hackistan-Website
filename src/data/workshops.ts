import type { Workshop } from "@/types/workshop";

export const clubProjectsUrl = "https://clubs.hackclub.com/clubs/d1a82e76-ca9d-47fb-8515-8a331567feea";

export const workshops: readonly Workshop[] = [
  {
    id: "bakebuild", slug: "bakebuild", title: "BakeBuild", titleLines: ["Bake", "Build"],
    shortDescription: "Learn CAD by designing your own cookie cutter in Onshape. Turn your design into a 3D print, then bring on the cookies!",
    status: "current", startDate: "2026-10-27", endDate: "2026-11-02", dateLabel: "27 Oct–2 Nov 2026", difficulty: "Beginner",
    tags: ["CAD", "3D Printing"], coverImage: "/images/bakebuild.svg",
    coverAlt: "BakeBuild workshop", tileImage: "/workshops/bakebuild.svg",
    href: "/workshops/bakebuild/", location: "Quetta, Pakistan",
    resources: [{ id: "program", title: "Explore BakeBuild", url: "https://bakebuild.hackclub.com/", kind: "website" }],
  },
  {
    id: "boba-drops", slug: "boba-drops", title: "Boba Drops", titleLines: ["Boba", "Drops"],
    shortDescription: "We learned HTML and CSS, built our own websites, and shipped them through Boba Drops.",
    status: "completed", startDate: "2026-10-19", endDate: "2026-10-27", dateLabel: "19–27 Oct 2026",
    acceptedSubmissions: 12, difficulty: "Beginner", tags: ["HTML", "CSS", "Web Basics"],
    coverImage: "/images/boba-drops.webp", coverAlt: "Boba Drops workshop banner",
    tileImage: "/workshops/boba-drops.svg", href: "/workshops/boba-drops/", location: "Quetta, Pakistan",
    resources: [{ id: "ships", title: "View ships & projects", url: clubProjectsUrl, kind: "website" }],
  },
  {
    id: "vibes", slug: "vibes", title: "Vibes", status: "upcoming", dateLabel: "Date to be announced",
    shortDescription: "Start with an AI-assisted website, edit the code yourself, and add your own features to make it truly yours.",
    tags: ["Web", "AI"], tileImage: "/workshops/vibes.svg", href: "/workshops/vibes/",
  },
  {
    id: "fusering", slug: "fusering", title: "FuseRing", status: "upcoming", dateLabel: "Date to be announced",
    shortDescription: "Design a custom keyring in CAD and turn your idea into a printed creation.",
    tags: ["CAD", "3D Printing"], tileImage: "/workshops/fusering.svg", href: "/workshops/fusering/",
  },
];

export function getCurrentWorkshop(source: readonly Workshop[] = workshops): Workshop | undefined {
  return source.find((workshop) => workshop.status === "current");
}
export function workshopStatusLabel(workshop: Workshop) {
  return workshop.status === "completed" ? "Concluded" : workshop.status === "current" ? "Current" : "Planned";
}
