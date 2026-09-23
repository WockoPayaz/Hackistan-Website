import type { Metadata } from "next";
import "./globals.css";
import { GrainOverlay } from "@/components/layout/GrainOverlay";
import { CustomCursor } from "@/components/layout/CustomCursor";

export const metadata: Metadata = {
  title: "Hackistan — Student-Led Technology Community",
  description: "An experimental student-led Hack Club based in Quetta, Pakistan.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark bg-[#0B0C0D] text-[#F2F0EA]">
      <body className="relative min-h-screen">
        <GrainOverlay />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
