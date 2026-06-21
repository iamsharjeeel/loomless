import Playback from "@/components/Playback";
import { getRecording } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { presignGet } from "@/lib/r2";

export const dynamic = "force-dynamic";

export default async function PlaybackPage({ params }: { params: { id: string } }) {
  const recording = await getRecording(params.id);

  // Generate a short-lived signed GET URL for the R2 object when ready.
  let videoUrl: string | null = null;
  if (recording && recording.status === "ready") {
    const supabase = createClient();
    const { data } = await supabase
      .from("recordings")
      .select("r2_key")
      .eq("id", params.id)
      .maybeSingle();
    if (data?.r2_key) {
      try {
        videoUrl = await presignGet(data.r2_key);
      } catch {
        videoUrl = null; // R2 misconfigured — fall back to the placeholder
      }
    }
  }

  return <Playback recording={recording} recordingId={params.id} videoUrl={videoUrl} />;
}
