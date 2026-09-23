export type WorkshopStatus = "upcoming" | "current" | "completed";

export interface Workshop {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  shortDescription: string;
  status: WorkshopStatus;
  startDate: string;
  endDate?: string;
  session?: number;
  totalSessions?: number;
  tags: string[];
  coverImage: string;
  location?: string;
  link?: string;
}
