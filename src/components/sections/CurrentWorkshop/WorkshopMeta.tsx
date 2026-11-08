import type { Workshop } from "@/types/workshop";
import { formatWorkshopDate } from "@/lib/format";
import styles from "./CurrentWorkshop.module.css";

export function WorkshopMeta({ workshop }: { workshop: Workshop }) {
  const dates = workshop.dateLabel ?? <>
    {workshop.startDate && <time dateTime={workshop.startDate}>{formatWorkshopDate(workshop.startDate)}</time>}
    {workshop.endDate && <> — <time dateTime={workshop.endDate}>{formatWorkshopDate(workshop.endDate)}</time></>}
  </>;
  return (
    <dl className={`${styles.meta} eyebrow`} data-now-reveal>
      <div><dt>Local workshop dates</dt><dd>{dates}</dd></div>
      {workshop.difficulty && <div><dt>Difficulty</dt><dd>{workshop.difficulty}</dd></div>}
    </dl>
  );
}
