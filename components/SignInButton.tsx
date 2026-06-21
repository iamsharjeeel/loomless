"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignInButton() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get("error") ? "Sign-in failed. Please try again." : null
  );

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const next = searchParams.get("next") ?? "/";
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    }
    // On success the browser is redirected to Google, so no further state needed.
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <button
        type="button"
        onClick={handleSignIn}
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 rounded border border-border bg-surface-1 px-4 py-3 text-sm font-semibold text-fg-primary shadow-card transition-colors hover:bg-surface-2 disabled:opacity-60"
      >
        <GoogleMark />
        {loading ? "Redirecting…" : "Continue with Google"}
      </button>
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}

function GoogleMark() {
  // Monochrome Google "G" using currentColor (keeps components hex-free).
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 11v2.8h3.96c-.16 1.02-1.14 3-3.96 3a4.4 4.4 0 0 1 0-8.8c1.26 0 2.1.54 2.58.99l1.76-1.7C15.2 4.2 13.76 3.6 12 3.6a6.4 6.4 0 1 0 0 12.8c3.7 0 6.14-2.6 6.14-6.26 0-.42-.04-.74-.1-1.06H12Z" />
    </svg>
  );
}
