import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

// Fonts are loaded via <link> in <head> rather than next/font, since
// next/font fetches Google Fonts at build time and some environments
// (including this build sandbox) don't allow that outbound request.
// This also means fonts never block the production build if the
// Google Fonts CDN has a transient issue.

export const metadata: Metadata = {
  title: {
    default: "CyberForge — Analyze. Understand. Defend.",
    template: "%s · CyberForge",
  },
  description:
    "A browser-based cybersecurity, networking, forensics, and OSINT workspace. Every tool explains what its result means, not just what it is.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain scanlines antialiased">
        <div className="relative z-10 flex min-h-dvh flex-col">
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
