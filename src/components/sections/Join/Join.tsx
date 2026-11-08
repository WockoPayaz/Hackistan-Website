import styles from "./Join.module.css";

const joinCode = "J55HAA";

const requirements = [
  { heading: "Experience", label: "Beginners welcome", copy: "You can start here even if you’ve never written code, designed a part or built a game." },
  { heading: "Meetings", label: "In person · Quetta", copy: "Member meetings take place in Quetta. Committee members need to be available to attend in person." },
  { heading: "YSWS", label: "Hack Club programs", copy: "Each You Ship, We Ship program sets its own eligibility and submission requirements. Check the guide for the one you want to join." },
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
        <span className={styles.index}>05 / JOIN</span>
        <h2 id="join-title">BUILD<br />WITH US.</h2>
        <p>Open to everyone in Quetta aged 13–18.</p>
        <div className={styles.apply}>
          <a data-join-cta className={styles.cta} href={`https://clubs.hackclub.com/auth/member?join=${joinCode}`} target="_blank" rel="noopener noreferrer" aria-label="Apply to join through the official Hack Club application (opens in a new tab)">APPLY TO JOIN <span aria-hidden="true">↗</span></a>
          <div className={styles.code}><span className={styles.ctaLabel}>Hack Club join code</span><strong>{joinCode}</strong></div>
        </div>
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
