import { Wordmark } from "@/components/brand/Wordmark";
import { LogoScene } from "@/components/brand/LogoScene";
import { HeroRibbons } from "./HeroRibbons";
import { ConstructionDrawing, HeroEntrance, ViewportGuides } from "./HeroEntrance";
import { Arrow } from "@/components/ui/Arrow";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className={styles.hero} data-hero data-intro="pending" tabIndex={-1}>
      <HeroEntrance />
      <div className={styles.stage} data-hero-stage>
        <div className={`${styles.frame} page-width`}>
          <HeroRibbons />
          <div className={styles.background} data-hero-wordmark><h1 id="hero-title"><Wordmark /></h1></div>
          <ViewportGuides />
          <div className={styles.mark} data-mark-stage><LogoScene /><ConstructionDrawing /></div>
          <p className={`${styles.locator} eyebrow`} data-hero-edge>Quetta / Pakistan<br /><span className="muted">30.18° N &nbsp; 66.98° E</span></p>
          <p className={`${styles.manifesto} eyebrow`} data-hero-edge>Ideas<br />People<br />Progress</p>
          <div className={styles.bottom} data-hero-edge>
            <p className={`${styles.descriptor} eyebrow`}>Student-led.<br />Built in Quetta.<br /><span className="muted">A Hack Club community.</span></p>
            <a href="#now" className={`${styles.scroll} text-link eyebrow`}><span>Scroll to explore</span><span><Arrow /></span></a>
          </div>
          <span className={`${styles.edition} eyebrow muted`} data-hero-edge>00 — Identity</span>
        </div>
      </div>
    </section>
  );
}
