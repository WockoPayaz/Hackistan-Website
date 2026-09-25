import Image from "next/image";
import type { Workshop } from "@/types/workshop";
import { WorkshopMeta } from "./WorkshopMeta";
import { Arrow } from "@/components/ui/Arrow";
import styles from "./CurrentWorkshop.module.css";

export function CurrentWorkshop({ workshop }: { workshop?: Workshop }) {
  if (!workshop) return <section id="now" className={`${styles.empty} page-width`} aria-labelledby="empty-title"><p className="eyebrow">01 / Now</p><h2 id="empty-title" className="display">No active workshop.</h2><p className="body-copy muted">Next program announcement soon.</p></section>;

  return (
    <section id="now" className={styles.section} data-now aria-labelledby="workshop-title" tabIndex={-1}>
      <article className={`${styles.composition} page-width page-grid`} data-now-composition>
        <div className={styles.index} data-now-reveal><span className="eyebrow">01 / Now</span><span className={`${styles.status} eyebrow`}><span aria-hidden="true">●</span> Current</span></div>
        <div className={styles.kicker} data-now-reveal><p className="eyebrow">Current workshop</p><p className="eyebrow muted">{workshop.tags.join(" / ")}</p></div>
        <figure className={styles.figure}>
          <div className={styles.media} data-workshop-media>
            {workshop.coverImage ? <Image src={workshop.coverImage} alt={workshop.coverAlt ?? workshop.title} fill sizes="(max-width: 767px) 90vw, (max-width: 1023px) 85vw, 66vw" className={styles.image} loading="lazy" data-workshop-image /> : <div className={styles.mediaFallback}><span className="eyebrow">Work in progress</span></div>}
            <span className={`${styles.mediaIndex} eyebrow`} aria-hidden="true">In good company.</span>
          </div>
          {workshop.coverCredit && <figcaption className={styles.credit} data-now-reveal><a href={workshop.coverCredit.url} target="_blank" rel="noreferrer">{workshop.coverCredit.label}<span className="sr-only"> (opens in a new tab)</span></a></figcaption>}
        </figure>
        <h2 id="workshop-title" className={`${styles.title} display`}>
          {(workshop.titleLines ?? [workshop.title]).map((line) => <span className="clip-line" key={line}><span data-now-title>{line}</span></span>)}
        </h2>
        <WorkshopMeta workshop={workshop} />
        <div className={styles.description} data-now-reveal><p className="body-copy">{workshop.shortDescription}</p>{workshop.href && <a href={workshop.href} className="text-link eyebrow"><span>Explore workshop</span><span><Arrow direction="right" /></span></a>}</div>
      </article>
    </section>
  );
}
