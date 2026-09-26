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

/** Replace the placeholder identities here when the four members provide details. */
export const crew: readonly CrewMember[] = [
  {
    id: "member-01", number: "01", name: "MEMBER 01", role: "CLUB LEAD",
    description: "Club direction, workshops, Hack Club coordination, and solo development of the Hackistan website.",
    image: "/crew/member-01.webp",
  },
  {
    id: "member-02", number: "02", name: "MEMBER 02", role: "CREW MEMBER",
    description: "Details to be added.", image: "/crew/member-02.webp",
  },
  {
    id: "member-03", number: "03", name: "MEMBER 03", role: "CREW MEMBER",
    description: "Details to be added.", image: "/crew/member-03.webp",
  },
  {
    id: "member-04", number: "04", name: "MEMBER 04", role: "CREW MEMBER",
    description: "Details to be added.", image: "/crew/member-04.webp",
  },
];
