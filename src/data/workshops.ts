import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Workshop } from "@/types/workshop";

export const clubProjectsUrl = "https://clubs.hackclub.com/clubs/d1a82e76-ca9d-47fb-8515-8a331567feea";

// Resolve optional uploads during the static export. Empty slots never request a missing URL.
function uploadedImage(url: string) {
  return existsSync(join(process.cwd(), "public", url)) ? url : undefined;
}

function photoSlots(slug: string, subject: string) {
  return ["01", "02", "03"].map((number) => ({
    number, src: uploadedImage(`/workshops/${slug}-${number}.webp`),
    alt: `${subject}, photo ${number}`,
  }));
}

export const bakebuild = {
  id: "bakebuild", slug: "bakebuild", title: "BakeBuild", edition: "02", titleLines: ["Bake", "Build"],
  shortDescription: "Members sketched their own cookie cutters, traced the shapes in Onshape and exported their designs for 3D printing.",
  status: "completed", startDate: "2026-10-27", endDate: "2026-11-02", dateLabel: "27 Oct–2 Nov 2026",
  acceptedSubmissions: 25, submissionLabel: "approved submissions", difficulty: "Beginner",
  tags: ["CAD", "3D Printing"], coverImage: "/images/bakebuild.webp", coverAlt: "BakeBuild workshop",
  tileImage: "/workshops/bakebuild.svg", href: "/workshops/bakebuild/", location: "Quetta, Pakistan",
  fulfillmentNote: "Cookie cutter 3D prints are still awaiting fulfillment from Hack Club HQ.",
  photos: photoSlots("bakebuild", "BakeBuild workshop"),
  resources: [{ id: "program", title: "Explore BakeBuild", url: "https://bakebuild.hackclub.com/", kind: "website" }],
} satisfies Workshop;

const fuseringBanner = uploadedImage("/images/fusering-banner.webp") ?? "/images/fusering-blueprint.svg";
export const fusering = {
  id: "fusering", slug: "fusering", title: "FuseRing", photos: photoSlots("fusering", "FuseRing workshop"), titleLines: ["Fuse", "ring"],
  status: "current", statusLabel: "Featured", startDate: "2026-11-11", endDate: "2026-11-18",
  dateLabel: "November 11–18, 2026", location: "Quetta, Pakistan", edition: "04",
  shortDescription: "Draw a design you’d carry on your keys. Turn your artwork into a 3D-printable keyring in Onshape.",
  description: "Our Quetta workshop starts November 11 and runs through November 18. Start with original vector artwork, model a flat-backed keyring and publish it on Printables. Submit the design to Fusering for review. Hack Club produces eligible designs as physical 3D prints.",
  tags: ["CAD", "3D Printing"], tileImage: "/images/fusering-blueprint.svg", coverImage: fuseringBanner, coverAlt: "Fusering custom keyring workshop",
  href: "/workshops/fusering/",
  resources: [{ id: "guide", title: "Visit Fusering for the guide and submission rules", url: "https://fusering.hackclub.com/", kind: "guide" }],
} satisfies Workshop;

export const ghostship = {
  id: "ghostship", slug: "ghostship", title: "GhostShip", status: "upcoming",
  dateLabel: "Date to be announced", tags: ["Game Dev", "p5.js"],
  shortDescription: "Build a spooky browser game in p5.js. Dream up a Halloween setting and decide what players have to do to win.",
  description: "Use the workshop guide to learn how to draw, animate and handle player input in p5.js. Then take the game in your own direction: escape a haunted maze, dodge creatures in the dark or try a spooky idea of your own. Add two or three original features, publish your game on GitHub Pages and submit the playable link to Hack Club.",
  href: "/workshops/ghostship/", tileImage: "/workshops/ghostship.svg",
  resources: [
    { id: "program", title: "Visit Ghost Ship", url: "https://ghostship.hackclub.com/", kind: "website" },
    { id: "tutorial", title: "Follow the p5.js game tutorial", url: "https://ghostship.hackclub.com/tutorial/", kind: "guide" },
  ],
} satisfies Workshop;

const lostKeyCover = uploadedImage("/workshops/the-lost-key-cover.webp");
export const workshops: readonly Workshop[] = [
  {
    id: "boba-drops", slug: "boba-drops", title: "Boba Drops", edition: "01", titleLines: ["Boba", "Drops"],
    shortDescription: "We learned HTML and CSS, built our own websites, and shipped them through Boba Drops.",
    status: "completed", startDate: "2026-10-19", endDate: "2026-10-27", dateLabel: "19–27 Oct 2026",
    photos: photoSlots("boba-drops", "Boba Drops workshop"), acceptedSubmissions: 12, difficulty: "Beginner", tags: ["HTML", "CSS", "Web Basics"],
    coverImage: "/images/boba-drops.webp", coverAlt: "Boba Drops workshop banner",
    tileImage: "/workshops/boba-drops.svg", href: "/workshops/boba-drops/", location: "Quetta, Pakistan",
    resources: [{ id: "ships", title: "View ships & projects", url: clubProjectsUrl, kind: "website" }],
  },
  bakebuild,
  {
    id: "the-lost-key", slug: "the-lost-key", title: "Jame Gam | Game Jam", photos: photoSlots("the-lost-key", "The Lost Key game jam entry"), kind: "Game jam",
    status: "completed", startDate: "2026-10-23", endDate: "2026-10-26", dateLabel: "October 23–26, 2026",
    tags: ["Game Dev", "Godot"], tileImage: lostKeyCover ?? "/workshops/key-study.svg", href: "/workshops/the-lost-key/",
    shortDescription: "We developed The Lost Key, a Godot adventure game, in three days for the October game jam. Shrink down and explore a sewer to find your missing house key.",
    description: "Jame Gam is a Hack Club community where teenagers pick a game jam to enter together each month. In October, augie and Hack Club hosted a three-day jam with the theme “I’m just a little guy.” Our four-person Hackistan team developed The Lost Key for that theme and submitted it on itch.io. We made the entire game without generative AI, including all of its artwork.",
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
  fusering,
  ghostship,
  {
    id: "vibes", slug: "vibes", title: "Vibes", status: "upcoming", dateLabel: "Date to be announced",
    shortDescription: "Start with an AI-assisted website, edit the code yourself, and add your own features to make it truly yours.",
    tags: ["Web", "AI"], tileImage: "/workshops/vibes.svg", href: "/workshops/vibes/",
  },
];

export function getCurrentWorkshop(source: readonly Workshop[] = workshops): Workshop | undefined {
  return source.find((workshop) => workshop.status === "current");
}
export function workshopStatusLabel(workshop: Workshop) {
  return workshop.statusLabel ?? (workshop.status === "completed" ? "Concluded" : workshop.status === "current" ? "Current" : "Planned");
}
