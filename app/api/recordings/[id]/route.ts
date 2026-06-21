import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getActiveWorkspace } from "@/lib/workspace";
import { deleteObject } from "@/lib/r2";

export const runtime = "nodejs";

/**
 * Deletes a recording: removes the R2 object (if any) then the DB row. RLS
 * ensures the row is only visible/deletable within the caller's workspace.
 */
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ctx = await getActiveWorkspace();
  if (!ctx) {
    return NextResponse.json({ error: "No workspace" }, { status: 403 });
  }

  const { data: rec } = await supabase
    .from("recordings")
    .select("id, workspace_id, r2_key")
    .eq("id", params.id)
    .maybeSingle();
  if (!rec || rec.workspace_id !== ctx.workspaceId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (rec.r2_key) {
    try {
      await deleteObject(rec.r2_key);
    } catch (err) {
      // Log but continue — we still want the DB row removed so it disappears
      // from the library; orphaned objects can be reaped separately.
      console.error("R2 delete failed", err);
    }
  }

  const { error } = await supabase.from("recordings").delete().eq("id", params.id);
  if (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
