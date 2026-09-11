# CyberForge

Analyze. Understand. Defend.

A browser-based cybersecurity, networking, and digital-forensics
workspace. **This is the complete build through Phase 3** — foundation,
all 13 core tools, Forge Report, Dashboard, and real downloadable
resources are all in this one project.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

To build for production:

```bash
npm run build
npm run start
```

## What's implemented

### The toolkit (13 tools)

**11 run entirely client-side** — nothing you type or upload leaves your
browser: Subnet Calculator, CIDR Calculator, Number Base Converter, Hash
Generator (MD5 + SHA family, text or file, plus a comparator), Password
Strength Analyzer, JWT Decoder, JSON Formatter, Encoding Toolkit
(Base64/URL/HTML/hex), EXIF Viewer, File Signature Analyzer, Email Header
Analyzer.

**1 queries a public API directly from the browser** — DNS Lookup, over
Cloudflare's DNS-over-HTTPS endpoint (CORS-friendly, no proxy needed).

**1 shared server route powers 2 tools** —
`app/api/proxy/fetch-url/route.ts` does a server-side fetch (with basic
SSRF guarding against localhost/private IPs) so the browser's CORS
restriction on reading cross-origin headers doesn't apply. Powers the
HTTP Header Analyzer (checks 6 real security headers) and the
Security.txt Checker.

Every tool page has real What-it-means / Why-it-matters / How-it-works
content — the educational layer that's the point of CyberForge.

### Forge Report (`/reports`)

Enter a domain and it runs DNS (A/AAAA/MX/TXT/NS), the HTTP header
check, and the security.txt check together, then auto-generates
observations (missing SPF despite having MX records, missing security
headers, etc.). Export as JSON, TXT, or a formatted PDF (via `jsPDF`,
generated entirely client-side), or save it to your browser for later —
see Dashboard.

### Dashboard (`/dashboard`)

Recent tools, favorited tools (star button on every tool page), and
saved Forge Reports — all stored in `localStorage`, no account required,
nothing sent to a server. Per the original brief: don't force
registration unnecessarily.

### Resources (`/resources`)

Four real, downloadable PDF cheat sheets, generated with reportlab and
included in `public/resources/`:

- Subnetting Cheat Sheet
- Common Ports Reference
- HTTP Status Codes Reference
- Incident Response Checklist

The remaining resource categories from the original spec are listed as
"coming soon" — genuinely not built yet, not placeholder-dressed-as-real.

## Visual system

- Color tokens matched exactly to spec: `#080809` base, `#101012`
  secondary, `#151518` surface, `#E83E83` / `#B84D78` / `#D989A8` for the
  three pink tones — see `app/globals.css`
- Photo-first atmospheric eye system, **not** vector icons. Real
  photographic assets drop into `public/eyes/` and render through
  `components/backgrounds/EyeArt.tsx`, which applies the dark/desaturate/
  vignette/grain treatment from the brief. No photo supplied yet, so each
  slot currently renders a visible placeholder glow (not an eye shape) so
  the composition and crop can be reviewed honestly ahead of the real
  art — see "Dropping in real eye photography" below
- Three eye placements only, per spec: hero (right, 45%, never under
  text), a faint band lower on the homepage, a fragment behind Resources
- Homepage follows the definitive hierarchy: hero → six category cards
  → Why CyberForge → featured tools → featured resources → footer

## Dropping in real eye photography

This environment has no photorealistic image generator — only vector/CSS
tools. To get the actual "realistic photographic human eye" look from
the brief, you need a real image file (AI-generated elsewhere, or actual
photography you have rights to):

1. Add the image file to `public/eyes/`, e.g. `public/eyes/hero-eye.jpg`
2. Pass it to the relevant `<EyeArt src="/eyes/hero-eye.jpg" slot="hero" />`
   call in `app/page.tsx` (or `app/resources/page.tsx`)
3. That's it — the dark/blur/grain/vignette treatment and the breathing
   animation are already wired up in `EyeArt.tsx` and apply automatically

## Note on fonts

Fonts are loaded via a `<link>` tag in `app/layout.tsx` rather than
`next/font/google`, because `next/font` fetches font files at **build
time**, and the sandbox this was built in doesn't have outbound access to
`fonts.googleapis.com`. This works identically in a normal environment
with internet access, and has the added benefit of never failing a build
if Google Fonts has a transient outage. If you'd rather self-host the
fonts (recommended for production, avoids a third-party request), swap
this for `next/font/local` with downloaded `.woff2` files.

## What's next

- Real eye photography dropped into the three `EyeArt` slots (see above)
- The remaining resource library categories (currently "coming soon")
- WHOIS, IP geolocation/ASN, SSL/TLS certificate inspector, ping/
  traceroute — all deferred since they need paid API keys or
  capabilities a browser sandbox can't provide
- Accounts/sync, if you ever want Dashboard data to follow a person
  across devices instead of staying local to one browser

## Folder structure

```
app/
  page.tsx                Homepage
  tools/[slug]/            Dynamic tool pages
  network|security|forensics|osint/   Category pages
  reports/                 Forge Report
  dashboard/                Dashboard
  resources/                Resource library
  api/proxy/fetch-url/      Server route for HTTP Header Analyzer + security.txt
components/
  layout/                   Nav, Footer, SearchBar
  ui/                       Badge, Card, Button, TextInput, TextArea,
                            ResultRow, FileDrop, CategoryIcon
  backgrounds/              EyeArt (photo-first atmospheric eye system)
  tool-shell/                ToolPageShell, CategoryPage, RecentToolTracker,
                            FavoriteButton
lib/
  tools/registry.ts          Central tool manifest
  tools/toolPageContent.tsx  Maps each slug to its component + explanations
  tools/<slug>/logic.ts      Pure, testable logic per tool
  tools/<slug>/Component.tsx Interactive UI per tool
  reports/logic.ts           Forge Report generation (reuses tool logic)
  reports/export.ts          JSON/TXT/PDF export
  storage/local.ts           localStorage helpers (recent, favorites, reports)
  search/searchTools.ts      Fuzzy search over the registry
public/
  resources/                 The 4 real downloadable PDF cheat sheets
  eyes/                      Drop real eye photography here (see above)
```
