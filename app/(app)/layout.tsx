import { ShellProvider } from "@/components/shell-context";
import Sidebar from "@/components/Sidebar";
import GlobalOverlays from "@/components/GlobalOverlays";

/**
 * Authenticated app shell: fixed icon rail (desktop) / bottom tab bar (mobile),
 * the scrollable content column, and the global capture/share overlays.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ShellProvider>
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
