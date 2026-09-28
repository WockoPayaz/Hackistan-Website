import {
    projectsGalleryItems,
    type ProjectsGalleryItem,
} from '@/data/projectsGallery';

import styles from "./ProjectsGallery.module.css";

function GalleryItem({ item }: { item: ProjectsGalleryItem }) {
    const isProject = item.kind === "project";

    return (
        <article
        className={`${styles.card} ${
            isProject ? styles.projectCard : styles.meetingCard
        }`}
        >

        <div className={styles.media}>
        <img
            src={item.image}
            alt={item.alt}
            width="1200"
            height="800"
            loading="lazy"
            className={styles.image}
        />


        <span className={styles.imageNumber} aria-hidden="true">
            {item.number}
        </span>
        </div>


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
            className={styles.rail}
            tabIndex={0}
            aria-label="Hackistan Projects and Club Gallery"
        >
            {projectsGalleryItems.map((item) => (
                <GalleryItem key={item.id} item={item} />
            ))}
        </div>
    </div>
</section>
);
}



    
    
    