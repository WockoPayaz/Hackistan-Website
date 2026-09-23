import { Workshop } from "@/types/workshop";

export const WORKSHOPS_DATA: Workshop[] = [
  {
    id: "ws-01-web",
    slug: "build-your-first-website",
    title: "BUILD YOUR FIRST WEBSITE",
    subtitle: "WEB ARCHITECTURE & DESIGN",
    shortDescription:
      "Learning how the web works by designing, building, and shipping something of your own from scratch using modern semantic web standards.",
    status: "current",
    startDate: "SEP 19",
    endDate: "OCT 03",
    session: 3,
    totalSessions: 5,
    tags: ["WEB", "HTML", "CSS", "JAVASCRIPT"],
    coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2000&auto=format&fit=crop",
    location: "QUETTA, PAKISTAN",
    link: "#",
  },
  {
    id: "ws-02-python",
    slug: "python-fundamentals",
    title: "COMPUTATIONAL THINKING WITH PYTHON",
    shortDescription: "Mastering core algorithmic principles and problem-solving techniques.",
    status: "upcoming",
    startDate: "OCT 15",
    endDate: "OCT 29",
    tags: ["PYTHON", "ALGORITHMS"],
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2000&auto=format&fit=crop",
    location: "QUETTA, PAKISTAN",
  },
];

export function getCurrentWorkshop(): Workshop {
  const current = WORKSHOPS_DATA.find((ws) => ws.status === "current");
  return current || WORKSHOPS_DATA[0];
}
