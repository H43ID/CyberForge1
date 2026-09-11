"use client";

import { useEffect } from "react";
import { trackRecentTool } from "@/lib/storage/local";

export function RecentToolTracker({ slug }: { slug: string }) {
  useEffect(() => {
    trackRecentTool(slug);
  }, [slug]);
  return null;
}
