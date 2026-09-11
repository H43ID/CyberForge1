import type { ForgeReport } from "@/lib/reports/logic";

const KEYS = {
  recent: "cf_recent_tools",
  favorites: "cf_favorite_tools",
  reports: "cf_saved_reports",
} as const;

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable (private browsing, quota) — fail silently, it's not critical
  }
}

// ---- Recent tools ----

export function trackRecentTool(slug: string, limit = 8) {
  const current = readJSON<string[]>(KEYS.recent, []);
  const next = [slug, ...current.filter((s) => s !== slug)].slice(0, limit);
  writeJSON(KEYS.recent, next);
}

export function getRecentTools(): string[] {
  return readJSON<string[]>(KEYS.recent, []);
}

// ---- Favorites ----

export function getFavoriteTools(): string[] {
  return readJSON<string[]>(KEYS.favorites, []);
}

export function toggleFavoriteTool(slug: string): string[] {
  const current = readJSON<string[]>(KEYS.favorites, []);
  const next = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug];
  writeJSON(KEYS.favorites, next);
  return next;
}

// ---- Saved reports ----

export function getSavedReports(): ForgeReport[] {
  return readJSON<ForgeReport[]>(KEYS.reports, []);
}

export function saveReport(report: ForgeReport, limit = 20) {
  const current = readJSON<ForgeReport[]>(KEYS.reports, []);
  const next = [report, ...current.filter((r) => r.id !== report.id)].slice(0, limit);
  writeJSON(KEYS.reports, next);
}

export function deleteReport(id: string) {
  const current = readJSON<ForgeReport[]>(KEYS.reports, []);
  writeJSON(KEYS.reports, current.filter((r) => r.id !== id));
}
