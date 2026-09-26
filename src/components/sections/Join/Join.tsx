import styles from "./Join.module.css";

const requirements = [
  { heading: "Who can join", label: "13–18 · Quetta", copy: "You must be between 13 and 18 years old, inclusive, and based in Quetta. You do not need previous coding, design, hardware, or technical experience." },
  { heading: "In person", label: "The City School · For now", copy: "Physical Hackistan meetings and workshops are currently limited to students of The City School while we work toward securing an independent venue." },
  { heading: "YSWS", label: "Open across Quetta", copy: "Any eligible student aged 13–18 in Quetta can participate in Hack Club YSWS programs through Hackistan, regardless of school." },
  { heading: "Committee", label: "In-person availability", copy: "Committee members must be able to attend required physical committee meetings in Quetta." },
] as const;

const steps = [
  ["01 / Apply", "Submit the official Hack Club membership application."],
  ["02 / Review", "The Hackistan team reviews your application."],
  ["03 / Join", "If approved, we'll send you the next steps for participating in Hackistan."],
] as const;

export function Join() {
  return <section id="join" className={styles.section} aria-labelledby="join-title" data-join tabIndex={-1} inert>
    <div className={`${styles.content} page-width`}>
      <div className={styles.intro}>
        <span className={styles.index}>04 / JOIN</span>
        <h2 id="join-title">BUILD<br />WITH US.</h2>
        <p>Hackistan is open to students aged 13–18 in Quetta who are interested in building things. No prior experience is required. Just curiosity and a willingness to learn by making.</p>
        <a className={styles.cta} href="https://clubs.hackclub.com/auth/member?join=J55HAA" target="_blank" rel="noopener noreferrer" aria-label="Apply to join through the official Hack Club application (opens in a new tab)">APPLY TO JOIN <span aria-hidden="true">↗</span></a>
        <span className={styles.ctaLabel}>OFFICIAL HACK CLUB APPLICATION</span>
      </div>
      <div className={styles.details}>
        <div className={styles.requirements}>
          {requirements.map(({ heading, label, copy }) => <div className={styles.row} key={heading}>
            <h3>{heading}</h3><div><strong>{label}</strong><p>{copy}</p></div>
          </div>)}
        </div>
        <div className={styles.steps} aria-label="What happens next">
          <h3>WHAT HAPPENS NEXT</h3>
          <ol>{steps.map(([label, copy]) => <li key={label}><strong>{label}</strong><span>{copy}</span></li>)}</ol>
        </div>
      </div>
    </div>
  </section>;
}
