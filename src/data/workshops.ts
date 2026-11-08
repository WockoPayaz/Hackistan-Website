import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Workshop } from "@/types/workshop";

export const clubProjectsUrl = "https://clubs.hackclub.com/clubs/d1a82e76-ca9d-47fb-8515-8a331567feea";

// Resolve optional uploads during the static export. Empty slots never request a missing URL.
function uploadedImage(url: string) {
  return existsSync(join(process.cwd(), "public", url)) ? url : undefined;
}

export const bakebuild = {
  id: "bakebuild", slug: "bakebuild", title: "BakeBuild", edition: "02", titleLines: ["Bake", "Build"],
  shortDescription: "Members sketched their own cookie cutters, traced the shapes in Onshape and exported their designs for 3D printing.",
  status: "completed", startDate: "2026-10-27", endDate: "2026-11-02", dateLabel: "27 Oct–2 Nov 2026",
  acceptedSubmissions: 25, submissionLabel: "approved submissions", difficulty: "Beginner",
  tags: ["CAD", "3D Printing"], coverImage: "/images/bakebuild.webp", coverAlt: "BakeBuild workshop",
  tileImage: "/workshops/bakebuild.svg", href: "/workshops/bakebuild/", location: "Quetta, Pakistan",
  fulfillmentNote: "Cookie cutter 3D prints are still awaiting fulfillment from Hack Club HQ.",
  photos: ["01", "02", "03"].map((number) => ({
    number, src: uploadedImage(`/workshops/bakebuild-${number}.webp`), alt: `BakeBuild workshop in Quetta, photo ${number}`,
  })),
  resources: [{ id: "program", title: "Explore BakeBuild", url: "https://bakebuild.hackclub.com/", kind: "website" }],
} satisfies Workshop;

const fuseringBanner = uploadedImage("/images/fusering-banner.webp") ?? "/images/fusering-blueprint.svg";
export const fusering = {
  id: "fusering", slug: "fusering", title: "Fusering", titleLines: ["Fuse", "ring"],
  status: "current", statusLabel: "Featured", startDate: "2026-11-11", endDate: "2026-11-18",
  dateLabel: "November 11–18, 2026", location: "Quetta, Pakistan", edition: "04",
  shortDescription: "Draw a design you’d carry on your keys. Turn your artwork into a 3D-printable keyring in Onshape.",
  description: "Our Quetta workshop starts November 11 and runs through November 18. Start with original vector artwork, model a flat-backed keyring and publish it on Printables. Submit the design to Fusering for review. Hack Club produces eligible designs as physical 3D prints.",
  tags: ["CAD", "3D Printing"], tileImage: fuseringBanner, coverImage: fuseringBanner, coverAlt: "Fusering custom keyring workshop",
  href: "/workshops/fusering/",
  resources: [{ id: "guide", title: "Visit Fusering for the guide and submission rules", url: "https://fusering.hackclub.com/", kind: "guide" }],
} satisfies Workshop;

const lostKeyCover = uploadedImage("/workshops/the-lost-key-cover.webp");
export const workshops: readonly Workshop[] = [
  bakebuild,
  {
    id: "boba-drops", slug: "boba-drops", title: "Boba Drops", edition: "01", titleLines: ["Boba", "Drops"],
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
  fusering,
  {
    id: "the-lost-key", slug: "the-lost-key", title: "The Lost Key", kind: "Game jam",
    status: "completed", startDate: "2026-10-23", endDate: "2026-10-26", dateLabel: "October 23–26, 2026",
    tags: ["Jame Gam", "Godot"], tileImage: lostKeyCover ?? "/workshops/key-study.svg", href: "/workshops/the-lost-key/",
    shortDescription: "Four Hackistan members built this Godot adventure during the Jame Gam Game Jam. Shrink down, head into the sewer and recover your lost key.",
    description: "Jame Gam brings teenagers together through Hack Club to enter game jams. For the October jam, hosted by augie and Hack Club, the team had three days to build and submit a browser game.",
    facts: [
      { label: "Team", value: "Fahad Farooq, Muhammad Ashhal, Abdullah Ayaan and Faisal Farooq" },
      { label: "Jam window · Quetta time", value: "October 23, 2:00 AM – October 26, 2:00 AM (PKT)" },
      { label: "Visuals", value: "49th out of 231 entries" },
      { label: "Overall", value: "110th" },
    ],
    resources: [
      { id: "play", title: "Play the game on itch.io", url: "https://wockopayaz.itch.io/thelostkey", kind: "website" },
      { id: "source", title: "View source code on GitHub", url: "https://github.com/Ayaan-10/The-Lost-Key", kind: "source" },
      { id: "results", title: "Jam results", url: "https://itch.io/jam/jame-gam-game-jam/rate/5232603", kind: "website" },
      { id: "program", title: "About Jame Gam", url: "https://jamegam.hackclub.com/", kind: "website" },
    ],
  },
];

export function getCurrentWorkshop(source: readonly Workshop[] = workshops): Workshop | undefined {
  return source.find((workshop) => workshop.status === "current");
}
export function workshopStatusLabel(workshop: Workshop) {
  return workshop.statusLabel ?? (workshop.status === "completed" ? "Concluded" : workshop.status === "current" ? "Current" : "Planned");
}
