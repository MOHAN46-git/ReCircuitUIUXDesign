import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import { isSupabaseConfigured, getSupabaseCredentials } from './config';

let browserClient: SupabaseClient<Database> | null = null;

/**
 * Returns a typed Supabase client for browser contexts.
 * Returns null if Supabase environment variables are missing/unconfigured.
 */
export function getBrowserSupabaseClient(): SupabaseClient<Database> | null {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!browserClient) {
    const { url, anonKey } = getSupabaseCredentials();
    browserClient = createClient<Database>(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return browserClient;
}

/**
 * Direct export for convenience, will be null if unconfigured
 */
export const supabase = typeof window !== 'undefined' && isSupabaseConfigured()
  ? getBrowserSupabaseClient()
  : null;
