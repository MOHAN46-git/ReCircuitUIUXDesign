import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import { isSupabaseConfigured, getSupabaseCredentials } from './config';
import { NextRequest } from 'next/server';

/**
 * Creates an authenticated Supabase server client that respects Row Level Security (RLS).
 * Reads the caller's JWT from the Authorization header (Bearer <token>) if present.
 */
export function getServerSupabaseClient(req?: NextRequest): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const { url, anonKey } = getSupabaseCredentials();

  let authHeader = '';
  if (req) {
    authHeader = req.headers.get('authorization') || '';
  }

  return createClient<Database>(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: authHeader ? { Authorization: authHeader } : {},
    },
  });
}

/**
 * Creates a server-only Admin Supabase client using SUPABASE_SERVICE_ROLE_KEY.
 * CRITICAL SECURITY RULE:
 * This client bypasses RLS and must NEVER be exposed to the browser or called from client components.
 * Use only for administrative maintenance, background triggers, or seed migrations.
 */
export function getAdminSupabaseClient(): SupabaseClient<Database> | null {
  const { url, serviceRoleKey } = getSupabaseCredentials();

  if (!url || !serviceRoleKey || serviceRoleKey.includes('your-supabase-service-role-key')) {
    return null;
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
