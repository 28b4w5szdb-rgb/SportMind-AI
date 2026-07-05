/**
 * Development mode flags.
 *
 * Set in `.env`:
 *   EXPO_PUBLIC_DEV_BYPASS_AUTH=true
 *
 * When enabled, the app skips AuthGate redirects and loads a mock user/profile
 * without requiring Supabase credentials. Set to `false` (or remove) to restore
 * normal Supabase authentication.
 */

function parseBool(value: string | undefined): boolean {
  return value === 'true' || value === '1';
}

const rawBypass =
  process.env.EXPO_PUBLIC_DEV_BYPASS_AUTH ?? process.env.DEV_BYPASS_AUTH;

/**
 * True when development mock auth bypass is active.
 * Defaults to `true` in __DEV__ builds when the env var is unset.
 */
export const DEV_BYPASS_AUTH =
  rawBypass !== undefined ? parseBool(rawBypass) : __DEV__;

export const devConfig = {
  bypassAuth: DEV_BYPASS_AUTH,
} as const;
