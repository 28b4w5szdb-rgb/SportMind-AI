/**
 * Supabase environment configuration.
 *
 * Uses EXPO_PUBLIC_* vars so values are available in Expo web and native builds.
 * When credentials are missing, placeholder values allow the app to boot safely;
 * services gate network calls with `isSupabaseConfigured`.
 */

export const SUPABASE_ENV_KEYS = {
  url: 'EXPO_PUBLIC_SUPABASE_URL',
  anonKey: 'EXPO_PUBLIC_SUPABASE_ANON_KEY',
} as const;

const rawUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ?? '';
const rawAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '';

export const isSupabaseConfigured = Boolean(rawUrl && rawAnonKey);

/** JWT-shaped placeholder — satisfies createClient when env is absent. */
const PLACEHOLDER_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDQ5NzIwMDAsImV4cCI6MTk2MDU0ODAwMH0.placeholder';

export const supabaseConfig = {
  /** URL passed to createClient (real or placeholder). */
  url: isSupabaseConfigured ? rawUrl : 'https://placeholder.supabase.co',
  /** Anon key passed to createClient (real or placeholder). */
  anonKey: isSupabaseConfigured ? rawAnonKey : PLACEHOLDER_ANON_KEY,
  /** True when both env vars are set. */
  isConfigured: isSupabaseConfigured,
  /** Raw env values (empty when unset). */
  configuredUrl: rawUrl,
  configuredAnonKey: rawAnonKey,
} as const;

if (!isSupabaseConfigured && __DEV__) {
  console.warn(
    `[SportMind] Supabase is not configured. Set ${SUPABASE_ENV_KEYS.url} and ${SUPABASE_ENV_KEYS.anonKey}. ` +
      'Auth and data hooks will remain idle until credentials are provided.'
  );
}
