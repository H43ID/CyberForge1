import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  CATEGORY_DESCRIPTIONS,
  CATEGORY_LABELS,
  getToolsByCategory,
  type ToolCategory,
} from "@/lib/tools/registry";

export function CategoryPage({ category }: { category: ToolCategory }) {
  const tools = getToolsByCategory(category);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-smoke-dim">category</p>
      <h1 className="mt-3 font-display text-4xl">{CATEGORY_LABELS[category]}</h1>
      <p className="mt-3 max-w-xl text-smoke">{CATEGORY_DESCRIPTIONS[category]}</p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.slug} href={`/tools/${tool.slug}`}>
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
        ))}
      </div>
    </div>
  );
}
