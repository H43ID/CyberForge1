import { TOOLS, type ToolMeta } from "@/lib/tools/registry";

function score(tool: ToolMeta, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;

  let s = 0;
  const title = tool.title.toLowerCase();
  const desc = tool.shortDescription.toLowerCase();

  if (title === q) s += 100;
  else if (title.startsWith(q)) s += 60;
  else if (title.includes(q)) s += 35;

  if (tool.tags.some((tag) => tag === q)) s += 50;
  else if (tool.tags.some((tag) => tag.includes(q))) s += 25;

  if (desc.includes(q)) s += 10;

  if (tool.category.includes(q)) s += 15;

  return s;
}

export function searchTools(query: string, limit = 8): ToolMeta[] {
  if (!query.trim()) return [];
  return TOOLS.map((tool) => ({ tool, s: score(tool, query) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((r) => r.tool);
}
