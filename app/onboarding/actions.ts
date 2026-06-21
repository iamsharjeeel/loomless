"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/workspace";

export type CreateWorkspaceResult = { error: string } | void;

/**
 * First-login bootstrap: creates a workspace owned by the current user and adds
 * them as its 'owner' member. Idempotent — if the user already has a membership,
 * it just sends them into the app.
 *
 * The workspace id is generated here so the INSERT does not need a RETURNING
 * clause. A `.select()` on insert would force Postgres to apply the workspaces
 * SELECT policy (is_workspace_member) to the new row — which fails, because the
 * owner's membership doesn't exist until the next insert. That denial is exactly
 * the "new row violates row-level security policy" error seen on onboarding.
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

  const workspaceId = randomUUID();

  // No .select() -> Prefer: return=minimal -> no RETURNING -> only the INSERT
  // WITH CHECK (owner_id = auth.uid()) is evaluated, which passes.
  const { error: wsError } = await supabase
    .from("workspaces")
    .insert({ id: workspaceId, name, slug: slugify(name), owner_id: user.id });
  if (wsError) {
    return { error: "Could not create workspace. Please try again." };
  }

  // Now that the owner-owned workspace row exists, this satisfies the
  // members_insert_self_bootstrap policy (user_id = auth.uid() AND owns the ws).
  const { error: memberError } = await supabase
    .from("workspace_members")
    .insert({ workspace_id: workspaceId, user_id: user.id, role: "owner" });
  if (memberError) {
    return { error: "Workspace created but membership failed. Please retry." };
  }

  redirect("/");
}
