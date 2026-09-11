import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const BLOCKED_HOSTNAME_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^0\.0\.0\.0$/,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^::1$/,
  /^\[::1\]$/,
];

function isBlockedHost(hostname: string): boolean {
  return BLOCKED_HOSTNAME_PATTERNS.some((p) => p.test(hostname));
}

async function fetchWithTimeout(url: string, ms: number, init?: RequestInit) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal, redirect: "follow" });
  } finally {
    clearTimeout(timer);
  }
}

export async function GET(req: NextRequest) {
  const target = req.nextUrl.searchParams.get("url");
  if (!target) {
    return NextResponse.json({ error: "Missing url parameter." }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return NextResponse.json({ error: "That isn't a valid URL." }, { status: 400 });
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return NextResponse.json({ error: "Only http and https URLs are supported." }, { status: 400 });
  }
  if (isBlockedHost(parsed.hostname)) {
    return NextResponse.json({ error: "Requests to local or private addresses aren't allowed." }, { status: 400 });
  }

  try {
    const res = await fetchWithTimeout(parsed.toString(), 8000, {
      method: "GET",
      headers: { "user-agent": "CyberForge-HeaderAnalyzer/1.0" },
    });

    const headers: Record<string, string> = {};
    res.headers.forEach((value, key) => {
      headers[key] = value;
    });

    let securityTxt: string | null = null;
    try {
      const secRes = await fetchWithTimeout(`${parsed.origin}/.well-known/security.txt`, 5000);
      if (secRes.ok) {
        const text = await secRes.text();
        // Guard against accidentally fetching an HTML 200 (soft-404) page
        if (!text.trim().startsWith("<")) {
          securityTxt = text.slice(0, 4000);
        }
      }
    } catch {
      securityTxt = null;
    }

    return NextResponse.json({
      requestedUrl: target,
      finalUrl: res.url,
      status: res.status,
      statusText: res.statusText,
      headers,
      securityTxt,
    });
  } catch (err) {
    const message = err instanceof Error && err.name === "AbortError" ? "The request timed out." : "Couldn't reach that URL.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
