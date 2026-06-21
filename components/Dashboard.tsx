"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  Globe,
  Lock,
  MoreVertical,
  Search,
  Share2,
  Trash2,
  User,
  Video,
} from "lucide-react";
import { useShell } from "@/components/shell-context";
import { formatDuration, type Recording } from "@/lib/types";

interface DashboardProps {
  recordings: Recording[];
}

type Filter = "all" | "private" | "shared";

export default function Dashboard({ recordings }: DashboardProps) {
  const router = useRouter();
  const { openCapture, openShare } = useShell();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const filtered = recordings.filter((rec) => {
    const haystack = `${rec.title} ${rec.description ?? ""}`.toLowerCase();
    const matchesSearch = haystack.includes(searchQuery.toLowerCase());
    if (activeFilter === "private") return matchesSearch && rec.visibility === "private";
    if (activeFilter === "shared") return matchesSearch && rec.visibility !== "private";
    return matchesSearch;
  });

  const openPlayback = (rec: Recording) => router.push(`/playback/${rec.id}`);

  return (
    <div className="mx-auto w-full max-w-container p-4 pb-24 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Recent recordings</h1>
          <p className="text-sm text-fg-secondary">
            View and manage your logged walkthroughs.
          </p>
        </div>

        <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
          <div className="relative w-full flex-grow md:w-64 md:flex-grow-0">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-tertiary" />
            <input
              type="text"
              placeholder="Search recordings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded border border-border bg-surface-2 py-1.5 pl-9 pr-3 text-sm text-fg-primary outline-none placeholder:text-fg-tertiary focus:border-border-active"
            />
          </div>

          <div className="flex rounded border border-border bg-surface-2 p-1">
            {(["all", "private", "shared"] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveFilter(key)}
                className={`select-none rounded px-3 py-1 text-xs capitalize ${
                  activeFilter === key
                    ? "bg-surface-1 font-medium text-accent shadow-card"
                    : "text-fg-secondary"
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid / empty state */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((rec) => (
            <article
              key={rec.id}
              className="group relative flex select-none flex-col overflow-hidden rounded border border-border bg-surface-1 shadow-card transition-colors hover:border-border-active"
            >
              {/* Thumbnail (real media arrives with the upload pipeline) */}
              <button
                type="button"
                onClick={() => openPlayback(rec)}
                className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-surface-2"
              >
                {rec.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={rec.thumbnailUrl}
                    alt={rec.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <Video className="h-8 w-8 text-fg-tertiary" />
                )}

                {/* Play affordance */}
                <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="flex h-12 w-12 scale-90 items-center justify-center rounded-full bg-accent text-on-accent shadow-card transition-transform group-hover:scale-100">
                    <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>

                {/* Status badges */}
                <span className="absolute left-2 top-2 flex gap-2">
                  {rec.status === "processing" && (
                    <span className="rounded-sm bg-black/70 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-caps text-accent-lime">
                      Processing
                    </span>
                  )}
                </span>

                {/* Duration */}
                <span className="absolute bottom-2.5 right-2.5 rounded-sm bg-black/70 px-1.5 py-0.5 font-mono text-xs tabular-nums text-white">
                  {formatDuration(rec.durationSeconds)}
                </span>
              </button>

              {/* Info */}
              <div className="relative flex flex-grow flex-col p-4">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <h3
                    onClick={() => openPlayback(rec)}
                    className="cursor-pointer truncate text-sm font-semibold leading-snug transition-colors hover:text-accent"
                  >
                    {rec.title}
                  </h3>

                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => setMenuOpenId(menuOpenId === rec.id ? null : rec.id)}
                      aria-label="Recording options"
                      className="rounded-full p-1 text-fg-tertiary hover:bg-surface-2 hover:text-fg-primary"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {menuOpenId === rec.id && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setMenuOpenId(null)} />
                        <div className="absolute right-0 z-40 mt-1 w-36 rounded border border-border bg-surface-1 py-1 text-xs shadow-card">
                          <button
                            type="button"
                            onClick={() => {
                              openShare(rec);
                              setMenuOpenId(null);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-fg-primary hover:bg-surface-2"
                          >
                            <Share2 className="h-3.5 w-3.5" />
                            Share link
                          </button>
                          <button
                            type="button"
                            onClick={() => setMenuOpenId(null)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left font-medium text-error hover:bg-error-container"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {rec.description && (
                  <p className="mb-4 line-clamp-2 text-xs text-fg-secondary">{rec.description}</p>
                )}

                <div className="mt-auto flex items-center justify-between border-t border-border pt-2 text-[11px] text-fg-tertiary">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-2">
                      <User className="h-3 w-3" />
                    </span>
                    <span className="truncate font-medium">{rec.authorName ?? "Unknown"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>{rec.createdAt}</span>
                    {rec.visibility === "private" ? (
                      <Lock className="h-3 w-3" />
                    ) : (
                      <Globe className="h-3 w-3 text-accent" />
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          hasSearch={searchQuery.length > 0}
          query={searchQuery}
          onClear={() => {
            setSearchQuery("");
            setActiveFilter("all");
          }}
          onStart={openCapture}
        />
      )}

      {/* Desktop record FAB */}
      <button
        type="button"
        onClick={openCapture}
        className="fixed bottom-8 right-8 z-40 hidden select-none items-center gap-3 rounded-full bg-accent px-6 py-4 text-sm font-bold tracking-caps text-on-accent shadow-card transition-transform hover:scale-105 active:scale-95 md:flex"
      >
        <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-accent-lime" />
        NEW RECORD
      </button>
    </div>
  );
}

function EmptyState({
  hasSearch,
  query,
  onClear,
  onStart,
}: {
  hasSearch: boolean;
  query: string;
  onClear: () => void;
  onStart: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-surface-1 shadow-card">
        <Video className="h-7 w-7 text-accent" />
      </div>
      <h2 className="mb-2 text-xl font-semibold">
        {hasSearch ? "No matching recordings" : "No recordings yet"}
      </h2>
      <p className="mb-6 text-sm text-fg-secondary">
        {hasSearch
          ? `We couldn't find anything matching "${query}".`
          : "Record your first walkthrough to get started."}
      </p>
      {hasSearch ? (
        <button
          type="button"
          onClick={onClear}
          className="select-none rounded border border-border px-4 py-2 text-xs text-fg-primary hover:bg-surface-2"
        >
          Clear search
        </button>
      ) : (
        <button
          type="button"
          onClick={onStart}
          className="flex select-none items-center gap-2 rounded bg-accent px-6 py-3 text-sm font-semibold text-on-accent shadow-card transition-transform hover:opacity-90 active:scale-95"
        >
          <Video className="h-4 w-4 fill-current" />
          Start your first recording
        </button>
      )}
    </div>
  );
}
