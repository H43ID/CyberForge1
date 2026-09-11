"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { TextArea } from "@/components/ui/TextArea";
import { ResultRow } from "@/components/ui/ResultRow";
import { Badge } from "@/components/ui/Badge";
import { analyzeEmailHeaders } from "./logic";

const SAMPLE = `Received: from mail.example.com (mail.example.com [203.0.113.5])
    by mx.recipient.com with ESMTP id abc123
    for <you@recipient.com>; Mon, 01 Sep 2026 10:15:00 +0000
Received: from smtp.sender.net (smtp.sender.net [198.51.100.9])
    by mail.example.com with ESMTP id def456
    for <sender@example.com>; Mon, 01 Sep 2026 10:14:40 +0000
From: "Notifications" <notify@sender.net>
To: you@recipient.com
Subject: Your weekly summary
Date: Mon, 01 Sep 2026 10:14:30 +0000
Message-ID: <abc123@sender.net>
Authentication-Results: mx.recipient.com; spf=pass smtp.mailfrom=sender.net; dkim=pass header.d=sender.net; dmarc=pass header.from=sender.net`;

function authTone(value: string | null): "live" | "magenta" | "soon" {
  if (!value) return "soon";
  return value.toLowerCase() === "pass" ? "live" : "magenta";
}

export function EmailHeaderAnalyzerTool() {
  const [raw, setRaw] = useState(SAMPLE);

  const { result, error } = useMemo(() => {
    try {
      return { result: analyzeEmailHeaders(raw), error: null as string | null };
    } catch (e) {
      return { result: null, error: e instanceof Error ? e.message : "Couldn't parse headers." };
    }
  }, [raw]);

  return (
    <div className="space-y-4">
      <Card>
        <TextArea
          label="Raw email headers"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={10}
          spellCheck={false}
        />
        {error && <p className="mt-3 text-sm text-signal-magenta">{error}</p>}
      </Card>

      {result && (
        <>
          <Card>
            <p className="mb-2 font-mono text-xs uppercase tracking-wide text-smoke-dim">Summary</p>
            {result.from && <ResultRow label="From" value={result.from} mono={false} />}
            {result.to && <ResultRow label="To" value={result.to} mono={false} />}
            {result.subject && <ResultRow label="Subject" value={result.subject} mono={false} />}
            {result.date && <ResultRow label="Date" value={result.date} mono={false} />}
            {result.messageId && <ResultRow label="Message-ID" value={result.messageId} />}
          </Card>

          <Card>
            <p className="mb-3 font-mono text-xs uppercase tracking-wide text-smoke-dim">
              Authentication
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge tone={authTone(result.spf)}>SPF: {result.spf ?? "not found"}</Badge>
              <Badge tone={authTone(result.dkim)}>DKIM: {result.dkim ?? "not found"}</Badge>
              <Badge tone={authTone(result.dmarc)}>DMARC: {result.dmarc ?? "not found"}</Badge>
            </div>
            <p className="mt-3 text-xs text-smoke-dim">
              These reflect what the receiving mail server reported in Authentication-Results —
              they are not re-verified here. A missing value usually means the header wasn&rsquo;t
              present, not that the check failed.
            </p>
          </Card>

          {result.receivedChain.length > 0 && (
            <Card>
              <p className="mb-3 font-mono text-xs uppercase tracking-wide text-smoke-dim">
                Received path ({result.receivedChain.length} hop
                {result.receivedChain.length === 1 ? "" : "s"})
              </p>
              <p className="mb-3 text-xs text-smoke-dim">
                Listed top to bottom as received — the last hop is closest to the original sender.
              </p>
              <ol className="space-y-2">
                {result.receivedChain.map((hop, i) => (
                  <li key={i} className="rounded-md border border-charcoal-border/60 px-3 py-2.5">
                    <span className="mr-2 font-mono text-xs text-smoke-dim">#{i + 1}</span>
                    <span className="break-all font-mono text-xs text-bone">{hop}</span>
                  </li>
                ))}
              </ol>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
