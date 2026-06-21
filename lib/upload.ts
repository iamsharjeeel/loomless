import { createClient } from "@/lib/supabase/client";

export interface UploadArgs {
  blob: Blob;
  durationSeconds: number;
  title: string;
  workspaceId: string;
}

/**
 * Client-side upload orchestration:
 *   1. create the `recordings` row (status: 'processing') to get an id
 *   2. request a presigned PUT URL from the server (R2 secrets stay server-side)
 *   3. PUT the blob directly to R2 (not proxied through Vercel)
 *   4. mark the row 'ready' with r2_key / size; on any failure mark 'failed'
 * Returns the new recording id.
 */
export async function uploadRecording({
  blob,
  durationSeconds,
  title,
  workspaceId,
}: UploadArgs): Promise<string> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const contentType = blob.type || "video/webm";

  const { data: rec, error: insertError } = await supabase
    .from("recordings")
    .insert({
      workspace_id: workspaceId,
      owner_id: user.id,
      title,
      status: "processing",
      duration_seconds: Math.max(0, Math.round(durationSeconds)),
    })
    .select("id")
    .single();
  if (insertError || !rec) {
    throw new Error("Could not create recording");
  }

  try {
    const presignRes = await fetch("/api/r2/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recordingId: rec.id, contentType }),
    });
    if (!presignRes.ok) throw new Error("Failed to presign upload");
    const { url, key } = (await presignRes.json()) as { url: string; key: string };

    const put = await fetch(url, {
      method: "PUT",
      body: blob,
      headers: { "Content-Type": contentType },
    });
    if (!put.ok) throw new Error("Upload to storage failed");

    await supabase
      .from("recordings")
      .update({ r2_key: key, file_size_bytes: blob.size, status: "ready" })
      .eq("id", rec.id);

    return rec.id;
  } catch (err) {
    await supabase.from("recordings").update({ status: "failed" }).eq("id", rec.id);
    throw err;
  }
}
