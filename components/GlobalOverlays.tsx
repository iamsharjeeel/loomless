"use client";

import { useRouter } from "next/navigation";
import { useShell } from "@/components/shell-context";
import CaptureSetup from "@/components/CaptureSetup";
import Viewfinder from "@/components/Viewfinder";
import ShareModal from "@/components/ShareModal";

/**
 * Renders the app-wide overlays driven by ShellContext. The viewfinder is a
 * full-screen takeover; the capture/share dialogs are centered modals.
 */
export default function GlobalOverlays() {
  const router = useRouter();
  const {
    workspaceId,
    captureOpen,
    captureConfig,
    captureStream,
    closeCapture,
    startCapture,
    stopCapture,
    shareTarget,
    closeShare,
  } = useShell();

  return (
    <>
      {captureOpen && (
        <CaptureSetup onClose={closeCapture} onStartCapture={startCapture} />
      )}

      {captureConfig && captureStream && (
        <Viewfinder
          config={captureConfig}
          stream={captureStream}
          workspaceId={workspaceId}
          onDone={(recordingId) => {
            stopCapture();
            router.push(`/playback/${recordingId}`);
            router.refresh();
          }}
          onAbort={() => {
            stopCapture();
            router.refresh();
          }}
        />
      )}

      {shareTarget && <ShareModal recording={shareTarget} onClose={closeShare} />}
    </>
  );
}
