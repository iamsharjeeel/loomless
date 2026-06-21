"use client";

import { useEffect, useState } from "react";
import { Camera, Layers, Mic, Monitor, Pause, Play, Square } from "lucide-react";
import { formatDuration, type CaptureConfig } from "@/lib/types";

interface ViewfinderProps {
  config: CaptureConfig;
  onStopCapture: (elapsedSeconds: number) => void;
}

const SOURCE_META = {
  screen: { icon: Monitor, label: "Desktop share" },
  camera: { icon: Camera, label: "Camera" },
  pip: { icon: Layers, label: "Desktop + camera" },
} as const;

export default function Viewfinder({ config, onStopCapture }: ViewfinderProps) {
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [audioLevels, setAudioLevels] = useState([12, 10, 4, 18, 25, 14, 8, 16]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
      if (config.audio) {
        setAudioLevels((prev) => prev.map(() => Math.floor(Math.random() * 26) + 4));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused, config.audio]);

  const SourceIcon = SOURCE_META[config.source].icon;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-surface-0 text-fg-primary">
      {/* Status bar */}
      <header className="flex h-16 items-center justify-between border-b border-border bg-surface-1 px-6">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 animate-ping rounded-full bg-accent-lime" />
          <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-caps text-accent">
            Recording
          </span>
          <span className="border-l border-border pl-3 text-xs text-fg-secondary">
            {config.title}
          </span>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs tabular-nums text-fg-secondary">
          <span className="rounded-sm border border-border bg-surface-2 px-2 py-0.5 text-[10px] uppercase text-accent">
            {config.quality}
          </span>
          <span>FPS 60</span>
          <span>5.4 Mbps</span>
        </div>
      </header>

      {/* Capture stage */}
      <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-black p-4">
        {/* Composition grid */}
        <div className="pointer-events-none absolute inset-x-8 inset-y-12 grid select-none grid-cols-3 grid-rows-3 border border-white/5">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className={`${i % 3 !== 2 ? "border-r" : ""} ${i < 6 ? "border-b" : ""} border-white/5`}
            />
          ))}
        </div>

        {/* Center reticle */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 select-none">
          <div className="absolute left-0 top-1/2 h-px w-8 -translate-y-1/2 bg-white/20" />
          <div className="absolute left-1/2 top-0 h-8 w-px -translate-x-1/2 bg-white/20" />
          <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />
        </div>

        {/* Live preview placeholder (real feed arrives with capture logic) */}
        <div className="relative flex aspect-video w-full max-w-4xl items-center justify-center overflow-hidden rounded border-2 border-accent bg-black">
          <div className="flex flex-col items-center gap-3 text-white/60">
            <SourceIcon className="h-10 w-10" />
            <span className="text-sm">{SOURCE_META[config.source].label}</span>
          </div>

          {/* Source tag */}
          <div className="absolute right-4 top-4 flex items-center gap-2 rounded-sm border border-white/10 bg-black/60 px-3 py-1 text-xs text-white backdrop-blur-sm">
            <SourceIcon className="h-3.5 w-3.5" />
            <span>{SOURCE_META[config.source].label}</span>
          </div>

          {/* Audio meter */}
          {config.audio && (
            <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-xs text-accent-lime backdrop-blur-sm">
              <Mic className="h-4 w-4" />
              <div className="flex h-3 items-end gap-[2px]">
                {audioLevels.map((val, idx) => (
                  <div
                    key={idx}
                    style={{ height: `${val}%` }}
                    className="w-[3px] rounded-full bg-accent-lime transition-all duration-100"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Controls */}
      <footer className="flex h-24 items-center justify-between border-t border-border bg-surface-1 px-8">
        <div className="flex items-center gap-4">
          <div className="w-24 text-center text-3xl font-bold tabular-nums tracking-tight">
            {formatDuration(seconds)}
          </div>
          <div className="text-xs text-fg-secondary">
            <span className="font-bold text-accent">OUTPUT</span>
            <span className="block">{config.quality}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsPaused((v) => !v)}
            title={isPaused ? "Resume" : "Pause"}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-2 text-fg-secondary transition-transform hover:text-fg-primary active:scale-95"
          >
            {isPaused ? <Play className="h-4 w-4 fill-current" /> : <Pause className="h-4 w-4 fill-current" />}
          </button>
          <button
            type="button"
            onClick={() => onStopCapture(seconds)}
            title="Stop and save"
            className="flex h-12 select-none items-center gap-2 rounded-full bg-error px-6 text-xs font-bold uppercase text-on-accent shadow-card transition-transform hover:scale-105 active:scale-95"
          >
            <Square className="h-4 w-4 fill-current" />
            Stop recording
          </button>
        </div>

        <div className="text-right">
          <span className="block text-[10px] font-bold uppercase tracking-caps text-fg-secondary">
            Input
          </span>
          <span className="text-xs font-semibold">
            {config.audio ? "Microphone on" : "Muted"}
          </span>
        </div>
      </footer>
    </div>
  );
}
