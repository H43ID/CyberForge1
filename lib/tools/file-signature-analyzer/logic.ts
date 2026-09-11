export type FileSignature = {
  type: string;
  extensions: string[];
  bytes: (number | null)[]; // null = wildcard byte
  offset?: number;
};

export const SIGNATURES: FileSignature[] = [
  { type: "PNG image", extensions: ["png"], bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { type: "JPEG image", extensions: ["jpg", "jpeg"], bytes: [0xff, 0xd8, 0xff] },
  { type: "GIF image", extensions: ["gif"], bytes: [0x47, 0x49, 0x46, 0x38] },
  { type: "PDF document", extensions: ["pdf"], bytes: [0x25, 0x50, 0x44, 0x46] },
  { type: "ZIP archive", extensions: ["zip", "docx", "xlsx", "pptx", "jar"], bytes: [0x50, 0x4b, 0x03, 0x04] },
  { type: "GZIP archive", extensions: ["gz", "gzip"], bytes: [0x1f, 0x8b] },
  { type: "RAR archive", extensions: ["rar"], bytes: [0x52, 0x61, 0x72, 0x21, 0x1a, 0x07] },
  { type: "7-Zip archive", extensions: ["7z"], bytes: [0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c] },
  { type: "ELF executable", extensions: ["elf", "so", "bin"], bytes: [0x7f, 0x45, 0x4c, 0x46] },
  { type: "Windows PE executable", extensions: ["exe", "dll"], bytes: [0x4d, 0x5a] },
  { type: "WAV audio", extensions: ["wav"], bytes: [0x52, 0x49, 0x46, 0x46], offset: 0 },
  { type: "MP3 audio", extensions: ["mp3"], bytes: [0x49, 0x44, 0x33] },
  { type: "BMP image", extensions: ["bmp"], bytes: [0x42, 0x4d] },
  { type: "SQLite database", extensions: ["sqlite", "db"], bytes: [0x53, 0x51, 0x4c, 0x69, 0x74, 0x65] },
  { type: "MP4 video", extensions: ["mp4", "m4a", "mov"], bytes: [null, null, null, null, 0x66, 0x74, 0x79, 0x70], offset: 0 },
];

export type SignatureResult = {
  declaredExtension: string;
  detected: FileSignature | null;
  mismatch: boolean;
  firstBytesHex: string;
};

export async function analyzeFileSignature(file: File): Promise<SignatureResult> {
  const buffer = await file.slice(0, 32).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  const declaredExtension = file.name.includes(".")
    ? file.name.split(".").pop()!.toLowerCase()
    : "";

  const detected = SIGNATURES.find((sig) => {
    const offset = sig.offset ?? 0;
    return sig.bytes.every((b, i) => b === null || bytes[offset + i] === b);
  }) ?? null;

  const mismatch = Boolean(
    detected && declaredExtension && !detected.extensions.includes(declaredExtension)
  );

  const firstBytesHex = Array.from(bytes.slice(0, 16))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(" ");

  return { declaredExtension, detected, mismatch, firstBytesHex };
}
