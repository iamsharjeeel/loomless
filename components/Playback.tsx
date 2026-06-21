"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Maximize2,
  Pause,
  Play,
  Sparkles,
  Video,
  Volume2,
} from "lucide-react";
import { useShell } from "@/components/shell-context";
import { formatDuration, type Recording } from "@/lib/types";

interface PlaybackProps {
  recording: Recording | null;
  recordingId: string;
}

export default function Playback({ recording, recordingId }: PlaybackProps) {
  const router = useRouter();
  const { openShare } = useShell();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);

  const title = recording?.title ?? "Untitled recording";
  const duration = formatDuration(recording?.durationSeconds);

  return (
    <div className="mx-auto w-full max-w-container p-4 pb-24 md:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex select-none items-center gap-2 text-xs font-bold text-fg-secondary hover:text-fg-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to recordings
        </button>

        <button
          type="button"
          onClick={() => recording && openShare(recording)}
          disabled={!recording}
          className="select-none rounded border border-border bg-surface-1 px-4 py-1.5 text-xs font-bold text-fg-primary shadow-card hover:bg-surface-2 disabled:opacity-50"
        >
          Share
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Player column */}
        <div className="space-y-6 lg:col-span-2">
          <div className="overflow-hidden rounded border border-border bg-surface-1 shadow-card">
            {/* Video stage (real media arrives with the upload pipeline) */}
            <div className="relative flex aspect-video items-center justify-center bg-black">
              {recording?.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={recording.thumbnailUrl}
                  alt={title}
                  className="h-full w-full object-cover opacity-85"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-white/50">
                  <Video className="h-10 w-10" />
                  <span className="text-sm">Video preview</span>
                </div>
              )}

              {!isPlaying && (
                <button
                  type="button"
                  onClick={() => setIsPlaying(true)}
                  aria-label="Play"
                  className="absolute flex h-16 w-16 items-center justify-center rounded-full bg-accent text-on-accent shadow-card transition-transform hover:scale-110"
                >
                  <Play className="h-8 w-8 translate-x-0.5 fill-current" />
                </button>
              )}
            </div>

            {/* Control tray */}
            <div className="border-t border-border bg-surface-2 p-4">
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                aria-label="Seek"
                className="mb-4 h-1.5 w-full cursor-pointer rounded bg-surface-1 accent-accent"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setIsPlaying((v) => !v)}
                    className="p-1.5 text-fg-primary hover:text-accent"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5 fill-current" />
                    ) : (
                      <Play className="h-5 w-5 fill-current" />
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-fg-secondary" />
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      aria-label="Volume"
                      className="h-1 w-16 cursor-pointer rounded bg-surface-1 accent-accent"
                    />
                  </div>

                  <div className="font-mono text-xs tabular-nums text-fg-secondary">
                    <span>00:00</span>
                    <span className="opacity-50"> / {duration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-sm border border-border bg-surface-1 px-1.5 py-0.5 font-mono text-[10px] font-bold text-accent">
                    1.0x
                  </span>
                  <button type="button" aria-label="Fullscreen" className="text-fg-secondary hover:text-fg-primary">
                    <Maximize2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Overview */}
          <div className="space-y-2">
            <h1 className="text-xl font-bold leading-tight md:text-2xl">{title}</h1>
            <div className="flex items-center gap-3 text-xs text-fg-secondary">
              <span className="font-medium">{recording?.createdAt ?? "—"}</span>
            </div>
            {recording?.description && (
              <p className="pt-2 text-sm leading-relaxed text-fg-secondary">
                {recording.description}
              </p>
            )}
          </div>
        </div>

        {/* Transcript panel */}
        <div className="flex h-full flex-col overflow-hidden rounded border border-border bg-surface-1 shadow-card lg:col-span-1">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-xs font-bold uppercase tracking-caps text-fg-primary">
              Transcript
            </span>
            <span className="rounded-sm bg-surface-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-caps text-fg-tertiary">
              Pending
            </span>
          </div>

          {/* Phase 1: no transcript yet (AssemblyAI lands in Phase 2). */}
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-2">
              <FileText className="h-5 w-5 text-fg-tertiary" />
            </div>
            <div>
              <h4 className="text-xs font-bold">Transcript not available yet</h4>
              <p className="mx-auto mt-1 max-w-xs text-[11px] text-fg-secondary">
                Once processing completes, a timestamped, speaker-labeled transcript will appear
                here.
              </p>
            </div>
          </div>

          {/* SOP affordance — generation lands in a later phase. */}
          <div className="border-t border-border p-4">
            <button
              type="button"
              disabled
              title="Available in a later phase"
              className="flex w-full select-none items-center justify-center gap-2 rounded bg-surface-2 py-2.5 text-xs font-bold text-fg-tertiary"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Generate SOP from transcript
            </button>
          </div>
        </div>
      </div>

      {!recording && (
        <p className="mt-6 text-center text-xs text-fg-tertiary">
          Recording <span className="font-mono">{recordingId}</span> isn&apos;t available yet.
        </p>
      )}
    </div>
  );
}
