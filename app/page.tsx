import Link from "next/link";
import { SearchBar } from "@/components/layout/SearchBar";
import { EyeArt } from "@/components/backgrounds/EyeArt";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CategoryIcon, type CategoryIconKey } from "@/components/ui/CategoryIcon";
import { ButtonLink } from "@/components/ui/Button";
import { CATEGORY_DESCRIPTIONS, CATEGORY_LABELS, TOOLS, type ToolCategory } from "@/lib/tools/registry";

const CATEGORY_ROUTES: Record<CategoryIconKey, string> = {
  network: "/network",
  security: "/security",
  forensics: "/forensics",
  osint: "/osint",
  developer: "/tools?category=developer",
  resources: "/resources",
};

const CATEGORY_CARD_ORDER: CategoryIconKey[] = [
  "network",
  "security",
  "forensics",
  "osint",
  "developer",
  "resources",
];

const FEATURED_TOOL_SLUGS = [
  "dns-lookup",
  "subnet-calculator",
  "hash-generator",
  "jwt-decoder",
  "exif-viewer",
];

const WHY_ITEMS = [
  {
    title: "Runs where your data lives",
    body: "Most tools process everything in your browser. Files and passwords are never uploaded unless a lookup genuinely requires it — and we say so on the tool itself.",
  },
  {
    title: "Every result is explained",
    body: "A raw output is only half an answer. Each tool walks through what a result means, why it matters, and how the mechanism underneath actually works.",
  },
  {
    title: "One workspace, not fifty tabs",
    body: "Analyze a domain and CyberForge quietly points to the next relevant check — DNS, then headers, then certificate — instead of leaving you to remember what to run next.",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero — left: content, right: atmospheric eye, cropped by viewport, never under the text */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 pt-20 pb-16 sm:pt-28 sm:pb-24 lg:grid-cols-[55%_45%]">
          <div className="max-w-xl">
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-smoke-dim">
              analyze · understand · defend
            </p>
            <h1 className="font-display text-5xl leading-[1.05] sm:text-6xl">
              Cyber<span className="text-gradient-signal">Forge</span>
            </h1>
            <p className="mt-5 text-lg text-smoke">
              A cybersecurity, networking, and digital-forensics workspace that lives in your
              browser — and explains every result it gives you.
            </p>

            <div className="mt-9 max-w-md">
              <SearchBar size="large" />
            </div>
            <p className="mt-3 font-mono text-xs text-smoke-dim">
              try &ldquo;subnet&rdquo;, &ldquo;jwt&rdquo;, or &ldquo;exif&rdquo;
            </p>
          </div>

          <div className="relative hidden h-[520px] lg:block">
            <EyeArt slot="hero" className="absolute inset-0" opacity={0.85} />
          </div>
        </div>
      </section>

      {/* Six category cards — simple: icon, title, description, Explore link */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="font-display text-2xl">Toolkit</h2>
        <p className="mt-2 max-w-md text-sm text-smoke">
          {TOOLS.length} tools across five areas, plus a growing resource library.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORY_CARD_ORDER.map((cat) => (
            <Link key={cat} href={CATEGORY_ROUTES[cat]}>
              <Card hover className="h-full">
                <CategoryIcon category={cat} />
                <h3 className="mt-4 font-display text-lg">
                  {cat === "resources" ? "Resources" : CATEGORY_LABELS[cat as ToolCategory]}
                </h3>
                <p className="mt-2 text-sm text-smoke">
                  {cat === "resources"
                    ? "Cheat sheets and checklists you can download and keep."
                    : CATEGORY_DESCRIPTIONS[cat as ToolCategory]}
                </p>
                <p className="mt-4 text-sm text-dusty-rose">Explore →</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Quiet atmospheric break — a faint fragment, easy to miss */}
      <section className="relative h-56 overflow-hidden">
        <EyeArt slot="section" className="absolute inset-0" opacity={0.4} breathing />
      </section>

      {/* Why CyberForge */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="font-display text-2xl">Why CyberForge</h2>
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {WHY_ITEMS.map((item) => (
            <div key={item.title} className="border-t border-charcoal-border pt-5">
              <h3 className="text-base text-bone">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-smoke">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured tools */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl">Featured tools</h2>
          <Link href="/tools" className="text-sm text-dusty-rose hover:text-signal-magenta">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_TOOL_SLUGS.map((slug) => {
            const tool = TOOLS.find((t) => t.slug === slug);
            if (!tool) return null;
            return (
              <Link key={slug} href={`/tools/${slug}`}>
                <Card hover className="h-full">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base text-bone">{tool.title}</h3>
                    <Badge tone={tool.runtime === "server" ? "magenta" : "default"}>
                      {tool.runtime === "server" ? "live lookup" : "local"}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-smoke">{tool.shortDescription}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured resources */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl">Featured resources</h2>
          <Link href="/resources" className="text-sm text-dusty-rose hover:text-signal-magenta">
            View library →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { title: "Subnetting Cheat Sheet", file: "/resources/subnetting-cheat-sheet.pdf" },
            { title: "Incident Response Checklist", file: "/resources/incident-response-checklist.pdf" },
            { title: "HTTP Status Codes Reference", file: "/resources/http-status-codes-reference.pdf" },
          ].map((r) => (
            <a key={r.file} href={r.file} download>
              <Card hover className="h-full">
                <p className="text-sm text-bone">{r.title}</p>
                <p className="mt-1 text-xs text-dusty-rose">Download PDF →</p>
              </Card>
            </a>
          ))}
        </div>
        <div className="mt-10">
          <ButtonLink href="/tools">Browse the full toolkit</ButtonLink>
        </div>
      </section>
    </div>
  );
}
