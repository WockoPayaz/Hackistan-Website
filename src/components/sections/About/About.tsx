import { markGeometry } from "@/components/brand/geometry";
import { AboutTransition } from "./AboutTransition";
import styles from "./About.module.css";

export function About() {
  return <section id="about" className={styles.section} aria-labelledby="about-title" data-about>
    <AboutTransition />
    <div className={styles.runway} data-about-runway>
      <div className={styles.scene} data-about-scene>
        <div className={styles.world} data-about-world>
          <div className={styles.gridPlane} data-about-grid-plane aria-hidden="true" />
          <div className={styles.plusPlane} data-about-plus-plane aria-hidden="true" />
          <svg className={styles.outline} data-about-outline viewBox="-8 -8 420 420" fill="none" aria-hidden="true" focusable="false">
            <path d={markGeometry.left} />
            <path d={markGeometry.bridge} />
            <path d={markGeometry.right} />
          </svg>
          <div className={`${styles.information} page-width`}>
            <span className={`${styles.index} eyebrow`} data-about-index>02 / About</span>
            <div className={styles.hackistan} data-about-copy>
              <h2 id="about-title" className={styles.heading} data-about-heading><span className={styles.headingLine} data-about-heading-line>Hackistan</span><span className={`${styles.headingLine} ${styles.headingSuffix}`} data-about-heading-line>/ Quetta</span></h2>
              <p data-about-description><span className={styles.desktopCopy}>A student-led maker community in Quetta where ideas become things you can actually build.</span><span className={styles.mobileCopy}>A student-led maker community in Quetta building games, hardware, experiments and hackathons together.</span></p>
              <p className={styles.desktopCopy} data-about-description>Workshops, games, hardware, experiments and hackathons. Built by learning together.</p>
            </div>
            <div className={styles.hackClub} data-about-copy>
              <h3 className={`${styles.heading} ${styles.clubHeading}`} data-about-heading><span className={styles.headingLine} data-about-heading-line>Hack Club</span><span className={`${styles.headingLine} ${styles.headingSuffix}`} data-about-heading-line>/ Worldwide</span></h3>
              <p data-about-description><span className={styles.desktopCopy}>A global community of teenage makers, clubs and hackathons built around learning by making.</span><span className={styles.mobileCopy}>A global community of teenage makers, clubs and hackathons.</span></p>
              <p className={styles.supporting} data-about-description><span className={styles.desktopCopy}>Hack Club is operated by The Hack Foundation, a U.S. 501(c)(3) nonprofit organization.</span><span className={styles.mobileCopy}>Operated by The Hack Foundation, a U.S. 501(c)(3) nonprofit.</span></p>
              <a className={`${styles.externalLink} eyebrow`} data-about-description href="https://hackclub.com/" target="_blank" rel="noopener noreferrer" aria-label="Explore Hack Club (opens in a new tab)">Explore Hack Club <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>;
}
