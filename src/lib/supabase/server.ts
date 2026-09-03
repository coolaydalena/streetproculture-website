import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase/env";

/**
 * Per-request Supabase client bound to the caller's session cookies. RLS is
 * enforced as the signed-in user (or `anon` when signed out). Use this in
 * Server Components, Route Handlers and Server Actions that act on behalf of
 * the user.
 *
 * `cookies()` is async in Next 16. Server Components cannot write cookies, so
 * `setAll` is best-effort — `proxy.ts` refreshes the session on every request.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component render — safe to ignore; the proxy
          // middleware writes the refreshed cookies on the response.
        }
      },
    },
  });
}
