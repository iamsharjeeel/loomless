import Playback from "@/components/Playback";
import { getRecording } from "@/lib/data";

export default async function PlaybackPage({ params }: { params: { id: string } }) {
  const recording = await getRecording(params.id);
  return <Playback recording={recording} recordingId={params.id} />;
}
