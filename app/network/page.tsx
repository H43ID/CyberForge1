import type { Metadata } from "next";
import { CategoryPage } from "@/components/tool-shell/CategoryPage";
import { CATEGORY_LABELS, CATEGORY_DESCRIPTIONS } from "@/lib/tools/registry";

export const metadata: Metadata = {
  title: CATEGORY_LABELS.network,
  description: CATEGORY_DESCRIPTIONS.network,
};

export default function NetworkPage() {
  return <CategoryPage category="network" />;
}
