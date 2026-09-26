import { HackistanMark } from "@/components/brand/HackistanMark";
import styles from "./not-found.module.css";

export default function NotFound() {
  return <main id="main" tabIndex={-1} className={`${styles.page} page-width`}>
    <div className={styles.rule} aria-hidden="true" />
    <div className={styles.content}>
      <div>
        <p className={styles.index}>404 / OUT OF BOUNDS</p>
        <h1>LOST IN<br />THE WIRES.</h1>
        <p className={styles.description}>This page doesn&apos;t exist.</p>
        <a href="/" className={styles.link}>BACK TO HACKISTAN <span aria-hidden="true">↗</span></a>
      </div>
      <div className={styles.mark}><HackistanMark /></div>
    </div>
    <div className={styles.rule} aria-hidden="true" />
  </main>;
}
