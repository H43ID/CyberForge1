export function TextInput({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-smoke-dim">
        {label}
      </span>
      <input
        {...props}
        className="w-full rounded-md border border-charcoal-border bg-charcoal px-3.5 py-2.5 text-sm text-bone placeholder:text-smoke-dim outline-none focus:border-dusty-rose/50"
      />
    </label>
  );
}
