export type ShelfItemKind = "workshop" | "ysws";
export type ShelfItemStatus = "current" | "planned" | "active";
export type ShelfItemGroup = "hackistan-workshops" | "featured-ysws";

export type ShelfItem = {
  id: string;
  slug: string;
  title: string;
  kind: ShelfItemKind;
  group: ShelfItemGroup;
  status: ShelfItemStatus;
  statusLabel: string;
  dateLabel: string;
  shortDescription: string;
  coverImage: string;
  href: string | null;
  ctaLabel: string;
  external: boolean;
  sourceUrl: string;
  spineLabel: string;
  color: string;
  foil: string;
  width: number;
  height: number;
  depth: number;
  emphasis?: boolean;
};

/** Final editorial order and values from the shelf manifest. */
export const shelfItems: readonly ShelfItem[] = [
{
  id: "boba-drops",
  slug: "boba-drops",
  title: "Boba Drops",

  kind: "workshop",
  group: "hackistan-workshops",

  status: "current",
  statusLabel: "UP NEXT",
  dateLabel: "DATE TO BE ANNOUNCED",

  shortDescription:
    "Build your own personal website with HTML & CSS, publish it online, and submit it through Boba Drops.",

  coverImage: "/shelf/covers/boba-drops.webp",

  href: null,
  ctaLabel: "DETAILS COMING SOON",
  external: false,

  sourceUrl: "https://boba.hackclub.com/",

  spineLabel: "WORKSHOP 01",

  color: "#B96717",
  foil: "#F4D39B",

  width: 1.04,
  height: 1.64,
  depth: 0.28,

  emphasis: true
},
{
  id: "vibes",
  slug: "vibes",
  title: "Vibes",

  kind: "workshop",
  group: "hackistan-workshops",

  status: "planned",
  statusLabel: "PLANNED",
  dateLabel: "AFTER BOBA DROPS · DATE TBA",

  shortDescription:
    "Start with an AI-assisted website, edit the code yourself, and add your own features to make it truly yours.",

  coverImage: "/shelf/covers/vibes.webp",

  href: null,
  ctaLabel: "DETAILS COMING SOON",
  external: false,

  sourceUrl: "https://vibes.hackclub.com/",

  spineLabel: "WORKSHOP 02",

  color: "#21132C",
  foil: "#F2DFF0",

  width: 1.10,
  height: 1.51,
  depth: 0.23
},
{
  id: "fusering",
  slug: "fusering",
  title: "FuseRing",

  kind: "workshop",
  group: "hackistan-workshops",

  status: "planned",
  statusLabel: "PLANNED",
  dateLabel: "AFTER VIBES · DATE TBA",

  shortDescription:
    "Design a custom keyring in CAD, follow the project requirements, and get your creation printed and shipped.",

  coverImage: "/shelf/covers/fusering.webp",

  href: null,
  ctaLabel: "DETAILS COMING SOON",
  external: false,

  sourceUrl: "https://fusering.hackclub.com/",

  spineLabel: "WORKSHOP 03",

  color: "#C7899F",
  foil: "#F7F0DE",

  width: 0.98,
  height: 1.48,
  depth: 0.31
},
{
  id: "stardance",
  slug: "stardance",
  title: "Stardance",

  kind: "ysws",
  group: "featured-ysws",

  status: "active",
  statusLabel: "FEATURED PROGRAM",
  dateLabel: "HACK CLUB YSWS",

  shortDescription:
    "Build any technical project you want, share your work, and earn rewards for shipping what you make.",

  coverImage: "/shelf/covers/stardance.webp",

  href: "https://stardance.hackclub.com/home",
  ctaLabel: "OPEN PROGRAM ↗",
  external: true,

  sourceUrl: "https://stardance.hackclub.com/home",

  spineLabel: "YSWS 01",

  color: "#171B43",
  foil: "#F6E3A2",

  width: 1.06,
  height: 1.60,
  depth: 0.25
},
{
  id: "haven",
  slug: "haven",
  title: "Haven",

  kind: "ysws",
  group: "featured-ysws",

  status: "active",
  statusLabel: "FEATURED PROGRAM",
  dateLabel: "HACK CLUB PROGRAM",

  shortDescription:
    "Join a worldwide teen game jam, learn through workshops and teamwork, and build a game even if you are just getting started.",

  coverImage: "/shelf/covers/haven.webp",

  href: "https://haven.hackclub.com/",
  ctaLabel: "OPEN PROGRAM ↗",
  external: true,

  sourceUrl: "https://haven.hackclub.com/",

  spineLabel: "YSWS 02",

  color: "#E85D17",
  foil: "#FFF4DD",

  width: 1.00,
  height: 1.56,
  depth: 0.27
},
{
  id: "atlantis",
  slug: "atlantis",
  title: "Atlantis",

  kind: "ysws",
  group: "featured-ysws",

  status: "active",
  statusLabel: "FEATURED PROGRAM",
  dateLabel: "CAD / 3D DESIGN",

  shortDescription:
    "Build your CAD skills through consistent project work and work toward earning your own 3D printer.",

  coverImage: "/shelf/covers/atlantis.webp",

  href: "https://atlantis.hackclub.com/",
  ctaLabel: "OPEN PROGRAM ↗",
  external: true,

  sourceUrl: "https://atlantis.hackclub.com/",

  spineLabel: "YSWS 03",

  color: "#1578AC",
  foil: "#E7F8FF",

  width: 1.04,
  height: 1.62,
  depth: 0.26
},
{
  id: "crescent",
  slug: "crescent",
  title: "Crescent",

  kind: "ysws",
  group: "featured-ysws",

  status: "active",
  statusLabel: "FEATURED PROGRAM",
  dateLabel: "WEEKLY CHALLENGES",

  shortDescription:
    "Pick from a fresh set of challenges, choose what you want to make, and keep shipping new projects.",

  coverImage: "/shelf/covers/crescent.webp",

  href: "https://crescent.hackclub.com/",
  ctaLabel: "OPEN PROGRAM ↗",
  external: true,

  sourceUrl: "https://crescent.hackclub.com/",

  spineLabel: "YSWS 04",

  color: "#24134F",
  foil: "#F6ECDE",

  width: 0.96,
  height: 1.54,
  depth: 0.24
},
{
  id: "hackcraft",
  slug: "hackcraft",
  title: "Hackcraft",

  kind: "ysws",
  group: "featured-ysws",

  status: "active",
  statusLabel: "FEATURED PROGRAM",
  dateLabel: "MINECRAFT MODDING",

  shortDescription:
    "Create and publish your own Minecraft mod, build something polished and original, and ship it for others to play.",

  coverImage: "/shelf/covers/hackcraft.webp",

  href: "https://hackcraft.hackclub.com/",
  ctaLabel: "OPEN PROGRAM ↗",
  external: true,

  sourceUrl: "https://hackcraft.hackclub.com/",

  spineLabel: "YSWS 05",

  color: "#65482F",
  foil: "#D8D7D0",

  width: 1.08,
  height: 1.50,
  depth: 0.29
},
{
  id: "re-dream",
  slug: "re-dream",
  title: "Re-Dream",

  kind: "ysws",
  group: "featured-ysws",

  status: "active",
  statusLabel: "FEATURED PROGRAM",
  dateLabel: "GAME DEVELOPMENT",

  shortDescription:
    "Make your dream game come to life through Re-Dream.",

  coverImage: "/shelf/covers/re-dream.webp",

  href: "https://re-dream.hackclub.com/",
  ctaLabel: "OPEN PROGRAM ↗",
  external: true,

  sourceUrl: "https://re-dream.hackclub.com/",

  spineLabel: "YSWS 06",

  color: "#574472",
  foil: "#F2E8FF",

  width: 1.02,
  height: 1.58,
  depth: 0.25
},
];
