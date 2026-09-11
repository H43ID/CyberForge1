"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { TextArea } from "@/components/ui/TextArea";
import { Badge } from "@/components/ui/Badge";
import { decodeJwt } from "./logic";

const SAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MzAwMDAwMDB9.dummySignature";

export function JwtDecoderTool() {
  const [token, setToken] = useState(SAMPLE);

  const { result, error } = useMemo(() => {
    try {
      return { result: decodeJwt(token), error: null as string | null };
    } catch (e) {
      return { result: null, error: e instanceof Error ? e.message : "Couldn't decode that token." };
    }
  }, [token]);

  return (
    <div className="space-y-4">
      <Card>
        <TextArea
          label="JWT"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          rows={4}
          spellCheck={false}
        />
        {error && <p className="mt-3 text-sm text-signal-magenta">{error}</p>}
      </Card>

      {result && (
        <>
          <div className="rounded-md border border-signal-magenta/30 bg-signal-magenta/5 px-4 py-3">
            <p className="text-sm text-dusty-rose">
              This decodes the token — it does not verify the signature. A token can be decoded
              and read by anyone; only the issuer holding the secret or private key can confirm
              it&rsquo;s genuine.
            </p>
          </div>

          <Card>
            <div className="mb-2 flex items-center justify-between">
              <p className="font-mono text-xs uppercase tracking-wide text-smoke-dim">Header</p>
              <Badge tone={result.signaturePresent ? "live" : "soon"}>
                {result.signaturePresent ? "signature present" : "no signature"}
              </Badge>
            </div>
            <pre className="overflow-auto font-mono text-sm text-bone">
              {JSON.stringify(result.header, null, 2)}
            </pre>
          </Card>

          <Card>
            <p className="mb-2 font-mono text-xs uppercase tracking-wide text-smoke-dim">
              Payload (claims)
            </p>
            <pre className="overflow-auto font-mono text-sm text-bone">
              {JSON.stringify(result.payload, null, 2)}
            </pre>
            {(result.issuedAt || result.expiresAt) && (
              <div className="mt-3 space-y-1 border-t border-charcoal-border pt-3 text-sm text-smoke">
                {result.issuedAt && <p>Issued at: {result.issuedAt}</p>}
                {result.expiresAt && <p>Expires at: {result.expiresAt}</p>}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
