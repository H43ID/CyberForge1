export type ProxyResult = {
  requestedUrl: string;
  finalUrl: string;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  securityTxt: string | null;
};

export async function fetchHeaders(url: string): Promise<ProxyResult> {
  const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  const res = await fetch(`/api/proxy/fetch-url?url=${encodeURIComponent(normalized)}`);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error ?? "Couldn't fetch that URL.");
  }
  return json as ProxyResult;
}

export type SecurityHeaderCheck = {
  header: string;
  present: boolean;
  value: string | null;
  explanation: string;
};

const SECURITY_HEADERS: { header: string; explanation: string }[] = [
  {
    header: "strict-transport-security",
    explanation: "Tells browsers to only ever connect over HTTPS, even if a user types http://.",
  },
  {
    header: "content-security-policy",
    explanation: "Restricts what scripts, styles, and resources a page is allowed to load — a strong defense against cross-site scripting.",
  },
  {
    header: "x-frame-options",
    explanation: "Controls whether the page can be embedded in an iframe, mitigating clickjacking.",
  },
  {
    header: "x-content-type-options",
    explanation: "Set to 'nosniff', this stops browsers from guessing a file's type in a way that could be exploited.",
  },
  {
    header: "referrer-policy",
    explanation: "Controls how much of the current URL is shared with the next site a user navigates to.",
  },
  {
    header: "permissions-policy",
    explanation: "Lets a site explicitly disable browser features like camera, microphone, or geolocation.",
  },
];

export function evaluateSecurityHeaders(headers: Record<string, string>): SecurityHeaderCheck[] {
  const lower = Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]));
  return SECURITY_HEADERS.map((h) => ({
    header: h.header,
    present: h.header in lower,
    value: lower[h.header] ?? null,
    explanation: h.explanation,
  }));
}
