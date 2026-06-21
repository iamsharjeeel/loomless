import Dashboard from "@/components/Dashboard";
import { getRecordings } from "@/lib/data";

export default async function DashboardPage() {
  const recordings = await getRecordings();
  return <Dashboard recordings={recordings} />;
}
