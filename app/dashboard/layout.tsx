import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your recent tools, favorites, and saved Forge Reports.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
