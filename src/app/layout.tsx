import type { Metadata } from "next";
import "./globals.css";
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
        <main className="mx-auto max-w-4xl p-6">{children}</main>
      </body>
    </html>
  );
}
