import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  permissions: string[];
};

/**
 * The authenticated Supabase user, JWT-revalidated against the auth server
 * (`getUser`, not `getSession`). `cache()` dedupes within a single render.
 */
export const getUser = cache(async (): Promise<User | null> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ?? null;
});

/** The `streetproculture_users` row for the current user, or null. */
export const getProfile = cache(async (): Promise<Profile | null> => {
  const user = await getUser();
  if (!user) return null;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("streetproculture_users")
    .select("id, email, full_name, avatar_url, permissions")
    .eq("id", user.id)
    .maybeSingle();

  return (data as Profile | null) ?? null;
});

export async function isSuperadmin(): Promise<boolean> {
  const profile = await getProfile();
  return profile?.permissions?.includes("superadmin") ?? false;
}

/** Redirect to /login unless signed in. Returns the user. */
export async function requireUser(nextPath = "/account"): Promise<User> {
  const user = await getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  return user;
}

/** Redirect to /login unless the current user has the "superadmin" permission. */
export async function requireSuperadmin(nextPath = "/admin"): Promise<Profile> {
  const profile = await getProfile();
  if (!profile?.permissions?.includes("superadmin")) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
  return profile;
}
