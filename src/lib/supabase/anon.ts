import "server-only";

import { createClient } from "@supabase/supabase-js";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase/env";

/**
 * Cookieless, sessionless Supabase client for public catalogue reads. Because it
 * carries no per-user state it is deterministic and safe to call inside
 * `unstable_cache`. RLS still applies as the anon/publishable role, so only
 * published products / images are ever returned.
 */
export const supabaseAnon = createClient(
  SUPABASE_URL || "http://localhost:54321",
  SUPABASE_PUBLISHABLE_KEY || "missing-key",
  { auth: { persistSession: false, autoRefreshToken: false } },
);
