import Link from "next/link";
import { SearchBar } from "./SearchBar";

const NAV_LINKS = [
  { href: "/tools", label: "Tools" },
  { href: "/network", label: "Network" },
  { href: "/security", label: "Security" },
  { href: "/forensics", label: "Forensics" },
  { href: "/osint", label: "OSINT" },
  { href: "/reports", label: "Reports" },
  { href: "/resources", label: "Resources" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-charcoal-border/70 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 2L4 5v6c0 5 3.4 8.7 8 11 4.6-2.3 8-6 8-11V5l-8-3z"
              stroke="var(--signal-magenta)"
              strokeWidth="1.4"
              fill="none"
            />
            <path d="M9 12l2 2 4-4" stroke="var(--dusty-rose)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-display text-lg tracking-tight">
            Cyber<span className="text-gradient-signal">Forge</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-smoke transition-colors hover:text-bone"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            title="Dashboard"
            className="hidden h-9 w-9 items-center justify-center rounded-md border border-charcoal-border text-smoke transition-colors hover:border-dusty-rose/50 hover:text-bone sm:flex"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="3" width="7" height="9" rx="1" />
              <rect x="14" y="3" width="7" height="5" rx="1" />
              <rect x="14" y="12" width="7" height="9" rx="1" />
              <rect x="3" y="16" width="7" height="5" rx="1" />
            </svg>
          </Link>
          <div className="hidden md:block">
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  );
}
