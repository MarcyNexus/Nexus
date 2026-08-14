import { createSupabaseClient } from '@marcy-nexus/shared';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createSupabaseClient(url, anonKey);
