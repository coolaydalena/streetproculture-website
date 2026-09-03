"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase/env";

/**
 * Browser Supabase client, bound to the user's session cookies. Used by the
 * Google sign-in button and the CMS image dropzone (uploads run under the
 * superadmin's own session, authorised by Storage RLS).
 */
export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
}
