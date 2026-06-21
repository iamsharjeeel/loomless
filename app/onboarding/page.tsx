import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getActiveWorkspace } from "@/lib/workspace";
import CreateWorkspaceForm from "@/components/CreateWorkspaceForm";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  // Already has a workspace → straight into the app.
  const ctx = await getActiveWorkspace();
  if (ctx) redirect("/");

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-0 p-4">
      <div className="w-full max-w-sm space-y-8 rounded border border-border bg-surface-1 p-8 shadow-card">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight">Create your workspace</h1>
          <p className="text-sm text-fg-secondary">
            Workspaces hold your recordings and folders. You can invite others later.
          </p>
        </div>
        <CreateWorkspaceForm />
      </div>
    </main>
  );
}
