"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/workspace";

export type CreateWorkspaceResult = { error: string } | void;

/**
 * First-login bootstrap: creates a workspace owned by the current user and
 * adds them as its 'owner' member. Idempotent — if the user already has a
 * membership, it just sends them into the app.
 */
export async function createWorkspace(formData: FormData): Promise<CreateWorkspaceResult> {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Please enter a workspace name." };

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  const { data: existing } = await supabase
    .from("workspace_members")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  if (existing) redirect("/");

  const { data: workspace, error: wsError } = await supabase
    .from("workspaces")
    .insert({ name, slug: slugify(name), owner_id: user.id })
    .select("id")
    .single();
  if (wsError || !workspace) {
    return { error: "Could not create workspace. Please try again." };
  }

  const { error: memberError } = await supabase
    .from("workspace_members")
    .insert({ workspace_id: workspace.id, user_id: user.id, role: "owner" });
  if (memberError) {
    return { error: "Workspace created but membership failed. Please retry." };
  }

  redirect("/");
}
