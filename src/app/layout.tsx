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

export const metadata: Metadata = {
  title: "Hackistan",
  description: "A student-led Hack Club in Quetta, Pakistan. Discover what we're designing, building and shipping together.",
  applicationName: "Hackistan",
  icons: { icon: "/brand/hackistan-icon.svg" },
  openGraph: { title: "Hackistan", description: "Student-led. Built in Quetta. See what we're making now.", type: "website", locale: "en_PK" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={geist.variable}><body><a className="skip-link" href="#now">Skip to current workshop</a><SiteHeader />{children}<div className="grain" aria-hidden="true" /></body></html>;
}
