import type { Metadata, Viewport } from "next";
import "./globals.css";
import Link from "next/link";
import HUD from "@/components/HUD";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "HVAC Career Simulator", template: "%s | HVAC Career Simulator" },
  description: "Train, certify, and build an HVAC career in a game-based simulator: classes, labs, EPA 608 prep and real service calls.",
  applicationName: "HVAC Career Simulator",
  openGraph: { title: "HVAC Career Simulator", description: "Go from HVAC student to certified technician and contractor.", type: "website", siteName: "HVAC Career Simulator" },
};

export const viewport: Viewport = { themeColor: "#1e3a8a", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <HUD />
        <nav className="flex flex-wrap gap-3 border-b border-slate-700 px-6 py-2 text-sm">
          {["profile", "campus", "quests", "skills", "toolbelt", "certifications", "graduation", "placement-test", "residential-career", "commercial-career", "company-builder"].map((r) => (
            <Link key={r} href={`/${r}`} className="capitalize text-hvac-blue hover:underline">
              {r}
            </Link>
          ))}
        </nav>
        <main className="mx-auto max-w-4xl p-6">{children}</main>
      </body>
    </html>
  );
}
