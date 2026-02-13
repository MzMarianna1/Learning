/**
 * SERVER-SIDE SUPABASE CLIENT
 * 
 * ⚠️ SECURITY WARNING ⚠️
 * This client uses the SUPABASE_SERVICE_ROLE_KEY which bypasses Row Level Security (RLS).
 * 
 * ONLY use this client in:
 * - Vercel/Netlify serverless functions (api/* directory)
 * - Node.js server-side scripts
 * - Supabase Edge Functions
 * 
 * NEVER use this client in:
 * - React components
 * - Frontend code (src/pages, src/components)
 * - Any code that gets bundled for the browser
 * 
 * The service role key bypasses all RLS policies, so use with extreme caution.
 * Only perform operations that absolutely require elevated privileges.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

/**
 * Create a server-side Supabase client with service role key
 * 
 * This client has full database access and bypasses Row Level Security.
 * Use only for privileged server-side operations.
 * 
 * @returns Supabase client with service role privileges
 * @throws Error if service role key is not configured
 * 
 * @example
 * ```typescript
 * // In a Vercel serverless function (api/my-endpoint.ts)
 * import { createServerClient } from '@/lib/supabase/server-client';
 * 
 * export default async function handler(req, res) {
 *   const supabase = createServerClient();
 *   
 *   // This can perform privileged operations
 *   const { data } = await supabase
 *     .from('profiles')
 *     .insert({ ... });
 * }
 * ```
 */
export function createServerClient() {
  // Runtime check: Ensure we're in a Node.js environment, not the browser
  if (typeof window !== 'undefined') {
    throw new Error(
      'SECURITY ERROR: createServerClient() cannot be called in browser code. ' +
      'This would expose the service role key. Use the regular supabase client from ' +
      '@/lib/supabase/client instead.'
    );
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      'Missing SUPABASE_URL or VITE_SUPABASE_URL environment variable. ' +
      'Configure in your .env file or deployment environment.'
    );
  }

  if (!serviceRoleKey) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY environment variable. ' +
      'This key is required for server-side operations. ' +
      'IMPORTANT: Do NOT use VITE_ prefix - this key must remain server-only. ' +
      'Get it from: Supabase Dashboard → Settings → API → service_role key'
    );
  }

  // Validate that the service role key is not the anon key
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (serviceRoleKey === anonKey) {
    throw new Error(
      'SECURITY ERROR: SUPABASE_SERVICE_ROLE_KEY appears to be the anon key. ' +
      'The service role key is different from the anon key and should be kept secret. ' +
      'Get the correct service_role key from: Supabase Dashboard → Settings → API'
    );
  }

  // Only log in development, and never log the actual key
  if (process.env.NODE_ENV === 'development') {
    console.log('[Server Client] Initializing server-side Supabase client');
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Type alias for server-side Supabase client
 * Same as the regular client but with service role privileges
 */
export type ServerSupabaseClient = ReturnType<typeof createServerClient>;
