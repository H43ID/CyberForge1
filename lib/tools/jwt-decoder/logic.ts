export type JwtDecoded = {
  header: unknown;
  payload: unknown;
  signaturePresent: boolean;
  expiresAt: string | null;
  issuedAt: string | null;
};

function base64UrlDecode(segment: string): string {
  const padded = segment.replace(/-/g, "+").replace(/_/g, "/").padEnd(
    segment.length + ((4 - (segment.length % 4)) % 4),
    "="
  );
  return decodeURIComponent(escape(atob(padded)));
}

export function decodeJwt(token: string): JwtDecoded {
  const parts = token.trim().split(".");
  if (parts.length < 2) {
    throw new Error("That doesn't look like a JWT — expected header.payload.signature.");
  }
  const header = JSON.parse(base64UrlDecode(parts[0]));
  const payload = JSON.parse(base64UrlDecode(parts[1]));

  const exp = typeof payload === "object" && payload && "exp" in payload ? (payload as { exp: number }).exp : null;
  const iat = typeof payload === "object" && payload && "iat" in payload ? (payload as { iat: number }).iat : null;

  return {
    header,
    payload,
    signaturePresent: Boolean(parts[2] && parts[2].length > 0),
    expiresAt: exp ? new Date(exp * 1000).toISOString() : null,
    issuedAt: iat ? new Date(iat * 1000).toISOString() : null,
  };
}
