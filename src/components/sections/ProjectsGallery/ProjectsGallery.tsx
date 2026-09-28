"use client";
import React, {
    useEffect,
    useRef,
    useState,
    type PointerEvent as ReactPointerEvent,
} from "react";




import {
    projectsGalleryItems,
    type ProjectsGalleryItem,
} from '@/data/projectsGallery';

import styles from "./ProjectsGallery.module.css";

function GalleryItem({ item, onOpen, }: { item: ProjectsGalleryItem; onOpen: () => void; }) {
    const isProject = item.kind === "project";

    return (
        <article
        className={`${styles.card} ${
            isProject ? styles.projectCard : styles.meetingCard
        }`}
        >

        <button 
            type="button"
            className={styles.media}
            onClick={onOpen}
            aria-label={`Open image: ${item.title}`}
        >

        <img
            src={item.image}
            alt={item.alt}
            width="1200"
            height="800"
            loading="lazy"
            draggable={false}
            className={styles.image}
        />


        <span className={styles.imageNumber} aria-hidden="true">
            {item.number}
        </span>
        </button>


        <div className={styles.caption}>
            <div className={styles.captionTop}>
                
                <span className={styles.kind}>
                    {isProject ? "PROJECT" : "CLUB / MOMENT"} 
                </span>

                <span className={styles.meta}>{item.meta}</span>

            </div>

            <h3>
                {item.href ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer">
                        {item.title} <span aria-hidden="true">↗</span>
                    </a>
                ) : (
                    item.title
                )}
            </h3>


            {item.description && (
                <p className={styles.description}>{item.description}</p>
            )}


        </div>
        </article>
    );
}

  
export function ProjectsGallery() {

    const railRef = useRef<HTMLDivElement>(null);

    const dragState = useRef({
        pointerId: -1,
        startX: 0,
        startScrollLeft: 0,
        moved: false,
    })

    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const lightboxItem=
        lightboxIndex === null ? null : projectsGalleryItems[lightboxIndex];

    function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
        if (event.pointerType !== "mouse" || event.button !== 0) return;
        
        const rail = railRef.current;
        if (!rail) return;

        dragState.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startScrollLeft: rail.scrollLeft,
            moved: false,
        };

    }

    function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
        const rail = railRef.current;
        const drag = dragState.current;

        if (!rail || drag.pointerId !== event.pointerId) return;

        const distance = event.clientX - drag.startX;

        if (Math.abs(distance) > 4 && !drag.moved) {
            drag.moved = true;

            rail.setPointerCapture(event.pointerId);
            rail.dataset.dragging = "true";
        }

        if (!drag.moved) return;

        event.preventDefault();

        rail.scrollLeft = drag.startScrollLeft - distance;

    }

    function handlePointerEnd(event: ReactPointerEvent<HTMLDivElement>) {
        const rail = railRef.current;
        const drag = dragState.current;

        if (!rail || drag.pointerId !== event.pointerId) return;

        if (rail.hasPointerCapture(event.pointerId)) {
            rail.releasePointerCapture(event.pointerId);
        }

        delete rail.dataset.dragging;
        drag.pointerId = -1;
    }

    useEffect(() => {
        if (lightboxIndex === null) return;

        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key == "Escape") {
                setLightboxIndex(null);
            }

            if (event.key == "ArrowRight") {
                setLightboxIndex((current) =>
                    current === null
                    ? null
                    : (current + 1) % projectsGalleryItems.length
                );
            }
        
        if (event.key === "ArrowLeft") {
            setLightboxIndex((current) =>
                current === null
                    ? null
                    : (current -1 + projectsGalleryItems.length) % projectsGalleryItems.length);
        }

    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
        document.body.style.overflow = previousOverflow;
        window.removeEventListener("keydown", handleKeyDown);
    };
}, [lightboxIndex]);

return (
    <section
        id="projects"
        className={styles.section}
        aria-labelledby="projects-title"
        tabIndex={-1}
    >
        
    <div className={`${styles.inner} page-width `}>
        <div className={styles.topRule} />

        <header className={styles.header}>
            <div>
                <p className={`${styles.index} eyebrow`}>
                 02 / PROJECTS & GALLERY
                </p>

                <h2 id="projects-title">
                    THINGS WE
                    <br />
                    ACTUALLY BUILT.
                </h2>

                <p className={styles.intro}>
                    Projects, experiments and moments from Hackistan.
                </p>
    
            </div>

            <div className={styles.readout} aria-hidden="true">
                <span>ARCHIVE / ACTIVE</span>
                <span> QUETTA / PK</span>
                <span>PROJECTS / PEOPLE / BUILDS</span>
            </div>

        </header>

        <div className={styles.railHeader}>
            <span>HACKISTAN / ARCHIVE</span>
            <span>SCROLL / DRAG →</span>
        </div>


        <div 
            ref={railRef}
            className={styles.rail}
            tabIndex={0}
            aria-label="Hackistan Projects and Club Gallery"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
        >
            {projectsGalleryItems.map((item, index) => (
                <GalleryItem key={item.id} item={item} onOpen={() => {
                    if (dragState.current.moved) {
                        dragState.current.moved = false;
                        return;
                    }
                    setLightboxIndex(index);
                }}/>
            ))}
        </div>
    </div>

    
    {lightboxItem && (
        <div
            className={styles.lightbox}
            role="dialog"
            aria-modal="true"
            aria-label={`${lightboxItem.title} image viewer`}
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    setLightboxIndex(null);
            }
            }}
        >

            <button 
                type="button"
                className={styles.lightboxClose}
                onClick={() => setLightboxIndex(null)}
            >
                CLOSE 
            </button>

            <button 
                type="button"
                className={`${styles.lightboxNav} ${styles.lightboxPrevious}`}
                onClick={() =>
                    setLightboxIndex((current) =>
                    current === null
                        ? null
                        : (current - 1 + projectsGalleryItems.length) % projectsGalleryItems.length)
                }
                aria-label="Previous image"
            >
                ←
            </button>       

            <figure className={styles.lightboxFigure}>
                <img 
                    src={lightboxItem.image}
                    alt={lightboxItem.alt}
                    className={styles.lightboxImage}
                />

                <figcaption className={styles.lightboxCaption}>

                    <span className={styles.lightboxCounter}>
                        {String((lightboxIndex ?? 0) + 1).padStart(2, "0")}/{" "}
                        {String(projectsGalleryItems.length).padStart(2, "0")}
                    </span>
                    
                    <div>
                        <span>
                            {lightboxItem.kind === "project"
                                ? "PROJECT"
                                : "CLUB / MOMENT"}
                        </span>
                        <span>{lightboxItem.meta}</span>
                    </div>

                    <strong>{lightboxItem.title}</strong>

                    {lightboxItem.description && (
                        <p>{lightboxItem.description}</p>
                        )
                    }

                    {lightboxItem.href && (
                        <a 
                            href={lightboxItem.href}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            VIEW PROJECT
                        </a>
                    )}
                </figcaption>
            </figure>

            <button
                type="button"
                className={`${styles.lightboxNav} ${styles.lightboxNext}`}
                onClick={() =>
                    setLightboxIndex((current) =>
                    current === null
                    ? null
                    : (current + 1) % projectsGalleryItems.length
                )
                }
                aria-label="Next Image"
            >
                →
            </button>
        </div>
    )}



        



</section>
);
}



    
    
    