import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { EyeArt } from "@/components/backgrounds/EyeArt";

export const metadata: Metadata = {
  title: "Resources",
  description: "Downloadable cybersecurity and networking reference material.",
};

const AVAILABLE = [
  {
    title: "Subnetting Cheat Sheet",
    file: "/resources/subnetting-cheat-sheet.pdf",
    category: "Networking",
  },
  {
    title: "Common Ports Reference",
    file: "/resources/common-ports-reference.pdf",
    category: "Networking",
  },
  {
    title: "HTTP Status Codes Reference",
    file: "/resources/http-status-codes-reference.pdf",
    category: "Web Security",
  },
  {
    title: "Incident Response Checklist",
    file: "/resources/incident-response-checklist.pdf",
    category: "SOC",
  },
];

const COMING_SOON = [
  "OSI Model Cheat Sheet", "TCP/IP Cheat Sheet", "IPv6 Cheat Sheet", "DNS Records Reference",
  "Cybersecurity Fundamentals Guide", "SOC Analyst Cheat Sheet", "Security Terminology",
  "Digital Forensics Basics", "File Signature Reference", "EXIF Metadata Guide",
  "OWASP Concepts Guide", "Cookie Security Reference", "Linux Security Commands Cheat Sheet",
  "Log Analysis Cheat Sheet", "IOC Reference",
];

export default function ResourcesPage() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -right-24 top-0 hidden h-[420px] w-[420px] lg:block">
        <EyeArt slot="fragment" opacity={0.4} />
      </div>
      <div className="relative mx-auto max-w-4xl px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-smoke-dim">library</p>
        <h1 className="mt-3 font-display text-4xl">Resources</h1>
        <p className="mt-3 max-w-xl text-smoke">
          Original cheat sheets, checklists, and reference guides — free to download and keep.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {AVAILABLE.map((r) => (
            <a key={r.file} href={r.file} download>
              <Card hover className="h-full">
                <p className="font-mono text-[11px] uppercase tracking-wide text-smoke-dim">
                  {r.category}
                </p>
                <p className="mt-2 text-base text-bone">{r.title}</p>
                <p className="mt-3 text-sm text-dusty-rose">Download PDF →</p>
              </Card>
            </a>
          ))}
        </div>

        <h2 className="mt-14 font-display text-xl">More on the way</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {COMING_SOON.map((c) => (
            <Card key={c}>
              <p className="text-sm text-bone">{c}</p>
              <p className="mt-1 font-mono text-xs text-smoke-dim">coming soon</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
