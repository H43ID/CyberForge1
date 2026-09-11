import { dnsLookup, type DnsAnswer, type RecordType } from "@/lib/tools/dns-lookup/logic";
import {
  fetchHeaders,
  evaluateSecurityHeaders,
  type ProxyResult,
  type SecurityHeaderCheck,
} from "@/lib/tools/http-header-analyzer/logic";

export type DnsSection = { type: RecordType; answers: DnsAnswer[]; error: string | null };

export type ForgeReport = {
  id: string;
  target: string;
  generatedAt: string;
  dns: DnsSection[];
  http: ProxyResult | null;
  httpError: string | null;
  securityHeaders: SecurityHeaderCheck[];
  observations: string[];
};

const REPORT_DNS_TYPES: RecordType[] = ["A", "AAAA", "MX", "TXT", "NS"];

function buildObservations(report: Omit<ForgeReport, "observations">): string[] {
  const notes: string[] = [];

  const aRecords = report.dns.find((d) => d.type === "A");
  if (aRecords && aRecords.answers.length === 0) {
    notes.push("No A records found — this domain may not resolve to an IPv4 host directly.");
  }

  const mxRecords = report.dns.find((d) => d.type === "MX");
  if (mxRecords && mxRecords.answers.length === 0) {
    notes.push("No MX records found — this domain likely doesn't receive email directly.");
  }

  const txtRecords = report.dns.find((d) => d.type === "TXT");
  const hasSpf = txtRecords?.answers.some((a) => a.data.toLowerCase().includes("v=spf1"));
  if (mxRecords && mxRecords.answers.length > 0 && !hasSpf) {
    notes.push("This domain receives email but has no SPF record in its TXT records — a common gap that makes spoofing easier.");
  }

  if (report.securityHeaders.length > 0) {
    const missing = report.securityHeaders.filter((h) => !h.present);
    if (missing.length > 0) {
      notes.push(
        `${missing.length} of ${report.securityHeaders.length} checked security headers are missing: ${missing
          .map((m) => m.header)
          .join(", ")}.`
      );
    } else {
      notes.push("All checked security headers are present.");
    }
  }

  if (report.http && !report.http.securityTxt) {
    notes.push("No security.txt found — researchers have no documented way to report vulnerabilities responsibly.");
  }

  if (report.httpError) {
    notes.push(`HTTP analysis could not complete: ${report.httpError}`);
  }

  if (notes.length === 0) {
    notes.push("No notable issues surfaced by this report.");
  }

  return notes;
}

export async function generateForgeReport(target: string): Promise<ForgeReport> {
  const cleaned = target.trim().replace(/^https?:\/\//i, "").replace(/\/.*$/, "");
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(cleaned)) {
    throw new Error("Enter a valid domain, e.g. example.com");
  }

  const dns = await Promise.all(
    REPORT_DNS_TYPES.map(async (type): Promise<DnsSection> => {
      try {
        const result = await dnsLookup(cleaned, type);
        return { type, answers: result.answers, error: null };
      } catch (e) {
        return { type, answers: [], error: e instanceof Error ? e.message : "Lookup failed." };
      }
    })
  );

  let http: ProxyResult | null = null;
  let httpError: string | null = null;
  try {
    http = await fetchHeaders(cleaned);
  } catch (e) {
    httpError = e instanceof Error ? e.message : "Couldn't fetch HTTP headers.";
  }

  const securityHeaders = http ? evaluateSecurityHeaders(http.headers) : [];

  const base = {
    id: `${cleaned}-${Date.now()}`,
    target: cleaned,
    generatedAt: new Date().toISOString(),
    dns,
    http,
    httpError,
    securityHeaders,
  };

  return { ...base, observations: buildObservations(base) };
}
