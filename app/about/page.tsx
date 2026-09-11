import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "What CyberForge is, and what it deliberately chooses not to be.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-smoke-dim">about</p>
      <h1 className="mt-3 font-display text-4xl">A workspace, not a toolbox</h1>
      <div className="mt-6 space-y-5 text-smoke leading-relaxed">
        <p>
          Most security and networking tools give you a result and leave you to figure out what
          it means. CyberForge pairs every result with an explanation — what it means, why it
          matters, and how it actually works — so students and working analysts get the same
          tool.
        </p>
        <p>
          CyberForge is a defensive and educational platform. It is built for cybersecurity
          students, SOC analysts, network administrators, and developers who need quick,
          trustworthy utilities without installing a dozen separate programs. It intentionally
          does not build tools for unauthorized exploitation, credential attacks, phishing,
          malware, or mass scanning.
        </p>
        <p>
          Where possible, work happens entirely in your browser. Files you analyze and passwords
          you check are never uploaded. Where a tool genuinely needs to reach the network — a DNS
          record, a live header check — that is stated plainly on the tool itself.
        </p>
      </div>
    </div>
  );
}
