/**
 * Domain types aligned with the Phase 1 Supabase schema
 * (workspaces, workspace_members, folders, recordings).
 *
 * These intentionally mirror the database shape rather than the old Vite
 * prototype's mock shape — they're what the UI will receive once the
 * data-access layer (lib/data.ts) is wired to real queries.
 */

export type RecordingStatus = "processing" | "ready" | "failed";
export type RecordingVisibility = "private" | "workspace" | "public";
export type MemberRole = "owner" | "admin" | "editor" | "viewer";
export type MemberStatus = "active" | "pending";

export interface Workspace {
  id: string;
  name: string;
  createdAt: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  name: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
  avatarUrl?: string | null;
}

export interface Folder {
  id: string;
  workspaceId: string;
  name: string;
  recordingCount: number;
}

export interface Recording {
  id: string;
  workspaceId: string;
  folderId: string | null;
  title: string;
  description: string | null;
  /** Duration in seconds (null until processing completes). */
  durationSeconds: number | null;
  /** Storage key / signed URL for the thumbnail (null in Phase 1). */
  thumbnailUrl: string | null;
  /** Storage key / signed URL for the video (null until upload completes). */
  videoUrl: string | null;
  status: RecordingStatus;
  visibility: RecordingVisibility;
  createdAt: string;
  authorName: string | null;
  /**
   * Transcript is produced in Phase 2 (AssemblyAI). Always null/empty in
   * Phase 1 — the Playback panel renders a pending state.
   */
  transcript: TranscriptLine[] | null;
}

export interface TranscriptLine {
  /** Offset in seconds from the start of the recording. */
  startSeconds: number;
  speaker: string | null;
  text: string;
}

export interface UserProfile {
  id: string;
  displayName: string | null;
  email: string;
  avatarUrl: string | null;
  activeWorkspaceName: string | null;
  role: MemberRole | null;
}

export interface WorkspacePreferences {
  defaultVideoQuality: string;
  autoGenerateSops: boolean;
  highlightCursor: boolean;
  workspaceName: string;
}

/** Capture configuration produced by CaptureSetup, consumed by Viewfinder. */
export interface CaptureConfig {
  source: "screen" | "camera" | "pip";
  quality: string;
  audio: boolean;
  title: string;
}

/** Format a duration in seconds as mm:ss. */
export function formatDuration(totalSeconds: number | null | undefined): string {
  if (totalSeconds == null) return "--:--";
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
