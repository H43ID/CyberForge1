export type ParsedHeader = { name: string; value: string };

export type EmailAnalysis = {
  from: string | null;
  to: string | null;
  subject: string | null;
  date: string | null;
  messageId: string | null;
  receivedChain: string[];
  spf: string | null;
  dkim: string | null;
  dmarc: string | null;
  allHeaders: ParsedHeader[];
};

function unfoldHeaders(raw: string): string[] {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const unfolded: string[] = [];
  for (const line of lines) {
    if (/^[ \t]/.test(line) && unfolded.length > 0) {
      unfolded[unfolded.length - 1] += " " + line.trim();
    } else if (line.trim() !== "") {
      unfolded.push(line);
    } else {
      break; // blank line ends the header block
    }
  }
  return unfolded;
}

function parseHeaders(raw: string): ParsedHeader[] {
  return unfoldHeaders(raw)
    .map((line) => {
      const idx = line.indexOf(":");
      if (idx === -1) return null;
      return { name: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() };
    })
    .filter((h): h is ParsedHeader => h !== null);
}

function get(headers: ParsedHeader[], name: string): string | null {
  const found = headers.find((h) => h.name.toLowerCase() === name.toLowerCase());
  return found ? found.value : null;
}

function getAll(headers: ParsedHeader[], name: string): string[] {
  return headers.filter((h) => h.name.toLowerCase() === name.toLowerCase()).map((h) => h.value);
}

function extractAuthResult(authResults: string | null, mechanism: string): string | null {
  if (!authResults) return null;
  const match = authResults.match(new RegExp(`${mechanism}=(\\w+)`, "i"));
  return match ? match[1] : null;
}

export function analyzeEmailHeaders(raw: string): EmailAnalysis {
  const headers = parseHeaders(raw);
  if (headers.length === 0) {
    throw new Error("Couldn't find any headers. Paste the raw header block, including field names.");
  }

  const authResults = get(headers, "Authentication-Results");

  return {
    from: get(headers, "From"),
    to: get(headers, "To"),
    subject: get(headers, "Subject"),
    date: get(headers, "Date"),
    messageId: get(headers, "Message-ID"),
    receivedChain: getAll(headers, "Received"),
    spf: extractAuthResult(authResults, "spf") ?? get(headers, "Received-SPF"),
    dkim: extractAuthResult(authResults, "dkim"),
    dmarc: extractAuthResult(authResults, "dmarc"),
    allHeaders: headers,
  };
}
