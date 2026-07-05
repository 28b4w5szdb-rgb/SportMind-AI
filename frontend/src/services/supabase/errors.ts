import { isSupabaseConfigured } from '@/src/core/config/supabase';

export class SupabaseNotConfiguredError extends Error {
  constructor() {
    super(
      'Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.'
    );
    this.name = 'SupabaseNotConfiguredError';
  }
}

/** Throws when Supabase env credentials are missing. Call at the start of service methods. */
export function assertSupabaseConfigured(): void {
  if (!isSupabaseConfigured) {
    throw new SupabaseNotConfiguredError();
  }
}
