import "server-only";

import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "@/lib/supabase/env";

/** New "secret" key (sb_secret_…) or the legacy service-role JWT. */
const SUPABASE_SECRET_KEY =
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/**
 * Service-role Supabase client — bypasses RLS. Reserved for scripts and future
 * admin tooling. Phase 1 request-time code never needs it: every write goes
 * through `is_superadmin()` RLS + a `requireSuperadmin()` check.
 *
 * The `server-only` import makes any accidental client-bundle import a build
 * error, so the secret key can never reach the browser.
 */
export function createSupabaseAdminClient() {
  return createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
