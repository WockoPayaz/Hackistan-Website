export type WorkshopStatus = "upcoming" | "current" | "completed";

export interface WorkshopResource {
  id: string;
  title: string;
  url: string;
  kind: "guide" | "source" | "slides" | "website";
}

export interface WorkshopSession {
  id: string;
  number: number;
  title: string;
  date?: string;
  resources?: readonly WorkshopResource[];
}

export interface Workshop {
  id: string;
  slug: string;
  title: string;
  titleLines?: readonly string[];
  shortDescription: string;
  status: WorkshopStatus;
  startDate: string;
  endDate?: string;
  session?: number;
  totalSessions?: number;
  tags: readonly string[];
  coverImage?: string;
  coverAlt?: string;
  coverCredit?: { label: string; url: string };
  location?: string;
  sessions?: readonly WorkshopSession[];
  resources?: readonly WorkshopResource[];
  linkedProjectIds?: readonly string[];
  /** Set only when an actual detail route exists. */
  href?: string;
}
