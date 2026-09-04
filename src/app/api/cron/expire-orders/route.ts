import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// Bulk-expire stale unpaid online orders. Wired to a Vercel Cron (vercel.json)
// and guarded by CRON_SECRET, which Vercel injects as a Bearer token.
//
// Runs once a day (Vercel Hobby caps crons at daily). This is only a safety
// net — orders also lazily self-expire when read — so the coarse schedule is
// fine; it just sweeps orders nobody ever opens.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return new Response("unauthorized", { status: 401 });
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("streetproculture_orders")
    .update({ status: "expired" })
    .eq("status", "pending_payment")
    .lt("expires_at", new Date().toISOString())
    .select("id");

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  return Response.json({ expired: data?.length ?? 0 });
}
