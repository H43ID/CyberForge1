import type { ToolCategory } from "@/lib/tools/registry";

const strokeProps = {
  fill: "none",
  stroke: "var(--dusty-rose)",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export type CategoryIconKey = ToolCategory | "resources";

export function CategoryIcon({ category }: { category: CategoryIconKey }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24" };

  switch (category) {
    case "network":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="12" cy="12" r="9" {...strokeProps} />
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" {...strokeProps} />
        </svg>
      );
    case "security":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" {...strokeProps} />
          <path d="M9 12l2 2 4-4" {...strokeProps} />
        </svg>
      );
    case "forensics":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="6.5" {...strokeProps} />
          <path d="M15.2 15.2L21 21" {...strokeProps} />
        </svg>
      );
    case "osint":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="12" cy="12" r="9" {...strokeProps} />
          <circle cx="12" cy="12" r="4.5" {...strokeProps} />
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3" {...strokeProps} />
        </svg>
      );
    case "developer":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M8 8L3 12l5 4M16 8l5 4-5 4M13.5 5L10.5 19" {...strokeProps} />
        </svg>
      );
    case "resources":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M6 3h9l3 3v15H6z" {...strokeProps} />
          <path d="M15 3v3h3" {...strokeProps} />
          <path d="M9 12h6M9 15.5h6" {...strokeProps} />
        </svg>
      );
    default:
      return null;
  }
}
