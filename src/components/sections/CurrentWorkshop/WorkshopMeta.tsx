import type { Workshop } from "@/types/workshop";
import { formatWorkshopDate } from "@/lib/format";
import styles from "./CurrentWorkshop.module.css";

export function WorkshopMeta({ workshop }: { workshop: Workshop }) {
  return (
    <dl className={`${styles.meta} eyebrow`} data-now-reveal>
      <div><dt>In the making</dt><dd><time dateTime={workshop.startDate}>{formatWorkshopDate(workshop.startDate)}</time>{workshop.endDate && <> — <time dateTime={workshop.endDate}>{formatWorkshopDate(workshop.endDate)}</time></>}</dd></div>
      {workshop.difficulty && <div><dt>Difficulty</dt><dd>{workshop.difficulty}</dd></div>}
    </dl>
  );
}
