export type SubnetResult = {
  cidr: string;
  ip: string;
  prefix: number;
  networkAddress: string;
  broadcastAddress: string;
  firstUsable: string;
  lastUsable: string;
  usableHostCount: number;
  totalAddresses: number;
  subnetMask: string;
  wildcardMask: string;
  binaryIp: string;
  binaryMask: string;
};

export function ipv4ToUint32(ip: string): number {
  const parts = ip.split(".");
  if (parts.length !== 4) throw new Error("An IPv4 address needs exactly four octets.");
  let value = 0;
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) throw new Error(`"${part}" is not a valid octet.`);
    const n = Number(part);
    if (n < 0 || n > 255) throw new Error(`"${part}" must be between 0 and 255.`);
    value = (value << 8) | n;
  }
  return value >>> 0;
}

export function uint32ToIpv4(value: number): string {
  return [24, 16, 8, 0].map((shift) => (value >>> shift) & 255).join(".");
}

export function uint32ToBinary(value: number): string {
  return value
    .toString(2)
    .padStart(32, "0")
    .replace(/(\d{8})(?=\d)/g, "$1.");
}

export function parseCidr(input: string): { ip: string; prefix: number } {
  const trimmed = input.trim();
  const match = trimmed.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\/(\d{1,2})$/);
  if (!match) {
    throw new Error('Enter an address in CIDR form, e.g. "192.168.1.0/24".');
  }
  const prefix = Number(match[2]);
  if (prefix < 0 || prefix > 32) throw new Error("Prefix length must be between /0 and /32.");
  return { ip: match[1], prefix };
}

export function calculateSubnet(input: string): SubnetResult {
  const { ip, prefix } = parseCidr(input);
  const ipInt = ipv4ToUint32(ip);
  const maskInt = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const networkInt = ipInt & maskInt;
  const broadcastInt = (networkInt | (~maskInt >>> 0)) >>> 0;
  const wildcardInt = (~maskInt) >>> 0;

  const totalAddresses = 2 ** (32 - prefix);
  let firstUsableInt = networkInt;
  let lastUsableInt = broadcastInt;
  let usableHostCount = totalAddresses;

  if (prefix <= 30) {
    firstUsableInt = networkInt + 1;
    lastUsableInt = broadcastInt - 1;
    usableHostCount = totalAddresses - 2;
  } else if (prefix === 31) {
    // RFC 3021 point-to-point link: both addresses are usable, no network/broadcast
    usableHostCount = 2;
  } else {
    // /32 — a single host route
    usableHostCount = 1;
  }

  return {
    cidr: `${ip}/${prefix}`,
    ip,
    prefix,
    networkAddress: uint32ToIpv4(networkInt),
    broadcastAddress: uint32ToIpv4(broadcastInt),
    firstUsable: uint32ToIpv4(firstUsableInt),
    lastUsable: uint32ToIpv4(lastUsableInt),
    usableHostCount,
    totalAddresses,
    subnetMask: uint32ToIpv4(maskInt),
    wildcardMask: uint32ToIpv4(wildcardInt),
    binaryIp: uint32ToBinary(ipInt),
    binaryMask: uint32ToBinary(maskInt),
  };
}
