import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export interface WorkspaceContext {
  user: User;
  workspaceId: string;
  workspaceName: string;
  role: string;
}

/**
 * Resolves the signed-in user's active workspace (their first membership).
 * Returns null when the user has no workspace yet (needs bootstrap).
 */
export async function getActiveWorkspace(): Promise<WorkspaceContext | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("role, workspace_id, workspaces(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!membership) return null;

  // workspaces is returned as a related object (or array depending on inference).
  const ws = membership.workspaces as unknown as { name: string } | { name: string }[] | null;
  const workspaceName = Array.isArray(ws) ? ws[0]?.name ?? "" : ws?.name ?? "";

  return {
    user,
    workspaceId: membership.workspace_id as string,
    workspaceName,
    role: membership.role as string,
  };
}

/**
 * Like getActiveWorkspace but redirects unauthenticated users to sign-in and
 * users without a workspace to onboarding. Use in protected server components.
 */
export async function requireWorkspace(): Promise<WorkspaceContext> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  const ctx = await getActiveWorkspace();
  if (!ctx) redirect("/onboarding");
  return ctx;
}

/** URL-safe slug from a workspace name, with a short random suffix for uniqueness. */
export function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base || "workspace"}-${suffix}`;
}
