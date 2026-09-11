import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-charcoal-border/70 bg-ink/60">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <p className="font-display text-base">
              Cyber<span className="text-gradient-signal">Forge</span>
            </p>
            <p className="mt-2 max-w-xs text-sm text-smoke">
              Analyze. Understand. Defend. A unified cybersecurity workspace, built for
              students, analysts, and administrators.
            </p>
          </div>
          <FooterColumn
            title="Toolkit"
            links={[
              { href: "/network", label: "Network" },
              { href: "/security", label: "Security" },
              { href: "/forensics", label: "Forensics" },
              { href: "/osint", label: "OSINT" },
            ]}
          />
          <FooterColumn
            title="Platform"
            links={[
              { href: "/tools", label: "All tools" },
              { href: "/reports", label: "Forge Report" },
              { href: "/dashboard", label: "Dashboard" },
              { href: "/resources", label: "Resources" },
              { href: "/about", label: "About" },
            ]}
          />
          <FooterColumn
            title="Legal"
            links={[
              { href: "/privacy", label: "Privacy" },
              { href: "/terms", label: "Terms" },
            ]}
          />
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-charcoal-border/60 pt-6 text-xs text-smoke-dim sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CyberForge. Built for defenders, not attackers.</p>
          <p className="font-mono">the signal is being watched</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="mb-3 font-mono text-xs uppercase tracking-wide text-smoke-dim">{title}</p>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-smoke transition-colors hover:text-bone">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
