import Link from "next/link";
import type { ReactNode } from "react";

type BaseProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

const variantClasses: Record<string, string> = {
  primary:
    "bg-signal-magenta text-ink font-medium hover:opacity-90 transition-opacity",
  secondary:
    "border border-charcoal-border text-bone hover:border-dusty-rose/50 transition-colors",
  ghost: "text-smoke hover:text-bone transition-colors",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  variant = "primary",
  className = "",
}: BaseProps & { href: string }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm ${variantClasses[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
