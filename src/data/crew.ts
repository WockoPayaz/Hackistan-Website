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
    id: "member-01", number: "01", name: "FAHAD FAROOQ", role: "Founder & Leader",
    description: "Leads Hackistan’s direction, workshops, and Hack Club coordination, and is the sole developer behind the Hackistan website.",
    image: "/crew/member-01.webp",
  },
  {
    id: "member-02", number: "02", name: "ABDUL KHALIQ KHAN", role: "Co-Founder & Co-Leader",
    description: "Helps shape Hackistan’s direction, supports members as they build projects, and organizes the community alongside the other leads.",
    image: "/crew/member-02.webp",
  },
  {
    id: "member-03", number: "03", name: "MUHAMMAD ASHHAL", role: "Co-Founder & Co-Leader",
    description: "Co-leads Hackistan, brings members together, and helps coordinate the club’s workshops and day-to-day activities.",
    image: "/crew/member-03.webp",
  },
];
