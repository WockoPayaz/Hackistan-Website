import { workshops, workshopStatusLabel } from "@/data/workshops";
import styles from "./WorkshopTiles.module.css";

export function WorkshopTiles() {
  return <div className={styles.workshops} aria-labelledby="workshop-archive-title">
    <header className={styles.heading}>
      <div><p className="eyebrow">The workshops behind the builds</p><h3 id="workshop-archive-title">Small starts. Real things.</h3></div>
      <p>Explore each workshop, what we made, and what comes next.</p>
    </header>
    <div className={styles.grid}>
      {workshops.map((workshop, index) => <article className={styles.tile} key={workshop.id} style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.12), rgba(0,0,0,.85)), url("${workshop.tileImage}")` }}>
        <div className={`${styles.top} eyebrow`}><span>{String(index + 1).padStart(2, "0")} / {workshop.tags.join(" + ")}</span><span className={styles.status}>{workshopStatusLabel(workshop)}</span></div>
        <div className={styles.copy}>
          <p className="eyebrow">{workshop.dateLabel}{workshop.acceptedSubmissions !== undefined && ` · ${workshop.acceptedSubmissions} accepted submissions`}</p>
          <h4>{workshop.title}</h4><p>{workshop.shortDescription}</p>
          <a href={workshop.href} className={styles.button} aria-label={`Explore ${workshop.title}`}>Explore workshop <span aria-hidden="true">↗</span></a>
        </div>
      </article>)}
    </div>
  </div>;
}
