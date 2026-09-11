export type Encoding = "base64" | "url" | "html" | "hex";

export function encode(value: string, encoding: Encoding): string {
  switch (encoding) {
    case "base64":
      return btoa(unescape(encodeURIComponent(value)));
    case "url":
      return encodeURIComponent(value);
    case "html":
      return value.replace(/[&<>"']/g, (c) => {
        const map: Record<string, string> = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        };
        return map[c];
      });
    case "hex":
      return Array.from(new TextEncoder().encode(value))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(" ");
  }
}

export function decode(value: string, encoding: Encoding): string {
  switch (encoding) {
    case "base64":
      return decodeURIComponent(escape(atob(value.trim())));
    case "url":
      return decodeURIComponent(value);
    case "html":
      return value
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
    case "hex": {
      const bytes = value
        .trim()
        .split(/\s+/)
        .map((h) => parseInt(h, 16));
      if (bytes.some((b) => Number.isNaN(b))) throw new Error("Not valid hex bytes.");
      return new TextDecoder().decode(new Uint8Array(bytes));
    }
  }
}
