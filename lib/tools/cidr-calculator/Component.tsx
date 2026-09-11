"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { TextInput } from "@/components/ui/TextInput";
import { ResultRow } from "@/components/ui/ResultRow";
import { cidrTable, maskToPrefix, prefixToMask } from "./logic";

export function CidrCalculatorTool() {
  const [prefixInput, setPrefixInput] = useState("24");
  const [maskInput, setMaskInput] = useState("255.255.255.0");

  const fromPrefix = useMemo(() => {
    try {
      const p = Number(prefixInput);
      if (!Number.isInteger(p)) throw new Error("Enter a whole number.");
      return { mask: prefixToMask(p), error: null as string | null };
    } catch (e) {
      return { mask: null, error: e instanceof Error ? e.message : "Invalid prefix." };
    }
  }, [prefixInput]);

  const fromMask = useMemo(() => {
    try {
      return { prefix: maskToPrefix(maskInput), error: null as string | null };
    } catch (e) {
      return { prefix: null, error: e instanceof Error ? e.message : "Invalid mask." };
    }
  }, [maskInput]);

  const table = useMemo(() => cidrTable(), []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <TextInput
            label="Prefix length (/n)"
            value={prefixInput}
            onChange={(e) => setPrefixInput(e.target.value)}
            placeholder="24"
          />
          {fromPrefix.error ? (
            <p className="mt-3 text-sm text-signal-magenta">{fromPrefix.error}</p>
          ) : (
            <div className="mt-3">
              <ResultRow label="Subnet mask" value={fromPrefix.mask!} />
            </div>
          )}
        </Card>
        <Card>
          <TextInput
            label="Subnet mask"
            value={maskInput}
            onChange={(e) => setMaskInput(e.target.value)}
            placeholder="255.255.255.0"
          />
          {fromMask.error ? (
            <p className="mt-3 text-sm text-signal-magenta">{fromMask.error}</p>
          ) : (
            <div className="mt-3">
              <ResultRow label="Prefix length" value={`/${fromMask.prefix}`} />
            </div>
          )}
        </Card>
      </div>

      <Card>
        <p className="mb-3 font-mono text-xs uppercase tracking-wide text-smoke-dim">
          Reference table
        </p>
        <div className="max-h-80 overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-charcoal-border text-xs uppercase tracking-wide text-smoke-dim">
                <th className="py-2 pr-4 font-normal">Prefix</th>
                <th className="py-2 pr-4 font-normal">Mask</th>
                <th className="py-2 pr-4 font-normal">Addresses</th>
                <th className="py-2 font-normal">Usable hosts</th>
              </tr>
            </thead>
            <tbody className="font-mono text-bone">
              {table.map((row) => (
                <tr key={row.prefix} className="border-b border-charcoal-border/50 last:border-b-0">
                  <td className="py-2 pr-4">/{row.prefix}</td>
                  <td className="py-2 pr-4">{row.mask}</td>
                  <td className="py-2 pr-4">{row.totalAddresses.toLocaleString()}</td>
                  <td className="py-2">{row.usableHosts.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
