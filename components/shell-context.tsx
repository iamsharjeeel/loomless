"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { CaptureConfig, Recording } from "@/lib/types";

/*
 * App-wide overlay + session state. The App Router handles page navigation;
 * this only handles overlays that can be opened from any screen:
 *   CaptureSetup (modal) -> Viewfinder (full-screen takeover) -> upload.
 * It also exposes the active workspace id so the upload flow can scope writes.
 */

interface ShellContextValue {
  workspaceId: string;
  // Capture flow
  captureOpen: boolean;
  captureConfig: CaptureConfig | null;
  captureStream: MediaStream | null;
  openCapture: () => void;
  closeCapture: () => void;
  startCapture: (config: CaptureConfig, stream: MediaStream) => void;
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

export function ShellProvider({
  workspaceId,
  children,
}: {
  workspaceId: string;
  children: React.ReactNode;
}) {
  const [captureOpen, setCaptureOpen] = useState(false);
  const [captureConfig, setCaptureConfig] = useState<CaptureConfig | null>(null);
  const [captureStream, setCaptureStream] = useState<MediaStream | null>(null);
  const [shareTarget, setShareTarget] = useState<Recording | null>(null);

  const openCapture = useCallback(() => setCaptureOpen(true), []);
  const closeCapture = useCallback(() => setCaptureOpen(false), []);
  const startCapture = useCallback((config: CaptureConfig, stream: MediaStream) => {
    setCaptureOpen(false);
    setCaptureConfig(config);
    setCaptureStream(stream);
  }, []);
  const stopCapture = useCallback(() => {
    setCaptureConfig(null);
    setCaptureStream(null);
  }, []);
  const openShare = useCallback((recording: Recording) => setShareTarget(recording), []);
  const closeShare = useCallback(() => setShareTarget(null), []);

  const value = useMemo<ShellContextValue>(
    () => ({
      workspaceId,
      captureOpen,
      captureConfig,
      captureStream,
      openCapture,
      closeCapture,
      startCapture,
      stopCapture,
      shareTarget,
      openShare,
      closeShare,
    }),
    [
      workspaceId,
      captureOpen,
      captureConfig,
      captureStream,
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
