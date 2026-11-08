import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { workshops, workshopStatusLabel } from "@/data/workshops";
import styles from "./page.module.css";

export function generateStaticParams() { return workshops.map(({ slug }) => ({ slug })); }
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const workshop = workshops.find((item) => item.slug === slug);
  return { title: `${workshop?.title ?? "Workshop"} | Hackistan`, description: workshop?.shortDescription,
    alternates: { canonical: `/workshops/${slug}/` }, openGraph: { title: `${workshop?.title ?? "Workshop"} | Hackistan`, description: workshop?.shortDescription, url: `/workshops/${slug}/` } };
}
export default async function WorkshopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const workshop = workshops.find((item) => item.slug === slug);
  if (!workshop) notFound();
  return <main id="main" tabIndex={-1} className={`${styles.page} page-width`}>
    <a className={styles.back} href="/#projects">← Back to things we actually built</a>
    <header className={styles.hero} style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.1), rgba(0,0,0,.8)), url("${workshop.tileImage}")` }}>
      <p className="eyebrow">Hackistan / {workshop.kind ?? "Workshop"} / {workshopStatusLabel(workshop)}</p>
      <h1>{workshop.title}</h1><p className="eyebrow">{workshop.tags.join(" / ")}</p>
    </header>
    <div className={styles.details}>
      <dl><div><dt>Status</dt><dd>{workshopStatusLabel(workshop)}</dd></div><div><dt>Dates</dt><dd>{workshop.dateLabel}</dd></div>{workshop.acceptedSubmissions !== undefined && <div><dt>{workshop.submissionLabel ?? "Accepted submissions"}</dt><dd className={styles.count}>{workshop.acceptedSubmissions}</dd></div>}
        {workshop.facts?.map(({ label, value }) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
      </dl>
      <section><h2>{workshop.status === "completed" ? "What we built" : "What we’re making"}</h2><p>{workshop.shortDescription}</p>
        {workshop.id === "boba-drops" && <p>Our 19–27 October workshop concluded with 12 accepted submissions. Explore the ships and projects on our Hack Club page.</p>}
        {workshop.description && <p>{workshop.description}</p>}
        {workshop.fulfillmentNote && <aside className={styles.note}><h3 className="eyebrow">Print fulfillment</h3><p>{workshop.fulfillmentNote}</p></aside>}
        {workshop.status === "upcoming" && <p>This workshop is planned. Session dates and more details will be shared when they’re ready.</p>}
        <div className={styles.links}>{workshop.resources?.map((resource) => <a className={styles.button} key={resource.id} href={resource.url} target="_blank" rel="noopener noreferrer">{resource.title} ↗<span className="sr-only"> (opens in a new tab)</span></a>)}</div>
      </section>
    </div>
    {workshop.photos && <section className={styles.gallery} aria-labelledby="photos-title">
      <h2 id="photos-title">{workshop.kind === "Game jam" ? "Game jam gallery" : "Workshop photos"}</h2>
      <div className={styles.photos}>{workshop.photos.map(({ number, src, alt }) =>
        <figure key={number}>{src
          ? <img src={src} alt={alt} width={1200} height={900} loading="lazy" />
          : <div className={styles.photoSlot}><span className="eyebrow">Photo {number}</span><span>Awaiting photograph</span></div>}
        </figure>)}</div>
    </section>}
  </main>;
}
