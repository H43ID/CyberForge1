import type { Metadata } from "next";
import { CategoryPage } from "@/components/tool-shell/CategoryPage";
import { CATEGORY_LABELS, CATEGORY_DESCRIPTIONS } from "@/lib/tools/registry";

export const metadata: Metadata = {
  title: CATEGORY_LABELS.osint,
  description: CATEGORY_DESCRIPTIONS.osint,
};

export default function OsintPage() {
  return <CategoryPage category="osint" />;
}
