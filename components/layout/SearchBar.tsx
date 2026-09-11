"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { searchTools } from "@/lib/search/searchTools";
import { CATEGORY_LABELS } from "@/lib/tools/registry";

export function SearchBar({ size = "default" }: { size?: "default" | "large" }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = searchTools(query, 6);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const inputClasses =
    size === "large"
      ? "w-full rounded-lg border border-charcoal-border bg-charcoal/80 py-4 pl-12 pr-4 text-base text-bone placeholder:text-smoke-dim focus:border-dusty-rose/50 outline-none"
      : "w-64 rounded-md border border-charcoal-border bg-charcoal/60 py-2 pl-9 pr-3 text-sm text-bone placeholder:text-smoke-dim focus:border-dusty-rose/50 outline-none transition-all focus:w-80";

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <svg
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-smoke ${
            size === "large" ? "left-4 h-5 w-5" : "left-3 h-4 w-4"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search a tool, port, or protocol…"
          className={inputClasses}
        />
      </div>

      {open && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-lg border border-charcoal-border bg-charcoal shadow-2xl">
          {results.length === 0 ? (
            <p className="px-4 py-4 text-sm text-smoke">No tools match &ldquo;{query}&rdquo;.</p>
          ) : (
            <ul>
              {results.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between gap-3 border-b border-charcoal-border/60 px-4 py-3 last:border-b-0 hover:bg-charcoal-light"
                  >
                    <span>
                      <span className="block text-sm text-bone">{tool.title}</span>
                      <span className="block text-xs text-smoke">{tool.shortDescription}</span>
                    </span>
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-smoke-dim">
                      {CATEGORY_LABELS[tool.category]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
