import styles from "./Contact.module.css";

export function Contact() {
  return <section id="contact" className={styles.section} aria-labelledby="contact-title" tabIndex={-1}>
    <div className={`${styles.inner} page-width`}>
      <div className={styles.topRule} aria-hidden="true" />
      <div className={styles.layout}>
        <div>
          <p className={styles.index}>07 / CONTACT</p>
          <h2 id="contact-title">GET IN<br />TOUCH.</h2>
        </div>
        <div className={styles.details}>
          <p className={styles.intro}>Questions about joining, workshops, collaborations or Hackistan? Reach out.</p>
          <a className={styles.email} href="mailto:contact@hackistan.club" aria-label="Email Hackistan at contact@hackistan.club">contact@hackistan.club <span aria-hidden="true">↗</span></a>
          <nav className={styles.socials} aria-label="Hackistan social links">
            <a href="https://www.instagram.com/hackistan.hackclub/" target="_blank" rel="noopener noreferrer" aria-label="Hackistan on Instagram (opens in a new tab)">INSTAGRAM <span aria-hidden="true">↗</span></a>
            <a href="https://github.com/WockoPayaz/Hackistan-Website" target="_blank" rel="noopener noreferrer" aria-label="Hackistan on GitHub (opens in a new tab)">GITHUB <span aria-hidden="true">↗</span></a>
          </nav>
        </div>
      </div>
    </div>
  </section>;
}
