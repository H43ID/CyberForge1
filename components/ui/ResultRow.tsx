"use client";

import { useState } from "react";

export function ResultRow({
  label,
  value,
  mono = true,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — silently ignore, the value is still selectable
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 border-b border-charcoal-border/60 py-2.5 last:border-b-0">
      <span className="shrink-0 font-mono text-xs uppercase tracking-wide text-smoke-dim">
        {label}
      </span>
      <button
        onClick={copy}
        className={`truncate text-right text-sm text-bone hover:text-dusty-rose ${mono ? "font-mono" : ""}`}
        title="Click to copy"
      >
        {copied ? "copied" : value}
      </button>
    </div>
  );
}
