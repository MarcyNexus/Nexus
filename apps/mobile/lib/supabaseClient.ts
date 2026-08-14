import 'react-native-url-polyfill/auto';
import 'expo-sqlite/localStorage/install';
import { createSupabaseClient } from '@marcy-nexus/shared';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

// expo-sqlite/localStorage/install polyfills the global `localStorage` with a
// SQLite-backed implementation on native (and real localStorage on web), so
// Supabase auth sessions persist across app restarts without AsyncStorage.
export const supabase = createSupabaseClient(url, anonKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
