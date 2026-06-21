import Settings from "@/components/Settings";
import { getUserProfile, getWorkspaceMembers, getWorkspacePreferences } from "@/lib/data";

export default async function SettingsPage() {
  const [preferences, members, profile] = await Promise.all([
    getWorkspacePreferences(),
    getWorkspaceMembers(),
    getUserProfile(),
  ]);
  return <Settings preferences={preferences} members={members} profile={profile} />;
}
