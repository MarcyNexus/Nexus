import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase session cookie on every request that isn't excluded
 * by src/proxy.ts's matcher. This is what makes cookie-based auth actually
 * work end to end: without it, an expired access token would only get
 * refreshed the next time a Client Component happened to call Supabase,
 * leaving Server Components and route gating looking at a stale/expired
 * session in the meantime.
 *
 * Role-based route gating plugs in here once `user_roles` exists (see
 * docs/05-roles-and-data-model.md) — e.g. reading `user.app_metadata.role`
 * and redirecting unauthorized requests before they reach the page.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // No Supabase project configured yet (e.g. local dev without .env.local) —
  // pass the request through untouched rather than crashing every route.
  // See "Local development without Supabase configured" in
  // docs/06-cookies-and-auth.md.
  if (!url || !anonKey) {
    return response;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Revalidates the token with Supabase's Auth server (not just decoding the
  // JWT locally) and refreshes it if expired. Required for Server Components,
  // which can't refresh cookies themselves.
  await supabase.auth.getUser();

  return response;
}
