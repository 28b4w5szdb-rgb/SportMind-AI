/**
 * Typed Supabase client singleton.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { supabaseConfig } from '@/src/core/config/supabase';
import type { Database } from './database.types';

export type TypedSupabaseClient = SupabaseClient<Database>;

export const supabase: TypedSupabaseClient = createClient<Database>(
  supabaseConfig.url,
  supabaseConfig.anonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
);

export {
  isSupabaseConfigured,
  supabaseConfig,
  SUPABASE_ENV_KEYS,
} from '@/src/core/config/supabase';

export default supabase;
