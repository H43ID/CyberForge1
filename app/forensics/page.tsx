import type { Metadata } from "next";
import { CategoryPage } from "@/components/tool-shell/CategoryPage";
import { CATEGORY_LABELS, CATEGORY_DESCRIPTIONS } from "@/lib/tools/registry";

export const metadata: Metadata = {
  title: CATEGORY_LABELS.forensics,
  description: CATEGORY_DESCRIPTIONS.forensics,
};

export default function ForensicsPage() {
  return <CategoryPage category="forensics" />;
}
