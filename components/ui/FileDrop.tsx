"use client";

import { useRef, useState } from "react";

export function FileDrop({
  label,
  onFile,
  accept,
}: {
  label: string;
  onFile: (file: File) => void;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setFileName(file.name);
    onFile(file);
  }

  return (
    <div>
      <span className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-smoke-dim">
        {label}
      </span>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`cursor-pointer rounded-md border border-dashed px-4 py-8 text-center transition-colors ${
          dragging ? "border-dusty-rose/60 bg-charcoal-light" : "border-charcoal-border hover:border-dusty-rose/40"
        }`}
      >
        <p className="text-sm text-bone">
          {fileName ?? "Click to choose a file, or drag one here"}
        </p>
        <p className="mt-1 text-xs text-smoke-dim">Processed locally in your browser</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
