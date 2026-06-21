"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { CaptureConfig, Recording } from "@/lib/types";

/*
 * The capture/share overlays span the whole app (a button on any screen can
 * open them), so their state lives in a context rather than in any one page.
 * The App Router handles page-to-page navigation; this only handles overlays:
 *   CaptureSetup (modal) -> Viewfinder (full-screen takeover) -> back to app.
 */

interface ShellContextValue {
  // Capture flow
  captureOpen: boolean;
  captureConfig: CaptureConfig | null;
  openCapture: () => void;
  closeCapture: () => void;
  startCapture: (config: CaptureConfig) => void;
  stopCapture: () => void;
  // Share modal
  shareTarget: Recording | null;
  openShare: (recording: Recording) => void;
  closeShare: () => void;
}

const ShellContext = createContext<ShellContextValue | null>(null);

export function useShell(): ShellContextValue {
  const ctx = useContext(ShellContext);
  if (!ctx) throw new Error("useShell must be used within <ShellProvider>");
  return ctx;
}

export function ShellProvider({ children }: { children: React.ReactNode }) {
  const [captureOpen, setCaptureOpen] = useState(false);
  const [captureConfig, setCaptureConfig] = useState<CaptureConfig | null>(null);
  const [shareTarget, setShareTarget] = useState<Recording | null>(null);

  const openCapture = useCallback(() => setCaptureOpen(true), []);
  const closeCapture = useCallback(() => setCaptureOpen(false), []);
  const startCapture = useCallback((config: CaptureConfig) => {
    setCaptureOpen(false);
    setCaptureConfig(config);
  }, []);
  const stopCapture = useCallback(() => setCaptureConfig(null), []);
  const openShare = useCallback((recording: Recording) => setShareTarget(recording), []);
  const closeShare = useCallback(() => setShareTarget(null), []);

  const value = useMemo<ShellContextValue>(
    () => ({
      captureOpen,
      captureConfig,
      openCapture,
      closeCapture,
      startCapture,
      stopCapture,
      shareTarget,
      openShare,
      closeShare,
    }),
    [
      captureOpen,
      captureConfig,
      openCapture,
      closeCapture,
      startCapture,
      stopCapture,
      shareTarget,
      openShare,
      closeShare,
    ]
  );

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}
