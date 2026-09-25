import { AboutTransition } from "./AboutTransition";
import styles from "./About.module.css";

export function About() {
  return <section id="about" className={styles.section} aria-labelledby="about-title">
    <AboutTransition />
    <div className={`${styles.opening} page-width`} data-about-opening>
      <div className={`${styles.rule} ${styles.topRule}`} data-about-rule-top aria-hidden="true" />
      <span className={`${styles.sectionIndex} eyebrow`} data-about-index>02 / About</span>
      <div className={styles.statementWindow} data-about-window>
        <h2 id="about-title" className={`${styles.statement} display`} data-about-statement>
          <span>A place to make</span>
          <span>The things you</span>
          <span>Wish existed.</span>
        </h2>
      </div>
      <div className={`${styles.rule} ${styles.bottomRule}`} data-about-rule-bottom aria-hidden="true" />
    </div>

    <div className={`${styles.stories} page-width`}>
      <article className={`${styles.story} ${styles.hackistan}`}>
        <div className={styles.storyLabel}><span className={`${styles.storyNumber} eyebrow muted`}>01</span><h3 className="eyebrow">Hackistan / Quetta</h3></div>
        <div className={`${styles.storyBody} body-copy`}>
          <p className={styles.lead}>Hackistan is a student-led maker community in Quetta for people who want to turn ideas into real things.</p>
          <p>We run hands-on workshops, build projects together, and make room for students to explore technology beyond the classroom — from websites and <strong>game development</strong> to hardware, experiments, and whatever else feels worth trying.</p>
          <p>You don’t need to arrive knowing how to code. Hackistan is about learning by making: starting with curiosity, figuring things out with other people, and leaving with something you can point to and say, <em>we built that.</em></p>
          <p>We also want that energy to extend beyond regular workshops — through collaborative build sessions and <strong>hackathons where ideas have a deadline and teams have to make them real.</strong></p>
          <p>We’re building the kind of technical community we wanted to see around us — <strong>local, ambitious, collaborative, and actually fun to be part of.</strong></p>
        </div>
      </article>

      <article className={`${styles.story} ${styles.hackClub}`}>
        <div className={styles.storyLabel}><span className={`${styles.storyNumber} eyebrow muted`}>02</span><h3 className="eyebrow">Hack Club / Everywhere</h3></div>
        <div className={`${styles.storyBody} body-copy`}>
          <p className={styles.lead}>Hackistan is part of Hack Club, a global community of teenagers who make things with technology.</p>
          <p>Hack Club connects student-led clubs and young makers around the world through clubs, workshops, <strong>hackathons</strong>, programs, resources, and a wider community for turning ideas into real projects.</p>
          <p>Its clubs are built around a simple philosophy: learn by doing, make things you care about, and share what you build with others.</p>
          <p>Hack Club is operated by <strong>The Hack Foundation, a U.S. 501(c)(3) nonprofit organization.</strong></p>
          <a className={`${styles.externalLink} text-link eyebrow`} href="https://hackclub.com/" target="_blank" rel="noopener noreferrer" aria-label="Learn more about Hack Club (opens in a new tab)"><span>Learn more about Hack Club</span><span aria-hidden="true">↗</span></a>
        </div>
      </article>

      <p className={`${styles.closer} display`}><span>Hack Club gives us the wider network.</span><span>Hackistan gives it a home in Quetta.</span></p>
    </div>
  </section>;
}
