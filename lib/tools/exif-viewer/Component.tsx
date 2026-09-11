"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { FileDrop } from "@/components/ui/FileDrop";
import { ResultRow } from "@/components/ui/ResultRow";
import { parseExif, type ExifSummary } from "./logic";

export function ExifViewerTool() {
  const [summary, setSummary] = useState<ExifSummary | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    try {
      const result = await parseExif(file);
      setSummary(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't read metadata from this file.");
      setSummary(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <FileDrop label="Image file" onFile={handleFile} accept="image/*" />
        {busy && <p className="mt-3 text-sm text-smoke">Reading metadata…</p>}
        {error && <p className="mt-3 text-sm text-signal-magenta">{error}</p>}
      </Card>

      {summary && !summary.hasData && (
        <Card>
          <p className="text-sm text-smoke">
            No EXIF metadata was found in this file. It may have been stripped already, or the
            format doesn&rsquo;t carry EXIF (common for PNG and some screenshots).
          </p>
        </Card>
      )}

      {summary?.hasData && (
        <>
          {summary.camera && (summary.camera.make || summary.camera.model) && (
            <Card>
              <p className="mb-2 font-mono text-xs uppercase tracking-wide text-smoke-dim">Camera</p>
              {summary.camera.make && <ResultRow label="Make" value={summary.camera.make} mono={false} />}
              {summary.camera.model && <ResultRow label="Model" value={summary.camera.model} mono={false} />}
              {summary.camera.lens && <ResultRow label="Lens" value={summary.camera.lens} mono={false} />}
            </Card>
          )}

          {summary.settings && (
            <Card>
              <p className="mb-2 font-mono text-xs uppercase tracking-wide text-smoke-dim">Exposure</p>
              {summary.settings.fNumber && <ResultRow label="Aperture" value={`f/${summary.settings.fNumber}`} />}
              {summary.settings.exposureTime && (
                <ResultRow label="Shutter speed" value={`1/${Math.round(1 / summary.settings.exposureTime)}s`} />
              )}
              {summary.settings.iso && <ResultRow label="ISO" value={String(summary.settings.iso)} />}
              {summary.settings.focalLength && (
                <ResultRow label="Focal length" value={`${summary.settings.focalLength}mm`} />
              )}
            </Card>
          )}

          {summary.image && (summary.image.width || summary.image.height) && (
            <Card>
              <p className="mb-2 font-mono text-xs uppercase tracking-wide text-smoke-dim">Image</p>
              <ResultRow label="Dimensions" value={`${summary.image.width} × ${summary.image.height}`} />
            </Card>
          )}

          {(summary.timestamps?.dateTimeOriginal || summary.timestamps?.createDate) && (
            <Card>
              <p className="mb-2 font-mono text-xs uppercase tracking-wide text-smoke-dim">Timestamps</p>
              {summary.timestamps.dateTimeOriginal && (
                <ResultRow label="Captured" value={summary.timestamps.dateTimeOriginal} />
              )}
              {summary.timestamps.createDate && (
                <ResultRow label="Created" value={summary.timestamps.createDate} />
              )}
            </Card>
          )}

          {summary.gps && (
            <Card>
              <p className="mb-2 font-mono text-xs uppercase tracking-wide text-smoke-dim">
                GPS location
              </p>
              <ResultRow label="Latitude" value={String(summary.gps.latitude)} />
              <ResultRow label="Longitude" value={String(summary.gps.longitude)} />
              <p className="mt-2 text-xs text-smoke-dim">
                This photo carries a precise location. Strip metadata before sharing publicly if
                that isn&rsquo;t intentional.
              </p>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
