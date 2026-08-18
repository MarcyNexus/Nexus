import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Named `proxy.ts`, not `middleware.ts` — Next.js 16 renamed the file
// convention (same mechanism, runs before a route renders). See
// docs/06-cookies-and-auth.md for why this file exists at all.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Skip static assets and image optimization requests — running this on
    // every asset request would be wasted Supabase Auth calls for no benefit.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
