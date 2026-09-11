import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forge Report",
  description: "Combine DNS, HTTP header, and security.txt checks into one exportable report.",
};

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
