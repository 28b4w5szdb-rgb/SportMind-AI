/**
 * SportMind AI — Supabase public API
 *
 * Supabase-first data layer. Import services or hooks from here.
 */

export { supabase, default } from './client';
export type { TypedSupabaseClient } from './client';

export {
  isSupabaseConfigured,
  supabaseConfig,
  SUPABASE_ENV_KEYS,
} from '@/src/core/config/supabase';

export { SupabaseNotConfiguredError, assertSupabaseConfigured } from './errors';

export * from './auth.service';
export * from './profile.service';
export * from './organization.service';
export * from './extras.service';

export type { Database, Json } from './database.types';
export type {
  Profile,
  ProfileUpdate,
  Organization,
  OrganizationMember,
  OrganizationType,
  UserRole,
} from './database.types';
