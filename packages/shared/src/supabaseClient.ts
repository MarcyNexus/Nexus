import { createClient, type SupabaseClient, type SupabaseClientOptions } from '@supabase/supabase-js';

/**
 * Platform-agnostic Supabase client factory.
 * Web and mobile each pass their own env values + storage adapter (if needed)
 * so this package stays free of any React Native / Next.js specific imports.
 */
export function createSupabaseClient(
  url: string,
  anonKey: string,
  options?: SupabaseClientOptions<'public'>
): SupabaseClient {
  if (!url || !anonKey) {
    throw new Error(
      'Supabase URL and anon key are required. Check your .env file against .env.example.'
    );
  }

  return createClient(url, anonKey, options);
}

export type { SupabaseClient };
