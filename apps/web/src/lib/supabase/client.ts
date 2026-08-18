import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for Client Components — runs in the browser.
 * Session is persisted in cookies (not localStorage) so the same session
 * is readable server-side by src/proxy.ts and lib/supabase/server.ts.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
