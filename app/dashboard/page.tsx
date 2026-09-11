"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getFavoriteTools, getRecentTools, getSavedReports, deleteReport } from "@/lib/storage/local";
import { getToolBySlug, TOOLS } from "@/lib/tools/registry";
import type { ForgeReport } from "@/lib/reports/logic";
import { reportToJSON, downloadText } from "@/lib/reports/export";

const POPULAR_SLUGS = ["subnet-calculator", "hash-generator", "dns-lookup", "jwt-decoder"];

export default function DashboardPage() {
  const [recent, setRecent] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [reports, setReports] = useState<ForgeReport[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setRecent(getRecentTools());
    setFavorites(getFavoriteTools());
    setReports(getSavedReports());
    setReady(true);
  }, []);

  function handleDeleteReport(id: string) {
    deleteReport(id);
    setReports(getSavedReports());
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-smoke-dim">dashboard</p>
      <h1 className="mt-3 font-display text-4xl">Your workspace</h1>
      <p className="mt-3 max-w-xl text-smoke">
        Everything here is stored in your browser only — recent tools, favorites, and saved
        reports. No account, nothing uploaded.
      </p>

      {ready && recent.length === 0 && favorites.length === 0 && reports.length === 0 && (
        <Card className="mt-8">
          <p className="text-sm text-smoke">
            Nothing tracked yet — visit a tool or run a{" "}
            <Link href="/reports" className="text-dusty-rose hover:text-signal-magenta">
              Forge Report
            </Link>{" "}
            to see it show up here.
          </p>
        </Card>
      )}

      {recent.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 font-display text-xl">Recent tools</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((slug) => {
              const tool = getToolBySlug(slug);
              if (!tool) return null;
              return (
                <Link key={slug} href={`/tools/${slug}`}>
                  <Card hover>
                    <p className="text-sm text-bone">{tool.title}</p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {favorites.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 font-display text-xl">Favorites</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {favorites.map((slug) => {
              const tool = getToolBySlug(slug);
              if (!tool) return null;
              return (
                <Link key={slug} href={`/tools/${slug}`}>
                  <Card hover>
                    <p className="text-sm text-bone">{tool.title}</p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {reports.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 font-display text-xl">Saved reports</h2>
          <div className="space-y-3">
            {reports.map((r) => (
              <Card key={r.id} className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-bone">{r.target}</p>
                  <p className="text-xs text-smoke-dim">{new Date(r.generatedAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadText(reportToJSON(r), `cyberforge-report-${r.target}.json`, "application/json")}
                    className="rounded-md border border-charcoal-border px-3 py-1.5 text-xs text-bone hover:border-dusty-rose/50"
                  >
                    Export JSON
                  </button>
                  <button
                    onClick={() => handleDeleteReport(r.id)}
                    className="rounded-md border border-charcoal-border px-3 py-1.5 text-xs text-smoke hover:border-signal-magenta/50 hover:text-signal-magenta"
                  >
                    Delete
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-xl">Popular tools</h2>
          <Link href="/tools" className="text-sm text-dusty-rose hover:text-signal-magenta">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {POPULAR_SLUGS.map((slug) => {
            const tool = TOOLS.find((t) => t.slug === slug);
            if (!tool) return null;
            return (
              <Link key={slug} href={`/tools/${slug}`}>
                <Card hover>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-bone">{tool.title}</p>
                    <Badge tone={tool.runtime === "server" ? "magenta" : "default"}>
                      {tool.runtime === "server" ? "live" : "local"}
                    </Badge>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-xl">Resource downloads</h2>
          <Link href="/resources" className="text-sm text-dusty-rose hover:text-signal-magenta">
            View library →
          </Link>
        </div>
        <p className="text-sm text-smoke">
          Cheat sheets and checklists live in the{" "}
          <Link href="/resources" className="text-dusty-rose hover:text-signal-magenta">
            resource library
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
