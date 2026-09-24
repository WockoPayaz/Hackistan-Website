import { HackistanMark } from "@/components/brand/HackistanMark";
import { Arrow } from "@/components/ui/Arrow";
import styles from "./layout.module.css";

export function SiteEnd() {
  return <footer className={`${styles.footer} page-width`}><div className={styles.signature}><span className={styles.smallMark}><HackistanMark /></span><span className="eyebrow">Hackistan<br /><span className="muted">Quetta, Pakistan</span></span></div><a href="#top" className="text-link eyebrow"><span>Back to top</span><span><Arrow direction="up" /></span></a></footer>;
}
