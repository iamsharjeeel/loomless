"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface SignOutButtonProps {
  variant?: "full" | "icon";
  className?: string;
}

export default function SignOutButton({ variant = "full", className = "" }: SignOutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/signin");
    router.refresh();
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleSignOut}
        disabled={loading}
        aria-label="Sign out"
        title="Sign out"
        className={className}
      >
        <LogOut className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className={`flex select-none items-center justify-center gap-2 rounded border border-border bg-surface-1 px-4 py-2 text-xs font-bold text-fg-primary shadow-card transition-colors hover:bg-surface-2 disabled:opacity-60 ${className}`}
    >
      <LogOut className="h-3.5 w-3.5" />
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
