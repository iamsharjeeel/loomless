"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type RecorderPhase = "idle" | "recording" | "paused" | "stopped";

export interface RecordingResult {
  blob: Blob;
  durationSeconds: number;
}

function pickMimeType(): string {
  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];
  for (const type of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return "video/webm";
}

/**
 * Drives a MediaRecorder over an already-permitted MediaStream (the stream is
 * acquired in CaptureSetup within the user gesture). Tracks elapsed time across
 * pause/resume and finalizes to a single webm Blob. Auto-stops if the user ends
 * the share from the browser's native control.
 */
export function useMediaRecorder({ onStop }: { onStop: (result: RecordingResult) => void }) {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const accumulatedRef = useRef(0); // completed seconds before the current run
  const runStartRef = useRef(0); // ms timestamp the current run started
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onStopRef = useRef(onStop);
  onStopRef.current = onStop;

  const [phase, setPhase] = useState<RecorderPhase>("idle");
  const [seconds, setSeconds] = useState(0);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopTracks = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const finalize = useCallback(() => {
    clearTimer();
    const durationSeconds = accumulatedRef.current + (runStartRef.current ? (Date.now() - runStartRef.current) / 1000 : 0);
    const blob = new Blob(chunksRef.current, { type: pickMimeType() });
    stopTracks();
    setPhase("stopped");
    onStopRef.current({ blob, durationSeconds });
  }, []);

  const start = useCallback((stream: MediaStream) => {
    streamRef.current = stream;
    chunksRef.current = [];
    accumulatedRef.current = 0;
    const recorder = new MediaRecorder(stream, { mimeType: pickMimeType() });
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = finalize;
    // User ended the share via the browser's native "Stop sharing" control.
    stream.getVideoTracks().forEach((track) => {
      track.addEventListener("ended", () => {
        if (recorderRef.current && recorderRef.current.state !== "inactive") {
          recorderRef.current.stop();
        }
      });
    });

    recorder.start();
    recorderRef.current = recorder;
    runStartRef.current = Date.now();
    setSeconds(0);
    setPhase("recording");
    timerRef.current = setInterval(() => {
      setSeconds(Math.floor(accumulatedRef.current + (Date.now() - runStartRef.current) / 1000));
    }, 250);
  }, [finalize]);

  const pause = useCallback(() => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state !== "recording") return;
    recorder.pause();
    accumulatedRef.current += (Date.now() - runStartRef.current) / 1000;
    runStartRef.current = 0;
    clearTimer();
    setPhase("paused");
  }, []);

  const resume = useCallback(() => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state !== "paused") return;
    recorder.resume();
    runStartRef.current = Date.now();
    setPhase("recording");
    timerRef.current = setInterval(() => {
      setSeconds(Math.floor(accumulatedRef.current + (Date.now() - runStartRef.current) / 1000));
    }, 250);
  }, []);

  const stop = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop(); // triggers finalize via onstop
    } else {
      finalize();
    }
  }, [finalize]);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      clearTimer();
      stopTracks();
    };
  }, []);

  return { phase, seconds, start, pause, resume, stop };
}
