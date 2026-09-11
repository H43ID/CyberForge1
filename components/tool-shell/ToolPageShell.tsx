import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { CATEGORY_LABELS, getRelatedTools, type ToolMeta } from "@/lib/tools/registry";
import { RecentToolTracker } from "./RecentToolTracker";
import { FavoriteButton } from "./FavoriteButton";

/**
 * Every tool page is built from this shell so the educational scaffold
 * (Result / What it means / Why it matters / How it works) stays
 * consistent without being reimplemented per tool. Phase 2 fills the
 * `interactive` slot with each tool's real logic + UI.
 */
export function ToolPageShell({
  tool,
  interactive,
  whatItMeans,
  whyItMatters,
  howItWorks,
}: {
  tool: ToolMeta;
  interactive: React.ReactNode;
  whatItMeans?: React.ReactNode;
  whyItMatters?: React.ReactNode;
  howItWorks?: React.ReactNode;
}) {
  const related = getRelatedTools(tool);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <RecentToolTracker slug={tool.slug} />
      <nav className="mb-6 font-mono text-xs text-smoke-dim">
        <Link href="/tools" className="hover:text-bone">
          tools
        </Link>
        <span className="mx-2">/</span>
        <span className="text-smoke">{CATEGORY_LABELS[tool.category]}</span>
      </nav>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl">{tool.title}</h1>
        <Badge tone={tool.runtime === "server" ? "magenta" : "default"}>
          {tool.runtime === "server" ? "live lookup" : "runs locally"}
        </Badge>
        <FavoriteButton slug={tool.slug} />
      </div>
      <p className="mt-3 max-w-xl text-smoke">{tool.shortDescription}</p>

      <div className="mt-8">{interactive}</div>

      {(whatItMeans || whyItMatters || howItWorks) && (
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {whatItMeans && (
            <Card>
              <h2 className="font-mono text-xs uppercase tracking-wide text-smoke-dim">
                What does this mean?
              </h2>
              <div className="mt-2 text-sm leading-relaxed text-smoke">{whatItMeans}</div>
            </Card>
          )}
          {whyItMatters && (
            <Card>
              <h2 className="font-mono text-xs uppercase tracking-wide text-smoke-dim">
                Why does it matter?
              </h2>
              <div className="mt-2 text-sm leading-relaxed text-smoke">{whyItMatters}</div>
            </Card>
          )}
          {howItWorks && (
            <Card>
              <h2 className="font-mono text-xs uppercase tracking-wide text-smoke-dim">
                How does it work?
              </h2>
              <div className="mt-2 text-sm leading-relaxed text-smoke">{howItWorks}</div>
            </Card>
          )}
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="mb-4 font-display text-xl">Related tools</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {related.map((r) => (
              <Link key={r.slug} href={`/tools/${r.slug}`}>
                <Card hover>
                  <h3 className="text-sm text-bone">{r.title}</h3>
                  <p className="mt-1 text-xs text-smoke">{r.shortDescription}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
