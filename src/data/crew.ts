export type CrewMember = {
  id: string;
  number: string;
  name: string;
  role: string;
  description: string;
  image: string | null;
  profileLabel?: string;
  profileHref?: string;
};

export const crew: readonly CrewMember[] = [
  {
    id: "member-01", number: "01", name: "FAHAD FAROOQ", role: "CLUB LEAD",
    description: "Leads Hackistan’s direction, workshops, and Hack Club coordination, and is the sole developer behind the Hackistan website.",
    image: "/crew/member-01.webp",
  },
  {
    id: "member-02", number: "02", name: "ABDUL KHALIQ KHAN", role: "PROJECTS LEAD",
    description: "Leads project planning and execution, helping turn ideas into finished builds and keeping project work moving.",
    image: "/crew/member-02.webp",
  },
  {
    id: "member-03", number: "03", name: "MUHAMMAD ASHHAL", role: "OPERATIONS LEAD",
    description: "Keeps Hackistan running day to day, coordinating logistics, schedules, workshops, and the practical details behind events.",
    image: "/crew/member-03.webp",
  },
];
