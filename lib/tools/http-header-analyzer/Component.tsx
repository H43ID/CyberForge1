"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { TextInput } from "@/components/ui/TextInput";
import { Badge } from "@/components/ui/Badge";
import { evaluateSecurityHeaders, fetchHeaders, type ProxyResult } from "./logic";

export function HttpHeaderAnalyzerTool() {
  const [url, setUrl] = useState("https://example.com");
  const [result, setResult] = useState<ProxyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function run(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    try {
      setResult(await fetchHeaders(url));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't fetch that URL.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  const securityChecks = result ? evaluateSecurityHeaders(result.headers) : [];

  return (
    <div className="space-y-4">
      <Card>
        <form onSubmit={run} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <TextInput
              label="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              spellCheck={false}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="h-[42px] rounded-md bg-signal-magenta px-5 text-sm font-medium text-ink hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Fetching…" : "Analyze"}
          </button>
        </form>
        <p className="mt-3 text-xs text-smoke-dim">
          This request is made from CyberForge&rsquo;s server, not your browser, so the target
          site only ever sees our server making the request — not you.
        </p>
        {error && <p className="mt-3 text-sm text-signal-magenta">{error}</p>}
      </Card>

      {result && (
        <>
          <Card>
            <div className="mb-3 flex items-center gap-2">
              <p className="font-mono text-xs uppercase tracking-wide text-smoke-dim">Response</p>
              <Badge tone={result.status < 400 ? "live" : "magenta"}>
                {result.status} {result.statusText}
              </Badge>
            </div>
            {result.finalUrl !== result.requestedUrl && (
              <p className="text-xs text-smoke-dim">Redirected to {result.finalUrl}</p>
            )}
          </Card>

          <Card>
            <p className="mb-3 font-mono text-xs uppercase tracking-wide text-smoke-dim">
              Security headers
            </p>
            <div className="space-y-3">
              {securityChecks.map((check) => (
                <div key={check.header} className="border-b border-charcoal-border/60 pb-3 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-sm text-bone">{check.header}</span>
                    <Badge tone={check.present ? "live" : "soon"}>
                      {check.present ? "present" : "missing"}
                    </Badge>
                  </div>
                  {check.value && (
                    <p className="mt-1 break-all font-mono text-xs text-smoke">{check.value}</p>
                  )}
                  <p className="mt-1 text-xs text-smoke-dim">{check.explanation}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <p className="mb-3 font-mono text-xs uppercase tracking-wide text-smoke-dim">
              All response headers
            </p>
            <div className="max-h-72 overflow-y-auto">
              {Object.entries(result.headers).map(([k, v]) => (
                <div key={k} className="flex gap-3 border-b border-charcoal-border/50 py-1.5 text-xs last:border-b-0">
                  <span className="w-40 shrink-0 font-mono text-smoke-dim">{k}</span>
                  <span className="break-all font-mono text-bone">{v}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <p className="mb-2 font-mono text-xs uppercase tracking-wide text-smoke-dim">
              security.txt
            </p>
            {result.securityTxt ? (
              <pre className="max-h-56 overflow-y-auto whitespace-pre-wrap font-mono text-xs text-bone">
                {result.securityTxt}
              </pre>
            ) : (
              <p className="text-sm text-smoke">
                No security.txt found at /.well-known/security.txt. This file lets researchers
                know how to responsibly report vulnerabilities — its absence isn&rsquo;t a
                vulnerability itself, just a missed best practice.
              </p>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
