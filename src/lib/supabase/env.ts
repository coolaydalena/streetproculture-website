// Supabase env, tolerant of both the current key names and the legacy ones.
// These are referenced as literal `process.env.NEXT_PUBLIC_*` so Next inlines
// them into the browser bundle.

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

/** New "publishable" key (sb_publishable_…) or the legacy anon JWT. */
export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

export const SUPABASE_CONFIGURED = !!SUPABASE_URL && !!SUPABASE_PUBLISHABLE_KEY;
