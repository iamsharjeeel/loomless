"use client";

import { useState } from "react";
import { Calendar, Copy, Globe, LockKeyhole, X } from "lucide-react";
import type { Recording } from "@/lib/types";

interface ShareModalProps {
  recording: Recording;
  onClose: () => void;
}

export default function ShareModal({ recording, onClose }: ShareModalProps) {
  const [expiry, setExpiry] = useState("7 days");
  const [passwordRequired, setPasswordRequired] = useState(false);

  return (
    <div
      className="fixed inset-0 z-[55] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md select-none overflow-hidden rounded border border-border bg-surface-1 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-surface-2 p-4">
          <div className="flex items-center gap-2">
            <Globe className="h-3.5 w-3.5 text-accent" />
            <h2 className="text-sm font-bold uppercase tracking-tight">Share options</h2>
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

        <div className="space-y-6 p-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-caps text-fg-secondary">
              Recording
            </span>
            <h3 className="truncate text-sm font-bold">{recording.title}</h3>
          </div>

          {/* Share link — generation lands in Phase 4. */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-caps text-fg-secondary">
              Share link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                disabled
                value=""
                placeholder="A link will be generated when sharing is enabled"
                className="flex-1 rounded border border-border bg-surface-2 px-3 py-2 font-mono text-xs text-fg-tertiary outline-none"
              />
              <button
                type="button"
                disabled
                title="Available in a later phase"
                className="flex items-center justify-center gap-1 rounded bg-surface-2 px-3.5 text-xs font-bold text-fg-tertiary"
              >
                <Copy className="h-3.5 w-3.5 shrink-0" />
                Copy
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-caps text-fg-secondary">
                <Calendar className="h-3 w-3" />
                Expiration
              </label>
              <select
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full rounded border border-border bg-surface-2 px-2 py-1.5 text-xs outline-none focus:border-border-active"
              >
                <option>7 days</option>
                <option>30 days</option>
                <option>Never</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-caps text-fg-secondary">
                <LockKeyhole className="h-3 w-3" />
                Access
              </label>
              <button
                type="button"
                onClick={() => setPasswordRequired((v) => !v)}
                className={`flex w-full items-center justify-between rounded border px-3 py-1.5 text-xs ${
                  passwordRequired
                    ? "border-border-active bg-surface-2 text-accent"
                    : "border-border bg-surface-2 text-fg-primary"
                }`}
              >
                <span>{passwordRequired ? "Password protected" : "Open access"}</span>
                <span className="text-[9px] opacity-75">{passwordRequired ? "ON" : "OFF"}</span>
              </button>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full select-none rounded bg-accent py-2.5 text-xs font-bold text-on-accent shadow-card hover:opacity-90"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
