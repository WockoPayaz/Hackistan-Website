import { HackistanMark } from "@/components/brand/HackistanMark";
import { Arrow } from "@/components/ui/Arrow";
import styles from "./layout.module.css";

export function SiteEnd() {
  return (
    <footer className={`${styles.footer} page-width`}>
      <div className={styles.footerMain}>
        <div className={styles.signature}>
          <span className={styles.smallMark}>
            <HackistanMark />
          </span>

          <span className="eyebrow">
            Hackistan
            <br />
            <span className="muted">Quetta, Pakistan</span>
          </span>
        </div>

        <nav className={styles.footerLinks} aria-label="Hackistan Links">
          <a 
            href="https://www.instagram.com/hackistan.hackclub/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram ↗
          </a>

          <a 
            href="https://github.com/WockoPayaz/Hackistan-Website"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github ↗
          </a>

          <a 
            href="mailto:shahfahadfarooq3015@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Email ↗
          </a>    
        </nav>
      </div>

      <div className={styles.footerBottom}>
        <span className="eyebrow muted">
          STUDENT-LED / QUETTA, PK
        </span>

        <a href="#top" className="text-link eyebrow">
          <span>Back to Top</span>
          <span>
            <Arrow direction="up" />
          </span>
        </a>
      </div>
    </footer>
  )
}
