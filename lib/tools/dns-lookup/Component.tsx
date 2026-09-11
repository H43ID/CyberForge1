"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { TextInput } from "@/components/ui/TextInput";
import { Badge } from "@/components/ui/Badge";
import { dnsLookup, RECORD_TYPES, type DnsResult, type RecordType } from "./logic";

export function DnsLookupTool() {
  const [domain, setDomain] = useState("cloudflare.com");
  const [type, setType] = useState<RecordType>("A");
  const [result, setResult] = useState<DnsResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function runLookup(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const r = await dnsLookup(domain, type);
      setResult(r);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <form onSubmit={runLookup} className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto]">
            <TextInput
              label="Domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
              spellCheck={false}
            />
            <label className="block">
              <span className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-smoke-dim">
                Record type
              </span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as RecordType)}
                className="h-[42px] rounded-md border border-charcoal-border bg-charcoal px-3 text-sm text-bone outline-none focus:border-dusty-rose/50"
              >
                {RECORD_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              disabled={loading}
              className="h-[42px] self-end rounded-md bg-signal-magenta px-5 text-sm font-medium text-ink hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Looking up…" : "Lookup"}
            </button>
          </div>
        </form>
        <p className="mt-3 text-xs text-smoke-dim">
          Queried live over DNS-over-HTTPS (Cloudflare 1.1.1.1). This is the one lookup in the
          toolkit that leaves your browser — the domain you enter is sent to Cloudflare&rsquo;s
          resolver.
        </p>
        {error && <p className="mt-3 text-sm text-signal-magenta">{error}</p>}
      </Card>

      {result && (
        <Card>
          <div className="mb-3 flex items-center gap-2">
            <p className="font-mono text-xs uppercase tracking-wide text-smoke-dim">Answers</p>
            <Badge tone={result.status === 0 ? "live" : "soon"}>
              {result.status === 0 ? "NOERROR" : `status ${result.status}`}
            </Badge>
          </div>
          {result.answers.length === 0 ? (
            <p className="text-sm text-smoke">No {type} records found for this domain.</p>
          ) : (
            <div className="space-y-2">
              {result.answers.map((a, i) => (
                <div key={i} className="rounded-md border border-charcoal-border/60 px-3 py-2.5">
                  <p className="font-mono text-sm text-bone break-all">{a.data}</p>
                  <p className="mt-1 text-xs text-smoke-dim">
                    {a.name} · TTL {a.ttl}s
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
