import SparkMD5 from "spark-md5";

export type HashAlgo = "MD5" | "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

export const HASH_ALGOS: HashAlgo[] = ["MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512"];

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashArrayBuffer(buffer: ArrayBuffer, algo: HashAlgo): Promise<string> {
  if (algo === "MD5") {
    return SparkMD5.ArrayBuffer.hash(buffer);
  }
  const digest = await crypto.subtle.digest(algo, buffer);
  return bufferToHex(digest);
}

export async function hashText(text: string, algo: HashAlgo): Promise<string> {
  const buffer = new TextEncoder().encode(text).buffer as ArrayBuffer;
  return hashArrayBuffer(buffer, algo);
}

export async function hashFile(file: File, algo: HashAlgo): Promise<string> {
  const buffer = await file.arrayBuffer();
  return hashArrayBuffer(buffer, algo);
}

export async function hashTextAllAlgos(text: string): Promise<Record<HashAlgo, string>> {
  const entries = await Promise.all(HASH_ALGOS.map(async (a) => [a, await hashText(text, a)] as const));
  return Object.fromEntries(entries) as Record<HashAlgo, string>;
}

export async function hashFileAllAlgos(file: File): Promise<Record<HashAlgo, string>> {
  const buffer = await file.arrayBuffer();
  const entries = await Promise.all(
    HASH_ALGOS.map(async (a) => [a, await hashArrayBuffer(buffer, a)] as const)
  );
  return Object.fromEntries(entries) as Record<HashAlgo, string>;
}
