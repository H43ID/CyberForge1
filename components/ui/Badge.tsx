export function Badge({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "magenta" | "live" | "soon";
}) {
  const toneClasses: Record<string, string> = {
    default: "border-charcoal-border text-smoke",
    magenta: "border-signal-magenta/40 text-dusty-rose bg-signal-magenta/10",
    live: "border-dusty-rose/30 text-dusty-rose",
    soon: "border-smoke-dim/40 text-smoke-dim",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-mono tracking-wide ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
