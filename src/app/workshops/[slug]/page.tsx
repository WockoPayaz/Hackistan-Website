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
      <p className="eyebrow">Hackistan / Workshop / {workshopStatusLabel(workshop)}</p>
      <h1>{workshop.title}</h1><p className="eyebrow">{workshop.tags.join(" / ")}</p>
    </header>
    <div className={styles.details}>
      <dl><div><dt>Status</dt><dd>{workshopStatusLabel(workshop)}</dd></div><div><dt>Dates</dt><dd>{workshop.dateLabel}</dd></div>{workshop.acceptedSubmissions !== undefined && <div><dt>Accepted submissions</dt><dd className={styles.count}>{workshop.acceptedSubmissions}</dd></div>}</dl>
      <section><h2>{workshop.status === "completed" ? "What we built" : "What we’re making"}</h2><p>{workshop.shortDescription}</p>
        {workshop.id === "boba-drops" && <p>Our 19–27 October workshop concluded with 12 accepted submissions. Explore the ships and projects on our Hack Club page.</p>}
        {workshop.id === "bakebuild" && <p>Sketch a simple shape, trace it in Onshape, and turn it into a cookie cutter. Export your design for printing and follow the BakeBuild guide to submit it.</p>}
        {workshop.status === "upcoming" && <p>This workshop is planned. Session dates and more details will be shared when they’re ready.</p>}
        {workshop.resources?.map((resource) => <a className={styles.button} key={resource.id} href={resource.url} target="_blank" rel="noopener noreferrer">{resource.title} ↗<span className="sr-only"> (opens in a new tab)</span></a>)}
      </section>
    </div>
  </main>;
}
