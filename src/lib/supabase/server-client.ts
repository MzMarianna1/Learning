/**
 * SERVER-SIDE SUPABASE CLIENT
 * 
 * This client uses the service role key and should ONLY be used in server-side contexts:
 * - Vercel/Netlify serverless functions
 * - Supabase Edge Functions
 * - Backend scripts
 * 
 * NEVER import this in frontend code as it would expose the service role key!
 * 
 * The service role key bypasses Row Level Security (RLS) and has full database access.
 * Use it only for privileged operations that need to bypass RLS.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

/**
 * Create a server-side Supabase client with service role key
 * 
 * This function should only be called in server-side code (Vercel functions, Edge Functions, etc.)
 * 
 * @throws Error if SUPABASE_SERVICE_ROLE_KEY is not set
 * @returns Supabase client with service role privileges
 */
export function createServerClient() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error('SUPABASE_URL or VITE_SUPABASE_URL environment variable is required for server client');
  }

  if (!supabaseServiceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY environment variable is required for server client. ' +
      'This should be set in your server environment (Vercel/Netlify) and NEVER committed to code.'
    );
  }

  // Validate that we're not accidentally using the anon key
  if (supabaseServiceRoleKey.length < 100) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY appears to be invalid (too short). ' +
      'Make sure you are using the service_role key, not the anon key.'
    );
  }

  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Type for the server-side Supabase client
 */
export type ServerSupabaseClient = ReturnType<typeof createServerClient>;
