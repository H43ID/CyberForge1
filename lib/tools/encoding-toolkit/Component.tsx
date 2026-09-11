"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { TextArea } from "@/components/ui/TextArea";
import { encode, decode, type Encoding } from "./logic";

const ENCODINGS: { key: Encoding; label: string }[] = [
  { key: "base64", label: "Base64" },
  { key: "url", label: "URL" },
  { key: "html", label: "HTML entities" },
  { key: "hex", label: "Hex" },
];

export function EncodingToolkitTool() {
  const [encoding, setEncoding] = useState<Encoding>("base64");
  const [input, setInput] = useState("CyberForge");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const { output, error } = useMemo(() => {
    try {
      const fn = mode === "encode" ? encode : decode;
      return { output: fn(input, encoding), error: null as string | null };
    } catch (e) {
      return { output: "", error: e instanceof Error ? e.message : "Couldn't process that input." };
    }
  }, [input, encoding, mode]);

  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {ENCODINGS.map((e) => (
              <button
                key={e.key}
                onClick={() => setEncoding(e.key)}
                className={`rounded-full border px-3 py-1 text-xs font-mono transition-colors ${
                  encoding === e.key
                    ? "border-signal-magenta/50 bg-signal-magenta/10 text-dusty-rose"
                    : "border-charcoal-border text-smoke hover:text-bone"
                }`}
              >
                {e.label}
              </button>
            ))}
          </div>
          <div className="flex overflow-hidden rounded-md border border-charcoal-border text-xs">
            <button
              onClick={() => setMode("encode")}
              className={`px-3 py-1.5 ${mode === "encode" ? "bg-charcoal-light text-bone" : "text-smoke"}`}
            >
              Encode
            </button>
            <button
              onClick={() => setMode("decode")}
              className={`px-3 py-1.5 ${mode === "decode" ? "bg-charcoal-light text-bone" : "text-smoke"}`}
            >
              Decode
            </button>
          </div>
        </div>
        <TextArea
          label={mode === "encode" ? "Plain text" : "Encoded text"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          spellCheck={false}
        />
      </Card>

      <Card>
        <p className="mb-2 font-mono text-xs uppercase tracking-wide text-smoke-dim">Result</p>
        {error ? (
          <p className="text-sm text-signal-magenta">{error}</p>
        ) : (
          <pre className="whitespace-pre-wrap break-all font-mono text-sm text-bone">{output}</pre>
        )}
      </Card>
    </div>
  );
}
