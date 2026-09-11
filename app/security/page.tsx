import type { Metadata } from "next";
import { CategoryPage } from "@/components/tool-shell/CategoryPage";
import { CATEGORY_LABELS, CATEGORY_DESCRIPTIONS } from "@/lib/tools/registry";

export const metadata: Metadata = {
  title: CATEGORY_LABELS.security,
  description: CATEGORY_DESCRIPTIONS.security,
};

export default function SecurityPage() {
  return <CategoryPage category="security" />;
}
