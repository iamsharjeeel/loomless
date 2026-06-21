import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignInButton from "@/components/SignInButton";

export const dynamic = "force-dynamic";

export default async function SignInPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/");

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-0 p-4">
      <div className="w-full max-w-sm space-y-8 rounded border border-border bg-surface-1 p-8 shadow-card">
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded border border-accent/40 bg-fg-primary">
            <span className="text-2xl font-bold uppercase tracking-tighter text-accent-lime">L</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Sign in to Loomless</h1>
            <p className="mt-1 text-sm text-fg-secondary">
              Record walkthroughs and turn them into shareable docs.
            </p>
          </div>
        </div>

        <Suspense>
          <SignInButton />
        </Suspense>

        <p className="text-center text-[11px] text-fg-tertiary">
          By continuing you agree to the terms of service and privacy policy.
        </p>
      </div>
    </main>
  );
}
