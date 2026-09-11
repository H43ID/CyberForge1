export type ToolCategory =
  | "network"
  | "security"
  | "forensics"
  | "osint"
  | "developer";

export type ToolRuntime = "client" | "server";

export type ToolMeta = {
  slug: string;
  title: string;
  shortDescription: string;
  category: ToolCategory;
  runtime: ToolRuntime;
  tags: string[];
  status: "live" | "coming-soon";
};

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  network: "Network",
  security: "Security",
  forensics: "Forensics",
  osint: "OSINT",
  developer: "Developer",
};

export const CATEGORY_DESCRIPTIONS: Record<ToolCategory, string> = {
  network: "Addressing, subnetting, and DNS utilities for engineers and students.",
  security: "Hashing, encoding, and inspection tools that never leave your browser.",
  forensics: "Local file and metadata analysis — nothing you upload is transmitted.",
  osint: "Passive, publicly-available lookups for legitimate investigation.",
  developer: "Everyday utilities for building and debugging, shared with the security toolkit.",
};

export const TOOLS: ToolMeta[] = [
  {
    slug: "subnet-calculator",
    title: "Subnet Calculator",
    shortDescription: "Break down an IPv4 CIDR block into network, broadcast, and usable host ranges.",
    category: "network",
    runtime: "client",
    tags: ["subnet", "cidr", "ipv4", "mask", "networking"],
    status: "live",
  },
  {
    slug: "cidr-calculator",
    title: "CIDR Calculator",
    shortDescription: "Convert between CIDR notation and subnet masks, and see block size at a glance.",
    category: "network",
    runtime: "client",
    tags: ["cidr", "subnet", "mask", "networking"],
    status: "live",
  },
  {
    slug: "number-base-converter",
    title: "Binary / Decimal / Hex Converter",
    shortDescription: "Convert numbers between binary, decimal, and hexadecimal, with per-octet breakdowns.",
    category: "network",
    runtime: "client",
    tags: ["binary", "hex", "decimal", "converter", "octet"],
    status: "live",
  },
  {
    slug: "dns-lookup",
    title: "DNS Lookup",
    shortDescription: "Query A, AAAA, MX, TXT, NS, and CAA records for any domain over DNS-over-HTTPS.",
    category: "network",
    runtime: "client",
    tags: ["dns", "records", "mx", "txt", "propagation"],
    status: "live",
  },
  {
    slug: "hash-generator",
    title: "Hash Generator",
    shortDescription: "Generate MD5, SHA-1, and SHA-2 family hashes for text or files, entirely on-device.",
    category: "security",
    runtime: "client",
    tags: ["hash", "md5", "sha256", "checksum", "file"],
    status: "live",
  },
  {
    slug: "password-strength",
    title: "Password Strength Analyzer",
    shortDescription: "Score a password's strength locally — it is never sent anywhere, ever.",
    category: "security",
    runtime: "client",
    tags: ["password", "strength", "entropy", "security"],
    status: "live",
  },
  {
    slug: "jwt-decoder",
    title: "JWT Decoder",
    shortDescription: "Inspect a JSON Web Token's header and payload claims. Decoding is not verification.",
    category: "security",
    runtime: "client",
    tags: ["jwt", "token", "auth", "claims"],
    status: "live",
  },
  {
    slug: "json-formatter",
    title: "JSON Formatter",
    shortDescription: "Format, validate, and minify JSON with clear syntax error locations.",
    category: "developer",
    runtime: "client",
    tags: ["json", "formatter", "validator", "minify"],
    status: "live",
  },
  {
    slug: "encoding-toolkit",
    title: "Encoding Toolkit",
    shortDescription: "Encode and decode Base64, URL, HTML entity, and hex strings.",
    category: "developer",
    runtime: "client",
    tags: ["base64", "url encode", "html entities", "hex"],
    status: "live",
  },
  {
    slug: "exif-viewer",
    title: "EXIF Viewer",
    shortDescription: "Read camera, lens, timestamp, and GPS metadata embedded in a photo.",
    category: "forensics",
    runtime: "client",
    tags: ["exif", "metadata", "photo", "gps", "camera"],
    status: "live",
  },
  {
    slug: "file-signature-analyzer",
    title: "File Signature Analyzer",
    shortDescription: "Detect a file's real type from its byte signature and flag extension mismatches.",
    category: "forensics",
    runtime: "client",
    tags: ["file signature", "magic bytes", "file type"],
    status: "live",
  },
  {
    slug: "email-header-analyzer",
    title: "Email Header Analyzer",
    shortDescription: "Trace the Received path, and check SPF, DKIM, and DMARC results in a raw header block.",
    category: "forensics",
    runtime: "client",
    tags: ["email", "headers", "spf", "dkim", "dmarc"],
    status: "live",
  },
  {
    slug: "http-header-analyzer",
    title: "HTTP Header Analyzer",
    shortDescription: "Fetch a URL and inspect its response and security headers, plus its security.txt file.",
    category: "osint",
    runtime: "server",
    tags: ["http", "headers", "security.txt", "csp"],
    status: "live",
  },
];

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): ToolMeta[] {
  return TOOLS.filter((t) => t.category === category);
}

export function getRelatedTools(tool: ToolMeta, limit = 3): ToolMeta[] {
  return TOOLS.filter((t) => t.slug !== tool.slug && t.category === tool.category).slice(0, limit);
}
