export type ProjectsGalleryItem = {
    id: string;
    number: string;
    kind: "project" | "meeting"
    title: string;
    meta: string;
    description?: string;
    image: string;
    alt: string;
    href?: string;
};


export const projectsGalleryItems: readonly ProjectsGalleryItem[] = [
    {
        id: "project-01",
        number: "01",
        kind: "project",
        title: "Project One",
        meta: "WORKSHOP PROJECT / 2026",
        description: "A short detailed description of the project.",
        image: "/projects-gallery/project-01.webp",
        alt: "Project displayed at Hackistan"
    },

    {
        id: "meeting-01",
        number: "02",
        kind: "meeting",
        title: "Club Meeting",
        meta: "HACKISTAN / QUETTA / 2026",
        image: "/projects-gallery/meeting-01.webp",
        alt: "Hackistan Club Meeting"
    },

    {
        id: "meeting-02",
        number: "03",
        kind: "meeting",
        title: "WORKSHOP DAY",
        meta: "HACKISTAN / QUETTA / 2026",
        image: "/projects-gallery/meeting-02.webp",
        alt: "Hackistan Workshop Session"
    },


    {
        id: "project-02",
        number: "04",
        kind: "project",
        title: "PROJECT NAME",
        meta: "INDEPENDENT PROJECT / 2026",
        description: "A short detailed description of the project.",
        image: "/projects-gallery/project-02.webp",
        alt: "A project made by a Hackistan member"
    },


    {
        id: "project-03",
        number: "05",
        kind: "meeting",
        title: "FROM THE CLUB",
        meta: "HACKISTAN ZINDABAD",
        image: "/projects-gallery/meeting-03.webp",
        alt: "Hackistan members during a club activity"
    },
]
