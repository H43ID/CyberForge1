"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { TextInput } from "@/components/ui/TextInput";
import { ResultRow } from "@/components/ui/ResultRow";
import { calculateSubnet } from "./logic";

export function SubnetCalculatorTool() {
  const [input, setInput] = useState("192.168.1.0/24");

  const { result, error } = useMemo(() => {
    try {
      return { result: calculateSubnet(input), error: null };
    } catch (e) {
      return { result: null, error: e instanceof Error ? e.message : "Invalid input." };
    }
  }, [input]);

  return (
    <div className="space-y-4">
      <Card>
        <TextInput
          label="CIDR address"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="192.168.1.0/24"
          spellCheck={false}
        />
        {error && <p className="mt-3 text-sm text-signal-magenta">{error}</p>}
      </Card>

      {result && (
        <Card>
          <ResultRow label="Network address" value={result.networkAddress} />
          <ResultRow label="Broadcast address" value={result.broadcastAddress} />
          <ResultRow label="First usable" value={result.firstUsable} />
          <ResultRow label="Last usable" value={result.lastUsable} />
          <ResultRow label="Usable hosts" value={result.usableHostCount.toLocaleString()} />
          <ResultRow label="Total addresses" value={result.totalAddresses.toLocaleString()} />
          <ResultRow label="Subnet mask" value={result.subnetMask} />
          <ResultRow label="Wildcard mask" value={result.wildcardMask} />
          <ResultRow label="IP in binary" value={result.binaryIp} />
          <ResultRow label="Mask in binary" value={result.binaryMask} />
        </Card>
      )}
    </div>
  );
}
