"use client";

import { useEffect, useRef, useState } from "react";
import type { ShelfItem } from "@/data/shelfItems";
import type { ShelfController } from "./WorkshopShelfScene";
import styles from "./Upcoming.module.css";

export function WorkshopShelf({ items }: { items: readonly ShelfItem[] }) {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const controller = useRef<ShelfController | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const element = root.current, target = canvas.current;
    if (!element || !target || items.length === 0) return;
    let disposed = false;
    let started = false;
    const onExit = () => controller.current?.close();
    window.addEventListener("hackistan:shelf-exit", onExit);
    const start = () => {
      if (started) return;
      started = true;
      void import("./WorkshopShelfScene").then(({ createWorkshopShelfScene }) =>
        createWorkshopShelfScene(target, items, {
          onActive: (index) => { if (!disposed) setActive(index); },
          onOpen: (index) => { if (!disposed) setOpen(index); },
          onFailure: () => {
            if (disposed) return;
            setFailed(true);
            delete element.dataset.shelfReady;
            window.dispatchEvent(new Event("hackistan:shelf-ready"));
          },
        })
      ).then((created) => {
        if (disposed) { created?.dispose(); return; }
        if (!created) { setFailed(true); window.dispatchEvent(new Event("hackistan:shelf-ready")); return; }
        controller.current = created;
        element.dataset.shelfReady = "true";
        setReady(true);
        window.dispatchEvent(new Event("hackistan:shelf-ready"));
      }).catch(() => { if (!disposed) { setFailed(true); window.dispatchEvent(new Event("hackistan:shelf-ready")); } });
    };
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) { observer?.disconnect(); start(); }
    }, { rootMargin: "150% 0px" });
    if (observer) observer.observe(element.closest("[data-about]") ?? element);
    else start();
    return () => {
      disposed = true;
      observer?.disconnect();
      window.removeEventListener("hackistan:shelf-exit", onExit);
      controller.current?.dispose();
      controller.current = null;
      delete element.dataset.shelfReady;
    };
  }, [items]);

  const activeItem = items[active];
  const openItem = open === null ? null : items[open];
  return <section id="upcoming" className={`${styles.section} ${open !== null ? styles.bookOpen : ""}`} aria-labelledby="upcoming-title" data-upcoming ref={root} inert>
    <div className={styles.header}>
      <h2 id="upcoming-title" className={styles.index}>03 / UPCOMING</h2>
      <span className={styles.kicker}>WORKSHOPS / YSWS / PLANNED</span>
    </div>
    <div className={styles.groups} aria-label="Shelf groups">
      {(["current", "active", "planned"] as const).map((status) =>
        <span key={status} className={activeItem?.status === status ? styles.groupActive : ""}>{status === "active" ? "ACTIVE YSWS" : status.toUpperCase()}</span>
      )}
    </div>
    <canvas ref={canvas} className={`${styles.canvas} ${ready && !failed ? styles.canvasReady : ""}`} data-shelf-canvas tabIndex={0} aria-label="Interactive workshop shelf. Use left and right arrows to browse, Enter to open, Escape to close." />
    <div className={styles.controls}>
      <button type="button" onClick={() => controller.current?.navigate(-1)} disabled={!ready || failed || open !== null || active === 0} aria-label="Previous book">←</button>
      <span aria-live="polite">{activeItem?.title ?? "Upcoming shelf"} <small>{items.length ? `${active + 1} / ${items.length}` : ""}</small></span>
      <button type="button" onClick={() => controller.current?.navigate(1)} disabled={!ready || failed || open !== null || active === items.length - 1} aria-label="Next book">→</button>
      <button type="button" className={styles.openButton} disabled={!ready || failed || open !== null || !activeItem} onClick={() => controller.current?.open(active)}>OPEN BOOK ↗</button>
    </div>
    {openItem && <div className={styles.detail} role="region" aria-label={`${openItem.title} book preview`}>
      <button type="button" className={styles.close} onClick={() => controller.current?.close()} aria-label="Close book">CLOSE ×</button>
      <p className={styles.detailEyebrow}>{openItem.kind === "ysws" ? "HACK CLUB / YSWS" : "HACKISTAN / WORKSHOP"} <span>{openItem.status.toUpperCase()}</span></p>
      <h3>{openItem.title}</h3>
      <p className={styles.date}>{openItem.dateLabel}</p>
      <p>{openItem.shortDescription}</p>
      {openItem.href ? <a href={openItem.href}>{openItem.kind === "ysws" ? "EXPLORE PROGRAM ↗" : "VIEW DETAILS ↗"}</a> : <span className={styles.pending}>DETAILS COMING SOON</span>}
    </div>}
    <ol className={`${styles.catalog} ${ready && !failed ? styles.catalogAccessible : ""}`} aria-label="Upcoming shelf catalog">
      {items.map((item, index) => <li key={item.id}>
        <span>{item.status === "active" ? "ACTIVE YSWS" : item.status.toUpperCase()}</span>
        <strong>{item.title}</strong>
        <small>{item.dateLabel}</small>
        <p>{item.shortDescription}</p>
        {ready && <button type="button" onClick={() => controller.current?.open(index)}>Open book</button>}
        {item.href ? <a href={item.href}>{item.kind === "ysws" ? "Explore program ↗" : "View details ↗"}</a> : <span>Details coming soon</span>}
      </li>)}
    </ol>
  </section>;
}
