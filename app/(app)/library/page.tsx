import Library from "@/components/Library";
import { getFolders, getRecordings } from "@/lib/data";

export default async function LibraryPage() {
  const [folders, recordings] = await Promise.all([getFolders(), getRecordings()]);
  return <Library folders={folders} recordings={recordings} />;
}
