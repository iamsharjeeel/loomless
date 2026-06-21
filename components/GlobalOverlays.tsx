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
    captureOpen,
    captureConfig,
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

      {captureConfig && (
        <Viewfinder
          config={captureConfig}
          onStopCapture={() => {
            // Phase 1: capture/upload is not wired. End the takeover and return
            // to the dashboard, where the new recording will appear once the
            // functional pass lands.
            stopCapture();
            router.push("/");
            router.refresh();
          }}
        />
      )}

      {shareTarget && <ShareModal recording={shareTarget} onClose={closeShare} />}
    </>
  );
}
