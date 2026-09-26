import { existsSync } from "node:fs";
import path from "node:path";
import { crew, type CrewMember } from "@/data/crew";
import styles from "./Crew.module.css";

function Member({ member }: { member: CrewMember }) {
  const portrait = member.image && existsSync(path.join(process.cwd(), "public", member.image.slice(1))) ? member.image : null;
  const nameProvided = !/^MEMBER \d+$/.test(member.name);
  return <article className={styles.member}>
    <div className={`${styles.portrait} ${portrait ? styles.hasPortrait : styles.placeholder}`}>
      <span className={styles.portraitNumber} aria-hidden="true">{member.number}</span>
      {portrait ? <img src={portrait} alt={nameProvided ? `Portrait of ${member.name}` : ""} width="640" height="640" loading="lazy" /> : <span className={styles.placeholderLabel} aria-hidden="true">PORTRAIT / PENDING</span>}
      <span className={styles.portraitTicks} aria-hidden="true">///</span>
    </div>
    <div className={styles.bio}>
      <h3>{member.name}</h3>
      <p className={styles.role}>{member.role}</p>
      <span className={styles.shortRule} aria-hidden="true" />
      <p className={styles.description}>{member.description}</p>
      {member.profileHref && member.profileLabel ? <a href={member.profileHref} target="_blank" rel="noopener noreferrer" aria-label={`${member.profileLabel} for ${member.name} (opens in a new tab)`}>{member.profileLabel} <span aria-hidden="true">↗</span></a> : null}
    </div>
  </article>;
}

export function Crew() {
  return <section id="crew" className={styles.section} data-crew aria-labelledby="crew-title" tabIndex={-1}>
    <div className={`${styles.inner} page-width`}>
      <div className={styles.topRule} aria-hidden="true" />
      <div className={styles.intro}>
        <div>
          <p className={styles.index}>05 / THE CREW</p>
          <h2 id="crew-title"><span>THE PEOPLE</span>{" "}<span>BEHIND</span>{" "}<span>HACKISTAN.</span></h2>
          <p className={styles.lead}>Student-led in Quetta. Built by people who like making things happen.</p>
        </div>
        <div className={styles.readout} aria-hidden="true"><span>THE CREW / ACTIVE</span><span>QUETTA / PK</span><span>IDEAS / PEOPLE / PROGRESS</span></div>
      </div>
      <div className={styles.grid}>
        {crew.map((member) => <Member key={member.id} member={member} />)}
      </div>
    </div>
  </section>;
}
