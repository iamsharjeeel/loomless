"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client for use inside client components.
 *
 * Phase 1 note: queries are not yet wired (see lib/data.ts). This helper exists
 * so interactive components can adopt real reads/writes without restructuring.
 * Returns null when env vars are absent so the UI renders empty states cleanly.
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createBrowserClient(url, anonKey);
}
