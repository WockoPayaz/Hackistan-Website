import { getCurrentWorkshop } from "./workshops";

export type ShelfItemKind = "workshop" | "ysws";
export type ShelfItemStatus = "current" | "active" | "planned";

export type ShelfItem = {
  id: string;
  slug: string;
  kind: ShelfItemKind;
  status: ShelfItemStatus;
  title: string;
  shortDescription: string;
  dateLabel: string;
  href: string | null;
  coverImage?: string;
  logoImage?: string;
  color: string;
  foil: string;
  width: number;
  height: number;
  depth: number;
  seed: number;
  temporary?: boolean;
};

const currentWorkshop = getCurrentWorkshop();
const dateLabel = (date: string) => new Intl.DateTimeFormat("en", {
  month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
}).format(new Date(`${date}T00:00:00Z`));

/** Replace these isolated temporary entries when actual programs are confirmed. */
const temporaryItems: ShelfItem[] = [
  { id: "ysws-placeholder-01", slug: "ysws-placeholder-01", kind: "ysws", status: "active", title: "YSWS program 01", shortDescription: "Program information will be added when this Hack Club YSWS is confirmed.", dateLabel: "Details to follow", href: null, color: "#252c31", foil: "#e8e8e2", width: 0.93, height: 1.52, depth: 0.22, seed: 13, temporary: true },
  { id: "ysws-placeholder-02", slug: "ysws-placeholder-02", kind: "ysws", status: "active", title: "YSWS program 02", shortDescription: "Program information will be added when this Hack Club YSWS is confirmed.", dateLabel: "Details to follow", href: null, color: "#354047", foil: "#f1efe7", width: 0.98, height: 1.58, depth: 0.25, seed: 21, temporary: true },
  { id: "planned-placeholder-01", slug: "planned-placeholder-01", kind: "workshop", status: "planned", title: "Planned workshop 01", shortDescription: "The topic and schedule for this workshop are still being planned.", dateLabel: "Date to be announced", href: null, color: "#413a38", foil: "#f2f0ea", width: 1.00, height: 1.55, depth: 0.23, seed: 34, temporary: true },
  { id: "planned-placeholder-02", slug: "planned-placeholder-02", kind: "workshop", status: "planned", title: "Planned workshop 02", shortDescription: "The topic and schedule for this workshop are still being planned.", dateLabel: "Date to be announced", href: null, color: "#323a38", foil: "#eeeae0", width: 0.95, height: 1.49, depth: 0.24, seed: 55, temporary: true },
  { id: "planned-placeholder-03", slug: "planned-placeholder-03", kind: "workshop", status: "planned", title: "Planned workshop 03", shortDescription: "The topic and schedule for this workshop are still being planned.", dateLabel: "Date to be announced", href: null, color: "#393a42", foil: "#f2f0ea", width: 1.02, height: 1.61, depth: 0.26, seed: 89, temporary: true },
];

export const shelfItems: readonly ShelfItem[] = [
  ...(currentWorkshop ? [{
    id: currentWorkshop.id,
    slug: currentWorkshop.slug,
    kind: "workshop" as const,
    status: "current" as const,
    title: currentWorkshop.title,
    shortDescription: currentWorkshop.shortDescription,
    dateLabel: currentWorkshop.endDate ? `${dateLabel(currentWorkshop.startDate)} – ${dateLabel(currentWorkshop.endDate)}` : dateLabel(currentWorkshop.startDate),
    href: currentWorkshop.href ?? null,
    coverImage: "/images/web-workshop-960.webp",
    color: "#202b30", foil: "#f2f0ea",
    width: 1.06, height: 1.68, depth: 0.28, seed: 5,
  }] : []),
  ...temporaryItems,
];
