/**
 * Server-side Supabase Client
 * Uses service role key for privileged operations
 * ONLY use this in server-side contexts (API routes, serverless functions)
 * NEVER import this in client-side code
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

/**
 * Create a server-side Supabase client with service role key
 * This client bypasses Row Level Security (RLS) policies
 * Use with caution - only for trusted server-side operations
 */
export function createServerSupabaseClient() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error('VITE_SUPABASE_URL is not set');
  }

  if (!supabaseServiceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set - required for server-side operations');
  }

  // Create client with service role key
  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
