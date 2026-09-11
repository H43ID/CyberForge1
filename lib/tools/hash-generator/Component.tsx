"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { TextArea } from "@/components/ui/TextArea";
import { TextInput } from "@/components/ui/TextInput";
import { ResultRow } from "@/components/ui/ResultRow";
import { FileDrop } from "@/components/ui/FileDrop";
import { HASH_ALGOS, hashTextAllAlgos, hashFileAllAlgos, type HashAlgo } from "./logic";

export function HashGeneratorTool() {
  const [mode, setMode] = useState<"text" | "file">("text");
  const [text, setText] = useState("CyberForge");
  const [file, setFile] = useState<File | null>(null);
  const [hashes, setHashes] = useState<Record<HashAlgo, string> | null>(null);
  const [busy, setBusy] = useState(false);
  const [compareA, setCompareA] = useState("");
  const [compareB, setCompareB] = useState("");

  useEffect(() => {
    let cancelled = false;
    if (mode === "text") {
      setBusy(true);
      hashTextAllAlgos(text).then((h) => {
        if (!cancelled) {
          setHashes(h);
          setBusy(false);
        }
      });
    } else if (mode === "file" && file) {
      setBusy(true);
      hashFileAllAlgos(file).then((h) => {
        if (!cancelled) {
          setHashes(h);
          setBusy(false);
        }
      });
    }
    return () => {
      cancelled = true;
    };
  }, [mode, text, file]);

  const match =
    compareA.trim().length > 0 &&
    compareB.trim().length > 0 &&
    compareA.trim().toLowerCase() === compareB.trim().toLowerCase();

  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-4 flex overflow-hidden rounded-md border border-charcoal-border text-xs w-fit">
          <button
            onClick={() => setMode("text")}
            className={`px-3 py-1.5 ${mode === "text" ? "bg-charcoal-light text-bone" : "text-smoke"}`}
          >
            Text
          </button>
          <button
            onClick={() => setMode("file")}
            className={`px-3 py-1.5 ${mode === "file" ? "bg-charcoal-light text-bone" : "text-smoke"}`}
          >
            File
          </button>
        </div>
        {mode === "text" ? (
          <TextArea label="Text" value={text} onChange={(e) => setText(e.target.value)} rows={4} spellCheck={false} />
        ) : (
          <FileDrop label="File" onFile={setFile} />
        )}
      </Card>

      <Card>
        <p className="mb-2 font-mono text-xs uppercase tracking-wide text-smoke-dim">
          {busy ? "Hashing…" : "Hashes"}
        </p>
        {hashes &&
          !busy &&
          HASH_ALGOS.map((algo) => <ResultRow key={algo} label={algo} value={hashes[algo]} />)}
        {mode === "file" && !file && <p className="text-sm text-smoke">Choose a file above to hash it.</p>}
      </Card>

      <Card>
        <p className="mb-3 font-mono text-xs uppercase tracking-wide text-smoke-dim">
          Compare two hashes
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <TextInput label="Hash A" value={compareA} onChange={(e) => setCompareA(e.target.value)} spellCheck={false} />
          <TextInput label="Hash B" value={compareB} onChange={(e) => setCompareB(e.target.value)} spellCheck={false} />
        </div>
        {compareA && compareB && (
          <p className={`mt-3 text-sm ${match ? "text-dusty-rose" : "text-signal-magenta"}`}>
            {match ? "Match — the hashes are identical." : "No match — the hashes differ."}
          </p>
        )}
      </Card>
    </div>
  );
}
