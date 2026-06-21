"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client for use inside client components.
 * Env vars are provided by Vercel in deployed environments.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
