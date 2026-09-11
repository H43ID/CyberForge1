"use client";

import { useEffect, useState } from "react";
import { getFavoriteTools, toggleFavoriteTool } from "@/lib/storage/local";

export function FavoriteButton({ slug }: { slug: string }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(getFavoriteTools().includes(slug));
  }, [slug]);

  return (
    <button
      onClick={() => setIsFavorite(toggleFavoriteTool(slug).includes(slug))}
      aria-pressed={isFavorite}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md border transition-colors ${
        isFavorite
          ? "border-signal-magenta/50 text-signal-magenta"
          : "border-charcoal-border text-smoke hover:text-bone"
      }`}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6">
        <path
          d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6L12 3z"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
