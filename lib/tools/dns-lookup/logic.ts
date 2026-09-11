export const RECORD_TYPES = ["A", "AAAA", "MX", "NS", "TXT", "CNAME", "SOA", "CAA"] as const;
export type RecordType = (typeof RECORD_TYPES)[number];

export type DnsAnswer = {
  name: string;
  type: number;
  ttl: number;
  data: string;
};

export type DnsResult = {
  status: number;
  answers: DnsAnswer[];
  authorityAnswers: DnsAnswer[];
};

const TYPE_NUM: Record<RecordType, number> = {
  A: 1, NS: 2, CNAME: 5, SOA: 6, MX: 15, TXT: 16, AAAA: 28, CAA: 257,
};

export async function dnsLookup(domain: string, type: RecordType): Promise<DnsResult> {
  const cleaned = domain.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(cleaned)) {
    throw new Error("Enter a valid domain, e.g. example.com");
  }

  const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(cleaned)}&type=${type}`;
  const res = await fetch(url, { headers: { accept: "application/dns-json" } });
  if (!res.ok) {
    throw new Error(`DNS query failed (HTTP ${res.status}). The resolver may be unreachable.`);
  }
  const json = await res.json();

  const mapAnswer = (a: { name: string; type: number; TTL: number; data: string }): DnsAnswer => ({
    name: a.name,
    type: a.type,
    ttl: a.TTL,
    data: a.data,
  });

  return {
    status: json.Status,
    answers: (json.Answer ?? []).map(mapAnswer),
    authorityAnswers: (json.Authority ?? []).map(mapAnswer),
  };
}

export function typeNumberToName(num: number): string {
  const entry = Object.entries(TYPE_NUM).find(([, v]) => v === num);
  return entry ? entry[0] : String(num);
}
