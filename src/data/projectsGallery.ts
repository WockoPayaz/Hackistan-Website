export type ProjectsGalleryItem = {
    id: string;
    kind: "project" | "meeting";
    title: string;
    meta: string;
    description?: string;
    image: string;
    alt: string;
    href?: string;
};


export const projectsGalleryItems: readonly ProjectsGalleryItem[] = [
    {
        id: "boba-drops-html-css",
        kind: "project",
        title: "Boba Drops Workshop",
        meta: "WORKSHOP / 2026",
        description: "Hackistan’s club leader explains the basics of HTML and CSS.",
        image: "/projects-gallery/boba-drops-html-css.webp",
        alt: "Project displayed at Hackistan"
    },
    {
        id: "workshop-day",
        kind: "meeting",
        title: "WORKSHOP DAY",
        meta: "HACKISTAN / QUETTA / 2026",
        image: "/projects-gallery/workshop-day.webp",
        alt: "Hackistan Club Meeting"
    },
    {
        id: "boba-drops-work-session",
        kind: "meeting",
        title: "Members at work during Boba Drops",
        meta: "HACKISTAN / QUETTA / 2026",
        image: "/projects-gallery/boba-drops-work-session.webp",
        alt: "Hackistan Workshop Session"
    },
    {
        id: "the-lost-key-title-screen",
        kind: "project",
        title: "The Lost Key | Jame Gam",
        meta: "GAME JAM / 2026",
        description: "A game built by Hackistan members for the Jame Gam game jam.",
        image: "/projects-gallery/the-lost-key-title-screen.webp",
        alt: "A project made by a Hackistan member"
    },
    {
        id: "bakebuild-cookie-cutters",
        kind: "meeting",
        title: "Cookie cutters in the making",
        meta: "BAKEBUILD WORKSHOP",
        image: "/projects-gallery/bakebuild-cookie-cutters.webp",
        alt: "Hackistan members during a club activity"
    },
    {
        id: "bakebuild-onshape-demo",
        kind: "meeting",
        title: "Explaining how to make cookie cutters in Onshape",
        meta: "BAKEBUILD WORKSHOP",
        image: "/projects-gallery/bakebuild-onshape-demo.webp",
        alt: "Hackistan members during a club activity"
    },
];
