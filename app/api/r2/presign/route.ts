import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getActiveWorkspace } from "@/lib/workspace";
import { presignPut } from "@/lib/r2";

export const runtime = "nodejs";

/**
 * Returns a presigned PUT URL for uploading a recording's video directly to R2.
 * Auth + workspace membership are required, and the object key is forced into
 * the caller's workspace namespace so a user can't upload into another's space.
 */
export async function POST(request: Request) {
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

  let body: { recordingId?: string; contentType?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const recordingId = body.recordingId;
  const contentType = body.contentType ?? "video/webm";
  if (!recordingId) {
    return NextResponse.json({ error: "recordingId is required" }, { status: 400 });
  }

  // Verify the recording belongs to the caller's workspace (RLS-backed read).
  const { data: rec } = await supabase
    .from("recordings")
    .select("id, workspace_id")
    .eq("id", recordingId)
    .maybeSingle();
  if (!rec || rec.workspace_id !== ctx.workspaceId) {
    return NextResponse.json({ error: "Recording not found" }, { status: 404 });
  }

  const key = `${ctx.workspaceId}/${recordingId}.webm`;
  try {
    const url = await presignPut(key, contentType);
    return NextResponse.json({ url, key });
  } catch (err) {
    console.error("presign error", err);
    return NextResponse.json({ error: "Could not presign upload" }, { status: 500 });
  }
}
