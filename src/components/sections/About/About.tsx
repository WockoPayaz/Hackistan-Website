import { markGeometry } from "@/components/brand/geometry";
import { AboutTransition } from "./AboutTransition";
import styles from "./About.module.css";

// Fixed positions keep the registration field stable across renders and scroll reversals.
const registrations = [
  [9, 18, 0], [23, 69, 1], [35, 32, 2], [48, 86, 0],
  [61, 12, 1], [72, 76, 2], [85, 37, 0], [93, 82, 1],
  [15, 92, 2], [41, 54, 1], [78, 55, 2], [55, 26, 0],
] as const;

export function About() {
  return <section id="about" className={styles.section} aria-labelledby="about-title" data-about>
    <AboutTransition />
    <div className={styles.runway} data-about-runway>
      <div className={styles.scene} data-about-scene>
        <div className={styles.grid} data-about-grid aria-hidden="true" />
        <div className={styles.registrations} aria-hidden="true">
          {registrations.map(([x, y, depth], index) => <span key={index} className={`${styles.registration} ${styles[`depth${depth}`]}`} data-about-registration data-depth={depth} style={{ left: `${x}%`, top: `${y}%` }}>+</span>)}
        </div>
        <svg className={styles.outline} data-about-outline viewBox="-8 -8 420 420" fill="none" aria-hidden="true" focusable="false">
          <path d={markGeometry.left} />
          <path d={markGeometry.bridge} />
          <path d={markGeometry.right} />
        </svg>
        <div className={`${styles.information} page-width`}>
          <span className={`${styles.index} eyebrow`} data-about-copy>02 / About</span>
          <div className={styles.hackistan} data-about-copy>
            <h2 id="about-title" className="eyebrow">Hackistan / Quetta</h2>
            <p>A student-led maker community in Quetta.</p>
            <p>Workshops, games, hardware, experiments and hackathons — built by learning together.</p>
          </div>
          <div className={styles.hackClub} data-about-copy>
            <h3 className="eyebrow">Hack Club / Worldwide</h3>
            <p>Part of Hack Club, a global community of teenage makers operated by The Hack Foundation, a U.S. 501(c)(3) nonprofit.</p>
            <a className={`${styles.externalLink} eyebrow`} href="https://hackclub.com/" target="_blank" rel="noopener noreferrer" aria-label="Explore Hack Club (opens in a new tab)">Explore Hack Club <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </div>
    </div>
  </section>;
}
