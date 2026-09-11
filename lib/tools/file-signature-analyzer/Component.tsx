"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { FileDrop } from "@/components/ui/FileDrop";
import { ResultRow } from "@/components/ui/ResultRow";
import { Badge } from "@/components/ui/Badge";
import { analyzeFileSignature, type SignatureResult } from "./logic";

export function FileSignatureAnalyzerTool() {
  const [result, setResult] = useState<SignatureResult | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File) {
    setBusy(true);
    const r = await analyzeFileSignature(file);
    setResult(r);
    setBusy(false);
  }

  return (
    <div className="space-y-4">
      <Card>
        <FileDrop label="Any file" onFile={handleFile} />
        {busy && <p className="mt-3 text-sm text-smoke">Reading file signature…</p>}
      </Card>

      {result && (
        <>
          <Card>
            <div className="mb-2 flex items-center justify-between">
              <p className="font-mono text-xs uppercase tracking-wide text-smoke-dim">Detected type</p>
              {result.mismatch && <Badge tone="magenta">extension mismatch</Badge>}
            </div>
            <p className="text-base text-bone">
              {result.detected ? result.detected.type : "Unrecognized signature"}
            </p>
            {result.detected && (
              <p className="mt-1 text-xs text-smoke-dim">
                Expected extension: .{result.detected.extensions[0]}
              </p>
            )}
          </Card>

          <Card>
            <ResultRow label="Declared extension" value={result.declaredExtension || "(none)"} />
            <ResultRow label="First 16 bytes" value={result.firstBytesHex} />
          </Card>

          {result.mismatch && (
            <div className="rounded-md border border-signal-magenta/30 bg-signal-magenta/5 px-4 py-3">
              <p className="text-sm text-dusty-rose">
                The file&rsquo;s actual signature doesn&rsquo;t match its extension. This can be
                innocent — a renamed file — or a sign that a file type is being disguised. Treat
                mismatched files with more caution before opening them.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
