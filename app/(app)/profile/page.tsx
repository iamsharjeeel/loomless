import Profile from "@/components/Profile";
import { getUserProfile } from "@/lib/data";

export default async function ProfilePage() {
  const profile = await getUserProfile();
  return <Profile profile={profile} />;
}
