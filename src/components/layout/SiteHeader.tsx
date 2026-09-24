"use client";

import { useEffect, useRef, useState } from "react";
import { HackistanMark } from "@/components/brand/HackistanMark";
import { scrollToSection } from "@/lib/navigation";
import styles from "./layout.module.css";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const menu = dialog.current;
    if (!menu) return;
    if (open) {
      menu.showModal();
      const previous = document.documentElement.style.overflow;
      document.documentElement.style.overflow = "hidden";
      return () => { document.documentElement.style.overflow = previous; menu.close(); };
    }
  }, [open]);

  const close = () => { setOpen(false); button.current?.focus(); };
  const navigate = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setOpen(false);
    // Release the dialog's native focus trap before moving focus to the section.
    dialog.current?.close();
    requestAnimationFrame(() => scrollToSection(id));
  };

  return (
    <>
      <header className={styles.header}>
        <a href="#top" className={styles.home} aria-label="Hackistan — back to top"><span className={styles.headerMark}><HackistanMark /></span><span>Hackistan</span></a>
        <button type="button" ref={button} className={`${styles.menuButton} eyebrow`} aria-haspopup="dialog" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(true)}><span>Menu</span><span className={styles.plus} aria-hidden="true">+</span></button>
        <noscript><style>{`.${styles.menuButton}{display:none}`}</style><a href="#now" className="text-link eyebrow">Now ↓</a></noscript>
      </header>
      <dialog ref={dialog} id="site-menu" aria-label="Site navigation" className={styles.menu} onCancel={(event) => { event.preventDefault(); close(); }} onClose={() => setOpen(false)} onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = event.currentTarget.querySelectorAll<HTMLElement>("button, a[href]");
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }}>
        <div className={styles.menuHeader}><span className="eyebrow">Hackistan / Quetta</span><button className={`${styles.menuButton} eyebrow`} type="button" onClick={close} autoFocus><span>Close</span><span className={styles.plus} aria-hidden="true">×</span></button></div>
        <nav aria-label="Main navigation" className={styles.menuLinks}>
          <a href="#top" onClick={(event) => navigate(event, "top")}><span className="eyebrow muted">00</span><span>Top</span><span className={styles.navArrow} aria-hidden="true">↗</span></a>
          <a href="#now" onClick={(event) => navigate(event, "now")}><span className="eyebrow muted">01</span><span>Now</span><span className={styles.navArrow} aria-hidden="true">↘</span></a>
        </nav>
        <p className={`${styles.menuEnd} eyebrow muted`}>Ideas fuel progress.<br />Student-led. Built in Quetta.</p>
      </dialog>
    </>
  );
}
