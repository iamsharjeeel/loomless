"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Camera, Check, Layers, Mic, Monitor, Play, X } from "lucide-react";
import type { CaptureConfig } from "@/lib/types";

interface CaptureSetupProps {
  onStartCapture: (config: CaptureConfig, stream: MediaStream) => void;
  onClose: () => void;
}

/**
 * Acquires a screen-capture stream (plus optional mic) within the click gesture
 * so the browser permission prompt is tied to user activation. Mic audio is
 * mixed into the display stream when requested.
 */
async function acquireStream(config: CaptureConfig): Promise<MediaStream> {
  const display = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true,
  });

  if (config.audio) {
    try {
      const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
      mic.getAudioTracks().forEach((track) => display.addTrack(track));
    } catch {
      // Mic denied — continue with whatever audio the display capture provided.
    }
  }

  return display;
}

const SOURCES = [
  { key: "screen", label: "Desktop", icon: Monitor },
  { key: "camera", label: "Camera", icon: Camera },
  { key: "pip", label: "Desktop + PIP", icon: Layers },
] as const;

export default function CaptureSetup({ onStartCapture, onClose }: CaptureSetupProps) {
  const [source, setSource] = useState<CaptureConfig["source"]>("pip");
  const [quality, setQuality] = useState("1080p HD (60fps)");
  const [micActive, setMicActive] = useState(true);
  const [title, setTitle] = useState("");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [acquiring, setAcquiring] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const config: CaptureConfig = {
    source,
    quality,
    audio: micActive,
    title: title.trim() || `Walkthrough — ${new Date().toLocaleString()}`,
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPermissionError(null);
    setAcquiring(true);
    try {
      // Acquire within the gesture so permission prompts have user activation.
      streamRef.current = await acquireStream(config);
      setAcquiring(false);
      setCountdown(3);
    } catch {
      setAcquiring(false);
      setPermissionError("Screen capture was cancelled or blocked. Please try again.");
    }
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      if (streamRef.current) onStartCapture(config, streamRef.current);
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg select-none overflow-hidden rounded border border-border bg-surface-1 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-surface-2 p-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-accent-lime" />
            <h2 className="text-sm font-bold uppercase tracking-tight">Configure capture</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-fg-tertiary hover:text-error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {countdown === null ? (
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-caps text-fg-secondary">
                Recording title
              </label>
              <input
                type="text"
                placeholder="e.g. Onboarding walkthrough"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-border-active"
              />
            </div>

            {/* Source */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-caps text-fg-secondary">
                Capture source
              </label>
              <div className="grid grid-cols-3 gap-3">
                {SOURCES.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSource(key)}
                    className={`flex flex-col items-center justify-center gap-2 rounded border p-3 text-center transition-colors ${
                      source === key
                        ? "border-accent bg-accent text-on-accent"
                        : "border-border bg-surface-2 text-fg-secondary hover:border-border-active"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-[10px] font-semibold">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quality + audio */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-caps text-fg-secondary">
                  Quality
                </label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full rounded border border-border bg-surface-2 px-3 py-1.5 text-xs outline-none focus:border-border-active"
                >
                  <option>4K Ultra (60fps)</option>
                  <option>1080p HD (60fps)</option>
                  <option>720p (30fps)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-caps text-fg-secondary">
                  Microphone
                </label>
                <button
                  type="button"
                  onClick={() => setMicActive((v) => !v)}
                  className={`flex w-full items-center justify-between rounded border px-3 py-1.5 text-xs transition-colors ${
                    micActive
                      ? "border-border-active bg-surface-2 text-accent"
                      : "border-border bg-surface-2 text-fg-secondary"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Mic className="h-3.5 w-3.5" />
                    <span>{micActive ? "Microphone on" : "Muted"}</span>
                  </span>
                  {micActive && <Check className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Permissions note */}
            <p className="rounded border border-border bg-surface-2 p-3 text-[10px] leading-relaxed text-fg-secondary">
              Your browser will ask permission to share your screen and microphone when capture
              begins.
            </p>

            {permissionError && <p className="text-xs text-error">{permissionError}</p>}

            {/* Actions */}
            <div className="flex gap-3 border-t border-border pt-4">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 select-none rounded bg-surface-2 py-2.5 text-center text-xs text-fg-primary hover:opacity-90"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={acquiring}
                className="flex w-1/2 select-none items-center justify-center gap-2 rounded bg-accent py-2.5 text-xs font-bold text-on-accent hover:opacity-90 disabled:opacity-60"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                {acquiring ? "Requesting…" : "Start capture"}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-6 p-12">
            <div className="relative flex h-28 w-28 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full border border-accent/60" />
              <span className="absolute inset-3 animate-pulse rounded-full border border-accent/80" />
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-4xl font-extrabold text-on-accent shadow-card">
                {countdown}
              </span>
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold uppercase tracking-caps">Get ready</h3>
              <p className="mt-1 text-xs text-fg-secondary">Capture starts in a moment…</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
