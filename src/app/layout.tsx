import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "@/styles/tokens.css";
import "@/styles/reset.css";
import "@/styles/typography.css";
import "@/styles/utilities.css";
import "@/styles/transitions.css";

const geist = localFont({
  src: "../../public/fonts/Geist-Variable.woff2",
  variable: "--font-geist",
  weight: "100 900",
  display: "swap",
  preload: true,
});

// Set this at build time once the public production domain is confirmed.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
const metadataBase = siteUrl && /^https:\/\/[^/]+$/.test(siteUrl) ? new URL(siteUrl) : undefined;
const description = "Hackistan is a student-led Hack Club maker community in Quetta, Pakistan. Explore what we're building, workshops, and ways to join.";

export const metadata: Metadata = {
  title: "Hackistan",
  description,
  applicationName: "Hackistan",
  metadataBase,
  ...(metadataBase ? { alternates: { canonical: "/" } } : {}),
  icons: { icon: "/brand/hackistan-icon.svg" },
  openGraph: {
    title: "Hackistan | Student-led in Quetta", description, type: "website", locale: "en_PK", siteName: "Hackistan",
    ...(metadataBase ? { url: "/", images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Hackistan — Student-led. Built in Quetta." }] } : {}),
  },
  twitter: {
    card: metadataBase ? "summary_large_image" : "summary",
    title: "Hackistan | Student-led in Quetta", description,
    ...(metadataBase ? { images: ["/og-image.png"] } : {}),
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={geist.variable}><body><a className="skip-link" href="#main">Skip to main content</a><SiteHeader />{children}<div className="grain" aria-hidden="true" /></body></html>;
}
