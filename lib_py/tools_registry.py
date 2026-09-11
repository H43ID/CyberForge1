"""
CyberForge Tool Registry and Educational Metadata
"""

from typing import Dict, List, Any

CATEGORIES = {
    "network": {
        "label": "Network",
        "icon": "🌐",
        "description": "Addressing, subnetting, and DNS utilities for engineers and students.",
    },
    "security": {
        "label": "Security",
        "icon": "🔒",
        "description": "Hashing, encoding, and inspection tools that never leave your browser.",
    },
    "forensics": {
        "label": "Forensics",
        "icon": "🔍",
        "description": "Local file and metadata analysis — nothing you upload is transmitted.",
    },
    "osint": {
        "label": "OSINT",
        "icon": "📡",
        "description": "Passive, publicly-available lookups for legitimate investigation.",
    },
    "developer": {
        "label": "Developer",
        "icon": "⚙️",
        "description": "Everyday utilities for building and debugging, shared with the security toolkit.",
    },
}

TOOLS: List[Dict[str, Any]] = [
    {
        "slug": "subnet-calculator",
        "title": "Subnet Calculator",
        "shortDescription": "Break down an IPv4 CIDR block into network, broadcast, and usable host ranges.",
        "category": "network",
        "tags": ["subnet", "cidr", "ipv4", "mask", "networking"],
        "whatItMeans": "A /24 means the first 24 bits identify the network and the remaining 8 bits identify hosts — so a /24 always has 256 total addresses, with 254 usable after the network and broadcast addresses are reserved.",
        "whyItMatters": "Getting subnet boundaries wrong is one of the most common networking mistakes — it causes devices to be unreachable or address ranges to overlap.",
        "howItWorks": "The calculator ANDs your IP with the subnet mask to find the network address, then flips the host bits to find the broadcast address — everything in between is usable.",
    },
    {
        "slug": "cidr-calculator",
        "title": "CIDR Calculator",
        "shortDescription": "Convert between CIDR notation and subnet masks, and see block size at a glance.",
        "category": "network",
        "tags": ["cidr", "subnet", "mask", "networking"],
        "whatItMeans": "CIDR notation (like /24) is a compact way to write a subnet mask. Both describe exactly the same boundary between network bits and host bits.",
        "whyItMatters": "Firewall rules, routing tables, and cloud VPC configuration all use CIDR — being fluent in the conversion saves you from off-by-one errors in production.",
        "howItWorks": "A mask is valid only if it's a contiguous run of 1 bits followed by 0 bits. The prefix length is simply a count of those leading 1s.",
    },
    {
        "slug": "number-base-converter",
        "title": "Binary / Decimal / Hex Converter",
        "shortDescription": "Convert numbers between binary, decimal, and hexadecimal, with per-octet breakdowns.",
        "category": "network",
        "tags": ["binary", "hex", "decimal", "converter", "octet"],
        "whatItMeans": "The same value can be written in binary (base 2), decimal (base 10), or hex (base 16) — computers store binary, humans read decimal, and hex is a compact shorthand for binary.",
        "whyItMatters": "Subnet masks, MAC addresses, hash digests, and color codes are all commonly expressed in hex or binary — this is the everyday translation layer.",
        "howItWorks": "Each base reinterprets the same underlying integer value using a different number of symbols per digit — conversion is just re-expressing that integer.",
    },
    {
        "slug": "dns-lookup",
        "title": "DNS Lookup",
        "shortDescription": "Query A, AAAA, MX, TXT, NS, and CAA records for any domain over DNS-over-HTTPS.",
        "category": "network",
        "tags": ["dns", "records", "mx", "txt", "propagation"],
        "whatItMeans": "A DNS record maps a domain to something else — an IP address (A/AAAA), a mail server (MX), free-text metadata (TXT), or another name (CNAME).",
        "whyItMatters": "Misconfigured DNS is behind a huge share of 'my site is down' and 'my email isn't sending' incidents — and it's usually the very first thing to check.",
        "howItWorks": "This queries a public DNS-over-HTTPS resolver (Cloudflare/Google) directly, avoiding plaintext DNS queries.",
    },
    {
        "slug": "hash-generator",
        "title": "Hash Generator",
        "shortDescription": "Generate MD5, SHA-1, and SHA-2 family hashes for text or files, entirely on-device.",
        "category": "security",
        "tags": ["hash", "md5", "sha256", "checksum", "file"],
        "whatItMeans": "A hash is a fixed-length fingerprint of data — the same input always produces the same hash, and changing even one byte produces a completely different one.",
        "whyItMatters": "Hashes verify file integrity after a download, detect tampering, and are used (properly salted) to store passwords without keeping the plaintext.",
        "howItWorks": "MD5 and SHA-family algorithms run a one-way mathematical function over your input. It can't be reversed — you can only compare hashes, never recover the original data from one.",
    },
    {
        "slug": "password-strength",
        "title": "Password Strength Analyzer",
        "shortDescription": "Score a password's strength locally — it is never sent anywhere, ever.",
        "category": "security",
        "tags": ["password", "strength", "entropy", "security"],
        "whatItMeans": "Strength here is estimated from length, character variety, and common patterns — not a guarantee against every attack, but a solid proxy for how long brute-forcing would take.",
        "whyItMatters": "Most successful password attacks target short, predictable, or previously-breached passwords rather than trying to defeat strong encryption.",
        "howItWorks": "The analyzer estimates entropy (bits of randomness) from your character pool and length, then flags patterns — sequences, repeats, dictionary words — that reduce real-world strength below that estimate.",
    },
    {
        "slug": "jwt-decoder",
        "title": "JWT Decoder",
        "shortDescription": "Inspect a JSON Web Token's header and payload claims. Decoding is not verification.",
        "category": "security",
        "tags": ["jwt", "token", "auth", "claims"],
        "whatItMeans": "A JWT has three parts — header, payload, and signature — separated by dots. The header and payload are just Base64-encoded JSON, readable by anyone.",
        "whyItMatters": "Because a JWT's contents are visible to anyone who has it, it should never carry secrets — and trusting its claims without verifying the signature is a common security bug.",
        "howItWorks": "This decoder Base64URL-decodes the first two segments and parses them as JSON. It never checks the signature, since that requires the issuer's secret or public key.",
    },
    {
        "slug": "json-formatter",
        "title": "JSON Formatter & Validator",
        "shortDescription": "Format, validate, and minify JSON with clear syntax error locations.",
        "category": "developer",
        "tags": ["json", "formatter", "validator", "minify"],
        "whatItMeans": "Valid JSON follows strict rules — double-quoted keys, no trailing commas, no comments. Formatting just re-prints valid JSON with consistent indentation.",
        "whyItMatters": "A single misplaced comma can break an entire API request — a validator with a precise error location saves a lot of manual scanning.",
        "howItWorks": "Your input is parsed with Python's standard JSON parser, then re-serialized either indented (formatted) or compact (minified).",
    },
    {
        "slug": "encoding-toolkit",
        "title": "Encoding Toolkit",
        "shortDescription": "Encode and decode Base64, URL, HTML entity, and hex strings.",
        "category": "developer",
        "tags": ["base64", "url encode", "html entities", "hex"],
        "whatItMeans": "Encoding is not encryption — it's a reversible re-representation of data (Base64, URL-encoding, HTML entities, hex) with no secrecy involved.",
        "whyItMatters": "URLs, HTML, and binary-safe transports each have characters they can't represent directly — encoding is how data safely passes through them.",
        "howItWorks": "Each scheme maps input bytes or characters to a constrained alphabet (Base64's 64 characters, percent-encoded hex pairs, or named HTML entities) and back.",
    },
    {
        "slug": "exif-viewer",
        "title": "EXIF Viewer",
        "shortDescription": "Read camera, lens, timestamp, and GPS metadata embedded in a photo.",
        "category": "forensics",
        "tags": ["exif", "metadata", "photo", "gps", "camera"],
        "whatItMeans": "EXIF is metadata embedded inside an image file — camera model, exposure settings, timestamps, and sometimes exact GPS coordinates.",
        "whyItMatters": "Photos shared online can unintentionally reveal where and when they were taken — this is a common, often-overlooked privacy leak.",
        "howItWorks": "JPEG and TIFF formats reserve a metadata segment near the start of the file. This tool reads that segment securely — the image is never uploaded to any third party.",
    },
    {
        "slug": "file-signature-analyzer",
        "title": "File Signature Analyzer",
        "shortDescription": "Detect a file's real type from its byte signature and flag extension mismatches.",
        "category": "forensics",
        "tags": ["file signature", "magic bytes", "file type"],
        "whatItMeans": "Most file formats begin with a fixed byte sequence — a 'magic number' — that identifies the true format, independent of whatever extension the file happens to have.",
        "whyItMatters": "Renaming a malicious executable to look like a harmless image is an old trick — checking the actual signature catches what the extension alone can't.",
        "howItWorks": "This reads the first bytes of your file and compares them against a table of known signatures, then compares the result against the file's stated extension.",
    },
    {
        "slug": "email-header-analyzer",
        "title": "Email Header Analyzer",
        "shortDescription": "Trace the Received path, and check SPF, DKIM, and DMARC results in a raw header block.",
        "category": "forensics",
        "tags": ["email", "headers", "spf", "dkim", "dmarc"],
        "whatItMeans": "Each mail server a message passes through adds its own Received header at the top — read top to bottom, it's a timestamped route from sender to your inbox.",
        "whyItMatters": "SPF, DKIM, and DMARC results tell you whether a message's claimed sender was actually authorized to send it — central to spotting spoofed phishing email.",
        "howItWorks": "This parser unfolds the wrapped header lines per RFC 5322, then extracts the fields and the Authentication-Results computed by mail servers.",
    },
    {
        "slug": "http-header-analyzer",
        "title": "HTTP Header Analyzer",
        "shortDescription": "Fetch a URL and inspect its response and security headers, plus its security.txt file.",
        "category": "osint",
        "tags": ["http", "headers", "security.txt", "csp"],
        "whatItMeans": "Response headers describe how a server wants your browser to treat a page — caching rules, content type, and a set of headers specifically about security.",
        "whyItMatters": "Missing security headers like Content-Security-Policy or Strict-Transport-Security are some of the most common, and most fixable, weaknesses OWASP scans flag.",
        "howItWorks": "This request runs with built-in SSRF protection against private IP spaces, inspecting response headers and security.txt standards.",
    },
]

def get_tool(slug: str) -> Dict[str, Any]:
    for t in TOOLS:
        if t["slug"] == slug:
            return t
    return {}

def search_tools(query: str, category: str = "all") -> List[Dict[str, Any]]:
    q = query.lower().strip()
    results = []
    for t in TOOLS:
        if category != "all" and t["category"] != category:
            continue
        if not q:
            results.append(t)
            continue
        if (
            q in t["title"].lower()
            or q in t["shortDescription"].lower()
            or any(q in tag for tag in t["tags"])
        ):
            results.append(t)
    return results
