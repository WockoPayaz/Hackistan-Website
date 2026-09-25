import { markGeometry } from "@/components/brand/geometry";
import { AboutTransition } from "./AboutTransition";
import styles from "./About.module.css";

export function About() {
  return <section id="about" className={styles.section} aria-labelledby="about-title" data-about>
    <AboutTransition />
    <div className={styles.runway} data-about-runway>
      <div className={styles.scene} data-about-scene>
        <div className={styles.world} data-about-world>
          <div className={styles.technicalField} data-about-technical-field data-about-grid data-about-registrations aria-hidden="true" />
          <svg className={styles.outline} data-about-outline viewBox="-8 -8 420 420" fill="none" aria-hidden="true" focusable="false">
            <path d={markGeometry.left} />
            <path d={markGeometry.bridge} />
            <path d={markGeometry.right} />
          </svg>
          <div className={`${styles.information} page-width`}>
            <span className={`${styles.index} eyebrow`} data-about-index>02 / About</span>
            <div className={styles.hackistan} data-about-copy>
              <div className={styles.headingClip}><h2 id="about-title" data-about-heading>Hackistan <span>/ Quetta</span></h2></div>
              <p data-about-description>A student-led maker community in Quetta where ideas become things you can actually build.</p>
              <p data-about-description>Workshops, games, hardware, experiments and hackathons — built by learning together.</p>
            </div>
            <div className={styles.hackClub} data-about-copy>
              <div className={styles.headingClip}><h3 data-about-heading>Hack Club <span>/ Worldwide</span></h3></div>
              <p data-about-description>A global community of teenage makers, clubs and hackathons built around learning by making.</p>
              <p className={styles.supporting} data-about-description>Hack Club is operated by The Hack Foundation, a U.S. 501(c)(3) nonprofit organization.</p>
              <a className={`${styles.externalLink} eyebrow`} data-about-description href="https://hackclub.com/" target="_blank" rel="noopener noreferrer" aria-label="Explore Hack Club (opens in a new tab)">Explore Hack Club <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>;
}
