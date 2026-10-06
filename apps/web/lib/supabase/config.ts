/**
 * Supabase Configuration & Availability Helper
 * Allows the application to gracefully operate in dual-mode:
 * 1. Live Supabase: when NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are provided.
 * 2. Standalone Demo: when keys are omitted, with 100% functionality via in-memory data store.
 */

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return false;
  }

  // Check if placeholder values rather than real configuration
  if (
    url.includes('your-project') ||
    url.includes('placeholder') ||
    anonKey.includes('your-supabase-anon-key') ||
    anonKey.length < 20
  ) {
    return false;
  }

  return true;
}

export function getSupabaseCredentials() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    isConfigured: isSupabaseConfigured(),
  };
}
