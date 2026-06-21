import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  Folder,
  Recording,
  UserProfile,
  WorkspaceMember,
  WorkspacePreferences,
} from "@/lib/types";

/**
 * Server-side data-access layer.
 *
 * Phase 1 (this pass) is UI/UX only: these functions return empty/default data
 * so every screen renders its empty/pending state. Each is the single place to
 * drop in real Supabase queries against the Phase 1 schema — the components and
 * pages already consume these shapes, so no UI changes are needed when wiring.
 */

export async function getRecordings(): Promise<Recording[]> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return [];
  // TODO(phase-1): select from `recordings` scoped to the active workspace.
  //   const { data } = await supabase.from("recordings").select("*")...
  return [];
}

export async function getRecording(id: string): Promise<Recording | null> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return null;
  // TODO(phase-1): select a single `recordings` row by id (RLS-scoped).
  void id;
  return null;
}

export async function getFolders(): Promise<Folder[]> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return [];
  // TODO(phase-1): select from `folders` scoped to the active workspace.
  return [];
}

export async function getWorkspaceMembers(): Promise<WorkspaceMember[]> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return [];
  // TODO(phase-1): join `workspace_members` with profiles for display data.
  return [];
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return null;
  // TODO(phase-1): derive from supabase.auth.getUser() + profile row.
  return null;
}

export async function getWorkspacePreferences(): Promise<WorkspacePreferences> {
  // Defaults shown until a workspace settings row exists.
  return {
    defaultVideoQuality: "1080p High Definition",
    autoGenerateSops: true,
    highlightCursor: true,
    workspaceName: "",
  };
}
