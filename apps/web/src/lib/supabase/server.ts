import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client for Server Components, Server Actions, and Route Handlers.
 * Reads/writes the session cookie set by src/proxy.ts, so server-rendered
 * pages and RLS-backed queries see the same logged-in user the browser does.
 *
 * `setAll` can throw when called from a Server Component (which can't set
 * cookies) — that's fine as long as src/proxy.ts is refreshing the session
 * on every request, which it does.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — ignored; src/proxy.ts refreshes
            // the session on every request instead.
          }
        },
      },
    }
  );
}
