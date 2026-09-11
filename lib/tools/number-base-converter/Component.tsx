"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { TextInput } from "@/components/ui/TextInput";
import { ResultRow } from "@/components/ui/ResultRow";
import { convertAll, octetBreakdown, type Base } from "./logic";

const BASES: { key: Base; label: string; placeholder: string }[] = [
  { key: "dec", label: "Decimal", placeholder: "3232235777" },
  { key: "bin", label: "Binary", placeholder: "11000000101010000000000100000001" },
  { key: "hex", label: "Hexadecimal", placeholder: "C0A80001" },
];

export function NumberBaseConverterTool() {
  const [base, setBase] = useState<Base>("dec");
  const [value, setValue] = useState("192");

  const { result, error } = useMemo(() => {
    try {
      return { result: convertAll(value, base), error: null as string | null };
    } catch (e) {
      return { result: null, error: e instanceof Error ? e.message : "Invalid value." };
    }
  }, [value, base]);

  const octets = result ? octetBreakdown(result.decimal) : null;

  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-4 flex gap-2">
          {BASES.map((b) => (
            <button
              key={b.key}
              onClick={() => setBase(b.key)}
              className={`rounded-full border px-3 py-1 text-xs font-mono transition-colors ${
                base === b.key
                  ? "border-signal-magenta/50 bg-signal-magenta/10 text-dusty-rose"
                  : "border-charcoal-border text-smoke hover:text-bone"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
        <TextInput
          label={`Value (${BASES.find((b) => b.key === base)?.label})`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={BASES.find((b) => b.key === base)?.placeholder}
          spellCheck={false}
        />
        {error && <p className="mt-3 text-sm text-signal-magenta">{error}</p>}
      </Card>

      {result && (
        <Card>
          <ResultRow label="Decimal" value={result.decimal} />
          <ResultRow label="Binary" value={result.binary} />
          <ResultRow label="Hexadecimal" value={`0x${result.hex}`} />
          {octets && <ResultRow label="As IPv4 octets (binary)" value={octets} />}
        </Card>
      )}
    </div>
  );
}
