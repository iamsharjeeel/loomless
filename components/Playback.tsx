"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  FileText,
  Loader2,
  Pencil,
  Sparkles,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { useShell } from "@/components/shell-context";
import { createClient } from "@/lib/supabase/client";
import { formatDuration, type Recording } from "@/lib/types";

interface PlaybackProps {
  recording: Recording | null;
  recordingId: string;
  videoUrl: string | null;
}

export default function Playback({ recording, recordingId, videoUrl }: PlaybackProps) {
  const router = useRouter();
  const { openShare } = useShell();
  const [title, setTitle] = useState(recording?.title ?? "Untitled recording");
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const [deleting, setDeleting] = useState(false);

  const duration = formatDuration(recording?.durationSeconds);
  const isProcessing = recording?.status === "processing" || recording?.status === "recording";
  const isFailed = recording?.status === "failed";

  const saveTitle = async () => {
    const next = editValue.trim();
    setEditing(false);
    if (!next || !recording || next === title) return;
    setTitle(next);
    const supabase = createClient();
    const { error } = await supabase.from("recordings").update({ title: next }).eq("id", recording.id);
    if (!error) router.refresh();
  };

  const handleDelete = async () => {
    if (!recording) return;
    setDeleting(true);
    const res = await fetch(`/api/recordings/${recording.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setDeleting(false);
    }
  };

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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => recording && openShare(recording)}
            disabled={!recording}
            className="select-none rounded border border-border bg-surface-1 px-4 py-1.5 text-xs font-bold text-fg-primary shadow-card hover:bg-surface-2 disabled:opacity-50"
          >
            Share
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={!recording || deleting}
            className="flex select-none items-center gap-1.5 rounded border border-border bg-surface-1 px-4 py-1.5 text-xs font-bold text-error shadow-card hover:bg-error-container disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Player column */}
        <div className="space-y-6 lg:col-span-2">
          <div className="overflow-hidden rounded border border-border bg-surface-1 shadow-card">
            <div className="relative flex aspect-video items-center justify-center bg-black">
              {videoUrl ? (
                <video src={videoUrl} controls className="h-full w-full" />
              ) : (
                <div className="flex flex-col items-center gap-3 text-white/50">
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-10 w-10 animate-spin" />
                      <span className="text-sm">Processing recording…</span>
                    </>
                  ) : isFailed ? (
                    <>
                      <X className="h-10 w-10" />
                      <span className="text-sm">Recording failed to upload</span>
                    </>
                  ) : (
                    <>
                      <Video className="h-10 w-10" />
                      <span className="text-sm">Video unavailable</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Overview */}
          <div className="space-y-2">
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveTitle();
                    if (e.key === "Escape") setEditing(false);
                  }}
                  className="w-full rounded border border-border bg-surface-2 px-3 py-1.5 text-xl font-bold outline-none focus:border-border-active"
                />
                <button type="button" onClick={saveTitle} aria-label="Save" className="rounded p-1.5 text-accent hover:bg-surface-2">
                  <Check className="h-5 w-5" />
                </button>
                <button type="button" onClick={() => setEditing(false)} aria-label="Cancel" className="rounded p-1.5 text-fg-tertiary hover:bg-surface-2">
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold leading-tight md:text-2xl">{title}</h1>
                {recording && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditValue(title);
                      setEditing(true);
                    }}
                    aria-label="Rename"
                    className="rounded p-1.5 text-fg-tertiary hover:bg-surface-2 hover:text-fg-primary"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
            <div className="flex items-center gap-3 text-xs text-fg-secondary">
              <span className="font-medium">{recording?.createdAt ?? "—"}</span>
              <span>•</span>
              <span className="font-mono tabular-nums">{duration}</span>
            </div>
            {recording?.description && (
              <p className="pt-2 text-sm leading-relaxed text-fg-secondary">{recording.description}</p>
            )}
          </div>
        </div>

        {/* Transcript panel — Phase 1 pending state (transcription is Phase 2). */}
        <div className="flex h-full flex-col overflow-hidden rounded border border-border bg-surface-1 shadow-card lg:col-span-1">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-xs font-bold uppercase tracking-caps text-fg-primary">Transcript</span>
            <span className="rounded-sm bg-surface-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-caps text-fg-tertiary">
              Pending
            </span>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-2">
              <FileText className="h-5 w-5 text-fg-tertiary" />
            </div>
            <div>
              <h4 className="text-xs font-bold">Transcript not available yet</h4>
              <p className="mx-auto mt-1 max-w-xs text-[11px] text-fg-secondary">
                Once transcription is enabled, a timestamped, speaker-labeled transcript will appear
                here.
              </p>
            </div>
          </div>

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
          Recording <span className="font-mono">{recordingId}</span> isn&apos;t available.
        </p>
      )}
    </div>
  );
}
