export type Base = "bin" | "dec" | "hex";

const RADIX: Record<Base, number> = { bin: 2, dec: 10, hex: 16 };
const PATTERN: Record<Base, RegExp> = {
  bin: /^[01]+$/,
  dec: /^\d+$/,
  hex: /^[0-9a-fA-F]+$/,
};

export function parseInBase(value: string, base: Base): bigint {
  const cleaned = value.trim().replace(/^0x/i, "").replace(/\s+/g, "");
  if (!cleaned) throw new Error("Enter a value.");
  if (!PATTERN[base].test(cleaned)) {
    throw new Error(`"${value}" isn't valid ${base === "bin" ? "binary" : base === "hex" ? "hexadecimal" : "decimal"}.`);
  }
  return BigInt(base === "bin" ? `0b${cleaned}` : base === "hex" ? `0x${cleaned}` : cleaned);
}

export function convertAll(value: string, fromBase: Base) {
  const n = parseInBase(value, fromBase);
  return {
    decimal: n.toString(10),
    binary: n.toString(2),
    hex: n.toString(16).toUpperCase(),
    radix: RADIX,
  };
}

/** Per-octet breakdown, useful when the value represents an IPv4 address. */
export function octetBreakdown(decimalValue: string): string | null {
  const n = Number(decimalValue);
  if (!Number.isInteger(n) || n < 0 || n > 0xffffffff) return null;
  const octets = [24, 16, 8, 0].map((shift) => (n >>> shift) & 255);
  return octets.map((o) => o.toString(2).padStart(8, "0")).join(".");
}
