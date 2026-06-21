import { createClient } from "@/lib/supabase/server";
import { getActiveWorkspace } from "@/lib/workspace";
import type {
  Folder,
  Recording,
  RecordingStatus,
  RecordingVisibility,
  UserProfile,
  WorkspaceMember,
  WorkspacePreferences,
} from "@/lib/types";

/**
 * Server-side data-access layer — real Supabase queries scoped to the user's
 * active workspace. RLS enforces workspace isolation server-side; we also
 * filter by workspace_id for clarity and correct counts.
 */

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface RecordingRow {
  id: string;
  workspace_id: string;
  folder_id: string | null;
  owner_id: string;
  title: string;
  description: string | null;
  status: RecordingStatus;
  visibility: RecordingVisibility;
  r2_key: string | null;
  file_size_bytes: number | null;
  duration_seconds: number | null;
  created_at: string;
}

function mapRecording(row: RecordingRow, currentUserId: string, displayName: string): Recording {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    folderId: row.folder_id,
    title: row.title,
    description: row.description,
    durationSeconds: row.duration_seconds,
    thumbnailUrl: null, // thumbnail pipeline is a later phase
    videoUrl: null, // signed on demand in the playback page
    status: row.status,
    visibility: row.visibility,
    createdAt: formatDate(row.created_at),
    authorName: row.owner_id === currentUserId ? displayName || "You" : "Workspace member",
    transcript: null, // transcription is Phase 2
  };
}

export async function getRecordings(): Promise<Recording[]> {
  const ctx = await getActiveWorkspace();
  if (!ctx) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("recordings")
    .select("*")
    .eq("workspace_id", ctx.workspaceId)
    .order("created_at", { ascending: false });

  const displayName =
    (ctx.user.user_metadata?.full_name as string) ?? (ctx.user.user_metadata?.name as string) ?? "You";
  return (data ?? []).map((row) => mapRecording(row as RecordingRow, ctx.user.id, displayName));
}

export async function getRecording(id: string): Promise<Recording | null> {
  const ctx = await getActiveWorkspace();
  if (!ctx) return null;
  const supabase = createClient();
  const { data } = await supabase.from("recordings").select("*").eq("id", id).maybeSingle();
  if (!data) return null;
  const displayName =
    (ctx.user.user_metadata?.full_name as string) ?? (ctx.user.user_metadata?.name as string) ?? "You";
  return mapRecording(data as RecordingRow, ctx.user.id, displayName);
}

export async function getFolders(): Promise<Folder[]> {
  const ctx = await getActiveWorkspace();
  if (!ctx) return [];
  const supabase = createClient();
  const { data: folders } = await supabase
    .from("folders")
    .select("id, workspace_id, name")
    .eq("workspace_id", ctx.workspaceId)
    .order("created_at", { ascending: true });

  // Per-folder recording counts.
  const { data: recs } = await supabase
    .from("recordings")
    .select("folder_id")
    .eq("workspace_id", ctx.workspaceId);

  const counts = new Map<string, number>();
  for (const r of recs ?? []) {
    if (r.folder_id) counts.set(r.folder_id, (counts.get(r.folder_id) ?? 0) + 1);
  }

  return (folders ?? []).map((f) => ({
    id: f.id as string,
    workspaceId: f.workspace_id as string,
    name: f.name as string,
    recordingCount: counts.get(f.id as string) ?? 0,
  }));
}

export async function getWorkspaceMembers(): Promise<WorkspaceMember[]> {
  const ctx = await getActiveWorkspace();
  if (!ctx) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("workspace_members")
    .select("id, workspace_id, user_id, role")
    .eq("workspace_id", ctx.workspaceId)
    .order("created_at", { ascending: true });

  // Phase 1 has no profiles table; show the current user richly and others by id.
  return (data ?? []).map((m) => {
    const isSelf = m.user_id === ctx.user.id;
    return {
      id: m.id as string,
      workspaceId: m.workspace_id as string,
      name: isSelf
        ? ((ctx.user.user_metadata?.full_name as string) ?? ctx.user.email ?? "You")
        : "Workspace member",
      email: isSelf ? ctx.user.email ?? "" : "",
      role: m.role as WorkspaceMember["role"],
      status: "active",
      avatarUrl: isSelf ? ((ctx.user.user_metadata?.avatar_url as string) ?? null) : null,
    };
  });
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const ctx = await getActiveWorkspace();
  if (!ctx) return null;
  return {
    id: ctx.user.id,
    displayName:
      (ctx.user.user_metadata?.full_name as string) ?? (ctx.user.user_metadata?.name as string) ?? null,
    email: ctx.user.email ?? "",
    avatarUrl: (ctx.user.user_metadata?.avatar_url as string) ?? null,
    activeWorkspaceName: ctx.workspaceName,
    role: ctx.role as UserProfile["role"],
  };
}

export async function getWorkspacePreferences(): Promise<WorkspacePreferences> {
  const ctx = await getActiveWorkspace();
  // Phase 1 schema has no preferences table; only the workspace name is real.
  // Capture/SOP toggles remain client-side defaults until a settings table lands.
  return {
    defaultVideoQuality: "1080p High Definition",
    autoGenerateSops: true,
    highlightCursor: true,
    workspaceName: ctx?.workspaceName ?? "",
  };
}
