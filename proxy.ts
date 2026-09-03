import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy-session";

// Next 16 renamed `middleware` -> `proxy` (Node runtime only; do not set
// `export const runtime`). This refreshes the Supabase session on every request
// and does an OPTIMISTIC redirect for gated areas. The authoritative checks live
// in `requireUser()` / `requireSuperadmin()` and in every server action — a
// Server Action is a POST to its page route, so matcher gaps must never be the
// only line of defence.

const GATED_PREFIXES = ["/admin", "/account"];

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const gated = GATED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (gated && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    // Everything except Next internals and static image files.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|png|gif|svg|webp|avif|ico)$).*)",
  ],
};
