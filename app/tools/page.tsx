"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CATEGORY_LABELS, TOOLS, type ToolCategory } from "@/lib/tools/registry";

const CATEGORIES: (ToolCategory | "all")[] = ["all", "network", "security", "forensics", "osint", "developer"];

function ToolsDirectory() {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get("category") as ToolCategory | null) ?? "all";
  const [active, setActive] = useState<ToolCategory | "all">(initialCategory);

  const filtered = useMemo(
    () => (active === "all" ? TOOLS : TOOLS.filter((t) => t.category === active)),
    [active]
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-smoke-dim">directory</p>
      <h1 className="mt-3 font-display text-4xl">All tools</h1>
      <p className="mt-3 max-w-xl text-smoke">
        {TOOLS.length} tools across networking, security, forensics, and OSINT — each one explained,
        not just displayed.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
              active === cat
                ? "border-signal-magenta/50 bg-signal-magenta/10 text-dusty-rose"
                : "border-charcoal-border text-smoke hover:text-bone"
            }`}
          >
            {cat === "all" ? "All" : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tool) => (
          <Link key={tool.slug} href={`/tools/${tool.slug}`}>
            <Card hover className="h-full">
              <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-[11px] uppercase tracking-wide text-smoke-dim">
                  {CATEGORY_LABELS[tool.category]}
                </span>
                <Badge tone={tool.runtime === "server" ? "magenta" : "default"}>
                  {tool.runtime === "server" ? "live lookup" : "local"}
                </Badge>
              </div>
              <h3 className="mt-3 text-base text-bone">{tool.title}</h3>
              <p className="mt-2 text-sm text-smoke">{tool.shortDescription}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function ToolsPage() {
  return (
    <Suspense fallback={null}>
      <ToolsDirectory />
    </Suspense>
  );
}
