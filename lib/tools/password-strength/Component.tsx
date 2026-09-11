"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { analyzePassword, type StrengthLabel } from "./logic";

const LABEL_COLOR: Record<StrengthLabel, string> = {
  "Very weak": "bg-red-500/70",
  Weak: "bg-orange-500/70",
  Fair: "bg-yellow-500/70",
  Strong: "bg-dusty-rose",
  "Very strong": "bg-signal-magenta",
};

export function PasswordStrengthTool() {
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const analysis = useMemo(() => analyzePassword(password), [password]);

  return (
    <div className="space-y-4">
      <Card>
        <label className="block">
          <span className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-smoke-dim">
            Password
          </span>
          <div className="flex gap-2">
            <input
              type={visible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type a password to analyze"
              autoComplete="off"
              className="w-full rounded-md border border-charcoal-border bg-charcoal px-3.5 py-2.5 font-mono text-sm text-bone placeholder:text-smoke-dim outline-none focus:border-dusty-rose/50"
            />
            <button
              onClick={() => setVisible((v) => !v)}
              className="shrink-0 rounded-md border border-charcoal-border px-3 text-xs text-smoke hover:text-bone"
            >
              {visible ? "Hide" : "Show"}
            </button>
          </div>
        </label>
        <p className="mt-2 text-xs text-smoke-dim">
          Analyzed entirely in your browser. Nothing you type here is sent anywhere.
        </p>
      </Card>

      <Card>
        <div className="mb-2 flex items-center justify-between">
          <p className="font-mono text-xs uppercase tracking-wide text-smoke-dim">Strength</p>
          <p className="text-sm text-bone">{analysis.label}</p>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-charcoal-light">
          <div
            className={`h-full transition-all ${LABEL_COLOR[analysis.label]}`}
            style={{ width: `${Math.max(4, analysis.score)}%` }}
          />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-smoke sm:grid-cols-3">
          <p>Length: <span className="text-bone">{analysis.length}</span></p>
          <p>Estimated entropy: <span className="text-bone">{Math.round(analysis.entropyBits)} bits</span></p>
          <p>Character pool: <span className="text-bone">{analysis.poolSize}</span></p>
        </div>
      </Card>

      {analysis.issues.length > 0 && (
        <Card>
          <p className="mb-2 font-mono text-xs uppercase tracking-wide text-smoke-dim">Issues found</p>
          <ul className="space-y-1.5 text-sm text-smoke">
            {analysis.issues.map((issue) => (
              <li key={issue}>· {issue}</li>
            ))}
          </ul>
        </Card>
      )}

      <Card>
        <p className="mb-2 font-mono text-xs uppercase tracking-wide text-smoke-dim">Recommendations</p>
        <ul className="space-y-1.5 text-sm text-smoke">
          {analysis.recommendations.map((rec) => (
            <li key={rec}>· {rec}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
