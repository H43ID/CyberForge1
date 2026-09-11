import { ipv4ToUint32, uint32ToIpv4 } from "../subnet-calculator/logic";

export function prefixToMask(prefix: number): string {
  if (prefix < 0 || prefix > 32) throw new Error("Prefix must be between /0 and /32.");
  const maskInt = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  return uint32ToIpv4(maskInt);
}

export function maskToPrefix(mask: string): number {
  const maskInt = ipv4ToUint32(mask);
  const binary = maskInt.toString(2).padStart(32, "0");
  if (!/^1*0*$/.test(binary)) {
    throw new Error("That isn't a contiguous subnet mask (ones must all come before zeros).");
  }
  return binary.split("0")[0].length;
}

export type CidrTableRow = {
  prefix: number;
  mask: string;
  totalAddresses: number;
  usableHosts: number;
};

export function cidrTable(): CidrTableRow[] {
  const rows: CidrTableRow[] = [];
  for (let prefix = 8; prefix <= 32; prefix++) {
    const total = 2 ** (32 - prefix);
    const usable = prefix <= 30 ? total - 2 : prefix === 31 ? 2 : 1;
    rows.push({ prefix, mask: prefixToMask(prefix), totalAddresses: total, usableHosts: usable });
  }
  return rows;
}
