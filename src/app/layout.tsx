import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import HUD from "@/components/HUD";

export const metadata: Metadata = {
  title: "HVAC Career Simulator",
  description: "Train, certify, and build an HVAC career.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <HUD />
        <nav className="flex flex-wrap gap-3 border-b border-slate-700 px-6 py-2 text-sm">
          {["profile", "campus", "quests", "skills", "toolbelt", "certifications", "graduation"].map((r) => (
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
