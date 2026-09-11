import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolBySlug, TOOLS } from "@/lib/tools/registry";
import { TOOL_CONTENT } from "@/lib/tools/toolPageContent";
import { ToolPageShell } from "@/components/tool-shell/ToolPageShell";

export function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  return {
    title: tool.title,
    description: tool.shortDescription,
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const content = TOOL_CONTENT[slug];

  return (
    <ToolPageShell
      tool={tool}
      interactive={content.interactive}
      whatItMeans={content.whatItMeans}
      whyItMatters={content.whyItMatters}
      howItWorks={content.howItWorks}
    />
  );
}
