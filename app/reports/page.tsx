"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { TextInput } from "@/components/ui/TextInput";
import { Badge } from "@/components/ui/Badge";
import { generateForgeReport, type ForgeReport } from "@/lib/reports/logic";
import { reportToJSON, reportToTXT, reportToPDF, downloadText, downloadBlob } from "@/lib/reports/export";
import { saveReport } from "@/lib/storage/local";

export default function ReportsPage() {
  const [target, setTarget] = useState("example.com");
  const [report, setReport] = useState<ForgeReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function run(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      setReport(await generateForgeReport(target));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't generate a report.");
      setReport(null);
    } finally {
      setLoading(false);
    }
  }

  function handleSave() {
    if (!report) return;
    saveReport(report);
    setSaved(true);
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-smoke-dim">forge report</p>
      <h1 className="mt-3 font-display text-4xl">Combine your analyses</h1>
      <p className="mt-3 max-w-xl text-smoke">
        Run DNS, HTTP header, and security.txt checks against one domain and combine them into a
        single report you can save or export.
      </p>

      <Card className="mt-8">
        <form onSubmit={run} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <TextInput
              label="Target domain"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="example.com"
              spellCheck={false}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="h-[42px] rounded-md bg-signal-magenta px-5 text-sm font-medium text-ink hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Running analysis…" : "Run analysis"}
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-signal-magenta">{error}</p>}
      </Card>

      {report && (
        <div className="mt-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl">{report.target}</h2>
              <p className="text-xs text-smoke-dim">
                Generated {new Date(report.generatedAt).toLocaleString()}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleSave}
                className="rounded-md border border-charcoal-border px-3 py-1.5 text-xs text-bone hover:border-dusty-rose/50"
              >
                {saved ? "Saved ✓" : "Save report"}
              </button>
              <button
                onClick={() => downloadText(reportToJSON(report), `cyberforge-report-${report.target}.json`, "application/json")}
                className="rounded-md border border-charcoal-border px-3 py-1.5 text-xs text-bone hover:border-dusty-rose/50"
              >
                Export JSON
              </button>
              <button
                onClick={() => downloadText(reportToTXT(report), `cyberforge-report-${report.target}.txt`, "text/plain")}
                className="rounded-md border border-charcoal-border px-3 py-1.5 text-xs text-bone hover:border-dusty-rose/50"
              >
                Export TXT
              </button>
              <button
                onClick={async () => downloadBlob(await reportToPDF(report), `cyberforge-report-${report.target}.pdf`)}
                className="rounded-md border border-charcoal-border px-3 py-1.5 text-xs text-bone hover:border-dusty-rose/50"
              >
                Export PDF
              </button>
            </div>
          </div>

          <Card>
            <p className="mb-3 font-mono text-xs uppercase tracking-wide text-smoke-dim">DNS findings</p>
            <div className="space-y-2">
              {report.dns.map((section) => (
                <div key={section.type} className="flex items-start gap-3 border-b border-charcoal-border/50 py-2 last:border-b-0">
                  <span className="w-14 shrink-0 font-mono text-xs text-smoke-dim">{section.type}</span>
                  {section.error ? (
                    <span className="text-sm text-signal-magenta">{section.error}</span>
                  ) : section.answers.length === 0 ? (
                    <span className="text-sm text-smoke">no records</span>
                  ) : (
                    <span className="break-all font-mono text-sm text-bone">
                      {section.answers.map((a) => a.data).join(", ")}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <p className="mb-3 font-mono text-xs uppercase tracking-wide text-smoke-dim">HTTP findings</p>
            {report.http ? (
              <>
                <Badge tone={report.http.status < 400 ? "live" : "magenta"}>
                  {report.http.status} {report.http.statusText}
                </Badge>
                <div className="mt-3 flex flex-wrap gap-2">
                  {report.securityHeaders.map((h) => (
                    <Badge key={h.header} tone={h.present ? "live" : "soon"}>
                      {h.header}
                    </Badge>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-signal-magenta">{report.httpError}</p>
            )}
          </Card>

          <Card>
            <p className="mb-2 font-mono text-xs uppercase tracking-wide text-smoke-dim">
              Observations & recommendations
            </p>
            <ul className="space-y-1.5 text-sm text-smoke">
              {report.observations.map((obs) => (
                <li key={obs}>· {obs}</li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
}
