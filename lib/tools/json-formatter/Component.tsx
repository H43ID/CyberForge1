"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { TextArea } from "@/components/ui/TextArea";
import { processJson } from "./logic";

const SAMPLE = `{"tool":"CyberForge","category":"developer","live":true}`;

export function JsonFormatterTool() {
  const [input, setInput] = useState(SAMPLE);
  const [view, setView] = useState<"formatted" | "minified">("formatted");

  const result = useMemo(() => processJson(input), [input]);

  return (
    <div className="space-y-4">
      <Card>
        <TextArea
          label="JSON input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          spellCheck={false}
        />
      </Card>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <p className="font-mono text-xs uppercase tracking-wide text-smoke-dim">
            {result.valid ? "Valid JSON" : "Invalid JSON"}
          </p>
          {result.valid && (
            <div className="flex overflow-hidden rounded-md border border-charcoal-border text-xs">
              <button
                onClick={() => setView("formatted")}
                className={`px-3 py-1.5 ${view === "formatted" ? "bg-charcoal-light text-bone" : "text-smoke"}`}
              >
                Formatted
              </button>
              <button
                onClick={() => setView("minified")}
                className={`px-3 py-1.5 ${view === "minified" ? "bg-charcoal-light text-bone" : "text-smoke"}`}
              >
                Minified
              </button>
            </div>
          )}
        </div>
        {result.valid ? (
          <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-all font-mono text-sm text-bone">
            {view === "formatted" ? result.formatted : result.minified}
          </pre>
        ) : (
          <p className="text-sm text-signal-magenta">{result.error}</p>
        )}
      </Card>
    </div>
  );
}
