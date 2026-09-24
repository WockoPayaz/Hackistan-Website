import type { Workshop } from "@/types/workshop";
import { formatWorkshopDate, padNumber } from "@/lib/format";
import styles from "./CurrentWorkshop.module.css";

export function WorkshopMeta({ workshop }: { workshop: Workshop }) {
  return (
    <dl className={`${styles.meta} eyebrow`} data-now-reveal>
      <div><dt>In the making</dt><dd><time dateTime={workshop.startDate}>{formatWorkshopDate(workshop.startDate)}</time>{workshop.endDate && <> — <time dateTime={workshop.endDate}>{formatWorkshopDate(workshop.endDate)}</time></>}</dd></div>
      {workshop.session !== undefined && workshop.totalSessions !== undefined && <div><dt>Progress</dt><dd>Session {padNumber(workshop.session)} / {padNumber(workshop.totalSessions)}</dd></div>}
    </dl>
  );
}
