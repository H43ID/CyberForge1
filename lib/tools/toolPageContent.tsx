import type { ReactNode } from "react";
import { SubnetCalculatorTool } from "./subnet-calculator/Component";
import { CidrCalculatorTool } from "./cidr-calculator/Component";
import { NumberBaseConverterTool } from "./number-base-converter/Component";
import { DnsLookupTool } from "./dns-lookup/Component";
import { HashGeneratorTool } from "./hash-generator/Component";
import { PasswordStrengthTool } from "./password-strength/Component";
import { JwtDecoderTool } from "./jwt-decoder/Component";
import { JsonFormatterTool } from "./json-formatter/Component";
import { EncodingToolkitTool } from "./encoding-toolkit/Component";
import { ExifViewerTool } from "./exif-viewer/Component";
import { FileSignatureAnalyzerTool } from "./file-signature-analyzer/Component";
import { EmailHeaderAnalyzerTool } from "./email-header-analyzer/Component";
import { HttpHeaderAnalyzerTool } from "./http-header-analyzer/Component";

export type ToolContent = {
  interactive: ReactNode;
  whatItMeans: ReactNode;
  whyItMatters: ReactNode;
  howItWorks: ReactNode;
};

export const TOOL_CONTENT: Record<string, ToolContent> = {
  "subnet-calculator": {
    interactive: <SubnetCalculatorTool />,
    whatItMeans: "A /24 means the first 24 bits identify the network and the remaining 8 bits identify hosts — so a /24 always has 256 total addresses, with 254 usable after the network and broadcast addresses are reserved.",
    whyItMatters: "Getting subnet boundaries wrong is one of the most common networking mistakes — it causes devices to be unreachable or address ranges to overlap.",
    howItWorks: "The calculator ANDs your IP with the subnet mask to find the network address, then flips the host bits to find the broadcast address — everything in between is usable.",
  },
  "cidr-calculator": {
    interactive: <CidrCalculatorTool />,
    whatItMeans: "CIDR notation (like /24) is a compact way to write a subnet mask. Both describe exactly the same boundary between network bits and host bits.",
    whyItMatters: "Firewall rules, routing tables, and cloud VPC configuration all use CIDR — being fluent in the conversion saves you from off-by-one errors in production.",
    howItWorks: "A mask is valid only if it's a contiguous run of 1 bits followed by 0 bits. The prefix length is simply a count of those leading 1s.",
  },
  "number-base-converter": {
    interactive: <NumberBaseConverterTool />,
    whatItMeans: "The same value can be written in binary (base 2), decimal (base 10), or hex (base 16) — computers store binary, humans read decimal, and hex is a compact shorthand for binary.",
    whyItMatters: "Subnet masks, MAC addresses, hash digests, and color codes are all commonly expressed in hex or binary — this is the everyday translation layer.",
    howItWorks: "Each base reinterprets the same underlying integer value using a different number of symbols per digit — conversion is just re-expressing that integer.",
  },
  "dns-lookup": {
    interactive: <DnsLookupTool />,
    whatItMeans: "A DNS record maps a domain to something else — an IP address (A/AAAA), a mail server (MX), free-text metadata (TXT), or another name (CNAME).",
    whyItMatters: "Misconfigured DNS is behind a huge share of 'my site is down' and 'my email isn't sending' incidents — and it's usually the very first thing to check.",
    howItWorks: "This queries a public DNS-over-HTTPS resolver (Cloudflare) directly from your browser, avoiding the plaintext DNS queries a normal lookup would make.",
  },
  "hash-generator": {
    interactive: <HashGeneratorTool />,
    whatItMeans: "A hash is a fixed-length fingerprint of data — the same input always produces the same hash, and changing even one byte produces a completely different one.",
    whyItMatters: "Hashes verify file integrity after a download, detect tampering, and are used (properly salted) to store passwords without keeping the plaintext.",
    howItWorks: "MD5 and SHA-family algorithms run a one-way mathematical function over your input. It can't be reversed — you can only compare hashes, never recover the original data from one.",
  },
  "password-strength": {
    interactive: <PasswordStrengthTool />,
    whatItMeans: "Strength here is estimated from length, character variety, and common patterns — not a guarantee against every attack, but a solid proxy for how long brute-forcing would take.",
    whyItMatters: "Most successful password attacks target short, predictable, or previously-breached passwords rather than trying to defeat strong encryption.",
    howItWorks: "The analyzer estimates entropy (bits of randomness) from your character pool and length, then flags patterns — sequences, repeats, dictionary words — that reduce real-world strength below that estimate.",
  },
  "jwt-decoder": {
    interactive: <JwtDecoderTool />,
    whatItMeans: "A JWT has three parts — header, payload, and signature — separated by dots. The header and payload are just Base64-encoded JSON, readable by anyone.",
    whyItMatters: "Because a JWT's contents are visible to anyone who has it, it should never carry secrets — and trusting its claims without verifying the signature is a common security bug.",
    howItWorks: "This decoder Base64URL-decodes the first two segments and parses them as JSON. It never checks the signature, since that requires the issuer's secret or public key.",
  },
  "json-formatter": {
    interactive: <JsonFormatterTool />,
    whatItMeans: "Valid JSON follows strict rules — double-quoted keys, no trailing commas, no comments. Formatting just re-prints valid JSON with consistent indentation.",
    whyItMatters: "A single misplaced comma can break an entire API request — a validator with a precise error location saves a lot of manual scanning.",
    howItWorks: "Your input is parsed with the browser's native JSON parser, then re-serialized either indented (formatted) or compact (minified).",
  },
  "encoding-toolkit": {
    interactive: <EncodingToolkitTool />,
    whatItMeans: "Encoding is not encryption — it's a reversible re-representation of data (Base64, URL-encoding, HTML entities, hex) with no secrecy involved.",
    whyItMatters: "URLs, HTML, and binary-safe transports each have characters they can't represent directly — encoding is how data safely passes through them.",
    howItWorks: "Each scheme maps input bytes or characters to a constrained alphabet (Base64's 64 characters, percent-encoded hex pairs, or named HTML entities) and back.",
  },
  "exif-viewer": {
    interactive: <ExifViewerTool />,
    whatItMeans: "EXIF is metadata embedded inside an image file — camera model, exposure settings, timestamps, and sometimes exact GPS coordinates.",
    whyItMatters: "Photos shared online can unintentionally reveal where and when they were taken — this is a common, often-overlooked privacy leak.",
    howItWorks: "JPEG and some other formats reserve a metadata segment near the start of the file. This tool reads that segment entirely in your browser — the image is never uploaded anywhere.",
  },
  "file-signature-analyzer": {
    interactive: <FileSignatureAnalyzerTool />,
    whatItMeans: "Most file formats begin with a fixed byte sequence — a 'magic number' — that identifies the true format, independent of whatever extension the file happens to have.",
    whyItMatters: "Renaming a malicious executable to look like a harmless image is an old trick — checking the actual signature catches what the extension alone can't.",
    howItWorks: "This reads the first bytes of your file and compares them against a table of known signatures, then compares the result against the file's stated extension.",
  },
  "email-header-analyzer": {
    interactive: <EmailHeaderAnalyzerTool />,
    whatItMeans: "Each mail server a message passes through adds its own Received header at the top — read top to bottom, it's a timestamped route from sender to your inbox.",
    whyItMatters: "SPF, DKIM, and DMARC results tell you whether a message's claimed sender was actually authorized to send it — central to spotting spoofed phishing email.",
    howItWorks: "This parser unfolds the wrapped header lines per the email spec, then extracts the fields and the Authentication-Results your mail server already computed.",
  },
  "http-header-analyzer": {
    interactive: <HttpHeaderAnalyzerTool />,
    whatItMeans: "Response headers describe how a server wants your browser to treat a page — caching rules, content type, and a set of headers specifically about security.",
    whyItMatters: "Missing security headers like Content-Security-Policy or Strict-Transport-Security are some of the most common, and most fixable, weaknesses OWASP scans flag.",
    howItWorks: "Because browsers restrict reading headers from other origins, this request runs on CyberForge's server, not your browser, and returns the results to you.",
  },
};
