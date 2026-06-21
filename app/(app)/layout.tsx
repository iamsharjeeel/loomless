import { ShellProvider } from "@/components/shell-context";
import Sidebar from "@/components/Sidebar";
import GlobalOverlays from "@/components/GlobalOverlays";
import { requireWorkspace } from "@/lib/workspace";

// Auth/session is read per-request, so this segment is always dynamic.
export const dynamic = "force-dynamic";

/**
 * Authenticated app shell. requireWorkspace() redirects unauthenticated users
 * to /signin and users without a workspace to /onboarding, so everything below
 * can assume a signed-in user with an active workspace.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { workspaceId } = await requireWorkspace();

  return (
    <ShellProvider workspaceId={workspaceId}>
      <div className="relative flex min-h-screen flex-col md:flex-row">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col overflow-x-hidden md:pl-16">
          {children}
        </div>
        <GlobalOverlays />
      </div>
    </ShellProvider>
  );
}
